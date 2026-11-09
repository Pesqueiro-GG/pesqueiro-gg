import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { initials } from './Avatar'
import { Icon } from './Icon'
import { parseTheme, themeAttribute } from './theme'

const ROOT = join(__dirname, '../..')

describe('tokens.css', () => {
  it('matches design/tokens.json', async () => {
    // @ts-expect-error -- plain JavaScript script, no type declarations
    const { renderTokens } = await import('../../scripts/generate-tokens.mjs')
    const tokens = JSON.parse(readFileSync(join(ROOT, 'design/tokens.json'), 'utf8'))
    expect(readFileSync(join(ROOT, 'src/app/tokens.css'), 'utf8')).toBe(renderTokens(tokens))
  })
})

describe('theme', () => {
  it('falls back to system for a missing or unknown cookie', () => {
    expect(parseTheme(undefined)).toBe('system')
    expect(parseTheme('sepia')).toBe('system')
    expect(parseTheme('dark')).toBe('dark')
  })

  it('leaves data-theme off for system, so the media query decides', () => {
    expect(themeAttribute('system')).toBeUndefined()
    expect(themeAttribute('light')).toBe('light')
  })
})

describe('Icon', () => {
  it('is hidden from screen readers by default, at 20 px', () => {
    const html = renderToStaticMarkup(<Icon name="fish" />)
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('width="20"')
  })

  it('becomes a labelled image when given a label', () => {
    const html = renderToStaticMarkup(<Icon name="x" label="Fechar" />)
    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="Fechar"')
    expect(html).not.toContain('aria-hidden')
  })
})

describe('initials', () => {
  it('takes the first letter of the first two words', () => {
    expect(initials('Ana Luiza Souza')).toBe('AL')
    expect(initials('  kauê ')).toBe('K')
    expect(initials('')).toBe('?')
  })
})
