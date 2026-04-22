import { Page, Locator } from '@playwright/test';
import { SharedComponents } from '../base/SharedComponents';
import { Logger } from '../../utils/logger';

/**
 * ProgramFundingPage
 *
 * Represents the "Program Funding" sidebar tab inside the Edit Program page.
 * URL stays: /programs/edit_program/<id>/
 *
 * Layout (from screenshots):
 *
 *  Right panel – "Program Funding Source"
 *  ┌──────────────────────────────────────────────────────────────────────────┐
 *  │  Program Funding Source                  Add New Program Funding Source  │
 *  │                                                                          │
 *  │  ┌─────────┬──────────────────────┬──────────────────┬─────────────────┐│
 *  │  │ Actions │ Funding Source  ⇅    │ Funding Date  ⇅  │ Funding Amount($)││
 *  │  ├─────────┼──────────────────────┼──────────────────┼─────────────────┤│
 *  │  │         │ Funding Source       │ Funding Date     │ Funding Amount($)││  ← inline filter row
 *  │  ├─────────┼──────────────────────┼──────────────────┼─────────────────┤│
 *  │  │ ✏️ 👁 🗑 │ Health Funding Source │ 02/18/2026       │        $5,000.00││
 *  │  ├─────────┴──────────────────────┴──────────────────┴─────────────────┤│
 *  │  │                                         Total Amount:      $5,000.00 ││
 *  │  └──────────────────────────────────────────────────────────────────────┘│
 *  │                                                                          │
 *  │  [First] [Previous] [1] [Next] [Last]         10 ▼   Showing 1 To 1...  │
 *  │                                                                          │
 *  │              [Back]  [Next]  [Exit]                                      │
 *  └──────────────────────────────────────────────────────────────────────────┘
 *
 *  Add Program Funding Source modal:
 *  ┌────────────────────────────────────────────────────────────────────┐
 *  │  Add Program Funding Source                                    ×   │
 *  │  *Program:  [FY-26-27 - Health Program          ▼]                 │
 *  │  *Funding Source:  [---Select---                ▼]                 │
 *  │  *Amount($):  [$0.00                              ]                │
 *  │                    [Submit]  [Cancel]                              │
 *  └────────────────────────────────────────────────────────────────────┘
 *
 * Fixture wiring (AuthFixtures.ts — no change needed):
 *   editProgramPage → new EditProgramPage(grantorPage)
 * This page is used inside the same grantorPage session by navigating
 * to the Program Funding sidebar tab from EditProgramPage.
 */
export class ProgramFundingPage extends SharedComponents {

  /* ═══════════════════════════════════════════════════════════
   * PROGRAM FUNDING SOURCE TABLE
   * ═══════════════════════════════════════════════════════════ */

  /** "Program Funding Source" section/panel header */
  readonly panelHeader: Locator;

  /** "Add New Program Funding Source" link (top-right, red text) */
  readonly addNewFundingSourceLink: Locator;

  /** The main data table */
  readonly fundingTable: Locator;

  /* ── Column headers ── */
  readonly actionsColumnHeader: Locator;
  readonly fundingSourceColumnHeader: Locator;
  readonly fundingDateColumnHeader: Locator;
  readonly fundingAmountColumnHeader: Locator;

  /* ── Inline filter inputs (row below column headers) ── */
  readonly fundingSourceFilterInput: Locator;
  readonly fundingDateFilterInput: Locator;
  readonly fundingAmountFilterInput: Locator;

  /** "Total Amount:" footer row inside the table */
  readonly totalAmountLabel: Locator;
  readonly totalAmountValue: Locator;

  /* ── Pagination ── */
  readonly paginationFirstButton: Locator;
  readonly paginationPreviousButton: Locator;
  readonly paginationNextButton: Locator;
  readonly paginationLastButton: Locator;
  readonly paginationInfo: Locator;
  readonly rowsPerPageDropdown: Locator;

  /* ── Tab navigation buttons ── */
  readonly backButton: Locator;
  readonly nextButton: Locator;
  readonly exitButton: Locator;

