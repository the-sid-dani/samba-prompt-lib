'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GitFork, Loader2 } from 'lucide-react'
import { createPrompt } from '@/app/actions/prompts'
import { useAsyncOperation } from '@/hooks/use-api-error'
import { cn } from '@/lib/utils'

interface ForkButtonProps {
  promptId: number
  promptTitle: string
  promptDescription: string
  promptContent: string
  categoryId: number
  tags: string[]
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showLabel?: boolean
}

export function ForkButton({
  promptId,
  promptTitle,
  promptDescription,
  promptContent,
  categoryId,
  tags,
  variant = 'default',
  size = 'default',
  className,
  showLabel = true,
}: ForkButtonProps) {
  const router = useRouter()
  const { execute, isLoading } = useAsyncOperation()
  
  const handleFork = async () => {
    const forkData = {
      title: promptTitle,
      description: promptDescription,
      content: promptContent,
      category_id: categoryId,
      tags: tags || [],
      forked_from: promptId,
    }
    
    const result = await execute(createPrompt, forkData)
    
    if (result) {
      // Redirect directly to edit page of the forked prompt
      router.push(`/prompt/${result.id}/edit`)
    }
  }
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "font-medium shadow-sm",
        variant === 'default' && "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
        className
      )}
      onClick={handleFork}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {showLabel && 'Forking...'}
        </>
      ) : (
        <>
          <GitFork className="h-4 w-4 mr-2" />
          {showLabel && 'Fork'}
        </>
      )}
    </Button>
  )
} 