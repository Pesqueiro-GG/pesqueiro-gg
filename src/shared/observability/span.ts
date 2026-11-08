import * as Sentry from '@sentry/nextjs'

/**
 * Runs `fn` inside a named trace span, such as `logbook.logCatch` or `feed.page`.
 * The span ends when `fn` settles, and marks an error if it throws.
 */
export function withSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return Sentry.startSpan({ name, op: 'function' }, fn)
}
