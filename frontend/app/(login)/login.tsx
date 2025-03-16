'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { signIn, signUp } from './actions';
import React from 'react';
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';

// Define action state type
type ActionState = {
  message?: string;
};

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    
    try {
      // Add IP address
      formData.append('_ip', '127.0.0.1');
      
      // Call the appropriate server action
      const result = mode === 'signin' 
        ? await signIn(formData)
        : await signUp(formData);
      
      // If there's a message, it's an error
      if (result?.message) {
        setError(result.message);
        setIsSubmitting(false);
      }
      // Otherwise the action redirected successfully
      
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 space-y-2">
          <h2 className="text-2xl font-bold text-center">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-gray-600 text-center">
            {mode === 'signin'
              ? "Sign in to access your account"
              : 'Join our platform and start managing your tasks'}
          </p>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden fields */}
            {redirect && (
              <input type="hidden" name="redirect" value={redirect} />
            )}
            {priceId && <input type="hidden" name="priceId" value={priceId} />}
            {inviteId && (
              <input type="hidden" name="inviteId" value={inviteId} />
            )}

            {/* Form fields */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={mode === 'signin' ? 'Enter your password' : 'Create a password'}
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === 'signin'
              ? "Don't have an account? "
              : 'Already have an account? '}
            <Link
              href={mode === 'signin' ? '/sign-up' : '/sign-in'}
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;