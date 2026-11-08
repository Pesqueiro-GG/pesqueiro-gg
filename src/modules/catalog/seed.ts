import { sql } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { deriveTier } from './rarity'
import { species } from './schema'
import { loadSpeciesFile, type SpeciesEntry } from './species-data'

// Loads data/species.json into the `species` table. Safe to run any number of times:
// it upserts by id and never changes the album_no of an existing species. It never deletes rows.

export type SeedReport = { inserted: number; updated: number; unreviewed: number; missingFromFile: string[] }

function toRow(entry: SpeciesEntry): typeof species.$inferInsert {
  return {
    id: entry.id,
    albumNo: entry.album_no,
    scientificName: entry.scientific_name,
    namePt: entry.name_pt,
    nameEn: entry.name_en,
    aliasesPt: entry.aliases_pt,
    habitat: entry.habitat,
    rarityTier: deriveTier(entry.rubric),
    isProtected: entry.is_protected,
    protectionNotePt: entry.protection_note_pt,
    protectionNoteEn: entry.protection_note_en,
    sources: entry.sources,
    reviewedBy: entry.reviewed_by,
    reviewedAt: entry.reviewed_at ? new Date(`${entry.reviewed_at}T00:00:00Z`) : null,
  }
}

export async function seedSpecies(database: PostgresJsDatabase, input?: unknown): Promise<SeedReport> {
  const entries = loadSpeciesFile(input)

  return database.transaction(async (tx) => {
    const existing = await tx.select({ id: species.id, albumNo: species.albumNo }).from(species)
    const numberById = new Map(existing.map((row) => [row.id, row.albumNo]))
    const idByNumber = new Map(existing.map((row) => [row.albumNo, row.id]))

    for (const entry of entries) {
      const stored = numberById.get(entry.id)
      if (stored !== undefined && stored !== entry.album_no) {
        throw new Error(
          `${entry.id} already has album number ${stored}; the file says ${entry.album_no}. Album numbers never change.`,
        )
      }
      const owner = idByNumber.get(entry.album_no)
      if (stored === undefined && owner !== undefined) {
        throw new Error(
          `Album number ${entry.album_no} already belongs to ${owner}; ${entry.id} needs a new one.`,
        )
      }
    }

    for (const entry of entries) {
      const { id, albumNo, ...changeable } = toRow(entry)
      void id
      void albumNo
      await tx
        .insert(species)
        .values(toRow(entry))
        .onConflictDoUpdate({ target: species.id, set: changeable })
    }

    const ids = new Set(entries.map((entry) => entry.id))
    return {
      inserted: entries.filter((entry) => !numberById.has(entry.id)).length,
      updated: entries.filter((entry) => numberById.has(entry.id)).length,
      unreviewed: entries.filter((entry) => entry.reviewed_by === null).length,
      missingFromFile: existing.map((row) => row.id).filter((id) => !ids.has(id)),
    }
  })
}

/** Counts rows, for scripts and tests. */
export async function countSpecies(database: PostgresJsDatabase): Promise<number> {
  const [row] = await database.select({ n: sql<number>`count(*)::int` }).from(species)
  return row?.n ?? 0
}
