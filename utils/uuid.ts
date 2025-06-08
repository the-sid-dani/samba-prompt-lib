import { v4 as uuidv4 } from 'uuid'

export function generateUUID(): string {
  // Try to use crypto.randomUUID if available (Node.js 19+ or modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID()
    } catch (error) {
      console.warn('crypto.randomUUID failed, falling back to uuid package:', error)
    }
  }
  
  // Fallback to uuid package
  return uuidv4()
}

export default generateUUID 