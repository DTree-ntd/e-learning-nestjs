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
};
