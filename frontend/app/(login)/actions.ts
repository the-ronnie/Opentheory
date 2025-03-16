'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ActivityType } from '../../services/activityApi';

// Sign in schema
const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  ipAddress: z.string().optional(),
});

// Sign up schema
const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function signIn(formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    ipAddress: formData.get('_ip'),
  });

  if (!validatedFields.success) {
    return { message: validatedFields.error.errors[0].message };
  }

  try {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { message: errorData.message || 'Sign-in failed' };
    }

    const { token } = await response.json();
    const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    cookies().set({
      name: 'session',
      value: token,
      httpOnly: true,
      expires: expiresInOneDay,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    redirect('/dashboard');
  } catch (error) {
    console.error('Sign-in error:', error);
    return { message: 'An error occurred during sign-in' };
  }
}

export async function signUp(formData: FormData) {
  const validatedFields = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { message: validatedFields.error.errors[0].message };
  }

  try {
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { message: errorData.message || 'Registration failed' };
    }

    const { token } = await response.json();
    const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    cookies().set({
      name: 'session',
      value: token,
      httpOnly: true,
      expires: expiresInOneDay,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    redirect('/dashboard');
  } catch (error) {
    console.error('Sign-up error:', error);
    return { message: 'An error occurred during registration' };
  }
}

export async function signOut(formData: FormData) {
  try {
    await fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ipAddress: formData.get('_ip') as string
      }),
    });

    cookies().delete('session');
    redirect('/sign-in');
  } catch (error) {
    console.error('Sign-out error:', error);
    cookies().delete('session');
    redirect('/sign-in');
  }
}

export async function checkout(formData: FormData) {
  const priceId = formData.get('priceId') as string;
  const returnUrl = formData.get('returnUrl') as string;
  
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, returnUrl }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { message: errorData.message || 'Checkout failed' };
    }
    
    const { url } = await response.json();
    redirect(url);
  } catch (error) {
    console.error('Checkout error:', error);
    return { message: 'Error creating checkout session' };
  }
}
