"use client"
import { useState, useEffect } from "react"
import React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  GraduationCap as Graduation,
  Mail,
  MapPin,
  Phone,
  Search,
  Trash2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"

export default function JobSeekerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
    console.log(id);
    console.log("is it coming hereb again");
  const [jobSeeker, setJobSeeker] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchJobSeeker() {
      try {
        const response = await fetch(`http://localhost:5000/api/job-seekers/${id}`)
        if (!response.ok) throw new Error("Job Seeker not found")
        const data = await response.json()
        setJobSeeker(data)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchJobSeeker()
  }, [id])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>
  }

  if (error || !jobSeeker) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" asChild>
            <Link href="/job-seekers">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Job Seekers
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <h3 className="mt-4 text-lg font-semibold">Job Seeker Not Found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              The job seeker you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/job-seekers">Go Back to Job Seekers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-2" asChild>
            <Link href="/job-seekers">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{jobSeeker.name}</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Profile Overview */}
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={jobSeeker.avatar} alt={jobSeeker.name} />
                <AvatarFallback>{jobSeeker.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h3 className="text-2xl font-bold">{jobSeeker.name}</h3>
                <p className="text-muted-foreground">{jobSeeker.experience} Years Experience</p>
                <p className="text-muted-foreground">{jobSeeker.location}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{jobSeeker.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{jobSeeker.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{jobSeeker.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Graduation className="h-4 w-4 text-muted-foreground" />
                <span>{jobSeeker.education}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Added on {formatDate(jobSeeker.addedDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Tabs */}
        <Card className="md:col-span-4">
          <CardHeader>
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="space-y-4 pt-4">
                <CardTitle>About</CardTitle>
                <CardDescription>{jobSeeker.about}</CardDescription>
              </TabsContent>
              <TabsContent value="skills" className="pt-4">
                <CardTitle>Skills</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {jobSeeker.skills.map((skill: string) => (
                    <Badge key={skill} className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
