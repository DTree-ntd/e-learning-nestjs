import { Injectable, Logger } from '@nestjs/common';
import { BaseError } from 'src/utilities/response/response-error';
import { apiSuccess } from 'src/utilities/response/response-success';
import { UserError } from 'src/utilities/response/user.response-error';
import { DataSource } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { RegistrationDto } from './dto/registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
  ) {}

  async registration(params: RegistrationDto) {
    const { email, username } = params;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (await this.userService.isExistUser(email)) {
        throw 4001;
      }
      if (await this.userService.isExistUser(username)) {
        throw 4002;
      }

      const newUser = await this.userService.createUser(params, queryRunner);

      await this.userService.sendUserVerification(newUser);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      const resData = {
        token: await this.userService.generateTokenUser(newUser),
        email,
        username,
      };

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

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw 4003;
      }

      const isPasswordMatching = await this.userService.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordMatching) {
        throw 4004;
      }

      const resData = {
        token: await this.userService.generateTokenUser(user),
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
}
