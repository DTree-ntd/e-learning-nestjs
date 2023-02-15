import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ORMModule } from './core/database/orm.module';
import { IORedisModule } from './core/redis/redis.module';
import { HttpErrorFilter } from './utilities/http-error.filter';
import { HttpTransformInterceptor } from './utilities/http-transform.interceptor';
import { MailModule } from './utilities/services/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    ORMModule,
    IORedisModule,
    MailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpTransformInterceptor,
    // },
  ],
})
export class AppModule {}
