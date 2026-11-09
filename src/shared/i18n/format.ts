import { TIME_ZONE, type Locale } from './locale'

/**
 * Formatters for every number, weight, length and date the interface shows. Weights are stored
 * in whole grams and lengths in whole millimetres; dates are shown in Brasília time.
 */

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value)
}

/** 2400 → "2,4 kg" (pt-BR) or "2.4 kg" (en); under 1 kg, "750 g". */
export function formatWeight(grams: number, locale: Locale): string {
  if (Math.abs(grams) < 1000) return `${formatNumber(Math.round(grams), locale)} g`
  return `${formatNumber(grams / 1000, locale, { maximumFractionDigits: 1 })} kg`
}

/** 480 → "48 cm"; 485 → "48,5 cm" (pt-BR) or "48.5 cm" (en). */
export function formatLength(mm: number, locale: Locale): string {
  return `${formatNumber(mm / 10, locale, { maximumFractionDigits: 1 })} cm`
}

/** A calendar date in Brasília time: "8 de nov. de 2026" (pt-BR) or "Nov 8, 2026" (en). */
export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
    timeZone: TIME_ZONE,
  }).format(date)
}

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

/**
 * How long ago (or until) a moment: "agora", "há 5 minutos", "ontem", "há 3 dias". Past a week
 * it falls back to `formatDate`.
 */
export function formatRelative(date: Date, locale: Locale, now: Date = new Date()): string {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000)
  const abs = Math.abs(seconds)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (abs < MINUTE) return rtf.format(0, 'second')
  if (abs < HOUR) return rtf.format(Math.trunc(seconds / MINUTE), 'minute')
  if (abs < DAY) return rtf.format(Math.trunc(seconds / HOUR), 'hour')
  if (abs < WEEK) return rtf.format(calendarDayDifference(date, now), 'day')
  return formatDate(date, locale)
}

/** Whole calendar days between two moments, counted in Brasília time. */
function calendarDayDifference(date: Date, now: Date): number {
  return Math.round((brasiliaDay(date) - brasiliaDay(now)) / (DAY * 1000))
}

function brasiliaDay(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  return Date.parse(`${parts}T00:00:00Z`)
}
