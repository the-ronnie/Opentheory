import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET team members
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

    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/teams/${teamId}/members`, {
      headers: {
        Authorization: `Bearer ${sessionCookie.value}`,
      },
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch team members' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new team member (invitation)
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

    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/teams/${teamId}/invitations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionCookie.value}`,
      },
      body: JSON.stringify({ email, role }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { message: errorData.message || 'Failed to invite team member' },
        { status: backendResponse.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error inviting team member:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
