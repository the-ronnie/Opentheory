import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_for_development';

export async function GET(request: Request) {
  try {
    // Get token from query parameter
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'Token is required' },
        { status: 400 }
      );
    }
    
    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return NextResponse.json({ valid: true, ...decoded });
    } catch (jwtError) {
      return NextResponse.json(
        { valid: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { valid: false, message: 'Failed to verify token' },
      { status: 500 }
    );
  }
}
