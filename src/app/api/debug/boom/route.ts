import * as Sentry from '@sentry/nextjs'
import { isDebugEnv } from '@/shared/observability'

// Temporary: proves that errors reach Sentry and Discord, and that the scrubber removes
// personal data. Answers 404 outside local and dev. Remove once alerts are proven (S-34).

export const dynamic = 'force-dynamic'

export function GET(): Response {
  if (!isDebugEnv) return new Response(null, { status: 404 })

  // Fake personal data that must not appear in the Sentry event.
  Sentry.setContext('debug', { lat: -23.1, email: 'x@y.z', note: 'lat and email must be removed' })
  throw new Error('Deliberate error from /api/debug/boom')
}
