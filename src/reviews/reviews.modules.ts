import { Module } from '@nestjs/common';
import { ReviewController } from './reviews.controller';

@Module({
  controllers: [ReviewController],
})
export class ReviewsModule {}
