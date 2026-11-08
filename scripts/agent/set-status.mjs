#!/usr/bin/env node
// Moves a backlog item's card to a board column: Backlog, Todo, "In Progress", Review or Done.
//
// Usage: node scripts/agent/set-status.mjs S-09 Review

import { boardItems, fail, itemIdArg, setStatus } from './lib.mjs'

const id = itemIdArg() || fail('Usage: node scripts/agent/set-status.mjs <ID> <status>')
const status = process.argv
  .slice(2)
  .filter((a) => a.toUpperCase() !== id)
  .join(' ')
if (!status) fail('Name the column: Backlog, Todo, "In Progress", Review or Done')
const item = boardItems()[id] || fail(`${id} isn't on the board`)
if (item.status === status) {
  console.log(`#${item.number} ${id} is already in ${status}`)
} else {
  setStatus(item.itemId, status)
  console.log(`✓ #${item.number} ${id}: ${item.status} → ${status}`)
}
