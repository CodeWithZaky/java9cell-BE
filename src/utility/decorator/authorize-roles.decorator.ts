import { SetMetadata } from '@nestjs/common';

export const AuthorizeRoles = (...roles: string[]) => {
  return SetMetadata('allowedRoles', roles);
};
