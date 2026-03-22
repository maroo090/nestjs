import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProduct } from './dtos/update-product.dto';
import { UsersService } from 'src/users/user.service';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';

/* eslint-disable prettier/prettier */
@Injectable()
export class ProductService {
    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    public async createProducts(dto: CreateProductsDto) {
        const newProduct = this.productRepository.create(dto);
        return await this.productRepository.save(newProduct);

    }

    public getAllProducts() {
        return this.productRepository.find();
    }

    public async getProductById(id: number) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    public async updateProductById(
        updateProductDto: UpdateProduct,
        id: number,
    ) {
        const product = await this.getProductById(Number(id))
        product.title = updateProductDto.title ?? product.title;
        product.description = updateProductDto.description ?? product.description;
        product.price = updateProductDto.price ?? product.price;
        return await this.productRepository.save(product);
    }
    public getAllUsersAndProducts() {

    }
    public async deleteProductsById(id: number) {
        const product = await this.getProductById(id)
        return await this.productRepository.remove(product);
    }
}
