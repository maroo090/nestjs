import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class ResetPasswordDto {

@IsEmail()
@MaxLength(150)
@IsNotEmpty()
newPassword: string;


@IsNumber()
@IsNotEmpty()
@Min(0)
userId: number;

@IsNotEmpty()
@IsString()
@MinLength(10)
token: string;
  


}
