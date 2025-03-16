import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// PATCH to update team member role
export async function PATCH(
  request: Request,
  { params }: { params: { teamId: string; userId: string } }
) {
  try {
    const { teamId, userId } = params;
    const { role } = await request.json();
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/teams/${teamId}/members/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionCookie.value}`,
        },
        body: JSON.stringify({ role }),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { message: errorData.message || 'Failed to update team member' },
        { status: backendResponse.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE to remove team member
export async function DELETE(
  request: Request,
  { params }: { params: { teamId: string; userId: string } }
) {
  try {
    const { teamId, userId } = params;
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/api/teams/${teamId}/members/${userId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionCookie.value}`,
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { message: errorData.message || 'Failed to remove team member' },
        { status: backendResponse.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
