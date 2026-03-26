/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './user.service';
import { RegisterDto } from './dtos/register.dtos';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guard/auth.guard';
import {
  type JWTPayloadType
} from 'src/utils/types';
import { UserDecorator } from './decorators/users.decorators';
import { Roles } from './decorators/user.role.decorators';
import { UserEnum } from '../utils/enums';
import { AuthRoleGard } from './guard/auth-role.gard';



@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }
  @Get()
  @Roles(UserEnum.ADMIN)
  @UseGuards(AuthRoleGard)
  public getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Post('auth/register')
  public register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }
  @Post('auth/login')
  public login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }
  @Get('auth/profile')
  @UseGuards(AuthGuard)
  public getCurrentUser(@UserDecorator() payload: JWTPayloadType) {
    console.log("payload is", payload)
    return this.userService.getCurrentUser(Number(payload.id));

  }
}
