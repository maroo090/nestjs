import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';
import { UsersService } from '../users/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Repository } from 'typeorm';
import { CreateProductsDto } from './dtos/create-products.dto';
import { NotFoundException } from '@nestjs/common';

type ProductTestType = { id: number; title: string; price: number };
type Options = {
  where?: { title?: string; price?: number; maxprice?: number };
};
type GetProductByIdParams = {
  where?: { id: number };
};

describe('product.service', () => {
  let prodcutService: ProductService;
  let productsRepository: Repository<Product>;
  const REPOSITORY_TOKEN = getRepositoryToken(Product);
  const createProductDto: CreateProductsDto = {
    title: 'test',
    description: 'test',
    price: 100,
  };
  let productList: ProductTestType[];

  beforeEach(async () => {
    productList = [
      {
        id: 1,
        title: 'test',
        price: 100,
      },
      {
        id: 2,
        title: 'test2',
        price: 200,
      },
    ];

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
            create: jest.fn((dto: CreateProductsDto) => dto),
            save: jest.fn((dto: CreateProductsDto) =>
              Promise.resolve({ ...dto, id: 1 }),
            ),
            find: jest.fn((options?: Options) => {
              if (options?.where?.title) {
                return Promise.resolve([productList[0], productList[1]]);
              }
              return Promise.resolve(productList);
            }),
            findOne: jest.fn((param: GetProductByIdParams) =>
              Promise.resolve(
                productList.find((p) => p.id === param?.where?.id),
              ),
            ),
            remove: jest.fn((product: Product) => {
              const index = productList.findIndex((p) => p.id == product.id);
              if (index !== -1) {
                return Promise.resolve(productList.splice(index, 1)[0]);
              }
            }),
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
      await prodcutService.createProducts(createProductDto, 1);
      expect(productsRepository.create).toHaveBeenCalled();
      expect(productsRepository.create).toHaveBeenCalledTimes(1);
    });
    it('should call save method of productRepository', async () => {
      await prodcutService.createProducts(createProductDto, 1);
      expect(productsRepository.save).toHaveBeenCalled();
      expect(productsRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should create a new product', async () => {
      const result = await prodcutService.createProducts(createProductDto, 1);
      expect(result).toBeDefined();
      expect(result.title).toBe('test');
      expect(result.description).toBe('test');
      expect(result.price).toBe(100);
      expect(result.id).toBe(1);
    });
  });

  describe('getAllProducts', () => {
    it('should find all product from the product Repository', async () => {
      const r = await prodcutService.getAllProducts();
      expect(productsRepository.find).toHaveBeenCalled();
      expect(productsRepository.find).toHaveBeenCalledTimes(1);
      expect(r).toBe(productList);
    });
    it('should return two products if the arguments passed', async () => {
      const result = await prodcutService.getAllProducts('test');
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
    });
  });

  describe('getProductById()', () => {
    it("should call 'findOne' method in productRepository", async () => {
      await prodcutService.getProductById(1);
      expect(productsRepository.findOne).toHaveBeenCalled();
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return single product if we passed the id', async () => {
      const result = await prodcutService.getProductById(1);
      expect(result).toMatchObject(productList[0]);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });
    it('should throw an error if the product is not found', async () => {
      await expect(prodcutService.getProductById(100)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('update product', () => {
    const title = 'product updated';
    it('should  call (save ) moetod in ths product repository and the update product', async () => {
      const r = await prodcutService.updateProductById({ title }, 1);
      expect(productsRepository.save).toHaveBeenCalled();
      expect(productsRepository.save).toHaveBeenCalledTimes(1);
      expect(r.title).toBe(title);
    });
    it('should throw an error if the product is not found', async () => {
      await expect(
        prodcutService.updateProductById({ title }, 100),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('delete product', () => {
    it('should call (remove) method in product repository and the delete product', async () => {
      await prodcutService.deleteProductById(1);
      expect(productsRepository.remove).toHaveBeenCalled();
      expect(productsRepository.remove).toHaveBeenCalledTimes(1);
    });
    it('it should remove product return success mesagee', async () => {
      const result = await prodcutService.deleteProductById(1);
      expect(result).toMatchObject({
        id: 1,
        title: 'test',
        price: 100,
      });
    });
    it('should throw an error if the product is not found', async () => {
      await expect(prodcutService.deleteProductById(100)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
