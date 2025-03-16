import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET team invitations
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

    // Forward request to actual backend API
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/teams/${teamId}/invitations`,
      {
        headers: {
          Authorization: `Bearer ${sessionCookie.value}`,
        },
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch team invitations' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching team invitations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST to create new invitation
export async function POST(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const teamId = params.teamId;
    const { email, role } = await request.json();
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Forward request to actual backend API
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/teams/${teamId}/invitations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionCookie.value}`,
        },
        body: JSON.stringify({ email, role }),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { message: errorData.message || 'Failed to create invitation' },
        { status: backendResponse.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
