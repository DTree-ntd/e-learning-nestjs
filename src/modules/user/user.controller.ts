import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utilities/guards/jwt-auth.guard';
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

  @Post('login')
  async login(@Body() params: LoginDto) {
    return this.userService.login(params);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('role')
  async setRole(@Body() params, @Request() req) {
    return this.userService.setRole(req.user);
  }
}
