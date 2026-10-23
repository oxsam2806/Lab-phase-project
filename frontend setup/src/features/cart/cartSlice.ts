import {
  createSlice,
  createAsyncThunk,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import { cartApi } from "../../services/api/cartApi";
import type { Cart, CartResponse } from "../../types/cart";
import { logoutUser } from "../auth/authSlice";

interface CartState {
  cart: Cart;
  loading: boolean;
  pendingProductIds: string[];
  drawerOpen: boolean;
}

const initialState: CartState = {
  cart: { items: [], itemCount: 0, subtotal: 0 },
  loading: false,
  pendingProductIds: [],
  drawerOpen: false,
};

type ItemArg = { productId: string; quantity: number };
const errorMessage = (error: unknown) => (error as Error).message;

export const fetchCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await cartApi.get();
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const addToCart = createAsyncThunk<CartResponse, ItemArg, { rejectValue: string }>(
  "cart/add",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await cartApi.add(productId, quantity);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const updateCartItem = createAsyncThunk<CartResponse, ItemArg, { rejectValue: string }>(
  "cart/update",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await cartApi.update(productId, quantity);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const removeCartItem = createAsyncThunk<CartResponse, { productId: string }, { rejectValue: string }>(
  "cart/remove",
  async ({ productId }, { rejectWithValue }) => {
    try {
      return await cartApi.remove(productId);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const clearCart = createAsyncThunk<CartResponse, void, { rejectValue: string }>(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      return await cartApi.clear();
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

const itemThunks = [addToCart, updateCartItem, removeCartItem] as const;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    openDrawer(state) {
      state.drawerOpen = true;
    },
    closeDrawer(state) {
      state.drawerOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addMatcher(isPending(...itemThunks), (state, action) => {
        state.pendingProductIds.push(action.meta.arg.productId);
      })
      .addMatcher(isFulfilled(...itemThunks), (state, action) => {
        state.cart = action.payload.cart;
        state.pendingProductIds = state.pendingProductIds.filter((id) => id !== action.meta.arg.productId);
      })
      .addMatcher(isRejected(...itemThunks), (state, action) => {
        state.pendingProductIds = state.pendingProductIds.filter((id) => id !== action.meta.arg.productId);
      });
  },
});

export const { openDrawer, closeDrawer } = cartSlice.actions;
export default cartSlice.reducer;