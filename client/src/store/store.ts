import { configureStore } from '@reduxjs/toolkit';
import { emptySplitApi } from './emptyApi';

const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptySplitApi.middleware),
});

export default store;