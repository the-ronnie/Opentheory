'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2 } from 'lucide-react';
import { useLoginMutation, useRegisterMutation } from '../../apiSlice/userApiSlice';
import { useUser } from '../../components/auth/UserProvider';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const router = useRouter();
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const { setUser } = useUser();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setPasswordMatchError(null);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      if (mode === 'signin') {
        const userData = await login({ email, password }).unwrap();
        setUser(userData);
      } else {
        const name = formData.get('name') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        
        if (password !== confirmPassword) {
          setPasswordMatchError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        
        const userData = await register({ name, email, password }).unwrap();
        setUser(userData);
      }
      
      // Redirect after successful authentication
      router.push(redirect);
      
    } catch (err: any) {
      setError(err.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-100 py-5 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="bg-black w-10 h-10 flex items-center justify-center rounded-full">
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
          <span className="ml-3 text-xl font-semibold tracking-tight">
          <Link href="/" className="hover:text-black transition-colors">
            OpenTheory
          </Link>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <h1 className="text-2xl font-medium text-center mb-6 text-gray-800">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>

          {mode === 'signin' && (
            <p className="text-sm text-center text-gray-500 mb-6">
              Demo credentials: test@example.com / password123
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name field for signup */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={50}
                  className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={50}
                defaultValue={mode === 'signin' ? 'test@example.com' : ''}
                className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="name@example.com"
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                minLength={6}
                maxLength={100}
                defaultValue={mode === 'signin' ? 'password123' : ''}
                className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password field for signup */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  maxLength={100}
                  className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="••••••••"
                />
                {passwordMatchError && (
                  <p className="text-red-600 text-xs mt-1">{passwordMatchError}</p>
                )}
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-2.5 rounded-md font-medium transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Please wait...
                </>
              ) : (
                mode === 'signin' ? 'Sign in' : 'Create account'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-gray-400 text-sm">
              {mode === 'signin' ? 'New to OpenTheory?' : 'Already have an account?'}
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div>
            <Link
              href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                redirect ? `?redirect=${redirect}` : ''
              }`}
              className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
            >
              {mode === 'signin' ? 'Create an account' : 'Sign in to existing account'}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-gray-100 bg-white">
        <div className="flex flex-wrap justify-center gap-x-8 text-sm text-gray-500">
          <Link href="#" className="hover:text-black transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-black transition-colors">
            Terms of Service
          </Link>
          <Link href="/support" className="hover:text-black transition-colors">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Login;