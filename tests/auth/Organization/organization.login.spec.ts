import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Login Tests @auth @login', () => {


    //Common Step: Navigate to Organization Login
   test.beforeEach(async ({ publicPage }) => {
    Logger.testStart('Common Step: Navigate to Organization Login');

    // Navigate to Organization Login option
    await test.step('Verify and Navigate to Organization Login', async () => {
       await Assertions.verifyElementVisible(publicPage.organizationRadio, 'ORGANIZATION radio button');
       await publicPage.navigateToOrganizationLogin();
    });

      //Verify the fields in Organization Login portal
    await test.step('Verify Organization Login Page', async () => {
      
      await Assertions.verifyElementVisible(publicPage.userNameField, 'Username field');
      await Assertions.verifyElementVisible(publicPage.passwordField, 'Password field');
      await Assertions.verifyElementVisible(publicPage.loginButton, 'Login button');
    });

  });

  // Test Case -001 Organization Login Test with Valid credentials 
  test('TC-ORG-LOGIN-001: Organization Login with Valid Credentials', async ({ organizationLoginPage, guestPage, publicPage }) => {
    Logger.testStart('TC-LOGIN-001: Organization Login');

    // Do login with valid Organization Credentials
    await test.step('Login with Valid Credentials', async () => {
      await organizationLoginPage.organizationLogin(
        process.env.ORG_USERNAME!,
        process.env.ORG_PASSWORD!,
        process.env.ORG_NAME!
      );
    });

    await test.step('Verify Successful Login', async () => {
      await organizationLoginPage.verifyOrganizationSuccessfulLogin();
    });

    Logger.testEnd('TC-ORG-LOGIN-001');
  });

  // Test Case -002 Organization Login Test with inValid credentials 
  test('NEG-TC-ORG-LOGIN-002: Organization Login with valid Username + invalid Password', async ({ organizationLoginPage, guestPage, publicPage }) => {
    Logger.testStart('TC-LOGIN-002: Invalid Login');

    // Do login with invalid Organization Credentials
   await test.step('Login with Valid Username + Invalid Password', async () => {
      await organizationLoginPage.organizationLogin(
        process.env.ORG_USERNAME!,
        process.env.INVALID_PASSWORD!,
        process.env.ORG_NAME!
      );
    });

    // Verify error message on login failure .
    await test.step('Verify Error Message', async () => {
      const errorMessage = guestPage.locator('.alert-danger');
      
      await Assertions.verifyElementVisible(errorMessage, 'Error message', 10000);
      await Assertions.verifyElementContainsText(
        errorMessage,
        'Invalid Credentials',
        'Error message text'
      );
    });

    Logger.testEnd('NEG-TC-ORG-LOGIN-002');
  });
});