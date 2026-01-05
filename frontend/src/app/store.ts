import {configureStore} from '@reduxjs/toolkit'
import {productApi} from '../features/product/productApi'
import productsReducer from "../features/product/productSlice"

export const store = configureStore({
    reducer: {
      [productApi.reducerPath]: productApi.reducer,
      products: productsReducer
    },
     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type useAppDispatch = typeof store.dispatch