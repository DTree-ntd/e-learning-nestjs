import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ROLE } from 'src/core/database/constant/user.constant';
import { JwtAuthGuard } from 'src/utilities/guards/jwt-auth.guard';
import RoleGuard from 'src/utilities/guards/role.guard';
import { SetRoleDto } from './dto/set-role.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('role')
  async setRole(@Body() params: SetRoleDto, @Request() req) {
    return this.userService.setRole(params, req.user.userId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('user/image')
  async updateImage(@UploadedFile() file, @Request() req) {
    return this.userService.updateUserImage(file, req.user.userId);
  }

  @UseGuards(RoleGuard(ROLE.ADMIN))
  @ApiBearerAuth()
  @Get('test')
  async getTest() {
    return 'hi';
  }
}
