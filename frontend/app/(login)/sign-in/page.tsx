'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LoginForm from '../../../components/auth/LoginForm';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-orange-500 w-10 h-10 flex items-center justify-center rounded-full">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
            </svg>
          </div>
          <span className="ml-2 text-xl font-bold">JobBoard</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-normal text-center mb-8">
            Log in to your account
          </h1>

          <p className="text-sm text-center text-gray-500 mb-6">
            Demo credentials: test@example.com / password123
          </p>

          <LoginForm redirectTo={redirect} />

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">
              New to JobBoard?
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div>
            <Link
              href={`/sign-up${redirect ? `?redirect=${redirect}` : ''}`}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Create an account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6">
        <div className="flex flex-wrap justify-center gap-x-6 text-sm text-gray-600">
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
