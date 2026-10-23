import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { productApi } from "../../services/api/productApi";
import { categoryApi } from "../../services/api/categoryApi";
import type {
  Category,
  Product,
  ProductFilters,
  ProductListResponse,
  SortOption,
} from "../../types/product";
import type { RootState } from "../../redux/store";

const defaultFilters: ProductFilters = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  inStock: false,
  sort: "newest",
  page: 1,
};

interface ProductState {
  items: Product[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  categories: Category[];
}

const initialState: ProductState = {
  items: [],
  total: 0,
  totalPages: 0,
  loading: false,
  error: null,
  filters: defaultFilters,
  categories: [],
};

export const fetchProducts = createAsyncThunk<
  ProductListResponse,
  void,
  { state: RootState; rejectValue: string }
>("products/fetch", async (_, { getState, signal, rejectWithValue }) => {
  try {
    return await productApi.list(getState().products.filters, signal);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchCategories = createAsyncThunk("products/categories", async () => {
  return await categoryApi.list();
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload.trim();
      state.filters.page = 1;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.filters.category = action.payload;
      state.filters.page = 1;
    },
    setPriceRange(state, action: PayloadAction<{ minPrice: string; maxPrice: string }>) {
      state.filters.minPrice = action.payload.minPrice;
      state.filters.maxPrice = action.payload.maxPrice;
      state.filters.page = 1;
    },
    setInStock(state, action: PayloadAction<boolean>) {
      state.filters.inStock = action.payload;
      state.filters.page = 1;
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.filters.sort = action.payload;
      state.filters.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    resetFilters(state) {
      state.filters = { ...defaultFilters, category: state.filters.category };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.loading = false;
        state.error = action.payload ?? "Could not load products";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setSearch, setCategory, setPriceRange, setInStock, setSort, setPage, resetFilters } =
  productSlice.actions;
export default productSlice.reducer;