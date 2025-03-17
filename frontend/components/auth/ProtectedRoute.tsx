'use client';

import { useUser } from './UserProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useGetCurrentUserQuery } from '../../apiSlice/userApiSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, setUser } = useUser();
  const router = useRouter();
  
  // Use the query to get the current user - will automatically refresh on mount
  const { data: apiUser, isLoading: isApiLoading, error: apiError } = useGetCurrentUserQuery();

  useEffect(() => {
    // Update user context if API returns a user
    if (apiUser && !isApiLoading) {
      setUser(apiUser);
    }
    
    // Handle unauthenticated users
    if (!isLoading && !isApiLoading) {
      if (apiError || !user) {
        // Redirect to sign-in page with redirect back to current page
        router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
      } else if (user && requiredRole && user.role !== requiredRole) {
        // If a specific role is required and user doesn't have it
        router.push('/dashboard');
      }
    }
  }, [isLoading, isApiLoading, user, apiUser, apiError, router, requiredRole, setUser]);

  // While loading, show spinner
  if (isLoading || isApiLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!user) {
    return null;
  }

  // If role is required and user doesn't have it, don't render children
  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  // Otherwise, render children
  return <>{children}</>;
}