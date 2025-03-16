import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Forward request to actual backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}/team`, {
      headers: {
        Authorization: `Bearer ${sessionCookie.value}`,
      },
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch user team' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user team:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
