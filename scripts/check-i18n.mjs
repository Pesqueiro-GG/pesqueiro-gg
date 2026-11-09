#!/usr/bin/env node
// Fails when a message key exists in one language file and not the other, or when a value is
// empty. Runs in CI (job `ci`) and in `npm run check`.
//
// Usage: node scripts/check-i18n.mjs [dir]   (default: messages/)

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const FILES = ['pt-BR.json', 'en.json']

/** Flattens nested messages into `a.b.c` keys, recording problems with the values on the way. */
export function flatten(value, prefix, out, problems) {
  if (typeof value === 'string') {
    if (value.trim() === '') problems.push(`empty value: ${prefix}`)
    out.add(prefix)
    return out
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value)
    if (entries.length === 0) problems.push(`empty namespace: ${prefix}`)
    for (const [key, child] of entries) flatten(child, prefix ? `${prefix}.${key}` : key, out, problems)
    return out
  }
  problems.push(`not a string or object: ${prefix}`)
  return out
}

/** Returns every problem found across the language files, as readable lines. */
export function checkMessages(byFile) {
  const problems = []
  const keys = {}
  for (const [file, messages] of Object.entries(byFile)) {
    const fileProblems = []
    keys[file] = flatten(messages, '', new Set(), fileProblems)
    problems.push(...fileProblems.map((p) => `${file}: ${p}`))
  }
  const files = Object.keys(byFile)
  for (const file of files) {
    for (const other of files) {
      if (other === file) continue
      for (const key of keys[file]) {
        if (!keys[other].has(key)) problems.push(`${other}: missing key ${key} (present in ${file})`)
      }
    }
  }
  return problems
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = process.argv[2] ?? fileURLToPath(new URL('../messages/', import.meta.url))
  const byFile = {}
  for (const file of FILES) byFile[file] = JSON.parse(readFileSync(join(dir, file), 'utf8'))
  const problems = checkMessages(byFile)
  if (problems.length) {
    console.error(`i18n check failed:\n${problems.map((p) => `  ${p}`).join('\n')}`)
    process.exit(1)
  }
  console.log(`i18n check passed: ${FILES.join(', ')} have the same keys and no empty values.`)
}
