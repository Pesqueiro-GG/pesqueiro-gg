#!/usr/bin/env node
// Drafts a pull request body for a backlog item from the repository's template:
// "Closes #N", and one line per acceptance criterion to fill with its evidence.
//
// Usage:
//   node scripts/agent/pr-body.mjs S-09 > /tmp/pr.md     (then edit, then gh pr create --body-file)
//   node scripts/agent/pr-body.mjs                         (reads the ID from the branch name)

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { backlogSections, fail, git, itemIdArg, REPO, ROOT, gh } from './lib.mjs'

const fromBranch = git('rev-parse', '--abbrev-ref', 'HEAD').match(/^[a-z]+\/([a-z]-\d+)/i)?.[1]
const id = itemIdArg() || fromBranch?.toUpperCase() || fail('Pass an item ID, for example S-09')
const section = backlogSections()[id] || fail(`No section for ${id} in docs/backlog/`)

let number = ''
try {
  number = gh(
    'issue',
    'list',
    '-R',
    REPO,
    '--state',
    'all',
    '--search',
    `${id} in:title`,
    '--json',
    'number,title',
    '--jq',
    `.[] | select(.title | startswith("${id} ")) | .number`,
  )
} catch {
  number = '<issue number>'
}

const criteria = section.text
  .split('\n')
  .filter((l) => /^- \[ \] /.test(l))
  .map((l) => `${l}\n  - Evidence: `)

const template = readFileSync(join(ROOT, '.github/pull_request_template.md'), 'utf8')
const body = template
  .replace(/^Closes #[ \t]*$/m, `Closes #${number}`)
  .replace(
    /## How I tested it\n\n<!--.*?-->/s,
    `## How I tested it\n\n### Acceptance criteria\n\n${criteria.join('\n')}\n\n### Checks\n\n- \`npm run check\`: `,
  )

process.stdout.write(body)
