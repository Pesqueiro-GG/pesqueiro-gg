import { describe, expect, it } from 'vitest'
import { REDACTED_EMAIL, scrub, scrubBreadcrumb, scrubEvent, stripQuery, type EventLike } from './scrub'

describe('scrub', () => {
  it('removes coordinate and email keys at any depth', () => {
    const input = {
      catch: { id: 'c1', spot: { lat: -23.1, lng: -46.6, latitude: 1, longitude: 2 } },
      people: [{ id: 'u1', email: 'x@y.z', Email: 'X@Y.Z' }],
    }
    expect(scrub(input)).toEqual({ catch: { id: 'c1', spot: {} }, people: [{ id: 'u1' }] })
  })

  it('removes request bodies, photos, passwords and tokens', () => {
    expect(scrub({ body: '{"lat":1}', photo: 'data:…', password: 'p', token: 't', ok: 1 })).toEqual({
      ok: 1,
    })
  })

  it('removes dotted attribute names that end in a sensitive key', () => {
    expect(
      scrub({
        'user.id': 'u1',
        'user.email': 'x@y.z',
        'user.ip_address': '1.2.3.4',
        'client.address': '1.2.3.4',
        'http.request.header.cookie': 'session=abc',
        'url.query': 'lat=-23.1',
        'http.request.method': 'GET',
      }),
    ).toEqual({ 'user.id': 'u1', 'http.request.method': 'GET' })
  })

  it('leaves file paths with @ alone', () => {
    const path = '/var/task/node_modules/@sentry/core/build/index.js'
    expect(scrub({ filename: path })).toEqual({ filename: path })
  })

  it('replaces email addresses inside strings', () => {
    expect(scrub('from x@y.z')).toBe(`from ${REDACTED_EMAIL}`)
    expect(scrub({ message: 'no account for maria@example.com.br' })).toEqual({
      message: `no account for ${REDACTED_EMAIL}`,
    })
  })

  it('drops the query string of URL fields', () => {
    expect(
      scrub({ data: { url: '/api/spots?lat=-23.1&lng=-46.6', 'url.full': 'https://a.b/c?x=1#y' } }),
    ).toEqual({
      data: { url: '/api/spots', 'url.full': 'https://a.b/c' },
    })
  })

  it('leaves the input unchanged', () => {
    const input = { user: { id: 'u1', email: 'x@y.z' } }
    scrub(input)
    expect(input.user.email).toBe('x@y.z')
  })

  it('survives cycles and keeps objects referenced twice', () => {
    const shared = { id: 's' }
    const node: Record<string, unknown> = { a: shared, b: shared }
    node.self = node
    expect(scrub(node)).toEqual({ a: { id: 's' }, b: { id: 's' }, self: '[dropped]' })
  })
})

describe('scrubEvent', () => {
  it('keeps only the method, URL without query and user agent of the request', () => {
    const event = scrubEvent({
      message: 'boom',
      request: {
        method: 'POST',
        url: 'https://pesqueirogg.vercel.app/api/catches?lat=-23.1',
        headers: { 'User-Agent': 'Mozilla', Cookie: 'session=abc', 'X-Forwarded-For': '1.2.3.4' },
        data: { lat: -23.1, species: 'tilapia' },
        cookies: { session: 'abc' },
        query_string: 'lat=-23.1',
      } as never,
    })
    expect(event.request).toEqual({
      method: 'POST',
      url: 'https://pesqueirogg.vercel.app/api/catches',
      headers: { 'user-agent': 'Mozilla' },
    })
  })

  it('keeps only the internal ID of the user', () => {
    const event = scrubEvent({
      user: { id: 'u1', email: 'x@y.z', username: 'maria', ip_address: '1.2.3.4' } as never,
    })
    expect(event.user).toEqual({ id: 'u1' })
  })

  it('removes coordinates and emails from contexts, extra data and breadcrumbs', () => {
    const input: EventLike & Record<string, unknown> = {
      contexts: { debug: { lat: -23.1, email: 'x@y.z', note: 'kept' } },
      extra: { nested: { deeper: { longitude: -46.6 } } },
      breadcrumbs: [{ category: 'fetch', data: { url: '/x?lat=1', body: 'secret' } }],
    }
    const event = scrubEvent(input)
    const text = JSON.stringify(event)
    expect(text).not.toContain('-23.1')
    expect(text).not.toContain('x@y.z')
    expect(text).not.toContain('-46.6')
    expect(text).not.toContain('secret')
    expect(event.contexts).toEqual({ debug: { note: 'kept' } })
  })
})

describe('scrubBreadcrumb', () => {
  it('cleans data and navigation URLs', () => {
    expect(
      scrubBreadcrumb({ category: 'navigation', data: { from: '/a?lat=1', to: '/b#spot' }, message: 'to b' }),
    ).toEqual({ category: 'navigation', data: { from: '/a', to: '/b' }, message: 'to b' })
  })
})

describe('stripQuery', () => {
  it('drops everything from the first ? or #', () => {
    expect(stripQuery('/p/1?x=1#y')).toBe('/p/1')
    expect(stripQuery('/p/1#y')).toBe('/p/1')
    expect(stripQuery('/p/1')).toBe('/p/1')
  })
})
