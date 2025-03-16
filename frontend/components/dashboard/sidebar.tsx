'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  User,
  Settings,
  Activity,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUser } from '../../providers/UserProvider';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarLink({ href, icon, label, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900',
        active ? 'bg-orange-50 text-orange-600' : ''
      )}
    >
      <span className="mr-3 h-5 w-5">{icon}</span>
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="h-6 w-6 rounded-full bg-orange-500" />
            <span>OT App</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            active={isActive('/dashboard') && pathname === '/dashboard'}
          />
          <SidebarLink
            href="/dashboard/documents"
            icon={<FileText className="h-5 w-5" />}
            label="Documents"
            active={isActive('/dashboard/documents')}
          />
          <SidebarLink
            href="/dashboard/team"
            icon={<User className="h-5 w-5" />}
            label="Team"
            active={isActive('/dashboard/team')}
          />
          <SidebarLink
            href="/dashboard/activity"
            icon={<Activity className="h-5 w-5" />}
            label="Activity"
            active={isActive('/dashboard/activity')}
          />
          <SidebarLink
            href="/dashboard/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            active={isActive('/dashboard/settings')}
          />
        </nav>
        <div className="border-t border-gray-200 p-4">
          <form action="/api/auth/sign-out" method="POST">
            <button 
              type="submit" 
              className="flex w-full items-center rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
