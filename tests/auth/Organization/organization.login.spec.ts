// tests/auth/login.spec.ts - CLEANEST VERSION

import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Login Tests @auth @login', () => {

  test('TC-ORG-LOGIN-001: Organization Login with Valid Credentials', async ({ organizationLoginPage, guestPage, publicPage }) => {
    Logger.testStart('TC-LOGIN-001: Organization Login');

    await test.step('Navigate to Organization Login', async () => {
      await publicPage.navigateToOrganizationLogin();
    });

    await test.step('Verify Organization Login Page', async () => {
      await Assertions.verifyElementVisible(publicPage.userNameField, 'Username field');
      await Assertions.verifyElementVisible(publicPage.passwordField, 'Password field');
      await Assertions.verifyElementVisible(publicPage.login, 'Login button');
    });

    await test.step('Login with Valid Credentials', async () => {
      await organizationLoginPage.organizationLogin(
        process.env.ORG_USERNAME!,
        process.env.ORG_PASSWORD!,
        process.env.ORG_NAME!
      );
    });

    await test.step('Verify Successful Login', async () => {
      await organizationLoginPage.verifySuccessfulLogin();
    });

    Logger.testEnd('TC-LOGIN-001');
  });


  test('TC-ORG-NEG-LOGIN-002: Organization Login with valid Username + invalid Password', async ({ organizationLoginPage, guestPage, publicPage }) => {
    Logger.testStart('TC-LOGIN-002: Invalid Login');

    await test.step('Navigate to Organization Login', async () => {
      await publicPage.navigateToOrganizationLogin();
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