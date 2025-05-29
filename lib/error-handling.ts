import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

/**
 * Custom error classes for different error types
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT')
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED')
    this.name = 'RateLimitError'
  }
}

/**
 * Error response format
 */
interface ErrorResponse {
  error: {
    message: string
    code?: string
    details?: any
    timestamp: string
    path?: string
  }
}

/**
 * Format error for API response
 */
export function formatErrorResponse(
  error: Error | AppError,
  path?: string
): ErrorResponse {
  const timestamp = new Date().toISOString()
  
  if (error instanceof AppError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
        timestamp,
        path,
      },
    }
  }
  
  if (error instanceof ZodError) {
    return {
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors,
        timestamp,
        path,
      },
    }
  }
  
  // Generic error
  return {
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      code: 'INTERNAL_ERROR',
      timestamp,
      path,
    },
  }
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: Error | AppError,
  path?: string
): NextResponse {
  const statusCode = error instanceof AppError ? error.statusCode : 500
  const errorResponse = formatErrorResponse(error, path)
  
  // Log error (in production, use proper logging service)
  logError(error, path)
  
  return NextResponse.json(errorResponse, { status: statusCode })
}

/**
 * Error logging with sensitive data masking
 */
export function logError(error: Error | AppError, path?: string) {
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      ...(error instanceof AppError && {
        code: error.code,
        statusCode: error.statusCode,
        details: maskSensitiveData(error.details),
      }),
    },
    path,
  }
  
  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to logging service (e.g., Sentry, LogRocket)
    console.error(JSON.stringify(logData))
  } else {
    console.error('Error:', logData)
  }
}

/**
 * Mask sensitive data in error details
 */
function maskSensitiveData(data: any): any {
  if (!data) return data
  
  const sensitiveKeys = ['password', 'token', 'secret', 'api_key', 'apiKey', 'authorization']
  
  if (typeof data === 'object') {
    const masked = { ...data }
    
    for (const key in masked) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        masked[key] = '***MASKED***'
      } else if (typeof masked[key] === 'object') {
        masked[key] = maskSensitiveData(masked[key])
      }
    }
    
    return masked
  }
  
  return data
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args)
    } catch (error) {
      return createErrorResponse(
        error instanceof Error ? error : new Error('Unknown error'),
        args[0]?.nextUrl?.pathname
      )
    }
  }) as T
}

/**
 * Validate request body with Zod schema
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: any
): Promise<T> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError('Invalid request data', error.errors)
    }
    throw new ValidationError('Invalid request body')
  }
}

/**
 * Rate limiting check (simple in-memory implementation)
 * In production, use Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60000
): void {
  const now = Date.now()
  const userLimit = rateLimitMap.get(identifier)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return
  }
  
  if (userLimit.count >= limit) {
    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${Math.ceil((userLimit.resetTime - now) / 1000)} seconds`
    )
  }
  
  userLimit.count++
}

/**
 * Clean up old rate limit entries periodically
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60000) // Clean up every minute 