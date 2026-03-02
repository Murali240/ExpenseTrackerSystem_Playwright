// tests/auth/individual-registration.spec.ts

import { test, expect } from '@fixtures/AuthFixtures';
import { Logger } from '@utils/logger';

test.describe('Individual Registration @auth @registration @individual', () => {

  test('TC-REG-IND-001: Register New Individual', async ({ individualGuestPage }) => {
    Logger.testStart('TC-REG-IND-001: Register New Individual');

    await individualGuestPage.goto('/individual/register');

    // Fill form
    await individualGuestPage.fill('input[name="firstName"]', 'Alice');
    await individualGuestPage.fill('input[name="lastName"]', 'Smith');
    await individualGuestPage.fill('input[name="email"]', `individual-${Date.now()}@test.com`);
    await individualGuestPage.fill('input[name="phone"]', '555-5678');
    await individualGuestPage.fill('input[name="password"]', 'Test@123');
    await individualGuestPage.fill('input[name="confirmPassword"]', 'Test@123');

    // Submit
    await individualGuestPage.click('button:has-text("Register")');
    await individualGuestPage.waitForLoadState('networkidle');

    // Verify
    const successMessage = individualGuestPage.locator('.success-message');
    await expect(successMessage).toBeVisible();

    Logger.testEnd('TC-REG-IND-001');
  });
});