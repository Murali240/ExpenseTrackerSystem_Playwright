import { Page, Locator } from '@playwright/test';
import { SharedComponents } from '../base/SharedComponents';
import { Logger } from '../../utils/logger';
import { AddNewLinkText, PageHeaders } from '@enums/Enums';

/**
 * Programs List Page Object
 * URL: /programs/
 *
 * Authenticated via: grantorPage fixture (staff Grantor session)
 * Used in fixtures as: programsPage → new ProgramsPage(grantorPage)
 *
 * Covers:
 *  - Page header validation
 *  - Add New Program navigation
 *  - Active / Inactive / All radio filters (inherited from SharedComponents)
 *  - Inline search inputs (Program Code / Program Name)
 *  - Row-level action icons (View, Edit, Print, Delete, Toggle)
 *  - Select-all + per-row checkboxes
 *  - Pagination controls (First / Prev / Next / Last + rows-per-page)
 *  - Bulk Delete + Export
 *  - "Showing X To Y Of Z Entries" counter
 */
export class ProgramsPage extends SharedComponents {

  constructor(page: Page) {
    super(page);
  }

  /* ─── Page-level locators (getter pattern) ────────────────── */

  /** "Programs" heading inside the card header — uses SharedComponents.getPageHeader() */
  get programPageHeader(): Locator {
    return this.getPageHeader(PageHeaders.PROGRAMS);
  }

  /** "Add New Program" link — uses SharedComponents.getAddNewlink() */
  get addNewProgramLink(): Locator {
    return this.getAddNewlink(AddNewLinkText.PROGRAM);
  }

  /* ─── Table column headers ────────────────────────────────── */

  get programCodeColumnHeader(): Locator {
    return this.page.locator('th a:has-text("Program Code")').first();
  }

  get programNameColumnHeader(): Locator {
    return this.page.locator('th a:has-text("Program")').first();
  }

  get actionsColumnHeader(): Locator {
    return this.page.locator('th:has-text("Actions")').first();
  }

  /* ─── Select-all checkbox ─────────────────────────────────── */

  get selectAllCheckbox(): Locator {
    return this.page.locator('th:has-text("Select All") input[type="checkbox"]');
  }

  /* ─── Inline search inputs ────────────────────────────────── */

  get programCodeSearchInput(): Locator {
    return this.page.locator('input[placeholder="Program Code"]');
  }

  get programNameSearchInput(): Locator {
    return this.page.locator('input[placeholder="Program"]');
  }

  /* ─── Pagination controls ─────────────────────────────────── */

  get firstPageButton(): Locator {
    return this.page.locator('a:has-text("First")').first();
  }

  get previousPageButton(): Locator {
    return this.page.locator('button:has-text("Previous")').first();
  }

  get nextPageButton(): Locator {
    return this.page.locator('button:has-text("Next")').first();
  }

  get lastPageButton(): Locator {
    return this.page.locator('a:has-text("Last")').first();
  }

  /** "Showing 1 To 10 Of 56 Entries" text */
  get paginationInfo(): Locator {
    return this.page.locator('text=/Showing \\d+ To \\d+ Of \\d+ Entries/i');
  }

  /** Rows-per-page <select> (10 / 25 / 50 …) */
  get rowsPerPageDropdown(): Locator {
    return this.page.locator('select').last();
  }

  /* ─── Bulk-action bar ─────────────────────────────────────── */

  get deleteButton(): Locator {
    return this.page.locator('button:has-text("Delete")');
  }

  get chooseFormatDropdown(): Locator {
    return this.page.locator('select:near(button:has-text("Export"))').first();
  }

  get exportButton(): Locator {
    return this.page.locator('button:has-text("Export")');
  }

