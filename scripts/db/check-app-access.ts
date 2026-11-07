// Connects with DATABASE_URL (as the app does) and prints who it connected as.
// Use it once per cloud project to confirm the pooler accepts the app_server role.
//
//   DATABASE_URL=... npm run db:check
import postgres from 'postgres'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('Set DATABASE_URL to the pooler connection string for app_server.')
  process.exit(1)
}

const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 10 })
try {
  const [row] = await sql<{ user: string; db: string; version: string }[]>`
    select current_user as user, current_database() as db, split_part(version(), ' ', 2) as version`
  console.log(`Connected as ${row!.user} to ${row!.db} (Postgres ${row!.version}).`)
  if (row!.user !== 'app_server') {
    console.error('Expected to connect as app_server. Check the user name in DATABASE_URL.')
    process.exitCode = 1
  }
} catch (error) {
  console.error(`Could not connect: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
} finally {
  await sql.end()
}
