/**
 * User Error Response
 */

import { HttpException } from '@nestjs/common';

export const UserError = {
  EMAIL_EXIST: (
    msg = 'This email address has been registered. Please use a different one.',
  ) => new HttpException(msg, 4001),

  USERNAME_EXIST: (
    msg = 'This username has been registered. Please use a different one.',
  ) => new HttpException(msg, 4002),

  EMAIL_NOT_EXIST: (msg = 'This email does not exist. Please try again.') =>
    new HttpException(msg, 4003),

  PASSWORD_NOT_MATCH: (msg = 'This password is not match. Please try again.') =>
    new HttpException(msg, 4004),

  CAN_NOT_PROCESS: (msg = 'You can not process.') =>
    new HttpException(msg, 4005),
};
