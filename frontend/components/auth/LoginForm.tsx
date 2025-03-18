'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, AlertCircle } from 'lucide-react';
import { useUser } from './UserProvider';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '../ui/alert';
import React from 'react';
import { useLoginMutation } from '../../apiSlice/userApiSlice';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  redirectTo?: string;
}

export default function LoginForm({ redirectTo = '/' }: LoginFormProps) {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const { setUser } = useUser();
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setGeneralError(null);
    
    try {
      // Use the RTK Query mutation instead of manual fetch
      const userData = await login(values).unwrap();
      setUser(userData);
      router.push(redirectTo);
    } catch (err: any) {
      setGeneralError(err.data?.error || 'Failed to sign in. Please check your credentials.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="name@example.com" 
                  {...field} 
                  autoComplete="email"
                  className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
        
        {generalError && (
          <Alert variant="destructive" className="mt-4 bg-red-50 border border-red-100 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}
        
        <Button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 text-white py-2.5 rounded-md font-medium transition-colors mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
}