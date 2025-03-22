import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here as the app grows
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store; 