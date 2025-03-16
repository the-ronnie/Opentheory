'use client';

import { useState } from 'react';
// Remove backend imports
// import { getUserWithTeam } from '../../../../backend/lib/db/queries';
// import { User } from '../../../../backend/lib/db/schema';
import { TeamMembersList } from '../../../components/dashboard/team/members-list';
import { InvitationsList } from '../../../components/dashboard/team/invitations-list';
import { InviteForm } from '../../../components/dashboard/team/invite-form';
import { useUser } from '../../../providers/UserProvider';
import { useGetUserTeamQuery } from '../../../services/teamApi';
import { User } from '../../../services/authApi';

export default function TeamPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('members');
  const { data: team, isLoading } = useGetUserTeamQuery(user?.id || 0, {
    skip: !user?.id
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Team Settings</h1>
      
      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'members'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('invitations')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'invitations'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Invitations
          </button>
        </nav>
      </div>
      
      {activeTab === 'members' ? (
        <div>
          <h2 className="text-lg font-medium mb-4">Team Members</h2>
          <TeamMembersList teamId={team.id} currentUserId={user?.id || 0} />
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-medium mb-4">Pending Invitations</h2>
          <div className="mb-6">
            <InviteForm teamId={team.id} />
          </div>
          <InvitationsList teamId={team.id} />
        </div>
      )}
    </div>
  );
}
