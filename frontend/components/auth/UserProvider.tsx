'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGetCurrentUserQuery, User } from '../../apiSlice/userApiSlice';

// Define context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: apiUser, isLoading: isApiLoading } = useGetCurrentUserQuery();

  useEffect(() => {
    if (!isApiLoading) {
      if (apiUser) {
        setUser(apiUser);
      }
      setIsLoading(false);
    }
  }, [apiUser, isApiLoading]);

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isLoading: isLoading || isApiLoading }}>
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