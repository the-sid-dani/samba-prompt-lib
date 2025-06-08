import { useRef, useCallback } from 'react'
import { toast } from '@/hooks/use-toast'

interface ToastOptions {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

// Global set to track recent notifications
const recentNotifications = new Set<string>()

export function useDebouncedToast() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = useCallback((options: ToastOptions, debounceTime = 1000) => {
    const key = `${options.title}-${options.description}`
    
    // If this exact notification was shown recently, skip it
    if (recentNotifications.has(key)) {
      return
    }

    // Show the toast
    toast(options)
    
    // Add to recent notifications
    recentNotifications.add(key)
    
    // Clear the timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Remove from recent notifications after debounce time
    timeoutRef.current = setTimeout(() => {
      recentNotifications.delete(key)
    }, debounceTime)
  }, [])

  return { showToast }
} 