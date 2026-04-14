// tests/auth/login.spec.ts - CLEANEST VERSION

import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { NavigationHelper } from '@utils/helpers/navigationHelper';
import { DashboardTitles, LoginPortalHeaders } from '@enums/Enums';
import { SharedComponents } from '@pages/base/SharedComponents';

test.describe('Individual Login Tests @auth @login', () => {

  test('TC-IND-LOGIN-001: Individual Login with Valid Credentials', async ({individualLoginPage, guestPage, publicPage, portalSelectionPage }) => {
    Logger.testStart('TC-IND-LOGIN-001: Individual Login');

    await test.step('Verify and Navigate to Individual Login', async () => {
      const individualRadio = guestPage.locator('label.toggle-option:has-text("INDIVIDUAL")');
      await Assertions.verifyElementVisible(
        individualRadio,
        'INDIVIDUAL radio button'
      );
      
      // Navigate to Individual form
      await individualRadio.click();
      
      Logger.success('Selected Individual Login option');
    });

    await test.step('Verify Individual Login Page', async () => {
      const sharedComponents = new SharedComponents(guestPage);
      
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

      // Update: Match the actual dashboard header text from the snapshot
      const dashboardHeader = guestPage.locator('text="Individual User - Applicant Portal"').first();
      await Assertions.verifyElementVisible(dashboardHeader, 'Dashboard header');
      await Assertions.verifyElementText(
        dashboardHeader,
        'Individual User - Applicant Portal',
        'Dashboard title'
      );
      Logger.success('Login successful');
    });

    Logger.testEnd('TC-IND-LOGIN-001');
  });


  test('TC-IND-NEG-LOGIN-002: Individual Login with Invalid Credentials', async ({ individualLoginPage, guestPage }) => {
    Logger.testStart('TC-LOGIN-002: Invalid Login');

    const nav = new NavigationHelper(guestPage);
   // const staffLoginPage = new StaffLoginPage(guestPage);

    await test.step('Navigate to Individual Login', async () => {

      const individualRadio = guestPage.locator('label.toggle-option:has-text("INDIVIDUAL")');
      await Assertions.verifyElementVisible(
        individualRadio,
        'INDIVIDUAL radio button'
      );
      
      // Navigate to Individual form
      await individualRadio.click();
      
      Logger.success('Selected Individual Login option');

    });

     await test.step('Verify Individual Login Page', async () => {
      const sharedComponents = new SharedComponents(guestPage);
      
      await Assertions.verifyElementVisible(sharedComponents.userNameField, 'Username field');
      await Assertions.verifyElementVisible(sharedComponents.passwordField, 'Password field');
      await Assertions.verifyElementVisible(sharedComponents.login, 'Login button');
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