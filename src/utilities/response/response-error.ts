/**
 * User Error Response
 */

import { HttpException } from '@nestjs/common';

export const BaseError = {
  INFO_NOT_AVAILABLE: (
    msg = 'Information not available, please try again later.',
  ) => new HttpException(msg, 4099),
};
