import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration for all API services
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    credentials: 'include', // Ensures cookies are sent with requests
    prepareHeaders: (headers) => {
      // You can add common headers here if needed
      return headers;
    }
  }),
  endpoints: () => ({}),
  tagTypes: ['User', 'Team', 'Activity', 'Subscription'],
});
