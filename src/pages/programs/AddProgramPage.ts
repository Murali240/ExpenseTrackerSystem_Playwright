import { Page, Locator } from '@playwright/test';
import { SharedComponents } from '../base/SharedComponents';
import { Logger } from '../../utils/logger';

/**
 * Add Program Page Object
 * URL: /programs/create/
 *
 * Authenticated via: grantorPage fixture (staff Grantor session)
 * Used in fixtures as: addProgramPage → new AddProgramPage(grantorPage)
 *
 * Layout (from screenshot):
 *
 *  Left sidebar
 *  ┌──────────────────────────┐
 *  │ Program Information      │  ← sidebar tab
 *  │ Details                  │
 *  └──────────────────────────┘
 *
 *  Right panel – "Program Information" dark-navy section header
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  Department: [---Select---] ▼   "Add New Department" link   │
 *  │  Division:   [---Select---] ▼                               │
 *  │  *Fiscal Year: [---Select---] ▼                             │
 *  │                                                             │
 *  │  *Program Code: [________]                                  │
 *  │  *Program Name: [________]                                  │
 *  │   Program Manager: [---Select---] ▼                         │
 *  │                                                             │
 *  │  *Program Budget ($): [$0.00]                               │
 *  │   Program Start Date: [04/16/2026]  (pre-filled today)      │
 *  │   Program End Date:   [________]                            │
 *  │                                                             │
 *  │   Description: [textarea]                                   │
 *  │                                                             │
 *  │            [Submit]  [Cancel]                               │
 *  └─────────────────────────────────────────────────────────────┘
 *
 * Fields marked * are required.
 */
export class AddProgramPage extends SharedComponents {

  constructor(page: Page) {
    super(page);
  }

  /* ═══════════════════════════════════════════════════════════
   * SIDEBAR TAB
   * ═══════════════════════════════════════════════════════════ */

  get programInformationDetailsTab(): Locator {
    return this.page.locator('text=Program Information Details').first();
  }

  /* ═══════════════════════════════════════════════════════════
   * DEPARTMENT ROW
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Department dropdown.
   * Tries id/name attributes first, falls back to first <select> on the page.
   */
  get departmentDropdown(): Locator {
    return this.page
      .locator('select[name="department"], select[id*="department"], select[id*="dept"]')
      .first();
  }

  /** "Add New Department" hyperlink next to the Department label */
  get addNewDepartmentLink(): Locator {
    return this.page.locator('a:has-text("Add New Department")').first();
  }

  /* ═══════════════════════════════════════════════════════════
   * DIVISION DROPDOWN
   * ═══════════════════════════════════════════════════════════ */

