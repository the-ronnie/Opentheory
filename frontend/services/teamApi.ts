import { api } from './api';
import { User } from './authApi';

export interface Team {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId?: number;
}

export interface TeamMember {
  id: number;
  userId: number;
  teamId: number;
  role: string;
  user: User;
}

export interface Invitation {
  id: number;
  email: string;
  teamId: number;
  role: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

// Team API slice
export const teamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserTeam: builder.query<Team, number>({
      query: (userId) => `/users/${userId}/team`,
      providesTags: (result) => result ? [{ type: 'Team', id: result.id }] : ['Team'],
    }),
    
    getTeamMembers: builder.query<TeamMember[], number>({
      query: (teamId) => `/teams/${teamId}/members`,
      providesTags: (result) => 
        result ? 
          [...result.map(member => ({ type: 'User' as const, id: member.userId })), 'Team'] : 
          ['Team'],
    }),
    
    inviteTeamMember: builder.mutation<void, { teamId: number, email: string, role: string }>({
      query: ({ teamId, ...body }) => ({
        url: `/teams/${teamId}/invitations`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team'],
    }),
    
    updateTeamMemberRole: builder.mutation<void, { teamId: number, userId: number, role: string }>({
      query: ({ teamId, userId, role }) => ({
        url: `/teams/${teamId}/members/${userId}`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, 'Team'],
    }),
    
    removeTeamMember: builder.mutation<void, { teamId: number, userId: number }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, 'Team'],
    }),
    
    getTeamInvitations: builder.query<Invitation[], number>({
      query: (teamId) => `/teams/${teamId}/invitations`,
      providesTags: ['Team'],
    }),
    
    deleteInvitation: builder.mutation<void, { teamId: number, invitationId: number }>({
      query: ({ teamId, invitationId }) => ({
        url: `/teams/${teamId}/invitations/${invitationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
  }),
});

export const {
  useGetUserTeamQuery,
  useGetTeamMembersQuery,
  useInviteTeamMemberMutation,
  useUpdateTeamMemberRoleMutation,
  useRemoveTeamMemberMutation,
  useGetTeamInvitationsQuery,
  useDeleteInvitationMutation,
} = teamApi;
