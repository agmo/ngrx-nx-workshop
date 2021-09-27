import { ApplicationRef, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from '../product.service';
import * as productListActions from '../product-list/product-list.actions';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import * as productApiActions from './product.actions';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ProductEffects {
  constructor(private actions$: Actions,
              private productService: ProductService,
              private snackBar: MatSnackBar,
              private appRef: ApplicationRef) {
  }

  fetchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productListActions.productsOpened),
      // exhaustMap is a good fit for GET requests
      exhaustMap(() => this.productService.getProducts().pipe(
        map(products => productApiActions.productsFetchedSuccess({ products })),
        catchError(() => of(productApiActions.productsFetchedError()))
      ))
    ));

  handleFetchError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(productApiActions.productsFetchedError),
      tap(() => {
        this.snackBar.open('Error fetching products', 'Error', {duration: 5000});
        this.appRef.tick(); // Trigger change detection. (The same can be achieved by wrapping the snackbar.open() call with setTimeout or Promise.resolve.)
      }),
    ),
    {dispatch: false} // Do not expect an action.
  )
}

