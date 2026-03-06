// tests/auth/login.spec.ts - CLEANEST VERSION

import { test, expect } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { NavigationHelper } from '@utils/helpers/navigationHelper';
import { DashboardTitles, LoginPortalHeaders } from '@enums/Enums';
import { SharedComponents } from '@pages/base/SharedComponents';

test.describe('Login Tests @auth @login', () => {

  test('TC-LOGIN-001: Staff Login with Valid Credentials', async ({individualLoginPage, guestPage, publicPage, portalSelectionPage }) => {
    Logger.testStart('TC-LOGIN-001: Staff Login');

    const nav = new NavigationHelper(guestPage);
    //const staffLoginPage = new StaffLoginPage(guestPage);

    await test.step('Verify and Navigate to Staff Login', async () => {
      // ✅ Verify Login button before clicking
      await Assertions.verifyElementVisible(
        publicPage.loginButton,
        'Login button'
      );
      
      // Navigate using publicPage
      await publicPage.clickOnLogin();
      
      // ✅ Verify Individual  Portal link before clicking
      await Assertions.verifyElementVisible(
        portalSelectionPage.individualPortalLoginLink,
        'Individual Portal Login link'
      );
      
      await portalSelectionPage.clickOnIndividualPortalLoginLink();
      
      Logger.success('Navigated to Individaual Login page');
    });

    await test.step('Verify Individual Login Page', async () => {
      //const loginPortalHeader = guestPage.locator('.login100-form-title-1');
       const sharedComponents = new SharedComponents(guestPage);
      
      await Assertions.verifyElementVisible(sharedComponents.loginPortalHeader, 'Login Portal Header');
      await Assertions.verifyElementText(
        sharedComponents.loginPortalHeader,
        LoginPortalHeaders.INDIVIDUAL_LOGIN_PORTAL_TITLE,
        'Login Portal Title'
      );
      
      await Assertions.verifyElementVisible(sharedComponents.userNameField, 'Username field');
      await Assertions.verifyElementVisible(sharedComponents.passwordField, 'Password field');
      await Assertions.verifyElementVisible(sharedComponents.login, 'Login button');
    });

    await test.step('Login with Valid Credentials', async () => {
      await individualLoginPage.individualLogin(
        process.env.IND_USERNAME!,
        process.env.IND_PASSWORD!
      );
    });

    await test.step('Verify Successful Login', async () => {
      await guestPage.waitForURL('**/dashboard', { timeout: 30000 });
      
      const dashboardHeader = individualLoginPage.individualDashboardHeader;
      await Assertions.verifyElementVisible(dashboardHeader, 'Dashboard header');
      await Assertions.verifyElementText(
        dashboardHeader,
        DashboardTitles.INDIVIDUAL_DASHBOARD_TITLE,
        'Dashboard title'
      );
      
      Logger.success('Login successful');
    });

    Logger.testEnd('TC-LOGIN-001');
  });


  test('TC-LOGIN-002: Individual Login with Invalid Credentials', async ({ individualLoginPage, guestPage }) => {
    Logger.testStart('TC-LOGIN-002: Invalid Login');

    const nav = new NavigationHelper(guestPage);
   // const staffLoginPage = new StaffLoginPage(guestPage);

    await test.step('Navigate to Staff Login', async () => {
      // ✅ Using NavigationHelper - no manual verification needed inside
      await nav.goToIndividualLogin();
      
    
    });

    await test.step('Login with Invalid Credentials', async () => {
      await individualLoginPage.individualLogin(
        process.env.INVALID_USERNAME!,
        process.env.INVALID_PASSWORD!
      );
    });

    await test.step('Verify Error Message', async () => {
      const errorMessage = guestPage.locator('.alert-danger');
      
      await Assertions.verifyElementVisible(errorMessage, 'Error message', 10000);
      await Assertions.verifyElementContainsText(
        errorMessage,
        'Invalid Credentials',
        'Error message text'
      );
    });

    Logger.testEnd('TC-LOGIN-002');
  });
});