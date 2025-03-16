import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, teamName, ipAddress } = body;

    // Forward request to actual backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name, 
        email, 
        password, 
        teamName,
        ipAddress,
      }),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: data.message || 'Registration failed' },
        { status: backendResponse.status }
      );
    }

    // Return the token and user data
    return NextResponse.json({
      token: data.token,
      user: data.user,
    });
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
