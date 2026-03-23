/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    MinLength,
} from 'class-validator';

export class RegisterDto {
    @IsOptional()
    @IsString()
    @Length(2, 150)
    username: string;


    @IsEmail()
    @Length(2, 150)
    @IsNotEmpty()
    email: string


    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

}