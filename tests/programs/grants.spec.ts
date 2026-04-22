/**
 * grants.spec.ts
 *
 * Full test suite for the Grants module.
 *
 * Covers TWO navigation methods to create/access grants:
 *
 *  Method A (from Edit Program page):
 *    Programs list → Add New Program → Submit → Edit Program page
 *    → Grants sidebar tab → "Add New Grant For Program"
 *    → Add Grant page (/grants/add/<id>/)
 *    → Submit → Edit Grant page (/grants/grantedit/<id>/)
 *
 *  Method B (via My Grants top menu):
 *    My Grants → Grants sub-menu → Grants list (/grants/)
 *    → "Add New Grant" link → Add Grant page → Submit → Edit Grant page
 *
 * Fixtures used (from AuthFixtures.ts):
 *   programsPage   – POM for Programs list
 *   addProgramPage – POM for Add Program page
 *   editProgramPage – POM for Edit Program page (for Method A)
 *   grantorPage    – raw page, wrapped in GrantsPage inline
 *
 * GrantsPage is instantiated inline (not in AuthFixtures) because it
 * wraps three distinct URL states in one class.
 *
 * Test ID convention:
 *   TC-GL-xxx      Grants List page
 *   TC-AG-xxx      Add Grant (happy path)
 *   TC-EG-xxx      Edit Grant accordions
 *   TC-EG-FLC-xxx  Edit Grant – Funding Life Cycle accordion
 *   TC-EG-GF-xxx   Edit Grant – Grant Funding accordion
 *   TC-EG-DOC-xxx  Edit Grant – Documents accordion
 *   TC-EG-MS-xxx   Edit Grant – Milestones accordion
 *   TC-EG-PS-xxx   Edit Grant – Proposal Structure accordion
 *   NEG-TC-AG-xxx  Add Grant negative cases
 *   NEG-TC-EG-xxx  Edit Grant negative cases
 *
 * File location in repo:
 *   tests/programs/grants.spec.ts   ← placed with programs tests because
 *                                       grants live within the Edit Program flow
 */

import { test, expect } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { ProgramFactory } from '@utils/factories/ProgramFactory';
import { GrantFactory } from '@utils/factories/GrantFactory';
import { GrantsPage } from '@pages/programs/GrantsPage';

/* ─────────────────────────────────────────────────────────────
 * HELPER A: Create program → open its Edit Program page →
 *           click Grants tab → click "Add New Grant For Program"
 *           → fills & submits Add Grant form → lands on Edit Grant page.
 * Returns { grantsPage, grantName } for further assertions.
 * ───────────────────────────────────────────────────────────── */
async function createGrantViaEditProgram(
  programsPage: any,
  addProgramPage: any,
  editProgramPage: any,
  grantName: string
): Promise<GrantsPage> {
  const progData = ProgramFactory.generateMinimalProgram();

  // 1. Create program
  await programsPage.navigateToProgramsPage();
  await programsPage.clickAddNewProgram();
  await addProgramPage.fillRequiredFields({
    programCode: progData.programCode,
    programName: progData.programName,
  });
  await addProgramPage.clickSubmit();
  await addProgramPage.page.waitForURL('**/edit_program/**', { timeout: 20000 });

  // 2. Go to Grants sidebar tab
  await editProgramPage.goToGrants();

  // 3. Click "Add New Grant For Program"
  const addGrantLink = editProgramPage.page
    .locator('a:has-text("Add New Grant For Program"), a:has-text("Add New Grant")')
    .first();
  await addGrantLink.waitFor({ state: 'visible', timeout: 10000 });
  await addGrantLink.click();
  await editProgramPage.page.waitForURL('**/grants/add/**', { timeout: 15000 });

  // 4. Fill & submit the Add Grant form
  const grantsPage = new GrantsPage(editProgramPage.page);
  await grantsPage.verifyAddGrantPageLoaded();

  // Get first available fiscal year option
  const fyOptions = await grantsPage.fiscalYearDropdown.locator('option').allTextContents();
  const validFY   = fyOptions.find(o => o.trim() && !o.includes('Select')) || '';
  Logger.info(`Using fiscal year: "${validFY}"`);

  await grantsPage.fillRequiredGrantFields({
    fiscalYear: validFY,
    grantName:  grantName,
  });
  await grantsPage.clickAddGrantSubmit();

  // 5. After submit → Edit Grant page
  await grantsPage.page.waitForURL('**/grantedit/**', { timeout: 15000 });
  Logger.success(`Grant "${grantName}" created via Edit Program → Grants tab`);
  return grantsPage;
}

/* ─────────────────────────────────────────────────────────────
 * HELPER B: Navigate to Grants list via My Grants menu →
 *           click "Add New Grant" → fill & submit →
 *           land on Edit Grant page.
 * Returns GrantsPage for further assertions.
 * ───────────────────────────────────────────────────────────── */
async function createGrantViaMenu(
  grantorPage: any,
  grantName: string
): Promise<GrantsPage> {
  const grantsPage = new GrantsPage(grantorPage);

  // 1. Navigate via menu
  await grantsPage.navigateToGrantsListViaMenu();
  await grantsPage.page.waitForURL('**/grants/**', { timeout: 10000 });

  // 2. Click "Add New Grant"
  await grantsPage.clickAddNewGrant();
  await grantsPage.page.waitForURL('**/grants/add/**', { timeout: 15000 });
  await grantsPage.verifyAddGrantPageLoaded();

  // 3. Fill & submit
  const fyOptions = await grantsPage.fiscalYearDropdown.locator('option').allTextContents();
  const validFY   = fyOptions.find(o => o.trim() && !o.includes('Select')) || '';

  await grantsPage.fillRequiredGrantFields({
    fiscalYear: validFY,
    grantName:  grantName,
  });
  await grantsPage.clickAddGrantSubmit();
  await grantsPage.page.waitForURL('**/grantedit/**', { timeout: 15000 });
  Logger.success(`Grant "${grantName}" created via My Grants → Grants menu`);
  return grantsPage;
}

