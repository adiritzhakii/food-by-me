import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookieData } from '../utils/cookie';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
  }

const userCookie = getCookieData('user');

const initialState: AuthState = {
    isAuthenticated: userCookie ? true : false,
    token: userCookie ? userCookie.token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{token: string}>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token; 
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;