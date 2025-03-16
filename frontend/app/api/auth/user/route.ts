import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_for_development';

export async function GET() {
  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      // Verify the JWT from the cookie
      const decoded = jwt.verify(sessionCookie.value, JWT_SECRET);
      
      // Forward request to actual backend API to get fresh user data
      const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${sessionCookie.value}`,
        },
      });

      if (!backendResponse.ok) {
        return NextResponse.json(
          { message: 'Failed to fetch user data' },
          { status: backendResponse.status }
        );
      }

      const userData = await backendResponse.json();
      return NextResponse.json(userData);
    } catch (jwtError) {
      console.error('JWT validation error:', jwtError);
      return NextResponse.json(
        { message: 'Invalid session' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to get user data' },
      { status: 500 }
    );
  }
}
