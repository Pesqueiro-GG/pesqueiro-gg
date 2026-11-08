#!/usr/bin/env node
// Starts work on a backlog item: updates dev, creates the branch with the team's naming,
// assigns you and moves the card to In Progress. Refuses if the working tree has changes
// or a dependency isn't Done (pass --force to start anyway, for example when the item
// explains how to stub the dependency).
//
// Usage: node scripts/agent/start-item.mjs S-09 [--force] [--dry-run]

import {
  backlogSections,
  boardItems,
  dependsOn,
  fail,
  flag,
  gh,
  git,
  itemIdArg,
  REPO,
  seed,
  setStatus,
  slugify,
} from './lib.mjs'

const id = itemIdArg() || fail('Usage: node scripts/agent/start-item.mjs <ID>, for example S-09')
const dryRun = flag('dry-run')
const meta = seed().items.find((i) => i.id === id) || fail(`${id} isn't in seed-backlog.json`)
const section = backlogSections()[id] || fail(`No section for ${id} in docs/backlog/`)
const board = boardItems()
const item = board[id] || fail(`${id} isn't on the board`)

if (item.status === 'Done') fail(`${id} is already Done`)
const waiting = dependsOn(section.text).filter((d) => board[d]?.status !== 'Done')
if (waiting.length && !flag('force'))
  fail(
    `${id} depends on ${waiting.join(', ')}, which aren't Done. Check the item for a stub plan, then rerun with --force.`,
  )

if (git('status', '--porcelain')) fail('The working tree has changes. Commit or stash them first.')

const prefix = meta.type === 'task' ? 'chore' : 'feat'
const branch = `${prefix}/${id.toLowerCase()}-${slugify(meta.title)}`
const exists = git('branch', '--list', branch)

const steps = [
  exists ? `switch to existing ${branch}` : `update dev and create ${branch}`,
  `assign you to #${item.number}`,
  `move #${item.number} to In Progress`,
]
if (dryRun) {
  console.log(`Would:\n${steps.map((s) => `  - ${s}`).join('\n')}`)
  process.exit(0)
}

if (exists) {
  git('switch', branch)
} else {
  git('switch', 'dev')
  git('pull', '--ff-only')
  git('switch', '-c', branch)
}
gh('issue', 'edit', String(item.number), '-R', REPO, '--add-assignee', '@me')
if (item.status !== 'In Progress') setStatus(item.itemId, 'In Progress')

console.log(`✓ On ${branch}`)
console.log(`✓ #${item.number} assigned to you and In Progress`)
if (waiting.length) console.log(`! Started with ${waiting.join(', ')} not Done (--force)`)
console.log(`\nNext: node scripts/agent/item.mjs ${id}`)
