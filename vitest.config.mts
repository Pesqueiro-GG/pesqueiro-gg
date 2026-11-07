import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  resolve: { alias: { '@': src } },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'eslint/**/*.test.ts'],
          exclude: ['**/*.int.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          environment: 'node',
          include: ['src/**/*.int.test.ts'],
          globalSetup: ['./tests/integration/global-setup.ts'],
          // Integration tests share one local database; run files one at a time.
          fileParallelism: false,
          testTimeout: 20_000,
          hookTimeout: 60_000,
        },
      },
    ],
  },
})
