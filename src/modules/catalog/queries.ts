import { asc, eq, sql } from 'drizzle-orm'
import { withSpan } from '@/shared/observability'
import { db } from '@/shared/db/client'
import { species } from './schema'

// Reads of the species catalog. Server-only: the browser never queries the database.

export type Locale = 'pt-BR' | 'en'

export type Species = {
  id: string
  albumNo: number
  scientificName: string
  /** The name in the requested language. */
  name: string
  namePt: string
  nameEn: string
  aliasesPt: string[]
  habitat: 'freshwater' | 'marine' | 'both'
  rarityTier: 'comum' | 'incomum' | 'raro' | 'epico'
  isProtected: boolean
  /** The protection note in the requested language; null when the species isn't protected. */
  protectionNote: string | null
  sources: string[]
}

type Row = typeof species.$inferSelect

function toSpecies(row: Row, locale: Locale): Species {
  return {
    id: row.id,
    albumNo: row.albumNo,
    scientificName: row.scientificName,
    name: locale === 'en' ? row.nameEn : row.namePt,
    namePt: row.namePt,
    nameEn: row.nameEn,
    aliasesPt: row.aliasesPt,
    habitat: row.habitat,
    rarityTier: row.rarityTier,
    isProtected: row.isProtected,
    protectionNote: locale === 'en' ? row.protectionNoteEn : row.protectionNotePt,
    sources: row.sources,
  }
}

/** Every species in album order. */
export function listSpecies(locale: Locale): Promise<Species[]> {
  return withSpan('catalog.listSpecies', async () => {
    const rows = await db().select().from(species).orderBy(asc(species.albumNo))
    return rows.map((row) => toSpecies(row, locale))
  })
}

/** One species by id, or null when there is none. */
export function getSpecies(id: string, locale: Locale = 'pt-BR'): Promise<Species | null> {
  return withSpan('catalog.getSpecies', async () => {
    const [row] = await db().select().from(species).where(eq(species.id, id)).limit(1)
    return row ? toSpecies(row, locale) : null
  })
}

const SEARCH_LIMIT = 20

/** Escapes the characters LIKE treats as wildcards. */
function escapeLike(text: string) {
  return text.replace(/[\\%_]/g, '\\$&')
}

/**
 * Finds species by name in either language, regional name or scientific name,
 * ignoring accents and case. Names that start with the search come first.
 */
export function searchSpecies(query: string, locale: Locale): Promise<Species[]> {
  return withSpan('catalog.searchSpecies', async () => {
    const term = query.trim()
    if (!term) return []
    const folded = (value: ReturnType<typeof sql>) => sql`extensions.unaccent(lower(${value}))`
    const contains = sql`${'%' + escapeLike(term) + '%'}`
    const startsWith = sql`${escapeLike(term) + '%'}`
    const matches = (value: ReturnType<typeof sql>, pattern: ReturnType<typeof sql>) =>
      sql`${folded(value)} like ${folded(pattern)}`

    const aliasMatch = (pattern: ReturnType<typeof sql>) =>
      sql`exists (select 1 from unnest(${species.aliasesPt}) as alias where ${matches(sql`alias`, pattern)})`
    const anyMatch = (pattern: ReturnType<typeof sql>) =>
      sql`(${matches(sql`${species.namePt}`, pattern)}
        or ${matches(sql`${species.nameEn}`, pattern)}
        or ${matches(sql`${species.scientificName}`, pattern)}
        or ${aliasMatch(pattern)})`

    const rows = await db()
      .select()
      .from(species)
      .where(anyMatch(contains))
      .orderBy(sql`case when ${anyMatch(startsWith)} then 0 else 1 end`, asc(species.albumNo))
      .limit(SEARCH_LIMIT)
    return rows.map((row) => toSpecies(row, locale))
  })
}
