// tests/auth/organization-registration.spec.ts

import { test, expect } from '@fixtures/AuthFixtures';
import { Logger } from '@utils/logger';

test.describe('Organization Registration @auth @registration @organization', () => {

  test('TC-REG-ORG-001: Register New Organization', async ({ guestPage }) => {
    Logger.testStart('TC-REG-ORG-001: Register New Organization');

    await test.step('Navigate to Organization Registration', async () => {
      // ✅ Using guestPage - no authentication
      await guestPage.goto('/organization/register');
    });

    await test.step('Fill Organization Details', async () => {
      await guestPage.fill('input[name="orgName"]', 'Test Org ' + Date.now());
      await guestPage.fill('input[name="ein"]', '12-3456789');
      await guestPage.fill('input[name="address"]', '123 Test St');
      await guestPage.fill('input[name="city"]', 'Test City');
      await guestPage.selectOption('select[name="state"]', 'CA');
      await guestPage.fill('input[name="zip"]', '12345');
    });

    await test.step('Fill Contact Details', async () => {
      await guestPage.fill('input[name="contactName"]', 'Jane Doe');
      await guestPage.fill('input[name="contactEmail"]', `org-${Date.now()}@test.com`);
      await guestPage.fill('input[name="contactPhone"]', '555-1234');
    });

    await test.step('Fill Account Details', async () => {
      await guestPage.fill('input[name="username"]', `org-${Date.now()}`);
      await guestPage.fill('input[name="password"]', 'Test@123');
      await guestPage.fill('input[name="confirmPassword"]', 'Test@123');
    });

    await test.step('Submit Registration', async () => {
      await guestPage.click('button[type="submit"]');
      await guestPage.waitForURL('**/registration-success');
    });

    await test.step('Verify Success', async () => {
      const successHeader = guestPage.locator('h1:has-text("Registration Successful")');
      await expect(successHeader).toBeVisible();
      Logger.success('Organization registration successful');
    });

    Logger.testEnd('TC-REG-ORG-001');
  });
});