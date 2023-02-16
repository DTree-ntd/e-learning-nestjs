import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { MailService } from 'src/utilities/services/mail/mail.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }

  comparePassword(password: string, passwordDb: string): Promise<boolean> {
    return bcrypt.compare(password, passwordDb);
  }
}
