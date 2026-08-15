import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';
import { UsersService } from '../users/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-products.dto.ts';
import { resolve } from 'path';
import { resourceLimits } from 'worker_threads';
describe('product.service', () => {
  let prodcutService: ProductService;
  let productsRepository: Repository<Product>;
  const REPOSITORY_TOKEN = getRepositoryToken(Product);
  const cretctProductDto: CreateProductDto = {
    title: 'test',
    description: 'test',
    price: 100,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: UsersService,
          useValue: {
            getCurrentUser: jest.fn((userId: number) =>
              Promise.resolve({ id: userId }),
            ),
          },
        },
        {
          provide: REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn((dto: CreateProductDto) => dto),
            save: jest.fn((dto: CreateProductDto) =>
              Promise.resolve({ ...dto, id: 1 }),
            ),
          },
        },
      ],
    }).compile();
    prodcutService = module.get<ProductService>(ProductService);
    productsRepository = module.get<Repository<Product>>(REPOSITORY_TOKEN);
  });
  it('should product be defined', () => {
    expect(prodcutService).toBeDefined();
  });

  it('should productReoposit be defined', () => {
    expect(productsRepository).toBeDefined();
  });
  describe('createProduct()', () => {
    it('should call create method of productRepository', async () => {
      await prodcutService.createProducts(cretctProductDto, 1);
      expect(productsRepository.create).toHaveBeenCalled();
      expect(productsRepository.create).toHaveBeenCalledTimes(1);
    });
    it('should call save method of productRepository', async () => {
      await prodcutService.createProducts(cretctProductDto, 1);
      expect(productsRepository.save).toHaveBeenCalled();
      expect(productsRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should create a new product', async () => {
      const result = await prodcutService.createProducts(cretctProductDto, 1);
      expect(result).toBeDefined();
      expect(result.title).toBe('test');
      expect(result.description).toBe('test');
      expect(result.price).toBe(100);
      expect(result.id).toBe(1);
    });
  });
});
