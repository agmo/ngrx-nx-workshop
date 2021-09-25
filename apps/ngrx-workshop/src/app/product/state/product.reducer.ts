import { createReducer, on } from '@ngrx/store';
import { Product } from '@ngrx-nx-workshop/api-interfaces';
import * as productApiActions from './product.actions';

interface ProductState {
  products?: Product[];
}
const initialState: ProductState = {
  products: undefined
};

export const productReducer = createReducer<ProductState>(
  initialState,
  on(productApiActions.productsFetched, (state, { products }): ProductState => {
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
