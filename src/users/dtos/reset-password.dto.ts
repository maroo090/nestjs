import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

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
@Minlength(10)
token: string;
  


}
