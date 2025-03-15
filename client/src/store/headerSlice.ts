import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookieData } from '../utils/cookie';

export type tabType = 'newPost' | 'home' | 'profile' | 'AIPost';
interface HeaderState {
    activeTab: tabType;
    previousTab: tabType;
}

const initialState: HeaderState = {
    activeTab: 'home',
    previousTab: 'home',
};

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<tabType>) => {
      // If switching to a modal tab (newPost or AIPost), store the current tab
      if (action.payload === 'newPost' || action.payload === 'AIPost') {
        state.previousTab = state.activeTab;
      }
      state.activeTab = action.payload;
    },
    restorePreviousTab: (state) => {
      state.activeTab = state.previousTab;
    },
  },
});

export const { setActiveTab, restorePreviousTab } = headerSlice.actions;
export default headerSlice.reducer;