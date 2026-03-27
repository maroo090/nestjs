/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWTPayloadType } from 'src/utils/types';

/**
 * Guard that validates JWT tokens for protected routes
 * Extracts Bearer token from Authorization header and verifies it
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Validates the JWT token from request headers
   * @param context - ExecutionContext from NestJS
   * @returns Promise resolving to boolean indicating if request is authorized
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type == 'Bearer' || token) {
      try {
        const payload: JWTPayloadType = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.configService.get<string>('JWT_SECRET') ?? '',
            ignoreExpiration: false,
          },
        );
        request['user'] = payload;
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      return false;
    }
    return true;
  }
}
