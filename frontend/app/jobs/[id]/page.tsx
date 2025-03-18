"use client";

import React from 'react';
import { useGetJobByIdQuery } from '../../../apiSlice/jobsApiSlice';
import { useRouter } from 'next/navigation';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  
  const { data: job, isLoading, isError, error } = useGetJobByIdQuery(id);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBackClick = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load job details</p>
          <p className="mt-2 text-sm text-red-500">{error?.toString()}</p>
          <button 
            onClick={handleBackClick}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={handleBackClick}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
          </svg>
          Back to Jobs
        </button>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <p className="mt-2 text-xl text-gray-600">{job.company}</p>
                <div className="mt-2 flex items-center text-gray-500">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  <span>{job.location}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {job.status === 'active' ? 'Active' : 'Closed'}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p className="mt-1 text-base text-gray-900">{job.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Salary</h3>
                    <p className="mt-1 text-base text-gray-900">${job.salary.toLocaleString()} per year</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Posted Date</h3>
                    <p className="mt-1 text-base text-gray-900">{formatDate(job.postedDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Application Deadline</h3>
                    <p className="mt-1 text-base text-gray-900">{formatDate(job.deadline)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Required Skills</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
              <div className="mt-4 prose prose-blue max-w-none">
                <p className="text-base text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {job.status === 'active' && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Interested in this position?</h2>
                <div className="mt-4">
                  <button className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Apply Now
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    Or contact your consultant for more information about this role.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}