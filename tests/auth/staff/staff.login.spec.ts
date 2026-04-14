// tests/auth/login.spec.ts - CLEANEST VERSION

import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { DashboardTitles} from '@enums/Enums';
import { SharedComponents } from '@pages/base/SharedComponents';

test.describe('Login Tests @auth @login', () =>{

  //Common Step: Navigate to Staff Login
   test.beforeEach(async ({ publicPage }) => {
    Logger.testStart('Common Step: Navigate to Staff Login');

    await test.step('Verify and Navigate to Staff Login', async () => {
      await Assertions.verifyElementVisible(
        publicPage.staffLoginButton,
        'Staff Login button'
      );
      await publicPage.clickOnStaffLogin();
      Logger.success('Navigated to Staff Login page');
    });
  });



  // Grantor Portal: Valid Credentials
  test('TC-GRANTOR-LOGIN-001: Grantor Login with Valid Credentials', async ({ staffLoginPage,guestPage, publicPage }) => {
   
    Logger.testStart('TC-GRANTOR-LOGIN-001: Staff Grantor Login');

    await test.step('Navigate to Grantor Portal', async()=>{
      await staffLoginPage.selectGrantorPortalOption();
      Logger.success('Navigated to Grantor Portal');
    })

    await test.step('Verify Grantor portal Login Page', async () => {
      
      await Assertions.verifyElementVisible(publicPage.userNameField, 'Username field');
      await Assertions.verifyElementVisible(publicPage.passwordField, 'Password field');
      await Assertions.verifyElementVisible(publicPage.loginButton, 'Login button');

    });

    await test.step('Login with Valid Grantor Credentials', async () => {
      await staffLoginPage.doGrantorLogin(
        process.env.STAFF_USERNAME!,
        process.env.STAFF_PASSWORD!,
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
      
      Logger.success('Grantor Login successful');
    });

    Logger.testEnd('TC-GRANTOR-LOGIN-001');
  });


  // Grantor Portal: Invalid Credentials
  test('NEG-TC-GRANTOR-LOGIN-002: Grantor Login with Invalid Credentials', async ({ staffLoginPage,guestPage,publicPage }) => {
    Logger.testStart('NEG-TC-GRANTOR-LOGIN-002: Grantor Invalid Login');


    await test.step('Navigate to Grantor Portal', async()=>{
      await staffLoginPage.selectGrantorPortalOption();
      Logger.success('Navigated to Grantor Portal');
    })

    await test.step('Verify Grantor portal Login Page', async () => {
      
      await Assertions.verifyElementVisible(publicPage.userNameField, 'Username field');
      await Assertions.verifyElementVisible(publicPage.passwordField, 'Password field');
      await Assertions.verifyElementVisible(publicPage.loginButton, 'Login button');
    });

    await test.step('Login with Invalid Credentials', async () => {
      await staffLoginPage.doGrantorLogin('invalid@test.com', 'WrongPassword123');
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

    Logger.testEnd('NEG-TC-GRANTOR-LOGIN-002');
  });



  // Grantee Portal: Valid Credentials
  test('TC-GRANTEE-LOGIN-003: Grantee Login with Valid Credentials', async ({ staffLoginPage,guestPage, publicPage }) => {
    Logger.testStart('TC-GRANTEE-LOGIN-003: Grantee Valid Login');

await test.step('Navigate to Grantee Portal', async()=>{
      await staffLoginPage.selectGranteePortalOption();
      Logger.success('Navigated to Grantee Portal');
    })

    await test.step('Verify Grantee portal Login Page', async () => {
      
      await Assertions.verifyElementVisible(publicPage.userNameField, 'Username field');
      await Assertions.verifyElementVisible(publicPage.passwordField, 'Password field');
      await Assertions.verifyElementVisible(publicPage.loginButton, 'Login button');
    });

    await test.step('Login with Valid Grantee Credentials', async () => {
      await staffLoginPage.doGranteeLogin(
        process.env.GRANTEE_USERNAME!,
        process.env.GRANTEE_PASSWORD!,
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

    Logger.testEnd('TC-GRANTEE-LOGIN-003');
  });

  // Grantee Portal: Invalid Credentials
  test('NEG-TC-GRANTEE-LOGIN-004: Grantee Login with Invalid Credentials', async ({ staffLoginPage,guestPage, publicPage }) => {
    Logger.testStart('NEG-TC-GRANTEE-LOGIN-004: Grantee Invalid Login');


await test.step('Navigate to Grantor Portal', async()=>{
      await staffLoginPage.selectGranteePortalOption();
      Logger.success('Navigated to Grantee Portal');
    })

    await test.step('Verify Grantee portal Login Page', async () => {
      
      await Assertions.verifyElementVisible(publicPage.userNameField, 'Username field');
      await Assertions.verifyElementVisible(publicPage.passwordField, 'Password field');
      await Assertions.verifyElementVisible(publicPage.loginButton, 'Login button');
    });

    await test.step('Login with Invalid Credentials', async () => {
      await staffLoginPage.doGranteeLogin('invalid@grantee.com', 'WrongPassword123');
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

    Logger.testEnd('NEG-TC-GRANTEE-LOGIN-004');
  });
});