import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../../utils/logger';

export class SharedComponents extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  /* ==================== HEADER & ADD NEW ==================== */

  getPageHeader(headerText: string): Locator {
    return this.page.locator(`.card-header:has-text("${headerText}") > div`).first();
  }

  getAddNewlink(linkText: string): Locator {
    return this.page.locator(`a.link-btn:has-text("${linkText}")`).first();
  }

  /* ==================== STATUS FILTER ==================== */

  getActiveRadioButton(): Locator {
    return this.page.locator('input[value="Active" i]:visible').first();
  }

  getInactiveRadioButton(): Locator {
    return this.page.locator('input[value="Inactive" i]:visible').first();
  }

  getAllRadioButton(): Locator {
    return this.page.locator('input[value="All" i]:visible').first();
  }

  async selectActiveRadioButton(): Promise<void> {
    await this.getActiveRadioButton().check();
    await this.waitForPageLoad();
  }

  async selectInactiveRadioButton(): Promise<void> {
    await this.getInactiveRadioButton().check();
    await this.waitForPageLoad();
  }

  async selectAllRadioButton(): Promise<void> {
    await this.getAllRadioButton().check();
    await this.waitForPageLoad();
  }

  async getSelectedFilter(): Promise<string> {
    if (await this.getActiveRadioButton().isChecked()) return 'Active';
    if (await this.getInactiveRadioButton().isChecked()) return 'Inactive';
    return 'All';
  }

  /* ==================== PAGINATION ==================== */

  getNextPageButton(): Locator {
    return this.page.locator('button:has-text("Next"), a:has-text("Next")').first();
  }

  getPreviousPageButton(): Locator {
    return this.page.locator('button:has-text("Previous"), a:has-text("Previous")').first();
  }

  async goToNextPage(): Promise<void> {
    const btn = this.getNextPageButton();
    if (await btn.isEnabled()) {
      await btn.click();
      await this.waitForPageLoad();
    }
  }

  async goToPreviousPage(): Promise<void> {
    const btn = this.getPreviousPageButton();
    if (await btn.isEnabled()) {
      await btn.click();
      await this.waitForPageLoad();
    }
  }

  /* ==================== ACTION ICONS ==================== */

  getEditIcon(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}") a[title="Edit"]`).first();
  }

  getViewIcon(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}") a[title="View"]`).first();
  }

  getDeleteIcon(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}") a[title="Delete"]`).first();
  }

  async clickEditIcon(identifier: string): Promise<void> {
    await this.getEditIcon(identifier).click();
    await this.waitForPageLoad();
  }

  async clickViewIcon(identifier: string): Promise<void> {
    await this.getViewIcon(identifier).click();
    await this.waitForPageLoad();
  }

  async clickDeleteIcon(identifier: string): Promise<void> {
    await this.getDeleteIcon(identifier).click();
    await this.wait(500);
  }

  /* ==================== MODAL ==================== */

  getModal(): Locator {
    return this.page.locator('.modal:visible').first();
  }

  getModalOkButton(): Locator {
    return this.getModal().locator('button:has-text("OK"), button:has-text("Yes")').first();
  }

  async clickModalOk(): Promise<void> {
    await this.getModalOkButton().click();
  }

  /* ==================== ALERTS ==================== */

  getSuccessMessage(): Locator {
    return this.page.locator('.swal2-html-container').first();
  }

  async getSuccessMessageText(): Promise<string | null> {
    const messageLocator = this.getSuccessMessage();

    if (await this.isElementVisible(messageLocator, 5000)) {
      return (await messageLocator.textContent())?.trim() || null;
    }

    return null;
  }

  async verifySuccessMessage(): Promise<void> {
    await this.verifyElementVisible(this.getSuccessMessage(), 'Success message');
  }

  /* ==================== TABLE ==================== */

  getTableRow(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}")`).first();
  }

  async verifyRowExists(identifier: string): Promise<boolean> {
    return await this.isElementVisible(this.getTableRow(identifier), 5000);
  }

  /* ==================== LOADING ==================== */

  async waitForLoadingToComplete(): Promise<void> {
    const spinner = this.page.locator('.spinner, .loading');

    try {
      await spinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      Logger.info('No spinner or already hidden');
    }
  }

  /* ==================== DROPDOWN ==================== */

/* ==================== DROPDOWN ==================== */

async selectDropdownOption(
  dropdown: Locator,
  option: string | number,
  fieldName: string
): Promise<void> {

  await this.clickElement(dropdown, fieldName);

  // ✅ Handle native <select>
  const tagName = await dropdown.evaluate(el => el.tagName.toLowerCase());

  if (tagName === 'select') {
    if (typeof option === 'number') {
      await dropdown.selectOption({ index: option });
    } else {
      await dropdown.selectOption({ label: option });
    }
    return;
  }

  // ✅ Handle custom dropdown
  const options = this.page.locator('.chosen-results li:visible, .dropdown-menu li:visible');

  if (typeof option === 'number') {
    await options.nth(option).click();
  } else {
    await options.filter({ hasText: option }).first().click();
  }
}

}




