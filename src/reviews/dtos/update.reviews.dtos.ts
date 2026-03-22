/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateReviewsDto {
    @IsString()
    @IsOptional()
    comment?: string;
    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    rating?: number;


}