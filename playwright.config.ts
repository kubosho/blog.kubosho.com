import { defineConfig, devices } from '@playwright/test';

import { LOCAL_SITE_URL } from '../constants/site_data';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : 2,
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: 'html',
  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: LOCAL_SITE_URL,

    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run build:node && npm run preview:node',
    reuseExistingServer: !process.env.CI,
    url: LOCAL_SITE_URL,
  },
});
