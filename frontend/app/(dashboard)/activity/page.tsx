'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Settings, UserPlus, LogIn, LogOut, FileText, Edit, Trash, User } from 'lucide-react';
import { useUser } from '../../../providers/UserProvider';
import { useGetUserTeamQuery } from '../../../services/teamApi';
import { useGetTeamActivityLogsQuery } from '../../../services/activityApi';
import { ActivityLog } from '../../../services/activityApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

// Map of activity types to icons
const iconMap: Record<string, React.ComponentType<any>> = {
  LOGIN: LogIn,
  LOGOUT: LogOut,
  CREATE_DOCUMENT: FileText,
  EDIT_DOCUMENT: Edit,
  DELETE_DOCUMENT: Trash,
  INVITE_TEAM_MEMBER: UserPlus,
  REMOVE_TEAM_MEMBER: User,
  UPDATE_SETTINGS: Settings,
};

export default function ActivityPage() {
  const { user } = useUser();
  const { data: team } = useGetUserTeamQuery(user?.id || 0, {
    skip: !user?.id
  });
  
  const { data: activities, isLoading } = useGetTeamActivityLogsQuery(team?.id || 0, {
    skip: !team?.id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Activity Log</h1>
        <p className="text-gray-500">No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Activity Log</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {activities.map((activity) => {
              const Icon = iconMap[activity.action] || Settings;
              return (
                <li key={activity.id} className="py-4 flex items-start">
                  <div className="bg-orange-100 rounded-full p-2 mr-4">
                    <Icon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {getActivityDescription(activity)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function getActivityDescription(activity: ActivityLog): string {
  const userPart = activity.userName ? `${activity.userName}` : 'A user';
  
  switch (activity.action) {
    case 'LOGIN':
      return `${userPart} logged in`;
    case 'LOGOUT':
      return `${userPart} logged out`;
    case 'CREATE_DOCUMENT':
      return `${userPart} created a document`;
    case 'EDIT_DOCUMENT':
      return `${userPart} edited a document`;
    case 'DELETE_DOCUMENT':
      return `${userPart} deleted a document`;
    case 'INVITE_TEAM_MEMBER':
      return `${userPart} invited a team member`;
    case 'REMOVE_TEAM_MEMBER':
      return `${userPart} removed a team member`;
    case 'UPDATE_SETTINGS':
      return `${userPart} updated settings`;
    default:
      return `${userPart} performed an action`;
  }
}
