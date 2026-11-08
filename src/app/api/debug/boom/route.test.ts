import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@sentry/nextjs', () => ({ setContext: vi.fn() }))

async function loadRoute(appEnv: string) {
  vi.resetModules()
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', appEnv)
  return import('./route')
}

afterEach(() => vi.unstubAllEnvs())

describe('/api/debug/boom', () => {
  it.each(['production', 'demo'])('answers 404 on %s', async (appEnv) => {
    const { GET } = await loadRoute(appEnv)
    expect(GET().status).toBe(404)
  })

  it.each(['local', 'dev'])('throws on %s', async (appEnv) => {
    const { GET } = await loadRoute(appEnv)
    expect(() => GET()).toThrow('Deliberate error')
  })
})
