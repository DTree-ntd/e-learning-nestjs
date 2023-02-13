import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegistrationDto } from './dto/registration.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async registration(@Body() params: RegistrationDto) {
    Logger.log('========API /v1/user/registration==========');
    return this.userService.registration(params);
  }
}
