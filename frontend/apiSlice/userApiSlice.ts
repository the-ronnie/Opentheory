// frontend/apiSlice/usersApiSlice.ts
import { baseApiSlice } from './baseApiSlice';

export type User = {
  id: number;
  name: string | null;
  email: string;
  role: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = LoginCredentials & {
  name: string;
};

export type PasswordChangeData = {
  currentPassword: string;
  newPassword: string;
};

export type UserUpdateData = {
  name: string;
  email: string;
};

export const usersApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<User, LoginCredentials>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation<User, RegisterData>({
      query: (data) => ({
        url: '/users/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    
    updateUser: builder.mutation<User, UserUpdateData>({
      query: (data) => ({
        url: '/users/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    changePassword: builder.mutation<{ message: string }, PasswordChangeData>({
      query: (data) => ({
        url: '/users/change-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    deleteAccount: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/users/me',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = usersApiSlice;