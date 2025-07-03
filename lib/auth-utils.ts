import { auth } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/utils/supabase/server'

/**
 * Check if the current user is an admin based on their role in the database
 */
export async function isUserAdmin(): Promise<boolean> {
  try {
    console.log('[AUTH-UTILS] Checking admin status...')
    const session = await auth()
    console.log('[AUTH-UTILS] Session user:', { id: session?.user?.id, email: session?.user?.email })
    
    if (!session?.user) {
      console.log('[AUTH-UTILS] No session or user found')
      return false
    }

    // If we have email but no ID, we can still proceed with email lookup
    if (!session.user.id && !session.user.email) {
      console.log('[AUTH-UTILS] No user ID or email found')
      return false
    }

    const supabase = await createSupabaseAdminClient()
    
    let profile = null
    let idError = null
    
    // First try to find by ID if we have one
    if (session.user.id) {
      console.log('[AUTH-UTILS] Looking up profile by ID:', session.user.id)
      const result = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      profile = result.data
      idError = result.error
    }

    console.log('[AUTH-UTILS] Profile by ID result:', { profile, error: idError?.message })

    // If no profile found by ID, try by email (fallback for ID mismatches)
    if (!profile && session.user?.email) {
      console.log('[AUTH-UTILS] No profile by ID, trying by email:', session.user.email)
      const { data: profileByEmail, error: emailError } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', session.user.email)
        .single()
      
      console.log('[AUTH-UTILS] Profile by email result:', { profile: profileByEmail, error: emailError?.message })
      profile = profileByEmail
    }

    const isAdmin = (profile?.role as 'admin' | 'member' | undefined) === 'admin'
    console.log('[AUTH-UTILS] Final admin check result:', { role: profile?.role, isAdmin })
    
    return isAdmin
  } catch (error) {
    console.error('[AUTH-UTILS] Error checking admin status:', error)
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
    
    // First try to find by ID
    let { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // If no profile found by ID, try by email (fallback for ID mismatches)
    if (!profile && session.user?.email) {
      const { data: profileByEmail } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', session.user.email)
        .single()
      
      profile = profileByEmail
    }

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