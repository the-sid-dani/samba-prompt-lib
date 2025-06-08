'use client'

import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function StagingBanner() {
  // Only show in staging environment
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'staging') {
    return null
  }

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="text-yellow-800 dark:text-yellow-200 font-medium">
        🚧 <strong>Staging Environment</strong> - This is a test environment. Data may be reset periodically.
      </AlertDescription>
    </Alert>
  )
} 