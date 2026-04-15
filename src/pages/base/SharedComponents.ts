import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../../utils/logger';

/**
 * Shared Components Page
 * Contains reusable UI components that appear across multiple pages in your application
 * 
 * Examples: Filters, Search boxes, Pagination, Modals, Alerts
 * 
 * NOTE: This is different from BasePage!
 * - BasePage: Universal methods (click, fill, wait) - works for ANY app
 * - SharedComponents: Your app's reusable UI - specific to ISSI GMS
 */
export class SharedComponents extends BasePage {
  
  constructor(page: Page) {
    super(page);
  }

  /* ==================== Menu Navigation Methods ==================== */

  /**
   * Generic menu locator
   */
  menu(menuName: string): Locator {
    return this.page.locator(`ul.vg-nav-wrapper [aria-label="${menuName}"]`);
  }

  /**
   * Generic sub menu locator
   */
  subMenu(subMenuName: string): Locator {
    return this.page.locator(`.left.show [aria-label="${subMenuName}"]`);
  }

  /**
   * Open a menu
   */
  async openMenu(menuName: string): Promise<void> {
    Logger.info(`Opening menu: ${menuName}`);
    const menuLocator = this.menu(menuName);
    await this.waitForElement(menuLocator);
    await menuLocator.click();
    await this.waitForPageLoad();
  }

  /**
   * Open a sub menu
   */
  async openSubMenu(parent: string, child: string): Promise<void> {
    Logger.info(`Opening submenu: ${parent} > ${child}`);
    await this.openMenu(parent);
    const subMenuLocator = this.subMenu(child);
    await this.waitForElement(subMenuLocator);
    await subMenuLocator.click();
    await this.waitForPageLoad();
  }

  

/* ==================== Headder and Add New Records ==================== */

  getPageHeader(headerText: string): Locator {
    return this.page.locator(`.card-header:has-text("${headerText}") > div`).first();
  }

  getAddNewlink(linkText: string): Locator {
    return this.page.locator(`a.link-btn:has-text("${linkText}")`).first();
  }


 /* ==================== STATUS FILTER RADIO BUTTONS ==================== */
  
  /**
   * Get Active/Inactive/All filter radio buttons
   * These appear on: Programs, Grants, Applications, Funding Sources pages
   */
  
   getActiveRadioButton(): Locator {
    return this.page.locator('input[value="Active" i]:visible').first();
  }

   getInactiveRadioButton(): Locator {
    return this.page.locator('input[value="Inactive" i]:visible').first();
  }

  getAllRadioButton(): Locator {
    return this.page.locator('input[value="All" i]:visible').first();
  }

  /**
   * Generic method to get any filter radio button
   */
  getFilterRadioButton(filterValue: string): Locator {
    return this.page.locator(`input[value="${filterValue}" i]:visible`).first();
  }

  /**
   * Select Active filter (reusable across pages)
   */
  async selectActiveRadioButton(): Promise<void> {
    Logger.info('Selecting Active filter');
    await this.getActiveRadioButton().check();
    await this.waitForPageLoad();
    Logger.success('Active filter selected');
  }

  /**
   * Select Inactive filter (reusable across pages)
   */
  async selectInactiveRadioButton(): Promise<void> {
    Logger.info('Selecting Inactive filter');
    await this.getInactiveRadioButton().check();
    await this.waitForPageLoad();
    Logger.success('Inactive filter selected');
  }

  /**
   * Select All filter (reusable across pages)
   */
  async selectAllRadioButton(): Promise<void> {
    Logger.info('Selecting All filter');
    await this.getAllRadioButton().check();
    await this.waitForPageLoad();
    Logger.success('All filter selected');
  }

  /**
   * Get selected filter value
   */
  async getSelectedFilter(): Promise<string> {
    const activeChecked = await this.getActiveRadioButton().isChecked();
    if (activeChecked) return 'Active';

    const inactiveChecked = await this.getInactiveRadioButton().isChecked();
    if (inactiveChecked) return 'Inactive';

    return 'All';
  }

  /* ==================== PAGINATION ==================== */
  
  /**
   * Pagination controls (appear on most list pages)
   */
  getNextPageButton(): Locator {
    return this.page.locator('button:has-text("Next"), a:has-text("Next")').first();
  }

  getPreviousPageButton(): Locator {
    return this.page.locator('button:has-text("Previous"), a:has-text("Previous")').first();
  }

