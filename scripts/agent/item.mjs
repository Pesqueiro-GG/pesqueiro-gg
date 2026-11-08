#!/usr/bin/env node
// Prints one backlog item with everything needed to start it: its section from
// docs/backlog/, the board status of each dependency, and the files it mentions.
//
// Usage: node scripts/agent/item.mjs S-09 [--no-board]

import { backlogSections, boardItems, dependsOn, fail, flag, itemIdArg, linkedPaths, seed } from './lib.mjs'

const id = itemIdArg() || fail('Usage: node scripts/agent/item.mjs <ID>, for example S-09')
const section = backlogSections()[id] || fail(`No section for ${id} in docs/backlog/`)
const meta = seed().items.find((i) => i.id === id)
const board = flag('no-board') ? {} : boardItems()
const item = board[id]

console.log(`# ${id} · ${meta?.title ?? ''}`)
console.log(`Source: ${section.file}`)
if (item) {
  console.log(`Issue: #${item.number} ${item.url}`)
  console.log(`Board: ${item.status} · assignees: ${item.assignees.join(', ') || 'none'}`)
}

const deps = dependsOn(section.text)
if (deps.length) {
  console.log('\nDependencies:')
  for (const d of deps) {
    const b = board[d]
    const mark = !b ? '?' : b.status === 'Done' ? '✓' : '✗'
    console.log(`  ${mark} ${d} ${b ? `#${b.number} ${b.status}` : ''}`)
  }
}

const paths = linkedPaths(section.text)
console.log('\nRead before coding:')
for (const p of ['AGENTS.md', 'docs/reference/code-conventions.md', ...paths]) console.log(`  ${p}`)

console.log(`\n${'-'.repeat(72)}\n`)
console.log(section.text)
