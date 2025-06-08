import { describe, it, expect } from 'vitest'

describe('CI Validation Tests', () => {
  it('should pass - validating CI test reporting works for passing tests', () => {
    expect(true).toBe(true)
    expect(2 + 2).toBe(4)
    expect('hello').toContain('ell')
  })

  // Temporarily disabled failing test for CI validation
  // Uncomment this test to verify CI properly reports test failures
  /*
  it('should fail - validating CI test reporting works for failing tests', () => {
    expect(true).toBe(false) // This will fail
    expect(2 + 2).toBe(5) // This will also fail
  })
  */
}) 