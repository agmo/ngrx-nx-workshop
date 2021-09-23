import { createReducer, on } from '@ngrx/store';
import { Product } from '@ngrx-nx-workshop/api-interfaces';
import { data } from '@ngrx-nx-workshop/data';
import * as productListActions from '../product-list/product-list.actions';

interface ProductState {
  products?: Product[];
}
const initialState: ProductState = {
  products: undefined
};

export const productReducer = createReducer<ProductState>(
  initialState,
  on(productListActions.productsOpened, (state): ProductState => {
    return {
      ...state,
      products: [...data]
    }
  })
)

// This is no longer needed. It was required by older versions of the Angular compiler.
// export function reducer(state: ProductState | undefined, action: Action) {
//   return productReducer(state, action);
// }
