import * as Sentry from '@sentry/nextjs'
import { sentryOptions } from '@/shared/observability/sentry-options'

// Starts Sentry in the browser. No Session Replay and no feedback widget: they record the screen.
Sentry.init(sentryOptions())

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