  getFirstPageButton(): Locator {
    return this.page.locator('button:has-text("First"), a:has-text("First")').first();
  }

  getLastPageButton(): Locator {
    return this.page.locator('button:has-text("Last"), a:has-text("Last")').first();
  }

  /**
   * Go to next page
   */
  async goToNextPage(): Promise<void> {
    Logger.info('Clicking Next page button');
    const nextButton = this.getNextPageButton();
    
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await this.waitForPageLoad();
      Logger.success('Navigated to next page');
    } else {
      Logger.warn('Next button is disabled - already on last page');
    }
  }

  /**
   * Go to previous page
   */
  async goToPreviousPage(): Promise<void> {
    Logger.info('Clicking Previous page button');
    const prevButton = this.getPreviousPageButton();
    
    if (await prevButton.isEnabled()) {
      await prevButton.click();
      await this.waitForPageLoad();
      Logger.success('Navigated to previous page');
    } else {
      Logger.warn('Previous button is disabled - already on first page');
    }
  }

  /**
   * Go to first page
   */
  async goToFirstPage(): Promise<void> {
    Logger.info('Clicking First page button');
    const firstButton = this.getFirstPageButton();
    
    if (await firstButton.isEnabled()) {
      await firstButton.click();
      await this.waitForPageLoad();
      Logger.success('Navigated to first page');
    } else {
      Logger.warn('First button is disabled - already on first page');
    }
  }

  /**
   * Go to last page
   */
  async goToLastPage(): Promise<void> {
    Logger.info('Clicking Last page button');
    const lastButton = this.getLastPageButton();
    
    if (await lastButton.isEnabled()) {
      await lastButton.click();
      await this.waitForPageLoad();
      Logger.success('Navigated to last page');
    } else {
      Logger.warn('Last button is disabled - already on last page');
    }
  }

  /* ==================== ACTION ICONS ==================== */
  
  /**
   * Generic action icons (Edit, View, Delete, Copy)
   * These appear in table rows across multiple pages
   */
  getEditIcon(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}") .fa-edit, tr:has-text("${identifier}") a[title="Edit"]`).first();
  }

  getViewIcon(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}") .fa-eye, tr:has-text("${identifier}") a[title="View"]`).first();
  }

  getDeleteIcon(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}") .fa-trash, tr:has-text("${identifier}") a[title="Delete"]`).first();
  }

  getCopyIcon(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}") .fa-copy, tr:has-text("${identifier}") a[title="Copy"]`).first();
  }

  /**
   * Click edit icon for a row
   */
  async clickEditIcon(identifier: string): Promise<void> {
    Logger.info(`Clicking Edit icon for: ${identifier}`);
    await this.getEditIcon(identifier).click();
    await this.waitForPageLoad();
    Logger.success(`Clicked Edit icon for: ${identifier}`);
  }

  /**
   * Click view icon for a row
   */
  async clickViewIcon(identifier: string): Promise<void> {
    Logger.info(`Clicking View icon for: ${identifier}`);
    await this.getViewIcon(identifier).click();
    await this.waitForPageLoad();
    Logger.success(`Clicked View icon for: ${identifier}`);
  }

  /**
   * Click delete icon for a row
   */
  async clickDeleteIcon(identifier: string): Promise<void> {
    Logger.info(`Clicking Delete icon for: ${identifier}`);
    await this.getDeleteIcon(identifier).click();
    await this.wait(500);
    Logger.success(`Clicked Delete icon for: ${identifier}`);
  }

  /**
   * Click copy icon for a row
   */
  async clickCopyIcon(identifier: string): Promise<void> {
    Logger.info(`Clicking Copy icon for: ${identifier}`);
    await this.getCopyIcon(identifier).click();
    await this.waitForPageLoad();
    Logger.success(`Clicked Copy icon for: ${identifier}`);
  }

  /* ==================== MODAL/DIALOG ==================== */
  
  /**
   * Common modal/dialog elements
   */
  getModal(): Locator {
    return this.page.locator('.modal:visible, .dialog:visible').first();
  }

  getModalTitle(): Locator {
    return this.getModal().locator('.modal-title, .dialog-title, h2, h3').first();
  }

  getModalOkButton(): Locator {
    return this.getModal().locator('button:has-text("OK"), button:has-text("Yes"), button:has-text("Confirm")').first();
  }

  getModalCancelButton(): Locator {
    return this.getModal().locator('button:has-text("Cancel"), button:has-text("No")').first();
  }

  /**
   * Click OK on modal
   */
  async clickModalOk(): Promise<void> {
    Logger.info('Clicking OK on modal');
    await this.getModalOkButton().click();
    await this.wait(500);
    Logger.success('Clicked OK on modal');
  }

  /**
   * Click Cancel on modal
   */
  async clickModalCancel(): Promise<void> {
    Logger.info('Clicking Cancel on modal');
    await this.getModalCancelButton().click();
    await this.wait(500);
    Logger.success('Clicked Cancel on modal');
  }

  /**
   * Verify modal appears with specific title
   */
  async verifyModalAppears(expectedTitle: string): Promise<void> {
    Logger.info(`Verifying modal with title: ${expectedTitle}`);
    await this.verifyElementVisible(this.getModal(), 'Modal');
    await this.verifyElementText(this.getModalTitle(), expectedTitle, 'Modal title');
  }

  /* ==================== ALERTS/MESSAGES ==================== */
  
  /**
   * Common alert/message elements
   */
  getSuccessMessage(): Locator {
  return this.page.locator('.swal2-html-container').first();
}

  getErrorMessage(): Locator {
    return this.page.locator('.alert-danger, .error-message, .toast-error, .alert-error').first();
  }

  getWarningMessage(): Locator {
    return this.page.locator('.alert-warning, .warning-message, .toast-warning').first();
  }

  getInfoMessage(): Locator {
    return this.page.locator('.alert-info, .info-message, .toast-info').first();
  }

  /**
   * Get Validation message text
   */
  async getValidationMessage(locator: Locator): Promise<string> {
  return await locator.evaluate((el) => {
    return (el as HTMLInputElement).validationMessage;
  });
}

  /**
   * Get success message text
   */
  async getSuccessMessageText(): Promise<string | null> {
    if (await this.isElementVisible(this.getSuccessMessage(), 3000)) {
      return await this.getSuccessMessage().textContent();
    }
    return null;
  }

  /**
   * Get error message text
   */
  async getErrorMessageText(): Promise<string | null> {
    if (await this.isElementVisible(this.getErrorMessage(), 3000)) {
      return await this.getErrorMessage().textContent();
    }
    return null;
  }

  /**
   * Verify success message appears
   */
  async verifySuccessMessage(expectedMessage?: string): Promise<void> {
    Logger.info('Verifying success message appears');
    await this.verifyElementVisible(this.getSuccessMessage(), 'Success message');
    
    if (expectedMessage) {
      const actualMessage = await this.getSuccessMessageText();
      if (actualMessage && actualMessage.includes(expectedMessage)) {
        Logger.success(`Success message contains: ${expectedMessage}`);
      } else {
        Logger.warn(`Expected message not found. Actual: ${actualMessage}`);
      }
    }
  }

  /* ==================== TABLE HELPERS ==================== */
  
  /**
   * Get table row by identifier (code, name, etc.)
   */
  getTableRow(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}")`).first();
  }

  /**
   * Verify row exists in table
   */
  async verifyRowExists(identifier: string): Promise<boolean> {
    Logger.info(`Verifying row exists: ${identifier}`);
    const exists = await this.isElementVisible(this.getTableRow(identifier), 5000);
    
    if (exists) {
      Logger.success(`Row found: ${identifier}`);
    } else {
      Logger.warn(`Row not found: ${identifier}`);
    }
    
    return exists;
  }

  /**
   * Get cell value from table row
   */
  async getCellValue(rowIdentifier: string, columnIndex: number): Promise<string> {
    const row = this.getTableRow(rowIdentifier);
    const cell = row.locator('td').nth(columnIndex);
    return await cell.textContent() || '';
  }

  /* ==================== LOADING INDICATORS ==================== */
  
  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoadingToComplete(): Promise<void> {
    Logger.info('Waiting for loading to complete');
    const loadingSpinner = this.page.locator('.spinner, .loading, .loader').first();
    
    try {
      await loadingSpinner.waitFor({ state: 'hidden', timeout: 30000 });
      Logger.success('Loading complete');
    } catch {
      Logger.info('No loading spinner found or already hidden');
    }
  }

  /* ==================== PAGE VERIFICATION ==================== */
  
  /**
   * Verify page is loaded (can be overridden in specific pages)
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForPageLoad();
    Logger.success('Page loaded successfully');
  }
}