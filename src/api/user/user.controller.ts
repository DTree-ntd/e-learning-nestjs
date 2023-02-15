import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({ path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async registration(@Body() params: RegistrationDto) {
    return this.userService.registration(params);
  }

  @Post('verify-email')
  async verifyEmail() {
    return;
  }

  @Post('login')
  async login(@Body() params: LoginDto) {
    return this.userService.login(params);
  }
}
