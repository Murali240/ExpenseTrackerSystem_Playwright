import { test, expect } from '@fixtures/AuthFixtures';
import { Logger } from '@utils/logger';
import { Assertions } from '@utils/assertions';
import { StaffRegistrationPage } from '@pages/auth/staff/StaffRegistrationPage';
import { StaffUserFactory } from '@utils/factories/StaffUserFactory';


test.describe('Staff Registration @auth @registration @staff', () => {

  test('TC-REG-GRANTOR-001: Register New Grantor', async ({ guestPage, publicPage, staffLoginPage }) => {
    Logger.testStart('TC-REG-GRANTOR-001: Register New Grantor');

    // Generate test data using factory
    const staffData = StaffUserFactory.generateStaffUser();
    
    Logger.info(`Generated staff user: ${staffData.email}`);

    const staffRegistrationPage = new StaffRegistrationPage(guestPage);

    await test.step('Navigate to Staff Registration Page', async () => {
      // Verify Login button before clicking
      await Assertions.verifyElementVisible(
        publicPage.staffLoginButton,
        'Staff Login button'
      );
      
      // Navigate using publicPage
      await publicPage.clickOnStaffLogin();
      Logger.success('Navigated to Staff Login page');
      
      await guestPage.waitForLoadState('networkidle');
    });

    await test.step('Click on Register button', async () => {
      await staffLoginPage.clickRegisterButton();
    });

    await test.step('Wait for Registration Form', async () => {
      await staffRegistrationPage.waitForRegistrationForm();
    });

    await test.step('Fill Registration Form', async () => {
      // Use page object method with factory-generated data
      await staffRegistrationPage.fillRegistrationForm({
        username: staffData.username,
        password: staffData.password,
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        email: staffData.email,
        mobileNumber: staffData.mobileNumber
      });
    });

    await test.step('Submit Registration', async () => {
      await staffRegistrationPage.submitRegistration();
    });

    await test.step('Verify Success Message', async () => {
  const successMessage = guestPage.locator('.swal2-html-container');

  await expect(successMessage).toBeVisible();
  await expect(successMessage).toHaveText('User Registered successfully.');

  Logger.success('Grantor Registered successfully.');
});

    Logger.testEnd('TC-REG-STAFF-001');
  });

  test('TC-REG-GRANTOR-002: Grantor Registration Validation - Missing Required Fields', async ({ guestPage, publicPage, staffLoginPage }) => {
    Logger.testStart('TC-REG-STAFF-002: Grantor Registration Validation');

    const staffRegistrationPage = new StaffRegistrationPage(guestPage);

    await test.step('Navigate to Staff Registration', async () => {
      await publicPage.clickOnStaffLogin();
      await guestPage.waitForLoadState('networkidle');
      await staffLoginPage.clickRegisterButton();
      await staffRegistrationPage.waitForRegistrationForm();
    });

    await test.step('Submit without filling any fields', async () => {
      await staffRegistrationPage.submitRegistration();
    });
  
await test.step('Verify validation errors', async () => {
  // Wait for any error to appear
  await guestPage.waitForTimeout(1000);

  // Django forms typically render errors like this:
  const errorSelectors = [
    '.errorlist li',           // Django default error list
    '.invalid-feedback',       // Bootstrap validation
    '.error-message',
    '[class*="error"]',
    'text=Please fill in this field',
    'text=This field is required',
  ];

  for (const selector of errorSelectors) {
    const count = await guestPage.locator(selector).count();
    if (count > 0) {
      console.log(`Found error with selector: "${selector}", count: ${count}`);
      const text = await guestPage.locator(selector).first().innerText();
      console.log(`Error text: "${text}"`);
    }
  }
});

    Logger.testEnd('TC-REG-STAFF-002');
  });






  test('TC-REG-GRANTEE-003: Register New Grantee', async ({ guestPage, publicPage, staffLoginPage }) => {
    Logger.testStart('TC-REG-STAFF-001: Register New Grantee');

    // Generate test data using factory
    const staffData = StaffUserFactory.generateStaffUser();
    Logger.info(`Generated staff user: ${staffData.email}`);

    const staffRegistrationPage = new StaffRegistrationPage(guestPage);

    await test.step('Navigate to Staff Registration Page', async () => {
      // Verify Login button before clicking
      await Assertions.verifyElementVisible(
        publicPage.staffLoginButton,
        'Staff Login button'
      );
      
      // Navigate using publicPage
      await publicPage.clickOnStaffLogin();
      Logger.success('Navigated to Staff Login page');
      
      await guestPage.waitForLoadState('networkidle');
    });

    await test.step('Click on Register button', async () => {
      await staffLoginPage.clickRegisterButton('Grantee Portal');
    });

    await test.step('Wait for Registration Form', async () => {
      await staffRegistrationPage.waitForRegistrationForm();
    });

    await test.step('Fill Registration Form', async () => {
      // Use page object method with factory-generated data
      await staffRegistrationPage.fillRegistrationForm({
        username: staffData.username,
        password: staffData.password,
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        email: staffData.email,
        mobileNumber: staffData.mobileNumber
      });
    });

    await test.step('Submit Registration', async () => {
      await staffRegistrationPage.submitRegistration();
    });

    await test.step('Verify Success Message', async () => {
  const successMessage = guestPage.locator('.swal2-html-container');

  await expect(successMessage).toBeVisible();
  await expect(successMessage).toHaveText('User Registered successfully.');

  Logger.success('Grantee Registered successfully.');
});

    Logger.testEnd('TC-REG-GRANTEE-003');
  });

  test('TC-REG-GRANTEE-004: Grantee Registration Validation - Missing Required Fields', async ({ guestPage, publicPage, staffLoginPage }) => {
    Logger.testStart('TC-REG-STAFF-004: Grantee Registration Validation');

    const staffRegistrationPage = new StaffRegistrationPage(guestPage);

    await test.step('Navigate to Staff Registration', async () => {
      await publicPage.clickOnStaffLogin();
      await guestPage.waitForLoadState('networkidle');
      await staffLoginPage.clickRegisterButton();
      await staffRegistrationPage.waitForRegistrationForm();
    });

    await test.step('Submit without filling any fields', async () => {
      await staffRegistrationPage.submitRegistration();
    });
  
await test.step('Verify validation errors', async () => {
  // Wait for any error to appear
  await guestPage.waitForTimeout(1000);

  // Django forms typically render errors like this:
  const errorSelectors = [
    '.errorlist li',           // Django default error list
    '.invalid-feedback',       // Bootstrap validation
    '.error-message',
    '[class*="error"]',
    'text=Please fill in this field',
    'text=This field is required',
  ];

  for (const selector of errorSelectors) {
    const count = await guestPage.locator(selector).count();
    if (count > 0) {
      console.log(`Found error with selector: "${selector}", count: ${count}`);
      const text = await guestPage.locator(selector).first().innerText();
      console.log(`Error text: "${text}"`);
    }
  }
});

    Logger.testEnd('TC-REG-GRANTEE-004');
  });



});