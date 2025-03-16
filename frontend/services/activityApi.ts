import { api } from './api';

// Define activity types
export type ActivityType = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE_DOCUMENT'
  | 'EDIT_DOCUMENT'
  | 'DELETE_DOCUMENT'
  | 'INVITE_TEAM_MEMBER'
  | 'REMOVE_TEAM_MEMBER'
  | 'UPDATE_SETTINGS';

export interface ActivityLog {
  id: number;
  teamId: number;
  userId: number;
  userName?: string;
  action: ActivityType;
  ipAddress?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Activity API endpoints
export const activityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeamActivityLogs: builder.query<ActivityLog[], number>({
      query: (teamId) => `/teams/${teamId}/activities`,
      providesTags: ['Activity'],
    }),
    
    logActivity: builder.mutation<void, { teamId: number; action: ActivityType; ipAddress?: string; metadata?: Record<string, any> }>({
      query: (body) => ({
        url: '/activity/log',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Activity'],
    }),
  }),
});

export const {
  useGetTeamActivityLogsQuery,
  useLogActivityMutation,
} = activityApi;
