import { defineConfig } from 'vitest/config';

/**
 * Standalone config so the test run never loads `vite.config.ts` (its
 * Cloudflare and RSC plugins are irrelevant to these pure unit tests).
 */
export default defineConfig({
  test: {
    include: ['lib/**/*.test.ts'],
    environment: 'node',
  },
});
