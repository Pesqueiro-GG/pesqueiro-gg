import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import en from '../../../messages/en.json'
import ptBR from '../../../messages/pt-BR.json'
import { ERROR_CODES } from '../errors'

const SCRIPT = join(__dirname, '../../../scripts/check-i18n.mjs')

function runCheck(files: Record<string, unknown>) {
  const dir = mkdtempSync(join(tmpdir(), 'i18n-'))
  try {
    for (const [name, content] of Object.entries(files))
      writeFileSync(join(dir, name), JSON.stringify(content))
    execFileSync(process.execPath, [SCRIPT, dir], { encoding: 'utf8', stdio: 'pipe' })
    return { ok: true, output: '' }
  } catch (error) {
    const e = error as { stderr?: string }
    return { ok: false, output: e.stderr ?? '' }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

describe('message files', () => {
  it('have a message for every error code in both languages', () => {
    for (const code of ERROR_CODES) {
      expect(ptBR.errors[code], `pt-BR errors.${code}`).toBeTruthy()
      expect(en.errors[code], `en errors.${code}`).toBeTruthy()
    }
  })

  it('pass the key check', () => {
    expect(runCheck({ 'pt-BR.json': ptBR, 'en.json': en })).toEqual({ ok: true, output: '' })
  })
})

describe('check-i18n', () => {
  it('fails naming a key that exists only in en.json', () => {
    const result = runCheck({
      'pt-BR.json': { nav: { feed: 'Feed' } },
      'en.json': { nav: { feed: 'Feed', album: 'Album' } },
    })
    expect(result.ok).toBe(false)
    expect(result.output).toContain('pt-BR.json: missing key nav.album (present in en.json)')
  })

  it('fails on an empty value', () => {
    const result = runCheck({ 'pt-BR.json': { nav: { feed: ' ' } }, 'en.json': { nav: { feed: 'Feed' } } })
    expect(result.ok).toBe(false)
    expect(result.output).toContain('pt-BR.json: empty value: nav.feed')
  })
})
