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
        await Assertions.verifyElementVisible(programsPage.firstPageButton, 'First button');
        await Assertions.verifyElementVisible(programsPage.previousPageButton, 'Previous button');
        await Assertions.verifyElementVisible(programsPage.nextPageButton, 'Next button');
        await Assertions.verifyElementVisible(programsPage.lastPageButton, 'Last button');
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
  test(
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

});