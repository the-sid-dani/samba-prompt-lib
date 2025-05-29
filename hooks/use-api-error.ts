'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

interface ApiError {
  message: string
  code?: string
  details?: any
  timestamp: string
  path?: string
}

interface UseApiErrorReturn {
  error: ApiError | null
  isError: boolean
  clearError: () => void
  handleError: (error: any) => void
}

/**
 * Custom hook for handling API errors
 */
export function useApiError(): UseApiErrorReturn {
  const [error, setError] = useState<ApiError | null>(null)
  const { toast } = useToast()

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const showErrorToast = useCallback((error: ApiError) => {
    const title = getErrorTitle(error.code)
    const description = error.message

    toast({
      title,
      description,
      variant: 'destructive',
    })
  }, [toast])

  const handleError = useCallback((error: any) => {
    let apiError: ApiError

    // Handle fetch errors
    if (error instanceof Response) {
      error.json().then((data) => {
        if (data.error) {
          apiError = data.error
        } else {
          apiError = {
            message: `HTTP ${error.status}: ${error.statusText}`,
            code: `HTTP_${error.status}`,
            timestamp: new Date().toISOString(),
          }
        }
        setError(apiError)
        showErrorToast(apiError)
      }).catch(() => {
        apiError = {
          message: `HTTP ${error.status}: ${error.statusText}`,
          code: `HTTP_${error.status}`,
          timestamp: new Date().toISOString(),
        }
        setError(apiError)
        showErrorToast(apiError)
      })
    } 
    // Handle API error responses
    else if (error?.error) {
      apiError = error.error
      setError(apiError)
      showErrorToast(apiError)
    } 
    // Handle generic errors
    else if (error instanceof Error) {
      apiError = {
        message: error.message,
        code: 'CLIENT_ERROR',
        timestamp: new Date().toISOString(),
      }
      setError(apiError)
      showErrorToast(apiError)
    } 
    // Handle unknown errors
    else {
      apiError = {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
      }
      setError(apiError)
      showErrorToast(apiError)
    }
  }, [showErrorToast])

  return {
    error,
    isError: !!error,
    clearError,
    handleError,
  }
}

/**
 * Get user-friendly error title based on error code
 */
function getErrorTitle(code?: string): string {
  switch (code) {
    case 'VALIDATION_ERROR':
      return 'Validation Error'
    case 'AUTHENTICATION_ERROR':
    case 'HTTP_401':
      return 'Authentication Required'
    case 'AUTHORIZATION_ERROR':
    case 'HTTP_403':
      return 'Access Denied'
    case 'NOT_FOUND':
    case 'HTTP_404':
      return 'Not Found'
    case 'CONFLICT':
    case 'HTTP_409':
      return 'Conflict'
    case 'RATE_LIMIT_EXCEEDED':
    case 'HTTP_429':
      return 'Too Many Requests'
    case 'HTTP_500':
    case 'INTERNAL_ERROR':
      return 'Server Error'
    default:
      return 'Error'
  }
}

/**
 * Hook for handling async operations with error handling
 */
export function useAsyncOperation<T extends (...args: any[]) => Promise<any>>() {
  const [isLoading, setIsLoading] = useState(false)
  const { error, handleError, clearError } = useApiError()

  const execute = useCallback(
    async (operation: T, ...args: Parameters<T>): Promise<ReturnType<T> | null> => {
      setIsLoading(true)
      clearError()

      try {
        const result = await operation(...args)
        return result
      } catch (err) {
        handleError(err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [handleError, clearError]
  )

  return {
    execute,
    isLoading,
    error,
    isError: !!error,
    clearError,
  }
} 