import React from 'react';
import { redirect } from 'next/navigation';
import { Settings } from './settings';
import { getTeamForUser, getUser } from '../../../../backend/lib/db/queries';
import { headers } from 'next/headers';

export default async function SettingsPage() {
  const user = await getUser({ headers: headers() });

  if (!user) {
    redirect('/sign-in');
  }

  const teamData = await getTeamForUser(user.id);

  if (!teamData) {
    throw new Error('Team not found');
  }

  return <Settings teamData={teamData} />;
}
