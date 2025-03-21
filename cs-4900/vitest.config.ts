import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setupTests.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
