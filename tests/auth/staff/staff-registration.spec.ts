import { test, expect } from '@fixtures/AuthFixtures';
import { Logger } from '@utils/logger';

test.describe('Staff Registration @auth @registration @staff', () => {

  test('TC-REG-STAFF-001: Register New Staff User', async ({ staffGuestPage }) => {
    Logger.testStart('TC-REG-STAFF-001: Register New Staff User');

    await test.step('Navigate to Staff Registration Page', async () => {
      // ✅ Using staffGuestPage - no authentication
      await staffGuestPage.goto('/staff/register');
      await staffGuestPage.waitForLoadState('networkidle');
    });

    await test.step('Fill Registration Form', async () => {
      await staffGuestPage.fill('input[name="firstName"]', 'John');
      await staffGuestPage.fill('input[name="lastName"]', 'Doe');
      await staffGuestPage.fill('input[name="email"]', `staff-${Date.now()}@test.com`);
      await staffGuestPage.fill('input[name="password"]', 'Test@123');
      await staffGuestPage.fill('input[name="confirmPassword"]', 'Test@123');
    });

    await test.step('Submit Registration', async () => {
      await staffGuestPage.click('button[type="submit"]');
      await staffGuestPage.waitForLoadState('networkidle');
    });

    await test.step('Verify Success Message', async () => {
      const successMessage = staffGuestPage.locator('.alert-success');
      await expect(successMessage).toBeVisible();
      Logger.success('Staff registration successful');
    });

    Logger.testEnd('TC-REG-STAFF-001');
  });

  test('TC-REG-STAFF-002: Registration Validation - Missing Required Fields', async ({ staffGuestPage }) => {
    Logger.testStart('TC-REG-STAFF-002: Registration Validation');

    await staffGuestPage.goto('/staff/register');

    // ✅ Submit without filling anything
    await staffGuestPage.click('button[type="submit"]');

    // Verify validation errors
    const errorMessages = staffGuestPage.locator('.error-message');
    await expect(errorMessages).toHaveCount(5); // All required fields

    Logger.testEnd('TC-REG-STAFF-002');
  });
});