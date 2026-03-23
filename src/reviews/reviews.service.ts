/* eslint-disable prettier/prettier */
import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './reviews.entity';
import { CreateReviewsDto } from './dtos/create.reviews.dtos';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}
  public async getAllReviews() {
    const reviews = await this.reviewRepo.find();
    console.log(reviews);
    return reviews;
  }
  public createReviews(createReviewsDto: CreateReviewsDto) {
    const review =this.reviewRepo.create(createReviewsDto);
    return this.reviewRepo.save(review);
  }
}
