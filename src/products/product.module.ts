/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { JwtModule } from '@nestjs/jwt';

/**
 * Products module that handles product management
 * Provides CRUD operations for products and user-product relationships
 */
@Module({
  controllers: [ProductsController],
  providers: [ProductService],
  imports: [UsersModule, TypeOrmModule.forFeature([Product]), JwtModule],
  exports: [ProductService]
})
export class ProductModule { }
