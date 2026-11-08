import { sql } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { appEnv, commit, log } from '@/shared/observability'

// Checked by the uptime monitors every 5 minutes and by deploy.yml after each deploy.
// See docs/reference/observability.md#the-health-route.

export const dynamic = 'force-dynamic'

const TIMEOUT_MS = 2000

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`timed out after ${ms} ms`)), ms).unref?.()
  })
}

export async function GET(): Promise<Response> {
  const body = { commit, env: appEnv, time: new Date().toISOString() }
  try {
    await Promise.race([db().execute(sql`select 1`), timeout(TIMEOUT_MS)])
    return Response.json({ status: 'ok', ...body }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    log.warn('health.degraded', { reason: error instanceof Error ? error.message : String(error) })
    return Response.json(
      { status: 'degraded', ...body },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
