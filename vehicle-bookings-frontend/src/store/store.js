import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import dataReducer from '../features/data/dataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    data: dataReducer,
  },
});

export default store;
