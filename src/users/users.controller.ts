/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { UsersService } from './user.service';
import { RegisterDto } from './dtos/register.dtos';
import { LoginDto } from './dtos/login.dto';

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
  public getCurrentUser(@Headers() headers) {
    return this.userService.getCurrantUser(headers.authorization);
   
  }
}
