/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProduct } from './dtos/update-product.dto';
import { ProductService } from './products.service';
import { Product } from './products.entity';
import { AuthRoleGard } from 'src/users/guard/auth-role.gard';
import { Roles } from 'src/users/decorators/user.role.decorators';
import { UserEnum } from 'src/utils/enums';
import { CurrentUserDecorator } from 'src/users/decorators/users.decorators';
import { type JWTPayloadType } from 'src/utils/types';

/**
 * Controller for handling product-related HTTP requests
 */
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductService) { }
  /**
   * Creates a new product
   * @param body - CreateProductsDto containing product details
   * @returns Promise resolving to created Product entity
   */
  @Post()
  @UseGuards(AuthRoleGard)
  @Roles(UserEnum.ADMIN)
  public create(@Body() body: CreateProductsDto, @CurrentUserDecorator() payload: JWTPayloadType): Promise<Product> {
    return this.productsService.createProducts(body, payload.id);
  }
  /**
   * Retrieves all products
   * @returns Promise resolving to array of Product entities
   */
  @Get()
  public getAllProducts(
    @Query('title') title: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string

  ): Promise<Product[]> {
    return this.productsService.getAllProducts(title, minPrice, maxPrice);
  }
  /**
   * Retrieves all users with their products
   * @returns Promise resolving to user-product data
   */
  @Get('/usersAndProducts')
  public getAllUsersAndProducts() {
    return this.productsService.getAllUsersAndProducts();
  }
  /**
   * Retrieves a product by ID
   * @param id - Product's unique identifier
   * @returns Promise resolving to Product entity
   */
  @Get('/:id')
  public getProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    return this.productsService.getProductById(id);
  }
  /**
   * Updates a product by ID
   * @param body - UpdateProductDto containing optional fields
   * @param id - Product's unique identifier
   * @returns Promise resolving to updated Product entity
   */
  @Put('/:id')
  @UseGuards(AuthRoleGard)
  @Roles(UserEnum.ADMIN)
  public updateProductById(
    @Body() body: UpdateProduct,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    return this.productsService.updateProductById(body, id);
  }

  /**
   * Deletes a product by ID
   * @param id - Product's unique identifier
   * @returns Promise resolving to removed Product entity
   */
  @Delete('/:id')
  @UseGuards(AuthRoleGard)
  @Roles(UserEnum.ADMIN)
  public deleteProductsById(@Param('id') id: number): Promise<Product> {
    return this.productsService.deleteProductsById(id);
  }
}
