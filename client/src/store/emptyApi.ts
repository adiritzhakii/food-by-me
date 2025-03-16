import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from './store';
import { SERVER_API, SERVER_PORT } from '../consts';

export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: `https://${SERVER_API}:${SERVER_PORT}/api/`,
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
