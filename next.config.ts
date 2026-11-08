import { withSentryConfig } from '@sentry/nextjs/config'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Fixed at build time so the server, the browser and /api/health agree.
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.APP_ENV ?? 'local',
    NEXT_PUBLIC_COMMIT_SHA: process.env.APP_COMMIT_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? 'local',
  },
}

// Source maps upload only when SENTRY_AUTH_TOKEN is set (in deploy.yml); otherwise this only
// adds the SDK's build-time instrumentation.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  telemetry: false,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
})
