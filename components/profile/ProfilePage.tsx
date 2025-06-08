'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Calendar, Mail, User } from 'lucide-react';
import { Database } from '@/types/database.types';
import Navigation from '@/components/navigation/Navigation';
import config from '@/config';
import { useSession } from 'next-auth/react';
import ProfilePromptsTab from './ProfilePromptsTab';
import { EditProfileModal } from './EditProfileModal';
import { ResponsiveAvatar } from '@/components/ui/responsive-image';
import { 
  fetchUserPrompts, 
  fetchUserForkedPrompts, 
  fetchUserFavorites,
  fetchUserActivity
} from '@/app/actions/profile';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfilePageProps {
  profile: Profile;
  stats: {
    prompts: number;
    forks: number;
    favorites: number;
  };
  isOwnProfile: boolean;
}

export default function ProfilePage({ profile, stats, isOwnProfile }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('prompts');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Profile Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <ResponsiveAvatar
              src={profile.avatar_url}
              alt={profile.name || 'User avatar'}
              fallback={profile.name?.[0] || profile.email?.[0] || 'U'}
              size="lg"
              className="border-4 border-card shadow-lg scale-150 sm:scale-200"
            />

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {profile.name || profile.username || 'Anonymous User'}
                  </h1>
                  {profile.username && profile.name && (
                    <p className="text-base sm:text-lg text-muted-foreground">@{profile.username}</p>
                  )}
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                    {profile.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="break-all">{profile.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Joined {formatDate(profile.created_at)}</span>
                    </div>
                  </div>
                </div>
                {isOwnProfile && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 text-xs sm:text-sm tap-highlight"
                    onClick={() => setEditModalOpen(true)}
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
                <Card className="card-hover tap-highlight">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.prompts}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Prompts</p>
                  </CardContent>
                </Card>
                <Card className="card-hover tap-highlight">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.forks}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Forks</p>
                  </CardContent>
                </Card>
                <Card className="card-hover tap-highlight">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.favorites}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Favorites</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="w-full overflow-x-auto flex sm:grid sm:grid-cols-4">
            <TabsTrigger value="prompts" className="text-xs sm:text-sm whitespace-nowrap">My Prompts</TabsTrigger>
            <TabsTrigger value="forked" className="text-xs sm:text-sm whitespace-nowrap">Forked Prompts</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs sm:text-sm whitespace-nowrap">Favorites</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm whitespace-nowrap">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="prompts" className="space-y-4">
            <ProfilePromptsTab
              userId={profile.id}
              fetchFunction={fetchUserPrompts}
              title="My Prompts"
              description="Prompts you've created"
              emptyMessage="No prompts yet"
              emptySubMessage="Your created prompts will appear here"
            />
          </TabsContent>

          <TabsContent value="forked" className="space-y-4">
            <ProfilePromptsTab
              userId={profile.id}
              fetchFunction={fetchUserForkedPrompts}
              title="Forked Prompts"
              description="Prompts you've forked from others"
              emptyMessage="No forked prompts yet"
              emptySubMessage="Prompts you fork will appear here"
            />
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <ProfilePromptsTab
              userId={profile.id}
              fetchFunction={fetchUserFavorites}
              title="Favorite Prompts"
              description="Prompts you've marked as favorites"
              emptyMessage="No favorites yet"
              emptySubMessage="Your favorite prompts will appear here"
              showAuthor={true}
            />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <p>No activity yet</p>
                  <p className="text-sm mt-2">Your activity will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          user={{
            id: profile.id,
            name: profile.name,
            username: profile.username,
            avatar_url: profile.avatar_url,
            email: profile.email,
          }}
        />
      )}
    </div>
  );
} 