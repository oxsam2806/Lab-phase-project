import { createSlice, createAsyncThunk, isFulfilled } from "@reduxjs/toolkit";
import { wishlistApi } from "../../services/api/wishlistApi";
import type { Product } from "../../types/product";
import type { WishlistResponse } from "../../types/cart";
import { logoutUser } from "../auth/authSlice";

interface WishlistState {
  products: Product[];
  loading: boolean;
}

const initialState: WishlistState = {
  products: [],
  loading: false,
};

const errorMessage = (error: unknown) => (error as Error).message;

export const fetchWishlist = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await wishlistApi.get();
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const addToWishlist = createAsyncThunk<WishlistResponse, string, { rejectValue: string }>(
  "wishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      return await wishlistApi.add(productId);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const removeFromWishlist = createAsyncThunk<WishlistResponse, string, { rejectValue: string }>(
  "wishlist/remove",
  async (productId, { rejectWithValue }) => {
    try {
      return await wishlistApi.remove(productId);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addMatcher(isFulfilled(addToWishlist, removeFromWishlist), (state, action) => {
        state.products = action.payload.products;
      });
  },
});

export default wishlistSlice.reducer;