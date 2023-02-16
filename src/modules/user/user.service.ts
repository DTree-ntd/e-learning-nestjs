import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE } from 'src/core/database/constant/user.constant';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { BaseError } from 'src/utilities/response/response-error';
import { apiSuccess } from 'src/utilities/response/response-success';
import { UserError } from 'src/utilities/response/user.response-error';
import { MailService } from 'src/utilities/services/mail/mail.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { SetRoleDto } from './dto/set-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registration(params: RegistrationDto) {
    const { email, username } = params;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (await this.isExistUser(email)) {
        throw 4001;
      }
      if (await this.isExistUser(username)) {
        throw 4002;
      }

      const newUser = await this.createUser(params, queryRunner);

      const resData = {
        token: await this.generateTokenUser(newUser),
        email,
        username,
      };

      await this.sendUserVerification(newUser);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return apiSuccess(resData);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      switch (error) {
        case 4001:
          throw UserError.EMAIL_EXIST();
        case 4002:
          throw UserError.USERNAME_EXIST();
        default:
          Logger.error('Function registration', error);
          throw BaseError.INFO_NOT_AVAILABLE();
      }
    }
  }

  async login(params: LoginDto) {
    try {
      const { email, password } = params;

      const user = await this.getUserByEmail(email);

      if (!user) {
        throw 4003;
      }

      const isPasswordMatching = await this.authService.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordMatching) {
        throw 4004;
      }

      const resData = {
        token: await this.generateTokenUser(user),
        email,
        username: user.username,
      };

      return apiSuccess(resData);
    } catch (error) {
      switch (error) {
        case 4003:
          throw UserError.EMAIL_NOT_EXIST();
        case 4004:
          throw UserError.PASSWORD_NOT_MATCH();
        default:
          Logger.error('Function login', error);
          throw BaseError.INFO_NOT_AVAILABLE();
      }
    }
  }

  async createUser(params: RegistrationDto, queryRunner: QueryRunner) {
    const hashPassword = await this.authService.hashPassword(params.password);

    const user = await this.userRepository.create({
      email: params.email,
      username: params.username,
      password: hashPassword,
      birthDate: params.birthDate,
    });

    await queryRunner.manager.save(UserEntity, user);

    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async isExistUser(keyword: string): Promise<boolean> {
    const existUser = await this.userRepository.findOne({
      where: [{ email: `${keyword}` }, { username: `${keyword}` }],
    });

    if (existUser) {
      return true;
    }

    return false;
  }

  async generateTokenUser(user: UserEntity): Promise<string> {
    const payload = {
      userId: user.id,
      verifyEmail: user.verifyEmail,
      role: user.role,
      time: Date.now(),
    };

    return this.jwtService.sign(payload);
  }

  async sendUserVerification(user: UserEntity) {
    try {
      await this.mailService.sendVerification(user.username, user.email);
      return true;
    } catch (error) {
      Logger.error('Function sendUserVerification', error);
      throw BaseError.INFO_NOT_AVAILABLE();
    }
  }

  async setRole(params: SetRoleDto, userId: string) {
    try {
      const { role } = params;

      const currentRole = await this.getUserRole(userId);

      if (currentRole !== ROLE.NONE) {
        throw 4005;
      }

      await this.userRepository.update({ id: userId }, { role });

      return apiSuccess(null);
    } catch (error) {
      if (error === 4005) throw UserError.CAN_NOT_PROCESS();
      Logger.error('Function setRole', error);
      throw BaseError.INFO_NOT_AVAILABLE();
    }
  }

  async getUserRole(userId: string) {
    const user = await this.getUserById(userId);

    return user.role;
  }
}
