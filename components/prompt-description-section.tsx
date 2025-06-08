'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { SimpleMarkdown } from '@/components/simple-markdown'
import { cn } from '@/lib/utils'

interface PromptDescriptionSectionProps {
  description: string
  className?: string
}

export function PromptDescriptionSection({ description, className }: PromptDescriptionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!description) return null

  // Truncate description to show preview (first ~150 characters)
  const truncatedDescription = description.length > 150 
    ? description.substring(0, 150) + '...' 
    : description

  return (
    <Card className={cn("mb-4 sm:mb-6", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="mb-2">
          <h3 className="text-base font-medium text-foreground">About this prompt</h3>
        </div>
        
        <div className="text-sm text-foreground mb-4">
          <SimpleMarkdown 
            content={isExpanded ? description : truncatedDescription}
            className="text-sm text-foreground"
          />
        </div>

        {(description.length > 150 || isExpanded) && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-red-600 hover:text-red-700 hover:bg-red-100/10 text-sm font-medium"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Hide details / usage instructions
                </>
              ) : (
                <>
                  + Show details / usage instructions
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 