import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, ipAddress } = body;

    // Forward request to actual backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, ipAddress }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: data.message || 'Invalid credentials' },
        { status: backendResponse.status }
      );
    }

    // Return the token and user data
    return NextResponse.json({
      token: data.token,
      user: data.user,
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { message: 'An error occurred during sign-in' },
      { status: 500 }
    );
  }
}
