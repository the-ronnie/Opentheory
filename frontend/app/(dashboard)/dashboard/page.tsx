'use client';

import React from 'react';
import { useUser } from '../../../components/auth/UserProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { BriefcaseIcon, BookmarkIcon, UsersIcon, BellIcon } from 'lucide-react';
import { Terminal } from '../terminal';

export default function DashboardPage() {
  const { user } = useUser();
  
  // Get the current time of day to customize greeting
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  else if (hour >= 18) greeting = "Good evening";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {user?.name || 'there'}!
        </h1>
        <p className="text-muted-foreground">
          Welcome to your JobBoard dashboard. Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Job Applications</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 new since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Connections</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <BellIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 requires your attention</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Job Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Recommendations</CardTitle>
          <CardDescription>
            Based on your profile and preferences, we've found these jobs for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-medium">Senior Software Engineer</h3>
                <p className="text-sm text-muted-foreground">TechCorp Inc. • Remote</p>
              </div>
              <span className="text-sm font-medium bg-green-100 text-green-800 py-1 px-2 rounded">
                New
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="font-medium">Full Stack Developer</h3>
                <p className="text-sm text-muted-foreground">WebSolutions • Hybrid</p>
              </div>
              <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded">
                Match
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Frontend Engineer</h3>
                <p className="text-sm text-muted-foreground">DesignHub • On-site</p>
              </div>
              <span className="text-sm font-medium bg-orange-100 text-orange-800 py-1 px-2 rounded">
                Hot
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Setup Terminal */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Complete your profile setup to get the most out of JobBoard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Terminal />
        </CardContent>
      </Card>
    </div>
  );
}
