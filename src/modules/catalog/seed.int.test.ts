import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { afterAll, beforeAll, describe, expect, inject, it } from 'vitest'
import raw from './data/species.json'
import { seedSpecies } from './seed'

const owner = postgres(inject('ownerUrl'), { max: 1, onnotice: () => {} })
const database = drizzle(owner)

async function snapshot() {
  return owner`select id, album_no, rarity_tier, is_protected from public.species order by album_no`
}

beforeAll(async () => {
  await owner`delete from public.species`
})

afterAll(async () => {
  await owner`delete from public.species`
  await owner.end()
})

describe('seedSpecies', () => {
  it('leaves rows and album numbers unchanged when the seed runs twice', async () => {
    const first = await seedSpecies(database)
    const before = await snapshot()
    const second = await seedSpecies(database)
    const after = await snapshot()

    expect(first.inserted).toBe(raw.length)
    expect(second.inserted).toBe(0)
    expect(second.updated).toBe(raw.length)
    expect(after).toEqual(before)
    expect(after).toHaveLength(raw.length)
  })

  it('derives the stored tier from the rubric', async () => {
    const [pintado] = await owner`select rarity_tier from public.species where id = 'pintado'`
    expect(pintado?.rarity_tier).toBe('raro')
  })

  it('refuses to change the album number of an existing species', async () => {
    const changed = raw.map((s) => (s.id === 'dourado' ? { ...s, album_no: 999 } : s))
    await expect(seedSpecies(database, changed)).rejects.toThrow(/Album numbers never change/)
    const [row] = await owner`select album_no from public.species where id = 'dourado'`
    expect(row?.album_no).toBe(raw.find((s) => s.id === 'dourado')?.album_no)
  })

  it('refuses a new species that takes a number already in use', async () => {
    const taken = raw[0]!.album_no
    const added = [...raw, { ...raw[1]!, id: 'novo-peixe', album_no: taken }]
    await expect(seedSpecies(database, added)).rejects.toThrow()
  })

  it('never deletes a species that is missing from the file', async () => {
    const report = await seedSpecies(database, raw.slice(1))
    expect(report.missingFromFile).toEqual([raw[0]!.id])
    expect(await snapshot()).toHaveLength(raw.length)
    await seedSpecies(database)
  })
})
