/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReviewController } from './reviews.controller';
import { ReviewService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reviews.entity';

/**
 * Reviews module that handles product reviews
 * Provides CRUD operations for reviews and review-product relationships
 */
@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([Review])],
})
export class ReviewsModule {}
