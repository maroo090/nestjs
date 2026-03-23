import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  title: string;
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  description: string;
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  price: number;
}
