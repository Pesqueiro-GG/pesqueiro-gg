/** The languages the interface ships in. User content is never translated. */
export const LOCALES = ['pt-BR', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'pt-BR'

/** Cookie that holds the chosen language. After S-03, the profile's language writes it. */
export const LOCALE_COOKIE = 'NEXT_LOCALE'

/** Season and challenge dates, and every date we show, use Brasília time. */
export const TIME_ZONE = 'America/Sao_Paulo'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/**
 * Picks the interface language: the cookie when it names a supported locale, otherwise the
 * first language in `Accept-Language` (any Portuguese → `pt-BR`, anything else → `en`).
 * With neither, Portuguese.
 */
export function resolveLocale(cookie: string | undefined, acceptLanguage: string | null | undefined): Locale {
  if (isLocale(cookie)) return cookie
  if (!acceptLanguage) return DEFAULT_LOCALE

  const preferred = acceptLanguage
    .split(',')
    .map((part, index) => {
      const [tag = '', ...params] = part.trim().split(';')
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='))
      const weight = q ? Number(q.slice(2)) : 1
      return { tag: tag.trim().toLowerCase(), weight: Number.isFinite(weight) ? weight : 0, index }
    })
    .filter((entry) => entry.tag && entry.tag !== '*' && entry.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index)[0]

  if (!preferred) return DEFAULT_LOCALE
  return preferred.tag === 'pt' || preferred.tag.startsWith('pt-') ? 'pt-BR' : 'en'
}
