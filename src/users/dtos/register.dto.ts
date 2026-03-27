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

/**
 * Data Transfer Object for user registration
 * @property username - User's display name (optional, 2-150 chars)
 * @property email - User's email address (required, valid format)
 * @property password - User's password (required, min 6 chars)
 */
export class RegisterDto {
  @IsOptional()
  @IsString()
  @Length(2, 150)
  username: string;

  @IsEmail()
  @Length(2, 150)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
