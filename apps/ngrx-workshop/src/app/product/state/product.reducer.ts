import { createReducer, on } from '@ngrx/store';
import { Product } from '@ngrx-nx-workshop/api-interfaces';
import * as productApiActions from './product.actions';

export interface GlobalState {
  product: ProductState
}

interface ProductState {
  products?: Product[];
}
const initialState: ProductState = {
  products: undefined
};

export const productReducer = createReducer<ProductState>(
  initialState,
  on(productApiActions.productsFetchedSuccess, (state, { products }): ProductState => {
    return {
      ...state,
      products: [...products]
    }
  })
)

// This is no longer needed. It was required by older versions of the Angular compiler.
// export function reducer(state: ProductState | undefined, action: Action) {
//   return productReducer(state, action);
// }
