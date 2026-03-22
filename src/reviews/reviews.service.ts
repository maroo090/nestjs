/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/user.service';
import { Repository } from 'typeorm';
import { Review } from './reviews.entity';
import { CreateReviewsDto } from './dtos/create.reviews.dtos';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
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
