#!/usr/bin/env node
// Runs the checks CI runs before the build, and prints only what failed.
// Integration tests need the local Supabase (npm run db:start); --quick skips them.
//
// Usage: npm run check [-- --quick]

import { spawnSync } from 'node:child_process'
import { ROOT } from './lib.mjs'

const quick = process.argv.includes('--quick')
const steps = [
  ['lint', 'npm', ['run', '--silent', 'lint']],
  ['format', 'npm', ['run', '--silent', 'format:check']],
  ['types', 'npm', ['run', '--silent', 'typecheck']],
  ['unit tests', 'npm', ['test', '--silent']],
  ...(quick ? [] : [['integration tests', 'npm', ['run', '--silent', 'test:int']]]),
]

const TAIL = 60
let failed = 0
for (const [name, cmd, args] of steps) {
  const started = Date.now()
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32' })
  const secs = ((Date.now() - started) / 1000).toFixed(1)
  if (r.status === 0) {
    console.log(`✓ ${name} (${secs}s)`)
    continue
  }
  failed++
  console.log(`✗ ${name} (${secs}s)`)
  const out = `${r.stdout || ''}${r.stderr || ''}`.trim().split('\n')
  const shown = out.slice(-TAIL)
  if (out.length > TAIL)
    console.log(`  … ${out.length - TAIL} earlier lines hidden; rerun \`${cmd} ${args.join(' ')}\` for all`)
  console.log(shown.map((l) => `  ${l}`).join('\n'))
  if (name === 'integration tests' && /ECONNREFUSED|connect/i.test(out.join('\n')))
    console.log('  Hint: is the local database running? npm run db:start')
}

console.log(
  failed
    ? `\n${failed} of ${steps.length} checks failed.`
    : `\nAll ${steps.length} checks passed${quick ? ' (integration tests skipped)' : ''}.`,
)
process.exit(failed ? 1 : 0)
