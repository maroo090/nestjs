/* eslint-disable prettier/prettier */
/**
 * Service for managing review operations
 */
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './reviews.entity';
import { CreateReviewsDto } from './dtos/create.reviews.dtos';
import { ProductService } from 'src/products/products.service';
import { UsersService } from 'src/users/user.service';
import { UpdateReviewsDto } from './dtos/update.reviews.dtos';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    private readonly productService: ProductService,
    private readonly usersService: UsersService,
  ) { }
  /**
   * Retrieves all reviews from the database
   * @returns Promise resolving to an array of Review entities
   */
  public async getAllReviews(pageNumber: number, reviewPerPage: number): Promise<Review[]> {
    const reviews = await this.reviewRepo.find({
      skip: reviewPerPage * (pageNumber - 1),
      take: reviewPerPage,
      order: {
        createdAt: 'ASC'
      }
    });
    return reviews;
  }


  public async getREviewById(reviewId: number): Promise<Review> {
    const review = await this.reviewRepo.findOneBy({ id: reviewId })
    if (!review)
      throw new NotFoundException("Review not found");
    return review;
  }
  /**
   * Creates a new review
   * @param createReviewsDto - Object containing review details
   * @returns Promise resolving to the created Review entity
   */
  public async createReviews(
    createReviewsDto: CreateReviewsDto,
    userId: number,
    productId: number,
  ): Promise<Review> {
    const user = await this.usersService.getCurrentUser(userId);
    const product = await this.productService.getProductById(productId);
    const review = this.reviewRepo.create({
      ...createReviewsDto,
      user,
      product,
    });
    return this.reviewRepo.save(review);
  }

  public async updateReview(updateReview: UpdateReviewsDto, reviewId: number, userId: number): Promise<Review> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }
    if (review?.user.id !== userId)
      throw new ForbiddenException('You are not authorized to update this review')
    review.comment = updateReview.comment ?? review.comment;
    review.rating = updateReview.rating ?? review.rating;
    return await this.reviewRepo.save(review);
  }

  public async deleteReview(reviewId: number, userId: number): Promise<{ message: string; review: Review }> {
    const review = await this.reviewRepo.findOneBy({ id: reviewId });
    if (!review)
      throw new NotFoundException("Review not found");
    if (review.user.id !== userId)
      throw new ForbiddenException("You are not authorized to delete this review");
    await this.reviewRepo.remove(review)
    return {
      message: "Review deleted successfully",
      review: review
    };

  }

}