  /* ═══════════════════════════════════════════════════════════
   * ADD PROGRAM FUNDING SOURCE MODAL
   * ═══════════════════════════════════════════════════════════ */

  readonly addFundingModal: Locator;
  readonly addFundingModalTitle: Locator;

  /**
   * *Program: dropdown (required)
   * Pre-filled with the current program (e.g. "FY-26-27 - Health Program")
   */
  readonly modalProgramDropdown: Locator;

  /**
   * *Funding Source: dropdown (required)
   * Shows "---Select---" by default; lists Master Funding Sources
   */
  readonly modalFundingSourceDropdown: Locator;

  /**
   * *Amount($): numeric input (required)
   * Shows "$0.00" by default
   */
  readonly modalAmountInput: Locator;

  readonly modalSubmitButton: Locator;
  readonly modalCancelButton: Locator;
  readonly modalCloseIcon: Locator;

  /* ═══════════════════════════════════════════════════════════
   * CONSTRUCTOR
   * ═══════════════════════════════════════════════════════════ */

  constructor(page: Page) {
    super(page);

    /* ── Panel header ── */
    this.panelHeader = page
      .locator('h3, h4, h5, .card-header, .panel-heading')
      .filter({ hasText: 'Program Funding Source' })
      .first();

    /* ── "Add New Program Funding Source" link ──
     * From screenshot: top-right red link with text "Add New Program Funding Source"
     * and a tooltip "Create" on hover */
    this.addNewFundingSourceLink = page
      .locator('a.link-btn, a[class*="link"], a')
      .filter({ hasText: 'Add New Program Funding Source' })
      .first();

    /* ── Funding table ── */
    this.fundingTable = page.locator('table').filter({
      has: page.locator('th:has-text("Funding Source")')
    }).first();

    /* ── Column headers ── */
    this.actionsColumnHeader      = page.locator('th:has-text("Actions")').first();
    this.fundingSourceColumnHeader = page.locator('th:has-text("Funding Source")').first();
    this.fundingDateColumnHeader   = page.locator('th:has-text("Funding Date")').first();
    this.fundingAmountColumnHeader = page.locator('th:has-text("Funding Amount")').first();

    /* ── Inline filter inputs ── */
    this.fundingSourceFilterInput = page.locator('input[placeholder="Funding Source"]').first();
    this.fundingDateFilterInput   = page.locator('input[placeholder="Funding Date"]').first();
    this.fundingAmountFilterInput = page.locator('input[placeholder="Funding Amount($)"]').first();

    /* ── Total Amount row ── */
    this.totalAmountLabel = page.locator('td:has-text("Total Amount:")').first();
    this.totalAmountValue = page
      .locator('tr:has(td:has-text("Total Amount:")) td')
      .last();

    /* ── Pagination ── */
    this.paginationFirstButton    = page.locator('a:has-text("First"), button:has-text("First")').first();
    this.paginationPreviousButton = page.locator('button:has-text("Previous"), a:has-text("Previous")').first();
    this.paginationNextButton     = page.locator('button:has-text("Next"), a:has-text("Next")').first();
    this.paginationLastButton     = page.locator('a:has-text("Last"), button:has-text("Last")').first();
    this.paginationInfo           = page.locator('text=/Showing \\d+ To \\d+ Of \\d+ Entries/i').first();
    this.rowsPerPageDropdown      = page.locator('select').last();

    /* ── Tab navigation buttons ── */
    this.backButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
    this.nextButton = page.locator('a:has-text("Next"), button:has-text("Next")').nth(1);
    this.exitButton = page.locator('a:has-text("Exit"), button:has-text("Exit")').first();

    /* ═══ MODAL ═══ */
    this.addFundingModal      = page.locator('.modal:visible').first();
    this.addFundingModalTitle = page
      .locator('.modal-title, .modal-header h5, .modal-header h4')
      .filter({ hasText: 'Add Program Funding Source' })
      .first();

    /* Modal fields – scoped generically since only one modal opens at a time */
    this.modalProgramDropdown = page.locator(
      '.modal select[name*="program"], .modal select[name="program"], .modal select'
    ).first();

    this.modalFundingSourceDropdown = page.locator(
      '.modal select[name*="funding_source"], .modal select[name*="source"], .modal select'
    ).nth(1);

    this.modalAmountInput = page.locator(
      '.modal input[name*="amount"], .modal input[type="number"], .modal input[type="text"]'
    ).first();

    this.modalSubmitButton = page.locator(
      '.modal button:has-text("Submit"), .modal input[type="submit"]'
    ).first();
    this.modalCancelButton = page.locator(
      '.modal button:has-text("Cancel")'
    ).first();
    this.modalCloseIcon = page.locator(
      '.modal .close, .modal button[aria-label="Close"], .modal .btn-close'
    ).first();
  }

