/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewsDto } from './dtos/create.reviews.dtos';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/api/reviews')
  public getAllReviews() {
    return this.reviewService.getAllReviews();
  }

  @Post('/api/reviews')
  public createReview(@Body() createReviewsDto: CreateReviewsDto) {
    return this.reviewService.createReviews(createReviewsDto);
  }
}
