"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import Navbar from "@/components/navbar"
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { useCreateJobSeekerMutation } from "../../../apiSlice/jobSeekersApiSlice";
import { useUser } from '../../../components/auth/UserProvider';
import React from "react";

// Update the schema to handle resume as a string path
const jobseekerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  skills: z.string().trim().min(2, "Skills must be at least 2 characters"),
  experience: z.coerce.number().min(0, "Experience is required"),
  education: z.string().trim().min(2, "Education must be at least 2 characters"),
  location: z.string().trim().min(2, "Location must be at least 2 characters"),
  about: z.string().trim().min(2, "About must be at least 2 characters"),
  resume: z.string().min(1, "Resume path is required"),
});

export default function AddJobseekerPage() {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
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
      resume: "",
    }
  });

  const [createJobSeeker] = useCreateJobSeekerMutation();
  const [serverError, setServerError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(true);
      setFileName(file.name);
      
      // Create a mock file path for demonstration
      // In a real application, you might have a server-side function to store the file
      // and return the actual path
      const mockFilePath = `/uploads/${user?.id}/${Date.now()}_${file.name}`;
      
      // Set the resume value in the form
      setValue("resume", mockFilePath, { shouldValidate: true });
    } else {
      setFileSelected(false);
      setFileName("");
      setValue("resume", "", { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    setServerError(null);
    setIsSuccess(false);

    if (!user?.id) {
      setServerError("user missing");
      return;
    }

    if (!data.resume) {
      setServerError("Please select a resume file.");
      return;
    }

    try {
      // In a real application:
      // 1. Upload the file to your storage (e.g., S3, local server)
      // 2. Get the actual file path/URL
      // 3. Store that path in the database
      
      const formattedData = {
        ...data,
        consultantId: user.id,
        skills: data.skills.split(",").map(s => s.trim()).filter(Boolean),
        // The resume is already set in the form data
      };
      
      console.log("Formatted data:", formattedData);
      await createJobSeeker(formattedData).unwrap();
      setIsSuccess(true);
      reset();
      setFileSelected(false);
      setFileName("");
    } catch (error) {
      setServerError(error?.data?.message || "Submission failed. Try again.");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-2 pt-6">
      <Navbar />
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
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input {...register("email")} placeholder="Email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input {...register("phone")} placeholder="Phone" />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Textarea {...register("skills")} placeholder="Skills (comma-separated)" />
              {errors.skills && <p className="text-red-500 text-sm">{errors.skills.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Experience (Years)</label>
              <Input 
                {...register("experience", { valueAsNumber: true })} 
                type="number" 
                min="0"
                placeholder="Experience (Years)" 
              />
              {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Education</label>
              <Input {...register("education")} placeholder="Education" />
              {errors.education && <p className="text-red-500 text-sm">{errors.education.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input {...register("location")} placeholder="Location" />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">About the Jobseeker</label>
              <Textarea {...register("about")} placeholder="About the Jobseeker" />
              {errors.about && <p className="text-red-500 text-sm">{errors.about.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Resume</label>
              <Input 
                type="file" 
                onChange={handleFileChange}
              />
              {/* Hidden input to store the file path */}
              <input type="hidden" {...register("resume")} />
              {!fileSelected && <p className="text-amber-500 text-sm">Resume is required</p>}
              {fileSelected && <p className="text-green-500 text-sm">Selected: {fileName}</p>}
              {errors.resume && <p className="text-red-500 text-sm">{errors.resume.message}</p>}
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
