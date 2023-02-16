import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any, done) {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      done(new UnauthorizedException());
    }

    const payloadKey = payload['userId'];
    const keyRedis = payloadKey + token;
    const inactiveToken = await this.redis.get(keyRedis);

    if (inactiveToken) {
      done(new UnauthorizedException());
    }

    const user = await this.userService.getUserById(payload.userId);

    if (!user) {
      done(new UnauthorizedException());
    }

    return done(null, {
      userId: payload.userId,
      verifyEmail: user.verifyEmail,
      role: user.role,
    });
  }
}