  get divisionDropdown(): Locator {
    return this.page
      .locator('select[name="division"], select[id*="division"]')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * FISCAL YEAR DROPDOWN  (required)
   * ═══════════════════════════════════════════════════════════ */

  get fiscalYearDropdown(): Locator {
    return this.page
      .locator('select[name="fiscal_year"], select[id*="fiscal"]')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * PROGRAM CODE  (required)
   * ═══════════════════════════════════════════════════════════ */

  get programCodeInput(): Locator {
    return this.page
      .locator('input[name="program_code"], input[id*="program_code"], input[id*="id_program_code"]')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * PROGRAM NAME  (required)
   * ═══════════════════════════════════════════════════════════ */

  get programNameInput(): Locator {
    return this.page
      .locator('input[name="program_name"], input[id*="program_name"], input[id*="id_program_name"]')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * PROGRAM MANAGER  (optional dropdown)
   * ═══════════════════════════════════════════════════════════ */

  get programManagerDropdown(): Locator {
    return this.page
      .locator('select[name="program_manager"], select[id*="manager"]')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * PROGRAM BUDGET  (required – shows "$0.00" by default)
   * ═══════════════════════════════════════════════════════════ */

  get programBudgetInput(): Locator {
    return this.page
      .locator('input[name="budget"], input[id*="budget"]')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * PROGRAM START DATE  (pre-filled with today's date)
   * ═══════════════════════════════════════════════════════════ */

  get programStartDateInput(): Locator {
    return this.page
      .locator('input[name="start_date"], input[id*="start_date"]')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * PROGRAM END DATE
   * ═══════════════════════════════════════════════════════════ */

  get programEndDateInput(): Locator {
    return this.page
      .locator('input[name="end_date"], input[id*="end_date"]')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * DESCRIPTION TEXTAREA
   * ═══════════════════════════════════════════════════════════ */

  get descriptionTextarea(): Locator {
    return this.page
      .locator('textarea[name="description"], textarea[id*="description"]')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * ACTION BUTTONS
   * ═══════════════════════════════════════════════════════════ */

  get submitButton(): Locator {
    return this.page.locator('button:has-text("Submit")').first();
  }

  get cancelButton(): Locator {
    return this.page.locator('button:has-text("Cancel")').first();
  }

  /* ═══════════════════════════════════════════════════════════
   * ADD NEW DEPARTMENT MODAL
   * ═══════════════════════════════════════════════════════════ */

  /** The Bootstrap modal that opens when "Add New Department" is clicked */
  get addDepartmentModal(): Locator {
    return this.page.locator('.modal:visible').first();
  }

  /** Department name input inside the modal */
  get departmentNameInput(): Locator {
    return this.addDepartmentModal
      .locator('input[name="name"], input[id*="name"], input[placeholder*="Department"]')
      .first();
  }

  /** Save / Submit button inside the modal */
  get departmentModalSaveButton(): Locator {
    return this.addDepartmentModal
      .locator('button:has-text("Save"), button:has-text("Submit"), input[type="submit"]')
      .first();
  }

  /** Cancel / Close button inside the modal */
  get departmentModalCancelButton(): Locator {
    return this.addDepartmentModal
      .locator('button:has-text("Cancel"), button:has-text("Close"), [data-dismiss="modal"]')
      .first();
  }

  /* ═══════════════════════════════════════════════════════════
   * DEPARTMENT ACTIONS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Click "Add New Department" → fill name → save → wait for modal to close.
   * @param departmentName - The name to enter in the modal
   * @returns the same departmentName (for chaining)
   */
  async createNewDepartment(departmentName: string): Promise<string> {
    Logger.step(`Creating new department: "${departmentName}"`);

    await this.clickElement(this.addNewDepartmentLink, 'Add New Department link');
    await this.waitForElement(this.addDepartmentModal);
    Logger.info('Add New Department modal opened');

    await this.fillInput(this.departmentNameInput, departmentName, 'Department Name');
    await this.clickElement(this.departmentModalSaveButton, 'Department modal Save button');
    await this.waitForElementToBeHidden(this.addDepartmentModal);

    Logger.success(`Department created: "${departmentName}"`);
    return departmentName;
  }

  /**
   * Select an existing department from the Department dropdown by label.
   */
  async selectDepartment(departmentName: string): Promise<void> {
    Logger.step(`Selecting existing department: "${departmentName}"`);
    await this.departmentDropdown.waitFor({ state: 'visible' });
    await this.departmentDropdown.selectOption({ label: departmentName });
    Logger.success(`Department selected: "${departmentName}"`);
  }

  /**
   * Select a division from the Division dropdown by label.
   */
  async selectDivision(divisionName: string): Promise<void> {
    Logger.step(`Selecting division: "${divisionName}"`);
    await this.divisionDropdown.waitFor({ state: 'visible' });
    await this.divisionDropdown.selectOption({ label: divisionName });
    Logger.success(`Division selected: "${divisionName}"`);
  }

  /**
   * Select a fiscal year from the Fiscal Year dropdown by label.
   */
  async selectFiscalYear(fiscalYear: string): Promise<void> {
    Logger.step(`Selecting fiscal year: "${fiscalYear}"`);
    await this.fiscalYearDropdown.waitFor({ state: 'visible' });
    await this.fiscalYearDropdown.selectOption({ label: fiscalYear });
    Logger.success(`Fiscal year selected: "${fiscalYear}"`);
  }

  /* ═══════════════════════════════════════════════════════════
   * FIELD-LEVEL FILL METHODS
   * ═══════════════════════════════════════════════════════════ */

  async enterProgramCode(code: string): Promise<void> {
    Logger.info(`Entering program code: ${code}`);
    await this.fillInput(this.programCodeInput, code, 'Program Code');
  }

  async enterProgramName(name: string): Promise<void> {
    Logger.info(`Entering program name: ${name}`);
    await this.fillInput(this.programNameInput, name, 'Program Name');
  }

  async selectProgramManager(managerName: string): Promise<void> {
    Logger.info(`Selecting program manager: ${managerName}`);
    await this.programManagerDropdown.selectOption({ label: managerName });
  }

  async enterProgramBudget(budget: string): Promise<void> {
    Logger.info(`Entering program budget: ${budget}`);
    // Triple-click selects all existing content (e.g. "$0.00") before filling
    await this.programBudgetInput.click({ clickCount: 3 });
    await this.programBudgetInput.fill(budget);
  }

  async enterProgramStartDate(date: string): Promise<void> {
    Logger.info(`Entering start date: ${date}`);
    await this.programStartDateInput.click({ clickCount: 3 });
    await this.programStartDateInput.fill(date);
  }

  async enterProgramEndDate(date: string): Promise<void> {
    Logger.info(`Entering end date: ${date}`);
    await this.fillInput(this.programEndDateInput, date, 'Program End Date');
  }

  async enterDescription(description: string): Promise<void> {
    Logger.info('Entering description');
    await this.fillInput(this.descriptionTextarea, description, 'Description');
  }

  /* ═══════════════════════════════════════════════════════════
   * COMPOSITE FORM-FILL METHODS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Fill only the required fields.
   * @param data - Must include programCode and programName; fiscalYear and programBudget are optional
   */
  async fillRequiredFields(data: {
    programCode: string;
    programName: string;
    fiscalYear?: string;
    programBudget?: string;
  }): Promise<void> {
    Logger.step('Filling required fields only');
    if (data.fiscalYear)    await this.selectFiscalYear(data.fiscalYear);
    await this.enterProgramCode(data.programCode);
    await this.enterProgramName(data.programName);
    if (data.programBudget) await this.enterProgramBudget(data.programBudget);
    Logger.success('Required fields filled');
  }

  /**
   * Fill all fields on the Add Program form.
   *
   * Department handling:
   *   - Pass `createDepartment` to create a new one via the modal first, then select it.
   *   - Pass `department` to select an existing one from the dropdown.
   *   - Pass neither to skip department selection.
   */
  async fillAllFields(data: {
    createDepartment?: string; // create via modal then select
    department?: string;       // select existing from dropdown
    division?: string;
    fiscalYear?: string;
    programCode: string;
    programName: string;
    programManager?: string;
    programBudget?: string;
    programStartDate?: string;
    programEndDate?: string;
    description?: string;
  }): Promise<void> {
    Logger.step('Filling all program form fields');

    // Department handling
    if (data.createDepartment) {
      await this.createNewDepartment(data.createDepartment);
      // After modal closes, select the newly created department from the dropdown
      await this.selectDepartment(data.createDepartment);
    } else if (data.department) {
      await this.selectDepartment(data.department);
    }

    if (data.division)          await this.selectDivision(data.division);
    if (data.fiscalYear)        await this.selectFiscalYear(data.fiscalYear);

    await this.enterProgramCode(data.programCode);
    await this.enterProgramName(data.programName);

    if (data.programManager)    await this.selectProgramManager(data.programManager);
    if (data.programBudget)     await this.enterProgramBudget(data.programBudget);
    if (data.programStartDate)  await this.enterProgramStartDate(data.programStartDate);
    if (data.programEndDate)    await this.enterProgramEndDate(data.programEndDate);
    if (data.description)       await this.enterDescription(data.description);

    Logger.success('All program form fields filled');
  }

  /* ═══════════════════════════════════════════════════════════
   * SUBMIT / CANCEL
   * ═══════════════════════════════════════════════════════════ */

  async clickSubmit(): Promise<void> {
    Logger.step('Clicking Submit button');
    await this.clickElement(this.submitButton, 'Submit button');
    await this.waitForPageLoad();
  }

  async clickCancel(): Promise<void> {
    Logger.step('Clicking Cancel button');
    await this.clickElement(this.cancelButton, 'Cancel button');
    await this.waitForPageLoad();
  }

  /* ═══════════════════════════════════════════════════════════
   * VERIFICATION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Verify that the Add Program page core elements are visible.
   * Call this immediately after navigating to /programs/create/
   */
  async verifyAddProgramPageLoaded(): Promise<void> {
    Logger.step('Verifying Add Program page elements are loaded');
    await this.verifyElementVisible(this.programInformationDetailsTab, 'Program Information Details tab');
    await this.verifyElementVisible(this.addNewDepartmentLink,          'Add New Department link');
    await this.verifyElementVisible(this.programCodeInput,              'Program Code input');
    await this.verifyElementVisible(this.programNameInput,              'Program Name input');
    await this.verifyElementVisible(this.submitButton,                  'Submit button');
    await this.verifyElementVisible(this.cancelButton,                  'Cancel button');
    Logger.success('Add Program page loaded and verified');
  }

  /** Returns the browser-native validation message on the Program Code input */
  async getProgramCodeValidationMessage(): Promise<string> {
    return this.getValidationMessage(this.programCodeInput);
  }

  /** Returns the browser-native validation message on the Program Name input */
  async getProgramNameValidationMessage(): Promise<string> {
    return this.getValidationMessage(this.programNameInput);
  }

  /** Returns true when the Add New Department modal is open */
  async isDepartmentModalOpen(): Promise<boolean> {
    return this.isElementVisible(this.addDepartmentModal, 3000);
  }

  /** Fetches all option labels from the Department dropdown */
  async getDepartmentOptions(): Promise<string[]> {
    return this.departmentDropdown.locator('option').allTextContents();
  }

  /** Fetches all option labels from the Division dropdown */
  async getDivisionOptions(): Promise<string[]> {
    return this.divisionDropdown.locator('option').allTextContents();
  }

  /** Fetches all option labels from the Fiscal Year dropdown */
  async getFiscalYearOptions(): Promise<string[]> {
    return this.fiscalYearDropdown.locator('option').allTextContents();
  }
}