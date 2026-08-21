import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class ResetPasswordDto {

@IsEmail()
@MaxLength(150)
@IsNotEmpty()
@ApiProperty({ example: "john@example.com" })
newPassword: string;


@IsNumber()
@IsNotEmpty()
@Min(0)
@ApiProperty({ example: 1, minimum: 0 })
userId: number;

@IsNotEmpty()
@IsString()
@MinLength(10)
@ApiProperty({ example: "verification-token", minLength: 10 })
token: string;
  


}
