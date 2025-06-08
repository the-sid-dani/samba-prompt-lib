import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/health/route'

// Mock the Supabase client
vi.mock('@/utils/supabase/server', () => ({
  createSupabaseAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }))
}))

describe('/api/health', () => {
  beforeEach(() => {
    // Reset environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    process.env.NEXTAUTH_SECRET = 'test-secret'
    process.env.NEXTAUTH_URL = 'http://localhost:3000'
  })

  it('should return healthy status when all checks pass', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('healthy')
    expect(data.checks.database).toBe('connected')
    expect(data.checks.environment).toBe('configured')
    expect(data.checks.api).toBe('operational')
    expect(data.timestamp).toBeDefined()
  })

  it('should return unhealthy status when environment variables are missing', async () => {
    // Remove required environment variable
    delete process.env.NEXTAUTH_SECRET

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(503)
    expect(data.status).toBe('unhealthy')
    expect(data.error).toContain('Missing environment variables')
    expect(data.checks.database).toBe('failed')
  })

  it('should include version and environment information', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.version).toBeDefined()
    expect(data.environment).toBeDefined()
    expect(data.timestamp).toBeDefined()
  })
}) 