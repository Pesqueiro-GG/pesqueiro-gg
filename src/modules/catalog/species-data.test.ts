import { describe, expect, it } from 'vitest'
import raw from './data/species.json'
import { loadSpeciesFile, speciesFileSchema } from './species-data'

// Scientific names of species on Brazil's official threatened list (Ministério do Meio Ambiente)
// that the catalog must flag as protected. Add a name here whenever a reviewer confirms one.
// Source: Portaria MMA nº 148/2022 and the moratorium on goliath grouper fishing.
const THREATENED = ['Epinephelus itajara']

const entries = loadSpeciesFile()
const entry = (overrides: object) => ({ ...(raw[0] as object), ...overrides })

describe('species data file', () => {
  it('validates the species file against the schema', () => {
    expect(() => loadSpeciesFile()).not.toThrow()
  })

  it('has at least 40 species', () => {
    expect(entries.length).toBeGreaterThanOrEqual(40)
  })

  it('gives every species both names, a scientific name and a source', () => {
    for (const species of entries) {
      expect(species.name_pt, species.id).not.toBe('')
      expect(species.name_en, species.id).not.toBe('')
      expect(species.scientific_name, species.id).not.toBe('')
      expect(species.sources.length, species.id).toBeGreaterThan(0)
    }
  })

  it('sets reviewed_by and reviewed_at together on every species', () => {
    // Drafts leave both empty until a person checks the entry; the schema rejects half-filled ones.
    expect(() => loadSpeciesFile([entry({ reviewed_by: 'someone', reviewed_at: null })])).toThrow()
    expect(() => loadSpeciesFile([entry({ reviewed_by: null, reviewed_at: '2026-11-10' })])).toThrow()
    expect(() =>
      loadSpeciesFile([entry({ reviewed_by: 'someone', reviewed_at: '2026-11-10' })]),
    ).not.toThrow()
  })

  it('numbers the album once: no repeated number or id', () => {
    expect(speciesFileSchema.safeParse([entry({}), entry({})]).success).toBe(false)
    expect(new Set(entries.map((s) => s.album_no)).size).toBe(entries.length)
  })

  it('marks every species on the MMA threatened list as protected', () => {
    for (const name of THREATENED) {
      const species = entries.find((s) => s.scientific_name === name)
      if (species) expect(species.is_protected, name).toBe(true)
    }
  })

  it('gives every protected species notes in both languages, and nobody else', () => {
    for (const species of entries) {
      expect(Boolean(species.protection_note_pt), species.id).toBe(species.is_protected)
      expect(Boolean(species.protection_note_en), species.id).toBe(species.is_protected)
    }
  })

  it('keeps the stocked pintado raro, as the XP story S-13 expects', () => {
    const pintado = entries.find((s) => s.id === 'pintado')
    expect(pintado?.rubric).toEqual({ range: 2, difficulty: 2, stocking: -1 })
  })
})
