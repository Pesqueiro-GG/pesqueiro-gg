import { describe, expect, it } from 'vitest'
import { deriveTier } from './rarity'

const tier = (range: number, difficulty: number, stocking: number) =>
  deriveTier({ range, difficulty, stocking })

describe('deriveTier', () => {
  it('derives comum through epico from rubric totals, including −1', () => {
    expect(tier(0, 0, -1)).toBe('comum') // −1, the lowest possible total
    expect(tier(0, 0, 0)).toBe('comum')
    expect(tier(1, 0, 0)).toBe('comum')
    expect(tier(1, 1, 0)).toBe('incomum')
    expect(tier(2, 1, 0)).toBe('raro')
    expect(tier(2, 2, 0)).toBe('epico')
  })

  it('lets stocking pull a species down a tier', () => {
    expect(tier(2, 2, -1)).toBe('raro')
    expect(tier(1, 1, -1)).toBe('comum')
  })
})