  /* ═══════════════════════════════════════════════════════════
   * MODAL ACTION METHODS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Click "Add New Program Funding Source" and wait for the modal.
   */
  async clickAddNewFundingSource(): Promise<void> {
    Logger.step('Clicking "Add New Program Funding Source"');
    await this.clickElement(this.addNewFundingSourceLink, 'Add New Program Funding Source link');
    await this.page.waitForSelector('.modal:visible', { timeout: 10000 });
    Logger.success('Add Program Funding Source modal opened');
  }

  /**
   * Fill and submit the Add Program Funding Source modal.
   * @param fundingSourceLabel – the label to select from the Funding Source dropdown
   * @param amount – string amount, e.g. "5000" (app prefixes "$")
   */
  async fillAndSubmitFundingModal(data: {
    fundingSourceLabel: string;
    amount: string;
  }): Promise<void> {
    Logger.step(`Adding funding source: "${data.fundingSourceLabel}" / $${data.amount}`);

    /* Funding Source dropdown */
    await this.modalFundingSourceDropdown.waitFor({ state: 'visible', timeout: 8000 });
    await this.modalFundingSourceDropdown.selectOption({ label: data.fundingSourceLabel });
    await this.wait(300);

    /* Amount input – triple-click to clear the "$0.00" default */
    await this.modalAmountInput.click({ clickCount: 3 });
    await this.modalAmountInput.fill(data.amount);

    await this.clickElement(this.modalSubmitButton, 'Add Funding Source Submit');
    await this.page.waitForSelector('.modal:visible', { state: 'hidden', timeout: 10000 });
    await this.wait(600); // DataTable refresh
    Logger.success(`Funding source "${data.fundingSourceLabel}" added`);
  }

  /**
   * Cancel the Add Program Funding Source modal.
   */
  async cancelFundingModal(): Promise<void> {
    Logger.step('Cancelling Add Program Funding Source modal');
    await this.clickElement(this.modalCancelButton, 'Cancel button');
    await this.wait(400);
    Logger.success('Modal cancelled');
  }

