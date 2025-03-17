'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// import { Loader2 } from 'lucide-react';

// Define user type
export interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

// Create context
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  // Replace the non-existent hook with a custom implementation
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  
  const fetchUser = async () => {
    if (typeof window === 'undefined') return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated, but not an error
          setUser(null);
        } else {
          throw new Error('Failed to fetch user');
        }
      } else {
        const userData = await response.json();
        setUser(userData);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refetch = () => {
    fetchUser();
  };
  
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error, refetch }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Loading component for suspense fallback
export function UserLoading() {
  return (
    <div className="flex items-center justify-center w-full h-24">
      <span className="h-6 w-6 animate-spin text-orange-500">Loading...</span>
    </div>
  );
}