import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  Matches,
  MaxDate,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  ERR_MSG_FORMAT_PASSWORD,
  ERR_MSG_MAX_LENGTH_PASSWORD,
  ERR_MSG_MIN_LENGTH_PASSWORD,
  REGEX_PASSWORD,
  requireFieldLength,
  requireFieldNotEmpty,
} from 'src/core/database/constant/class-validator.constant';

export class RegistrationDto {
  @ApiProperty({ example: 'duc.nguyentrung@eastgate-software.com' })
  @MaxLength(320, { message: requireFieldLength('email', '320') })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ducNguyen' })
  @MaxLength(20, { message: requireFieldLength('username', '20') })
  @IsNotEmpty({ message: requireFieldNotEmpty('username') })
  username: string;

  @ApiProperty({ example: 'Egs2023@' })
  @Matches(REGEX_PASSWORD, { message: ERR_MSG_FORMAT_PASSWORD })
  @MaxLength(16, { message: ERR_MSG_MAX_LENGTH_PASSWORD })
  @MinLength(8, { message: ERR_MSG_MIN_LENGTH_PASSWORD })
  @IsNotEmpty({ message: requireFieldNotEmpty('password') })
  password: string;

  @ApiProperty({ example: '1996-06-30' })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MaxDate(new Date())
  @IsNotEmpty()
  birthDate: Date;
}
