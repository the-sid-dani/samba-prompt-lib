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
    
    // Regular expression to match {{variable}} or {{variable|default|description}}
    const variablePattern = /(\{\{[^}]+\}\})/g
    
    // Split content by variables to process each part
    const parts = displayContent.split(variablePattern)
    
    return parts.map((part, index) => {
      // Check if this part is a variable
      if (part.match(/^\{\{[^}]+\}\}$/)) {
        // Extract variable content without braces
        const variableContent = part.slice(2, -2)
        const [variableName] = variableContent.split('|').map(p => p.trim())
        
        return (
          <span
            key={index}
            className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-medium mx-0.5"
            title={`Variable: ${variableName}`}
          >
            <span className="text-red-600 mr-0.5">{'{{'}</span>
            <span>{variableName}</span>
            <span className="text-red-600 ml-0.5">{'}}'}</span>
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