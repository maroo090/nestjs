/**
 * Service for managing review operations
 */
import { Injectable } from '@nestjs/common';
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
  /**
   * Retrieves all reviews from the database
   * @returns Promise resolving to an array of Review entities
   */
  public async getAllReviews(): Promise<Review[]> {
    const reviews = await this.reviewRepo.find();
    console.log(reviews);
    return reviews;
  }
  /**
   * Creates a new review
   * @param createReviewsDto - Object containing review details
   * @returns Promise resolving to the created Review entity
   */
  public createReviews(createReviewsDto: CreateReviewsDto): Promise<Review> {
    const review = this.reviewRepo.create(createReviewsDto);
    return this.reviewRepo.save(review);
  }
}
