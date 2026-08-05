import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { UserRole } from '@types';

/* ==================== TEST DATA ==================== */

const adminUser = {
  username: process.env.ETS_ADMIN_USERNAME!,
  password: process.env.ETS_ADMIN_PASSWORD!,
  role: 'Administrator' as UserRole
};

const ldapUser = {
  username: process.env.ETS_LDAP_USERNAME || process.env.ETS_EMPLOYEE_USERNAME || process.env.ETS_MANAGER_USERNAME || 'kmkrishna',
  password: process.env.ETS_LDAP_PASSWORD || process.env.ETS_EMPLOYEE_PASSWORD || process.env.ETS_MANAGER_PASSWORD || 'Gangamma@8',
  role: 'LDAP' as UserRole
};

/* ==================== TEST SUITE ==================== */

test.describe('@regression Login Module - Authentication Validation (Environment Variables)', () => {

  test.beforeEach(async ({ loginPage }) => {
    Logger.info('Navigating to Login Page');
    await loginPage.goto();
  });

  /* ==================== POSITIVE TESTS ==================== */

  test('TC-LOGIN-001: Login with Admin Valid Credentials', async ({ loginPage }) => {

    Logger.testStart('TC-LOGIN-001: Admin Login');

    test.info().annotations.push({ type: 'role', description: adminUser.role });

    // UI Validation
    await Assertions.verifyElementVisible(loginPage.signinETSHeading, 'Login heading');
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
    await loginPage.page.waitForURL('**/dashboard/', { timeout: 30000 });
    await loginPage.verifyDashboard(adminUser.role);

    Logger.success('✅ Admin login successful');
    Logger.testEnd('TC-LOGIN-001');
  });


  test('TC-LOGIN-002: Login with LDAP Valid Credentials', async ({ loginPage }) => {

    Logger.testStart('TC-LOGIN-002: LDAP Login');

    test.info().annotations.push({ type: 'role', description: ldapUser.role });

    // UI Validation
    await Assertions.verifyElementVisible(loginPage.signinETSHeading, 'Login heading');
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
    await loginPage.page.waitForURL('**/dashboard/', { timeout: 30000 });
    await loginPage.verifyDashboard(ldapUser.role);

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
      process.env.ETS_INVALID_USERNAME!,
      process.env.ETS_INVALID_PASSWORD!,
      'Administrator'
    );

    await Assertions.verifyElementVisible(loginPage.loginErrorMessage, 'Login error message', 30000);

    Logger.success('✅ Invalid login validation successful');
    Logger.testEnd('NEG-TC-LOGIN-003');
  });

});