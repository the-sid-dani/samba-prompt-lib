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
      
      // Detect iOS for special handling
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      
      // Try modern clipboard API first (but not on iOS in non-secure contexts)
      if (navigator.clipboard && window.isSecureContext && !isIOS) {
        try {
          await navigator.clipboard.writeText(text)
          console.log('Successfully copied using modern clipboard API')
        } catch (clipboardError) {
          console.warn('Modern clipboard API failed, trying fallback:', clipboardError)
          throw clipboardError // Fall through to fallback
        }
      } else {
        // Enhanced fallback method for mobile browsers
        console.log('Using fallback clipboard method for mobile/iOS')
        
        // Create a more mobile-friendly textarea
        const textArea = document.createElement('textarea')
        textArea.value = text
        
        // Enhanced styling for mobile compatibility
        textArea.style.position = 'fixed'
        textArea.style.top = '0'
        textArea.style.left = '0'
        textArea.style.width = '2em'
        textArea.style.height = '2em'
        textArea.style.padding = '0'
        textArea.style.border = 'none'
        textArea.style.outline = 'none'
        textArea.style.boxShadow = 'none'
        textArea.style.background = 'transparent'
        textArea.style.fontSize = '16px' // Prevent zoom on iOS
        textArea.style.opacity = '0'
        textArea.style.pointerEvents = 'none'
        textArea.setAttribute('readonly', '')
        
        // iOS-specific attributes
        if (isIOS) {
          textArea.setAttribute('contenteditable', 'true')
          textArea.style.userSelect = 'text'
          textArea.style.webkitUserSelect = 'text'
        }
        
        document.body.appendChild(textArea)
        
        try {
          // Enhanced selection for mobile
          textArea.focus()
          
          if (isIOS) {
            // iOS-specific selection
            const range = document.createRange()
            range.selectNodeContents(textArea)
            const selection = window.getSelection()
            selection?.removeAllRanges()
            selection?.addRange(range)
            textArea.setSelectionRange(0, text.length)
          } else {
            // Standard selection
            textArea.select()
            textArea.setSelectionRange(0, text.length)
          }
          
          // Try execCommand
          const successful = document.execCommand('copy')
          if (!successful) {
            throw new Error('execCommand copy returned false')
          }
          
          console.log('Successfully copied using fallback method')
        } catch (execError) {
          console.error('Fallback method failed:', execError)
          
          // Final fallback: try modern clipboard API even on iOS
          if (navigator.clipboard && isIOS) {
            try {
              await navigator.clipboard.writeText(text)
              console.log('iOS fallback to modern clipboard API succeeded')
            } catch (finalError) {
              console.error('All methods failed:', finalError)
              throw new Error('All clipboard methods failed')
            }
          } else {
            throw new Error('All clipboard methods failed')
          }
        } finally {
          document.body.removeChild(textArea)
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