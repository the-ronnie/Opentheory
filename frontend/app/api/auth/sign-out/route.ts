import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ipAddress } = body;
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    // If there's a session cookie and a backend to notify
    if (sessionCookie && process.env.BACKEND_URL) {
      try {
        // Forward to backend to log activity and clean up
        await fetch(`${process.env.BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionCookie.value}`,
          },
          body: JSON.stringify({ ipAddress }),
        });
      } catch (backendError) {
        // Log but continue, as we still want to clear the cookie
        console.error('Backend logout notification failed:', backendError);
      }
    }

    // Clear the session cookie
    cookieStore.delete('session');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sign-out error:', error);
    
    // Still try to delete the cookie even if there was an error
    cookies().delete('session');
    
    return NextResponse.json(
      { message: 'Error during sign-out' },
      { status: 500 }
    );
  }
}
