import type { z } from 'zod'
import { isDomainError } from './errors'
import { fail, ok, type Result } from './result'

/** The signed-in person a command runs for. */
export type Viewer = {
  id: string
  locale: 'pt-BR' | 'en'
  isPlatformAdmin: boolean
}

export type ActionContext = { viewer: Viewer }

export type ActionOptions = {
  /** Applied before anything else. Wired up with rate limits (#41). */
  rateLimit?: { key: string; limit: number; windowSec: number }
  /** Run the handler in a database transaction. Wired up with the database (#3). */
  tx?: boolean
}

/**
 * Resolves the session. Returns null until login is wired up (#9), so every action
 * answers UNAUTHENTICATED for now. Tests replace it with `setViewerResolver`.
 */
let resolveViewer: () => Promise<Viewer | null> = async () => null

export function setViewerResolver(resolver: () => Promise<Viewer | null>) {
  resolveViewer = resolver
}

/**
 * Builds a server action: checks the session, validates input with Zod, runs the handler,
 * and turns expected failures into a Result. See docs/reference/code-conventions.md#writes.
 */
export function authedAction<S extends z.ZodType, T>(
  schema: S,
  handler: (input: z.infer<S>, ctx: ActionContext) => Promise<T>,
  // Used once rate limits (#41) and transactions (#3) are wired up.
  options: ActionOptions = {},
): (raw: unknown) => Promise<Result<T>> {
  void options
  return async (raw) => {
    const viewer = await resolveViewer()
    if (!viewer) return fail('UNAUTHENTICATED')

    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      const field = parsed.error.issues[0]?.path.join('.')
      return fail('VALIDATION', field || undefined)
    }

    try {
      return ok(await handler(parsed.data, { viewer }))
    } catch (error) {
      if (isDomainError(error)) return fail(error.code, error.field)
      throw error
    }
  }
}
