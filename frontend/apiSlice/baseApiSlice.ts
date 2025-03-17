// frontend/apiSlice/baseApiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    credentials: 'include', // Important: includes cookies with every request
  }),
  tagTypes: ['User', 'Consultant', 'JobSeeker', 'Job', 'Activity'],
  endpoints: () => ({}),
});