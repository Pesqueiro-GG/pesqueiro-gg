// Loads the species catalog (src/modules/catalog/data/species.json) into the database.
// Idempotent: run it as often as you like. Album numbers never change.
//
//   npm run db:seed:catalog                      local database
//   DATABASE_MIGRATION_URL=... npm run db:seed:catalog
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { seedSpecies } from '@/modules/catalog'
import { LOCAL_OWNER_URL } from './db/migrate'

async function main() {
  const url = process.env.DATABASE_MIGRATION_URL ?? LOCAL_OWNER_URL
  const sql = postgres(url, { max: 1, onnotice: () => {} })
  try {
    const report = await seedSpecies(drizzle(sql))
    console.log(`Species seeded: ${report.inserted} new, ${report.updated} updated.`)
    if (report.unreviewed > 0) {
      console.warn(`${report.unreviewed} species have no reviewer yet (reviewed_by is empty).`)
    }
    if (report.missingFromFile.length > 0) {
      console.warn(`In the table but not in the file (left alone): ${report.missingFromFile.join(', ')}`)
    }
  } finally {
    await sql.end()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
