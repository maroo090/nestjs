import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a product
 * @property title - Product name (required, 3-150 chars)
 * @property description - Product description (required, 3-150 chars)
 * @property price - Product price (required, must be >= 0)
 */
export class CreateProductsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({ example: 'book' })
  title!: string;
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({ example: 'A hardcover novel' })
  description!: string;
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ example: 10 })
  price!: number;
}
