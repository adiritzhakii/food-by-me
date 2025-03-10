import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from './store';

const serverUrl = window.location.hostname
// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: `http://${serverUrl}:3000/`,
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
