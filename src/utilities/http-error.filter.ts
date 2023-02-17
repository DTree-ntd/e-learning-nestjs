import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import {
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
} from 'typeorm';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    let status: number;
    let resultCode: number;
    let errorMessage: string;

    switch (exception.constructor) {
      case HttpException:
        status = HttpStatus.BAD_REQUEST;
        resultCode = (exception as HttpException).getStatus();
        errorMessage = exception.message;
        break;
      case BadRequestException:
        status = HttpStatus.BAD_REQUEST;
        resultCode = exception.getStatus();
        errorMessage = exception.message;
        break;
      case ForbiddenException:
        status = HttpStatus.BAD_REQUEST;
        resultCode = exception.getStatus();
        errorMessage = exception.message;
        break;
      case QueryFailedError: // this is a TypeOrm error
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        resultCode = HttpStatus.UNPROCESSABLE_ENTITY;
        errorMessage = (exception as QueryFailedError).message;
        break;
      case EntityNotFoundError: // this is another TypeOrm error
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        resultCode = HttpStatus.UNPROCESSABLE_ENTITY;
        errorMessage = (exception as EntityNotFoundError).message;
        break;
      case CannotCreateEntityIdMapError: // and another
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        resultCode = HttpStatus.UNPROCESSABLE_ENTITY;
        errorMessage = (exception as CannotCreateEntityIdMapError).message;
        break;
      case UnauthorizedException:
        status = HttpStatus.UNAUTHORIZED;
        resultCode = HttpStatus.UNAUTHORIZED;
        errorMessage = exception.message;
        break;
      default:
        status =
          exception?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        resultCode =
          exception?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const errorResponse = {
      resultCode: resultCode,
      errorMessage: errorMessage || null,
      data: null,
    };

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}
