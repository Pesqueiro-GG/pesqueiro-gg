#!/usr/bin/env node
// Claude Code hook (SessionStart): when a handoff saved by /handoff exists for the current
// branch, hands it to the new session so it continues where the last one stopped (typically
// right after /clear). Handoffs older than 7 days are ignored, not deleted.
//
// Never fails the session: on any error it prints nothing and exits 0.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const MAX_AGE_DAYS = 7

export function handoffPath(root, branch) {
  return join(root, '.claude', 'handoff', `${branch.replace(/[^\w.-]+/g, '__')}.md`)
}

function main() {
  let input = {}
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}')
  } catch {}
  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
  const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim()
  const file = handoffPath(root, branch)
  if (!existsSync(file)) return

  const saved = statSync(file).mtime
  const ageDays = (Date.now() - saved.getTime()) / 86_400_000
  if (ageDays > MAX_AGE_DAYS) return

  const relative = file.slice(root.length + 1).replace(/\\/g, '/')
  const context = [
    `A handoff from an earlier session on branch ${branch} was saved ${saved.toISOString()} at ${relative}.`,
    'Before acting on it, check it against `git status` and `git log --oneline -5`, since work may have happened after it was written.',
    'Then tell the person in one line what you are resuming, and continue from its "Next step" unless they ask for something else.',
    'When the work it describes is merged, delete the file.',
    '',
    readFileSync(file, 'utf8'),
  ].join('\n')

  process.stdout.write(
    JSON.stringify({
      systemMessage: `Loaded the handoff for ${branch} (${relative}).`,
      hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context },
    }),
  )
}

try {
  main()
} catch {}
process.exit(0)
