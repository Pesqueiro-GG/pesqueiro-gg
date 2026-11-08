import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { afterAll, beforeAll, describe, expect, inject, it } from 'vitest'
import { closeDb } from '@/shared/db/client'
import { getSpecies, listSpecies, searchSpecies } from './queries'
import { seedSpecies } from './seed'

const owner = postgres(inject('ownerUrl'), { max: 1, onnotice: () => {} })

beforeAll(async () => {
  await seedSpecies(drizzle(owner))
  // The queries run as app_server, like the app does.
  process.env.DATABASE_URL = inject('appUrl')
})

afterAll(async () => {
  await Promise.all([owner.end(), closeDb()])
})

const names = (list: { namePt: string }[]) => list.map((s) => s.namePt)

describe('catalog queries', () => {
  it('finds Tucunaré-açu and other tucunarés without accents', async () => {
    const found = names(await searchSpecies('tucunare', 'pt-BR'))
    expect(found).toContain('Tucunaré-açu')
    expect(found.length).toBeGreaterThan(1)
    expect(found.every((n) => n.startsWith('Tucunaré'))).toBe(true)
  })

  it('finds a species typed with accents, in capitals', async () => {
    expect(names(await searchSpecies('TUCUNARÉ-AÇU', 'pt-BR'))).toEqual(['Tucunaré-açu'])
  })

  it('finds a species by a regional name', async () => {
    expect(names(await searchSpecies('surubim', 'pt-BR'))).toContain('Pintado')
  })

  it('finds a species by its scientific name or English name', async () => {
    expect(names(await searchSpecies('salminus', 'en'))).toContain('Dourado')
    expect(names(await searchSpecies('golden dorado', 'en'))).toContain('Dourado')
  })

  it('returns nothing for an empty search and treats % as a plain character', async () => {
    expect(await searchSpecies('   ', 'pt-BR')).toEqual([])
    expect(await searchSpecies('%', 'pt-BR')).toEqual([])
  })

  it('lists species in album order with names in the requested language', async () => {
    const list = await listSpecies('en')
    expect(list.map((s) => s.albumNo)).toEqual([...list.map((s) => s.albumNo)].sort((a, b) => a - b))
    expect(list.find((s) => s.id === 'dourado')?.name).toBe('Golden dorado')
    expect(list.find((s) => s.id === 'mero')?.protectionNote).toMatch(/earns no XP/)
  })

  it('gets one species by id, or null', async () => {
    expect((await getSpecies('mero'))?.isProtected).toBe(true)
    expect(await getSpecies('nao-existe')).toBeNull()
  })
})
