'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { CircleIcon, Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useUser } from '../../components/auth/UserProvider';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import React from 'react';
import { LogoutButton } from '../../components/auth/LogoutButton';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 text-orange-500" />
          <span className="ml-2 text-xl font-semibold text-gray-900">JobBoard</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/jobs"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Jobs
          </Link>
          <Link
            href="/job-seekers"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Job Seekers
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt={user?.name || ''} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <LogoutButton className="cursor-pointer w-full flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </LogoutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // This entire layout is protected - only authenticated users can access
    <ProtectedRoute>
      <section className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 p-4">
          {children}
        </div>
      </section>
    </ProtectedRoute>
  );
}