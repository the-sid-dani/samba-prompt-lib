'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GitFork } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ForkButtonProps {
  promptId: number
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showLabel?: boolean
}

export function ForkButton({
  promptId,
  variant = 'default',
  size = 'default',
  className,
  showLabel = true,
}: ForkButtonProps) {
  const router = useRouter()

  const handleFork = () => {
    // Simply redirect to the fork page where user can edit before creating
    router.push(`/prompt/fork/${promptId}`)
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'font-medium shadow-sm',
        variant === 'default' &&
          'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
        className
      )}
      onClick={handleFork}
    >
      <GitFork className="h-4 w-4 mr-2" />
      {showLabel && 'Fork'}
    </Button>
  )
} 