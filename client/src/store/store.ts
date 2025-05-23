import { configureStore } from '@reduxjs/toolkit';
import { emptySplitApi } from './emptyApi';
import authReducer from './authSlice'
import headerReducer from './headerSlice'
import postsSlice from './postsSlice';

const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
    auth: authReducer,
    header: headerReducer,
    posts: postsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptySplitApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;