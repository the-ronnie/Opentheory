'use client';

import React, { useState } from 'react';
import { useUser } from '../../components/auth/UserProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  BriefcaseIcon, BookmarkIcon, UsersIcon, BellIcon, Loader2, 
  BarChart3Icon, TrendingUpIcon, ArrowRightIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon, HomeIcon
} from 'lucide-react';
import Link from 'next/link';
import { useGetUserActivitiesQuery } from '../../apiSlice/userApiSlice';
import { useGetAllActiveJobsQuery } from '../../apiSlice/jobsApiSlice';
import { useGetRecentActivitiesQuery } from '../../apiSlice/activitiesApiSlice';
import { Badge } from '../../components/ui/badge';
import { Navbar } from '../../components/navbar';

interface DashboardActivityLog {
  connections: { total: number; new: number };
  notifications: { total: number; unread: number };
  recommendations?: Array<{ id?: string; title: string; company: string; locationType: string; status: string }>;
  applications?: { active: number; new: number; rejected: number; accepted: number };
  savedJobs?: { total: number; new: number };
}

export default function DashboardPage() {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState('overview');
  
  const { data: userActivities, isLoading: isLoadingActivities } = 
    useGetUserActivitiesQuery({ userId: user?.id || 0 }) as { 
      data: DashboardActivityLog | undefined; 
      isLoading: boolean; 
    };
  
  const { data: recentJobs, isLoading: isLoadingJobs } = 
    useGetAllActiveJobsQuery({ limit: 5 });
    
  const { data: recentActivities, isLoading: isLoadingRecentActivities } = 
    useGetRecentActivitiesQuery({ limit: 10 });
  
  // Get the current time of day for the greeting
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  else if (hour >= 18) greeting = "Good evening";

  // Extract stats from API data or provide defaults
  const stats = {
    activeApplications: userActivities?.applications?.active || 0,
    newApplications: userActivities?.applications?.new || 0,
    rejected: userActivities?.applications?.rejected || 0,
    accepted: userActivities?.applications?.accepted || 0,
    savedJobs: userActivities?.savedJobs?.total || 0,
    newSavedJobs: userActivities?.savedJobs?.new || 0,
    connections: userActivities?.connections?.total || 0,
    newConnections: userActivities?.connections?.new || 0,
    notifications: userActivities?.notifications?.total || 0,
    unreadNotifications: userActivities?.notifications?.unread || 0,
  };

  // Get job recommendations from API data
  const jobRecommendations = userActivities?.recommendations || [];

  // Loading state for the entire dashboard
  const isLoading = isLoadingActivities || isLoadingJobs || isLoadingRecentActivities;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-medium text-gray-900">Loading dashboard data</h3>
          <p className="text-gray-600">Please wait while we fetch your information</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting}, {user?.name || 'there'}!
            </h1>
            <p className="text-muted-foreground">
              Welcome to your OpenTheory dashboard. Here's your career snapshot.
            </p>
          </div>
          
          <Card className="w-full md:w-[300px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Link href="/jobs">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    Browse Jobs <ArrowRightIcon className="h-3 w-3" />
                  </Button>
                </Link>
                <Link href="/applications">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    View Applications <ArrowRightIcon className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={activeSection === 'overview' ? "default" : "outline"} 
            onClick={() => setActiveSection('overview')}
            className="rounded-md"
          >
            Overview
          </Button>
          <Button 
            variant={activeSection === 'applications' ? "default" : "outline"} 
            onClick={() => setActiveSection('applications')}
            className="rounded-md"
          >
            Applications
          </Button>
          <Button 
            variant={activeSection === 'jobs' ? "default" : "outline"} 
            onClick={() => setActiveSection('jobs')}
            className="rounded-md"
          >
            Jobs
          </Button>
          <Button 
            variant={activeSection === 'activity' ? "default" : "outline"} 
            onClick={() => setActiveSection('activity')}
            className="rounded-md"
          >
            Activity
          </Button>
        </div>
        
        {/* Content Sections */}
        <div className="space-y-6">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Applications</CardTitle>
                    <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeApplications}</div>
                    <p className="text-xs text-muted-foreground">{stats.newApplications} new this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
                    <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.savedJobs}</div>
                    <p className="text-xs text-muted-foreground">{stats.newSavedJobs} new since yesterday</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Network</CardTitle>
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.connections}</div>
                    <p className="text-xs text-muted-foreground">+{stats.newConnections} from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                    <BellIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.notifications}</div>
                    <p className="text-xs text-muted-foreground">{stats.unreadNotifications} requires your attention</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Application Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Status</CardTitle>
                  <CardDescription>Overview of your job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-amber-500 mr-2" />
                        <span>In Progress</span>
                      </div>
                      <Badge variant="outline">{stats.activeApplications}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        <span>Accepted</span>
                      </div>
                      <Badge variant="outline">{stats.accepted}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        <span>Rejected</span>
                      </div>
                      <Badge variant="outline">{stats.rejected}</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/applications">
                    <Button variant="outline" size="sm">
                      View All Applications
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              {/* Job Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Recommendations</CardTitle>
                  <CardDescription>Based on your profile and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  {jobRecommendations && jobRecommendations.length > 0 ? (
                    <div className="space-y-4">
                      {jobRecommendations.map((job, index) => (
                        <div 
                          key={job.id || index} 
                          className={`${index < jobRecommendations.length - 1 ? 'border-b pb-3' : ''}`}
                        >
                          <Link href={`/jobs/${job.id || index}`} className="block hover:bg-gray-50 rounded p-2 transition-colors">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {job.company} • {job.locationType}
                                </p>
                              </div>
                              <Badge
                                className={job.status === 'new' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                                  job.status === 'match' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                                  'bg-orange-100 text-orange-800 hover:bg-orange-200'}
                              >
                                {job.status === 'new' ? 'New' : 
                                 job.status === 'match' ? 'Match' : 'Hot'}
                              </Badge>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No job recommendations found. We're working on finding matches for your skills.
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/jobs">
                    <Button variant="outline">
                      Browse All Jobs <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {/* Applications Section */}
          {activeSection === 'applications' && (
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Your Applications</CardTitle>
                <CardDescription>Track your job applications progress</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.activeApplications > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-700 mb-1">In Progress</h3>
                        <p className="text-2xl font-bold">{stats.activeApplications}</p>
                        <p className="text-sm text-blue-600 mt-1">Applications being reviewed</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-700 mb-1">Accepted</h3>
                        <p className="text-2xl font-bold">{stats.accepted}</p>
                        <p className="text-sm text-green-600 mt-1">Applications accepted</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Application Activity</h3>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-100 h-2 rounded-full mr-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: '45%' }} 
                          />
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Response rate from employers
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-6">Start applying to find your dream job</p>
                    <Link href="/jobs">
                      <Button>Browse Jobs</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/applications">
                  <Button variant="outline">View Application Details</Button>
                </Link>
              </CardFooter>
            </Card>
          )}
          
          {/* Jobs Section */}
          {activeSection === 'jobs' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Job Listings</CardTitle>
                  <CardDescription>Latest opportunities that may interest you</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentJobs && recentJobs.length > 0 ? (
                    <div className="space-y-4">
                      {recentJobs.map((job) => (
                        <Link 
                          href={`/jobs/${job.id}`} 
                          key={job.id}
                          className="block border-b pb-3 last:border-0 hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {job.company} • {job.location}
                              </p>
                              <div className="flex gap-2 mt-1">
                                {job.skills.slice(0, 3).map((skill, i) => (
                                  <Badge key={i} variant="outline" className="bg-blue-50">
                                    {skill}
                                  </Badge>
                                ))}
                                {job.skills.length > 3 && (
                                  <Badge variant="outline" className="bg-blue-50">
                                    +{job.skills.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">{job.type}</Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                Posted: {new Date(job.postedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent job listings available.
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {recentJobs?.length || 0} of many jobs
                  </div>
                  <Link href="/jobs">
                    <Button>View All Jobs</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Jobs</CardTitle>
                    <CardDescription>Jobs you've bookmarked for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.savedJobs > 0 ? (
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">
                          You have {stats.savedJobs} saved jobs
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {stats.newSavedJobs} new jobs were added since your last visit
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <BookmarkIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                        <p className="text-muted-foreground">
                          You haven't saved any jobs yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href="/jobs/saved">
                      <Button variant="outline" size="sm">
                        View Saved Jobs
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Skills in Demand</CardTitle>
                    <CardDescription>Popular skills in recent job postings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>React</span>
                        <div className="flex items-center">
                          <div className="w-[100px] bg-gray-200 h-2 rounded-full mr-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
                          </div>
                          <span className="text-xs font-medium">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>TypeScript</span>
                        <div className="flex items-center">
                          <div className="w-[100px] bg-gray-200 h-2 rounded-full mr-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }} />
                          </div>
                          <span className="text-xs font-medium">78%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Node.js</span>
                        <div className="flex items-center">
                          <div className="w-[100px] bg-gray-200 h-2 rounded-full mr-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }} />
                          </div>
                          <span className="text-xs font-medium">65%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Next.js</span>
                        <div className="flex items-center">
                          <div className="w-[100px] bg-gray-200 h-2 rounded-full mr-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '52%' }} />
                          </div>
                          <span className="text-xs font-medium">52%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/skills">
                      <Button variant="outline" size="sm">
                        View Skill Insights
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </>
          )}
          
          {/* Activity Section */}
          {activeSection === 'activity' && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivities && recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={activity.id || index} className="flex gap-4 items-start pb-4 last:pb-0 border-b last:border-0">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          {activity.entityType === 'job' ? (
                            <BriefcaseIcon className="h-4 w-4 text-blue-600" />
                          ) : activity.entityType === 'application' ? (
                            <ClockIcon className="h-4 w-4 text-amber-600" />
                          ) : (
                            <BellIcon className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.details || `Action: ${activity.action}`}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {activity.entityType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activities found
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/activities">
                  <Button variant="outline">View All Activity</Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}