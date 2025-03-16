import { api } from './api';

// User interface
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Auth API slice
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<{ token: string }, { email: string; password: string; ipAddress?: string }>({
      query: (credentials) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    signUp: builder.mutation<{ token: string }, { email: string; name: string; password: string }>({
      query: (userData) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body: userData,
      }),
    }),
    
    signOut: builder.mutation<void, { ipAddress?: string }>({
      query: (body) => ({
        url: '/auth/sign-out',
        method: 'POST',
        body,
      }),
    }),
    
    getUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

// JWT token utility functions
export async function signToken(payload: any): Promise<string> {
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    throw new Error('Failed to sign token');
  }
  
  const { token } = await response.json();
  return token;
}

export async function verifyToken(token: string): Promise<any> {
  const response = await fetch(`/api/auth/verify?token=${token}`);
  
  if (!response.ok) {
    throw new Error('Invalid token');
  }
  
  return response.json();
}

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useGetUserQuery,
} = authApi;
