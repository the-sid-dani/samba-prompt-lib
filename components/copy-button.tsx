'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Loader2 } from 'lucide-react'
import { useDebouncedToast } from '@/hooks/use-debounced-toast'
import { cn } from '@/lib/utils'
import { copyToClipboard } from '@/lib/clipboard'

interface CopyButtonProps {
  text: string
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  onCopy?: () => void | Promise<void>
  label?: string
  showLabel?: boolean
}

export function CopyButton({
  text,
  variant = 'default',
  size = 'default',
  className,
  onCopy,
  label = 'Copy',
  showLabel = true,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useDebouncedToast()
  
  // Debug log
  console.log('CopyButton render - text length:', text?.length || 0)
  
  const hasContent = text && text.length > 0
  
  const handleCopy = async (e?: React.MouseEvent) => {
    // Prevent event propagation to parent elements (like card links)
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Prevent rapid duplicate clicks
    if (isCopied || isLoading) {
      return
    }
    
    // Validate text is provided
    if (!hasContent) {
      console.error('No text provided to copy')
      showToast({
        title: 'Error',
        description: 'No content available to copy',
        variant: 'destructive',
      })
      return
    }
    
    console.log('Copying text to clipboard, length:', text.length)
    setIsLoading(true)
    
    try {
      // Use our centralized clipboard utility FIRST
      const success = await copyToClipboard(text, {
        onSuccess: () => {
          console.log('Clipboard copy successful')
          setIsCopied(true)
          
          // Show success notification
          showToast({
            title: 'Copied!',
            description: 'Content copied to clipboard',
          })
          
          // Reset icon after 2 seconds
          setTimeout(() => {
            setIsCopied(false)
          }, 2000)
          
          // Call the onCopy callback AFTER successful clipboard operation (for analytics, etc.)
          if (onCopy) {
            try {
              const result = onCopy()
              if (result instanceof Promise) {
                result.catch((error: unknown) => {
                  console.error('onCopy callback failed:', error)
                  // Don't show error to user since clipboard operation succeeded
                })
              }
            } catch (error) {
              console.error('onCopy callback failed:', error)
              // Don't show error to user since clipboard operation succeeded
            }
          }
        },
        onError: (error) => {
          console.error('Clipboard copy failed:', error)
          showToast({
            title: 'Error',
            description: 'Failed to copy to clipboard. Please try selecting and copying manually.',
            variant: 'destructive',
          })
        }
      })
      
      // If the utility returns false but didn't call onError, handle it
      if (!success) {
        throw new Error('Clipboard operation returned false')
      }
      
    } catch (err) {
      console.error('Copy operation failed:', err)
      showToast({
        title: 'Error',
        description: 'Failed to copy to clipboard. Please try selecting and copying manually.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      onClick={handleCopy}
      disabled={isLoading || !hasContent}
      title={hasContent ? label : 'No content to copy'}
      aria-label={
        isLoading 
          ? 'Copying content...' 
          : isCopied 
            ? 'Content copied to clipboard' 
            : hasContent 
              ? `Copy ${label.toLowerCase()}` 
              : 'No content to copy'
      }
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : isCopied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      {showLabel && label}
      {/* Screen reader announcement for copy status */}
      {isCopied && (
        <span className="sr-only" aria-live="polite">
          Content copied to clipboard
        </span>
      )}
    </Button>
  )
} 