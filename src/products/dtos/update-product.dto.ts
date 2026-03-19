/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsNotEmpty, Min, Length, IsOptional } from 'class-validator';

export class UpdateProduct {
    @IsString()
    @IsNotEmpty()
    @Length(3, 150)
    @IsOptional()
    title?: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @IsOptional()
    price?: number;
}
