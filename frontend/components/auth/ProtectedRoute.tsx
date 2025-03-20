'use client';

import { useUser } from './UserProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
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
  const pathname = usePathname();
  const redirected = useRef(false);
  
  // Use the query to get the current user - will automatically refresh on mount
  const { data: apiUser, isLoading: isApiLoading, error: apiError } = useGetCurrentUserQuery();

  useEffect(() => {
    // Update user context if API returns a user
    if (apiUser && !isApiLoading) {
      setUser(apiUser);
    }
    
    // Skip if still loading or already redirected
    if (isLoading || isApiLoading || redirected.current) return;
    
    // Handle unauthenticated users
    if (!allowUnauthenticated && (apiError || !user)) {
      redirected.current = true;
      // Redirect to sign-in page with redirect back to current page
      router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
    } else if (user && requiredRole && user.role !== requiredRole) {
      redirected.current = true;
      // If a specific role is required and user doesn't have it, redirect to pricing
      router.push('/pricing');
    }
  }, [isLoading, isApiLoading, user, apiUser, apiError, router, requiredRole, setUser, allowUnauthenticated, pathname]);

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