import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const teamId = params.teamId;
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/teams/${teamId}/activities`,
      {
        headers: {
          Authorization: `Bearer ${sessionCookie.value}`,
        },
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch activity logs' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
