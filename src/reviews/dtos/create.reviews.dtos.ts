/* eslint-disable prettier/prettier */
import { IsInt, IsString, Max, Min } from 'class-validator';

/**
 * Data Transfer Object for creating a review
 * @property comment - Review text (required)
 * @property rating - Rating value (required, 1-5)
 * @property productId - Associated product ID (required)
 * @property userId - User who created the review (required)
 */
export class CreateReviewsDto {
  @IsString()
  comment!: string;
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

}
