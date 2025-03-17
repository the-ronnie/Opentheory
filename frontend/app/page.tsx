'use client';

import { Button } from '../components/ui/button';
import { ArrowRight, Briefcase, Search, Star, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-orange-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with top companies and discover opportunities that match your skills and aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg">
                  Search Jobs
                  <Search className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sign-up"> {/* Fixed: /signup → /sign-up */}
                <Button variant="outline" className="px-6 py-3 text-lg">
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Thousands of Jobs</h3>
              <p className="text-gray-600">Access a vast database of job listings across various industries and locations.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Consultants</h3>
              <p className="text-gray-600">Get guidance from industry professionals to help you land your dream job.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="bg-orange-100 rounded-full p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Star className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Companies</h3>
              <p className="text-gray-600">Connect with top-tier organizations looking for talent just like you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Job Search?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Create an account today and take the first step towards your next career opportunity.
            </p>
            <Link href="/sign-up"> {/* Fixed: /signup → /sign-up */}
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}