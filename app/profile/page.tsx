import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/utils/supabase/server";
import ProfilePage from "@/components/profile/ProfilePage";

// Force dynamic rendering to ensure fresh stats
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Profile() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/");
  }

  // Fetch user profile data
  const supabase = createSupabaseAdminClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    console.error('Error fetching profile:', error);
    redirect("/");
  }

  // Fetch user statistics
  const [promptsCount, forksCount, favoritesCount] = await Promise.all([
    // Count user's prompts
    supabase
      .from('prompt')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id),
    
    // Count forks of user's prompts
    supabase
      .from('prompt_forks')
      .select('id', { count: 'exact', head: true })
      .in('original_prompt_id', 
        (await supabase
          .from('prompt')
          .select('id')
          .eq('user_id', session.user.id)).data?.map(p => p.id) || []
      ),
    
    // Count user's favorites
    supabase
      .from('user_favorites')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
  ]);

  const stats = {
    prompts: promptsCount.count || 0,
    forks: forksCount.count || 0,
    favorites: favoritesCount.count || 0
  };

  return <ProfilePage profile={profile} stats={stats} isOwnProfile={true} />;
} 