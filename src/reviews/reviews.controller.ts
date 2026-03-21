/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { ReviewService } from './reviews.service';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }
  @Get('/api/reviews')

  public getAllReviews() {
    return this.reviewService.getAllReviews();
  }

}
