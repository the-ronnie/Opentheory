'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, AlertCircle } from 'lucide-react';
import { useRegisterMutation } from '../../apiSlice/userApiSlice';
import { useSendWelcomeEmailMutation } from '../../apiSlice/emailAuthApiSlice';
import { useUser } from './UserProvider';
import EmailVerification from './EmailVerification';
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

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  redirectTo?: string;
}

export default function RegisterForm({ redirectTo = '/dashboard' }: RegisterFormProps) {
  const [register, { isLoading }] = useRegisterMutation();
  const [sendWelcomeEmail] = useSendWelcomeEmailMutation();
  const router = useRouter();
  const { setUser } = useUser();
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Email verification states
  const [showVerification, setShowVerification] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState('');
  const [formValues, setFormValues] = useState<RegisterFormValues | null>(null);
  
  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // Step 1: Start email verification process
  const handleStartVerification = async (values: RegisterFormValues) => {
    setGeneralError(null);
    setEmailToVerify(values.email);
    setFormValues(values);
    setShowVerification(true);
  };
  
  // Step 2: Handle successful verification and complete registration
  const handleVerificationSuccess = async () => {
    if (!formValues) return;
    
    try {
      // Register the user after successful email verification
      const userData = await register(formValues).unwrap();
      setUser(userData);
      
      // Send welcome email
      await sendWelcomeEmail({ 
        email: formValues.email,
        name: formValues.name
      }).unwrap();
      
      router.push(redirectTo);
    } catch (err: any) {
      setGeneralError(err.data?.message || 'Failed to create account. Please try again.');
      setShowVerification(false);
    }
  };
  
  // Cancel verification
  const handleCancelVerification = () => {
    setShowVerification(false);
  };

  // Form submission handler - doesn't register user yet, just starts verification
  async function onSubmit(values: RegisterFormValues) {
    setGeneralError(null);
    handleStartVerification(values);
  }

  return (
    <>
      {!showVerification ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      {...field} 
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      {...field} 
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      {...field} 
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {generalError && (
              <Alert variant="destructive" className="mt-5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Continue
            </Button>
          </form>
        </Form>
      ) : (
        <EmailVerification 
          email={emailToVerify}
          onVerified={handleVerificationSuccess}
          onCancel={handleCancelVerification}
        />
      )}
    </>
  );
}