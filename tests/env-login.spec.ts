import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { UserRole } from '@types';

/* ==================== TEST DATA ==================== */

const adminUser = {
  username: process.env.MMM_ADMIN_USERNAME!,
  password: process.env.MMM_ADMIN_PASSWORD!,
  role: 'Administrator' as UserRole
};

const ldapUser = {
  username: process.env.MMM_LDAP_USERNAME!,
  password: process.env.MMM_LDAP_PASSWORD!,
  role: 'LDAP' as UserRole
};

/* ==================== TEST SUITE ==================== */

test.describe('Login Module - Authentication Validation (Environment Variables)', () => {

  test.beforeEach(async ({ loginPage }) => {
    Logger.info('Navigating to Login Page');
    await loginPage.goto();
  });

  /* ==================== POSITIVE TESTS ==================== */

  test('TC-LOGIN-001: Login with Admin Valid Credentials', async ({ loginPage }) => {

    Logger.testStart('TC-LOGIN-001: Admin Login');

    test.info().annotations.push({ type: 'role', description: adminUser.role });

    // UI Validation
    await Assertions.verifyElementVisible(loginPage.signinMMMHeading, 'Login heading');
    await Assertions.verifyElementVisible(loginPage.userNameField, 'Username field');
    await Assertions.verifyElementVisible(loginPage.passwordField, 'Password field');
    await Assertions.verifyElementVisible(loginPage.loginButton, 'Login button');

    // Login
    await loginPage.doLogin(
      adminUser.username,
      adminUser.password,
      adminUser.role
    );

    // Dashboard Validation
    await loginPage.page.waitForURL('**/dashboard', { timeout: 30000 });

    await Assertions.verifyElementVisible(loginPage.dashboardHeader, 'Dashboard header', 30000);

    Logger.success('✅ Admin login successful');
    Logger.testEnd('TC-LOGIN-001');
  });


  test('TC-LOGIN-002: Login with LDAP Valid Credentials', async ({ loginPage }) => {

    Logger.testStart('TC-LOGIN-002: LDAP Login');

    test.info().annotations.push({ type: 'role', description: ldapUser.role });

    // UI Validation
    await Assertions.verifyElementVisible(loginPage.signinMMMHeading, 'Login heading');
    await Assertions.verifyElementVisible(loginPage.userNameField, 'Username field');
    await Assertions.verifyElementVisible(loginPage.passwordField, 'Password field');
    await Assertions.verifyElementVisible(loginPage.loginButton, 'Login button');

    // Login
    await loginPage.doLogin(
      ldapUser.username,
      ldapUser.password,
      ldapUser.role
    );

    // Dashboard Validation
    await loginPage.page.waitForURL('**/dashboard', { timeout: 30000 });

    await Assertions.verifyElementVisible(loginPage.dashboardHeader, 'Dashboard header', 30000
    );

    Logger.success('✅ LDAP login successful');
    Logger.testEnd('TC-LOGIN-002');
  });


  /* ==================== NEGATIVE TESTS ==================== */

  test('NEG-TC-LOGIN-003: Login with Invalid Credentials', async ({ loginPage }) => {

    Logger.testStart('NEG-TC-LOGIN-003: Invalid Login');

    await Assertions.verifyElementVisible(loginPage.userNameField, 'Username field');
    await Assertions.verifyElementVisible(loginPage.passwordField, 'Password field');
    await Assertions.verifyElementVisible(loginPage.loginButton, 'Login button');

    await loginPage.doLogin(
      process.env.MMM_INVALID_USERNAME!,
      process.env.MMM_INVALID_PASSWORD!,
      'Administrator'
    );

    await Assertions.verifyElementVisible(loginPage.loginErrorMessage, 'Login error message', 30000);

    Logger.success('✅ Invalid login validation successful');
    Logger.testEnd('NEG-TC-LOGIN-003');
  });

});