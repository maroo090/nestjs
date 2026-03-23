/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    MinLength,
} from 'class-validator';
export class LoginDto {
    @IsEmail()
    @Length(2, 150)
    @IsNotEmpty()
    email: string


    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    // @Exclude( )
    password: string

}