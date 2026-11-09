import { describe, expect, it } from 'vitest'
import { formatDate, formatLength, formatNumber, formatRelative, formatWeight } from './format'

// Intl may use a no-break space between a value and its unit; compare with plain spaces.
const plain = (s: string) => s.replace(/[  ]/g, ' ')

describe('formatWeight', () => {
  it('shows kilograms with the locale decimal separator', () => {
    expect(formatWeight(2400, 'pt-BR')).toBe('2,4 kg')
    expect(formatWeight(2400, 'en')).toBe('2.4 kg')
  })

  it('shows grams under 1 kg', () => {
    expect(formatWeight(750, 'pt-BR')).toBe('750 g')
    expect(formatWeight(999, 'en')).toBe('999 g')
  })

  it('drops a zero decimal and rounds to one decimal', () => {
    expect(formatWeight(1000, 'pt-BR')).toBe('1 kg')
    expect(formatWeight(12_340, 'pt-BR')).toBe('12,3 kg')
  })

  it('groups thousands in big fish', () => {
    expect(formatWeight(1_250_000, 'pt-BR')).toBe('1.250 kg')
    expect(formatWeight(1_250_000, 'en')).toBe('1,250 kg')
  })
})

describe('formatLength', () => {
  it('shows centimetres', () => {
    expect(formatLength(480, 'pt-BR')).toBe('48 cm')
    expect(formatLength(485, 'pt-BR')).toBe('48,5 cm')
    expect(formatLength(485, 'en')).toBe('48.5 cm')
  })
})

describe('formatNumber', () => {
  it('uses the locale separators', () => {
    expect(formatNumber(12345.6, 'pt-BR')).toBe('12.345,6')
    expect(formatNumber(12345.6, 'en')).toBe('12,345.6')
  })
})

describe('formatDate', () => {
  it('shows the Brasília date for a moment just before midnight there', () => {
    // 02:30 UTC on 9 Nov is 23:30 on 8 Nov in Brasília (UTC−3).
    const lateNight = new Date('2026-11-09T02:30:00Z')
    expect(plain(formatDate(lateNight, 'pt-BR'))).toBe('8 de nov. de 2026')
    expect(plain(formatDate(lateNight, 'en'))).toBe('Nov 8, 2026')
  })

  it('shows the next day for a moment just after midnight in Brasília', () => {
    const justAfter = new Date('2026-11-09T03:05:00Z')
    expect(plain(formatDate(justAfter, 'pt-BR'))).toBe('9 de nov. de 2026')
  })
})

describe('formatRelative', () => {
  const now = new Date('2026-11-09T15:00:00Z') // 12:00 in Brasília

  it('says now for under a minute', () => {
    expect(formatRelative(new Date('2026-11-09T14:59:30Z'), 'pt-BR', now)).toBe('agora')
    expect(formatRelative(new Date('2026-11-09T14:59:30Z'), 'en', now)).toBe('now')
  })

  it('counts minutes and hours', () => {
    expect(formatRelative(new Date('2026-11-09T14:55:00Z'), 'pt-BR', now)).toBe('há 5 minutos')
    expect(formatRelative(new Date('2026-11-09T12:00:00Z'), 'en', now)).toBe('3 hours ago')
  })

  it('counts calendar days in Brasília time, not 24-hour blocks', () => {
    // 23:30 on 8 Nov to 01:00 on 10 Nov in Brasília is 25.5 hours, but two calendar days.
    const lateNight = new Date('2026-11-09T02:30:00Z')
    const earlyMorning = new Date('2026-11-10T04:00:00Z')
    expect(formatRelative(lateNight, 'pt-BR', earlyMorning)).toBe('anteontem')
    expect(formatRelative(lateNight, 'en', earlyMorning)).toBe('2 days ago')
    expect(formatRelative(new Date('2026-11-08T13:00:00Z'), 'pt-BR', now)).toBe('ontem')
    expect(formatRelative(new Date('2026-11-08T13:00:00Z'), 'en', now)).toBe('yesterday')
  })

  it('falls back to the date after a week', () => {
    expect(plain(formatRelative(new Date('2026-10-20T15:00:00Z'), 'en', now))).toBe('Oct 20, 2026')
  })
})
