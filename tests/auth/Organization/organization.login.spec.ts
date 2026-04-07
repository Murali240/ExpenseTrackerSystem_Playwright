// tests/auth/login.spec.ts - CLEANEST VERSION

import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { NavigationHelper } from '@utils/helpers/navigationHelper';
import { DashboardTitles, LoginPortalHeaders } from '@enums/Enums';
import { SharedComponents } from '@pages/base/SharedComponents';

test.describe('Login Tests @auth @login', () => {

  test('TC-ORG-LOGIN-001: Organization Login with Valid Credentials', async ({ organizationLoginPage, guestPage, publicPage, portalSelectionPage }) => {
    Logger.testStart('TC-LOGIN-001: Organization Login');

    await test.step('Verify and Navigate to Organization Login', async () => {
      const organizationRadio = guestPage.locator('label.toggle-option:has-text("ORGANIZATION")');
      await Assertions.verifyElementVisible(
        organizationRadio,
        'ORGANIZATION radio button'
      );
      
      // Navigate to Organization form
      await organizationRadio.click();
      
      Logger.success('Selected Organization Login option');
    });

    await test.step('Verify Organization Login Page', async () => {
     const sharedComponents = new SharedComponents(guestPage);
      
      await Assertions.verifyElementVisible(sharedComponents.userNameField, 'Username field');
      await Assertions.verifyElementVisible(sharedComponents.passwordField, 'Password field');
      await Assertions.verifyElementVisible(sharedComponents.login, 'Login button');
    });

    await test.step('Login with Valid Credentials', async () => {
      await organizationLoginPage.organizationLogin(
        process.env.ORG_USERNAME!,
        process.env.ORG_PASSWORD!,
        process.env.ORG_NAME!
      );
    });

    await test.step('Verify Successful Login', async () => {
      await guestPage.waitForURL('**/dashboard', { timeout: 30000 });
      
      const dashboardHeader = organizationLoginPage.organizationDashboardHeader;
      await Assertions.verifyElementVisible(dashboardHeader, 'Dashboard header');
      await Assertions.verifyElementText(
        dashboardHeader,
        DashboardTitles.ORGANIZATION_DASHBOARD_TITLE,
        'Dashboard title'
      );
      
      Logger.success('Login successful');
    });

    Logger.testEnd('TC-LOGIN-001');
  });


  test('TC-ORG-NEG-LOGIN-002: Organization Login with valid Username + invalid Password', async ({organizationLoginPage,guestPage }) => {
    Logger.testStart('TC-LOGIN-002: Invalid Login');

    const nav = new NavigationHelper(guestPage);
    //const organizationLoginPage = new OrganizationLoginPage(guestPage);


    await test.step('Navigate to Organization Login', async () => {
      // ✅ Using NavigationHelper - no manual verification needed inside
      await nav.goToOrgLogin();
    });

   await test.step('Login with Valid Username + Invalid Password', async () => {
      await organizationLoginPage.organizationLogin(
        process.env.ORG_USERNAME!,
        process.env.INVALID_PASSWORD!,
        process.env.ORG_NAME!
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