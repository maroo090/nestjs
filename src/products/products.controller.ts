import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  // Req,
  // Res,
} from '@nestjs/common';
import { type CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProduct } from './dtos/update-product.dto';
import type { Request, Response } from 'express';
type ProductType = { id: number; title: string; price: number };
@Controller('api/products')
export class ProductsController {
  private products: ProductType[] = [
    { id: 1, title: 'book', price: 10 },
    { id: 2, title: 'pen', price: 5 },
    { id: 3, title: 'laptop', price: 500 },
  ];
  // @Post()
  // public createProductsByExpressWay(
  //   @Req() req: Request<unknown, unknown, CreateProductsDto>,
  //   @Res() res: Response,
  //   @Headers() header: any,
  // ) {
  //   const newProducts: ProductType = {
  //     id: this.products.length + 1,
  //     title: req.body.title,
  //     price: req.body.price,
  //   };
  //   console.log(header)
  //   this.products.push(newProducts);
  //   return res.status(201).json(newProducts);
  // }
  @Post()
  public createProducts(@Body() body: CreateProductsDto) {
    const newProducts: ProductType = {
      id: this.products.length + 1,
      title: body.title,
      price: body.price,
    };
    this.products.push(newProducts);
    return newProducts;
  }
  @Get()
  public getAllProducts() {
    return this.products;
  }
  @Get('/:id')
  public getProductById(@Param('id', ParseIntPipe) id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException();
    return product;
  }
  @Put('/:id')
  public updateProductById(
    @Body() body: UpdateProduct,
    @Param('id') id: string,
  ) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException();
    console.log(body);
    return { message: 'products updates ' };
  }
  @Delete('/:id')
  public deleteProductsById(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === parseInt(id));
    if (!product) throw new NotFoundException();
    return { message: 'product deleted ' };
  }
}
