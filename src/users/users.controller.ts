/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guard/auth.guard';
import {
  type JWTPayloadType
} from 'src/utils/types';
import { UserDecorator } from './decorators/users.decorators';
import { Roles } from './decorators/user.role.decorators';
import { UserEnum } from '../utils/enums';
import { AuthRoleGard } from './guard/auth-role.gard';
import { UpdateUserDto } from './dtos/update-user.dto';



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

  @Put()
  @UseGuards(AuthRoleGard)
  @Roles(UserEnum.ADMIN, UserEnum.USER)
  public updateUser(@UserDecorator() payload: JWTPayloadType, @Body() body: UpdateUserDto) {
    console.log(body)
    console.log("dsadas", payload)
    return this.userService.updateUser(Number(payload.id), body);
  }

  @Delete(':id')
  @UseGuards(AuthRoleGard)
  @Roles(UserEnum.ADMIN, UserEnum.USER)
  public deleteUser(@Param('id', ParseIntPipe) id: number, @UserDecorator() payload: JWTPayloadType) {
    return this.userService.deleteUser(id, payload);
  }
}
