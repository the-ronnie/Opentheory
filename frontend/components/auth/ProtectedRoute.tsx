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
  allowUnauthenticated?: boolean; // Add this prop for landing page
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  allowUnauthenticated = false 
}: ProtectedRouteProps) {
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
      // If user is not authenticated and this route requires authentication
      if (!allowUnauthenticated && (apiError || !user)) {
        // Redirect to sign-in page with redirect back to current page
        router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
      } else if (user && requiredRole && user.role !== requiredRole) {
        // If a specific role is required and user doesn't have it
        router.push('/dashboard');
      }
    }
  }, [isLoading, isApiLoading, user, apiUser, apiError, router, requiredRole, setUser, allowUnauthenticated]);

  // While loading, show spinner
  if (isLoading || isApiLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // If this route allows unauthenticated users or user is authenticated, render children
  if (allowUnauthenticated || user) {
    // If role is required and user doesn't have it, don't render children
    if (user && requiredRole && user.role !== requiredRole) {
      return null;
    }
    return <>{children}</>;
  }

  // Otherwise, don't render children
  return null;
}