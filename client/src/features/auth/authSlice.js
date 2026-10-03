import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient, { clearAccessToken, setAccessToken } from '../../api/axiosClient';

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/register', {
        name,
        email,
        password,
        role
      });
      const data = response.data?.data;
      setAccessToken(data?.accessToken);
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/login', {
        email,
        password
      });
      const data = response.data?.data;
      setAccessToken(data?.accessToken);
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Invalid email or password.';
      return rejectWithValue(message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/auth/me');
      return response.data?.data?.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (e) {
      // Ignore network failure on logout
    }
    clearAccessToken();
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        clearAccessToken();
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
