'use client';

import Link from 'next/link';
import { Menu, Search, Bell } from 'lucide-react';
import { useUser } from '../../providers/UserProvider';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function TopNav() {
  const { user } = useUser();
  
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center border-b bg-white px-4 lg:px-6">
      <div className="lg:hidden">
        <button className="p-2" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <button className="hidden md:flex items-center rounded-md border p-2 text-sm" aria-label="Search">
          <Search className="h-4 w-4 mr-2" />
          <span>Search...</span>
        </button>
        <button className="p-2 relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500" />
        </button>
        <div className="border-l pl-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2" aria-label="User menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.id || 'user'}`} alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm font-medium">
                  {user?.name || 'Guest'}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <form action="/api/auth/sign-out" method="POST" className="w-full">
                  <button type="submit" className="w-full text-left">
                    Sign Out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
