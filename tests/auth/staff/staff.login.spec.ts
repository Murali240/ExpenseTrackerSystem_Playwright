// tests/auth/login.spec.ts - CLEANEST VERSION

import { test, expect } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { NavigationHelper } from '@utils/helpers/navigationHelper';
import { DashboardTitles, LoginPortalHeaders } from '@enums/Enums';
import { SharedComponents } from '@pages/base/SharedComponents';

test.describe('Login Tests @auth @login', () =>{

  test('TC-STAFF-LOGIN-001: Staff Login with Valid Credentials', async ({ staffLoginPage,guestPage, publicPage, portalSelectionPage }) => {
    Logger.testStart('TC-LOGIN-001: Staff Login');

    const nav = new NavigationHelper(guestPage);
    
    await test.step('Verify and Navigate to Staff Login', async () => {
      // ✅ Verify Login button before clicking
      await Assertions.verifyElementVisible(
        publicPage.loginButton,
        'Login button'
      );
      
      // Navigate using publicPage
      await publicPage.clickOnLogin();
      
      // ✅ Verify Staff Portal link before clicking
      await Assertions.verifyElementVisible(
        portalSelectionPage.staffPortalLoginLink,
        'Staff Portal Login link'
      );
      
      await portalSelectionPage.clickOnStaffPortalLoginLink();
      
      Logger.success('Navigated to Staff Login page');
    });

    await test.step('Verify Staff Login Page', async () => {
     
      const sharedComponents = new SharedComponents(guestPage);
      
      await Assertions.verifyElementVisible(sharedComponents.loginPortalHeader, 'Login Portal Header');
      await Assertions.verifyElementText(
        sharedComponents.loginPortalHeader,
        LoginPortalHeaders.STAFF_LOGIN_PORTAL_TITLE,
        'Login Portal Title'
      );
      
      await Assertions.verifyElementVisible(sharedComponents.userNameField, 'Username field');
      await Assertions.verifyElementVisible(sharedComponents.passwordField, 'Password field');
      await Assertions.verifyElementVisible(sharedComponents.login, 'Login button');

    });

    await test.step('Login with Valid Credentials', async () => {
      await staffLoginPage.staffLogin(
        process.env.STAFF_USERNAME!,
        process.env.STAFF_PASSWORD!
      );
    });

    await test.step('Verify Successful Login', async () => {
      await guestPage.waitForURL('**/dashboard', { timeout: 30000 });
      
      const dashboardHeader = staffLoginPage.staffDashboardHeader;
      await Assertions.verifyElementVisible(dashboardHeader, 'Dashboard header');
      await Assertions.verifyElementText(
        dashboardHeader,
        DashboardTitles.STAFF_DASHBOARD_TITLE,
        'Dashboard title'
      );
      
      Logger.success('Login successful');
    });

    Logger.testEnd('TC-LOGIN-001');
  });


  test('TC-STAFF-NEG-LOGIN-002: Staff Login with Invalid Credentials', async ({ staffLoginPage,guestPage }) => {
    Logger.testStart('TC-LOGIN-002: Invalid Login');

    const nav = new NavigationHelper(guestPage);

    await test.step('Navigate to Staff Login', async () => {
      // ✅ Using NavigationHelper - no manual verification needed inside

      const sharedComponents = new SharedComponents(guestPage);

      await nav.goToStaffLogin();
      
      await Assertions.verifyElementVisible(sharedComponents.loginPortalHeader, 'Login Portal Header');
      await Assertions.verifyElementText(
        sharedComponents.loginPortalHeader,
        LoginPortalHeaders.STAFF_LOGIN_PORTAL_TITLE,
        'Login Portal Title'
      );
    });

    await test.step('Login with Invalid Credentials', async () => {
      await staffLoginPage.staffLogin('invalid@test.com', 'WrongPassword123');
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
});