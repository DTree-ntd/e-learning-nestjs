import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { BaseError } from 'src/utilities/response/response-error';
import { apiSuccess } from 'src/utilities/response/response-success';
import { UserError } from 'src/utilities/response/user.response-error';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { RegistrationDto } from './dto/registration.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
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

      await queryRunner.commitTransaction();
      await queryRunner.release();

      await this.redis.setex(
        `${newUser.id}_lastest_token_web`,
        parseInt(process.env.JWT_TTL),
        resData.token,
      );

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
          Logger.error(error);
          throw BaseError.INFO_NOT_AVAILABLE();
      }
    }
  }

  async createUser(params: RegistrationDto, queryRunner: QueryRunner) {
    const hashPassword = await this.hashPassword(params.password);

    const user = await this.userRepository.create({
      email: params.email,
      username: params.username,
      password: hashPassword,
      birthDate: params.birthDate,
    });

    await queryRunner.manager.save(UserEntity, user);

    return user;
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

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }

  comparePassword(password: string, passwordDb: string): Promise<boolean> {
    return bcrypt.compare(password, passwordDb);
  }

  async generateTokenUser(user) {
    const payload = {
      userId: user.id,
      verifyEmail: user.verifyEmail,
      time: Date.now(),
    };

    return this.jwtService.sign(payload);
  }
}
