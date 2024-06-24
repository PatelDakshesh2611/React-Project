// src/reducers/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Define RootState if not already defined
import { Product } from '../types';

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

// Load cart items from localStorage if available
const loadCartFromLocalStorage = (): Product[] => {
  const cartItems = localStorage.getItem('cartItems');
  return cartItems ? JSON.parse(cartItems) : [];
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    items: loadCartFromLocalStorage(), // Initialize items from localStorage
  },
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const { id } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {      
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    // Define setCartItems action
    setCartItems(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCartItems } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;
