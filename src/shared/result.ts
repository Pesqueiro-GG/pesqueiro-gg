import type { ErrorCode } from './errors'

export type Failure = { code: ErrorCode; field?: string }

/** What every server action returns. */
export type Result<T> = { ok: true; data: T } | { ok: false; error: Failure }

export function ok<T>(data: T): Result<T> {
  return { ok: true, data }
}

export function fail<T = never>(code: ErrorCode, field?: string): Result<T> {
  return { ok: false, error: field === undefined ? { code } : { code, field } }
}
