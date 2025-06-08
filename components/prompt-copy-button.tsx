'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/copy-button'
import { incrementPromptUses } from '@/app/actions/prompts'
import { useAsyncOperation } from '@/hooks/use-api-error'

interface PromptCopyButtonProps {
  promptId: number
  text: string
  label?: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'link'
}

export function PromptCopyButton({ 
  promptId, 
  text, 
  label = 'Copy Prompt',
  className,
  variant = 'default'
}: PromptCopyButtonProps) {
  const { execute } = useAsyncOperation()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const handleCopy = async () => {
    // Simple state check to prevent rapid double-clicks
    if (isProcessing) {
      console.log('Copy already in progress, ignoring')
      return
    }

    setIsProcessing(true)
    console.log('Starting copy operation for prompt:', promptId)

    try {
      // Copy text to clipboard first (synchronous operation)
      await navigator.clipboard.writeText(text)
      console.log('Text copied to clipboard successfully')
      
      // Then increment usage count (asynchronous operation)
      // Database-level atomic operation handles race conditions
      await execute(async () => {
        console.log('Calling incrementPromptUses for prompt:', promptId)
        return await incrementPromptUses(promptId)
      })
      
      console.log('Copy operation completed successfully')
    } catch (error) {
      console.error('Copy operation failed:', error)
      // Even if increment fails, the copy to clipboard still worked
      // So we don't need to show an error to the user
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <CopyButton
      text={text}
      onCopy={handleCopy}
      label={label}
      className={className}
      variant={variant}
    />
  )
} 