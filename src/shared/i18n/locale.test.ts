import { describe, expect, it } from 'vitest'
import { resolveLocale } from './locale'

describe('resolveLocale', () => {
  it('uses the cookie when it names a supported locale', () => {
    expect(resolveLocale('en', 'pt-BR,pt;q=0.9')).toBe('en')
    expect(resolveLocale('pt-BR', 'en-US')).toBe('pt-BR')
  })

  it('ignores a cookie with an unsupported value', () => {
    expect(resolveLocale('fr', 'en-US')).toBe('en')
  })

  it('maps any Portuguese browser to pt-BR', () => {
    expect(resolveLocale(undefined, 'pt-BR,pt;q=0.9,en;q=0.8')).toBe('pt-BR')
    expect(resolveLocale(undefined, 'pt-PT')).toBe('pt-BR')
    expect(resolveLocale(undefined, 'pt')).toBe('pt-BR')
  })

  it('maps every other language to English', () => {
    expect(resolveLocale(undefined, 'fr-FR,fr;q=0.9')).toBe('en')
    expect(resolveLocale(undefined, 'es')).toBe('en')
  })

  it('follows the highest weight, not the order', () => {
    expect(resolveLocale(undefined, 'en;q=0.5,pt-BR;q=0.9')).toBe('pt-BR')
    expect(resolveLocale(undefined, 'pt;q=0,en')).toBe('en')
  })

  it('falls back to Portuguese with no cookie and no header', () => {
    expect(resolveLocale(undefined, null)).toBe('pt-BR')
    expect(resolveLocale(undefined, '*')).toBe('pt-BR')
  })
})
