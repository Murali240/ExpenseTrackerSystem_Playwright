// tests/auth/login.spec.ts - CLEANEST VERSION

import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';


test.describe('Individual Login Tests @auth @login', () => {

    //Common Step: Navigate to Individual Login
   test.beforeEach(async ({ publicPage }) => {
    Logger.testStart('Common Step: Navigate to Individual Login');

    // Navigate to Individual Login option
    await test.step('Verify and Navigate to Individual Login', async () => {
       await Assertions.verifyElementVisible(publicPage.individualRadio, 'INDIVIDUAL radio button');
       await publicPage.navigateToIndividualLogin();
    });

      //Verify the fields in Individual Login portal
    await test.step('Verify Individual Login Page', async () => {
      
      await Assertions.verifyElementVisible(publicPage.userNameField, 'Username field');
      await Assertions.verifyElementVisible(publicPage.passwordField, 'Password field');
      await Assertions.verifyElementVisible(publicPage.loginButton, 'Login button');
    });

  });

  // Test Case -001 Individual Login Test with Valid credentials 
  test('TC-IND-LOGIN-001: Individual Login with Valid Credentials', async ({individualLoginPage, guestPage, publicPage, portalSelectionPage }) => {
    Logger.testStart('TC-IND-LOGIN-001: Individual Login');
    
    // Do individual login with Valid credentials 
    await test.step('Login with Valid Credentials', async () => {
      await individualLoginPage.individualLogin(
        process.env.IND_USERNAME!,
        process.env.IND_PASSWORD!
      );
    });

    // Verify Dashboard Header after successful login
    await test.step('Verify Successful Login', async () => {
      await individualLoginPage.verifyIndividualSuccessfulLogin();
  });
});


// Test Case -002 Individual Login Test with invalid Valid credentials 
  test('NEG-TC-IND-LOGIN-002: Individual Login with Invalid Credentials', async ({ individualLoginPage, guestPage }) => {
    Logger.testStart('TC-LOGIN-002: Invalid Login');

    // Do individual login with In Valid credentials 
    await test.step('Login with Invalid Credentials', async () => {
      await individualLoginPage.individualLogin(
        process.env.INVALID_USERNAME!,
        process.env.INVALID_PASSWORD!
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

    Logger.testEnd('NEG-TC-IND-LOGIN-002');
  });
});