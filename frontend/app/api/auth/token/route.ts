import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_for_development';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Don't include sensitive data in the JWT
    const sanitizedPayload = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      teamId: payload.teamId,
      expires: payload.expires,
    };
    
    // Sign JWT with expiration (24 hours by default)
    const token = jwt.sign(sanitizedPayload, JWT_SECRET, {
      expiresIn: '24h',
    });
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Token signing error:', error);
    return NextResponse.json(
      { message: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
