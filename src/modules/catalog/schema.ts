import { boolean, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

// Tables owned by the catalog module. See docs/reference/data-model.md#catalog.

export const speciesHabitat = pgEnum('species_habitat', ['freshwater', 'marine', 'both'])
export const rarityTier = pgEnum('rarity_tier', ['comum', 'incomum', 'raro', 'epico'])

export const species = pgTable('species', {
  /** Slug, such as `tucunare-acu`. */
  id: text('id').primaryKey(),
  /** Sticker number in the album. Unique, and never changed once assigned. */
  albumNo: integer('album_no').notNull().unique(),
  scientificName: text('scientific_name').notNull(),
  namePt: text('name_pt').notNull(),
  nameEn: text('name_en').notNull(),
  /** Regional names, for search. */
  aliasesPt: text('aliases_pt').array().notNull().default([]),
  habitat: speciesHabitat('habitat').notNull(),
  rarityTier: rarityTier('rarity_tier').notNull(),
  /** Threatened or regulated: the sticker can be filled, but the tier is ignored and no XP is awarded. */
  isProtected: boolean('is_protected').notNull().default(false),
  protectionNotePt: text('protection_note_pt'),
  protectionNoteEn: text('protection_note_en'),
  sources: text('sources').array().notNull(),
  reviewedBy: text('reviewed_by'),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
})
