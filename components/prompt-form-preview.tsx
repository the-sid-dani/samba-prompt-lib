'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PromptContentRenderer } from '@/components/prompt-content-renderer'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'

interface PromptFormPreviewProps {
  content: string
  className?: string
}

export function PromptFormPreview({ content, className }: PromptFormPreviewProps) {
  if (!content || content.trim().length === 0) {
    return null
  }

  // Extract variables for display
  const variablePattern = /\{\{([^}]+)\}\}/g
  const matches = [...content.matchAll(variablePattern)]
  const variables = [...new Set(matches.map(m => m[1].split('|')[0].trim()))]

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </CardTitle>
          {variables.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Variables:</span>
              <div className="flex gap-1">
                {variables.map((variable, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-red-100 text-red-700"
                  >
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg max-h-[300px] overflow-y-auto">
          <PromptContentRenderer 
            content={content}
            showVariables={true}
            className="text-sm"
          />
        </div>
        {variables.length > 0 && (
          <p className="text-xs text-gray-500 mt-3">
            Tip: Use <span className="text-red-600 font-mono">{`{{variable}}`}</span> syntax to create dynamic placeholders
          </p>
        )}
      </CardContent>
    </Card>
  )
}