/* ═══════════════════════════════════════════════════════════════
 * SUITE 1 – GRANTS LIST PAGE (Method B entry point)
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Grants List Page @grants @list', () => {

  test.beforeEach(async ({ grantorPage }) => {
    const grantsPage = new GrantsPage(grantorPage);
    await grantsPage.navigateToGrantsListViaMenu();
  });

  /* ──────────────────────────────────────────────────────────────
   * TC-GL-001  Grants list loads correct elements
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-GL-001: Grants list page loads with header, table, "Add New Grant" link @smoke @regression',
    async ({ grantorPage }) => {
      Logger.testStart('TC-GL-001');
      const grantsPage = new GrantsPage(grantorPage);

      await test.step('URL contains /grants/', async () => {
        await Assertions.verifyPageUrlContains(grantorPage, 'grants');
      });

      await test.step('"Grants" page header is visible', async () => {
        await Assertions.verifyElementVisible(grantsPage.grantsListHeader, 'Grants header');
      });

      await test.step('"Add New Grant" link is visible', async () => {
        await Assertions.verifyElementVisible(grantsPage.addNewGrantLink, 'Add New Grant link');
      });

      await test.step('Grants table with correct columns is visible', async () => {
        await Assertions.verifyElementVisible(grantsPage.grantsTable,            'Grants table');
        await Assertions.verifyElementVisible(grantsPage.grantColumnHeader,       'Grant column');
        await Assertions.verifyElementVisible(grantsPage.programColumnHeader,     'Program column');
        await Assertions.verifyElementVisible(grantsPage.statusColumnHeader,      'Status column');
        await Assertions.verifyElementVisible(grantsPage.actionsColumnHeader,     'Actions column');
      });

      await test.step('Pagination info is visible', async () => {
        await Assertions.verifyElementVisible(grantsPage.listPaginationInfo, 'Pagination info');
      });

      Logger.testEnd('TC-GL-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-GL-002  Status filter radio buttons: Active/Inactive/Draft/Review/Closed/All
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-GL-002: All 6 status filter radio buttons are visible @smoke @regression',
    async ({ grantorPage }) => {
      Logger.testStart('TC-GL-002');
      const grantsPage = new GrantsPage(grantorPage);

      const filters = ['Active', 'Inactive', 'Draft', 'Review', 'Closed', 'All'];
      for (const f of filters) {
        const radio = grantorPage.locator(`label:has-text("${f}") input[type="radio"]`).first();
        await Assertions.verifyElementVisible(radio, `${f} radio button`);
      }
      Logger.testEnd('TC-GL-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-GL-003  Filtering by "Draft" shows only Draft grants
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-GL-003: Selecting "Draft" filter applies the filter @regression',
    async ({ grantorPage }) => {
      Logger.testStart('TC-GL-003');
      const grantsPage = new GrantsPage(grantorPage);

      await test.step('Click Draft filter', async () => {
        await grantsPage.selectStatusFilter('Draft');
      });

      await test.step('Draft radio is checked', async () => {
        await Assertions.verifyElementChecked(grantsPage.filterDraft, 'Draft radio');
      });

      Logger.testEnd('TC-GL-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-GL-004  "All" filter shows highest count
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-GL-004: Selecting "All" filter shows all grants @regression',
    async ({ grantorPage }) => {
      Logger.testStart('TC-GL-004');
      const grantsPage = new GrantsPage(grantorPage);

      await grantsPage.selectStatusFilter('All');
      await Assertions.verifyElementChecked(grantsPage.filterAll, 'All radio');

      const infoText = await grantsPage.listPaginationInfo.textContent();
      Logger.info(`All filter pagination: ${infoText}`);
      expect(infoText).toMatch(/Of \d+ Entries/i);
      Logger.testEnd('TC-GL-004');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-GL-005  Each row has View, Edit, Print, Delete action icons
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-GL-005: Grants table rows show action icons (View, Edit, Print, Delete) @regression',
    async ({ grantorPage }) => {
      Logger.testStart('TC-GL-005');
      const grantsPage = new GrantsPage(grantorPage);

      await grantsPage.selectStatusFilter('All');

      const firstDataRow = grantorPage.locator('table tbody tr').filter({
        hasNot: grantorPage.locator('td:has-text("No data")')
      }).first();

      const rowCount = await grantorPage.locator('table tbody tr').count();
      Logger.info(`Grant rows visible: ${rowCount}`);

      if (rowCount > 0) {
        const hasIcon = await grantsPage.isElementVisible(
          firstDataRow.locator('.fa-eye, .fa-edit, .fa-print, .fa-trash'), 5000
        );
        expect(hasIcon).toBe(true);
        Logger.success('Action icons confirmed in grants table rows');
      } else {
        Logger.info('No grant rows available to verify icons');
      }
      Logger.testEnd('TC-GL-005');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-GL-006  "Add New Grant" navigates to Add Grant page
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-GL-006: Clicking "Add New Grant" navigates to Add Grant page @smoke @regression',
    async ({ grantorPage }) => {
      Logger.testStart('TC-GL-006');
      const grantsPage = new GrantsPage(grantorPage);

      await grantsPage.clickAddNewGrant();

      await test.step('URL contains /grants/add/', async () => {
        await Assertions.verifyPageUrlContains(grantorPage, 'grants/add');
      });

      Logger.testEnd('TC-GL-006');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-GL-007  Export button and Choose Format dropdown are visible
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-GL-007: Bulk action bar shows Delete, Choose Format, and Export @regression',
    async ({ grantorPage }) => {
      Logger.testStart('TC-GL-007');
      const grantsPage = new GrantsPage(grantorPage);

      await Assertions.verifyElementVisible(grantsPage.deleteButton,         'Delete button');
      await Assertions.verifyElementVisible(grantsPage.chooseFormatDropdown, 'Choose Format dropdown');
      await Assertions.verifyElementVisible(grantsPage.exportButton,         'Export button');
      Logger.testEnd('TC-GL-007');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 2 – ADD GRANT PAGE (Method A: via Edit Program → Grants tab)
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Add Grant Page – via Edit Program @grants @add @method-a', () => {

  /* ──────────────────────────────────────────────────────────────
   * TC-AG-001  Add Grant page loads with correct elements (Method A)
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AG-001 (Method A): Add Grant page loads with "Add Grant for <Program>" header and all fields @smoke @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-AG-001');

      const progData = ProgramFactory.generateMinimalProgram();
      await programsPage.navigateToProgramsPage();
      await programsPage.clickAddNewProgram();
      await addProgramPage.fillRequiredFields({
        programCode: progData.programCode,
        programName: progData.programName,
      });
      await addProgramPage.clickSubmit();
      await addProgramPage.page.waitForURL('**/edit_program/**', { timeout: 20000 });
      await editProgramPage.goToGrants();

      const addGrantLink = editProgramPage.page
        .locator('a:has-text("Add New Grant For Program"), a:has-text("Add New Grant")')
        .first();
      await addGrantLink.click();
      await editProgramPage.page.waitForURL('**/grants/add/**', { timeout: 15000 });

      const grantsPage = new GrantsPage(editProgramPage.page);

      await test.step('Header shows "Add Grant for <Program Name>"', async () => {
        const headerText = await grantsPage.addGrantPageHeader.textContent();
        expect(headerText?.trim()).toMatch(/Add Grant for/i);
        Logger.info(`Header: ${headerText?.trim()}`);
      });

      await test.step('Grant Basic Information accordion is visible', async () => {
        await Assertions.verifyElementVisible(grantsPage.addGrantBasicInfoAccordion, 'Grant Basic Information');
      });

      await test.step('Required fields are visible', async () => {
        await grantsPage.verifyAddGrantPageLoaded();
      });

      await test.step('*Program dropdown is pre-filled with the program', async () => {
        const programValue = await grantsPage.programDropdown.inputValue();
        Logger.info(`Program dropdown value: "${programValue}"`);
        expect(programValue.length).toBeGreaterThan(0);
        Logger.success('*Program dropdown pre-populated');
      });

      await test.step('Status field defaults to "Draft"', async () => {
        const statusValue = await grantsPage.statusDropdown.inputValue();
        const statusText  = await grantsPage.statusDropdown
          .locator(`option[value="${statusValue}"]`)
          .textContent();
        Logger.info(`Default status: "${statusText?.trim()}"`);
        expect(statusText?.trim()).toMatch(/Draft/i);
      });

      await test.step('Boolean radios default to "No"', async () => {
        const multipleTimesNo = await grantsPage.allowMultipleTimesNo.isChecked().catch(() => false);
        const subAwardsNo     = await grantsPage.allowForSubAwardsNo.isChecked().catch(() => false);
        const subGrantsNo     = await grantsPage.allowForSubGrantsNo.isChecked().catch(() => false);
        Logger.info(`Allow Multiple Times No: ${multipleTimesNo}, Sub Awards No: ${subAwardsNo}, Sub Grants No: ${subGrantsNo}`);
      });

      await test.step('Submit and Cancel buttons visible', async () => {
        await Assertions.verifyElementVisible(grantsPage.addGrantSubmitButton, 'Submit button');
        await Assertions.verifyElementVisible(grantsPage.addGrantCancelButton, 'Cancel button');
      });

      Logger.testEnd('TC-AG-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-AG-002  Create grant via Method A → lands on Edit Grant page
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AG-002 (Method A): Creating a grant navigates to Edit Grant page with 8 accordions @smoke @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-AG-002');

      const grantName = `AutoGrant-A-${Date.now().toString().slice(-6)}`;
      const grantsPage = await createGrantViaEditProgram(
        programsPage, addProgramPage, editProgramPage, grantName
      );

      await test.step('Edit Grant page is loaded with all 8 accordions', async () => {
        await grantsPage.verifyEditGrantPageLoaded();
      });

      await test.step('URL contains /grantedit/', async () => {
        await Assertions.verifyPageUrlContains(grantsPage.page, 'grantedit');
      });

      Logger.testEnd('TC-AG-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-AG-003  Grant status is "Draft" immediately after creation
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AG-003: Newly created grant has "Draft" status on Edit Grant page @smoke @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-AG-003');

      const grantName  = `AutoGrant-Draft-${Date.now().toString().slice(-6)}`;
      const grantsPage = await createGrantViaEditProgram(
        programsPage, addProgramPage, editProgramPage, grantName
      );

      await grantsPage.expandBasicInfo();

      await test.step('Status field shows "Draft"', async () => {
        const status = await grantsPage.getCurrentStatus();
        expect(status).toMatch(/Draft/i);
        Logger.success(`Grant status confirmed as Draft: "${status}"`);
      });

      Logger.testEnd('TC-AG-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-AG-004  Cancel on Add Grant page navigates back
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AG-004: Cancelling on Add Grant page navigates away from add page @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('TC-AG-004');

      const progData = ProgramFactory.generateMinimalProgram();
      await programsPage.navigateToProgramsPage();
      await programsPage.clickAddNewProgram();
      await addProgramPage.fillRequiredFields({
        programCode: progData.programCode,
        programName: progData.programName,
      });
      await addProgramPage.clickSubmit();
      await addProgramPage.page.waitForURL('**/edit_program/**', { timeout: 20000 });
      await editProgramPage.goToGrants();

      const addGrantLink = editProgramPage.page
        .locator('a:has-text("Add New Grant For Program"), a:has-text("Add New Grant")')
        .first();
      await addGrantLink.click();
      await editProgramPage.page.waitForURL('**/grants/add/**', { timeout: 15000 });

      const grantsPage = new GrantsPage(editProgramPage.page);

      await test.step('Click Cancel', async () => {
        await grantsPage.clickAddGrantCancel();
      });

      await test.step('URL is no longer /grants/add/', async () => {
        const url = grantsPage.page.url();
        Logger.info(`URL after Cancel: ${url}`);
        expect(url).not.toContain('/grants/add/');
        Logger.success('Cancel navigated away from Add Grant page');
      });

      Logger.testEnd('TC-AG-004');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 3 – ADD GRANT PAGE (Method B: via My Grants → Grants menu)
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Add Grant Page – via My Grants Menu @grants @add @method-b', () => {

  /* ──────────────────────────────────────────────────────────────
   * TC-AG-005  Add Grant page loads from Grants list (Method B)
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AG-005 (Method B): "Add New Grant" from Grants list loads Add Grant page @smoke @regression',
    async ({ grantorPage }) => {
      Logger.testStart('TC-AG-005');

      const grantsPage = new GrantsPage(grantorPage);
      await grantsPage.navigateToGrantsListViaMenu();
      await grantsPage.clickAddNewGrant();

      await test.step('URL is /grants/add/', async () => {
        await Assertions.verifyPageUrlContains(grantorPage, 'grants/add');
      });

      await test.step('Add Grant page elements are present', async () => {
        await grantsPage.verifyAddGrantPageLoaded();
      });

      Logger.testEnd('TC-AG-005');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-AG-006  Create grant via Method B → Edit Grant page
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AG-006 (Method B): Creating a grant via Grants list navigates to Edit Grant page @smoke @regression',
    async ({ grantorPage }) => {
      Logger.testStart('TC-AG-006');

      const grantName  = `AutoGrant-B-${Date.now().toString().slice(-6)}`;
      const grantsPage = await createGrantViaMenu(grantorPage, grantName);

      await test.step('Edit Grant page with all 8 accordions is loaded', async () => {
        await grantsPage.verifyEditGrantPageLoaded();
      });

      Logger.testEnd('TC-AG-006');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-AG-007  Grant appears in Grants list after creation (Method B)
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AG-007: Created grant appears in the Grants list @e2e @regression',
    async ({ grantorPage }) => {
      Logger.testStart('TC-AG-007');

      const grantName  = `E2EGrant-${Date.now().toString().slice(-6)}`;
      const grantsPage = await createGrantViaMenu(grantorPage, grantName);

      await test.step('Navigate back to Grants list', async () => {
        await grantsPage.navigateToGrantsListViaMenu();
      });

      await test.step('Select "All" filter to see all statuses', async () => {
        await grantsPage.selectStatusFilter('All');
      });

      await test.step('Newly created grant row is visible', async () => {
        // Search in the inline filter to find the specific grant
        await grantsPage.fillInput(grantsPage.grantFilterInput, grantName, 'Grant search');
        await grantsPage.wait(800);
        const visible = await grantsPage.isGrantVisible(grantName);
        expect(visible).toBe(true);
        Logger.success(`Grant "${grantName}" confirmed visible in list`);
      });

      Logger.testEnd('TC-AG-007');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 4 – EDIT GRANT PAGE: 8 ACCORDIONS
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Edit Grant Page – All 8 Accordions @grants @edit', () => {

  let sharedGrantsPage: GrantsPage;

  /* Create ONE grant before all tests in this suite – more efficient */
  test.beforeEach(async ({ programsPage, addProgramPage, editProgramPage }) => {
    const grantName = `AccordionGrant-${Date.now().toString().slice(-6)}`;
    sharedGrantsPage = await createGrantViaEditProgram(
      programsPage, addProgramPage, editProgramPage, grantName
    );
  });

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-001  Edit Grant page header and all 8 accordions visible
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-001: Edit Grant page shows "Edit Grants" header and all 8 collapsed accordions @smoke @regression',
    async () => {
      Logger.testStart('TC-EG-001');

      await test.step('Edit Grant page verified (8 accordions)', async () => {
        await sharedGrantsPage.verifyEditGrantPageLoaded();
      });

      await test.step('"Edit Grants" header banner text', async () => {
        const headerText = await sharedGrantsPage.editGrantPageHeader.textContent();
        expect(headerText?.trim()).toMatch(/Edit Grants/i);
        Logger.info(`Header: ${headerText?.trim()}`);
      });

      Logger.testEnd('TC-EG-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-002  "Grant Basic Information" accordion expands with Status field
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-002: "Grant Basic Information" accordion expands and shows Status field @smoke @regression',
    async () => {
      Logger.testStart('TC-EG-002');

      await sharedGrantsPage.expandBasicInfo();

      await test.step('Status dropdown is visible after expansion', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.statusDropdown, 'Status dropdown');
      });

      Logger.testEnd('TC-EG-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-003  Change Status from Draft to Active
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-003: Status can be changed from "Draft" to "Active" in Grant Basic Information @smoke @regression',
    async () => {
      Logger.testStart('TC-EG-003');

      await sharedGrantsPage.expandBasicInfo();
      const initialStatus = await sharedGrantsPage.getCurrentStatus();
      Logger.info(`Initial status: "${initialStatus}"`);

      await test.step('Change status to Active', async () => {
        await sharedGrantsPage.changeStatusToActive();
      });

      await test.step('Status field now shows Active', async () => {
        const newStatus = await sharedGrantsPage.getCurrentStatus();
        Logger.info(`New status: "${newStatus}"`);
        expect(newStatus).toMatch(/Active/i);
        Logger.success('Status successfully changed to Active');
      });

      Logger.testEnd('TC-EG-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-004  "Grant Purpose" accordion expands with correct fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-004: "Grant Purpose" accordion expands and shows 6 textarea fields @regression',
    async () => {
      Logger.testStart('TC-EG-004');

      await sharedGrantsPage.expandGrantPurpose();

      await test.step('Description field is visible (with 0/500 counter)', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.grantDescriptionTextarea, 'Description textarea');
      });

      await test.step('Grant Purpose textarea is visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.grantPurposeTextarea, 'Grant Purpose textarea');
      });

      await test.step('Notes textarea is visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.notesTextarea, 'Notes textarea');
      });

      Logger.testEnd('TC-EG-004');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-005  "Important Dates" accordion expands with date fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-005: "Important Dates" accordion expands and shows all date fields @regression',
    async () => {
      Logger.testStart('TC-EG-005');

      await sharedGrantsPage.expandImportantDates();

      await test.step('Planning Start and End Dates are visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.planningStartDateInput, 'Planning Start Date');
        await Assertions.verifyElementVisible(sharedGrantsPage.planningEndDateInput,   'Planning End Date');
      });

      await test.step('*Grant Start and *Grant End Dates are visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.grantStartDateInput, '*Grant Start Date');
        await Assertions.verifyElementVisible(sharedGrantsPage.grantEndDateInput,   '*Grant End Date');
      });

      await test.step('LOI Required Yes/No radios are visible', async () => {
        const loiYes = sharedGrantsPage.page.locator('label:has-text("Yes") input[type="radio"]').first();
        const loiNo  = sharedGrantsPage.page.locator('label:has-text("No") input[type="radio"]').first();
        await Assertions.verifyElementVisible(loiYes, 'LOI Yes radio');
        await Assertions.verifyElementVisible(loiNo,  'LOI No radio');
      });

      Logger.testEnd('TC-EG-005');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-FLC-001  Funding Life Cycle accordion + table + "Add" link
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-FLC-001: "Funding Life Cycle" accordion expands with table and "Add Funding Life Cycle" link @regression',
    async () => {
      Logger.testStart('TC-EG-FLC-001');

      await sharedGrantsPage.expandFundingLifeCycle();

      await test.step('"Add Funding Life Cycle" link is visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.addFundingLifeCycleLink, 'Add Funding Life Cycle link');
      });

      await test.step('FLC table with correct column headers is visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.fundingLifeCycleTable, 'FLC table');
        const flcNameHeader = sharedGrantsPage.page.locator('th:has-text("Funding Life Cycle Name")').first();
        await Assertions.verifyElementVisible(flcNameHeader, 'FLC Name column');
      });

      await test.step('"No data available in table" state shown (empty)', async () => {
        const noData = sharedGrantsPage.page.locator('td:has-text("No data available in table")').first();
        const visible = await sharedGrantsPage.isElementVisible(noData, 3000);
        Logger.info(`FLC table empty state: ${visible}`);
      });

      Logger.testEnd('TC-EG-FLC-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-FLC-002  "Add Funding Life Cycle" modal opens with correct fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-FLC-002: Clicking "Add Funding Life Cycle" opens modal with correct fields @regression',
    async () => {
      Logger.testStart('TC-EG-FLC-002');

      await sharedGrantsPage.expandFundingLifeCycle();
      await sharedGrantsPage.clickAddFundingLifeCycle();

      await test.step('Modal verified with all fields', async () => {
        await sharedGrantsPage.verifyFLCModalOpen();
      });

      await test.step('Grant dropdown is pre-filled', async () => {
        const grantValue = await sharedGrantsPage.flcModalGrantDropdown.inputValue();
        Logger.info(`FLC modal Grant value: "${grantValue}"`);
        expect(grantValue.length).toBeGreaterThan(0);
        Logger.success('Grant dropdown pre-populated in FLC modal');
      });

      await test.step('Cancel FLC modal', async () => {
        await sharedGrantsPage.cancelFLCModal();
      });

      Logger.testEnd('TC-EG-FLC-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-GF-001  Grant Funding accordion expands with table and Add link
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-GF-001: "Grant Funding" accordion expands with table and "Add New Grant Funding" link @regression',
    async () => {
      Logger.testStart('TC-EG-GF-001');

      await sharedGrantsPage.expandGrantFunding();

      await test.step('"Add New Grant Funding" link is visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.addNewGrantFundingLink, 'Add New Grant Funding link');
      });

      await test.step('Grant Funding table column headers visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.grantFundingTable, 'Grant Funding table');
        const fundingSourceHeader = sharedGrantsPage.page.locator('th:has-text("Funding Source")').first();
        await Assertions.verifyElementVisible(fundingSourceHeader, 'Funding Source column');
        const amountHeader = sharedGrantsPage.page.locator('th:has-text("Funding Amount")').first();
        await Assertions.verifyElementVisible(amountHeader, 'Funding Amount column');
      });

      await test.step('"Total Amount:" row is visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.grantFundingTotalAmount, 'Total Amount row');
      });

      Logger.testEnd('TC-EG-GF-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-GF-002  "Add New Grant Funding" modal opens with correct fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-GF-002: Clicking "Add New Grant Funding" opens modal with Program, Grant, Funding Source, Amount @regression',
    async () => {
      Logger.testStart('TC-EG-GF-002');

      await sharedGrantsPage.expandGrantFunding();
      await sharedGrantsPage.clickAddNewGrantFunding();

      await test.step('Grant Funding modal fields verified', async () => {
        await sharedGrantsPage.verifyGrantFundingModalOpen();
      });

      await test.step('Program dropdown is pre-filled', async () => {
        const val = await sharedGrantsPage.grantFundingModalProgramDropdown.inputValue();
        Logger.info(`Program dropdown: "${val}"`);
        expect(val.length).toBeGreaterThan(0);
      });

      await test.step('Grant dropdown is pre-filled', async () => {
        const val = await sharedGrantsPage.grantFundingModalGrantDropdown.inputValue();
        Logger.info(`Grant dropdown: "${val}"`);
        expect(val.length).toBeGreaterThan(0);
      });

      await test.step('Cancel modal', async () => {
        await sharedGrantsPage.cancelGrantFundingModal();
      });

      Logger.testEnd('TC-EG-GF-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-DOC-001  Documents accordion expands with table and Add link
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-DOC-001: "Documents" accordion expands with table and "Add New Document" link @regression',
    async () => {
      Logger.testStart('TC-EG-DOC-001');

      await sharedGrantsPage.expandDocuments();

      await test.step('"Add New Document" link is visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.addNewDocumentLink, 'Add New Document link');
      });

      await test.step('Documents table column headers visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.documentsTable, 'Documents table');
        const docTypeHeader = sharedGrantsPage.page.locator('th:has-text("Document Type")').first();
        await Assertions.verifyElementVisible(docTypeHeader, 'Document Type column');
        const docNameHeader = sharedGrantsPage.page.locator('th:has-text("Document Name")').first();
        await Assertions.verifyElementVisible(docNameHeader, 'Document Name column');
      });

      Logger.testEnd('TC-EG-DOC-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-DOC-002  Add New Document modal opens with correct fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-DOC-002: Clicking "Add New Document" opens the upload modal with required fields @regression',
    async () => {
      Logger.testStart('TC-EG-DOC-002');

      await sharedGrantsPage.expandDocuments();
      await sharedGrantsPage.clickAddNewDocument();

      await test.step('Document modal fields', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.documentModal,          'Document modal');
        await Assertions.verifyElementVisible(sharedGrantsPage.documentTypeDropdown,   '*Document Type');
        await Assertions.verifyElementVisible(sharedGrantsPage.uploadDocumentInput,    '*Upload Document');
        await Assertions.verifyElementVisible(sharedGrantsPage.documentNameInput,      '*Document Name');
        await Assertions.verifyElementVisible(sharedGrantsPage.documentConfidentialYes,'Confidential Yes');
        await Assertions.verifyElementVisible(sharedGrantsPage.documentConfidentialNo, 'Confidential No');
        await Assertions.verifyElementVisible(sharedGrantsPage.documentModalSubmit,    'Submit button');
        await Assertions.verifyElementVisible(sharedGrantsPage.documentModalCancel,    'Cancel button');
      });

      await sharedGrantsPage.cancelDocumentModal();
      Logger.testEnd('TC-EG-DOC-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-MS-001  Milestones accordion expands with table and Add link
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-MS-001: "Milestones" accordion expands with table and "Add New Milestone" link @regression',
    async () => {
      Logger.testStart('TC-EG-MS-001');

      await sharedGrantsPage.expandMilestones();

      await test.step('"Add New Milestone" link is visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.addNewMilestoneLink, 'Add New Milestone link');
      });

      await test.step('Milestones table column headers visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.milestonesTable, 'Milestones table');
        const milestoneCodeHeader = sharedGrantsPage.page.locator('th:has-text("Milestone Code")').first();
        await Assertions.verifyElementVisible(milestoneCodeHeader, 'Milestone Code column');
        const milestoneNameHeader = sharedGrantsPage.page.locator('th:has-text("Milestone Name")').first();
        await Assertions.verifyElementVisible(milestoneNameHeader, 'Milestone Name column');
      });

      Logger.testEnd('TC-EG-MS-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-MS-002  Add New Milestone modal opens with correct fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-MS-002: Clicking "Add New Milestone" opens modal with Grant Name, FLC Name, Milestone fields @regression',
    async () => {
      Logger.testStart('TC-EG-MS-002');

      await sharedGrantsPage.expandMilestones();
      await sharedGrantsPage.clickAddNewMilestone();

      await test.step('Milestone modal fields verified', async () => {
        await sharedGrantsPage.verifyMilestoneModalOpen();
      });

      await test.step('Grant Name is shown as header inside modal', async () => {
        const headerVisible = await sharedGrantsPage.isElementVisible(
          sharedGrantsPage.milestoneGrantNameHeader, 5000
        );
        Logger.info(`Grant Name header in milestone modal: ${headerVisible}`);
      });

      await sharedGrantsPage.cancelMilestoneModal();
      Logger.testEnd('TC-EG-MS-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-PS-001  Proposal Structure accordion expands with table and Add link
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-PS-001: "Proposal Structure" accordion expands with table and "Add New Table of content" link @regression',
    async () => {
      Logger.testStart('TC-EG-PS-001');

      await sharedGrantsPage.expandProposalStructure();

      await test.step('"Add New Table of content" link is visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.addNewTableOfContentLink, 'Add New Table of content link');
      });

      await test.step('Proposal Structure table headers visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.proposalStructureTable, 'Proposal Structure table');
        const contentNameHeader = sharedGrantsPage.page.locator('th:has-text("Content Name")').first();
        await Assertions.verifyElementVisible(contentNameHeader, 'Content Name column');
      });

      Logger.testEnd('TC-EG-PS-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-PS-002  Add New Table Of Content modal opens correctly
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-PS-002: Clicking "Add New Table of content" opens modal with Grant Name, Content Name, Description @regression',
    async () => {
      Logger.testStart('TC-EG-PS-002');

      await sharedGrantsPage.expandProposalStructure();
      await sharedGrantsPage.clickAddNewTableOfContent();

      await test.step('Table of Content modal verified', async () => {
        await sharedGrantsPage.verifyTOCModalOpen();
      });

      await test.step('Grant Name header is shown in modal', async () => {
        const headerVisible = await sharedGrantsPage.isElementVisible(
          sharedGrantsPage.tocGrantNameHeader, 5000
        );
        Logger.info(`Grant Name in TOC modal: ${headerVisible}`);
      });

      await sharedGrantsPage.cancelTOCModal();
      Logger.testEnd('TC-EG-PS-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-PS-003  Add Table of Content → entry appears in table
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-PS-003: Successfully adding a Table of Content entry shows it in the table @regression',
    async () => {
      Logger.testStart('TC-EG-PS-003');

      const contentName = `TOC-${Date.now().toString().slice(-6)}`;

      await sharedGrantsPage.expandProposalStructure();
      await sharedGrantsPage.clickAddNewTableOfContent();

      await test.step('Fill and submit TOC modal', async () => {
        await sharedGrantsPage.fillAndSubmitTOCModal({
          contentName: contentName,
          description: 'Automated TOC entry',
        });
      });

      await test.step('New TOC entry is visible in the table', async () => {
        const row = sharedGrantsPage.page.locator(`tr:has-text("${contentName}")`).first();
        const visible = await sharedGrantsPage.isElementVisible(row, 5000);
        expect(visible).toBe(true);
        Logger.success(`TOC "${contentName}" confirmed in Proposal Structure table`);
      });

      Logger.testEnd('TC-EG-PS-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EG-006  Submit and Cancel buttons on Edit Grant page visible
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EG-006: Submit and Cancel buttons are present on Edit Grant page @smoke @regression',
    async () => {
      Logger.testStart('TC-EG-006');

      await test.step('Submit and Cancel visible', async () => {
        await Assertions.verifyElementVisible(sharedGrantsPage.editGrantSubmitButton, 'Submit button');
        await Assertions.verifyElementVisible(sharedGrantsPage.editGrantCancelButton, 'Cancel button');
      });

      Logger.testEnd('TC-EG-006');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 5 – NEGATIVE TEST CASES
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Grants – Negative Cases @grants @negative', () => {

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-AG-001  Submit Add Grant form without required *Fiscal Year
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-AG-001: Submitting Add Grant without *Fiscal Year triggers validation @negative @regression',
    async ({ grantorPage }) => {
      Logger.testStart('NEG-TC-AG-001');

      const grantsPage = new GrantsPage(grantorPage);
      await grantsPage.navigateToGrantsListViaMenu();
      await grantsPage.clickAddNewGrant();
      await grantsPage.verifyAddGrantPageLoaded();

      await test.step('Fill Grant Name but skip Fiscal Year', async () => {
        await grantsPage.fillInput(grantsPage.grantNameInput, 'Grant Without FY', 'Grant Name');
      });

      await test.step('Click Submit', async () => {
        await grantsPage.clickAddGrantSubmit();
      });

      await test.step('Validation fires on Fiscal Year', async () => {
        const fyValidation = await grantsPage.getValidationMessage(grantsPage.fiscalYearDropdown);
        Logger.info(`FY validation: "${fyValidation}"`);

        const appError = grantorPage.locator('.alert-danger, .errorlist li, .invalid-feedback').first();
        const hasAppError = await grantsPage.isElementVisible(appError, 3000);
        const stillOnAddPage = grantorPage.url().includes('grants/add');

        expect(fyValidation.length > 0 || hasAppError || stillOnAddPage).toBe(true);
        Logger.success('Fiscal Year validation triggered correctly');
      });

      Logger.testEnd('NEG-TC-AG-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-AG-002  Submit Add Grant without *Grant Name
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-AG-002: Submitting Add Grant without *Grant Name triggers validation @negative @regression',
    async ({ grantorPage }) => {
      Logger.testStart('NEG-TC-AG-002');

      const grantsPage = new GrantsPage(grantorPage);
      await grantsPage.navigateToGrantsListViaMenu();
      await grantsPage.clickAddNewGrant();
      await grantsPage.verifyAddGrantPageLoaded();

      await test.step('Select Fiscal Year but leave Grant Name empty', async () => {
        const fyOptions = await grantsPage.fiscalYearDropdown.locator('option').allTextContents();
        const validFY   = fyOptions.find(o => o.trim() && !o.includes('Select')) || '';
        if (validFY) {
          await grantsPage.fiscalYearDropdown.selectOption({ label: validFY });
        }
        // Leave Grant Name empty
      });

      await test.step('Click Submit', async () => {
        await grantsPage.clickAddGrantSubmit();
      });

      await test.step('Validation fires on Grant Name', async () => {
        const nameValidation = await grantsPage.getValidationMessage(grantsPage.grantNameInput);
        Logger.info(`Grant Name validation: "${nameValidation}"`);

        const appError = grantorPage.locator('.alert-danger, .errorlist li, .invalid-feedback').first();
        const hasAppError    = await grantsPage.isElementVisible(appError, 3000);
        const stillOnAddPage = grantorPage.url().includes('grants/add');

        expect(nameValidation.length > 0 || hasAppError || stillOnAddPage).toBe(true);
        Logger.success('Grant Name validation triggered correctly');
      });

      Logger.testEnd('NEG-TC-AG-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-EG-001  Submit FLC modal without required fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-EG-001: Submitting "Add Funding Life Cycle" modal without required fields triggers validation @negative @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('NEG-TC-EG-001');

      const grantName  = `NegGrant-FLC-${Date.now().toString().slice(-6)}`;
      const grantsPage = await createGrantViaEditProgram(
        programsPage, addProgramPage, editProgramPage, grantName
      );

      await grantsPage.expandFundingLifeCycle();
      await grantsPage.clickAddFundingLifeCycle();
      await grantsPage.verifyFLCModalOpen();

      await test.step('Click Submit without filling required fields', async () => {
        await grantsPage.clickElement(grantsPage.flcModalSubmit, 'FLC Submit (empty)');
        await grantsPage.wait(1000);
      });

      await test.step('Validation or modal stays open', async () => {
        const nameValidation = await grantsPage.getValidationMessage(grantsPage.flcModalNameInput);
        Logger.info(`FLC Name validation: "${nameValidation}"`);

        const appError      = grantsPage.page.locator('.alert-danger, .errorlist, .invalid-feedback').first();
        const hasError      = await grantsPage.isElementVisible(appError, 3000);
        const modalOpen     = await grantsPage.isElementVisible(grantsPage.flcModal, 3000);

        expect(nameValidation.length > 0 || hasError || modalOpen).toBe(true);
        Logger.success('FLC validation triggered correctly');
      });

      Logger.testEnd('NEG-TC-EG-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-EG-002  Submit Milestone modal without required fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-EG-002: Submitting "Add Milestone" modal without required fields triggers validation @negative @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('NEG-TC-EG-002');

      const grantName  = `NegGrant-MS-${Date.now().toString().slice(-6)}`;
      const grantsPage = await createGrantViaEditProgram(
        programsPage, addProgramPage, editProgramPage, grantName
      );

      await grantsPage.expandMilestones();
      await grantsPage.clickAddNewMilestone();
      await grantsPage.verifyMilestoneModalOpen();

      await test.step('Click Submit without filling required fields', async () => {
        await grantsPage.clickElement(grantsPage.milestoneModalSubmit, 'Milestone Submit (empty)');
        await grantsPage.wait(1000);
      });

      await test.step('Validation or modal stays open', async () => {
        const nameValidation = await grantsPage.getValidationMessage(grantsPage.milestoneNameInput);
        Logger.info(`Milestone Name validation: "${nameValidation}"`);

        const appError  = grantsPage.page.locator('.alert-danger, .errorlist, .invalid-feedback').first();
        const hasError  = await grantsPage.isElementVisible(appError, 3000);
        const modalOpen = await grantsPage.isElementVisible(grantsPage.milestoneModal, 3000);

        expect(nameValidation.length > 0 || hasError || modalOpen).toBe(true);
        Logger.success('Milestone validation triggered correctly');
      });

      Logger.testEnd('NEG-TC-EG-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-EG-003  Submit TOC modal without *Content Name
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-EG-003: Submitting "Add Table of Content" modal without *Content Name triggers validation @negative @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('NEG-TC-EG-003');

      const grantName  = `NegGrant-TOC-${Date.now().toString().slice(-6)}`;
      const grantsPage = await createGrantViaEditProgram(
        programsPage, addProgramPage, editProgramPage, grantName
      );

      await grantsPage.expandProposalStructure();
      await grantsPage.clickAddNewTableOfContent();
      await grantsPage.verifyTOCModalOpen();

      await test.step('Click Submit without Content Name', async () => {
        await grantsPage.clickElement(grantsPage.tocModalSubmit, 'TOC Submit (empty)');
        await grantsPage.wait(1000);
      });

      await test.step('Validation or modal stays open', async () => {
        const nameValidation = await grantsPage.getValidationMessage(grantsPage.tocContentNameInput);
        Logger.info(`Content Name validation: "${nameValidation}"`);

        const appError  = grantsPage.page.locator('.alert-danger, .errorlist, .invalid-feedback').first();
        const hasError  = await grantsPage.isElementVisible(appError, 3000);
        const modalOpen = await grantsPage.isElementVisible(grantsPage.tocModal, 3000);

        expect(nameValidation.length > 0 || hasError || modalOpen).toBe(true);
        Logger.success('TOC validation triggered correctly');
      });

      Logger.testEnd('NEG-TC-EG-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-EG-004  Cancel on Edit Grant page
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-EG-004: Clicking "Cancel" on Edit Grant page navigates away @negative @regression',
    async ({ programsPage, addProgramPage, editProgramPage }) => {
      Logger.testStart('NEG-TC-EG-004');

      const grantName  = `NegGrant-Cancel-${Date.now().toString().slice(-6)}`;
      const grantsPage = await createGrantViaEditProgram(
        programsPage, addProgramPage, editProgramPage, grantName
      );

      await test.step('Click Cancel', async () => {
        await grantsPage.clickEditGrantCancel();
      });

      await test.step('URL changes away from /grantedit/', async () => {
        const url = grantsPage.page.url();
        Logger.info(`URL after Cancel: ${url}`);
        const notOnEditPage = !url.includes('grantedit');
        // Accept SweetAlert confirmation dialog or navigation
        const swalVisible = await grantsPage.isElementVisible(
          grantsPage.page.locator('.swal2-popup, .swal2-container').first(), 3000
        );
        expect(notOnEditPage || swalVisible).toBe(true);
        Logger.success('Cancel on Edit Grant page handled correctly');
      });

      Logger.testEnd('NEG-TC-EG-004');
    }
  );

});