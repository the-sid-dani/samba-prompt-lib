'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface PromptContentRendererProps {
  content: string
  processedContent?: string
  className?: string
  showVariables?: boolean
}

export function PromptContentRenderer({ 
  content, 
  processedContent,
  className,
  showVariables = true 
}: PromptContentRendererProps) {
  
  const highlightedContent = useMemo(() => {
    const displayContent = processedContent || content
    
    if (!showVariables) {
      return displayContent
    }
    
    // Check if content contains HTML markup (from template variables)
    if (displayContent.includes('<mark class="filled-variable">')) {
      // Handle HTML content with filled variables
      const pattern = /(<mark class="filled-variable">.*?<\/mark>|\{\{[^}]+\}\})/g
      const parts = displayContent.split(pattern)
      
      return parts.map((part, index) => {
        // Check if this part is a filled variable
        if (part.startsWith('<mark class="filled-variable">')) {
          const content = part.replace(/<mark class="filled-variable">|<\/mark>/g, '')
          return (
            <span
              key={index}
              className="text-red-600 font-bold bg-red-100 dark:bg-red-900/30 rounded-sm px-1"
              title="Filled variable"
            >
              {content}
            </span>
          )
        }
        
        // Check if this part is an unfilled variable
        if (part.match(/^\{\{[^}]+\}\}$/)) {
          return (
            <span
              key={index}
              className="text-red-600 font-bold"
              title="Template variable"
            >
              {part}
            </span>
          )
        }
        
        // Regular text
        return part
      })
    }
    
    // Fallback to original pattern matching for highlight markers
    const pattern = /(\{\{[^}]+\}\}|\|\|\|HIGHLIGHT\|\|\|.*?\|\|\|HIGHLIGHT\|\|\|)/g
    const parts = displayContent.split(pattern)
    
    return parts.map((part, index) => {
      // Check if this part is a variable
      if (part.match(/^\{\{[^}]+\}\}$/)) {
        return (
          <span
            key={index}
            className="text-red-600 font-bold"
            title="Template variable"
          >
            {part}
          </span>
        )
      }
      
      // Check if this part is a highlighted replacement
      if (part.startsWith('|||HIGHLIGHT|||') && part.endsWith('|||HIGHLIGHT|||')) {
        const content = part.replace(/\|\|\|HIGHLIGHT\|\|\|/g, '')
        return (
          <span
            key={index}
            className="text-red-600 font-bold"
            title="Filled variable"
          >
            {content}
          </span>
        )
      }
      
      // Regular text
      return part
    })
  }, [content, processedContent, showVariables])
  
  return (
    <pre className={cn(
      "whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed",
      className
    )}>
      {highlightedContent}
    </pre>
  )
}