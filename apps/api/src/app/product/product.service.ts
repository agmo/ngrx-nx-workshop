import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BasicProduct, Product } from '@ngrx-nx-workshop/api-interfaces';
import { data } from '@ngrx-nx-workshop/data';

function stripDescription(originalData: Product[]): BasicProduct[] {
  return originalData.map(({description, ...product}) => product);
}

@Injectable()
export class ProductService {
  getProductList(): BasicProduct[] {
    // Randomly error out to test handling errors in effects.
    if (Math.random() < 0.25) {
      throw new HttpException('Products failed', HttpStatus.FORBIDDEN)
    }

    return stripDescription(data);
  }

  getProduct(id: string): Product {
    const product = data.find(p => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} is not found`);
    }
    return product;
  }
}
