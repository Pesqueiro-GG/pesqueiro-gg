// Connects as the app does and prints who it connected as.
// Use it once per cloud project to confirm the pooler accepts the app_server role.
//
//   DATABASE_URL=... npm run db:check
//
// Without DATABASE_URL, it derives the app's connection from DATABASE_MIGRATION_URL and
// APP_SERVER_DB_PASSWORD: same host and project, user app_server, transaction pooler port 6543.
import postgres from 'postgres'

export function deriveAppUrl(migrationUrl: string, appServerPassword: string): string {
  const url = new URL(migrationUrl)
  const ref = url.username.includes('.') ? url.username.slice(url.username.indexOf('.')) : ''
  url.username = `app_server${ref}`
  url.password = encodeURIComponent(appServerPassword)
  if (url.hostname.endsWith('pooler.supabase.com')) url.port = '6543'
  return url.toString()
}

function describe(url: string): string {
  const u = new URL(url)
  return `${decodeURIComponent(u.username)}@${u.hostname}:${u.port}`
}

async function main() {
  let url = process.env.DATABASE_URL
  if (!url && process.env.DATABASE_MIGRATION_URL && process.env.APP_SERVER_DB_PASSWORD) {
    url = deriveAppUrl(process.env.DATABASE_MIGRATION_URL, process.env.APP_SERVER_DB_PASSWORD)
  }
  if (!url) {
    console.error('Set DATABASE_URL, or DATABASE_MIGRATION_URL and APP_SERVER_DB_PASSWORD to derive it.')
    process.exitCode = 1
    return
  }

  console.log(`Connecting as ${describe(url)} …`)
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
}

void main()
