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
    
    // Enhanced variable highlighting to match playground styling
    const text = displayContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    
    // Split by variables and highlight markers while preserving the full {{}} syntax
    const pattern = /(\{\{[^}]+\}\}|\|\|\|HIGHLIGHT\|\|\|.*?\|\|\|HIGHLIGHT\|\|\|)/g
    const parts = text.split(pattern)
    
    return (
      <span 
        dangerouslySetInnerHTML={{
          __html: parts.map(part => {
            // Check if this part is a variable with full {{}} syntax
            if (part.match(/^\{\{[^}]+\}\}$/)) {
              return `<span style="color: #dc2626; background-color: rgba(220, 38, 38, 0.1); padding: 2px 4px; border-radius: 3px; font-weight: 600; border: 1px solid rgba(220, 38, 38, 0.2);" title="Template variable">${part}</span>`
            }
            
            // Check if this part is a highlighted replacement
            if (part.startsWith('|||HIGHLIGHT|||') && part.endsWith('|||HIGHLIGHT|||')) {
              const content = part.replace(/\|\|\|HIGHLIGHT\|\|\|/g, '')
              return `<span style="color: #dc2626; background-color: rgba(220, 38, 38, 0.1); padding: 2px 4px; border-radius: 3px; font-weight: 600; border: 1px solid rgba(220, 38, 38, 0.2);" title="Filled variable">${content}</span>`
            }
            
            // Regular text
            return part
          }).join('')
        }}
      />
    )
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