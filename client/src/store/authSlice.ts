import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookieData } from '../utils/cookie';

export interface UserProfile {
  email: string;
  name: string;
  avatar: string;
}

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    refreshToken: string | undefined;
    provider: string | undefined;
    userData: UserProfile | undefined;
    userId: string | undefined;
  }

const userCookie = getCookieData('user');

const initialState: AuthState = {
    isAuthenticated: userCookie ? true : false,
    token: userCookie ? userCookie.token: null,
    refreshToken: userCookie ? userCookie.refreshToken : undefined,
    provider: userCookie ? userCookie.provider : undefined,
    userData: undefined,
    userId: userCookie ? userCookie.userId : undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{token: string, refreshToken: string, provider: string, userId: string | undefined}>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.provider = action.payload.provider;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = undefined;
      state.provider = undefined;
      state.userId = undefined;
      state.userData = undefined;
    },
    setUserData: (state, action: PayloadAction<UserProfile>) => {
      state.userData = action.payload;
    },
  }
});

export const { login, logout, setUserData } = authSlice.actions;
export default authSlice.reducer;