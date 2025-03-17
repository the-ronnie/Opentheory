'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Globe, Loader2 } from 'lucide-react';
import { useLoginMutation, useRegisterMutation } from '../../apiSlice/userApiSlice';
import { useUser } from '../../components/auth/UserProvider';
import React from 'react';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { refetch } = useUser();
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  
  const isLoading = isLoginLoading || isRegisterLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      if (mode === 'signin') {
        await login({ email, password }).unwrap();
      } else {
        await register({ name, email, password }).unwrap();
      }
      
      // After successful login/register, update the user context
      await refetch();
      
      // Redirect as needed
      if (redirect === 'checkout' && priceId) {
        router.push(`/checkout?priceId=${priceId}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.data?.error || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-orange-500 w-10 h-10 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <circle cx="12" cy="12" r="10" fill="white" />
            </svg>
          </div>
          <span className="ml-2 text-xl font-bold">OpenTheory</span>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Globe className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-normal text-center mb-8">
            {mode === 'signin' ? 'Log in to your account' : 'Create your account'}
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name field for signup */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={50}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                maxLength={50}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
                minLength={8}
                maxLength={100}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Loading...
                </>
              ) : (
                mode === 'signin' ? 'Sign in' : 'Sign up'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">
              {mode === 'signin' ? 'New to OpenTheory?' : 'Already have an account?'}
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div>
            <Link
              href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                redirect ? `?redirect=${redirect}` : ''
              }${priceId ? `&priceId=${priceId}` : ''}`}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {mode === 'signin' ? 'Create an account' : 'Sign in to existing account'}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6">
        <div className="flex flex-wrap justify-center gap-x-6 text-sm text-gray-600">
          <Link href="#" className="hover:underline">
            Privacy & terms
          </Link>
          <Link href="#" className="hover:underline">
            Cookie policy
          </Link>
          <Link href="#" className="hover:underline">
            Terms of service
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Login;