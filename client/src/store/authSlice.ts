import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookieData } from '../utils/cookie';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    refreshToken: string | undefined;
    provider: string | undefined;
  }

const userCookie = getCookieData('user');

const initialState: AuthState = {
    isAuthenticated: userCookie ? true : false,
    token: userCookie ? userCookie.token: null,
    refreshToken: userCookie ? userCookie.refreshToken : undefined,
    provider: userCookie ? userCookie.provider : undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{token: string, refreshToken: string, provider: string}>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.provider = action.payload.provider;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = undefined;
      state.provider = undefined;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;