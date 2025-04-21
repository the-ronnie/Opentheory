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
  allowUnauthenticated?: boolean;
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
    
    // User exists but is checking non-admin routes as an admin
    if (user && user.role === "admin" && pathname !== "/admin" && !pathname.startsWith("/admin/")) {
      redirected.current = true;
      // Redirect admin to admin dashboard
      router.push('/admin');
      return;
    }

    // Handle unauthenticated users
    if (!allowUnauthenticated && (apiError || !user)) {
      redirected.current = true;
      // Redirect to sign-in page with redirect back to current page
      router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    } 
    
    // Handle role-specific access
    if (user && requiredRole && user.role !== requiredRole) {
      redirected.current = true;
      // If a specific role is required and user doesn't have it
      if (user.role === "admin") {
        router.push('/admin'); // Admin trying to access non-admin page
      } else {
        router.push('/'); // Non-admin trying to access admin page
      }
      return;
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

  // If this route allows unauthenticated users or user is authenticated
  if (allowUnauthenticated || user) {
    // If role is required and user doesn't have it, don't render children
    if (user && requiredRole && user.role !== requiredRole) {
      return null;
    }
    
    // Admin users can only access admin pages
    if (user?.role === "admin" && pathname !== "/admin" && !pathname.startsWith("/admin/")) {
      return null;
    }
    
    return <>{children}</>;
  }

  // Otherwise, don't render children
  return null;
}