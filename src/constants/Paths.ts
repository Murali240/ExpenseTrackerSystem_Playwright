import path from 'path';

/**
 * Path Constants
 * Centralized path management for test data and resources
 *
 * WHY __dirname instead of process.cwd()?
 *
 * process.cwd() returns the directory where the command was executed from.
 * This changes depending on the environment:
 *   - Running from VS Code terminal → might return a parent directory
 *   - Running from CI pipeline     → returns the pipeline working directory
 *   - Running via npm script       → returns project root (coincidentally correct)
 *
 * This inconsistency caused auth files to resolve to wrong paths,
 * making the fixture think no auth file existed and triggering
 * unnecessary re-logins or failures.
 *
 * __dirname always returns the absolute path of THIS file's directory,
 * regardless of where the command is run from. It is determined at
 * compile/load time, not runtime — so it never changes.
 *
 * This file lives at: src/constants/Paths.ts
 * So:
 *   __dirname              = .../PlaywrightProject/src/constants
 *   path.resolve(__dirname, '..', '..') = .../PlaywrightProject  ← project root ✅
 */
export class Paths {
  // Always resolves to project root regardless of where the command is run from
  static readonly PROJECT_ROOT = path.resolve(__dirname, '..', '..');

  // Test data folders
  static readonly TEST_DATA_ROOT = path.join(this.PROJECT_ROOT, 'testData');
  static readonly JSON_FOLDER_PATH = path.join(this.TEST_DATA_ROOT, 'json');
  static readonly CSV_FOLDER_PATH = path.join(this.TEST_DATA_ROOT, 'csv');
  static readonly EXCEL_FOLDER_PATH = path.join(this.TEST_DATA_ROOT, 'excel');

  // Auth folder — stores saved browser session state per role
  static readonly AUTH_FOLDER_PATH = path.join(this.PROJECT_ROOT, '.auth');

  // Auth files — one per user role, reused across test runs to avoid repeated logins
  // If a session is rejected by the server, AuthFixtures.ts will automatically
  // delete the stale file and create a fresh one via re-login
  static readonly AUTH_FILE = path.join(this.AUTH_FOLDER_PATH, 'login.json');
  

  // Report folders
  static readonly TEST_RESULTS = path.join(this.PROJECT_ROOT, 'test-results');
  static readonly PLAYWRIGHT_REPORT = path.join(this.PROJECT_ROOT, 'playwright-report');
  static readonly ALLURE_RESULTS = path.join(this.PROJECT_ROOT, 'allure-results');
  static readonly ALLURE_REPORT = path.join(this.PROJECT_ROOT, 'allure-report');
}