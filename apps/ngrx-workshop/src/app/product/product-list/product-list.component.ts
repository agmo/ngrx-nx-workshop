import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BasicProduct, Product, Rating } from '@ngrx-nx-workshop/api-interfaces';
import { ProductService } from '../product.service';
import { RatingService } from '../rating.service';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as productListActions from './product-list.actions';

@Component({
  selector: 'ngrx-nx-workshop-home',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<BasicProduct[]> = this.store.select(
    state => state.product.products
  );
  customerRatings$?: Observable<Map<string, Rating>>;

  constructor(
    private readonly productService: ProductService,
    private readonly ratingService: RatingService,
    private store: Store<{product: { products: Product[] }}>
  ) {
    this.store.dispatch(productListActions.productsOpened());
  }

  ngOnInit() {
    this.customerRatings$ = this.ratingService.getRatings().pipe(
      map(arr => {
        const ratingsMap = new Map<string, Rating>();
        for (const productRating of arr) {
          ratingsMap.set(productRating.productId, productRating.rating);
        }
        return ratingsMap;
      }),
      shareReplay({ // Shared so that each ngFor item does not refetch it.
        refCount: true, // When used in a component without refCount, results in a memory leak.
        bufferSize: 1
      })
    );
  }
}
