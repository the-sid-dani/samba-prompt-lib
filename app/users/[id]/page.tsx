import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/utils/supabase/server";
import ProfilePage from "@/components/profile/ProfilePage";

export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  // Redirect to own profile if viewing self
  if (session?.user?.id === userId) {
    const { redirect } = await import('next/navigation');
    redirect('/profile');
  }

  // Fetch user profile data
  const supabase = createSupabaseAdminClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Fetch user statistics
  const [promptsCount, forksCount, favoritesReceivedCount] = await Promise.all([
    // Count user's prompts
    supabase
      .from('prompt')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    
    // Count forks the user has made
    supabase
      .from('prompt_forks')
      .select('id', { count: 'exact', head: true })
      .in('forked_prompt_id',
        (await supabase
          .from('prompt')
          .select('id')
          .eq('user_id', userId)).data?.map(p => p.id) || []
      ),
    
    // Count favorites received on user's prompts
    supabase
      .from('user_favorites')
      .select('id', { count: 'exact', head: true })
      .in('prompt_id',
        (await supabase
          .from('prompt')
          .select('id')
          .eq('user_id', userId)).data?.map(p => p.id) || []
      )
  ]);

  const stats = {
    prompts: promptsCount.count || 0,
    forks: forksCount.count || 0,
    favorites: favoritesReceivedCount.count || 0
  };

  return <ProfilePage profile={profile} stats={stats} isOwnProfile={false} />;
} 