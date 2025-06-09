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
      
      // Simple, reliable approach: try modern API first, then simple fallback
      let copySuccessful = false
      
      // Method 1: Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text)
          copySuccessful = true
          console.log('Successfully copied using modern clipboard API')
        } catch (error) {
          console.warn('Modern clipboard API failed:', error)
        }
      }
      
      // Method 2: Simple fallback for mobile
      if (!copySuccessful) {
        try {
          // Create a simple, visible textarea for mobile compatibility
          const textArea = document.createElement('textarea')
          textArea.value = text
          textArea.style.position = 'absolute'
          textArea.style.left = '50%'
          textArea.style.top = '50%'
          textArea.style.transform = 'translate(-50%, -50%)'
          textArea.style.width = '300px'
          textArea.style.height = '100px'
          textArea.style.fontSize = '16px'
          textArea.style.border = '1px solid #ccc'
          textArea.style.borderRadius = '4px'
          textArea.style.padding = '8px'
          textArea.style.zIndex = '9999'
          textArea.style.backgroundColor = 'white'
          textArea.style.color = 'black'
          
          document.body.appendChild(textArea)
          
          // Focus and select all text
          textArea.focus()
          textArea.select()
          textArea.setSelectionRange(0, text.length)
          
          // Try to copy
          const successful = document.execCommand('copy')
          
          // Remove the textarea after a short delay to let user see it
          setTimeout(() => {
            if (document.body.contains(textArea)) {
              document.body.removeChild(textArea)
            }
          }, 100)
          
          if (successful) {
            copySuccessful = true
            console.log('Successfully copied using fallback method')
          }
        } catch (error) {
          console.error('Fallback method failed:', error)
        }
      }
      
      if (copySuccessful) {
        setIsCopied(true)
        
        showToast({
          title: 'Copied!',
          description: 'Content copied to clipboard',
        })
        
        // Reset icon after 2 seconds
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      } else {
        throw new Error('All clipboard methods failed')
      }
      
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      
      // Show a modal or alert with the text for manual copying
      const shouldShowText = confirm('Automatic copying failed. Would you like to see the text to copy manually?')
      
      if (shouldShowText) {
        // Create a modal-like overlay with the text
        const overlay = document.createElement('div')
        overlay.style.position = 'fixed'
        overlay.style.top = '0'
        overlay.style.left = '0'
        overlay.style.width = '100%'
        overlay.style.height = '100%'
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
        overlay.style.zIndex = '10000'
        overlay.style.display = 'flex'
        overlay.style.alignItems = 'center'
        overlay.style.justifyContent = 'center'
        overlay.style.padding = '20px'
        
        const modal = document.createElement('div')
        modal.style.backgroundColor = 'white'
        modal.style.borderRadius = '8px'
        modal.style.padding = '20px'
        modal.style.maxWidth = '90%'
        modal.style.maxHeight = '80%'
        modal.style.overflow = 'auto'
        
        const title = document.createElement('h3')
        title.textContent = 'Copy this text manually:'
        title.style.marginBottom = '10px'
        title.style.color = 'black'
        
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.width = '100%'
        textArea.style.height = '200px'
        textArea.style.fontSize = '14px'
        textArea.style.border = '1px solid #ccc'
        textArea.style.borderRadius = '4px'
        textArea.style.padding = '8px'
        textArea.style.resize = 'vertical'
        textArea.readOnly = true
        
        const closeButton = document.createElement('button')
        closeButton.textContent = 'Close'
        closeButton.style.marginTop = '10px'
        closeButton.style.padding = '8px 16px'
        closeButton.style.backgroundColor = '#007bff'
        closeButton.style.color = 'white'
        closeButton.style.border = 'none'
        closeButton.style.borderRadius = '4px'
        closeButton.style.cursor = 'pointer'
        
        closeButton.onclick = () => {
          document.body.removeChild(overlay)
        }
        
        overlay.onclick = (e) => {
          if (e.target === overlay) {
            document.body.removeChild(overlay)
          }
        }
        
        modal.appendChild(title)
        modal.appendChild(textArea)
        modal.appendChild(closeButton)
        overlay.appendChild(modal)
        document.body.appendChild(overlay)
        
        // Auto-select the text
        textArea.focus()
        textArea.select()
      }
      
      showToast({
        title: 'Copy Failed',
        description: 'Please use the manual copy option above',
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