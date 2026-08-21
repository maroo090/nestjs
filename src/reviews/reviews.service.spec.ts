import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './reviews.service';
import { ProductService } from '../products/products.service';
import { UsersService } from '../users/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from './reviews.entity';

describe('reviews.service', () => {
  let reviewService: ReviewService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: ProductService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: getRepositoryToken(Review), useValue: {} },
      ],
    }).compile();
    reviewService = module.get<ReviewService>(ReviewService);
  });
  it('should reviews be defined', () => {
    expect(reviewService).toBeDefined();
  });
});
