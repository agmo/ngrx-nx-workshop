import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Rating } from '@ngrx-nx-workshop/api-interfaces';
import { BehaviorSubject } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';

import { CartService } from '../../cart/cart.service';
import { ProductService } from '../product.service';
import { RatingService } from '../rating.service';
import { Store } from '@ngrx/store';
import * as productDetailsActions from './actions';

@Component({
  selector: 'ngrx-nx-workshop-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  private readonly productId$ = this.router.paramMap.pipe(
    map((params: ParamMap) => params.get('productId')),
    filter((id: string | null): id is string => !!id),
    // Shared using shareReplay because it's used by product$ and by productId$.
    shareReplay({ bufferSize: 1, refCount: true })
  );

  product$ = this.productId$.pipe(
    switchMap(id => this.productService.getProduct(id))
  );

  customerRating$ = new BehaviorSubject<number | undefined>(undefined); // Using Behavior Subject because customerRating$ is subscribed twice in the template and Behaviour Subject is multicast.

  constructor(
    private readonly router: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly ratingService: RatingService,
    private readonly cartService: CartService,
    private readonly location: Location,
    private readonly store: Store
  ) {
    this.productId$
      .pipe(switchMap(id => this.ratingService.getRating(id)))
      .subscribe(productRating =>
        this.customerRating$.next(productRating && productRating.rating)
      );
  }

  setRating(productId: string, rating: Rating) {
    this.ratingService
      .setRating({ productId, rating })
      .pipe(
        map(arr =>
          arr.find(productRating => productId === productRating.productId)
        ),
        filter(
          (productRating): productRating is NonNullable<typeof productRating> =>
            productRating != null
        ),
        map(productRating => productRating.rating)
      )
      .subscribe(newRating => this.customerRating$.next(newRating));
  }

  addToCart(productId: string) {
    this.store.dispatch(productDetailsActions.addToCart({productId}));
  }

  back() {
    this.location.back();
  }
}
