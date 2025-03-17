// frontend/apiSlice/consultantsApiSlice.ts
import { baseApiSlice } from './baseApiSlice';

export type Consultant = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string;
  bio: string | null;
  company: string | null;
  position: string | null;
  location: string | null;
  joinedDate: string;
};

export type ConsultantCreateData = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio?: string;
  company?: string;
  position?: string;
  location?: string;
};

export type ConsultantUpdateData = Partial<Omit<ConsultantCreateData, 'email'>>;

export type ActivityLog = {
  id: string;
  consultantId: string;
  entityType: string;
  entityId: string;
  action: string;
  details: string | null;
  ipAddress: string | null;
  timestamp: string;
};

export type QueryParams = {
  limit?: number;
  offset?: number;
};

export const consultantsApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllConsultants: builder.query<Consultant[], QueryParams>({
      query: ({ limit = 50, offset = 0 }) => 
        `/consultants?limit=${limit}&offset=${offset}`,
      providesTags: ['Consultant'],
    }),
    
    getConsultantById: builder.query<Consultant, string>({
      query: (id) => `/consultants/${id}`,
      providesTags: (result, error, id) => [{ type: 'Consultant', id }],
    }),
    
    createConsultant: builder.mutation<Consultant, ConsultantCreateData>({
      query: (data) => ({
        url: '/consultants',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Consultant'],
    }),
    
    updateConsultant: builder.mutation<Consultant, { id: string; data: ConsultantUpdateData }>({
      query: ({ id, data }) => ({
        url: `/consultants/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Consultant', id }],
    }),
    
    getConsultantActivities: builder.query<ActivityLog[], { consultantId: string; queryParams?: QueryParams }>({
      query: ({ consultantId, queryParams = { limit: 50, offset: 0 } }) => 
        `/consultants/${consultantId}/activities?limit=${queryParams.limit}&offset=${queryParams.offset}`,
      providesTags: (result, error, { consultantId }) => [
        { type: 'Activity', id: `consultant-${consultantId}` }
      ],
    }),
  }),
});

export const {
  useGetAllConsultantsQuery,
  useGetConsultantByIdQuery,
  useCreateConsultantMutation,
  useUpdateConsultantMutation,
  useGetConsultantActivitiesQuery,
} = consultantsApiSlice;