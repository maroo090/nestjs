import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UsersService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { type JWTPayloadType } from '../utils/types';
import { CurrentUserDecorator } from './decorators/users.decorators';
import { Roles } from './decorators/user.role.decorators';
import { UserEnum } from '../utils/enums';
import { AuthRoleGard } from './guard/auth-role.gard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ApiBody, ApiConsumes, ApiSecurity } from '@nestjs/swagger';
import { ImageUploadDto } from './dtos/image-upload.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
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
  public getCurrentUser(@CurrentUserDecorator() payload: JWTPayloadType) {
    console.log('payload is', payload);
    return this.userService.getCurrentUser(Number(payload.id));
  }

  @Put()
  @UseGuards(AuthRoleGard)
  @Roles(UserEnum.ADMIN, UserEnum.USER)
  public updateUser(
    @CurrentUserDecorator() payload: JWTPayloadType,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(Number(payload.id), body);
  }
  //** */ Delete profile image
  @Delete('remove-image')
  @UseGuards(AuthGuard)
  public removeProfileImage(@CurrentUserDecorator() payload: JWTPayloadType) {
    return this.userService.removeProfileImage(payload.id);
  }
  @Delete(':id')
  @UseGuards(AuthRoleGard)
  @Roles(UserEnum.ADMIN, UserEnum.USER)
  public deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserDecorator() payload: JWTPayloadType,
  ) {
    return this.userService.deleteUser(id, payload);
  }

  //upload profile img

  @Post('upload-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('user-image'))
  @ApiSecurity('bearer')
  @ApiConsumes('multipart/form-data')
  @ApiBody({type:ImageUploadDto,description:'upload profile image'}) 
  public uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUserDecorator() payload: JWTPayloadType,
  ) {
    if (!file) throw new BadRequestException('no image provided');
    return this.userService.setProfileImage(payload.id, file.filename);
  }

  @Get('images/:image')
  @UseGuards(AuthGuard)
  public getProfileImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: './images/uploads/users' });
  }

  @Get('verify-email/:id/:verificationToken')
  public verifyEmail(
    @Param('id', ParseIntPipe) id: number,
    @Param('verificationToken') verificationToken: string,
  ) {
    return this.userService.verifyEmail(id, verificationToken);
  }


  // Post /apiusers/forgot-password
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public sendResetPassword(@Body() body: ForgotPasswordDto) {
    return this.userService.sendResetPassword(body.email);
  }
  
  //GET /api/users/reset-password/:id/:token
  @Get('reset-password/:id/:token')
  public resetPasswordVerify( @Param("id",ParseIntPipe) id:number ,@Param("token") token:string){
    return this.userService.resetPasswordVerify(id, token);
  }

  //POST /api/users/reset-password
  @Post('reset-password') 
  public resetPasword(@Body() body:ResetPasswordDto) {
    return this.userService.resetPasword(body);
  }
}  
