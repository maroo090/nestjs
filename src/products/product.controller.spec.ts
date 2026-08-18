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
const createProductDto:CreateProductsDto={title:'book',description:'A hardcover novel',price:10}
const currentUser:JWTPayloadType={id:1, userType:'admin'}

describe('product controller', () => {
  let productController: ProductsController;
  let productService: ProductService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {provide:ConfigService,useValue:{}},
          {provide:UsersService,useValue:{}},
        {provide:JwtService,useValue:{}},
        {provide:Reflector,useValue:{}},
        {
          provide: ProductService,
          useValue: {
            createProducts: jest.fn((body:CreateProductsDto,id:number)=>{
              return Promise.resolve({...body,id:1})
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
      const product=await productController.create(createProductDto, currentUser);
      expect(product).toMatchObject(createProductDto);
      expect(product.id).toBe(1);
       });

  });
});
