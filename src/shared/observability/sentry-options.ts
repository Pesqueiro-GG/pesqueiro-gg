import type { Log } from '@sentry/nextjs'
import { appEnv, commit } from './build-info'
import { scrub, scrubBreadcrumb, scrubEvent, type EventLike } from './scrub'

/**
 * Options shared by the server, edge and browser Sentry SDKs.
 *
 * Sentry 11 replaced `sendDefaultPii` with `dataCollection`, whose defaults collect request
 * bodies, cookies, headers, user details, database query values and local variables.
 * Every category is switched off here; the hooks then scrub what remains.
 */
export function sentryOptions() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
  return {
    dsn,
    enabled: Boolean(dsn),
    environment: appEnv,
    release: commit,
    tracesSampleRate: appEnv === 'demo' || appEnv === 'production' ? 0.2 : 1.0,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: { request: { allow: ['user-agent'] }, response: false },
      httpBodies: [],
      urlQueryParams: false,
      graphQL: { document: false, variables: false },
      genAI: { inputs: false, outputs: false },
      mcp: { inputs: false, outputs: false },
      databaseQueryData: false,
      queues: false,
      stackFrameVariables: false,
    },
    beforeSend: <E extends EventLike>(event: E) => scrubEvent(event),
    beforeSendTransaction: <E extends EventLike>(event: E) => scrubEvent(event),
    beforeBreadcrumb: <B extends object>(breadcrumb: B) => scrubBreadcrumb(breadcrumb),
    beforeSendLog: (log: Log) => ({ ...log, message: scrub(log.message), attributes: scrub(log.attributes) }),
  }
}
