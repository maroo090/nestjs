/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
  imports: [UsersModule, TypeOrmModule.forFeature([Product]),
  ]
})
export class ProductModule { }
