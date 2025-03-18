'use client';

import React from 'react';
import { useUser } from '../../components/auth/UserProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { BriefcaseIcon, BookmarkIcon, UsersIcon, BellIcon, Loader2 } from 'lucide-react';
import { useGetUserActivitiesQuery } from '../../apiSlice/userApiSlice';

interface ActivityLog {
  connections: { total: number; new: number };
  notifications: { total: number; unread: number };
  recommendations?: Array<{ id?: string; title: string; company: string; locationType: string; status: string }>;
  applications?: { active: number; new: number };
  savedJobs?: { total: number; new: number };
}

export default function DashboardPage() {
  const { user } = useUser();
  const { data: userActivities, isLoading, error } = useGetUserActivitiesQuery({ userId: user?.id || 0 }) as { data: ActivityLog | undefined; isLoading: boolean; error: unknown };
  
  // Get the current time of day to customize greeting
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  else if (hour >= 18) greeting = "Good evening";

  // Extract stats from API data or provide defaults
  const stats = {
    activeApplications: userActivities?.applications?.active || 0,
    newApplications: userActivities?.applications?.new || 0,
    savedJobs: userActivities?.savedJobs?.total || 0,
    newSavedJobs: userActivities?.savedJobs?.new || 0,
    connections: userActivities?.connections?.total || 0,
    newConnections: userActivities?.connections?.new || 0,
    notifications: userActivities?.notifications?.total || 0,
    unreadNotifications: userActivities?.notifications?.unread || 0,
  };

  // Get job recommendations from API data
  const jobRecommendations = userActivities?.recommendations || [];

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading dashboard data</h3>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeApplications}</div>
                <p className="text-xs text-muted-foreground">{stats.newApplications} new this week</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.savedJobs}</div>
                <p className="text-xs text-muted-foreground">{stats.newSavedJobs} new since yesterday</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Connections</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.connections}</div>
                <p className="text-xs text-muted-foreground">+{stats.newConnections} from last week</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <BellIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.notifications}</div>
                <p className="text-xs text-muted-foreground">{stats.unreadNotifications} requires your attention</p>
              </>
            )}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : jobRecommendations.length > 0 ? (
            <div className="space-y-4">
              {jobRecommendations.map((job, index) => (
                <div 
                  key={job.id || index} 
                  className={`flex justify-between items-center ${
                    index < jobRecommendations.length - 1 ? 'border-b pb-2' : ''
                  }`}
                >
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.company} • {job.locationType}
                    </p>
                  </div>
                  <span className={`text-sm font-medium 
                    ${job.status === 'new' ? 'bg-green-100 text-green-800' : 
                      job.status === 'match' ? 'bg-blue-100 text-blue-800' : 
                      'bg-orange-100 text-orange-800'} 
                    py-1 px-2 rounded`}
                  >
                    {job.status === 'new' ? 'New' : 
                     job.status === 'match' ? 'Match' : 'Hot'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No job recommendations found. Complete your profile to get personalized recommendations.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}