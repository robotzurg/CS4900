import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
  },
  testDir: './e2e',
  projects: [
    {
      name: 'React App Tests',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
