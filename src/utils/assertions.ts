import { expect, Locator, Page } from '@playwright/test';
import { Logger } from './logger';

/**
 * Custom Assertions Helper
 * Static helpers only — use Assertions.methodName(...) from tests and page objects.
 */
export class Assertions {
  static async isElementVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  static async verifyElementVisible(
    locator: Locator,
    elementName: string,
    timeout: number = 10000
  ): Promise<void> {
    try {
      Logger.info(`Verifying ${elementName} visibility`);
      await expect(locator).toBeVisible({ timeout: 3000 });
      Logger.success(`${elementName} is visible`);
    } catch (error) {
      Logger.error(`${elementName} is not visible`);
      throw error;
    }
  }

  static async verifyElementText(
    locator: Locator,
    expectedText: string,
    elementName: string
  ): Promise<void> {
    Logger.info(`Verifying ${elementName} has text: ${expectedText}`);
    await expect(locator).toHaveText(expectedText);
    Logger.success(`${elementName} has correct text`);
  }

  static async verifyElementContainsText(
    locator: Locator,
    expectedText: string,
    elementName: string
  ): Promise<void> {
    Logger.info(`Verifying ${elementName} contains text: ${expectedText}`);
    await expect(locator).toContainText(expectedText);
    Logger.success(`${elementName} contains correct text`);
  }

  static async verifyElementValue(
    locator: Locator,
    expectedValue: string,
    elementName: string
  ): Promise<void> {
    Logger.info(`Verifying ${elementName} has value: ${expectedValue}`);
    await expect(locator).toHaveValue(expectedValue);
    Logger.success(`${elementName} has correct value`);
  }

  static async verifyElementEnabled(locator: Locator, elementName: string): Promise<void> {
    Logger.info(`Verifying ${elementName} is enabled`);
    await expect(locator).toBeEnabled();
    Logger.success(`${elementName} is enabled`);
  }

  static async verifyElementDisabled(locator: Locator, elementName: string): Promise<void> {
    Logger.info(`Verifying ${elementName} is disabled`);
    await expect(locator).toBeDisabled();
    Logger.success(`${elementName} is disabled`);
  }

  static async verifyPageURL(page: Page, expectedUrl: string | RegExp): Promise<void> {
    Logger.info(`Verifying page URL: ${expectedUrl}`);
    await expect(page).toHaveURL(expectedUrl);
    Logger.success(`Page URL is correct`);
  }

  /** URL substring match (stable for paths without regex escaping pitfalls). */
  static async verifyPageUrlContains(page: Page, urlPart: string): Promise<void> {
    Logger.info(`Verifying page URL contains: ${urlPart}`);
    await expect.poll(() => page.url()).toContain(urlPart);
    Logger.success(`Page URL contains expected segment`);
  }

  static async verifyPageTitle(page: Page, expectedTitle: string | RegExp): Promise<void> {
    Logger.info(`Verifying page title: ${expectedTitle}`);
    await expect(page).toHaveTitle(expectedTitle);
    Logger.success(`Page title is correct`);
  }

  static async verifyElementCount(
    locator: Locator,
    expectedCount: number,
    elementName: string
  ): Promise<void> {
    Logger.info(`Verifying ${elementName} count is ${expectedCount}`);
    await expect(locator).toHaveCount(expectedCount);
    Logger.success(`${elementName} count is correct`);
  }

  static async verifyElementChecked(locator: Locator, elementName: string): Promise<void> {
    Logger.info(`Verifying ${elementName} is checked`);
    await expect(locator).toBeChecked();
    Logger.success(`${elementName} is checked`);
  }

  static async verifyElementNotChecked(locator: Locator, elementName: string): Promise<void> {
    Logger.info(`Verifying ${elementName} is not checked`);
    await expect(locator).not.toBeChecked();
    Logger.success(`${elementName} is not checked`);
  }

  static verifyArrayContains<T>(array: T[], value: T, arrayName: string): void {
    Logger.info(`Verifying ${arrayName} contains: ${value}`);
    expect(array).toContain(value);
    Logger.success(`${arrayName} contains the value`);
  }

  static verifyArraysEqual<T>(actual: T[], expected: T[], arrayName: string): void {
    Logger.info(`Verifying ${arrayName} matches expected array`);
    expect(actual).toEqual(expected);
    Logger.success(`${arrayName} matches expected array`);
  }

  static async softVerifyElementVisible(locator: Locator, elementName: string): Promise<void> {
    try {
      await expect.soft(locator).toBeVisible();
      Logger.success(`Soft assertion passed: ${elementName} is visible`);
    } catch {
      Logger.warn(`Soft assertion failed: ${elementName} is not visible`);
    }
  }
}
