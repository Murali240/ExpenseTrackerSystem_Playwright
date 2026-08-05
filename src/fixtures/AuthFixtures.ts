import { test as base, Page } from '@playwright/test';
import fs from 'fs';
import { loginAs } from '@utils/helpers/authHelper';
import { Paths } from '@constants/Paths';
import { Logger } from '@utils/logger';

// Page Objects
import { LoginPage } from '../pages/common/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ExpenseManagementPage } from '../pages/ExpenseManagementPage';
import { ExpenseReviewPage } from '../pages/manager/ExpenseReviewPage';
import { UserRole } from '../types';

/* ==================== TYPES ==================== */
type Fixtures = {
  // ✅ Authenticated fixtures (with saved session)
  authPage: Page;
 // ldapAuthPage: Page;

  // ✅ Guest fixtures (no session)
  guestPage: Page;

  // ✅ Page objects
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  expenseManagementPage: ExpenseManagementPage;
  expenseReviewPage: ExpenseReviewPage;
};

/* ==================== HELPER FUNCTIONS ==================== */

function ensureAuthDirectoryExists(): void {
  if (!fs.existsSync(Paths.AUTH_FOLDER_PATH)) {
    fs.mkdirSync(Paths.AUTH_FOLDER_PATH, { recursive: true });
    Logger.info(`Created auth directory: ${Paths.AUTH_FOLDER_PATH}`);
  }
}

function isSessionValid(page: Page): boolean {
  try {
    const parsedUrl = new URL(page.url());
    const isValid = parsedUrl.pathname === '/dashboard/' || parsedUrl.pathname.startsWith('/dashboard/');
    Logger.info(`Session validation: ${isValid ? '✅ Valid' : '❌ Invalid'} - URL: ${page.url()}`);
    return isValid;
  } catch (error) {
    Logger.error('Failed to parse session URL', error);
    return false;
  }
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
  role: UserRole
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
  try {
    await page.goto('/dashboard/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  } catch (error) {
    Logger.warn('Dashboard route did not load cleanly, retrying with default navigation path');
    await page.goto('/dashboard/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  }

  if (!isSessionValid(page)) {
    Logger.warn(`⚠️  Session invalid for ${role} - performing fresh login`);
    deleteStaleAuthFile(authFile, role);
    await loginAs(page, role);
    await page.waitForURL('**/dashboard/', { timeout: 20000 });
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

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/accounts/login', { waitUntil: 'load', timeout: 60000 });
  await page.waitForLoadState('load', { timeout: 60000 });

  Logger.success(`✅ Guest page ready (unauthenticated)`);

  return page;
}

/* ==================== FIXTURES ==================== */

export const test = base.extend<Fixtures>({

  /* ==================== AUTHENTICATED FIXTURES ==================== */

  authPage: async ({ browser }: { browser: any }, use: (page: Page) => Promise<void>) => {
    const page = await createAuthenticatedPage(browser, Paths.AUTH_FILE, 'Administrator');
    await use(page);
    await page.context().close();
    Logger.info('🧹 Authenticated user fixture cleaned up');
  },

  /* ==================== GUEST FIXTURES (NO SESSION) ==================== */

  /**
   * Generic guest page - no authentication
   * Use for: Registration tests, login tests, public page tests
   */
  guestPage: async ({ browser }: { browser: any }, use: (page: Page) => Promise<void>) => {
    const page = await createGuestPage(browser);
    await use(page);
    await page.context().close();
    Logger.info('🧹 Guest page cleaned up');
  },


  /* ==================== PAGE OBJECT FIXTURES ==================== */

  loginPage: async ({ guestPage }: { guestPage: Page }, use: (pageObject: LoginPage) => Promise<void>) => {
    await use(new LoginPage(guestPage));
  },

  dashboardPage: async ({ authPage }: { authPage: Page }, use: (pageObject: DashboardPage) => Promise<void>) => {
    await use(new DashboardPage(authPage));
  },

  expenseManagementPage: async ({ authPage }: { authPage: Page }, use: (pageObject: ExpenseManagementPage) => Promise<void>) => {
    await use(new ExpenseManagementPage(authPage));
  },

  expenseReviewPage: async ({ authPage }: { authPage: Page }, use: (pageObject: ExpenseReviewPage) => Promise<void>) => {
    await use(new ExpenseReviewPage(authPage));
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