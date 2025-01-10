import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookieData } from '../utils/cookie';

export type tabType = 'addPost' | 'home' | 'profile' | 'addAIPost';
interface HeaderState {
    activeTab: tabType;
  }

const initialState: HeaderState = {
    activeTab: 'home',
};

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<tabType>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = headerSlice.actions;
export default headerSlice.reducer;