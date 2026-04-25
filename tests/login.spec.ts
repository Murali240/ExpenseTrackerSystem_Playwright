import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test('TC-LOGIN-001: Login with Valid Credentials', async ({ loginPage }) => {

  Logger.testStart('TC-LOGIN-001: Login with Valid Credentials');

  // Navigate to Login Page
  await loginPage.goto();

  // Verify Login Page Elements
  await Assertions.verifyElementVisible(loginPage.userNameField, 'Username field');
  await Assertions.verifyElementVisible(loginPage.passwordField, 'Password field');
  await Assertions.verifyElementVisible(loginPage.loginButton, 'Login button');

  // Perform Login
  await loginPage.doLogin(
  process.env.APP_USERNAME!,
  process.env.APP_PASSWORD!
);
  // Verify Dashboard
  await loginPage.page.waitForURL('**/dashboard', { timeout: 30000 });

  await Assertions.verifyElementVisible(
    loginPage.dashboardHeader,
    'Dashboard header',
    30000
  );

  Logger.success('Login successful');
  Logger.testEnd('TC-LOGIN-001');
});


test('NEG-TC-LOGIN-001: Login with Invalid Credentials', async ({ loginPage }) => {

  Logger.testStart('NEG-TC-LOGIN-001: Login with Invalid Credentials');

  // Navigate to Login Page
  await loginPage.goto();

  // Verify Login Page Elements
  await Assertions.verifyElementVisible(loginPage.userNameField, 'Username field');
  await Assertions.verifyElementVisible(loginPage.passwordField, 'Password field');
  await Assertions.verifyElementVisible(loginPage.loginButton, 'Login button');

  // Perform Login with INVALID credentials
  await loginPage.doLogin(
    process.env.INVALID_USERNAME!,
    process.env.INVALID_PASSWORD!
  );

  // Verify Error Message
  await Assertions.verifyElementVisible(
    loginPage.loginErrorMessage,
    'Login error message',
    30000
  );

  Logger.success('Invalid login validation successful');
  Logger.testEnd('NEG-TC-LOGIN-001');
});