'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useGetUserQuery } from '../services/authApi';
import type { User } from '../services/authApi';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  error: null,
  refetch: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { 
    data: user, 
    isLoading, 
    error,
    refetch 
  } = useGetUserQuery();

  const value = {
    user: user || null,
    isLoading,
    error,
    refetch,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
