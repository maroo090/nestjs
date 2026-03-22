/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { ReviewController } from './reviews.controller';
import { ReviewService } from './reviews.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './reviews.entity';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Review])]
})
export class ReviewsModule { }
