'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function CleanupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()
  
  const handleCleanup = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/cleanup-fork-titles', {
        method: 'POST'
      })
      
      const data = await response.json()
      setResult(data)
      
      // Refresh the page after cleanup
      if (data.count > 0) {
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    } catch (error) {
      setResult({ error: 'Failed to perform cleanup' })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Cleanup Duplicate Fork Prompts</CardTitle>
          <CardDescription>
            This will delete all prompts that have "(Fork)" in their titles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleCleanup} 
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? 'Cleaning up...' : 'Delete Fork Duplicates'}
          </Button>
          
          {result && (
            <div className={`p-4 rounded-lg ${result.error ? 'bg-red-100' : 'bg-green-100'}`}>
              {result.error ? (
                <p className="text-red-700">Error: {result.error}</p>
              ) : (
                <div>
                  <p className="text-green-700">{result.message}</p>
                  {result.count > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Redirecting to homepage...
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}