// Applies database migrations as the table owner, after making sure the app_server role exists
// with the password from APP_SERVER_DB_PASSWORD. See docs/how-to/apply-migrations-to-a-cloud-database.md.
//
//   npm run db:migrate                         local database (defaults below)
//   DATABASE_MIGRATION_URL=... APP_SERVER_DB_PASSWORD=... npm run db:migrate
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { fileURLToPath } from 'node:url'

export const LOCAL_OWNER_URL = 'postgresql://postgres:postgres@127.0.0.1:55322/postgres'
export const LOCAL_APP_SERVER_PASSWORD = 'app_server_local'

function isLocal(url: string) {
  const host = new URL(url).hostname
  return host === '127.0.0.1' || host === 'localhost'
}

export async function runMigrations(options: { url?: string; appServerPassword?: string } = {}) {
  const url = options.url ?? process.env.DATABASE_MIGRATION_URL ?? LOCAL_OWNER_URL
  const password =
    options.appServerPassword ??
    process.env.APP_SERVER_DB_PASSWORD ??
    (isLocal(url) ? LOCAL_APP_SERVER_PASSWORD : undefined)
  if (!password) throw new Error('Set APP_SERVER_DB_PASSWORD when migrating a cloud database.')

  const sql = postgres(url, { max: 1, onnotice: () => {} })
  try {
    // The role must exist before the first migration grants it anything.
    await sql`
      do $$ begin
        if not exists (select from pg_roles where rolname = 'app_server') then
          create role app_server login noinherit;
        end if;
      end $$`
    // DDL can't take bind parameters, so let Postgres quote the password as a literal.
    const [row] = await sql<{ stmt: string }[]>`
      select format('alter role app_server with login password %L', ${password}::text) as stmt`
    await sql.unsafe(row!.stmt)

    await migrate(drizzle(sql), {
      migrationsFolder: fileURLToPath(new URL('../../drizzle', import.meta.url)),
      migrationsSchema: 'drizzle',
      migrationsTable: '__drizzle_migrations',
    })
  } finally {
    await sql.end()
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runMigrations()
    .then(() => console.log('Migrations applied.'))
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error)
      process.exit(1)
    })
}
