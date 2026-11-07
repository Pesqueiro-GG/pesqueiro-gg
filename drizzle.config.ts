import { defineConfig } from 'drizzle-kit'

// Each module keeps its tables in src/modules/<module>/schema.ts.
// Migrations are applied by scripts/db/migrate.ts (npm run db:migrate), not by drizzle-kit.
export default defineConfig({
  dialect: 'postgresql',
  schema: ['./src/shared/db/schema.ts', './src/modules/*/schema.ts'],
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_MIGRATION_URL ?? 'postgresql://postgres:postgres@127.0.0.1:55322/postgres',
  },
  schemaFilter: ['public'],
  migrations: { schema: 'drizzle', table: '__drizzle_migrations' },
})
