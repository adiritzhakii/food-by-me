import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const serverUrl = window.location.hostname
// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `http://${serverUrl}:3000/` }),
  endpoints: () => ({}),
})