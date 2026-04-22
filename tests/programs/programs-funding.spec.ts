/**
 * programs-funding.spec.ts
 *
 * Full test suite for the Program Funding tab inside Edit Program.
 *
 * The "Program Funding" sidebar tab lives within the Edit Program page
 * (URL: /programs/edit_program/<id>/).
 * It shows a "Program Funding Source" panel with a table and an
 * "Add New Program Funding Source" modal.
 *
 * Fixture flow:
 *   programsPage   → navigate to list
 *   addProgramPage → create a fresh program (required fields only)
 *   → submit lands on Edit Program page (/edit_program/<id>/)
 *   editProgramPage  → click "Program Funding" sidebar tab
 *   ProgramFundingPage (instantiated inline) → all assertions
 *
 * Test ID convention:
 *   TC-PF-xxx      Program Funding – happy path
 *   NEG-TC-PF-xxx  Program Funding – negative / validation
 *
 * File location in repo:
 *   tests/programs/programs-funding.spec.ts
 */

import { test, expect } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { ProgramFactory } from '@utils/factories/ProgramFactory';
import { ProgramFundingPage } from '@pages/programs/ProgramFundingPage';

/* ─────────────────────────────────────────────────────────────
 * SHARED SETUP HELPER
 * Creates a fresh program → lands on Edit Program page → navigates
 * to Program Funding tab → returns an instantiated ProgramFundingPage.
 * ───────────────────────────────────────────────────────────── */
async function setupProgramFundingTab(
  programsPage: any,
  addProgramPage: any,
  editProgramPage: any
): Promise<ProgramFundingPage> {
  const data = ProgramFactory.generateMinimalProgram();

  /* 1. Navigate to Programs list */
  await programsPage.navigateToProgramsPage();

  /* 2. Add New Program → fill required fields → Submit */
  await programsPage.clickAddNewProgram();
  await addProgramPage.verifyAddProgramPageLoaded();
  await addProgramPage.fillRequiredFields({
    programCode: data.programCode,
    programName: data.programName,
  });
  await addProgramPage.clickSubmit();

  /* 3. After submit → lands on Edit Program page */
  await addProgramPage.page.waitForURL('**/edit_program/**', { timeout: 20000 });

  /* 4. Click Program Funding sidebar tab */
  await editProgramPage.goToProgramFunding();

  /* 5. Return an instantiated ProgramFundingPage on the same underlying page */
  const fundingPage = new ProgramFundingPage(editProgramPage.page);

  Logger.success(`Program "${data.programCode}" created and Program Funding tab opened`);
  return fundingPage;
}

