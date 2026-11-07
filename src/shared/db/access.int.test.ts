import postgres from 'postgres'
import { afterAll, beforeAll, describe, expect, inject, it } from 'vitest'
import { closeDb, withTransaction } from './client'
import { sql } from 'drizzle-orm'

// Proves the access model from ADR-003 on a real database:
// tables set up with app_enable_access() are invisible to the browser's key
// and fully usable by the app_server role.

const table = `t03_access_${Date.now()}`
const owner = postgres(inject('ownerUrl'), { max: 1, onnotice: () => {} })
const app = postgres(inject('appUrl'), { max: 1, prepare: false, onnotice: () => {} })

async function restSelect() {
  const key = inject('anonKey')
  return fetch(`${inject('apiUrl')}/rest/v1/${table}?select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
}

beforeAll(async () => {
  await owner.unsafe(`create table public.${table} (id serial primary key, note text not null)`)
  await owner.unsafe(`select app_enable_access('public.${table}')`)
  await owner.unsafe(`insert into public.${table} (note) values ('secret spot')`)
  await owner.unsafe(`notify pgrst, 'reload schema'`)
  // Give the REST API a moment to see the new table.
  for (let i = 0; i < 20; i++) {
    const res = await restSelect()
    if (res.status !== 404) break
    await new Promise((r) => setTimeout(r, 250))
  }
})

afterAll(async () => {
  await owner.unsafe(`drop table if exists public.${table}`)
  await Promise.all([owner.end(), app.end(), closeDb()])
})

describe('database access model', () => {
  it('refuses the public browser key: no privileges on new tables', async () => {
    const res = await restSelect()
    expect(res.status).toBe(401)
    expect((await res.json()).code).toBe('42501') // permission denied
  })

  it('still returns no rows to the browser key if someone grants it access by mistake', async () => {
    await owner.unsafe(`grant select on public.${table} to anon, authenticated`)
    await owner.unsafe(`notify pgrst, 'reload schema'`)
    try {
      let res = await restSelect()
      for (let i = 0; i < 20 && res.status !== 200; i++) {
        await new Promise((r) => setTimeout(r, 250))
        res = await restSelect()
      }
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual([]) // row-level security has no policy for the browser roles
    } finally {
      await owner.unsafe(`revoke select on public.${table} from anon, authenticated`)
    }
  })

  it('lets app_server read and write', async () => {
    const [inserted] = await app.unsafe(
      `insert into public.${table} (note) values ('from the app') returning id`,
    )
    expect(inserted?.id).toBeTypeOf('number')
    const rows = await app.unsafe(`select note from public.${table} order by id`)
    expect(rows.map((r) => r.note)).toEqual(['secret spot', 'from the app'])
  })

  it('connects the app as app_server', async () => {
    const [row] = await app`select current_user as user`
    expect(row?.user).toBe('app_server')
  })

  it('runs transactions with a 5-second statement timeout', async () => {
    process.env.DATABASE_URL = inject('appUrl')
    const timeout = await withTransaction(async (tx) => {
      const result = await tx.execute<{ statement_timeout: string }>(sql`show statement_timeout`)
      return result[0]?.statement_timeout
    })
    expect(timeout).toBe('5s')
  })

  it('denies app_server the setup helper', async () => {
    await expect(app.unsafe(`select app_enable_access('public.${table}')`)).rejects.toThrow(
      /permission denied/,
    )
  })
})
