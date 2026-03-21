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
  // Req,
  // Res,
} from '@nestjs/common';
import { CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProduct } from './dtos/update-product.dto';
import { ProductService } from './products.service';
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductService) { }
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
  create(@Body() body: CreateProductsDto) {
    return this.productsService.createProducts(body);
  }
  @Get()
  public getAllProducts() {
    return this.productsService.getAllProducts();
  }
  @Get('/usersAndProducts')
  public getAllUsersAndProducts() {
    return this.productsService.getAllUsersAndProducts();
  }
  @Get('/:id')
  public getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getProductById(id);
  }
  @Put('/:id')
  public updateProductById(
    @Body() body: UpdateProduct,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.productsService.updateProductById(body, id);
  }

  @Delete('/:id')
  public deleteProductsById(@Param('id') id: string) {
    return this.productsService.deleteProductsById(id);
  }
}
