import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { JWTPayloadType } from 'src/utils/types';
import { CreateProductsDto } from './dtos/create-products.dto';
import { resolve } from 'path';
import { asyncScheduler } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { UpdateProduct } from './dtos/update-product.dto';
const createProductDto: CreateProductsDto = {
  title: 'book',
  description: 'A hardcover novel',
  price: 10,
};
const currentUser: JWTPayloadType = { id: 1, userType: 'admin' };
type ProductTestType = { id: number; title: string; price: number };
describe('product controller', () => {
  let productController: ProductsController;
  let productService: ProductService;
  let products: ProductTestType[];
  beforeEach(async () => {
    products = [
      { id: 1, title: 'book', price: 10 },
      { id: 2, title: 'laptop', price: 200 },
    ];
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ConfigService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: Reflector, useValue: {} },
        {
          provide: ProductService,
          useValue: {
            createProducts: jest.fn((body: CreateProductsDto, id: number) => {
              return Promise.resolve({ ...body, id: 1 });
            }),
            getAllProducts: jest.fn(
              (title?: string, minPrice?: string, maxPrice?: string) => {
                if (title)
                  return Promise.resolve(
                    products.filter((product) => product.title === title),
                  );
                if (minPrice)
                  return Promise.resolve(
                    products.filter((product) => product.price >= minPrice),
                  );
                if (maxPrice)
                  return Promise.resolve(
                    products.filter((product) => product.price <= maxPrice),
                  );
                return Promise.resolve(products);
              },
            ),
            getProductById: jest.fn(async (id: number) => {
              const product = products.find((p) => p.id === id);
              if (!product) throw new NotFoundException('product not found');
              return Promise.resolve(product);
            }),
            updateProductById: jest.fn((dto: UpdateProduct, id: number) => {
              return Promise.resolve({ ...dto, id });
            }),
            deleteProductById: jest.fn(async (id: number) => {
              const product = products.find((p) => p.id === id);
              if (!product) throw new NotFoundException('product not found');
              const result = products.filter((p) => p.id !== id);
              return Promise.resolve(product);
            }),
          },
        },
      ],
    }).compile();
    productController = module.get<ProductsController>(ProductsController);
    productService = module.get<ProductService>(ProductService);
  });
  it('should productController defined', () => {
    expect(productController).toBeDefined();
  });
  it('should productServicebe defined', () => {
    expect(productService).toBeDefined();
  });
  describe('create nre product', () => {
    it('it should call create product method ', async () => {
      await productController.create(createProductDto, currentUser);
      expect(productService.createProducts).toHaveBeenCalled();
      expect(productService.createProducts).toHaveBeenCalledTimes(1);
      expect(productService.createProducts).toHaveBeenCalledWith(
        createProductDto,
        currentUser.id,
      );
    });
    it('it should return new object with given data', async () => {
      const product = await productController.create(
        createProductDto,
        currentUser,
      );
      expect(product).toMatchObject(createProductDto);
      expect(product.id).toBe(1);
    });
  });

  describe('get all products ', () => {
    it('it should call " getallProducts" method in productService', async () => {
      await productController.getAllProducts();
      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    });
    it('should return all products if no args passed', async () => {
      const result = await productController.getAllProducts();
      expect(products).toMatchObject(products);
      expect(result.length).toBe(2);
    });
    it('should return all products based on title', async () => {
      const products = await productController.getAllProducts('book');
      expect(products[0]).toMatchObject({ title: 'book' });
      expect(products.length).toBe(1);
    });
    it('should return all products based on minPrice', async () => {
      const products = await productController.getAllProducts(undefined, '10');
      expect(products[0]).toMatchObject({ price: 10 });
      expect(products.length).toBe(2);
    });
    it('should return all products based on maxPrice', async () => {
      const products = await productController.getAllProducts(undefined, '200');
      expect(products[0]).toMatchObject({ price: 200 });
      expect(products.length).toBe(1);
    });
  });

  describe('get product by id ', () => {
    it('it should call "getProductById method in productService" ', async () => {
      await productController.getProductById(1);
      expect(productService.getProductById).toHaveBeenCalled();
      expect(productService.getProductById).toHaveBeenCalledTimes(1);
      expect(productService.getProductById).toHaveBeenCalledWith(1);
    });
    it('should return product with the given id', async () => {
      const product = await productController.getProductById(1);
      expect(product.id).toBe(1);
    });
    it('should throw not foond error if the  product not found', async () => {
      await expect(productController.getProductById(1000)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('update product by id ', () => {
    it('should call "updateProduct "method ', async () => {
      const title = 'car';
      await productController.updateProductById({ title }, 1);
      expect(productService.updateProductById).toHaveBeenCalled();
      expect(productService.updateProductById).toHaveBeenCalledTimes(1);
      expect(productService.updateProductById).toHaveBeenCalledWith(
        {
          title,
        },
        1,
      );
    });
    it('should return the update Product ', async () => {
      const title = 'car';
      const updatedProduct = await productController.updateProductById(
        { title },
        1,
      );
      expect(updatedProduct.title).toBe(title);
      expect(updatedProduct.id).toBe(1); // the id should not change
    });
  });
  describe('delete product by id ', () => {
    it('shoudl call the "deleteProductById" method ', async () => {
      await productController.deleteProductById(1);
      expect(productService.deleteProductById).toHaveBeenCalled();
      expect(productService.deleteProductById).toHaveBeenCalledTimes(1);
      expect(productService.deleteProductById).toHaveBeenCalledWith(1);
    });
    it('should return the deleted product', async () => {
      const deletedProduct = await productController.deleteProductById(1);
      expect(deletedProduct.id).toBe(1);
      expect(deletedProduct.title).toBe('book');
      expect(deletedProduct.price).toBe(10);
    });
    it('should throw an error if the product not found', async () => {
      await expect(productController.deleteProductById(1000)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
