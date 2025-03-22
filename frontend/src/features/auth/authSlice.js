import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import AuthService from '../../services/auth.service';

// Check if user is already authenticated
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
  try {
    console.log('checkAuth thunk: Checking if user is authenticated');
    
    // First check localStorage directly for faster access
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('checkAuth thunk: Found user in localStorage:', parsedUser);
        
        // Return the user from localStorage first for immediate authentication
        setTimeout(() => {
          // After a short delay, also try to validate with the backend
          // This is a non-blocking operation that will quietly update the state if successful
          AuthService.getCurrentUser().catch(e => 
            console.log('Background validation failed, but using cached user:', e.message)
          );
        }, 100);
        
        return parsedUser;
      } catch (parseError) {
        console.log('checkAuth thunk: Error parsing stored user:', parseError.message);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    // If no stored user or parsing failed, try to get from backend
    console.log('checkAuth thunk: No valid user in localStorage, checking backend');
    const user = await AuthService.getCurrentUser();
    console.log('checkAuth thunk: User authenticated from backend:', user);
    return user;
  } catch (error) {
    console.log('checkAuth thunk: Authentication failed:', error.message);
    return thunkAPI.rejectWithValue(error.message || 'Failed to authenticate');
  }
});

// Register a new user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await AuthService.register(userData);
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login a user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    console.log('login thunk: Attempting to login user');
    const response = await AuthService.login(userData);
    console.log('login thunk: Login successful:', response);
    toast.success('Login successful!');
    return response;
  } catch (error) {
    console.log('login thunk: Login failed:', error);
    // Properly extract error message from various error formats
    const message = 
      error.response?.data?.message || 
      error.message || 
      'Login failed';
    console.log('login thunk: Error message:', message);
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout a user
export const logout = createAsyncThunk('auth/logout', async () => {
  await AuthService.logout();
  toast.info('You have been logged out');
});

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      const response = await AuthService.updateProfile(profileData);
      toast.success('Profile updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, thunkAPI) => {
    try {
      const response = await AuthService.changePassword(passwordData);
      toast.success('Password changed successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to change password';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        
        // Immediately check localStorage for faster authentication
        const localIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (localIsAuthenticated) {
          console.log('checkAuth.pending: Found isAuthenticated=true in localStorage');
          state.isAuthenticated = true;
          
          // Try to get user from localStorage
          try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              state.user = JSON.parse(storedUser);
              console.log('checkAuth.pending: Using user from localStorage:', state.user);
            }
          } catch (e) {
            console.error('Error parsing user from localStorage:', e);
          }
        }
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Redux state - login.pending:', { ...state });
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        console.log('Redux state - login.fulfilled:', { ...state, user: action.payload });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('Redux state - login.rejected:', { ...state, error: action.payload });
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;