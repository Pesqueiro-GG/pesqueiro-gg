import type { z } from 'zod'
import { withTransaction, type Tx } from './db/client'
import { isDomainError } from './errors'
import { withSpan } from './observability/span'
import { fail, ok, type Result } from './result'

/** The signed-in person a command runs for. */
export type Viewer = {
  id: string
  locale: 'pt-BR' | 'en'
  isPlatformAdmin: boolean
}

/** `tx` is set when the action was built with `{ tx: true }`. */
export type ActionContext = { viewer: Viewer; tx?: Tx }

export type ActionOptions = {
  /** The command's name, such as `logbook.logCatch`; names its trace span. */
  name?: string
  /** Applied before anything else. Wired up with rate limits (#41). */
  rateLimit?: { key: string; limit: number; windowSec: number }
  /** Run the handler in a database transaction (5-second statement timeout). */
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
 * and turns expected failures into a Result, inside a trace span named after the command. See docs/reference/code-conventions.md#writes.
 */
export function authedAction<S extends z.ZodType, T>(
  schema: S,
  handler: (input: z.infer<S>, ctx: ActionContext) => Promise<T>,
  options: ActionOptions = {},
): (raw: unknown) => Promise<Result<T>> {
  return (raw) => withSpan(options.name ?? 'action', () => run(raw))

  async function run(raw: unknown): Promise<Result<T>> {
    const viewer = await resolveViewer()
    if (!viewer) return fail('UNAUTHENTICATED')

    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      const field = parsed.error.issues[0]?.path.join('.')
      return fail('VALIDATION', field || undefined)
    }

    try {
      const data = options.tx
        ? await withTransaction((tx) => handler(parsed.data, { viewer, tx }))
        : await handler(parsed.data, { viewer })
      return ok(data)
    } catch (error) {
      if (isDomainError(error)) return fail(error.code, error.field)
      throw error
    }
  }
}
