/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, UseGuards, Param, Put, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewsDto } from './dtos/create.reviews.dtos';
import { Review } from './reviews.entity';
import { Roles } from 'src/users/decorators/user.role.decorators';
import { UserEnum } from 'src/utils/enums';
import { CurrentUserDecorator } from 'src/users/decorators/users.decorators';
import { AuthRoleGard } from 'src/users/guard/auth-role.gard';
import { type JWTPayloadType } from 'src/utils/types';
import { UpdateReviewsDto } from './dtos/update.reviews.dtos';

/**
 * Controller for handling review-related HTTP requests
 */
@Controller('/api/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  /**
   * Retrieves all reviews
   * @returns Promise resolving to array of Review entities
   */
  @Get()
  public getAllReviews(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('reviewPerPage', ParseIntPipe) reviewPerPage: number,
  ): Promise<Review[]> {
    return this.reviewService.getAllReviews(pageNumber, reviewPerPage);
  }

  /**
   * Creates a new review
   * @param createReviewsDto - Object containing review details
   * @returns Promise resolving to created Review entity
   */
  @Post(':productId')
  @UseGuards(AuthRoleGard)
  @Roles(UserEnum.ADMIN, UserEnum.USER)
  public createReview(
    @Body() createReviewsDto: CreateReviewsDto,
    @Param('productId') productId: number,
    @CurrentUserDecorator() payload: JWTPayloadType,
  ): Promise<Review> {
    return this.reviewService.createReviews(createReviewsDto, payload.id, productId);
  }
  @Put(':reviewId')
  @UseGuards(AuthRoleGard)
  @Roles(UserEnum.ADMIN, UserEnum.USER)
  public updateReview(
    @Body() body: UpdateReviewsDto,
    @Param('reviewId') reviewId: number,
    @CurrentUserDecorator() payload: JWTPayloadType,

  ): Promise<Review> {
    return this.reviewService.updateReview(body, reviewId, payload.id);
  }

  @Delete(':reviewId')
  @UseGuards(AuthRoleGard)
  @Roles(UserEnum.ADMIN, UserEnum.USER)
  public deleteReview(
    @Param('reviewId') reviewId: number,
    @CurrentUserDecorator() payload: JWTPayloadType,
  ): Promise<string | { message: string; review: Review; }> {
    return this.reviewService.deleteReview(reviewId, payload.id);
  }

  @Get(':reviewId')
  public getReviewById(reviewId: number) {
    return this.reviewService.getREviewById(reviewId);
  }
}
