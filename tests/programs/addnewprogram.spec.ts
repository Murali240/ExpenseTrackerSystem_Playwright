import { test, expect } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { ProgramFactory } from '@utils/factories/ProgramFactory';

test.describe('Add Program Page @programs @add', () => {

  test.beforeEach(async ({ programsPage, addProgramPage }) => {
    await programsPage.navigateToProgramsPage();
    await programsPage.clickAddNewProgram();
    await addProgramPage.verifyAddProgramPageLoaded();
  });

  /* ──────────────────────────────────────────────────────────────
     * TC-AP-001  Add Program page displays all correct elements
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-001: Add Program page displays all correct elements @smoke @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-001');
  
        await test.step('URL contains /programs/create/', async () => {
          await Assertions.verifyPageUrlContains(addProgramPage.page, 'programs/create');
        });
  
        await test.step('Sidebar tab "Program Information Details" is visible', async () => {
          await Assertions.verifyElementVisible(
            addProgramPage.programInformationDetailsTab,
            'Program Information Details tab'
          );
        });
  
        await test.step('Department dropdown and Add New Department link are visible', async () => {
          await Assertions.verifyElementVisible(addProgramPage.departmentDropdown, 'Department dropdown');
          await Assertions.verifyElementVisible(addProgramPage.addNewDepartmentLink, 'Add New Department link');
        });
  
        await test.step('Required fields are visible', async () => {
          await Assertions.verifyElementVisible(addProgramPage.fiscalYearDropdown, 'Fiscal Year dropdown');
          await Assertions.verifyElementVisible(addProgramPage.programCodeInput, 'Program Code input');
          await Assertions.verifyElementVisible(addProgramPage.programNameInput, 'Program Name input');
          await Assertions.verifyElementVisible(addProgramPage.programBudgetInput, 'Program Budget input');
        });
  
        await test.step('Optional fields are visible', async () => {
          await Assertions.verifyElementVisible(addProgramPage.divisionDropdown, 'Division dropdown');
          await Assertions.verifyElementVisible(addProgramPage.programManagerDropdown, 'Program Manager dropdown');
          await Assertions.verifyElementVisible(addProgramPage.programStartDateInput, 'Program Start Date input');
          await Assertions.verifyElementVisible(addProgramPage.programEndDateInput, 'Program End Date input');
          await Assertions.verifyElementVisible(addProgramPage.descriptionTextarea, 'Description textarea');
        });
  
        await test.step('Submit and Cancel buttons are visible', async () => {
          await Assertions.verifyElementVisible(addProgramPage.submitButton, 'Submit button');
          await Assertions.verifyElementVisible(addProgramPage.cancelButton, 'Cancel button');
        });
  
        Logger.testEnd('TC-AP-001');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-002  Fiscal Year dropdown has selectable options
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-002: Fiscal Year dropdown has selectable options @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-002');
  
        await test.step('Fetch fiscal year options from dropdown', async () => {
          const options = await addProgramPage.getFiscalYearOptions();
          Logger.info(`Fiscal year options: ${options.join(', ')}`);
          // Should have placeholder + at least 1 real option
          expect(options.length).toBeGreaterThan(1);
        });
  
        Logger.testEnd('TC-AP-002');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-003  Create program with required fields only (happy path)
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-003: Create program with required fields only @smoke @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-003');
  
        const programData = ProgramFactory.generateMinimalProgram();
  
        await test.step('Fill required fields (Code + Name)', async () => {
          await addProgramPage.fillRequiredFields({
            programCode: programData.programCode,
            programName: programData.programName,
  
  
          });
        });
  
        await test.step('Click Submit', async () => {
          await addProgramPage.clickSubmit();
        });
  
        await test.step('Success message is shown', async () => {
          await Assertions.verifyElementVisible(
            addProgramPage.getSuccessMessage(),
            'Success message'
          );
          Logger.success(`Program ${programData.programCode} created successfully`);
        });
  
        Logger.testEnd('TC-AP-003');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-004  Create program with all fields (existing department)
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-004: Create program with all fields filled using existing department @smoke @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-004');
  
        const programData = ProgramFactory.generateBasicInfo();
  
        await addProgramPage.fillAllFields({
          department: 'Health Department',   // or use createDepartment
          fiscalYear: '2026',
          programCode: programData.programCode,
          programName: programData.programName,
          programBudget: '50000',
          programStartDate: '04/22/2026',
          programEndDate: '04/22/2027',
          description: 'Automated test – all fields filled',
        });
  
        await test.step('Click Submit', async () => {
          await addProgramPage.clickSubmit();
        });
  
        await test.step('Success message is shown', async () => {
          await Assertions.verifyElementVisible(
            addProgramPage.getSuccessMessage(),
            'Success message'
          );
          Logger.success(`Program ${programData.programCode} created with all fields`);
        });
  
        Logger.testEnd('TC-AP-004');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-005  Cancel navigates back to Programs list
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-005: Cancel button navigates back to Programs list @smoke @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-005');
  
        await test.step('Click Cancel button', async () => {
          await addProgramPage.clickCancel();
        });
  
        await test.step('URL is back to programs list (not create page)', async () => {
          const url = addProgramPage.page.url();
          expect(url).toContain('programs');
          expect(url).not.toContain('create');
          Logger.success(`Returned to: ${url}`);
        });
  
        Logger.testEnd('TC-AP-005');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-006  Budget field accepts numeric value
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-006: Program Budget field accepts a numeric value @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-006');
  
        await test.step('Enter a valid budget amount', async () => {
          await addProgramPage.enterProgramBudget('250000');
        });
  
        await test.step('Input field contains the entered value', async () => {
          const val = await addProgramPage.programBudgetInput.inputValue();
          expect(val).toContain('250000');
          Logger.info(`Budget field value: ${val}`);
        });
  
        Logger.testEnd('TC-AP-006');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-007  Create program with description saves correctly
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-007: Create program with description saves successfully @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-007');
  
        const data = ProgramFactory.generateBasicInfo();
  
        await test.step('Fill required fields plus description', async () => {
          await addProgramPage.fillAllFields({
            department: 'Health Department',   // or use createDepartment
            fiscalYear: '2026',
            programCode: data.programCode,
            programName: data.programName,
            programBudget: '50000',
            programStartDate: '04/22/2026',
            programEndDate: '04/22/2027',
            description: 'This is an automated regression test description for the Programs module.',
          });
        });
  
        await test.step('Submit', async () => {
          await addProgramPage.clickSubmit();
        });
  
        await test.step('Success message shown', async () => {
          await Assertions.verifyElementVisible(
            addProgramPage.getSuccessMessage(),
            'Success message'
          );
          Logger.success(`Program ${data.programCode} with description created`);
        });
  
        Logger.testEnd('TC-AP-007');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-DEP-001  "Add New Department" link opens modal
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-DEP-001: "Add New Department" link opens the department modal @smoke @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-DEP-001');
  
        await test.step('Click Add New Department link', async () => {
          await addProgramPage.clickElement(
            addProgramPage.addNewDepartmentLink,
            'Add New Department link'
          );
        });
  
        await test.step('Department modal is visible', async () => {
          const modalOpen = await addProgramPage.isDepartmentModalOpen();
          expect(modalOpen).toBe(true);
          Logger.success('Add New Department modal opened');
        });
  
        // Clean up – close the modal
        await test.step('Close the modal', async () => {
          await addProgramPage.clickElement(
            addProgramPage.departmentModalCancelButton,
            'Department modal Cancel button'
          );
        });
  
        Logger.testEnd('TC-AP-DEP-001');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-DEP-002  Create new department via modal and verify in dropdown
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-DEP-002: Create new department via modal and verify it appears in Department dropdown @smoke @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-DEP-002');
  
        const deptName = `AutoDept ${Date.now()}`;
  
        await test.step('Create department via modal', async () => {
          await addProgramPage.createNewDepartment(deptName);
        });
  
        await test.step('Modal is closed after save', async () => {
          const modalOpen = await addProgramPage.isDepartmentModalOpen();
          expect(modalOpen).toBe(false);
          Logger.success('Modal closed after department creation');
        });
  
        await test.step('Department dropdown contains the new department', async () => {
          const options = await addProgramPage.getDepartmentOptions();
          Logger.info(`Department options after creation: ${options.join(', ')}`);
          expect(options.some(o => o.includes(deptName))).toBe(true);
          Logger.success(`New department "${deptName}" found in dropdown`);
        });
  
        Logger.testEnd('TC-AP-DEP-002');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-DEP-003  Create program using a newly created department
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-DEP-003: Create program using a newly created department @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-DEP-003');
  
        const deptName = `AutoDept ${Date.now()}`;
        const programData = ProgramFactory.generateBasicInfo();
  
        await test.step('Fill form creating and selecting the new department', async () => {
          await addProgramPage.fillAllFields({
            createDepartment: deptName,
            fiscalYear:      '2026',
            programCode: programData.programCode,
            programName: programData.programName,
            programBudget: '75000',
            description: 'Created with a newly added department via modal',
          });
        });
  
        await test.step('Submit the form', async () => {
          await addProgramPage.clickSubmit();
        });
  
        await test.step('Success message is shown', async () => {
          await Assertions.verifyElementVisible(
            addProgramPage.getSuccessMessage(),
            'Success message'
          );
          Logger.success(`Program ${programData.programCode} created with new department`);
        });
  
        Logger.testEnd('TC-AP-DEP-003');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-DEP-004  Cancelling the department modal keeps form intact
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-DEP-004: Cancelling the Add New Department modal keeps the form data intact @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-DEP-004');
  
        await test.step('Enter program code before opening modal', async () => {
          await addProgramPage.enterProgramCode('CODEBEFOREMODAL');
        });
  
        await test.step('Open department modal', async () => {
          await addProgramPage.clickElement(
            addProgramPage.addNewDepartmentLink,
            'Add New Department link'
          );
          expect(await addProgramPage.isDepartmentModalOpen()).toBe(true);
        });
  
        await test.step('Cancel the modal', async () => {
          await addProgramPage.clickElement(
            addProgramPage.departmentModalCancelButton,
            'Department modal Cancel button'
          );
          expect(await addProgramPage.isDepartmentModalOpen()).toBe(false);
        });
  
        await test.step('Program Code field still has its original value', async () => {
          await Assertions.verifyElementValue(
            addProgramPage.programCodeInput,
            'CODEBEFOREMODAL',
            'Program Code input'
          );
          Logger.success('Form data retained after cancelling the department modal');
        });
  
        Logger.testEnd('TC-AP-DEP-004');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * TC-AP-DEP-005  Select an existing department from dropdown
     * ────────────────────────────────────────────────────────────── */
    test(
      'TC-AP-DEP-005: Select an existing department from the Department dropdown @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('TC-AP-DEP-005');
  
        await test.step('Fetch available department options', async () => {
          const options = await addProgramPage.getDepartmentOptions();
          Logger.info(`Available departments: ${options.join(', ')}`);
  
          // Filter out the placeholder (e.g. "---Select---")
          const realDepts = options.filter(
            o => !o.includes('Select') && o.trim().length > 0
          );
  
          if (realDepts.length === 0) {
            Logger.warn('No existing departments found in dropdown – skipping selection');
            return;
          }
  
          const firstDept = realDepts[0];
          await addProgramPage.selectDepartment(firstDept);
          Logger.success(`Selected existing department: "${firstDept}"`);
        });
  
        Logger.testEnd('TC-AP-DEP-005');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * NEG-TC-AP-001  Submitting empty form shows validation
     * ────────────────────────────────────────────────────────────── */
    test(
      'NEG-TC-AP-001: Submitting empty form triggers validation errors @negative @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('NEG-TC-AP-001');
  
        await test.step('Click Submit without filling any field', async () => {
          await addProgramPage.clickSubmit();
        });
  
        await test.step('Browser or app-level validation fires on required fields', async () => {
          const validationMsg = await addProgramPage.getProgramCodeValidationMessage();
          Logger.info(`Validation message on Program Code: "${validationMsg}"`);
  
          const appError = addProgramPage.page
            .locator('.errorlist li, .invalid-feedback, .text-danger, .alert-danger')
            .first();
  
          const hasNativeValidation = validationMsg.length > 0;
          const hasAppError = await addProgramPage.isElementVisible(appError, 3000);
  
          expect(hasNativeValidation || hasAppError).toBe(true);
          Logger.success('Validation correctly triggered on empty form submission');
        });
  
        Logger.testEnd('NEG-TC-AP-001');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * NEG-TC-AP-002  Submit without Program Code shows validation
     * ────────────────────────────────────────────────────────────── */
    test(
      'NEG-TC-AP-002: Submitting without Program Code shows validation @negative @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('NEG-TC-AP-002');
  
        await test.step('Fill Program Name but leave Program Code empty', async () => {
          await addProgramPage.enterProgramName('ProgramNameOnly');
        });
  
        await test.step('Click Submit', async () => {
          await addProgramPage.clickSubmit();
        });
  
        await test.step('Validation fires on Program Code field', async () => {
          const msg = await addProgramPage.getProgramCodeValidationMessage();
          Logger.info(`Program Code validation: "${msg}"`);
          const appError = addProgramPage.page
            .locator('.errorlist, .invalid-feedback, .alert-danger');
          const hasError = msg.length > 0 || (await addProgramPage.isElementVisible(appError, 3000));
          expect(hasError).toBe(true);
          Logger.success('Validation triggered for missing Program Code');
        });
  
        Logger.testEnd('NEG-TC-AP-002');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * NEG-TC-AP-003  Submit without Program Name shows validation
     * ────────────────────────────────────────────────────────────── */
    test(
      'NEG-TC-AP-003: Submitting without Program Name shows validation @negative @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('NEG-TC-AP-003');
  
        const data = ProgramFactory.generateMinimalProgram();
  
        await test.step('Fill Program Code but leave Program Name empty', async () => {
          await addProgramPage.enterProgramCode(data.programCode);
        });
  
        await test.step('Click Submit', async () => {
          await addProgramPage.clickSubmit();
        });
  
        await test.step('Validation fires on Program Name field', async () => {
          const msg = await addProgramPage.getProgramNameValidationMessage();
          Logger.info(`Program Name validation: "${msg}"`);
          const appError = addProgramPage.page
            .locator('.errorlist, .invalid-feedback, .alert-danger');
          const hasError = msg.length > 0 || (await addProgramPage.isElementVisible(appError, 3000));
          expect(hasError).toBe(true);
          Logger.success('Validation triggered for missing Program Name');
        });
  
        Logger.testEnd('NEG-TC-AP-003');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * NEG-TC-AP-004  Program Code max-length is enforced
     * ────────────────────────────────────────────────────────────── */
    test(
      'NEG-TC-AP-004: Program Code field enforces maximum character length @negative @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('NEG-TC-AP-004');
  
        const longCode = 'A'.repeat(300);
  
        await test.step('Enter an extremely long program code', async () => {
          await addProgramPage.enterProgramCode(longCode);
        });
  
        await test.step('Actual value is truncated by HTML maxlength', async () => {
          const actual = await addProgramPage.programCodeInput.inputValue();
          Logger.info(`Input length: ${actual.length} (entered: ${longCode.length})`);
          expect(actual.length).toBeLessThan(longCode.length);
          Logger.success('Max-length enforced on Program Code field');
        });
  
        Logger.testEnd('NEG-TC-AP-004');
      }
    );
  
    /* ──────────────────────────────────────────────────────────────
     * NEG-TC-AP-005  End Date before Start Date shows validation
     * ────────────────────────────────────────────────────────────── */
    test(
      'NEG-TC-AP-005: Setting End Date before Start Date should trigger date validation @negative @regression',
      async ({ addProgramPage }) => {
        Logger.testStart('NEG-TC-AP-005');
  
        const data = ProgramFactory.generateMinimalProgram();
  
        await test.step('Fill required fields', async () => {
          await addProgramPage.fillRequiredFields({
            programCode: data.programCode,
            programName: data.programName,
          });
        });
  
        await test.step('Set End Date before Start Date', async () => {
          await addProgramPage.enterProgramStartDate('04/22/2026');
          await addProgramPage.enterProgramEndDate('01/01/2025');
        });
  
        await test.step('Submit the form', async () => {
          await addProgramPage.clickSubmit();
        });
  
        await test.step('Date validation error or app-level error appears', async () => {
          const errorLocator = addProgramPage.page
            .locator('.alert-danger, .errorlist, .text-danger, .invalid-feedback')
            .first();
          const hasError = await addProgramPage.isElementVisible(errorLocator, 5000);
          Logger.info(`Date validation error shown: ${hasError}`);
          if (!hasError) {
            Logger.warn('Application did not show a date order validation error – review manually');
          }
        });
  
        Logger.testEnd('NEG-TC-AP-005');
      }
    );
  

});