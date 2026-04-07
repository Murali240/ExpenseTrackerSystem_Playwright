import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { Logger } from '../../utils/logger';
import { ProgramData } from '../../utils/factories/ProgramFactory';

/**
 * Add Program Page Object
 * Handles all interactions on the Add Program page
 */
export class AddProgramPage extends BasePage {
  // Page header
  readonly pageHeader: Locator;
  readonly programInformationTab: Locator;

  // Department section
  readonly departmentDropdown: Locator;
  readonly addNewDepartmentLink: Locator;
  readonly divisionDropdown: Locator;
  readonly fiscalYearDropdown: Locator;

  // Program Information
  readonly programCodeInput: Locator;
  readonly programNameInput: Locator;
  readonly programManagerDropdown: Locator;
  readonly programBudgetInput: Locator;
  readonly programStartDateInput: Locator;
  readonly programEndDateInput: Locator;
  readonly descriptionTextarea: Locator;

  // Action buttons
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  // Required field indicators
  readonly requiredFields: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.pageHeader = page.locator('h1:has-text("Add Program"), h2:has-text("Add Program")');
    this.programInformationTab = page.locator('text=Program Information Details');

    // Department section
    this.departmentDropdown = page.locator('select').first(); // or use more specific selector
    this.addNewDepartmentLink = page.locator('a:has-text("Add New Department")');
    this.divisionDropdown = page.locator('select').nth(1);
    this.fiscalYearDropdown = page.locator('select').nth(2);

    // Program Information fields
    this.programCodeInput = page.locator('input[type="text"]').first();
    this.programNameInput = page.locator('input[type="text"]').nth(1);
    this.programManagerDropdown = page.locator('select').nth(3);
    this.programBudgetInput = page.locator('input[value="$0.00"]');
    this.programStartDateInput = page.locator('input[type="text"][value="02/05/2026"]');
    this.programEndDateInput = page.locator('input[type="text"]').nth(4);
    this.descriptionTextarea = page.locator('textarea');

    // Action buttons
    this.submitButton = page.locator('button:has-text("Submit")');
    this.cancelButton = page.locator('button:has-text("Cancel")');

