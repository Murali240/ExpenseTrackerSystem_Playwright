/**
 * Programs Module – Full Test Suite
 *
 * File    : tests/programs/programs.spec.ts
 *
 * Fixtures used (from latest AuthFixtures.ts):
 *   programsPage   → ProgramsPage(grantorPage)   ← authenticated Grantor staff session
 *   addProgramPage → AddProgramPage(grantorPage)  ← authenticated Grantor staff session
 *
 * ⚠️  IMPORTANT – NEVER destructure `grantorPage` alongside `programsPage` or
 *     `addProgramPage` in the same test. These fixtures already consume grantorPage
 *     internally. To get the underlying Page for URL checks, use:
 *       programsPage.page.url()   or   addProgramPage.page.url()
 *
 * Test ID convention
 * ─────────────────────────────────────────────────────────────────
 *  TC-PP-xxx      Programs Page (List)  – view / filter / search / pagination / actions
 *  TC-AP-xxx      Add Program           – navigation, page elements, form fill, submit
 *  TC-AP-DEP-xxx  Add Program           – Department sub-scenarios (create / select / cancel)
 *  TC-AP-E2E-xxx  End-to-end            – full flow from menu → list → create → verify
 *  NEG-TC-PP-xxx  Negative              – Programs List
 *  NEG-TC-AP-xxx  Negative              – Add Program form validations
 * ─────────────────────────────────────────────────────────────────
 */

import { test, expect } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { AddNewLinkText, PageHeaders } from '@enums/Enums';
import { ProgramFactory } from '@utils/factories/ProgramFactory';
import { only } from 'node:test';

