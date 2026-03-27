/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { UserEnum } from 'src/utils/enums';

/**
 * Custom decorator to set required roles for route access
 * Use with AuthRoleGard guard to restrict access based on user roles
 * @param roles - Array of UserEnum roles that are allowed to access the route
 * @returns SetMetadata decorator for roles
 */
export const Roles = (...roles: UserEnum[]) => {
  return SetMetadata('roles', roles);
};