  /* ═══════════════════════════════════════════════════════════
   * NAVIGATION METHODS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Navigate to Programs page by clicking the "Programs" top nav menu item.
   * Uses openMenu() from SharedComponents → aria-label based generic locator.
   */
  async navigateToProgramsPage(): Promise<void> {
    Logger.step('Navigating to Programs page via top navigation menu');
    await this.openMenu('Programs');
    await this.page.waitForLoadState('networkidle');
    Logger.success('Programs page loaded');
  }

  /**
   * Click the "Add New Program" link.
   * Navigates to /programs/create/
   */
  async clickAddNewProgram(): Promise<void> {
    Logger.step('Clicking "Add New Program" link');
    await this.clickElement(this.addNewProgramLink, 'Add New Program link');
    await this.waitForPageLoad();
    Logger.success('Navigated to Add Program page');
  }

  /* ═══════════════════════════════════════════════════════════
   * FILTER HELPERS (delegates to SharedComponents)
   * ═══════════════════════════════════════════════════════════ */

  async selectActiveFilter(): Promise<void> {
    await this.selectActiveRadioButton();
  }

  async selectInactiveFilter(): Promise<void> {
    await this.selectInactiveRadioButton();
  }

  async selectAllFilter(): Promise<void> {
    await this.selectAllRadioButton();
  }

  /* ═══════════════════════════════════════════════════════════
   * SEARCH HELPERS
   * ═══════════════════════════════════════════════════════════ */

  async searchByProgramCode(code: string): Promise<void> {
    Logger.step(`Searching by program code: ${code}`);
    await this.fillInput(this.programCodeSearchInput, code, 'Program Code search');
    await this.page.waitForTimeout(800);
  }

  async searchByProgramName(name: string): Promise<void> {
    Logger.step(`Searching by program name: ${name}`);
    await this.fillInput(this.programNameSearchInput, name, 'Program Name search');
    await this.page.waitForTimeout(800);
  }

  async clearSearch(): Promise<void> {
    Logger.step('Clearing search inputs');
    await this.programCodeSearchInput.clear();
    await this.programNameSearchInput.clear();
    await this.page.waitForTimeout(500);
  }

  /* ═══════════════════════════════════════════════════════════
   * ROW-LEVEL LOCATORS
   * ═══════════════════════════════════════════════════════════ */

  /** Returns the first table row that contains the given program code text */
  getProgramRow(programCode: string): Locator {
    return this.page.locator(`tr:has-text("${programCode}")`).first();
  }

  getProgramCheckbox(programCode: string): Locator {
    return this.getProgramRow(programCode).locator('input[type="checkbox"]');
  }

  getProgramViewIcon(programCode: string): Locator {
    return this.getProgramRow(programCode)
      .locator('a[title="View"], .fa-eye')
      .first();
  }

  getProgramEditIcon(programCode: string): Locator {
    return this.getProgramRow(programCode)
      .locator('a[title="Edit"], .fa-edit')
      .first();
  }

  getProgramPrintIcon(programCode: string): Locator {
    return this.getProgramRow(programCode)
      .locator('a[title="Print"], .fa-print')
      .first();
  }

  getProgramDeleteIcon(programCode: string): Locator {
    return this.getProgramRow(programCode)
      .locator('a[title="Delete"], .fa-trash')
      .first();
  }

