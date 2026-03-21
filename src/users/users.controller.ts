/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) { }
  @Get('/api/products')
  public getAllProducts() {
    return this.userService.getAllUsers();
  }
}
