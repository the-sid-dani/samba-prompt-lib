'use client'

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
  
  const handleCopy = async () => {
    console.log('Handling copy for prompt:', promptId)
    // Execute the server action to increment uses
    await execute(incrementPromptUses, promptId)
  }
  
  return (
    <CopyButton
      text={text}
      label={label}
      onCopy={handleCopy}
      className={className}
      variant={variant}
    />
  )
} 