    // Required fields
    this.requiredFields = page.locator('text=/\\*.*:/');
  }

  /* ==================== Fill Form Methods ==================== */

  /**
   * Fill complete program form
   */
  async fillProgramForm(programData: ProgramData): Promise<void> {
    Logger.step('Filling program form with data');

    // Department section
    if (programData.department) {
      await this.selectDepartment(programData.department);
    }
    if (programData.division) {
      await this.selectDivision(programData.division);
    }
    if (programData.fiscalYear) {
      await this.selectFiscalYear(programData.fiscalYear);
    }

    // Program information
    await this.enterProgramCode(programData.programCode);
    await this.enterProgramName(programData.programName);
    
    if (programData.programManager) {
      await this.selectProgramManager(programData.programManager);
    }
    if (programData.programBudget) {
      await this.enterProgramBudget(programData.programBudget);
    }
    if (programData.programStartDate) {
      await this.enterProgramStartDate(programData.programStartDate);
    }
    if (programData.programEndDate) {
      await this.enterProgramEndDate(programData.programEndDate);
    }
    if (programData.description) {
      await this.enterDescription(programData.description);
    }

    Logger.success('Program form filled successfully');
  }

  /**
   * Fill only required fields
   */
  async fillRequiredFields(programData: Partial<ProgramData>): Promise<void> {
    Logger.step('Filling only required fields');
    
    await this.enterProgramCode(programData.programCode!);
    await this.enterProgramName(programData.programName!);
    
    Logger.success('Required fields filled');
  }

  /* ==================== Individual Field Methods ==================== */

  /**
   * Select department
   */
  async selectDepartment(department: string): Promise<void> {
    Logger.info(`Selecting department: ${department}`);
    await this.selectOption(this.departmentDropdown, department, 'Department');
  }

  /**
   * Select division
   */
  async selectDivision(division: string): Promise<void> {
    Logger.info(`Selecting division: ${division}`);
    await this.selectOption(this.divisionDropdown, division, 'Division');
  }

  /**
   * Select fiscal year
   */
  async selectFiscalYear(year: string): Promise<void> {
    Logger.info(`Selecting fiscal year: ${year}`);
    await this.selectOption(this.fiscalYearDropdown, year, 'Fiscal Year');
  }

  /**
   * Enter program code
   */
  async enterProgramCode(code: string): Promise<void> {
    Logger.info(`Entering program code: ${code}`);
    await this.fillInput(this.programCodeInput, code, 'Program Code');
  }

  /**
   * Enter program name
   */
  async enterProgramName(name: string): Promise<void> {
    Logger.info(`Entering program name: ${name}`);
    await this.fillInput(this.programNameInput, name, 'Program Name');
  }

  /**
   * Select program manager
   */
  async selectProgramManager(manager: string): Promise<void> {
    Logger.info(`Selecting program manager: ${manager}`);
    await this.selectOption(this.programManagerDropdown, manager, 'Program Manager');
  }

  /**
   * Enter program budget
   */
  async enterProgramBudget(budget: string): Promise<void> {
    Logger.info(`Entering program budget: ${budget}`);
    await this.programBudgetInput.clear();
    await this.fillInput(this.programBudgetInput, budget, 'Program Budget');
  }

  /**
   * Enter program start date
   */
  async enterProgramStartDate(date: string): Promise<void> {
    Logger.info(`Entering program start date: ${date}`);
    await this.programStartDateInput.clear();
    await this.fillInput(this.programStartDateInput, date, 'Program Start Date');
  }

  /**
   * Enter program end date
   */
  async enterProgramEndDate(date: string): Promise<void> {
    Logger.info(`Entering program end date: ${date}`);
    await this.fillInput(this.programEndDateInput, date, 'Program End Date');
  }

  /**
   * Enter description
   */
  async enterDescription(description: string): Promise<void> {
    Logger.info('Entering program description');
    await this.fillInput(this.descriptionTextarea, description, 'Description');
  }

  /* ==================== Action Methods ==================== */

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    Logger.step('Clicking Submit button');
    await this.clickElement(this.submitButton, 'Submit button');
    await this.waitForPageLoad();
  }

  /**
   * Click cancel button
   */
  async clickCancel(): Promise<void> {
    Logger.step('Clicking Cancel button');
    await this.clickElement(this.cancelButton, 'Cancel button');
    await this.waitForPageLoad();
  }

  /**
   * Click Add New Department link
   */
  async clickAddNewDepartment(): Promise<void> {
    Logger.step('Clicking Add New Department link');
    await this.clickElement(this.addNewDepartmentLink, 'Add New Department link');
  }

  /* ==================== Complete Actions ==================== */

  /**
   * Create new program with all details
   */
  async createProgram(programData: ProgramData): Promise<void> {
    Logger.testStart(`Creating program: ${programData.programName}`);
    
    await this.fillProgramForm(programData);
    await this.clickSubmit();
    
    Logger.testEnd(`Program created: ${programData.programName}`);
  }

  /**
   * Create program with only required fields
   */
  async createProgramWithRequiredFieldsOnly(programData: Partial<ProgramData>): Promise<void> {
    Logger.testStart(`Creating program with required fields: ${programData.programName}`);
    
    await this.fillRequiredFields(programData);
    await this.clickSubmit();
    
    Logger.testEnd(`Program created: ${programData.programName}`);
  }

  /* ==================== Verification Methods ==================== */

  /**
   * Verify page title
   */
  async verifyPageTitle(): Promise<void> {
    await this.verifyElementVisible(this.pageHeader, 'Add Program header');
  }

  /**
   * Verify required fields are marked
   */
  async verifyRequiredFieldsMarked(): Promise<void> {
    Logger.info('Verifying required fields are marked with asterisk');
    const count = await this.requiredFields.count();
    if (count === 0) {
      Logger.warn('No required fields found marked with asterisk');
    } else {
      Logger.success(`Found ${count} required fields marked`);
    }
  }

  /**
   * Verify Submit button is enabled
   */
  async verifySubmitButtonEnabled(): Promise<void> {
    const isEnabled = await this.submitButton.isEnabled();
    if (isEnabled) {
      Logger.success('Submit button is enabled');
    } else {
      Logger.warn('Submit button is disabled');
    }
  }

  /**
   * Get validation error message
   */
  async getValidationError(): Promise<string | null> {
    const errorLocator = this.page.locator('.error, .invalid-feedback, .text-danger').first();
    if (await this.isElementVisible(errorLocator, 2000)) {
      return await errorLocator.textContent();
    }
    return null;
  }

  /**
   * Verify validation error appears
   */
  async verifyValidationErrorAppears(expectedMessage?: string): Promise<void> {
    const error = await this.getValidationError();
    if (error) {
      Logger.info(`Validation error found: ${error}`);
      if (expectedMessage && error.includes(expectedMessage)) {
        Logger.success('Expected validation error message found');
      }
    } else {
      Logger.warn('No validation error found');
    }
  }
}


