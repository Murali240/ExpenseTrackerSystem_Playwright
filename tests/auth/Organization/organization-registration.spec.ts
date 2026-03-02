// tests/auth/organization-registration.spec.ts

import { test, expect } from '@fixtures/AuthFixtures';
import { Logger } from '@utils/logger';

test.describe('Organization Registration @auth @registration @organization', () => {

  test('TC-REG-ORG-001: Register New Organization', async ({ orgGuestPage }) => {
    Logger.testStart('TC-REG-ORG-001: Register New Organization');

    await test.step('Navigate to Organization Registration', async () => {
      // ✅ Using orgGuestPage - no authentication
      await orgGuestPage.goto('/organization/register');
    });

    await test.step('Fill Organization Details', async () => {
      await orgGuestPage.fill('input[name="orgName"]', 'Test Org ' + Date.now());
      await orgGuestPage.fill('input[name="ein"]', '12-3456789');
      await orgGuestPage.fill('input[name="address"]', '123 Test St');
      await orgGuestPage.fill('input[name="city"]', 'Test City');
      await orgGuestPage.selectOption('select[name="state"]', 'CA');
      await orgGuestPage.fill('input[name="zip"]', '12345');
    });

    await test.step('Fill Contact Details', async () => {
      await orgGuestPage.fill('input[name="contactName"]', 'Jane Doe');
      await orgGuestPage.fill('input[name="contactEmail"]', `org-${Date.now()}@test.com`);
      await orgGuestPage.fill('input[name="contactPhone"]', '555-1234');
    });

    await test.step('Fill Account Details', async () => {
      await orgGuestPage.fill('input[name="username"]', `org-${Date.now()}`);
      await orgGuestPage.fill('input[name="password"]', 'Test@123');
      await orgGuestPage.fill('input[name="confirmPassword"]', 'Test@123');
    });

    await test.step('Submit Registration', async () => {
      await orgGuestPage.click('button[type="submit"]');
      await orgGuestPage.waitForURL('**/registration-success');
    });

    await test.step('Verify Success', async () => {
      const successHeader = orgGuestPage.locator('h1:has-text("Registration Successful")');
      await expect(successHeader).toBeVisible();
      Logger.success('Organization registration successful');
    });

    Logger.testEnd('TC-REG-ORG-001');
  });
});