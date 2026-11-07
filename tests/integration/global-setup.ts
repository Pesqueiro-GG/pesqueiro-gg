// Runs once before the integration tests: reads the local Supabase's URLs and keys,
// applies the migrations, and exposes the connection settings to the tests.
// Requires `npm run db:start` first (Docker must be running).
import { execFileSync } from 'node:child_process'
import type { TestProject } from 'vitest/node'
import { LOCAL_APP_SERVER_PASSWORD, LOCAL_OWNER_URL, runMigrations } from '../../scripts/db/migrate'

type Status = { API_URL?: string; ANON_KEY?: string; PUBLISHABLE_KEY?: string; DB_URL?: string }

export default async function setup(project: TestProject) {
  let status: Status
  try {
    const out = execFileSync('npx', ['supabase', 'status', '-o', 'json'], {
      encoding: 'utf8',
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
    status = JSON.parse(out.slice(out.indexOf('{'))) as Status
  } catch {
    throw new Error('Local Supabase is not running. Start Docker, then run `npm run db:start`.')
  }

  const ownerUrl = status.DB_URL ?? LOCAL_OWNER_URL
  await runMigrations({ url: ownerUrl, appServerPassword: LOCAL_APP_SERVER_PASSWORD })

  const appUrl = new URL(ownerUrl)
  appUrl.username = 'app_server'
  appUrl.password = LOCAL_APP_SERVER_PASSWORD

  project.provide('ownerUrl', ownerUrl)
  project.provide('appUrl', appUrl.toString())
  project.provide('apiUrl', status.API_URL ?? 'http://127.0.0.1:55321')
  project.provide('anonKey', status.PUBLISHABLE_KEY ?? status.ANON_KEY ?? '')
}

declare module 'vitest' {
  export interface ProvidedContext {
    ownerUrl: string
    appUrl: string
    apiUrl: string
    anonKey: string
  }
}
