import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

interface ProductsState {
  filters: {
    category: string;
    gender: string;
    sort: string;
    limit: number;
    page: number;
  };
  selectedProductId: string | null;
}

const initialState: ProductsState = {
  filters: {
    category: '',
    gender: 'nam',
    sort: 'price_asc',
    limit: 10,
    page: 1,
  },
  selectedProductId: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateFilters: (state, action: PayloadAction<Partial<ProductsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<string>) => {
      state.selectedProductId = action.payload;
    },
  },
});

export const { updateFilters, setPage, setSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;