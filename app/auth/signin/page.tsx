'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from '@/hooks/use-theme'

function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { 
        callbackUrl,
        redirect: true 
      })
    } catch (error) {
      console.error('Authentication failed:', error)
      toast({
        title: "Sign-in Failed",
        description: "Unable to sign in with Google. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </Button>
    </div>
  )
}

export default function SignInPage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="sambatv-theme">
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-border">
            <div className="flex justify-center mb-8">
              <Image 
                src="/samba_logo_heart_Wordmark_Black_2018-01.png" 
                alt="SambaTV Logo" 
                width={160}
                height={40}
                priority
                className="h-10 w-auto dark:invert"
                sizes="160px"
              />
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Welcome back!
              </h2>
              <p className="text-sm text-muted-foreground">
                Sign in to the AI Task Force platform.
              </p>
            </div>

            <Suspense fallback={
              <Button
                type="button"
                variant="outline"
                disabled
                className="flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm"
              >
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </Button>
            }>
              <SignInForm />
            </Suspense>

            <div className="mt-6">
              <p className="text-center text-xs text-muted-foreground">
                You acknowledge that you read, and agree, to our{' '}
                <Link href="/terms" className="text-foreground hover:text-primary underline">
                  Terms of Service
                </Link>{' '}
                and our{' '}
                <Link href="/privacy" className="text-foreground hover:text-primary underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-center text-xs text-muted-foreground">
            © 2025 SambaTV. All rights reserved.
          </p>
        </div>
      </div>
    </ThemeProvider>
  )
} 