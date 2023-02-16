import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor() {}
}
