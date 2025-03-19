"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import Navbar from "@/components/navbar";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";
import { useCreateJobSeekerMutation } from "../../../apiSlice/jobSeekersApiSlice";
import { useUser } from '../../../components/auth/UserProvider';
import Link from "next/link";

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
    trigger,
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
  const [skillsArray, setSkillsArray] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("basic");

  // Watch form values to dynamically check progress
  const formValues = watch();
  
  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = Object.keys(jobseekerSchema.shape);
    let filledFields = 0;
    
    fields.forEach(field => {
      if (formValues[field] && 
          (typeof formValues[field] === 'number' || formValues[field].trim() !== '')) {
        filledFields++;
      }
    });
    
    return Math.round((filledFields / fields.length) * 100);
  };

  // Update progress when form values change
  useEffect(() => {
    setProgress(calculateProgress());
  }, [formValues]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(true);
      setFileName(file.name);
      
      // Create a mock file path for demonstration
      const mockFilePath = `/uploads/${user?.id}/${Date.now()}_${file.name}`;
      
      // Set the resume value in the form
      setValue("resume", mockFilePath, { shouldValidate: true });
    } else {
      setFileSelected(false);
      setFileName("");
      setValue("resume", "", { shouldValidate: true });
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      setFileSelected(true);
      setFileName(file.name);
      
      const mockFilePath = `/uploads/${user?.id}/${Date.now()}_${file.name}`;
      setValue("resume", mockFilePath, { shouldValidate: true });
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Add skill to array
  const addSkill = () => {
    if (skillInput.trim() !== "" && !skillsArray.includes(skillInput.trim())) {
      const newSkills = [...skillsArray, skillInput.trim()];
      setSkillsArray(newSkills);
      setSkillInput("");
      
      // Update the form value
      setValue("skills", newSkills.join(", "), { shouldValidate: true });
    }
  };

  // Remove skill from array
  const removeSkill = (skillToRemove: string) => {
    const newSkills = skillsArray.filter(skill => skill !== skillToRemove);
    setSkillsArray(newSkills);
    
    // Update the form value
    setValue("skills", newSkills.join(", "), { shouldValidate: true });
  };

  // Handle skill input keydown
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      addSkill();
    }
  };

  // Parse skills when form loads from existing value
  useEffect(() => {
    const initialSkills = watch("skills");
    if (initialSkills) {
      setSkillsArray(initialSkills.split(",").map(s => s.trim()).filter(Boolean));
    }
  }, []);

  // Move to next section
  const handleNextSection = async (currentSection: string) => {
    let fieldsToValidate: string[] = [];
    
    if (currentSection === "basic") {
      fieldsToValidate = ["name", "email", "phone", "location"];
    } else if (currentSection === "professional") {
      fieldsToValidate = ["skills", "experience", "education"];
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      if (currentSection === "basic") {
        setActiveSection("professional");
      } else if (currentSection === "professional") {
        setActiveSection("details");
      }
    }
  };

  const onSubmit = async (data) => {
    setServerError(null);
    setIsSuccess(false);

    if (!user?.id) {
      setServerError("User authentication required. Please login again.");
      return;
    }

    if (!data.resume) {
      setServerError("Please select a resume file.");
      return;
    }

    try {
      const formattedData = {
        ...data,
        consultantId: user.id,
        skills: data.skills.split(",").map(s => s.trim()).filter(Boolean),
      };
      
      await createJobSeeker(formattedData).unwrap();
      setIsSuccess(true);
      reset();
      setFileSelected(false);
      setFileName("");
      setSkillsArray([]);
      
      // Reset to first section
      setActiveSection("basic");
    } catch (error) {
      setServerError(error?.data?.message || "Submission failed. Please try again.");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Job Seeker</h1>
            <p className="text-gray-500 mt-1">Add a new job seeker to your professional network</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/job-seekers">Cancel</Link>
          </Button>
        </div>
        
        {isSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-700">
              Job seeker added successfully.
              <div className="mt-2 flex space-x-4">
                <Button size="sm" asChild>
                  <Link href="/job-seekers">View All Job Seekers</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsSuccess(false)}>
                  Add Another
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Job Seeker Profile</CardTitle>
                <CardDescription>
                  Fill out the job seeker's information to help match them with the right opportunities.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <div className="flex border-b">
                    <button
                      type="button"
                      className={`py-2 px-4 text-sm font-medium ${activeSection === "basic" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
                      onClick={() => setActiveSection("basic")}
                    >
                      Basic Info
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-4 text-sm font-medium ${activeSection === "professional" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
                      onClick={() => setActiveSection("professional")}
                    >
                      Professional
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-4 text-sm font-medium ${activeSection === "details" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
                      onClick={() => setActiveSection("details")}
                    >
                      Details & Resume
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} id="jobSeekerForm" className="space-y-6">
                  {/* Basic Info Section */}
                  {activeSection === "basic" && (
                    <div className="space-y-5">
                      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <Input 
                            {...register("name")} 
                            placeholder="Enter job seeker's full name"
                            className={errors.name ? "border-red-300" : ""}
                          />
                          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input 
                            {...register("email")} 
                            placeholder="professional@example.com"
                            className={errors.email ? "border-red-300" : ""}
                          />
                          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                      </div>
                      
                      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone</label>
                          <Input 
                            {...register("phone")} 
                            placeholder="+1 (555) 123-4567"
                            className={errors.phone ? "border-red-300" : ""}
                          />
                          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Location</label>
                          <Input 
                            {...register("location")} 
                            placeholder="City, State, Country"
                            className={errors.location ? "border-red-300" : ""}
                          />
                          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button 
                          type="button"
                          onClick={() => handleNextSection("basic")}
                        >
                          Next: Professional Info
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Professional Tab */}
                  {activeSection === "professional" && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Skills</label>
                        <div className="flex">
                          <Input 
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillKeyDown}
                            placeholder="Type a skill and press Enter (e.g. JavaScript, Project Management)"
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            onClick={addSkill} 
                            className="ml-2"
                            disabled={!skillInput.trim()}
                          >
                            Add
                          </Button>
                        </div>
                        
                        {/* Hidden input for form validation */}
                        <input type="hidden" {...register("skills")} />
                        
                        {/* Skills tags display */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {skillsArray.map((skill, index) => (
                            <div 
                              key={index}
                              className="py-1 px-3 bg-white text-black rounded-md border border-gray-200 flex items-center"
                            >
                              {skill}
                              <button
                                type="button"
                                className="h-4 w-4 p-0 ml-2 text-gray-500 hover:text-red-500"
                                onClick={() => removeSkill(skill)}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        {errors.skills && <p className="text-red-500 text-sm">{errors.skills.message}</p>}
                        {skillsArray.length > 0 && (
                          <p className="text-gray-500 text-xs">
                            {skillsArray.length} skill{skillsArray.length !== 1 ? 's' : ''} added
                          </p>
                        )}
                      </div>
                      
                      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Experience (Years)</label>
                          <Input 
                            {...register("experience", { valueAsNumber: true })} 
                            type="number" 
                            min="0"
                            className={errors.experience ? "border-red-300" : ""}
                          />
                          {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Education</label>
                          <Input 
                            {...register("education")} 
                            placeholder="Highest degree, Major, University"
                            className={errors.education ? "border-red-300" : ""}
                          />
                          {errors.education && <p className="text-red-500 text-sm">{errors.education.message}</p>}
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setActiveSection("basic")}
                        >
                          Back
                        </Button>
                        
                        <Button 
                          type="button"
                          onClick={() => handleNextSection("professional")}
                        >
                          Next: Upload Resume
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Details Tab */}
                  {activeSection === "details" && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">About the Job Seeker</label>
                        <Textarea 
                          {...register("about")} 
                          placeholder="Provide a brief description about the job seeker's background, career goals, and strengths..."
                          className={`min-h-[150px] ${errors.about ? "border-red-300" : ""}`}
                        />
                        {errors.about && <p className="text-red-500 text-sm">{errors.about.message}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Resume</label>
                        
                        <div 
                          className={`border-2 border-dashed rounded-md p-6 text-center ${
                            isDragging ? 'border-primary bg-primary/5' : 'border-gray-200'
                          } ${errors.resume ? "border-red-300" : ""}`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          {fileSelected ? (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">{fileName}</p>
                              <p className="text-xs text-gray-500">File selected successfully</p>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setFileSelected(false);
                                  setFileName("");
                                  setValue("resume", "", { shouldValidate: true });
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Drag and drop a resume file, or click to browse</p>
                              <p className="text-xs text-gray-500">Supports PDF, DOCX, RTF (Max 5MB)</p>
                              <Input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.rtf"
                                id="resume-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('resume-upload')?.click()}
                              >
                                Browse Files
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {/* Hidden input to store the file path */}
                        <input type="hidden" {...register("resume")} />
                        {errors.resume && <p className="text-red-500 text-sm">{errors.resume.message}</p>}
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setActiveSection("professional")}
                        >
                          Back
                        </Button>
                        
                        <Button 
                          type="submit"
                          form="jobSeekerForm"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Add Job Seeker"}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Right sidebar */}
          <div className="md:col-span-1">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Form Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Current Step</h4>
                  <div className="text-sm py-2 px-3 bg-gray-100 rounded-md">
                    {activeSection === "basic" && "1. Entering basic information"}
                    {activeSection === "professional" && "2. Adding professional details"}
                    {activeSection === "details" && "3. Uploading resume & additional info"}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4"></div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tips</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Use comma or Enter key to add multiple skills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Detailed profiles get more job matches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Resume is required for automatic skill extraction</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-3 bg-amber-50 rounded-md border border-amber-100">
                  <p className="text-sm text-amber-800">
                    All fields are required for optimal job matching
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}