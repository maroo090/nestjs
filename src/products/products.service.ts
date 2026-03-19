import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsDto } from './dtos/create-products.dto';
import { UpdateProduct } from './dtos/update-product.dto';

/* eslint-disable prettier/prettier */
type ProductType = { id: number; title: string; price: number };
@Injectable()
export class ProductService {
    private products: ProductType[] = [
        { id: 1, title: 'book', price: 10 },
        { id: 2, title: 'pen', price: 5 },
        { id: 3, title: 'laptop', price: 500 },
    ];
    public createProducts({ price, title }: CreateProductsDto) {
        const newProducts: ProductType = {
            id: this.products.length + 1,
            title,
            price,
        };
        this.products.push(newProducts);
        return newProducts;
    }

    public getAllProducts() {
        return this.products;
    }

    public getProductById(id: number) {
        const product = this.products.find((p) => p.id === id);
        if (!product) throw new NotFoundException();
        return product;
    }

    public updateProductById(
        updateProductDto: UpdateProduct,
        id: string,
    ) {
        const product = this.products.find((p) => p.id === parseInt(id));
        if (!product) throw new NotFoundException();
        console.log(updateProductDto)
        return { message: 'products updates ' };
    }

    public deleteProductsById(id: string) {
        const product = this.products.find((p) => p.id === parseInt(id));
        if (!product) throw new NotFoundException();
        return { message: 'product deleted ' };
    }
}
