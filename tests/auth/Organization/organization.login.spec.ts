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
      // Step 1: Enter username (triggers dropdown AJAX on keyup)
      await organizationLoginPage.userNameField.click();
      await organizationLoginPage.userNameField.clear();
      const username = process.env.ORG_USERNAME!;
      Logger.info(`Typing username: ${username}`);
      await organizationLoginPage.userNameField.type(username, { delay: 100 });
      // Wait for AJAX to populate dropdown after keyup
      await guestPage.waitForTimeout(1000);

      // Step 2: Wait for dropdown to be populated (AJAX success)
      const orgDropdown = organizationLoginPage.organizationDropDown;
      await orgDropdown.waitFor({ state: 'attached', timeout: 20000 });
      await guestPage.waitForFunction(
        () => {
          const dropdown = document.querySelector('#id_org');
          return dropdown && dropdown.options.length > 1;
        },
        { timeout: 20000 }
      );
      const orgOptions = await orgDropdown.locator('option').allTextContents();
      Logger.info('Organization dropdown options after username: ' + orgOptions.join(', '));

      // Assert the organization is present in the dropdown
      const orgName = process.env.ORG_NAME!;
      if (!orgOptions.some(opt => opt.trim() === orgName)) {
        throw new Error(`Organization '${orgName}' not found in dropdown options: [${orgOptions.join(', ')}]`);
      }

      // Step 3: Fill password
      await organizationLoginPage.passwordField.click();
      await organizationLoginPage.passwordField.clear();
      await organizationLoginPage.passwordField.type(process.env.ORG_PASSWORD!);

      // Step 4: Select organization
      await orgDropdown.selectOption({ label: orgName });
      await guestPage.waitForTimeout(500); // Wait for any onChange

      // Step 5: Click login
      await organizationLoginPage.login.click();
      await organizationLoginPage.waitForPageLoad();
    });

    await test.step('Verify Successful Login', async () => {
      await guestPage.waitForURL('**/dashboard', { timeout: 30000 });

      // Update: Match the actual dashboard header text from the snapshot
      const dashboardHeader = guestPage.locator('text="Organization User - Applicant Portal"').first();
      await Assertions.verifyElementVisible(dashboardHeader, 'Dashboard header');
      await Assertions.verifyElementText(
        dashboardHeader,
        'Organization User - Applicant Portal',
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
      const organizationRadio = guestPage.locator('label.toggle-option:has-text("ORGANIZATION")');
      await Assertions.verifyElementVisible(
        organizationRadio,
        'ORGANIZATION radio button'
      );
      
      // Navigate to Organization form
      await organizationRadio.click();
      
      Logger.success('Selected Organization Login option');
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