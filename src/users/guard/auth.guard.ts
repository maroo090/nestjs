/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JWTPayloadType } from "src/utils/types";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }
    async canActivate(context: ExecutionContext) {

        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        if (type == 'Bearer' || token) {
            try {
                const payload: JWTPayloadType= await this.jwtService.verifyAsync(token, {
                    secret: this.configService.get<string>('JWT_SECRET') ?? '',
                    ignoreExpiration: false
                })
                request['user'] = payload
            } catch (error) {
                console.log(error)
                return false 
            }
        } else { return false }
        return true
    }

}
