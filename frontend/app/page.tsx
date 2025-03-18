'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Briefcase, 
  CheckCircle, 
  FileSearch, 
  Search, 
  Star, 
  Users,
  Upload,
  Clock,
  FileText,
  Bell,
  BarChart3,
  User,
  Shield,
  LineChart,
  Filter 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/components/auth/UserProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Sample data for authenticated dashboard
const jobSeekers = [
  { id: 1, name: "Alice Johnson", skills: ["React", "TypeScript", "Node.js"] },
  { id: 2, name: "Bob Smith", skills: ["Python", "Django", "PostgreSQL"] },
  { id: 3, name: "Carol Williams", skills: ["Java", "Spring Boot", "AWS"] }
];

const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time",
    skills: ["React", "TypeScript", "Redux"],
    salary: "$120k - $150k"
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataSystems",
    location: "New York, NY",
    type: "Full-time",
    skills: ["Python", "Django", "PostgreSQL"],
    salary: "$110k - $140k"
  },
  {
    id: 3,
    title: "DevOps Specialist",
    company: "CloudTech",
    location: "Remote",
    type: "Contract",
    skills: ["AWS", "Kubernetes", "Terraform"],
    salary: "$130k - $160k"
  }
];

export default function HomePage() {
  const { user } = useUser();
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      {user ? (
        <ProtectedRoute>
          <AuthenticatedView username={user.name ?? 'Guest'} />
        </ProtectedRoute>
      ) : (
        <UnauthenticatedView />
      )}
    </div>
  );
}

