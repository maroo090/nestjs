/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserEnum } from 'src/utils/enums';
import { UsersService } from '../user.service';
import { JWTPayloadType } from 'src/utils/types';

/**
 * Guard that validates JWT tokens and checks user roles for protected routes
 * Extracts Bearer token from Authorization header, verifies it, and validates user role
 */
@Injectable()
export class AuthRoleGard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}
  /**
   * Validates JWT token and checks if user has required role
   * @param context - ExecutionContext from NestJS
   * @returns Promise resolving to boolean indicating if request is authorized
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserEnum[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return false;
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type == 'Bearer' && token) {
      try {
        const payload: JWTPayloadType = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.configService.get<string>('JWT_SECRET') ?? '',
            ignoreExpiration: false,
          },
        );
        const user = await this.userService.getCurrentUser(payload.id);
        if (roles.includes(user.userType as UserEnum)) {
          request['user'] = payload;
          return true;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      return false;
    }
    return false;
  }
}
