'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fixForkTitles } from '@/app/actions/fix-fork-titles'
import { useState } from 'react'

export default function FixTitlesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFix = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fixForkTitles()
      setResult(res)
    } catch (error) {
      setResult({ success: false, message: 'Error occurred: ' + error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Fix Fork Titles</CardTitle>
          <CardDescription>
            This will remove all "(Fork)" suffixes from prompt titles in the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleFix} 
            disabled={loading}
            variant="default"
          >
            {loading ? 'Fixing...' : 'Fix Fork Titles'}
          </Button>
          
          {result && (
            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-semibold">{result.message}</p>
              {result.details && (
                <div className="mt-2 text-sm">
                  <p>Details:</p>
                  <ul className="mt-1 space-y-1">
                    {result.details.map((detail: any, index: number) => (
                      <li key={index}>
                        {detail.success ? '✅' : '❌'} Prompt {detail.id}: {detail.oldTitle} → {detail.newTitle || detail.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 