function UnauthenticatedView() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 rounded-full mb-2">
                  Job Consultant Platform
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                  Connect Talent With Opportunity
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  A powerful platform for consultants to manage job seekers, match skills with opportunities, and
                  streamline the recruitment process.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-black hover:bg-gray-800 text-white" size="lg" asChild>
                  <Link href="/sign-up">
                    Get Started
                  </Link>
                </Button>
                <Button variant="outline" className="text-black border-black hover:bg-gray-100" size="lg" asChild>
                  <Link href="/sign-in">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <Image
                src="/placeholder.svg?height=720&width=1280"
                alt="Dashboard Preview"
                width={1280}
                height={720}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-gray-900/0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Powerful Features for Consultants
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to manage job seekers and find the perfect job matches.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="p-2 bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <Upload className="h-5 w-5 text-gray-900" />
                </div>
                <CardTitle>Resume Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upload and manage resumes for your job seekers. Link them to profiles and track their performance.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="p-2 bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <Search className="h-5 w-5 text-gray-900" />
                </div>
                <CardTitle>Smart Job Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our algorithm matches job seekers with opportunities based on their skills, experience, and
                  preferences.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="p-2 bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <Filter className="h-5 w-5 text-gray-900" />
                </div>
                <CardTitle>Advanced Filtering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Filter jobs by technology, location, experience level, and more to find the perfect match.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="p-2 bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <Bell className="h-5 w-5 text-gray-900" />
                </div>
                <CardTitle>Job Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive notifications when new jobs matching your job seekers' skills become available.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="p-2 bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <LineChart className="h-5 w-5 text-gray-900" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track resume views, application status, and job seeker performance with detailed analytics.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="p-2 bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-gray-900" />
                </div>
                <CardTitle>Secure Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  OAuth-based authentication ensures your data and your job seekers' information remains secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white border-t border-b border-gray-200">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                How It Works
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform streamlines the job matching process in four simple steps.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <User className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">1. Create Profile</h3>
              <p className="mt-2 text-gray-600">
                Register and set up your consultant profile with your expertise and preferences.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <Upload className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">2. Upload Resumes</h3>
              <p className="mt-2 text-gray-600">
                Add your job seekers and upload their resumes to the platform.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <FileSearch className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">3. Match Jobs</h3>
              <p className="mt-2 text-gray-600">
                Our algorithm matches job seekers with relevant opportunities based on their skills.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <BarChart3 className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">4. Track Progress</h3>
              <p className="mt-2 text-gray-600">
                Monitor applications, view analytics, and manage your job seekers' progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                What Our Users Say
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from consultants who have transformed their recruitment process with our platform.
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <p className="text-gray-600 italic">
                    "This platform has revolutionized how I manage my job seekers. The matching algorithm is incredibly
                    accurate, and I've seen a 40% increase in successful placements."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-100 w-10 h-10"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">Senior Recruitment Consultant</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <p className="text-gray-600 italic">
                    "The analytics dashboard gives me insights I never had before. I can now make data-driven decisions
                    about which jobs to pursue for my candidates."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-100 w-10 h-10"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Michael Chen</p>
                      <p className="text-sm text-gray-500">Tech Recruitment Specialist</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <p className="text-gray-600 italic">
                    "The resume management system is a game-changer. I can easily organize, update, and track all my
                    candidates in one place."
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-100 w-10 h-10"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Priya Patel</p>
                      <p className="text-sm text-gray-500">Independent Recruiter</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Recruitment Process?
              </h2>
              <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of consultants who are matching talent with opportunity more efficiently than ever
                before.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
                <Link href="/sign-up">Get Started Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-white text-black hover:bg-gray-200">
                <Link href="/support">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AuthenticatedView({ username }: { username: string }) {
  // Calculate stats
  const totalJobSeekers = jobSeekers.length;
  const totalJobs = jobs.length;
  const potentialMatches = jobSeekers.reduce((acc, jobSeeker) => {
    const matchingJobs = jobs.filter((job) => 
      job.skills.some((skill) => jobSeeker.skills.includes(skill))
    );
    return acc + matchingJobs.length;
  }, 0);

  return (
    <>
      {/* Welcome Banner */}
      <section className="w-full py-10 md:py-14 bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">Welcome back, {username}</h1>
              <p className="text-gray-300 mt-2 text-lg">Here's what's happening with your job seekers today.</p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-white text-black hover:bg-gray-200">
                <Link href="/dashboard">
                  <Upload className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-400 text-white hover:bg-gray-700">
                <Link href="/support">
                  <Search className="mr-2 h-4 w-4" />
                  Get Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Overview */}
      <section className="w-full py-10 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          {/* Stats Cards */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Job Seekers</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalJobSeekers}</div>
                <p className="text-xs text-gray-500 mt-1">Candidates under your management</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Available Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalJobs}</div>
                <p className="text-xs text-gray-500 mt-1">Currently in our database</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Potential Matches</CardTitle>
                <CheckCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{potentialMatches}</div>
                <p className="text-xs text-gray-500 mt-1">Based on skills and requirements</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Recent Activity</CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">12</div>
                <p className="text-xs text-gray-500 mt-1">New activities in the last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Job Seekers & Recent Jobs section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Job Seekers Card */}
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-900">Your Job Seekers</CardTitle>
                  <Button variant="outline" size="sm" asChild className="text-gray-500 border-gray-200 hover:bg-gray-100">
                    <Link href="/dashboard">View All</Link>
                  </Button>
                </div>
                <CardDescription className="text-gray-500">
                  Manage and monitor your job seekers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobSeekers.map((jobSeeker) => (
                    <div
                      key={jobSeeker.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        {jobSeeker.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{jobSeeker.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {jobSeeker.skills.slice(0, 3).join(", ")}
                          {jobSeeker.skills.length > 3 && "..."}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="text-gray-500 hover:text-gray-700">
                        <Link href={`/dashboard?id=${jobSeeker.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard">
                    View Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Jobs */}
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Recent Jobs</CardTitle>
                <CardDescription className="text-gray-500">
                  Latest job opportunities matching your candidates' skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors duration-150">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-500">
                            {job.company} • {job.location}
                          </p>
                        </div>
                        <div className="text-xs font-medium text-black bg-gray-100 px-2 py-1 rounded-full">
                          {job.type}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.skills.map((skill) => (
                          <span 
                            key={skill} 
                            className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">{job.salary}</p>
                        <Button size="sm" className="bg-black hover:bg-gray-900 text-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/jobs">
                    <Search className="mr-2 h-4 w-4" />
                    Search All Jobs
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="w-full py-8 bg-white border-t border-gray-200">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                asChild
                className="border-gray-200 text-gray-900 hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Link href="/dashboard">
                  <Upload className="mr-2 h-4 w-4" />
                  Add Job Seeker
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-gray-200 text-gray-900 hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Link href="/jobs">
                  <Search className="mr-2 h-4 w-4" />
                  Search Jobs
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-gray-200 text-gray-900 hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Link href="/support">
                  <FileText className="mr-2 h-4 w-4" />
                  Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  
}