import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
/**
 * Data Transfer Object for user login
 * @property email - User's email address (required, valid format)
 * @property password - User's password (required, min 6 chars)
 */
export class LoginDto {
  @IsEmail()
  @Length(2, 150)
  @IsNotEmpty()
  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'password123', minLength: 6 })
  // @Exclude( )
  password!: string;
}
