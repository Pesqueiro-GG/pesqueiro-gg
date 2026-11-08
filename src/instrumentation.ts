import * as Sentry from '@sentry/nextjs'
import { sentryOptions } from '@/shared/observability/sentry-options'

// Starts Sentry on the server and edge runtimes. Without NEXT_PUBLIC_SENTRY_DSN it stays off.
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init(sentryOptions())
  }
}

// Reports errors thrown in Server Components, route handlers and the proxy.
export const onRequestError = Sentry.captureRequestError
