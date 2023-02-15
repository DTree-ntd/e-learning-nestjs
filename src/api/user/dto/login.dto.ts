import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MaxLength,
  IsEmail,
  Matches,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import {
  requireFieldLength,
  REGEX_PASSWORD,
  ERR_MSG_FORMAT_PASSWORD,
  ERR_MSG_MAX_LENGTH_PASSWORD,
  ERR_MSG_MIN_LENGTH_PASSWORD,
  requireFieldNotEmpty,
  ERR_MSG_MAX_LENGTH_ID,
} from 'src/utilities/constants/class-validator.constant';

export class LoginDto {
  @ApiProperty({ example: 'duc.nguyentrung@eastgate-software.com' })
  @MaxLength(320, { message: requireFieldLength('email', '320') })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Egs2023@' })
  @Matches(REGEX_PASSWORD, { message: ERR_MSG_FORMAT_PASSWORD })
  @MaxLength(16, { message: ERR_MSG_MAX_LENGTH_PASSWORD })
  @MinLength(8, { message: ERR_MSG_MIN_LENGTH_PASSWORD })
  @IsNotEmpty({ message: requireFieldNotEmpty('password') })
  password: string;

  @ApiPropertyOptional({ example: '51b1be47-87f6-4ac4-9db7-ea9763bc3612' })
  @MaxLength(36, { message: ERR_MSG_MAX_LENGTH_ID })
  @IsOptional()
  invitationId: string;
}
