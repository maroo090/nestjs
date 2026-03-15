import { Controller } from '@nestjs/common';

@Controller()
export class ProductsController {
  public getAllProducts() {
    return [
      { id: 1, title: 'book', price: 10 },
      { id: 2, title: 'pen', price: 5 },
      { id: 3, title: 'laptop', price: 500 },
    ];
  }
}