  getProgramToggleIcon(programCode: string): Locator {
    return this.getProgramRow(programCode)
      .locator('.fa-toggle-on, .fa-toggle-off')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * ROW-LEVEL ACTION METHODS
   * ═══════════════════════════════════════════════════════════ */

  async viewProgram(programCode: string): Promise<void> {
    Logger.step(`Clicking View icon for program: ${programCode}`);
    await this.getProgramViewIcon(programCode).click();
    await this.waitForPageLoad();
    Logger.success(`Opened view for program: ${programCode}`);
  }

  async editProgram(programCode: string): Promise<void> {
    Logger.step(`Clicking Edit icon for program: ${programCode}`);
    await this.getProgramEditIcon(programCode).click();
    await this.waitForPageLoad();
    Logger.success(`Opened edit for program: ${programCode}`);
  }

  async deleteProgramViaIcon(programCode: string): Promise<void> {
    Logger.step(`Clicking Delete icon for program: ${programCode}`);
    await this.getProgramDeleteIcon(programCode).click();
    await this.wait(500);
  }

  async toggleProgramStatus(programCode: string): Promise<void> {
    Logger.step(`Toggling status for program: ${programCode}`);
    await this.getProgramToggleIcon(programCode).click();
    await this.waitForPageLoad();
  }

  async selectProgram(programCode: string): Promise<void> {
    Logger.step(`Selecting checkbox for program: ${programCode}`);
    await this.getProgramCheckbox(programCode).check();
  }

  /* ═══════════════════════════════════════════════════════════
   * PAGINATION ACTION METHODS
   * ═══════════════════════════════════════════════════════════ */

  async goToFirstPage(): Promise<void> {
    Logger.step('Going to first page');
    if (await this.firstPageButton.isEnabled()) {
      await this.firstPageButton.click();
      await this.waitForPageLoad();
      Logger.success('Navigated to first page');
    } else {
      Logger.warn('First button is disabled – already on first page');
    }
  }

  async goToNextPage(): Promise<void> {
    Logger.step('Going to next page');
    if (await this.nextPageButton.isEnabled()) {
      await this.nextPageButton.click();
      await this.waitForPageLoad();
      Logger.success('Navigated to next page');
    } else {
      Logger.warn('Next button is disabled – already on last page');
    }
  }

  async goToPreviousPage(): Promise<void> {
    Logger.step('Going to previous page');
    if (await this.previousPageButton.isEnabled()) {
      await this.previousPageButton.click();
      await this.waitForPageLoad();
      Logger.success('Navigated to previous page');
    } else {
      Logger.warn('Previous button is disabled – already on first page');
    }
  }

  async goToLastPage(): Promise<void> {
    Logger.step('Going to last page');
    if (await this.lastPageButton.isVisible()) {
      await this.lastPageButton.click();
      await this.waitForPageLoad();
      Logger.success('Navigated to last page');
    } else {
      Logger.warn('Last button is disabled – already on last page');
    }
  }

  async setRowsPerPage(value: string): Promise<void> {
    Logger.step(`Setting rows per page to: ${value}`);
    await this.rowsPerPageDropdown.selectOption(value);
    await this.waitForPageLoad();
  }

  /* ═══════════════════════════════════════════════════════════
   * DATA-EXTRACTION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /** Parses "Showing X To Y Of Z Entries" and returns Z (total count) */
  async getTotalProgramCount(): Promise<number> {
    const text = await this.paginationInfo.textContent();
    const match = text?.match(/Of (\d+) Entries/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  /** Returns true when a row containing programCode is visible in the table */
  async isProgramVisible(programCode: string): Promise<boolean> {
    return this.isElementVisible(this.getProgramRow(programCode), 5000);
  }

  /* ═══════════════════════════════════════════════════════════
   * BULK-ACTION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  async selectAllPrograms(): Promise<void> {
    Logger.step('Selecting all programs via Select All checkbox');
    await this.selectAllCheckbox.check();
  }

  async exportPrograms(format: string = 'Excel'): Promise<void> {
    Logger.step(`Exporting programs as: ${format}`);
    await this.chooseFormatDropdown.selectOption(format);
    await this.clickElement(this.exportButton, 'Export button');
  }

  /* ═══════════════════════════════════════════════════════════
   * VERIFICATION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Verifies Programs list page is fully loaded.
   * Called in beforeEach of test suites that need the list page ready.
   */
  async verifyPageLoaded(): Promise<void> {
    Logger.step('Verifying Programs list page is loaded');
    await this.verifyElementVisible(this.programPageHeader, 'Programs page header');
    await this.verifyElementVisible(this.addNewProgramLink, 'Add New Program link');
    Logger.success('Programs list page verified');
  }
}