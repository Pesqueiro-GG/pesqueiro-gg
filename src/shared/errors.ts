/**
 * Error codes every command can return. Messages live under `errors.<CODE>` in both
 * language files. See docs/reference/code-conventions.md#error-codes.
 */
export const ERROR_CODES = [
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VALIDATION',
  'RATE_LIMITED',
  'CONFLICT',
  'UNAVAILABLE',
] as const

export type ErrorCode = (typeof ERROR_CODES)[number]

/** An expected failure a command reports to the caller instead of crashing. */
export class DomainError extends Error {
  readonly code: ErrorCode
  readonly field: string | undefined

  constructor(code: ErrorCode, options: { field?: string; message?: string } = {}) {
    super(options.message ?? code)
    this.name = 'DomainError'
    this.code = code
    this.field = options.field
  }
}

export function isDomainError(value: unknown): value is DomainError {
  return value instanceof DomainError
}
