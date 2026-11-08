import { beforeEach, describe, expect, it, vi } from 'vitest'

const sentryLogger = vi.hoisted(() => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() }))
vi.mock('@sentry/nextjs', () => ({ logger: sentryLogger }))

const { log } = await import('./log')

beforeEach(() => vi.clearAllMocks())

describe('log', () => {
  it('sends the event name and scrubbed fields to Sentry Logs', () => {
    log.info('logbook.catchSaved', { userId: 'u1', catchId: 'c1', lat: -23.1, email: 'x@y.z' })
    expect(sentryLogger.info).toHaveBeenCalledWith('logbook.catchSaved', { userId: 'u1', catchId: 'c1' })
  })

  it('uses the matching level', () => {
    log.warn('health.degraded', { reason: 'timeout' })
    log.error('media.uploadFailed')
    expect(sentryLogger.warn).toHaveBeenCalledWith('health.degraded', { reason: 'timeout' })
    expect(sentryLogger.error).toHaveBeenCalledWith('media.uploadFailed', {})
  })
})
