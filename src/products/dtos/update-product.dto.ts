/* eslint-disable prettier/prettier */
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Length,
  IsOptional,
} from 'class-validator';

/**
 * Data Transfer Object for updating a product
 * @property title - Product name (optional, 3-150 chars)
 * @property description - Product description (optional, 3-150 chars)
 * @property price - Product price (optional, must be >= 0)
 */
export class UpdateProduct {
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  @IsOptional()
  title?: string;

  @IsString()
  @Length(3, 150)
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsOptional()
  price?: number;
}
