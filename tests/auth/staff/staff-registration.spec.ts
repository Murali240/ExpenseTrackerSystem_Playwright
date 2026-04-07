import { test, expect } from '@fixtures/AuthFixtures';
import { Logger } from '@utils/logger';

test.describe('Staff Registration @auth @registration @staff', () => {

  test('TC-REG-STAFF-001: Register New Staff User', async ({ guestPage }) => {
    Logger.testStart('TC-REG-STAFF-001: Register New Staff User');

    await test.step('Navigate to Staff Registration Page', async () => {
      // ✅ Using guestPage - no authentication
      await guestPage.goto('/staff/register');
      await guestPage.waitForLoadState('networkidle');
    });

    await test.step('Fill Registration Form', async () => {
      await guestPage.fill('input[name="firstName"]', 'John');
      await guestPage.fill('input[name="lastName"]', 'Doe');
      await guestPage.fill('input[name="email"]', `staff-${Date.now()}@test.com`);
      await guestPage.fill('input[name="password"]', 'Test@123');
      await guestPage.fill('input[name="confirmPassword"]', 'Test@123');
    });

    await test.step('Submit Registration', async () => {
      await guestPage.click('button[type="submit"]');
      await guestPage.waitForLoadState('networkidle');
    });

    await test.step('Verify Success Message', async () => {
      const successMessage = guestPage.locator('.alert-success');
      await expect(successMessage).toBeVisible();
      Logger.success('Staff registration successful');
    });

    Logger.testEnd('TC-REG-STAFF-001');
  });

  test('TC-REG-STAFF-002: Registration Validation - Missing Required Fields', async ({ guestPage }) => {
    Logger.testStart('TC-REG-STAFF-002: Registration Validation');

    await guestPage.goto('/staff/register');

    // ✅ Submit without filling anything
    await guestPage.click('button[type="submit"]');

    // Verify validation errors
    const errorMessages = guestPage.locator('.error-message');
    await expect(errorMessages).toHaveCount(5); // All required fields

    Logger.testEnd('TC-REG-STAFF-002');
  });
});