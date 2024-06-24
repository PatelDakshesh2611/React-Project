// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './reducers/cartSlice';
import userReducer from './reducers/userSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    // Add other reducers as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
