import { createAction, props } from '@ngrx/store';
import { BasicProduct } from '@ngrx-nx-workshop/api-interfaces';

export const productsFetchedSuccess = createAction(
  '[Product API] Products fetched success',
  props<{ products: BasicProduct[] }>()
);

export const productsFetchedError = createAction(
  '[Product API] Products fetching error'
)
