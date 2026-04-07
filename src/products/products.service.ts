/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProduct } from './dtos/update-product.dto';
import { UsersService } from 'src/users/user.service';
import { Between, Like, Repository } from 'typeorm';
import { Product } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Service for managing product operations
 */
@Injectable()
export class ProductService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  /**
   * Creates a new product
   * @param dto - CreateProductsDto containing product details
   * @param userIs id of the logged in user 
   * @returns Promise resolving to the created Product entity
   */
  public async createProducts(dto: CreateProductsDto, userId: number): Promise<Product> {
    const id = await this.usersService.getCurrentUser(userId);
    const newProduct = this.productRepository.create({
      ...dto,
      title: dto.title.toLowerCase(),
      user: id,
    });
    return await this.productRepository.save(newProduct);
  }

  /**
   * Retrieves all products from the database
   * @returns Promise resolving to an array of Product entities
   */
  public getAllProducts(title?: string, minPrice?: string, maxPrice?: string): Promise<Product[]> {
    const filters = {
      ...(title ? { title: Like(`%${title.toLowerCase()}%`) } : {}),
      ...(minPrice && maxPrice ? { price: Between(parseInt(minPrice), parseInt(maxPrice)) } : {}),

    }

    return this.productRepository.find({
      where: filters
    });    // ** { relations: { user: true, reviews: true } } to fetch the related reviews and user that create this product 
  }
  /// where: { title: Like(`%${title}%`) }
  /**
   * Retrieves a product by its ID
   * @param id - The product's unique identifier
   * @returns Promise resolving to the Product entity
   * @throws NotFoundException if product doesn't exist
   */
  public async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  /**
   * Updates an existing product by ID
   * @param updateProductDto - Object containing optional title, description, and price
   * @param id - The product's unique identifier
   * @returns Promise resolving to the updated Product entity
   * @throws NotFoundException if product doesn't exist
   */
  public async updateProductById(
    updateProductDto: UpdateProduct,
    id: number,
  ): Promise<Product> {
    const product = await this.getProductById(Number(id));
    product.title = updateProductDto.title ?? product.title;
    product.description = updateProductDto.description ?? product.description;
    product.price = updateProductDto.price ?? product.price;
    return await this.productRepository.save(product);
  }
  public getAllUsersAndProducts() { }
  /**
   * Deletes a product by ID
   * @param id - The product's unique identifier
   * @returns Promise resolving to the removed Product entity
   * @throws NotFoundException if product doesn't exist
   */
  public async deleteProductsById(id: number): Promise<Product> {
    const product = await this.getProductById(id);
    return await this.productRepository.remove(product);
  }
}
