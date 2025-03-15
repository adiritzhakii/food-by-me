import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from './store';
import {SERVER_ADDR, SERVER_PORT} from '../../const'

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: `http://${SERVER_ADDR}:${SERVER_PORT}/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
    
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
    
      return headers;
    },
  }),
  
  endpoints: () => ({}),
})
