import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['schema/**/*.ts', 'utils/**/*.ts'],
      exclude: ['tests/**/*', 'node_modules/**/*']
    }
  }
})