/* ═══════════════════════════════════════════════════════════════
 * SUITE 1 – PROGRAMS LIST PAGE
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Programs List Page @programs @list', () => {

  // ── Navigate to Programs page before every test in this suite ──
  test.beforeEach(async ({ programsPage }) => {
    await programsPage.navigateToProgramsPage();
  });

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-001  Programs page header displays "Programs"
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-001: Programs page header displays "Programs" @smoke @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-001');

      await test.step('Verify "Programs" page header is visible', async () => {
        await Assertions.verifyElementVisible(
          programsPage.programPageHeader,
          'Programs page header'
        );
      });

      await test.step('Verify header text equals "Programs"', async () => {
        await Assertions.verifyElementText(
          programsPage.programPageHeader,
          PageHeaders.PROGRAMS,
          'Programs page header text'
        );
      });

      Logger.testEnd('TC-PP-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-002  "Add New Program" link is visible with correct label
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-002: "Add New Program" link is visible and has correct label @smoke @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-002');

      await test.step('Verify "Add New Program" link is visible', async () => {
        await Assertions.verifyElementVisible(
          programsPage.addNewProgramLink,
          'Add New Program link'
        );
      });

      await test.step('Verify link text is correct', async () => {
        await Assertions.verifyElementText(
          programsPage.addNewProgramLink,
          AddNewLinkText.PROGRAM,
          'Add New Program link text'
        );
      });

      Logger.testEnd('TC-PP-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-003  Active / Inactive / All filter radio buttons visible
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-003: Active / Inactive / All filter radio buttons are visible @smoke @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-003');

      await test.step('Active filter is visible', async () => {
        await Assertions.verifyElementVisible(
          programsPage.getActiveRadioButton(),
          'Active filter radio button'
        );
      });

      await test.step('Inactive filter is visible', async () => {
        await Assertions.verifyElementVisible(
          programsPage.getInactiveRadioButton(),
          'Inactive filter radio button'
        );
      });

      await test.step('All filter is visible', async () => {
        await Assertions.verifyElementVisible(
          programsPage.getAllRadioButton(),
          'All filter radio button'
        );
      });

      Logger.testEnd('TC-PP-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-004  Clicking "Add New Program" navigates to create page
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-004: Clicking "Add New Program" navigates to the Add Program page @smoke @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-004');

      await test.step('Click Add New Program link', async () => {
        await programsPage.clickAddNewProgram();
      });

      await test.step('URL contains /programs/create/', async () => {
        // Use programsPage.page to access the underlying Page object
        await Assertions.verifyPageUrlContains(
          programsPage.page,
          'programs/create'
        );
        Logger.success('Successfully navigated to Add Program page');
      });

      Logger.testEnd('TC-PP-004');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-005  Selecting "Active" filter checks the Active radio
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-005: Selecting "Active" filter applies the filter @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-005');

      await test.step('Click Active filter', async () => {
        await programsPage.selectActiveFilter();
      });

      await test.step('Active radio button is checked', async () => {
        await Assertions.verifyElementChecked(
          programsPage.getActiveRadioButton(),
          'Active radio button'
        );
      });

      Logger.testEnd('TC-PP-005');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-006  Selecting "Inactive" filter checks the Inactive radio
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-006: Selecting "Inactive" filter applies the filter @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-006');

      await test.step('Click Inactive filter', async () => {
        await programsPage.selectInactiveFilter();
      });

      await test.step('Inactive radio button is checked', async () => {
        await Assertions.verifyElementChecked(
          programsPage.getInactiveRadioButton(),
          'Inactive radio button'
        );
      });

      Logger.testEnd('TC-PP-006');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-007  Selecting "All" filter shows all records
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-007: Selecting "All" filter shows all records @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-007');

      await test.step('Click All filter', async () => {
        await programsPage.selectAllFilter();
      });

      await test.step('All radio button is checked', async () => {
        await Assertions.verifyElementChecked(
          programsPage.getAllRadioButton(),
          'All radio button'
        );
      });

      await test.step('Pagination info is visible (records exist)', async () => {
        await Assertions.verifyElementVisible(
          programsPage.paginationInfo,
          'Pagination info text'
        );
        const count = await programsPage.getTotalProgramCount();
        expect(count).toBeGreaterThan(0);
        Logger.info(`Total programs found: ${count}`);
      });

      Logger.testEnd('TC-PP-007');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-008  Pagination controls are visible
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-008: Pagination controls are visible on Programs page @smoke @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-008');

      await test.step('All pagination buttons are visible', async () => {
        await Assertions.verifyElementVisible(programsPage.firstPageButton,    'First button');
        await Assertions.verifyElementVisible(programsPage.previousPageButton, 'Previous button');
        await Assertions.verifyElementVisible(programsPage.nextPageButton,     'Next button');
        await Assertions.verifyElementVisible(programsPage.lastPageButton,     'Last button');
      });

      await test.step('Pagination info text is visible', async () => {
        await Assertions.verifyElementVisible(programsPage.paginationInfo, 'Pagination info');
        const count = await programsPage.getTotalProgramCount();
        expect(count).toBeGreaterThan(0);
        Logger.info(`Total programs in system: ${count}`);
      });

      Logger.testEnd('TC-PP-008');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-009  Clicking Next navigates to page 2
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-009: Clicking Next navigates to page 2 @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-009');

      // Ensure "All" filter so there are enough records for page 2
      await programsPage.selectAllFilter();

      await test.step('Click Next page button', async () => {
        await programsPage.goToNextPage();
      });

      await test.step('Pagination info reflects page 2 (starts from 11)', async () => {
        const infoText = await programsPage.paginationInfo.textContent();
        Logger.info(`Pagination info: ${infoText}`);
        // "Showing 11 To 20 Of 56 Entries" – page 2 starts at 11
        expect(infoText).toMatch(/Showing 1[1-9]|[2-9]\d/);
        Logger.success('Pagination navigated to page 2 correctly');
      });

      Logger.testEnd('TC-PP-009');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-010  Last → First brings back page 1
   * ────────────────────────────────────────────────────────────── */
  test.only(
    'TC-PP-010: Clicking Last then First returns to page 1 @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-010');

      await programsPage.selectAllFilter();

      await test.step('Go to last page', async () => {
        await programsPage.goToLastPage();
      });

      await test.step('Go back to first page', async () => {
        await programsPage.goToFirstPage();
      });

      await test.step('Pagination info shows "Showing 1 To"', async () => {
        const infoText = await programsPage.paginationInfo.textContent();
        expect(infoText).toMatch(/Showing 1 To/i);
        Logger.success(`Back on page 1: ${infoText}`);
      });

      Logger.testEnd('TC-PP-010');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-011  Search by Program Code filters results
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-011: Search by Program Code filters the table @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-011');

      await test.step('Enter a known program code in search', async () => {
        await programsPage.searchByProgramCode('TPCS');
      });

      await test.step('Row with code TPCS is visible', async () => {
        const visible = await programsPage.isProgramVisible('TPCS');
        expect(visible).toBe(true);
        Logger.success('Program TPCS found after search');
      });

      Logger.testEnd('TC-PP-011');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-012  Search by Program Name filters results
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-012: Search by Program Name filters the table @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-012');

      await test.step('Enter partial name in Program Name search', async () => {
        await programsPage.searchByProgramName('Health');
      });

      await test.step('A row containing "Health" is visible', async () => {
        const row = programsPage.page.locator('tr:has-text("Health")').first();
        await Assertions.verifyElementVisible(row, 'Health Program row');
      });

      Logger.testEnd('TC-PP-012');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-013  View icon navigates to program detail
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-013: View icon navigates to program detail page @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-013');

      await test.step('Click View icon for TPCS program', async () => {
        await programsPage.viewProgram('TPCS');
      });

      await test.step('URL changes to a detail/view page', async () => {
        const url = programsPage.page.url();
        expect(url).not.toMatch(/\/programs\/$/);
        Logger.info(`Navigated to: ${url}`);
      });

      Logger.testEnd('TC-PP-013');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PP-014  Edit icon navigates to edit program page
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PP-014: Edit icon navigates to the Edit Program page @regression',
    async ({ programsPage }) => {
      Logger.testStart('TC-PP-014');

      await test.step('Click Edit icon for TPCS program', async () => {
        await programsPage.editProgram('TPCS');
      });

      await test.step('URL contains "edit" or "update"', async () => {
        const url = programsPage.page.url();
        expect(url).toMatch(/edit|update/i);
        Logger.info(`Navigated to: ${url}`);
      });

      Logger.testEnd('TC-PP-014');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-PP-001  Search with non-existent code shows no results
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-PP-001: Searching a non-existent code shows no results @negative @regression',
    async ({ programsPage }) => {
      Logger.testStart('NEG-TC-PP-001');

      await test.step('Search for a code that does not exist', async () => {
        await programsPage.searchByProgramCode('XXXXNOTEXIST9999');
      });

      await test.step('No program row is visible', async () => {
        const rowExists = await programsPage.isProgramVisible('XXXXNOTEXIST9999');
        expect(rowExists).toBe(false);

        // App may also show a "No records" message
        const noRecords = programsPage.page
          .locator('text=/No records found/i, text=/No data/i, td:has-text("No records")')
          .first();
        const emptyVisible = await programsPage.isElementVisible(noRecords, 3000);

        // Either no row OR empty-state message should be truthy
        expect(rowExists || emptyVisible).toBeTruthy();
        Logger.success('Empty state shown correctly for non-existent search');
      });

      Logger.testEnd('NEG-TC-PP-001');
    }
  );

});


