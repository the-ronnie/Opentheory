'use client';

import React from 'react';
import { Button } from '../ui/button';
import { useLogoutMutation } from '../../apiSlice/userApiSlice';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useUser } from './UserProvider';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
}

export function LogoutButton({
  variant = 'ghost',
  size = 'default',
  showIcon = true,
}: LogoutButtonProps) {
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();
  const { clearUser } = useUser();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      clearUser();
      router.push('/sign-in');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}
