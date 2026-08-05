import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import os from 'os';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const globalSetupPath = path.resolve(__dirname, 'global-setup.ts');

// Detect current OS for dynamic environment info
const rawOsRelease = os.release();
const osType = os.platform() === 'win32' ? 'Windows' : os.platform() === 'darwin' ? 'macOS' : 'Linux';
const osEdition = osType === 'Windows'
  ? rawOsRelease.startsWith('10.0') && Number(rawOsRelease.split('.')[2] || '0') >= 22000
    ? 'Windows 11'
    : 'Windows 10'
  : osType;
const environmentInfo = {
  framework: 'Playwright',
  language: 'TypeScript',
  application: 'Expense Tracker System',
  environment: 'Testing',
  os: osEdition,
  osVersion: rawOsRelease,
};


/**
 * Playwright Test Configuration
 * Optimized for MacBook Air 13.3" (1440x900)
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: globalSetupPath,

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
            application: 'Expense Tracker System',
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
            application: 'Expense Tracker System',
              environmentInfo: environmentInfo
          }
        }]
      ],

  use: {
    baseURL: process.env.ETS_BASE_URL,
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
    locale: 'en-IN',
      timezoneId: 'Asia/Kolkata',
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

         {
          name: 'firefox',
          use: {
            ...devices['Desktop Firefox'],
            viewport: { width: 1440, height: 900 },
          },
        },
        {
          name: 'webkit',
          use: {
            ...devices['Desktop Safari'],
            viewport: { width: 1440, height: 900 },
          },
        },
      ],

  outputDir: 'test-results/',

  /* webServer: { command: 'npm run start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI }, */
});
