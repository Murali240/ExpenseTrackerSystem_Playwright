import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Playwright Test Configuration
 * Optimized for MacBook Air 13.3" (1440x900)
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : 1,
  timeout: 60000,

  expect: {
    timeout: 10000
  },

  reporter: process.env.CI 
    ? [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['allure-playwright', {
          detail: true,
          outputFolder: 'allure-results',
          suiteTitle: false,
          environmentInfo: {
            framework: 'Playwright',
            language: 'TypeScript',
            application: 'ISSI GMS',
            environment: 'CI',
            nodeVersion: process.version
          }
        }]
      ]
    : [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['allure-playwright', {
          detail: true,
          outputFolder: 'allure-results',
          suiteTitle: false,
          environmentInfo: {
            framework: 'Playwright',
            language: 'TypeScript',
            application: 'ISSI GMS',
            environment: 'Local - MacBook Air 13.3"'
          }
        }]
      ],

  use: {
    baseURL: process.env.ISSI_GMS_URL,
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: process.env.HEADLESS === 'true' || process.env.CI === 'true',

    /* ============================================
     * ✅ VIEWPORT - Optimized for MacBook Air
     * Native: 1440x900
     * Using 1920x1080 for better testing coverage
     * ============================================ */
    viewport: { 
      width: 1440,   // Wider than native - tests wider screens
      height: 900   // Taller than native - tests more content
    },

    actionTimeout: 15000,
    navigationTimeout: 30000,
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  projects: process.env.CI 
    ? [
        // CI: All Browsers with Full HD viewport
        {
          name: 'chromium',
          use: { 
            ...devices['Desktop Chrome'],
            viewport: { width: 1440, height: 900 },
          },
        },
        {
          name: 'firefox',
          use: { 
            ...devices['Desktop Firefox'],
            viewport: { width: 1920, height: 1080 },
          },
        },
        {
          name: 'webkit',
          use: { 
            ...devices['Desktop Safari'],
            viewport: { width: 1920, height: 1080 },
          },
        },
      ]
    : [
        // LOCAL: Chromium optimized for MacBook Air
        {
          name: 'chromium',
          use: { 
            ...devices['Desktop Chrome'],
            viewport: { width: 1440, height: 900 },  // ✅ Best for testing
          },
        },
      ],

  outputDir: 'test-results/',

  /* Global setup/teardown */
  // globalSetup: require.resolve('./global-setup.ts'),
  // globalTeardown: require.resolve('./global-teardown.ts'),

    // /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { 
    //     ...devices['Pixel 5'] 
    //   },
    // },
    
    // {
    //   name: 'Mobile Safari',
    //   use: { 
    //     ...devices['iPhone 12'] 
    //   },
    // },

    // /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { 
    //     ...devices['Desktop Edge'], 
    //     channel: 'msedge' 
    //   },
    // },
    
    // {
    //   name: 'Google Chrome',
    //   use: { 
    //     ...devices['Desktop Chrome'], 
    //     channel: 'chrome' 
    //   },
    
    // },
  //],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
