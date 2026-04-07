// tests/auth/individual-registration.spec.ts

import { test, expect } from '@fixtures/AuthFixtures';
import { Logger } from '@utils/logger';

test.describe('Individual Registration @auth @registration @individual', () => {

  test('TC-REG-IND-001: Register New Individual', async ({ guestPage }) => {
    Logger.testStart('TC-REG-IND-001: Register New Individual');

    await guestPage.goto('/individual/register');

    // Fill form
    await guestPage.fill('input[name="firstName"]', 'Alice');
    await guestPage.fill('input[name="lastName"]', 'Smith');
    await guestPage.fill('input[name="email"]', `individual-${Date.now()}@test.com`);
    await guestPage.fill('input[name="phone"]', '555-5678');
    await guestPage.fill('input[name="password"]', 'Test@123');
    await guestPage.fill('input[name="confirmPassword"]', 'Test@123');

    // Submit
    await guestPage.click('button:has-text("Register")');
    await guestPage.waitForLoadState('networkidle');

    // Verify
    const successMessage = guestPage.locator('.success-message');
    await expect(successMessage).toBeVisible();

    Logger.testEnd('TC-REG-IND-001');
  });
});