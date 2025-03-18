'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Briefcase, 
  CheckCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from "@/components/navbar";
import { useUser } from '@/components/auth/UserProvider';

// Using the job seekers data from the main page for now
const jobSeekers = [
  { id: 1, name: "Alice Johnson", skills: ["React", "TypeScript", "Node.js"] },
  { id: 2, name: "Bob Smith", skills: ["Python", "Django", "PostgreSQL"] },
  { id: 3, name: "Carol Williams", skills: ["Java", "Spring Boot", "AWS"] }
];

export default function ProfilePage() {
  const { user } = useUser();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('bio'); // Replace tabs with this state
  
  // Sample consultant data - would come from your API in a real app
  const consultant = {
    id: 1,
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Technical Recruiter",
    company: "TechTalent Solutions",
    location: "San Francisco, CA",
    joinedDate: "2022-06-15",
    bio: "Experienced technical recruiter with over 8 years specializing in placing software engineers and IT professionals. I focus on understanding both technical requirements and cultural fit to ensure successful long-term placements.",
    avatar: user?.image || "/placeholder.svg"
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Calculate success metrics
  const activePlacements = 12;
  const successRate = 78;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="flex-1 space-y-6 container px-4 md:px-6 py-6 md:py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
          <Button 
            variant={isEditMode ? "default" : "outline"}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          {/* Profile Overview */}
          <Card className="md:col-span-3">
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={consultant.avatar} alt={consultant.name} />
                  <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h3 className="text-2xl font-bold">{consultant.name}</h3>
                  <p className="text-muted-foreground">{consultant.position}</p>
                  <p className="text-muted-foreground">{consultant.company}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{consultant.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{consultant.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{consultant.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {formatDate(consultant.joinedDate)}</span>
                </div>
              </div>
            </CardContent>
            {isEditMode && (
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Upload New Photo
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Bio and Job Seekers */}
          <Card className="md:col-span-4">
            <CardHeader>
              {/* Replace Tabs with custom buttons */}
              <div className="grid w-full grid-cols-2 mb-4">
                <Button 
                  variant={activeSection === 'bio' ? "default" : "outline"} 
                  className="rounded-r-none"
                  onClick={() => setActiveSection('bio')}
                >
                  Bio
                </Button>
                <Button 
                  variant={activeSection === 'job-seekers' ? "default" : "outline"} 
                  className="rounded-l-none"
                  onClick={() => setActiveSection('job-seekers')}
                >
                  Job Seekers
                </Button>
              </div>
              
              {/* Bio content */}
              {activeSection === 'bio' && (
                <div className="space-y-4 pt-4">
                  <div>
                    <CardTitle>About Me</CardTitle>
                    {isEditMode ? (
                      <textarea
                        className="w-full mt-2 p-2 rounded-md border border-input bg-background"
                        rows={5}
                        defaultValue={consultant.bio}
                      />
                    ) : (
                      <CardDescription className="mt-2">{consultant.bio}</CardDescription>
                    )}
                  </div>
                  {isEditMode && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Position</label>
                        <input 
                          type="text" 
                          defaultValue={consultant.position}
                          className="w-full p-2 rounded-md border border-input bg-background" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <input 
                          type="text" 
                          defaultValue={consultant.company}
                          className="w-full p-2 rounded-md border border-input bg-background" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input 
                          type="text" 
                          defaultValue={consultant.location}
                          className="w-full p-2 rounded-md border border-input bg-background" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Job Seekers content */}
              {activeSection === 'job-seekers' && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>My Job Seekers</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard">View All</Link>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {jobSeekers.map((jobSeeker) => (
                      <div key={jobSeeker.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{jobSeeker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{jobSeeker.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {jobSeeker.skills.slice(0, 3).join(", ")}
                            {jobSeeker.skills.length > 3 && "..."}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard?id=${jobSeeker.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>
        </div>

        {/* Contact Information (Edit Mode) */}
        {isEditMode && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={consultant.name}
                  className="w-full p-2 rounded-md border border-input bg-background" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  defaultValue={consultant.email}
                  className="w-full p-2 rounded-md border border-input bg-background" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input 
                  type="tel" 
                  defaultValue={consultant.phone}
                  className="w-full p-2 rounded-md border border-input bg-background" 
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Job Seekers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobSeekers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Placements</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePlacements}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-muted-foreground">Change your password</p>
              </div>
              <Button variant="outline">Change Password</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline">Enable 2FA</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Permanently delete your account</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
