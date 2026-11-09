#!/usr/bin/env node
// Generates src/app/tokens.css from design/tokens.json, the design system's source of truth.
// Run after changing tokens.json; a unit test fails when the two disagree.
//
// Usage: node scripts/generate-tokens.mjs [--check]

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SOURCE = fileURLToPath(new URL('../design/tokens.json', import.meta.url))
const TARGET = fileURLToPath(new URL('../src/app/tokens.css', import.meta.url))

/** Resolves `{name}` aliases to `var(--name)`; returns `{ light, dark }`. */
function themed(value) {
  if (typeof value === 'string') {
    const alias = /^\{(.+)\}$/.exec(value)
    const v = alias ? `var(--${alias[1]})` : value
    return { light: v, dark: v, alias: Boolean(alias) }
  }
  return { light: value.light, dark: value.dark, alias: false }
}

export function renderTokens(tokens) {
  const light = []
  const dark = []
  const fixed = []

  for (const t of tokens.color.tokens) {
    const v = themed(t.value)
    if (v.alias) {
      fixed.push(`  --${t.name}: ${v.light};`)
      continue
    }
    light.push(`  --${t.name}: ${v.light};`)
    dark.push(`  --${t.name}: ${v.dark};`)
  }
  for (const t of tokens.shadow.tokens) {
    const v = themed(t.value)
    light.push(`  --${t.name}: ${v.light};`)
    dark.push(`  --${t.name}: ${v.dark};`)
  }
  for (const group of ['spacing', 'radius', 'size']) {
    for (const t of tokens[group].tokens) fixed.push(`  --${t.name}: ${t.value};`)
  }
  for (const group of tokens.type.groups) {
    for (const s of group.styles) {
      fixed.push(`  --type-${s.name}-size: ${s.fontSize};`)
      fixed.push(`  --type-${s.name}-line: ${s.lineHeight};`)
      fixed.push(`  --type-${s.name}-weight: ${s.fontWeight};`)
      if (s.letterSpacing) fixed.push(`  --type-${s.name}-tracking: ${s.letterSpacing};`)
    }
  }

  const darkBlock = dark.join('\n')
  return `/* Generated from design/tokens.json by scripts/generate-tokens.mjs. Do not edit by hand. */

:root {
  color-scheme: light;
${light.join('\n')}
${fixed.join('\n')}
}

/* Dark when chosen in Settings, or when the system asks and nothing was chosen. */
[data-theme='dark'] {
  color-scheme: dark;
${darkBlock}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    color-scheme: dark;
${darkBlock.replace(/^ {2}/gm, '    ')}
  }
}
`
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const css = renderTokens(JSON.parse(readFileSync(SOURCE, 'utf8')))
  if (process.argv.includes('--check')) {
    if (readFileSync(TARGET, 'utf8') !== css) {
      console.error('src/app/tokens.css is out of date: run node scripts/generate-tokens.mjs')
      process.exit(1)
    }
    console.log('src/app/tokens.css matches design/tokens.json.')
  } else {
    writeFileSync(TARGET, css)
    console.log('Wrote src/app/tokens.css')
  }
}
