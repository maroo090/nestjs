import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ example: 'john_doe' })
  username!: string;

  @IsEmail()
  @Length(2, 150)
  @IsNotEmpty()
  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'password123', minLength: 6 })
  password!: string;
}
