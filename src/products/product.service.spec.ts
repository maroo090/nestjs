import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';
import { UsersService } from '../users/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './products.entity';
describe('product.service', () => {
  let prodcutService: ProductService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {provide:UsersService,useValue:{}},
        {provide:getRepositoryToken(Product),useValue:{}}
      ],
    }).compile();
    prodcutService = module.get<ProductService>(ProductService);
  });
  it('should product be defined', () => {
    expect(prodcutService).toBeDefined();
  });
});
