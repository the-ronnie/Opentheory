"use client";

import React, { useState, useEffect } from 'react';
import { useGetAllActiveJobsQuery, Job } from '../../apiSlice/jobsApiSlice';
import { useGetJobSeekersForConsultantQuery } from '../../apiSlice/jobSeekersApiSlice';
import { JobSeeker } from '../../apiSlice/jobSeekersApiSlice';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedJobSeekers, setSelectedJobSeekers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[] | null>(null);
  
  // Get the consultant ID from local storage or context
  const consultantId = localStorage.getItem('consultantId') || '';
  
  // Function to navigate back to home page
  const goToHomePage = () => {
    router.push('/');
  };
  
  // Fetch job seekers for this consultant
  const { data: jobSeekers, isLoading: isLoadingJobSeekers } = useGetJobSeekersForConsultantQuery(
    { consultantId }, 
    { skip: !consultantId }
  );
  
  // Use getAllActiveJobs to get all jobs
  const {
    data: jobs,
    isLoading: isLoadingJobs,
    isError,
    error
  } = useGetAllActiveJobsQuery({
    limit: pageSize * 10, // Fetch more to allow client-side filtering
    offset: 0
  });

  // This effect collects skills from selected job seekers
  useEffect(() => {
    if (!jobSeekers) return;
    
    const skills: string[] = [];
    
    selectedJobSeekers.forEach(id => {
      const jobSeeker = jobSeekers.find(js => js.id === id);
      if (jobSeeker) {
        jobSeeker.skills.forEach(skill => {
          if (!skills.includes(skill)) {
            skills.push(skill);
          }
        });
      }
    });
    
    setSelectedSkills(skills);
  }, [selectedJobSeekers, jobSeekers]);
  
  // This effect handles client-side filtering based on skills and search term
  useEffect(() => {
    if (!jobs) return;
    
    let filtered = [...jobs];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.company.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term)
      );
    }
    
    // Filter by skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(job => 
        job.skills.some(skill => selectedSkills.includes(skill))
      );
    }
    
    // Apply pagination
    const paginatedJobs = filtered.slice(page * pageSize, (page + 1) * pageSize);
    setFilteredJobs(paginatedJobs);
  }, [jobs, selectedSkills, searchTerm, page, pageSize]);

  const handleNextPage = () => {
    const displayedJobs = filteredJobs || jobs;
    if (displayedJobs && ((page + 1) * pageSize) < displayedJobs.length) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(prev => prev - 1);
    }
  };
  
  const handleJobSeekerSelect = (id: string) => {
    setSelectedJobSeekers(prev => 
      prev.includes(id)
        ? prev.filter(jsId => jsId !== id)
        : [...prev, id]
    );
  };
  
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when search changes
  };
  
  const clearFilters = () => {
    setSelectedJobSeekers([]);
    setSelectedSkills([]);
    setSearchTerm('');
    setFilteredJobs(null);
    setPage(0);
  };

  const isLoading = isLoadingJobs || isLoadingJobSeekers;
  const displayedJobs = filteredJobs || jobs?.slice(page * pageSize, (page + 1) * pageSize);
  const totalFilteredCount = filteredJobs ? filteredJobs.length : jobs?.length || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load jobs data</p>
          <p className="mt-2 text-sm text-red-500">{error?.toString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
          <button
            onClick={goToHomePage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l-9 9" />
            </svg>
            Return to Home
          </button>
        </div>
        
        {/* Search and filter section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Jobs</h2>
          
          <div className="mb-4">
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Search by title, company or description
            </label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Search jobs..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {jobSeekers && jobSeekers.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Job Seeker Skills</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {jobSeekers.map(seeker => (
                  <div key={seeker.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`seeker-${seeker.id}`}
                      checked={selectedJobSeekers.includes(seeker.id)}
                      onChange={() => handleJobSeekerSelect(seeker.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`seeker-${seeker.id}`} className="ml-2 text-sm text-gray-700">
                      {seeker.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedSkills.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {(selectedJobSeekers.length > 0 || searchTerm.trim() !== '') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        {/* Jobs listing */}
        {!displayedJobs || displayedJobs.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-lg text-gray-500">No jobs available based on your filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            <div className="flex justify-between mt-8">
              <button 
                onClick={handlePrevPage}
                disabled={page === 0}
                className={`px-4 py-2 rounded-md ${
                  page === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>
              <span className="py-2 px-4">
                Page {page + 1} 
                {totalFilteredCount > 0 && ` of ${Math.ceil(totalFilteredCount / pageSize)}`}
              </span>
              <button 
                onClick={handleNextPage}
                disabled={!displayedJobs || displayedJobs.length < pageSize}
                className={`px-4 py-2 rounded-md ${
                  !displayedJobs || displayedJobs.length < pageSize
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Truncate description if too long
  const truncateDescription = (text: string, maxLength: number = 150) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg hover:shadow-md transition-shadow">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {job.company} • {job.location}
            </p>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
            ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {job.status === 'active' ? 'Active' : 'Closed'}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {truncateDescription(job.description)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{job.type}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Salary</dt>
            <dd className="mt-1 text-sm text-gray-900">${job.salary.toLocaleString()}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Posted On</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(job.postedDate)}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Application Deadline</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(job.deadline)}</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Required Skills</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {skill}
                  </span>
                ))}
              </div>
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <a 
            href={`/jobs/${job.id}`} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}