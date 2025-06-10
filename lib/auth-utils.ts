import { auth } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/utils/supabase/server'

/**
 * Check if the current user is an admin based on their role in the database
 */
export async function isUserAdmin(): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return false
    }

    const supabase = await createSupabaseAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    return (profile?.role as 'admin' | 'member' | undefined) === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Get the current user's role from the database
 */
export async function getUserRole(): Promise<'admin' | 'member' | null> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return null
    }

    const supabase = await createSupabaseAdminClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const role = profile?.role as 'admin' | 'member' | undefined
    return role || 'member'
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

/**
 * Ensure the current user is an admin, throw error if not
 */
export async function requireAdmin(): Promise<void> {
  const isAdmin = await isUserAdmin()
  if (!isAdmin) {
    throw new Error('Admin access required')
  }
} 