  /* ═══════════════════════════════════════════════════════════
   * TABLE HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Get a table row by a unique string (funding source name).
   */
  getFundingRow(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}")`).first();
  }

  /**
   * Returns true when a row containing the identifier is visible.
   */
  async isFundingRowVisible(identifier: string): Promise<boolean> {
    return this.isElementVisible(this.getFundingRow(identifier), 5000);
  }

  /**
   * Click the Edit icon (pencil) for a funding source row.
   */
  async clickEditFundingRow(identifier: string): Promise<void> {
    Logger.step(`Clicking Edit for funding row: "${identifier}"`);
    const editIcon = this.getFundingRow(identifier)
      .locator('a[title="Edit"], .fa-edit, [class*="edit"]')
      .first();
    await editIcon.click();
    await this.wait(500);
  }

  /**
   * Click the View icon (eye) for a funding source row.
   */
  async clickViewFundingRow(identifier: string): Promise<void> {
    Logger.step(`Clicking View for funding row: "${identifier}"`);
    const viewIcon = this.getFundingRow(identifier)
      .locator('a[title="View"], .fa-eye, [class*="view"]')
      .first();
    await viewIcon.click();
    await this.wait(500);
  }

  /**
   * Click the Delete icon (trash) for a funding source row.
   */
  async clickDeleteFundingRow(identifier: string): Promise<void> {
    Logger.step(`Clicking Delete for funding row: "${identifier}"`);
    const deleteIcon = this.getFundingRow(identifier)
      .locator('a[title="Delete"], .fa-trash, [class*="delete"]')
      .first();
    await deleteIcon.click();
    await this.wait(500);
  }

  /**
   * Read the Total Amount text shown in the table footer.
   */
  async getTotalAmount(): Promise<string> {
    const text = await this.totalAmountValue.textContent();
    Logger.info(`Total Amount: ${text?.trim()}`);
    return text?.trim() || '';
  }

  /**
   * Read the pagination info text.
   */
  async getPaginationInfo(): Promise<string> {
    const text = await this.paginationInfo.textContent();
    return text?.trim() || '';
  }

  /* ═══════════════════════════════════════════════════════════
   * TAB NAVIGATION
   * ═══════════════════════════════════════════════════════════ */

  async clickBack(): Promise<void> {
    Logger.step('Clicking Back on Program Funding tab');
    await this.clickElement(this.backButton, 'Back button');
    await this.waitForPageLoad();
  }

  async clickNext(): Promise<void> {
    Logger.step('Clicking Next on Program Funding tab');
    await this.clickElement(this.nextButton, 'Next button');
    await this.waitForPageLoad();
  }

  async clickExit(): Promise<void> {
    Logger.step('Clicking Exit on Program Funding tab');
    await this.clickElement(this.exitButton, 'Exit button');
    await this.waitForPageLoad();
  }

  /* ═══════════════════════════════════════════════════════════
   * VERIFICATION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Verify the Program Funding tab panel is loaded correctly.
   * Call this after navigating to the Program Funding sidebar tab.
   */
  async verifyProgramFundingTabLoaded(): Promise<void> {
    Logger.step('Verifying Program Funding tab is loaded');
    await this.verifyElementVisible(this.addNewFundingSourceLink, '"Add New Program Funding Source" link');
    await this.verifyElementVisible(this.fundingTable,            'Funding table');
    await this.verifyElementVisible(this.fundingSourceColumnHeader,'Funding Source column header');
    await this.verifyElementVisible(this.fundingDateColumnHeader,  'Funding Date column header');
    await this.verifyElementVisible(this.fundingAmountColumnHeader,'Funding Amount column header');
    Logger.success('Program Funding tab verified');
  }

  /**
   * Verify the Add Program Funding Source modal fields.
   */
  async verifyAddFundingModalOpen(): Promise<void> {
    Logger.step('Verifying Add Program Funding Source modal');
    await this.verifyElementVisible(this.addFundingModal,              'Modal');
    await this.verifyElementVisible(this.modalProgramDropdown,         '*Program dropdown');
    await this.verifyElementVisible(this.modalFundingSourceDropdown,   '*Funding Source dropdown');
    await this.verifyElementVisible(this.modalAmountInput,             '*Amount($) input');
    await this.verifyElementVisible(this.modalSubmitButton,            'Submit button');
    await this.verifyElementVisible(this.modalCancelButton,            'Cancel button');
    Logger.success('Add Funding Source modal verified');
  }

  /**
   * Verify the modal Program dropdown is pre-filled with the program name.
   */
  async verifyProgramDropdownPreFilled(): Promise<boolean> {
    const value = await this.modalProgramDropdown.inputValue();
    Logger.info(`Modal Program dropdown value: "${value}"`);
    return value.trim().length > 0;
  }

  /**
   * Verify navigation buttons Back / Next / Exit are visible.
   */
  async verifyNavButtonsVisible(): Promise<void> {
    await this.verifyElementVisible(this.backButton, 'Back button');
    await this.verifyElementVisible(this.nextButton, 'Next button');
    await this.verifyElementVisible(this.exitButton, 'Exit button');
  }
}