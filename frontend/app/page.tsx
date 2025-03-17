'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, CheckCircle, FileSearch, Search, Star, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Navbar } from "../components/navbar"; 

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Add the Navbar component */}
      <Navbar />
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                  Find Your Dream Job Today
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  Connect with top companies and discover opportunities that match your skills and aspirations.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-black hover:bg-gray-800 text-white" size="lg" asChild>
                  <Link href="/sign-up">
                    Search Jobs
                    <Search className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" className="text-black border-black hover:bg-gray-100" size="lg" asChild>
                  <Link href="/sign-up">
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative aspect-video rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/placeholder.svg?height=720&width=1280"
                alt="Job Search Platform"
                width={1280}
                height={720}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
                Why Choose Us
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to find your next career opportunity.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-gray-100 rounded-full">
                <Briefcase className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Thousands of Jobs</h3>
              <p className="text-center text-gray-600">
                Access a vast database of job listings across various industries and locations.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-gray-100 rounded-full">
                <Users className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Expert Consultants</h3>
              <p className="text-center text-gray-600">
                Get guidance from industry professionals to help you land your dream job.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-gray-100 rounded-full">
                <Star className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Premium Companies</h3>
              <p className="text-center text-gray-600">
                Connect with top-tier organizations looking for talent just like you.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-gray-100 rounded-full">
                <FileSearch className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Smart Job Matching</h3>
              <p className="text-center text-gray-600">
                Find perfect job matches based on your skills and experience.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2 bg-gray-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Skill Matching</h3>
              <p className="text-center text-gray-600">
                Match with jobs based on your individual skills and qualifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">Ready to Start Your Job Search?</h2>
              <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create an account today and take the first step towards your next career opportunity.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-black hover:bg-gray-800 text-white" size="lg" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <Button variant="outline" className="text-black border-black hover:bg-gray-100" size="lg" asChild>
                <Link href="/support">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}