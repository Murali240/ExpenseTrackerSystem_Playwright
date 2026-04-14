// tests/auth/login.spec.ts - CLEANEST VERSION

import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { NavigationHelper } from '@utils/helpers/navigationHelper';
import { DashboardTitles, LoginPortalHeaders } from '@enums/Enums';
import { SharedComponents } from '@pages/base/SharedComponents';

test.describe('Login Tests @auth @login', () =>{

  // Grantor Portal: Valid Credentials
  test('TC-STAFF-GRANTOR-LOGIN-001: Grantor Login with Valid Credentials', async ({ staffLoginPage,guestPage, publicPage }) => {
    Logger.testStart('TC-GRANTOR-LOGIN-001: Staff Grantor Login');

    await test.step('Verify and Navigate to Staff Login', async () => {
      // ✅ Verify Login button before clicking
      await Assertions.verifyElementVisible(
        publicPage.staffLoginButton,
        'Staff Login button'
      );
      
      // Navigate using publicPage
      await publicPage.clickOnStaffLogin();
      
      Logger.success('Navigated to Staff Login page');
    });

    await test.step('Verify Grantor portal Login Page', async () => {
     
      const sharedComponents = new SharedComponents(guestPage);
      
      await Assertions.verifyElementVisible(sharedComponents.userNameField, 'Username field');
      await Assertions.verifyElementVisible(sharedComponents.passwordField, 'Password field');
      await Assertions.verifyElementVisible(sharedComponents.login, 'Login button');

    });

    await test.step('Login with Valid Staff Grantor Credentials', async () => {
      await staffLoginPage.staffLogin(
        process.env.STAFF_USERNAME!,
        process.env.STAFF_PASSWORD!,
        'Grantor Portal'
      );
    });

    await test.step('Verify Successful Login', async () => {
      await guestPage.waitForURL('**/dashboard', { timeout: 30000 });
      
      const dashboardHeader = staffLoginPage.staffGrantorDashboardHeader;
      await Assertions.verifyElementVisible(dashboardHeader, 'Dashboard header');
      await Assertions.verifyElementText(
        dashboardHeader,
        DashboardTitles.STAFF_GRANTOR_DASHBOARD_TITLE,
        'Dashboard title'
      );
      
      Logger.success('Login successful');
    });

    Logger.testEnd('TC-LOGIN-001');
  });


  // Grantor Portal: Invalid Credentials
  test('TC-STAFF-NEG-LOGIN-002: Grantor Login with Invalid Credentials', async ({ staffLoginPage,guestPage,publicPage }) => {
    Logger.testStart('TC-LOGIN-002: Grantor Invalid Login');

    await test.step('Verify and Navigate to Staff Login', async () => {
      await Assertions.verifyElementVisible(
        publicPage.staffLoginButton,
        'Staff Login button'
      );
      await publicPage.clickOnStaffLogin();
      Logger.success('Navigated to Staff Login page');
    });

    await test.step('Verify Grantor portal Login Page', async () => {
      const sharedComponents = new SharedComponents(guestPage);
      await Assertions.verifyElementVisible(sharedComponents.userNameField, 'Username field');
      await Assertions.verifyElementVisible(sharedComponents.passwordField, 'Password field');
      await Assertions.verifyElementVisible(sharedComponents.login, 'Login button');
    });

    await test.step('Login with Invalid Credentials', async () => {
      await staffLoginPage.staffLogin('invalid@test.com', 'WrongPassword123', 'Grantor Portal');
    });

    await test.step('Verify Error Message', async () => {
      const errorMessage = guestPage.locator('.alert-danger');
      await Assertions.verifyElementVisible(errorMessage, 'Error message', 10000);
      await Assertions.verifyElementContainsText(
        errorMessage,
        'Please Enter Your Valid Username and Password',
        'Error message text'
      );
    });

    Logger.testEnd('TC-LOGIN-002');
  });

  // Grantee Portal: Valid Credentials
  test('TC-STAFF-LOGIN-003: Grantee Login with Valid Credentials', async ({ staffLoginPage,guestPage, publicPage }) => {
    Logger.testStart('TC-LOGIN-003: Grantee Valid Login');

    await test.step('Verify and Navigate to Staff Login', async () => {
      await Assertions.verifyElementVisible(
        publicPage.staffLoginButton,
        'Staff Login button'
      );
      await publicPage.clickOnStaffLogin();
      Logger.success('Navigated to Staff Login page');
    });

    await test.step('Verify Grantee portal Login Page', async () => {
      const sharedComponents = new SharedComponents(guestPage);
      await Assertions.verifyElementVisible(sharedComponents.userNameField, 'Username field');
      await Assertions.verifyElementVisible(sharedComponents.passwordField, 'Password field');
      await Assertions.verifyElementVisible(sharedComponents.login, 'Login button');
    });

    await test.step('Login with Valid Grantee Credentials', async () => {
      await staffLoginPage.staffLogin(
        // process.env.GRANTEE_USERNAME || 'grantee@example.com',
        // process.env.GRANTEE_PASSWORD || 'GranteePassword123',
        // 'Grantee Portal'

        process.env.GRANTEE_USERNAME!,
        process.env.GRANTEE_PASSWORD!,
        'Grantee Portal'
      );
    });

    await test.step('Verify Successful Login', async () => {
      await guestPage.waitForURL('**/dashboard', { timeout: 30000 });
      const dashboardHeader = staffLoginPage.staffGranteeDashboardHeader;
      await Assertions.verifyElementVisible(dashboardHeader, 'Dashboard header');
      await Assertions.verifyElementText(
        dashboardHeader,
        DashboardTitles.STAFF_GRANTEE_DASHBOARD_TITLE,
        'Dashboard title'
      );
      Logger.success('Grantee login successful');
    });

    Logger.testEnd('TC-LOGIN-003');
  });

  // Grantee Portal: Invalid Credentials
  test('TC-STAFF-NEG-LOGIN-004: Grantee Login with Invalid Credentials', async ({ staffLoginPage,guestPage, publicPage }) => {
    Logger.testStart('TC-LOGIN-004: Grantee Invalid Login');

    await test.step('Verify and Navigate to Staff Login', async () => {
      await Assertions.verifyElementVisible(
        publicPage.staffLoginButton,
        'Staff Login button'
      );
      await publicPage.clickOnStaffLogin();
      Logger.success('Navigated to Staff Login page');
    });

    await test.step('Verify Grantee portal Login Page', async () => {
      const sharedComponents = new SharedComponents(guestPage);
      await Assertions.verifyElementVisible(sharedComponents.userNameField, 'Username field');
      await Assertions.verifyElementVisible(sharedComponents.passwordField, 'Password field');
      await Assertions.verifyElementVisible(sharedComponents.login, 'Login button');
    });

    await test.step('Login with Invalid Credentials', async () => {
      await staffLoginPage.staffLogin('invalid@grantee.com', 'WrongPassword123', 'Grantee Portal');
    });

    await test.step('Verify Error Message', async () => {
      const errorMessage = guestPage.locator('.alert-danger');
      await Assertions.verifyElementVisible(errorMessage, 'Error message', 10000);
      await Assertions.verifyElementContainsText(
        errorMessage,
        'Please Enter Your Valid Username and Password',
        'Error message text'
      );
    });

    Logger.testEnd('TC-LOGIN-004');
  });
});