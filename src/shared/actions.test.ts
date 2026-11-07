import { afterEach, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { authedAction, setViewerResolver, type Viewer } from './actions'
import { DomainError } from './errors'

const viewer: Viewer = { id: 'u1', locale: 'pt-BR', isPlatformAdmin: false }
const schema = z.object({ name: z.string().min(2) })
const greet = authedAction(schema, async ({ name }, { viewer }) => `${name}:${viewer.id}`)

afterEach(() => setViewerResolver(async () => null))

describe('authedAction', () => {
  it('answers UNAUTHENTICATED without a session', async () => {
    expect(await greet({ name: 'Tião' })).toEqual({ ok: false, error: { code: 'UNAUTHENTICATED' } })
  })

  it('validates input and names the failing field', async () => {
    setViewerResolver(async () => viewer)
    expect(await greet({ name: 'T' })).toEqual({ ok: false, error: { code: 'VALIDATION', field: 'name' } })
  })

  it('runs the handler with the viewer and wraps the result', async () => {
    setViewerResolver(async () => viewer)
    expect(await greet({ name: 'Tião' })).toEqual({ ok: true, data: 'Tião:u1' })
  })

  it('turns a DomainError into a failure', async () => {
    setViewerResolver(async () => viewer)
    const action = authedAction(schema, async () => {
      throw new DomainError('NOT_FOUND')
    })
    expect(await action({ name: 'Tião' })).toEqual({ ok: false, error: { code: 'NOT_FOUND' } })
  })

  it('rethrows unexpected errors so monitoring sees them', async () => {
    setViewerResolver(async () => viewer)
    const action = authedAction(schema, async () => {
      throw new Error('boom')
    })
    await expect(action({ name: 'Tião' })).rejects.toThrow('boom')
  })
})
