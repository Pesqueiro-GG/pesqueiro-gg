// ESLint plugin that enforces the modular monolith's boundaries:
// code outside src/modules/<name>/ may import that module only through its index.ts.
// See docs/reference/code-conventions.md#code-layout.
import path from 'node:path'

const MODULE_PATH = /(?:^|\/)src\/modules\/([^/]+)(?:\/(.*))?$/

/** Returns { module, rest } when a resolved path points inside src/modules, else null. */
function moduleOf(posixPath) {
  const match = posixPath.match(MODULE_PATH)
  if (!match) return null
  return { module: match[1], rest: match[2] ?? '' }
}

/** True when `rest` is the module's public entry: '', 'index', 'index.ts' or 'index.tsx'. */
function isPublicEntry(rest) {
  return rest === '' || /^index(\.tsx?)?$/.test(rest)
}

const moduleBoundaries = {
  meta: {
    type: 'problem',
    docs: { description: 'Import other modules only through their index.ts' },
    messages: {
      internal:
        "Import '{{source}}' through '@/modules/{{module}}' (its index.ts), not its internals. See docs/reference/code-conventions.md.",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename.split(path.sep).join('/')
    const own = moduleOf(filename)?.module ?? null

    function check(node, source) {
      if (typeof source !== 'string') return
      let target = null
      if (source.startsWith('@/modules/')) {
        target = moduleOf(`src/modules/${source.slice('@/modules/'.length)}`)
      } else if (source.startsWith('.')) {
        const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(filename), source))
        target = moduleOf(resolved)
      }
      if (!target || target.module === own || isPublicEntry(target.rest)) return
      context.report({ node, messageId: 'internal', data: { source, module: target.module } })
    }

    return {
      ImportDeclaration(node) {
        check(node.source, node.source.value)
      },
      ExportNamedDeclaration(node) {
        if (node.source) check(node.source, node.source.value)
      },
      ExportAllDeclaration(node) {
        check(node.source, node.source.value)
      },
      ImportExpression(node) {
        if (node.source.type === 'Literal') check(node.source, node.source.value)
      },
    }
  },
}

const plugin = {
  meta: { name: 'pesqueiro' },
  rules: { 'module-boundaries': moduleBoundaries },
}

export default plugin
