import { NextResponse } from 'next/server'
import { isUserAdmin } from '@/lib/auth-utils'

export async function GET() {
  try {
    const isAdmin = await isUserAdmin()
    
    return NextResponse.json({ 
      isAdmin,
      message: isAdmin ? 'User is admin' : 'User is not admin'
    })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json(
      { isAdmin: false, error: 'Failed to check admin status' },
      { status: 500 }
    )
  }
} 