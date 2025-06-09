/**
 * Bulletproof clipboard utility for mobile and desktop browsers
 * Handles all edge cases and provides multiple fallback methods
 */

export interface ClipboardOptions {
  onSuccess?: (text: string) => void
  onError?: (error: Error) => void
  showToast?: boolean
}

/**
 * Copy text to clipboard with comprehensive fallback support
 * This function tries multiple methods to ensure clipboard works on all devices
 */
export async function copyToClipboard(text: string, options: ClipboardOptions = {}): Promise<boolean> {
  const { onSuccess, onError, showToast = false } = options

  // Validate input
  if (!text || typeof text !== 'string' || text.length === 0) {
    const error = new Error('No text provided to copy')
    onError?.(error)
    return false
  }

  console.log('Attempting to copy text to clipboard, length:', text.length)

  // Detect device and browser capabilities
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  const isSecureContext = window.isSecureContext
  const hasClipboardAPI = !!navigator.clipboard

  console.log('Device detection:', { isIOS, isSafari, isSecureContext, hasClipboardAPI })

  // Method 1: Modern Clipboard API (preferred for secure contexts)
  if (hasClipboardAPI && isSecureContext && !isIOS) {
    try {
      await navigator.clipboard.writeText(text)
      console.log('✅ Success: Modern Clipboard API')
      onSuccess?.(text)
      return true
    } catch (error) {
      console.warn('❌ Modern Clipboard API failed:', error)
      // Continue to fallback methods
    }
  }

  // Method 2: Enhanced textarea fallback (works on most mobile browsers)
  try {
    const success = await textareaFallback(text, isIOS)
    if (success) {
      console.log('✅ Success: Textarea fallback method')
      onSuccess?.(text)
      return true
    }
  } catch (error) {
    console.warn('❌ Textarea fallback failed:', error)
  }

  // Method 3: iOS-specific modern clipboard API (last resort for iOS)
  if (isIOS && hasClipboardAPI) {
    try {
      await navigator.clipboard.writeText(text)
      console.log('✅ Success: iOS modern clipboard fallback')
      onSuccess?.(text)
      return true
    } catch (error) {
      console.warn('❌ iOS modern clipboard fallback failed:', error)
    }
  }

  // Method 4: Document.execCommand with different approach
  try {
    const success = await execCommandFallback(text)
    if (success) {
      console.log('✅ Success: execCommand fallback')
      onSuccess?.(text)
      return true
    }
  } catch (error) {
    console.warn('❌ execCommand fallback failed:', error)
  }

  // All methods failed
  const finalError = new Error('All clipboard methods failed')
  console.error('❌ All clipboard methods failed')
  onError?.(finalError)
  return false
}

/**
 * Enhanced textarea fallback method optimized for mobile browsers
 */
async function textareaFallback(text: string, isIOS: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Create optimized textarea element
      const textArea = document.createElement('textarea')
      textArea.value = text

      // Mobile-optimized styling
      Object.assign(textArea.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '2em',
        height: '2em',
        padding: '0',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        background: 'transparent',
        fontSize: '16px', // Prevent iOS zoom
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '-1'
      })

      // Set attributes
      textArea.setAttribute('readonly', '')
      textArea.setAttribute('tabindex', '-1')
      textArea.setAttribute('aria-hidden', 'true')

      // iOS-specific attributes
      if (isIOS) {
        textArea.setAttribute('contenteditable', 'true')
        textArea.style.userSelect = 'text'
        ;(textArea.style as any).webkitUserSelect = 'text'
        ;(textArea.style as any).webkitTouchCallout = 'none'
        ;(textArea.style as any).webkitUserModify = 'read-write-plaintext-only'
      }

      document.body.appendChild(textArea)

      // Focus and select with timeout for mobile
      setTimeout(() => {
        try {
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

          // Execute copy command
          const successful = document.execCommand('copy')
          
          // Cleanup
          document.body.removeChild(textArea)
          
          resolve(successful)
        } catch (error) {
          // Cleanup on error
          if (document.body.contains(textArea)) {
            document.body.removeChild(textArea)
          }
          resolve(false)
        }
      }, 10) // Small delay for mobile browsers
    } catch (error) {
      resolve(false)
    }
  })
}

/**
 * Alternative execCommand approach
 */
async function execCommandFallback(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Create a span element (alternative to textarea)
      const span = document.createElement('span')
      span.textContent = text
      span.style.position = 'absolute'
      span.style.left = '-9999px'
      span.style.top = '-9999px'
      span.style.fontSize = '12pt'
      span.style.border = '0'
      span.style.padding = '0'
      span.style.margin = '0'

      document.body.appendChild(span)

      const selection = window.getSelection()
      const range = document.createRange()
      selection?.removeAllRanges()
      range.selectNode(span)
      selection?.addRange(range)

      const successful = document.execCommand('copy')
      
      document.body.removeChild(span)
      selection?.removeAllRanges()
      
      resolve(successful)
    } catch (error) {
      resolve(false)
    }
  })
}

/**
 * Simple wrapper for React components that need clipboard functionality
 */
export function useCopyToClipboard() {
  const copy = async (text: string): Promise<boolean> => {
    return copyToClipboard(text)
  }

  return { copy }
} 