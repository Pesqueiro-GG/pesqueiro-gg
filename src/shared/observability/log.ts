import * as Sentry from '@sentry/nextjs'
import { scrub } from './scrub'

/**
 * Structured logging: `log.info('<module>.<event>', { userId, … })`.
 * Fields go to Sentry Logs (linked to the current trace) and, outside tests, to the console
 * as one JSON line. Pass internal IDs only: never emails, names, coordinates or request bodies.
 */
export type LogFields = Record<string, unknown>

type Level = 'info' | 'warn' | 'error'

function emit(level: Level, event: string, fields: LogFields = {}): void {
  const clean = scrub(fields)
  Sentry.logger[level](event, clean)
  if (process.env.NODE_ENV !== 'test') {
    const line = JSON.stringify({ level, event, ...clean })
    if (level === 'error') console.error(line)
    else if (level === 'warn') console.warn(line)
    else console.info(line)
  }
}

export const log = {
  info: (event: string, fields?: LogFields) => emit('info', event, fields),
  warn: (event: string, fields?: LogFields) => emit('warn', event, fields),
  error: (event: string, fields?: LogFields) => emit('error', event, fields),
}
