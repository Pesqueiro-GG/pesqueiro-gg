'use client'

import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'
import { useEffect } from 'react'

// Reports errors that break the root layout. Next.js's default error page has no text of
// ours, so there's nothing to translate here; the app's own error states come with the shell (#6).
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