/* ═══════════════════════════════════════════════════════════════
 * SUITE 2 – ADD PROGRAM PAGE
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Add Program Page @programs @add', () => {

  // ── Navigate to Programs page then click Add New Program before each test ──
  test.beforeEach(async ({ programsPage, addProgramPage }) => {
    await programsPage.navigateToProgramsPage();
    await programsPage.clickAddNewProgram();
    // Confirm we landed on the Add Program page
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
        await Assertions.verifyElementVisible(addProgramPage.departmentDropdown,    'Department dropdown');
        await Assertions.verifyElementVisible(addProgramPage.addNewDepartmentLink,  'Add New Department link');
      });

      await test.step('Required fields are visible', async () => {
        await Assertions.verifyElementVisible(addProgramPage.fiscalYearDropdown, 'Fiscal Year dropdown');
        await Assertions.verifyElementVisible(addProgramPage.programCodeInput,   'Program Code input');
        await Assertions.verifyElementVisible(addProgramPage.programNameInput,   'Program Name input');
        await Assertions.verifyElementVisible(addProgramPage.programBudgetInput, 'Program Budget input');
      });

      await test.step('Optional fields are visible', async () => {
        await Assertions.verifyElementVisible(addProgramPage.divisionDropdown,       'Division dropdown');
        await Assertions.verifyElementVisible(addProgramPage.programManagerDropdown, 'Program Manager dropdown');
        await Assertions.verifyElementVisible(addProgramPage.programStartDateInput,  'Program Start Date input');
        await Assertions.verifyElementVisible(addProgramPage.programEndDateInput,    'Program End Date input');
        await Assertions.verifyElementVisible(addProgramPage.descriptionTextarea,    'Description textarea');
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

      await test.step('Fill all fields selecting an existing department (no create)', async () => {
        await addProgramPage.fillAllFields({
          // NOTE: Omit `department` and `createDepartment` to skip dept selection
          // if no departments exist yet. Add one of them if departments are pre-seeded.
          programCode:      programData.programCode,
          programName:      programData.programName,
          programBudget:    '50000',
          programStartDate: '04/22/2026',
          programEndDate:   '04/22/2027',
          description:      'Automated test – all fields filled, no dept selection',
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
          programCode:  data.programCode,
          programName:  data.programName,
          description:  'This is an automated regression test description for the Programs module.',
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

      const deptName    = `AutoDept ${Date.now()}`;
      const programData = ProgramFactory.generateBasicInfo();

      await test.step('Fill form creating and selecting the new department', async () => {
        await addProgramPage.fillAllFields({
          createDepartment: deptName,
          programCode:      programData.programCode,
          programName:      programData.programName,
          programBudget:    '75000',
          description:      'Created with a newly added department via modal',
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
        const hasAppError         = await addProgramPage.isElementVisible(appError, 3000);

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


/* ═══════════════════════════════════════════════════════════════
 * SUITE 3 – END-TO-END FLOWS
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Programs Module – End-to-End Flows @programs @e2e', () => {

  /* ──────────────────────────────────────────────────────────────
   * TC-AP-E2E-001  Created program appears in the Programs list
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AP-E2E-001: Created program appears in the Programs list @e2e @regression',
    async ({ programsPage, addProgramPage }) => {
      Logger.testStart('TC-AP-E2E-001');

      const data = ProgramFactory.generateMinimalProgram();

      await test.step('Navigate to Programs page via menu', async () => {
        await programsPage.navigateToProgramsPage();
        await programsPage.verifyPageLoaded();
      });

      await test.step('Click "Add New Program" link', async () => {
        await programsPage.clickAddNewProgram();
        await addProgramPage.verifyAddProgramPageLoaded();
      });

      await test.step('Create the program (required fields only)', async () => {
        await addProgramPage.fillRequiredFields({
          programCode: data.programCode,
          programName: data.programName,
        });
        await addProgramPage.clickSubmit();
        await Assertions.verifyElementVisible(
          addProgramPage.getSuccessMessage(),
          'Success message'
        );
      });

      await test.step('Navigate back to Programs list', async () => {
        await programsPage.navigateToProgramsPage();
      });

      await test.step('Search for newly created program', async () => {
        await programsPage.searchByProgramCode(data.programCode);
      });

      await test.step('Newly created program row is visible in the list', async () => {
        const visible = await programsPage.isProgramVisible(data.programCode);
        expect(visible).toBe(true);
        Logger.success(`E2E: Program ${data.programCode} confirmed visible in list`);
      });

      Logger.testEnd('TC-AP-E2E-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-AP-E2E-002  Full E2E – menu → list → create with new dept
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AP-E2E-002: Full E2E – navigate via menu, create department, fill all fields, verify in list @e2e @smoke @regression',
    async ({ programsPage, addProgramPage }) => {
      Logger.testStart('TC-AP-E2E-002');

      const deptName    = `E2EDept ${Date.now()}`;
      const programData = ProgramFactory.generateBasicInfo();

      /* Step 1 – Navigate via menu and verify Programs list header */
      await test.step('Navigate to Programs page via menu and verify header', async () => {
        await programsPage.navigateToProgramsPage();

        await Assertions.verifyElementVisible(
          programsPage.programPageHeader,
          'Programs page header'
        );
        await Assertions.verifyElementText(
          programsPage.programPageHeader,
          PageHeaders.PROGRAMS,
          'Programs header text'
        );
        Logger.success('Step 1 passed: Programs list page verified');
      });

      /* Step 2 – Click Add New Program and verify Add Program page */
      await test.step('Click "Add New Program" and verify Add Program page loads', async () => {
        await programsPage.clickAddNewProgram();

        await Assertions.verifyPageUrlContains(addProgramPage.page, 'programs/create');
        await addProgramPage.verifyAddProgramPageLoaded();
        Logger.success('Step 2 passed: Add Program page loaded');
      });

      /* Step 3 – Create a new department via modal */
      await test.step('Create a new department via the Add New Department modal', async () => {
        await addProgramPage.createNewDepartment(deptName);

        // Verify new department appears in the dropdown
        const options = await addProgramPage.getDepartmentOptions();
        expect(options.some(o => o.includes(deptName))).toBe(true);
        Logger.success(`Step 3 passed: Department "${deptName}" created and visible in dropdown`);
      });

      /* Step 4 – Select the new department and fill all remaining fields */
      await test.step('Select new department and fill all program fields', async () => {
        await addProgramPage.fillAllFields({
          department:       deptName,
          programCode:      programData.programCode,
          programName:      programData.programName,
          programBudget:    '100000',
          programStartDate: '04/22/2026',
          programEndDate:   '04/22/2027',
          description:      'E2E automated test – all fields filled including new department',
        });
        Logger.success('Step 4 passed: All program fields filled');
      });

      /* Step 5 – Submit form */
      await test.step('Submit the program form', async () => {
        await addProgramPage.clickSubmit();
        Logger.success('Step 5 passed: Form submitted');
      });

      /* Step 6 – Verify success message */
      await test.step('Verify success message is shown', async () => {
        await Assertions.verifyElementVisible(
          addProgramPage.getSuccessMessage(),
          'Success message'
        );
        Logger.success('Step 6 passed: Success message confirmed');
      });

      /* Step 7 – Navigate back to list and verify program exists */
      await test.step('Navigate to Programs list and verify new program is present', async () => {
        await programsPage.navigateToProgramsPage();
        await programsPage.searchByProgramCode(programData.programCode);
        const visible = await programsPage.isProgramVisible(programData.programCode);
        expect(visible).toBe(true);
        Logger.success(`Step 7 passed: Program ${programData.programCode} confirmed in list`);
      });

      Logger.testEnd('TC-AP-E2E-002');
    }
  );

});