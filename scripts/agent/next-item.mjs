#!/usr/bin/env node
// Lists the backlog items someone can start now: in their workstreams, not done or taken,
// and with every dependency Done on the board. Earliest milestone and Must first.
//
// Usage:
//   node scripts/agent/next-item.mjs                 (you, from `gh api user`)
//   node scripts/agent/next-item.mjs --who Guma325
//   node scripts/agent/next-item.mjs --ws B          (one workstream, anyone)
//   node scripts/agent/next-item.mjs --limit 10

import {
  arg,
  backlogSections,
  boardItems,
  compareItems,
  dependsOn,
  isDone,
  me,
  seed,
  workstreamsOf,
} from './lib.mjs'

const who = arg('who') || (arg('ws') ? undefined : me())
const wsList = arg('ws') ? [arg('ws')] : workstreamsOf(who)
const limit = Number(arg('limit') || 5)
if (!wsList.length) {
  console.error(`${who} owns no workstream in scripts/board/seed-backlog.json`)
  process.exit(1)
}

const board = boardItems()
const sections = backlogSections()
const seedItems = seed().items.filter((i) => wsList.includes(i.ws))

const ready = []
const blocked = []
const mine = []
for (const s of seedItems) {
  const item = board[s.id]
  if (!item || isDone(item)) continue
  if (['In Progress', 'Review'].includes(item.status)) {
    mine.push(item)
    continue
  }
  const deps = dependsOn(sections[s.id]?.text || '')
  const waiting = deps.filter((d) => !isDone(board[d]))
  ;(waiting.length ? blocked : ready).push({ ...item, waiting })
}

const line = (i) =>
  `  ${i.id.padEnd(5)} #${String(i.number).padEnd(3)} ${i.milestone.padEnd(3)} ${i.priority.padEnd(6)} ${i.size.padEnd(2)} ${i.title}`

console.log(`Workstream${wsList.length > 1 ? 's' : ''} ${wsList.join(', ')}${who ? ` (${who})` : ''}\n`)
if (mine.length) {
  console.log('Already started (finish these first):')
  for (const i of mine.sort(compareItems)) console.log(`${line(i)}  [${i.status}]`)
  console.log()
}
console.log(ready.length ? 'Ready to start:' : 'Nothing is ready to start.')
for (const i of ready.sort(compareItems).slice(0, limit)) console.log(line(i))
if (ready.length > limit) console.log(`  … and ${ready.length - limit} more (--limit)`)
console.log()
console.log('Next blocked:')
for (const i of blocked.sort(compareItems).slice(0, limit))
  console.log(`${line(i)}  ← waiting on ${i.waiting.join(', ')}`)
