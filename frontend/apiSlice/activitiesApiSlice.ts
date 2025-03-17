// frontend/apiSlice/activitiesApiSlice.ts
import { baseApiSlice } from './baseApiSlice';
import { ActivityLog, QueryParams } from './consultantsApiSlice';

export const activitiesApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecentActivities: builder.query<ActivityLog[], QueryParams>({
      query: ({ limit = 50, offset = 0 }) => 
        `/activities?limit=${limit}&offset=${offset}`,
      providesTags: ['Activity'],
    }),
  }),
});

export const {
  useGetRecentActivitiesQuery,
} = activitiesApiSlice;