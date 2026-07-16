const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    typecheck: {
      enabled: true,
    },
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/Abstract*.{ts,js}',
        '**/*Error.{ts,js}',
        '**/*Meta.{ts,js}',
        '**/*.config.{ts,mjs,js}',
        '**/__tests__/**',
        '**/dist/**',
      ],
    },
    clearMocks: true,
  },
});
