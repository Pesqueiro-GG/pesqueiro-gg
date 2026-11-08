import type { Log } from '@sentry/nextjs'
import { describe, expect, it } from 'vitest'
import { sentryOptions } from './sentry-options'

describe('sentryOptions', () => {
  it('stays off without a DSN', () => {
    expect(sentryOptions().enabled).toBe(process.env.NEXT_PUBLIC_SENTRY_DSN ? true : false)
  })

  it('switches off every kind of personal data collection', () => {
    expect(sentryOptions().dataCollection).toEqual({
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
    })
  })

  it('removes coordinates and emails from an error event before sending', () => {
    const event = sentryOptions().beforeSend({
      exception: { values: [{ type: 'Error', value: 'failed for x@y.z' }] },
      contexts: { debug: { lat: -23.1, email: 'x@y.z' } },
      user: { id: 'u1', email: 'x@y.z' },
    } as never)
    const text = JSON.stringify(event)
    expect(text).not.toContain('-23.1')
    expect(text).not.toContain('x@y.z')
  })

  it('removes coordinates and emails from log fields', () => {
    const log = sentryOptions().beforeSendLog({
      level: 'info',
      message: 'logbook.catchSaved for x@y.z',
      attributes: { userId: 'u1', lat: -23.1, nested: { email: 'x@y.z' } },
    } as Log)
    expect(log.attributes).toEqual({ userId: 'u1', nested: {} })
    expect(log.message).not.toContain('x@y.z')
  })
})
