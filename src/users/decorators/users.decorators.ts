/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/utils/types';

/**
 * Custom decorator to extract the authenticated user from request
 * Used to get the JWT payload (user id and userType) in route handlers
 * @returns The user payload from the request
 */
export const UserDecorator = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const payload = request.user;
    return payload;
  },
);
