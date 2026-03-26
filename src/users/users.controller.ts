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



@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }
  @Get('/api/users')
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
    return this.userService.getCurrantUser(Number(payload.id));

  }
}
