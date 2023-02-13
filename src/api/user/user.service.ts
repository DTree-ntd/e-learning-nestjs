import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { Repository } from 'typeorm';
import { RegistrationDto } from './dto/registration.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async registration(params: RegistrationDto) {
    const { email, username, password, birthDate } = params;
    try {
      if (await this.isExistUser(email, username)) {
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  async isExistUser(email: string, username: string) {
    const existUser = await this.userRepo.find({
      where: [{ email }, { username }],
    });

    if (existUser) {
      return true;
    }

    return false;
  }
}
