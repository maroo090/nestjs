import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProduct } from './dtos/update-product.dto';
import { UsersService } from 'src/users/user.service';
import { Repository } from 'typeorm';
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
  ) {}

  /**
   * Creates a new product
   * @param dto - CreateProductsDto containing product details
   * @returns Promise resolving to the created Product entity
   */
  public async createProducts(dto: CreateProductsDto): Promise<Product> {
    const newProduct = this.productRepository.create(dto);
    return await this.productRepository.save(newProduct);
  }

  /**
   * Retrieves all products from the database
   * @returns Promise resolving to an array of Product entities
   */
  public getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

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
  public getAllUsersAndProducts() {}
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