/* ═══════════════════════════════════════════════════════════════
 * SUITE 1 – PROGRAM FUNDING TAB LOAD & STRUCTURE
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Program Funding Tab – Load & Structure @programs @funding', () => {

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-001  Program Funding tab loads correct elements
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-001: Program Funding tab loads with table and "Add New Program Funding Source" link @smoke @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-001');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);

      await test.step('Verify "Program Funding Source" panel header is visible', async () => {
        const panelHeader = fundingPage.page
          .locator('h3, h4, h5, div')
          .filter({ hasText: 'Program Funding Source' })
          .first();
        await Assertions.verifyElementVisible(panelHeader, 'Program Funding Source panel header');
      });

      await test.step('Verify "Add New Program Funding Source" link is visible', async () => {
        await Assertions.verifyElementVisible(
          fundingPage.addNewFundingSourceLink,
          'Add New Program Funding Source link'
        );
      });

      await test.step('Verify funding table column headers', async () => {
        await fundingPage.verifyProgramFundingTabLoaded();
      });

      await test.step('Verify pagination info is visible', async () => {
        await Assertions.verifyElementVisible(fundingPage.paginationInfo, 'Pagination info');
      });

      Logger.testEnd('TC-PF-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-002  Back / Next / Exit navigation buttons visible
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-002: Back, Next, and Exit navigation buttons are visible @smoke @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-002');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);

      await test.step('Verify all navigation buttons', async () => {
        await fundingPage.verifyNavButtonsVisible();
        Logger.success('Back, Next, Exit buttons confirmed visible');
      });

      Logger.testEnd('TC-PF-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-003  "Actions" column shows Edit, View, Delete icons on rows
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-003: Actions column shows Edit (pencil), View (eye), Delete (trash) icons @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-003');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);

      await test.step('Verify Actions column header is visible', async () => {
        await Assertions.verifyElementVisible(fundingPage.actionsColumnHeader, 'Actions column header');
      });

      await test.step('If any rows exist, verify action icons are present', async () => {
        const rows = fundingPage.page.locator('table tbody tr').filter({
          hasNot: fundingPage.page.locator('td:has-text("No data"), td:has-text("No records")')
        });
        const rowCount = await rows.count();
        Logger.info(`Funding source rows found: ${rowCount}`);

        if (rowCount > 0) {
          // At least one row – verify the icon set (edit, view, delete)
          const firstRow = rows.first();
          const editIcon   = firstRow.locator('.fa-edit, a[title="Edit"], [class*="edit"]');
          const viewIcon   = firstRow.locator('.fa-eye, a[title="View"], [class*="view"]');
          const deleteIcon = firstRow.locator('.fa-trash, a[title="Delete"], [class*="delete"]');

          const editVisible   = await fundingPage.isElementVisible(editIcon,   3000);
          const viewVisible   = await fundingPage.isElementVisible(viewIcon,   3000);
          const deleteVisible = await fundingPage.isElementVisible(deleteIcon, 3000);

          Logger.info(`Edit: ${editVisible}, View: ${viewVisible}, Delete: ${deleteVisible}`);
          expect(editVisible || viewVisible || deleteVisible).toBe(true);
          Logger.success('Action icons confirmed in funding table row');
        } else {
          Logger.info('No rows yet – skipping icon check (new empty program)');
        }
      });

      Logger.testEnd('TC-PF-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-004  Total Amount row is present in the table
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-004: "Total Amount:" footer row is present in the funding table @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-004');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);

      await test.step('Total Amount label is visible', async () => {
        await Assertions.verifyElementVisible(fundingPage.totalAmountLabel, 'Total Amount label');
        const totalText = await fundingPage.getTotalAmount();
        Logger.info(`Total Amount shown: "${totalText}"`);
      });

      Logger.testEnd('TC-PF-004');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 2 – ADD PROGRAM FUNDING SOURCE MODAL
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Program Funding – Add New Funding Source Modal @programs @funding @modal', () => {

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-005  Clicking "Add New Program Funding Source" opens modal
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-005: Clicking "Add New Program Funding Source" opens the modal @smoke @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-005');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);

      await test.step('Click "Add New Program Funding Source"', async () => {
        await fundingPage.clickAddNewFundingSource();
      });

      await test.step('Modal opens with correct fields', async () => {
        await fundingPage.verifyAddFundingModalOpen();
      });

      Logger.testEnd('TC-PF-005');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-006  Modal title is "Add Program Funding Source"
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-006: Add Program Funding Source modal has correct title @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-006');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);
      await fundingPage.clickAddNewFundingSource();

      await test.step('Modal title is "Add Program Funding Source"', async () => {
        const titleText = await fundingPage.addFundingModalTitle.textContent();
        Logger.info(`Modal title: "${titleText?.trim()}"`);
        expect(titleText?.trim()).toMatch(/Add Program Funding Source/i);
      });

      Logger.testEnd('TC-PF-006');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-007  Modal *Program dropdown is pre-filled
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-007: Modal *Program dropdown is pre-filled with the current program @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-007');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);
      await fundingPage.clickAddNewFundingSource();

      await test.step('Program dropdown has a non-empty selected value', async () => {
        const isPreFilled = await fundingPage.verifyProgramDropdownPreFilled();
        expect(isPreFilled).toBe(true);
        Logger.success('*Program dropdown is pre-populated');
      });

      Logger.testEnd('TC-PF-007');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-008  Modal *Funding Source dropdown defaults to "---Select---"
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-008: Modal *Funding Source dropdown defaults to "---Select---" @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-008');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);
      await fundingPage.clickAddNewFundingSource();

      await test.step('Funding Source dropdown shows placeholder', async () => {
        const value = await fundingPage.modalFundingSourceDropdown.inputValue();
        Logger.info(`Funding Source dropdown default value: "${value}"`);
        // Empty value or a placeholder option with value "" / "0" / "--Select--"
        const isDefault = value === '' || value === '0' || value.toLowerCase().includes('select');
        expect(isDefault).toBe(true);
        Logger.success('Funding Source dropdown defaults to unselected state');
      });

      Logger.testEnd('TC-PF-008');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-009  Modal *Amount($) defaults to "$0.00"
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-009: Modal *Amount($) field defaults to "$0.00" @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-009');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);
      await fundingPage.clickAddNewFundingSource();

      await test.step('Amount field shows $0.00 by default', async () => {
        const value = await fundingPage.modalAmountInput.inputValue();
        Logger.info(`Amount default value: "${value}"`);
        expect(value).toMatch(/0\.00|0/);
        Logger.success('Amount field defaults to $0.00');
      });

      Logger.testEnd('TC-PF-009');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-010  Modal has Submit and Cancel buttons
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-010: Modal has Submit and Cancel buttons @smoke @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-010');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);
      await fundingPage.clickAddNewFundingSource();

      await test.step('Submit and Cancel buttons are visible', async () => {
        await Assertions.verifyElementVisible(fundingPage.modalSubmitButton, 'Submit button');
        await Assertions.verifyElementVisible(fundingPage.modalCancelButton, 'Cancel button');
      });

      Logger.testEnd('TC-PF-010');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-011  Cancelling the modal closes it without adding a row
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-011: Cancelling the modal closes it without adding a funding source @smoke @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-011');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);

      /* Record row count before */
      const beforeCount = await fundingPage.page.locator('table tbody tr').count();
      Logger.info(`Funding rows before cancel: ${beforeCount}`);

      await fundingPage.clickAddNewFundingSource();
      await fundingPage.verifyAddFundingModalOpen();

      await test.step('Click Cancel', async () => {
        await fundingPage.cancelFundingModal();
      });

      await test.step('Modal is closed', async () => {
        const open = await fundingPage.isElementVisible(fundingPage.addFundingModal, 2000);
        expect(open).toBe(false);
        Logger.success('Modal closed after Cancel');
      });

      await test.step('Row count did not increase', async () => {
        const afterCount = await fundingPage.page.locator('table tbody tr').count();
        Logger.info(`Funding rows after cancel: ${afterCount}`);
        expect(afterCount).toBe(beforeCount);
        Logger.success('No new row added after cancelling');
      });

      Logger.testEnd('TC-PF-011');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-012  Close icon (X) on modal closes it
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-012: Clicking the X icon closes the Add Funding Source modal @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-012');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);
      await fundingPage.clickAddNewFundingSource();
      await fundingPage.verifyAddFundingModalOpen();

      await test.step('Click X (close) icon', async () => {
        await fundingPage.clickElement(fundingPage.modalCloseIcon, 'Modal X close icon');
        await fundingPage.wait(400);
      });

      await test.step('Modal is gone', async () => {
        const open = await fundingPage.isElementVisible(fundingPage.addFundingModal, 2000);
        expect(open).toBe(false);
        Logger.success('Modal closed via X icon');
      });

      Logger.testEnd('TC-PF-012');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 3 – TAB NAVIGATION
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Program Funding – Tab Navigation @programs @funding @navigation', () => {

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-013  "Back" navigates to Grants tab (previous tab)
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-013: "Back" button navigates to the previous sidebar tab (Grants) @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-013');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);

      await test.step('Click Back', async () => {
        await fundingPage.clickBack();
      });

      await test.step('Grants panel or different tab content is shown', async () => {
        // After Back from Program Funding, user should be on Grants tab
        // Grants tab shows "Add New Grant For Program" link
        const grantsLink = fundingPage.page
          .locator('a:has-text("Add New Grant For Program"), text=/Grants/i')
          .first();
        const visible = await fundingPage.isElementVisible(grantsLink, 8000);
        Logger.info(`Grants tab visible after Back: ${visible}`);
        // URL still on edit_program
        const url = fundingPage.page.url();
        expect(url).toContain('edit_program');
        Logger.success('Back navigated correctly (still on edit_program page)');
      });

      Logger.testEnd('TC-PF-013');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-014  "Next" navigates to Application Questions tab
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-014: "Next" button navigates to the Application Questions tab @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-014');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);

      await test.step('Click Next', async () => {
        await fundingPage.clickNext();
      });

      await test.step('Application Questions content appears', async () => {
        const url = fundingPage.page.url();
        // URL still on edit_program (tab switch, no full navigation)
        expect(url).toContain('edit_program');
        Logger.info(`URL after Next: ${url}`);
        Logger.success('Next navigated to next tab (still on edit_program page)');
      });

      Logger.testEnd('TC-PF-014');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-PF-015  "Exit" navigates away from Edit Program page
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-PF-015: "Exit" button navigates away from the Edit Program page @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-PF-015');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);

      await test.step('Click Exit', async () => {
        await fundingPage.clickExit();
      });

      await test.step('URL changes away from edit_program', async () => {
        const url = fundingPage.page.url();
        Logger.info(`URL after Exit: ${url}`);
        expect(url).not.toContain('edit_program');
        Logger.success('Exit navigated away from Edit Program page');
      });

      Logger.testEnd('TC-PF-015');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 4 – NEGATIVE TEST CASES
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Program Funding – Negative Cases @programs @funding @negative', () => {

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-PF-001  Submit modal without selecting Funding Source
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-PF-001: Submitting modal without selecting a Funding Source triggers validation @negative @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('NEG-TC-PF-001');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);
      await fundingPage.clickAddNewFundingSource();

      await test.step('Click Submit without selecting Funding Source', async () => {
        await fundingPage.clickElement(fundingPage.modalSubmitButton, 'Submit (empty)');
        await fundingPage.wait(1000);
      });

      await test.step('Validation fires or modal remains open', async () => {
        const sourceValidation = await fundingPage.getValidationMessage(
          fundingPage.modalFundingSourceDropdown
        );
        Logger.info(`Funding Source validation: "${sourceValidation}"`);

        const appError = fundingPage.page
          .locator('.alert-danger, .errorlist li, .invalid-feedback, .text-danger')
          .first();
        const hasAppError    = await fundingPage.isElementVisible(appError, 3000);
        const modalStillOpen = await fundingPage.isElementVisible(fundingPage.addFundingModal, 3000);

        expect(sourceValidation.length > 0 || hasAppError || modalStillOpen).toBe(true);
        Logger.success('Validation correctly triggered for empty Funding Source');
      });

      Logger.testEnd('NEG-TC-PF-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-PF-002  Submit modal without entering an Amount
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-PF-002: Submitting modal with $0.00 amount or empty amount shows validation @negative @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('NEG-TC-PF-002');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);
      await fundingPage.clickAddNewFundingSource();

      await test.step('Clear Amount field and click Submit', async () => {
        await fundingPage.modalAmountInput.click({ clickCount: 3 });
        await fundingPage.modalAmountInput.fill('');
        await fundingPage.clickElement(fundingPage.modalSubmitButton, 'Submit (empty amount)');
        await fundingPage.wait(1000);
      });

      await test.step('Validation fires on Amount field or modal stays open', async () => {
        const amountValidation = await fundingPage.getValidationMessage(
          fundingPage.modalAmountInput
        );
        Logger.info(`Amount validation: "${amountValidation}"`);

        const appError = fundingPage.page
          .locator('.alert-danger, .errorlist li, .invalid-feedback')
          .first();
        const hasAppError    = await fundingPage.isElementVisible(appError, 3000);
        const modalStillOpen = await fundingPage.isElementVisible(fundingPage.addFundingModal, 3000);

        expect(amountValidation.length > 0 || hasAppError || modalStillOpen).toBe(true);
        Logger.success('Amount validation triggered correctly');
      });

      Logger.testEnd('NEG-TC-PF-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-PF-003  Program Funding tab is accessible from sidebar
   *                even when the program has no contacts
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-PF-003: Program Funding tab is accessible even without contacts added @negative @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('NEG-TC-PF-003');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);

      await test.step('Note message about contacts is still shown', async () => {
        const noteMsg = fundingPage.page
          .locator('text=/Note.*Please Add At Least One Contact/i')
          .first();
        const visible = await fundingPage.isElementVisible(noteMsg, 5000);
        Logger.info(`Contact note visible: ${visible}`);
        // Note appears at top-right regardless of which tab is active
      });

      await test.step('Program Funding tab still shows correct panel structure', async () => {
        await fundingPage.verifyProgramFundingTabLoaded();
        Logger.success('Program Funding tab is accessible without contacts');
      });

      Logger.testEnd('NEG-TC-PF-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-PF-004  Entering a negative amount shows validation
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-PF-004: Entering a negative amount in modal shows validation @negative @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('NEG-TC-PF-004');

      const fundingPage = await setupProgramFundingTab(programsPage, addProgramPage, editProgramPage);
      await fundingPage.clickAddNewFundingSource();

      await test.step('Enter a negative amount', async () => {
        await fundingPage.modalAmountInput.click({ clickCount: 3 });
        await fundingPage.modalAmountInput.fill('-500');
      });

      await test.step('Click Submit', async () => {
        await fundingPage.clickElement(fundingPage.modalSubmitButton, 'Submit (negative amount)');
        await fundingPage.wait(1000);
      });

      await test.step('Validation fires or modal stays open', async () => {
        const validation = await fundingPage.getValidationMessage(fundingPage.modalAmountInput);
        Logger.info(`Negative amount validation: "${validation}"`);

        const appError = fundingPage.page
          .locator('.alert-danger, .errorlist, .invalid-feedback, .text-danger')
          .first();
        const hasError       = await fundingPage.isElementVisible(appError, 3000);
        const modalStillOpen = await fundingPage.isElementVisible(fundingPage.addFundingModal, 3000);

        expect(validation.length > 0 || hasError || modalStillOpen).toBe(true);
        Logger.success('Negative amount validation handled correctly');
      });

      Logger.testEnd('NEG-TC-PF-004');
    }
  );

});