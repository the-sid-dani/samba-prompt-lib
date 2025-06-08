'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign-in...')
      const result = await signIn('google', { 
        callbackUrl,
        redirect: true 
      })
      console.log('Google sign-in result:', result)
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <div className="flex justify-center mb-8">
            <img 
              src="/samba_logo_heart_Wordmark_Black_2018-01.png" 
              alt="SambaTV Logo" 
              className="h-10 w-auto"
            />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Welcome back!
            </h2>
            <p className="text-sm text-gray-600">
              Sign in to the AI Task Force platform.
            </p>
          </div>

          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
          </div>

          <div className="mt-6">
            <p className="text-center text-xs text-gray-500">
              You acknowledge that you read, and agree, to our{' '}
              <Link href="/terms" className="text-gray-700 hover:text-gray-900 underline">
                Terms of Service
              </Link>{' '}
              and our{' '}
              <Link href="/privacy" className="text-gray-700 hover:text-gray-900 underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-center text-xs text-gray-400">
          © 2025 SambaTV. All rights reserved.
        </p>
      </div>
    </div>
  )
} 