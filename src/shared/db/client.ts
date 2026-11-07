import { sql } from 'drizzle-orm'
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// The app connects as app_server through Supabase's transaction pooler (DATABASE_URL).
// Prepared statements are off because the pooler can't keep them between transactions.
// See docs/explanation/decisions/ADR-003-server-only-data-access.md.

let client: postgres.Sql | undefined
let database: PostgresJsDatabase | undefined

/** The shared Drizzle client, created on first use so builds never open a connection. */
export function db(): PostgresJsDatabase {
  if (!database) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL is not set. See docs/reference/environments.md.')
    client = postgres(url, {
      prepare: false,
      max: Number(process.env.DATABASE_POOL_MAX ?? 1),
      idle_timeout: 20,
      connect_timeout: 10,
      onnotice: () => {},
    })
    database = drizzle(client)
  }
  return database
}

export type Db = PostgresJsDatabase
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0]

/** Runs `fn` in a transaction with a 5-second statement timeout. */
export function withTransaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  return db().transaction(async (tx) => {
    await tx.execute(sql`set local statement_timeout = '5s'`)
    return fn(tx)
  })
}

/** Closes the connection. Used by scripts and tests; the app keeps it open. */
export async function closeDb(): Promise<void> {
  await client?.end()
  client = undefined
  database = undefined
}
