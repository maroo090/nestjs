/* eslint-disable prettier/prettier */
import { IsInt, IsString, Max, Min } from "class-validator";

export class CreateReviewsDto {
    @IsString()
    comment: string;
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
    @IsInt()
    productId: number;
    @IsInt()
    userId: number;

}