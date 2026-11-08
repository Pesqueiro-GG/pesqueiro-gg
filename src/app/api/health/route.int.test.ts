import { afterEach, describe, expect, inject, it, vi } from 'vitest'

// The database client is created once per module load, so each test loads a fresh copy
// with its own DATABASE_URL.
async function loadRoute(databaseUrl: string) {
  vi.resetModules()
  vi.stubEnv('DATABASE_URL', databaseUrl)
  vi.stubEnv('NEXT_PUBLIC_COMMIT_SHA', 'abc1234')
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'dev')
  const route = await import('./route')
  const { closeDb } = await import('@/shared/db/client')
  return { GET: route.GET, closeDb }
}

afterEach(() => vi.unstubAllEnvs())

describe('/api/health', () => {
  it('answers 200 with the commit and environment when the database answers', async () => {
    const { GET, closeDb } = await loadRoute(inject('appUrl'))
    try {
      const res = await GET()
      expect(res.status).toBe(200)
      expect(res.headers.get('cache-control')).toBe('no-store')
      expect(await res.json()).toMatchObject({ status: 'ok', commit: 'abc1234', env: 'dev' })
    } finally {
      await closeDb()
    }
  })

  it('answers 503 when the database URL is wrong', async () => {
    const wrong = new URL(inject('appUrl'))
    wrong.port = '1' // nothing listens there
    const { GET, closeDb } = await loadRoute(wrong.toString())
    try {
      const res = await GET()
      expect(res.status).toBe(503)
      expect(res.headers.get('cache-control')).toBe('no-store')
      expect(await res.json()).toMatchObject({ status: 'degraded', commit: 'abc1234', env: 'dev' })
    } finally {
      await closeDb()
    }
  })
})
