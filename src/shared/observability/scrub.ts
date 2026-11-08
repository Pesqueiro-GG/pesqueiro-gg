// Removes personal data from everything sent to monitoring tools.
// It's a safety net, not permission to log personal data: callers still pass internal IDs only.
// See docs/reference/observability.md#what-never-leaves-the-server.

/** Keys removed at any depth, compared without case. */
const SENSITIVE_KEYS = new Set([
  'lat',
  'lng',
  'lon',
  'latitude',
  'longitude',
  'coordinates',
  'email',
  'photo',
  'body',
  'password',
  'token',
  'authorization',
  'cookie',
  'cookies',
  'phone',
  'query',
  'query_string',
  'url.query',
  'http.query',
])

/** Keys holding URLs, whose query string and fragment are dropped. */
const URL_KEYS = new Set(['url', 'url.full', 'http.url', 'http.target', 'href', 'from', 'to'])

// Slashes are excluded so file paths such as node_modules/@sentry/core.js aren't mistaken for emails.
const EMAIL = /[^\s@<>"'(),;:/\\]+@[^\s@<>"'(),;:/\\]+\.[a-z]+/gi
const MAX_DEPTH = 20

export const REDACTED_EMAIL = '[email]'

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.has(key.toLowerCase())
}

/** Returns a copy of `value` without sensitive keys and with email addresses in strings replaced. */
export function scrub<T>(value: T): T {
  return scrubAt(value, 0, new WeakSet()) as T
}

function scrubAt(value: unknown, depth: number, seen: WeakSet<object>): unknown {
  if (typeof value === 'string') return value.replace(EMAIL, REDACTED_EMAIL)
  if (value === null || typeof value !== 'object') return value
  if (depth >= MAX_DEPTH || seen.has(value)) return '[dropped]'
  seen.add(value)

  try {
    return scrubObject(value, depth, seen)
  } finally {
    // Track only the current path, so an object referenced twice isn't mistaken for a cycle.
    seen.delete(value)
  }
}

function scrubObject(value: object, depth: number, seen: WeakSet<object>): unknown {
  if (Array.isArray(value)) return value.map((item) => scrubAt(item, depth + 1, seen))
  if (value instanceof Date) return value

  const out: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value)) {
    if (isSensitiveKey(key)) continue
    out[key] =
      typeof item === 'string' && URL_KEYS.has(key.toLowerCase())
        ? stripQuery(item).replace(EMAIL, REDACTED_EMAIL)
        : scrubAt(item, depth + 1, seen)
  }
  return out
}

/** Drops the query string and fragment, which can carry coordinates or tokens. */
export function stripQuery(url: string): string {
  const cut = url.search(/[?#]/)
  return cut === -1 ? url : url.slice(0, cut)
}

/** The parts of a Sentry event the scrubber treats specially. */
export type EventLike = {
  request?: { url?: string; method?: string; headers?: Record<string, string> }
  user?: { id?: string | number }
}

/**
 * Cleans an error or transaction event: the request keeps only its method, URL without query
 * and user agent; the user keeps only the internal ID; every other field is scrubbed.
 */
export function scrubEvent<E extends EventLike>(event: E): E {
  const { request, user, ...rest } = event
  const out = scrub(rest) as E & EventLike

  if (request) {
    const userAgent = Object.entries(request.headers ?? {}).find(
      ([name]) => name.toLowerCase() === 'user-agent',
    )?.[1]
    out.request = {
      ...(request.method ? { method: request.method } : {}),
      ...(request.url ? { url: stripQuery(request.url) } : {}),
      ...(userAgent ? { headers: { 'user-agent': userAgent } } : {}),
    }
  }
  if (user?.id !== undefined) out.user = { id: user.id }
  return out
}

/** Cleans a breadcrumb, including URLs recorded by fetch and navigation breadcrumbs. */
export function scrubBreadcrumb<B extends object>(breadcrumb: B): B {
  return scrub(breadcrumb)
}
