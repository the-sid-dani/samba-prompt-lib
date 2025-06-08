'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error caught:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    })

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to monitoring service
      // monitoringService.captureException(error, {
      //   tags: { component: 'global-error' },
      //   extra: { digest: error.digest }
      // })
    }
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. Our team has been notified and is working on a fix.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-mono text-muted-foreground">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button onClick={reset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go to homepage
                  </Link>
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                If this problem persists, please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
} 