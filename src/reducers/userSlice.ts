// src/reducers/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string | null; // JWT token
  // Add other user-related fields as needed (e.g., username, email, etc.)
}

const initialState: UserState = {
  token: null,
  // Initialize other user fields as needed
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
    // Add other user-related actions as needed
  },
});

export const { setToken, clearToken } = userSlice.actions;

export default userSlice.reducer;
