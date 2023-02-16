import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ROLE } from 'src/core/database/constant/user.constant';

export class SetRoleDto {
  @ApiProperty({ example: 'STUDENT' })
  @IsEnum(ROLE)
  role: ROLE;
}
