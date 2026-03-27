/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewsDto } from './dtos/create.reviews.dtos';
import { Review } from './reviews.entity';

/**
 * Controller for handling review-related HTTP requests
 */
@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * Retrieves all reviews
   * @returns Promise resolving to array of Review entities
   */
  @Get('/api/reviews')
  public getAllReviews(): Promise<Review[]> {
    return this.reviewService.getAllReviews();
  }

  /**
   * Creates a new review
   * @param createReviewsDto - Object containing review details
   * @returns Promise resolving to created Review entity
   */
  @Post('/api/reviews')
  public createReview(
    @Body() createReviewsDto: CreateReviewsDto,
  ): Promise<Review> {
    return this.reviewService.createReviews(createReviewsDto);
  }
}
