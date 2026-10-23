import { createSlice, createAsyncThunk, isPending, isRejected } from "@reduxjs/toolkit";
import { authApi } from "../../services/api/authApi";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "../../types/user";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
};

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.login(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: string }>(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.register(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  return await authApi.logout();
});

export const fetchCurrentUser = createAsyncThunk("auth/me", async () => {
  try {
    return await authApi.me();
  } catch {
    return null;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
      })
      .addMatcher(isPending(loginUser, registerUser), (state) => {
        state.loading = true;
      })
      .addMatcher(isRejected(loginUser, registerUser), (state) => {
        state.loading = false;
      });
  },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;