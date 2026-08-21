import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object for updating user information
 * @property username - User's display name (optional, 2-150 chars)
 * @property password - User's password (optional, min 6 chars)
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 150)
  @IsOptional()
  @ApiPropertyOptional({ example: 'john_doe' })
  username?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsOptional()
  @ApiPropertyOptional({ example: 'password123', minLength: 6 })
  password?: string;
}
