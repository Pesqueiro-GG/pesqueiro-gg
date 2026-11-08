import { z } from 'zod'
import raw from './data/species.json'

// The curated species list lives in data/species.json and is loaded into the `species` table by
// the seed. The rubric scores stay in the file for transparency; the tier is always derived.
// AI may draft entries, but a person checks each one and fills reviewed_by / reviewed_at.

export const HABITATS = ['freshwater', 'marine', 'both'] as const
export type Habitat = (typeof HABITATS)[number]

const text = z.string().trim().min(1)

export const speciesEntrySchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id must be a lowercase slug'),
    album_no: z.number().int().positive(),
    family: text,
    scientific_name: text,
    name_pt: text,
    name_en: text,
    aliases_pt: z.array(text),
    habitat: z.enum(HABITATS),
    rubric: z.object({
      range: z.number().int().min(0).max(2),
      difficulty: z.number().int().min(0).max(2),
      stocking: z.number().int().min(-1).max(0),
    }),
    is_protected: z.boolean(),
    protection_note_pt: text.nullable(),
    protection_note_en: text.nullable(),
    sources: z.array(text).min(1),
    reviewed_by: text.nullable(),
    reviewed_at: z.iso.date().nullable(),
    /** For the person reviewing; never shown to users. */
    review_notes: text.optional(),
  })
  .superRefine((entry, ctx) => {
    if (entry.is_protected && (!entry.protection_note_pt || !entry.protection_note_en)) {
      ctx.addIssue({
        code: 'custom',
        path: ['protection_note_pt'],
        message: 'A protected species needs a protection note in both languages',
      })
    }
    if (!entry.is_protected && (entry.protection_note_pt || entry.protection_note_en)) {
      ctx.addIssue({
        code: 'custom',
        path: ['is_protected'],
        message: 'Only a protected species has protection notes',
      })
    }
    if ((entry.reviewed_by === null) !== (entry.reviewed_at === null)) {
      ctx.addIssue({
        code: 'custom',
        path: ['reviewed_by'],
        message: 'reviewed_by and reviewed_at are set together',
      })
    }
  })

export const speciesFileSchema = z.array(speciesEntrySchema).superRefine((entries, ctx) => {
  const ids = new Set<string>()
  const numbers = new Set<number>()
  entries.forEach((entry, index) => {
    if (ids.has(entry.id)) {
      ctx.addIssue({ code: 'custom', path: [index, 'id'], message: `Duplicate id ${entry.id}` })
    }
    if (numbers.has(entry.album_no)) {
      ctx.addIssue({
        code: 'custom',
        path: [index, 'album_no'],
        message: `Duplicate album_no ${entry.album_no}`,
      })
    }
    ids.add(entry.id)
    numbers.add(entry.album_no)
  })
})

export type SpeciesEntry = z.infer<typeof speciesEntrySchema>

/** Parses and validates the species file. Throws a ZodError that names the failing entry. */
export function loadSpeciesFile(input: unknown = raw): SpeciesEntry[] {
  return speciesFileSchema.parse(input)
}
