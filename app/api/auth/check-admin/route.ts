import { NextResponse } from 'next/server'
import { isUserAdmin } from '@/lib/auth-utils'

export async function GET() {
  try {
    console.log('[CHECK-ADMIN] Starting admin check...')
    const isAdmin = await isUserAdmin()
    console.log('[CHECK-ADMIN] isUserAdmin result:', isAdmin)
    
    return NextResponse.json({ 
      isAdmin,
      message: isAdmin ? 'User is admin' : 'User is not admin'
    })
  } catch (error) {
    console.error('[CHECK-ADMIN] Error checking admin status:', error)
    return NextResponse.json(
      { isAdmin: false, error: 'Failed to check admin status' },
      { status: 500 }
    )
  }
} 