// Shared helpers for the agent scripts: the backlog files, the board and git.
// Read-only unless a function's name says otherwise.

import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const REPO = 'Pesqueiro-GG/pesqueiro-gg'
export const OWNER = 'Pesqueiro-GG'
export const PROJECT = '1'

const MILESTONES = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', '']
const PRIORITIES = ['must', 'should', 'could']

export function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
    ...opts,
  }).trim()
}

export const gh = (...args) => run('gh', args)
export const ghJson = (...args) => JSON.parse(gh(...args) || 'null')
export const git = (...args) => run('git', args)

export function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

export function seed() {
  return JSON.parse(readFileSync(join(ROOT, 'scripts/board/seed-backlog.json'), 'utf8'))
}

/** Every `<!-- item: ID -->` section in docs/backlog/*.md, keyed by ID. */
export function backlogSections() {
  const dir = join(ROOT, 'docs/backlog')
  const sections = {}
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md')) {
    const text = readFileSync(join(dir, file), 'utf8')
    const parts = text.split(/<!-- item: ([A-Z]-\d+) -->/)
    for (let i = 1; i < parts.length; i += 2) {
      const body = parts[i + 1].split(/\n---\s*\n/)[0].trim()
      sections[parts[i]] = { id: parts[i], file: `docs/backlog/${file}`, text: body }
    }
  }
  return sections
}

/** IDs in the item's "Depends on" line ({{S-03}} references). */
export function dependsOn(sectionText) {
  const line = sectionText.split('\n').find((l) => l.startsWith('**Depends on**')) || ''
  const before = line.split('**Blocks**')[0]
  return [...before.matchAll(/\{\{([A-Z]-\d+)\}\}/g)].map((m) => m[1])
}

/** Repository paths the item mentions (docs, design, src), for reading before coding. */
export function linkedPaths(sectionText) {
  const found = new Set()
  for (const m of sectionText.matchAll(/`?((?:docs|design|src|scripts|drizzle)\/[\w./\-[\]()]+)`?/g)) {
    found.add(m[1].replace(/[.,)]+$/, ''))
  }
  return [...found]
}

/** Board items with their status and fields, keyed by backlog ID. Needs the `project` scope. */
export function boardItems() {
  const data = ghJson('project', 'item-list', PROJECT, '--owner', OWNER, '--format', 'json', '--limit', '500')
  const byId = {}
  for (const it of data.items) {
    const id = (it.title || '').split(' ')[0]
    if (!/^[A-Z]-\d+$/.test(id)) continue
    byId[id] = {
      id,
      itemId: it.id,
      number: it.content?.number,
      url: it.content?.url,
      title: it.title.slice(id.length + 1),
      status: it.status || 'Backlog',
      workstream: it.workstream || '',
      priority: (it.priority || '').toLowerCase(),
      size: it.size || '',
      milestone: (it.milestone?.title || '').split(' ')[0],
      assignees: it.assignees || [],
    }
  }
  return byId
}

export function sortKey(item) {
  const m = MILESTONES.indexOf(item.milestone)
  const p = PRIORITIES.indexOf(item.priority)
  const n = Number(item.id.split('-')[1])
  return [m < 0 ? 99 : m, p < 0 ? 9 : p, item.id.startsWith('T') ? 0 : 1, n]
}

export function compareItems(a, b) {
  const ka = sortKey(a)
  const kb = sortKey(b)
  for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i]
  return 0
}

export const isDone = (item) => item?.status === 'Done'

export function me() {
  return gh('api', 'user', '--jq', '.login')
}

/** The workstreams (A, B, C, all) whose owners include this login. */
export function workstreamsOf(login) {
  const owners = seed().owners
  return Object.keys(owners).filter((ws) => owners[ws].includes(login))
}

export function wsOf(id) {
  return seed().items.find((i) => i.id === id)?.ws
}

/** Moves a board item to a Status column (Backlog, Todo, In Progress, Review, Done). */
export function setStatus(itemId, statusName) {
  const fields = ghJson('project', 'field-list', PROJECT, '--owner', OWNER, '--format', 'json')
  const status = fields.fields.find((f) => f.name === 'Status')
  const option = status?.options?.find((o) => o.name === statusName)
  if (!option) fail(`No "${statusName}" option in the board's Status field`)
  const project = ghJson('project', 'view', PROJECT, '--owner', OWNER, '--format', 'json')
  gh(
    'project',
    'item-edit',
    '--id',
    itemId,
    '--project-id',
    project.id,
    '--field-id',
    status.id,
    '--single-select-option-id',
    option.id,
  )
}

export function slugify(title, words = 5) {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, words)
    .join('-')
}

export function arg(name) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

export const flag = (name) => process.argv.includes(`--${name}`)

export function itemIdArg() {
  const id = process.argv.slice(2).find((a) => /^[a-zA-Z]-\d+$/.test(a))
  return id?.toUpperCase()
}
