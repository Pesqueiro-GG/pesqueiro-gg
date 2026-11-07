import { Linter } from 'eslint'
import { describe, expect, it } from 'vitest'
import pesqueiro from './module-boundaries.mjs'

const linter = new Linter({ configType: 'flat' })
const config = [
  {
    files: ['**/*.ts'],
    languageOptions: { sourceType: 'module' as const },
    plugins: { pesqueiro },
    rules: { 'pesqueiro/module-boundaries': 'error' as const },
  },
]

function lint(code: string, filename: string) {
  return linter.verify(code, config, { filename }).map((m) => m.message)
}

describe('module boundaries rule', () => {
  it('rejects importing another module internals through the alias', () => {
    const messages = lint(
      "import { logCatch } from '@/modules/logbook/commands'",
      'src/modules/social/feed.ts',
    )
    expect(messages).toHaveLength(1)
    expect(messages[0]).toContain("'@/modules/logbook'")
  })

  it('accepts importing another module through its index', () => {
    expect(lint("import { logCatch } from '@/modules/logbook'", 'src/modules/social/feed.ts')).toEqual([])
    expect(lint("import x from '@/modules/logbook/index'", 'src/modules/social/feed.ts')).toEqual([])
  })

  it('rejects reaching into another module with a relative path', () => {
    expect(lint("import x from '../logbook/schema'", 'src/modules/social/feed.ts')).toHaveLength(1)
  })

  it('allows a module to import its own internals', () => {
    expect(lint("import x from './commands'", 'src/modules/logbook/index.ts')).toEqual([])
    expect(lint("import x from '../policies'", 'src/modules/logbook/ui/Form.ts')).toEqual([])
    expect(lint("import x from '@/modules/logbook/queries'", 'src/modules/logbook/commands.ts')).toEqual([])
  })

  it('applies to routes and shared code too', () => {
    expect(lint("import x from '@/modules/groups/commands'", 'src/app/groups/page.ts')).toHaveLength(1)
    expect(lint("import x from '@/modules/groups'", 'src/app/groups/page.ts')).toEqual([])
  })

  it('checks re-exports and dynamic imports', () => {
    expect(lint("export { x } from '@/modules/media/storage'", 'src/app/api/route.ts')).toHaveLength(1)
    expect(lint("const m = import('@/modules/media/storage')", 'src/app/api/route.ts')).toHaveLength(1)
  })
})
