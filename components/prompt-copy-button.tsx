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
      return
    }

    setIsProcessing(true)

    try {
      // Increment usage count (asynchronous operation)
      // Database-level atomic operation handles race conditions
      await execute(async () => {
        return await incrementPromptUses(promptId)
      })
    } catch (error) {
      console.error('Usage increment failed:', error)
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