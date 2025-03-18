"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { useCreateJobSeekerMutation } from "../../../apiSlice/jobSeekersApiSlice";
import { useUser } from '../../../components/auth/UserProvider';
import React from "react";
const jobseekerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Phone number is required"),
    skills: z.string().trim().min(2, "Skills must be at least 2 characters"),
    experience: z.coerce.number().min(0, "Experience is required"),
    education: z.string().trim().min(2, "Education must be at least 2 characters"),
    location: z.string().trim().min(2, "Location must be at least 2 characters"),
    about: z.string().trim().min(2, "About must be at least 2 characters"),
    resume: z.any().optional(),
  });


export default function AddJobseekerPage() {
  const { user } = useUser();
  console.log(user);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(jobseekerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      skills: "",
      experience: 0,
      education: "",
      location: "",
      about: "",
    }
  });

  const [createJobSeeker] = useCreateJobSeekerMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  // Watch resume field to check if file is selected
  const resumeFile = watch("resume");

  const onSubmit = async (data: any) => {
    setServerError(null);
    setIsSuccess(false);

    if (!user?.id) {
      setServerError("User ID is missing. Please log in again.");
      return;
    }

    // Check if a file was selected
    const fileList = data.resume;
    if (!fileList || fileList.length === 0) {
      setServerError("Please select a resume file.");
      return;
    }

    try {
      const formattedData = {
        ...data,
        consultantId: user.id,
        skills: data.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
      };
      console.log("Formatted data:", formattedData);
      await createJobSeeker(formattedData).unwrap();
      setIsSuccess(true);
      reset();
      setFileSelected(false); // Reset to false instead of null
    } catch (error: any) {
      setServerError(error?.data?.message || "Submission failed. Try again.");
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileSelected(!!(e.target.files && e.target.files.length > 0));
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold">Add Jobseeker</h2>
      <Card>
        <CardHeader>
          <CardTitle>Jobseeker Details</CardTitle>
          <CardDescription>Enter the jobseeker's information below.</CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && <Alert variant="destructive"><AlertDescription>{serverError}</AlertDescription></Alert>}
          {isSuccess && <Alert><AlertTitle>Success!</AlertTitle><AlertDescription>Jobseeker added successfully.</AlertDescription></Alert>}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input {...register("name")} placeholder="Full Name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input {...register("email")} placeholder="Email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input {...register("phone")} placeholder="Phone" />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Textarea {...register("skills")} placeholder="Skills (comma-separated)" />
              {errors.skills && <p className="text-red-500 text-sm">{errors.skills.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Experience (Years)</label>
              <Input 
                {...register("experience", { valueAsNumber: true })} 
                type="number" 
                min="0"
                placeholder="Experience (Years)" 
              />
              {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Education</label>
              <Input {...register("education")} placeholder="Education" />
              {errors.education && <p className="text-red-500 text-sm">{errors.education.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input {...register("location")} placeholder="Location" />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">About the Jobseeker</label>
              <Textarea {...register("about")} placeholder="About the Jobseeker" />
              {errors.about && <p className="text-red-500 text-sm">{errors.about.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Resume</label>
              <Input 
                {...register("resume")} 
                type="file" 
                onChange={handleFileChange}
              />
              {!fileSelected && <p className="text-amber-500 text-sm">Resume is required</p>}
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}