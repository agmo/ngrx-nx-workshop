import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '../product.service';
import * as productListActions from '../product-list/product-list.actions';
import { exhaustMap, map } from 'rxjs/operators';
import * as productApiActions from './product.actions';

@Injectable()
export class ProductEffects {
  constructor(private actions$: Actions, private productService: ProductService) {
  }

  fetchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productListActions.productsOpened),
      // exhaustMap is a good fit for GET requests
      exhaustMap(() => this.productService.getProducts().pipe(
        map(products => productApiActions.productsFetched({ products }))
      ))
    ));
}

