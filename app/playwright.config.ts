import { defineConfig, devices } from '@playwright/test';

const databaseUrl = process.env.E2E_DATABASE_URL ?? 'postgres://user:password@127.0.0.1:5432/database';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    env: {
      ...process.env,
      ...(databaseUrl != null && databaseUrl !== ''
        ? {
            CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE: databaseUrl,
            DATABASE_URL: databaseUrl,
          }
        : {}),
      PUBLIC_SENTRY_DSN: process.env.PUBLIC_SENTRY_DSN ?? 'https://examplePublicKey@example.com/1',
    },
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
