import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const results = request?.currentUser?.roles
        .map((role: string) => allowedRoles.includes(role))
        .find((val: boolean) => val === true);
      if (results) return true;
      throw new UnauthorizedException('Sorry you are not authorized');
    }
  }
  const guard = mixin(RolesGuardMixin);
  return guard;
};
