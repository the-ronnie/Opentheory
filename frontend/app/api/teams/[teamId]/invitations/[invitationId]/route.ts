import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// DELETE to remove an invitation
export async function DELETE(
  request: Request,
  { params }: { params: { teamId: string; invitationId: string } }
) {
  try {
    const { teamId, invitationId } = params;
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
      `${process.env.BACKEND_URL}/api/teams/${teamId}/invitations/${invitationId}`,
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
        { message: errorData.message || 'Failed to delete invitation' },
        { status: backendResponse.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
