import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    switch (exception.constructor) {}
  }
}
