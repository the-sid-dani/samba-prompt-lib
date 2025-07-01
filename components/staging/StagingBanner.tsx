'use client'

import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useEffect, useState } from 'react'

export function StagingBanner() {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    // Safely check environment variable on client side
    const appEnv = process.env.NEXT_PUBLIC_APP_ENV
    setShouldShow(appEnv === 'staging')
  }, [])

  // Don't render anything until we've checked the environment
  if (!shouldShow) {
    return null
  }

  try {
    return (
      <Alert className="rounded-none border-x-0 border-t-0 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200 font-medium">
          🚧 <strong>Staging Environment</strong> - This is a test environment. Data may be reset periodically.
        </AlertDescription>
      </Alert>
    )
  } catch (error) {
    console.warn('StagingBanner failed to render:', error);
    // Fallback to simple div if UI components fail
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-3">
        <div className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
          🚧 <strong>Staging Environment</strong> - This is a test environment. Data may be reset periodically.
        </div>
      </div>
    )
  }
} 