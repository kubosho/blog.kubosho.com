import { defineConfig, devices } from '@playwright/test';

import { LOCAL_SITE_URL } from '../constants/site_data';

/**
 * Cross-browser testing configuration for comprehensive browser compatibility testing.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/like-button-crossbrowser.test.ts',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on failures
  retries: process.env.CI ? 2 : 1,
  
  // Limit workers for stability across browsers
  workers: process.env.CI ? 1 : 2,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-crossbrowser-report' }],
    ['json', { outputFile: 'playwright-crossbrowser-results.json' }],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL to use in actions
    baseURL: LOCAL_SITE_URL,
    
    // Collect trace when retrying failed tests
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable Chrome DevTools Protocol for advanced testing
        launchOptions: {
          args: ['--enable-blink-features=NavigatorBeacon'],
        },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            // Enable sendBeacon in Firefox
            'beacon.enabled': true,
          },
        },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // Safari-specific configurations
      },
    },
    {
      name: 'edge',
      use: { 
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
    
    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },
    
    // Legacy browser simulation (without sendBeacon)
    {
      name: 'legacy-browser',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-blink-features=NavigatorBeacon'],
        },
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run build:node && npm run preview:node',
    reuseExistingServer: !process.env.CI,
    url: LOCAL_SITE_URL,
    timeout: 120000,
  },
});