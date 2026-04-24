import { test as base, Page } from '@playwright/test';
import fs from 'fs';
import { loginAs } from '@utils/helpers/authHelper';
import { Paths } from '@constants/Paths';
import { Logger } from '@utils/logger';

// Page Objects
import { LoginPage } from '@pages/LoginPage';
import { ProgramsPage } from '@pages/programs/ProgramsPage';

/* ==================== TYPES ==================== */
type Fixtures = {
  // ✅ Authenticated fixtures (with session)
  userLogin: Page;
  
  // ✅ Guest fixtures (no session - for registration/login tests)
  guestLogin: Page;
  

  // ✅ Page objects
  loginPage: LoginPage;
  programsPage: ProgramsPage;
  
};

/* ==================== HELPER FUNCTIONS ==================== */

function ensureAuthDirectoryExists(): void {
  if (!fs.existsSync(Paths.AUTH_FOLDER_PATH)) {
    fs.mkdirSync(Paths.AUTH_FOLDER_PATH, { recursive: true });
    Logger.info(`Created auth directory: ${Paths.AUTH_FOLDER_PATH}`);
  }
}

function isSessionValid(page: Page): boolean {
  const url = page.url();
  const isValid = url.includes('/dashboard');
  Logger.info(`Session validation: ${isValid ? '✅ Valid' : '❌ Invalid'} - URL: ${url}`);
  return isValid;
}

function hasValidCookies(authFile: string): boolean {
  if (!fs.existsSync(authFile)) return false;

  try {
    const content = JSON.parse(fs.readFileSync(authFile, 'utf8'));
    const cookieCount = content.cookies?.length || 0;
    Logger.info(`Session file has ${cookieCount} cookies`);
    return cookieCount > 0;
  } catch {
    return false;
  }
}

function deleteStaleAuthFile(authFile: string, role: string): void {
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
    Logger.info(`🗑️  Deleted stale auth file for ${role}`);
  }
}

/**
 * Create authenticated page (with stored session)
 */
async function createAuthenticatedPage(
  browser: any,
  authFile: string,
  role: 'Administrator'
): Promise<Page> {
  ensureAuthDirectoryExists();

  Logger.info(`⚙️  Setting up AUTHENTICATED ${role} user`);

  const hasSession = hasValidCookies(authFile);

  if (hasSession) {
    Logger.info(`📂 Found existing ${role} session file`);
  } else {
    Logger.info(`📂 No valid ${role} session found`);
  }

  const context = await browser.newContext({
    storageState: hasSession ? authFile : undefined,
  });

  const page = await context.newPage();

  await page.goto('/dashboard', {
    waitUntil: 'networkidle',
    timeout: 20000
  });

  if (!isSessionValid(page)) {
    Logger.warn(`⚠️  Server rejected ${role} session - performing fresh login`);

    deleteStaleAuthFile(authFile, role);

    await loginAs(page, role);

    await page.waitForURL('**/dashboard', { timeout: 20000 });
    await page.waitForLoadState('networkidle');

    await context.storageState({ path: authFile });
    Logger.success(`✅ Fresh ${role} session saved`);
  } else {
    Logger.success(`✅ Reusing valid ${role} session`);
  }

  return page;
}

/**
 * Create guest page (no session - for registration/login tests)
 */
async function createGuestPage(browser: any): Promise<Page> {
  Logger.info(`⚙️  Setting up GUEST page (no authentication)`);

  // ✅ Create context WITHOUT any stored session
  const context = await browser.newContext(); // NO storageState - fresh browser session

  const page = await context.newPage();

  // ✅ Go to public homepage (not dashboard)
  await page.goto('/', { waitUntil: 'networkidle' });

  Logger.success(`✅ Guest page ready (unauthenticated)`);

  return page;
}

/* ==================== FIXTURES ==================== */

export const test = base.extend<Fixtures>({

  /* ==================== AUTHENTICATED FIXTURES ==================== */

  userLogin : async ({ browser }, use) => {

    const page = await createAuthenticatedPage(
      browser,
      Paths.AUTH_FILE,
      'Administrator'
    );
    await use(page);
    await page.context().close();
    Logger.info('🧹user fixture cleaned up');
  },

  /* ==================== GUEST FIXTURES (NO SESSION) ==================== */

  /**
   * Generic guest page - no authentication
   * Use for: Registration tests, login tests, public page tests
   */
  guestLogin: async ({ browser }, use) => {
    const page = await createGuestPage(browser);
    await use(page);
    await page.context().close();
    Logger.info('🧹 Guest page cleaned up');
  },


  /* ==================== PAGE OBJECT FIXTURES ==================== */

  loginPage: async({ guestLogin}, use) =>{
    await use( new LoginPage(guestLogin));
  },
  
  programsPage: async ({ userLogin }, use) => {
    await use(new ProgramsPage(userLogin));
  },


});

/* ==================== GLOBAL HOOKS ==================== */

test.beforeEach(async ({ }, testInfo) => {
  Logger.separator();
  Logger.info(`▶️  Starting Test: ${testInfo.title}`);
});

test.afterEach(async ({ }, testInfo) => {
  const status = testInfo.status === 'passed' ? '✅' : '❌';
  Logger.info(`${status} Test ${testInfo.status}: ${testInfo.title}`);
  Logger.separator();
});

export { expect } from '@playwright/test';