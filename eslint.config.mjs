import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import pesqueiro from './eslint/module-boundaries.mjs'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    plugins: { pesqueiro },
    rules: { 'pesqueiro/module-boundaries': 'error' },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'design/prototype/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
  ]),
])
