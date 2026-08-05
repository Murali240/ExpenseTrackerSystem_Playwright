import { FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

/**
 * Remove stale Allure results and reports before tests run so previous
 * executions are never merged into the current run. This keeps
 * `allure-results` and `allure-report` fresh for each Playwright session.
 */
function removeIfExists(targetPath: string) {
  try {
    if (fs.existsSync(targetPath)) {
      // Use rmSync with recursive & force for Node >=14.14
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`[global-setup] Removed: ${targetPath}`);
    }
  } catch (err) {
    console.warn(`[global-setup] Failed to remove ${targetPath}:`, err);
  }
}

/**
 * Loads `.env` when present; CI variables come from the environment as usual.
 * Fails fast before any browser work when required keys are missing.
 */
export default async function globalSetup(_config: FullConfig): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, '.env') });

  // Clean previous Allure artifacts so they don't get merged with current run
  // This makes cleanup automatic even when invoking `npx playwright test` directly.
  const projectRoot = path.resolve(__dirname);
  removeIfExists(path.join(projectRoot, 'allure-results'));
  removeIfExists(path.join(projectRoot, 'allure-report'));

  const required = [
    'ETS_BASE_URL',
    'ETS_ADMIN_USERNAME',
    'ETS_ADMIN_PASSWORD',
    'ETS_EMPLOYEE_USERNAME',
    'ETS_EMPLOYEE_PASSWORD',
    'ETS_MANAGER_USERNAME',
    'ETS_MANAGER_PASSWORD',
    'ETS_ACCOUNTANT_USERNAME',
    'ETS_ACCOUNTANT_PASSWORD',
    'ETS_INVALID_USERNAME',
    'ETS_INVALID_PASSWORD',
  ] as const;

  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    console.error('[global-setup] Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
}
