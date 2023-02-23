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
import { QueryRunner, Repository } from 'typeorm';
import { SetRoleDto } from './dto/set-role.dto';
import * as bcrypt from 'bcryptjs';
import { RegistrationDto } from '../auth/dto/registration.dto';
import { S3Service } from 'src/utilities/services/aws/s3.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly s3Service: S3Service,
  ) {}

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

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }

  comparePassword(password: string, passwordDb: string): Promise<boolean> {
    return bcrypt.compare(password, passwordDb);
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

  async generateTokenUser(user: UserEntity) {
    const payload = {
      userId: user.id,
      verifyEmail: user.verifyEmail,
      role: user.role,
      time: Date.now(),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_EXPIRATION_TIME}s`,
    });

    await this.userRepository.update({ id: user.id }, { refreshToken });

    return { accessToken, refreshToken };
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id: userId } });
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

  async updateUserImage(file, userId: string) {
    try {
      const key = await this.s3Service.upload(file, userId);

      await this.userRepository.update({ id: userId }, { imagePath: key });

      return this.s3Service.getLinkMediaKey(key);
    } catch (error) {
      Logger.error('Function setRole', error);
      throw BaseError.INFO_NOT_AVAILABLE();
    }
  }
}
