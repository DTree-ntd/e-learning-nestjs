import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { ROLE } from 'src/core/database/constant/user.constant';
import { JwtAuthGuard } from './jwt-auth.guard';

const RoleGuard = (role: ROLE): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      return user?.role.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
