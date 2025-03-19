"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {useUser} from '../../components/auth/UserProvider';
import Navbar from "@/components/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Download, FileText, Plus, Search, Trash2, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Badge } from "../../components/ui/badge"
import { useGetJobSeekersForConsultantQuery, useDeleteJobSeekerMutation } from "../../apiSlice/jobSeekersApiSlice"
import { useParams } from "next/navigation"

// import { toast } from "../../components/ui/use-toast"
import React from "react"
export default function JobSeekersPage() {
    const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJobSeeker, setSelectedJobSeeker] = useState<string | null>(null)
  console.log(user);
  // Get consultantId from the URL or from user context
  // This is a placeholder - you'll need to adapt this based on your auth/routing setup
  const params = useParams();
  const consultantId = user?.id
    ? String(user.id) // Ensure it's a string
    : (Array.isArray(params.consultantId) 
        ? params.consultantId[0] 
        : params.consultantId ?? "3ba31c7d-c7de-485d-811b-5949c491f8d9");
  
  console.log(consultantId);
  const resumePath = `/resumes/haha.pdf`
  // Fetch job seekers for the current consultant
  const { 
    data: jobSeekersData, 
    isLoading, 
    isError, 
    error 
  } = useGetJobSeekersForConsultantQuery({ 
    consultantId, 
    queryParams: { limit: 50, offset: 0 } 
  })
  
  // Delete job seeker mutation
  const [deleteJobSeeker, { isLoading: isDeleting }] = useDeleteJobSeekerMutation()

  // Filter job seekers based on search query
  const filteredJobSeekers = jobSeekersData?.filter(
    (jobSeeker) =>
      jobSeeker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jobSeeker.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  ) || []

  // Handle delete job seeker
  const handleDeleteJobSeeker = async (id: string) => {
    try {
      await deleteJobSeeker(id).unwrap()
      toast({
        title: "Job seeker deleted",
        description: "The job seeker profile has been successfully deleted.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete job seeker profile.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-2 pt-3">
      <Navbar />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Job Seekers</h2>
        <Button asChild>
          <Link href="/job-seekers/add">
            <Plus className="mr-2 h-4 w-4" /> Add Job Seeker
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or skills..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p>Loading job seekers...</p>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {isError && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <h3 className="mt-4 text-lg font-semibold text-destructive">Error loading job seekers</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Please try again later or contact support.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Job Seekers List */}
      {!isLoading && !isError && (
        <div className="grid gap-4">
          {filteredJobSeekers.length > 0 ? (
            filteredJobSeekers.map((jobSeeker) => (
              <Card key={jobSeeker.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/avatars/${jobSeeker.id}.png`} alt={jobSeeker.name} />
                      <AvatarFallback>{jobSeeker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Link href={`/job-seekers/${jobSeeker.id}`} className="hover:underline">
                          <h3 className="font-semibold text-lg">{jobSeeker.name}</h3>
                        </Link>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/job-seekers/${jobSeeker.id}`}>
                              <User className="mr-2 h-4 w-4" />
                              View Profile
                            </Link>
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive"
                                onClick={() => setSelectedJobSeeker(jobSeeker.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Job Seeker</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete {jobSeeker.name}'s profile? This action cannot be
                                  undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setSelectedJobSeeker(null)}>Cancel</Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleDeleteJobSeeker(jobSeeker.id)}
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                        <span>{jobSeeker.email}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{jobSeeker.phone}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{jobSeeker.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {jobSeeker.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {jobSeeker.skills.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{jobSeeker.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" className="h-8" asChild>
                          <Link href={resumePath} target="_blank" download>
                            <FileText className="mr-2 h-4 w-4" />
                            <Download className="h-3 w-3" />
                            Resume
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8" asChild>
                          <Link href={`/jobs?jobSeekerId=${jobSeeker.id}&jobSeekerName=${jobSeeker.name}`}>
                            <Search className="mr-2 h-4 w-4" />
                            Find Jobs
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="rounded-full bg-muted p-3">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No job seekers found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  {searchQuery
                    ? `No job seekers match your search for "${searchQuery}"`
                    : "You haven't added any job seekers yet"}
                </p>
                <Button asChild>
                  <Link href="/job-seekers/add">
                    <Plus className="mr-2 h-4 w-4" /> Add Job Seeker
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
