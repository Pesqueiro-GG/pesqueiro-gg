import { describe, expect, it } from 'vitest'

// Deliberately failing test for T-04 (#4): proves a red `ci` blocks merging. Never merge.
describe('pipeline check', () => {
  it('fails on purpose', () => {
    expect(1 + 1).toBe(3)
  })
})
