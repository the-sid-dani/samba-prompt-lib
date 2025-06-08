'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Loader2 } from 'lucide-react'
import { useDebouncedToast } from '@/hooks/use-debounced-toast'
import { cn } from '@/lib/utils'

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
  
  const handleCopy = async () => {
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
      // Call the onCopy callback if provided
      if (onCopy) {
        await onCopy()
      }
      
      // Modern clipboard API with fallback
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback method for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
        } catch (err) {
          throw new Error('Failed to copy using fallback method')
        } finally {
          textArea.remove()
        }
      }
      
      setIsCopied(true)
      
      // Show a more concise notification
      showToast({
        title: 'Copied!',
        description: 'Content copied to clipboard',
      })
      
      // Reset icon after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      showToast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
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
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCopied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {showLabel && label}
    </Button>
  )
} 