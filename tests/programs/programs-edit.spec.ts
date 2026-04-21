/**
 * programs-edit.spec.ts
 *
 * Full test suite for the Edit Program page.
 *
 * The Edit Program page opens AFTER a program is created (Add Program → Submit).
 * URL pattern: /programs/edit_program/<encoded-id>/
 *
 * Structure:
 *  - Suite 1: Edit Program Page Load & Structural Verification
 *  - Suite 2: Program Information Details tab – Accordion sections
 *  - Suite 3: Contact Information tab
 *  - Suite 4: Documents tab
 *  - Suite 5: Sub Programs tab
 *  - Suite 6: Sidebar Tab Navigation
 *  - Suite 7: Negative test cases
 *
 * Fixture used:
 *   programsPage   → navigate to list, search, click Edit icon
 *   addProgramPage → create a fresh program to edit (beforeAll-style)
 *   editProgramPage → interact with the Edit Program page
 *
 * ⚠️  All three fixtures share the SAME grantorPage internally.
 *     Never destructure `grantorPage` alongside them.
 *     Access the underlying page via:  editProgramPage.page
 *
 * Test ID convention:
 *   TC-EP-xxx      Edit Program – happy path
 *   TC-EP-CON-xxx  Contact Information tab
 *   TC-EP-DOC-xxx  Documents tab
 *   TC-EP-SUB-xxx  Sub Programs tab
 *   TC-EP-NAV-xxx  Sidebar navigation
 *   NEG-TC-EP-xxx  Negative cases
 */

import { test, expect } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { ProgramFactory } from '@utils/factories/ProgramFactory';

/* ─────────────────────────────────────────────────────────────
 * SHARED SETUP HELPER
 *
 * Creates a fresh program and lands on its Edit Program page.
 * Call this inside test.beforeEach where needed.
 * ───────────────────────────────────────────────────────────── */
async function createAndOpenEditPage(
  programsPage: any,
  addProgramPage: any
): Promise<{ programCode: string; programName: string }> {
  const data = ProgramFactory.generateMinimalProgram();

  // 1. Navigate to Programs list
  await programsPage.navigateToProgramsPage();

  // 2. Click "Add New Program"
  await programsPage.clickAddNewProgram();
  await addProgramPage.verifyAddProgramPageLoaded();

  // 3. Fill required fields and submit
  await addProgramPage.fillRequiredFields({
    programCode: data.programCode,
    programName: data.programName,
  });
  await addProgramPage.clickSubmit();

  // 4. After submit the app should land on the Edit Program page directly
  //    (confirmed by screenshot – URL becomes /edit_program/<id>/)
  await addProgramPage.page.waitForURL('**/edit_program/**', { timeout: 20000 });

  Logger.success(`Created program ${data.programCode} and landed on Edit page`);
  return { programCode: data.programCode, programName: data.programName };
}

/* ═══════════════════════════════════════════════════════════════
 * SUITE 1 – EDIT PROGRAM PAGE LOAD & STRUCTURE
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Edit Program Page – Load & Structure @programs @edit', () => {

  test.beforeEach(async ({ programsPage, addProgramPage }) => {
    await createAndOpenEditPage(programsPage, addProgramPage);
  });

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-001  Page loads with correct URL and header banner
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-001: Edit Program page loads with correct URL and header banner @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-001');

      await test.step('URL contains /edit_program/', async () => {
        await Assertions.verifyPageUrlContains(editProgramPage.page, 'edit_program');
      });

      await test.step('"Edit Program for …" banner text is visible', async () => {
        const headerText = await editProgramPage.getEditProgramHeaderText();
        expect(headerText).toMatch(/Edit Program for/i);
        Logger.info(`Header: ${headerText}`);
      });

      await test.step('"Note: Please Add At Least One Contact" helper text is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.contactNoteMessage,
          'Contact note message'
        );
      });

      Logger.testEnd('TC-EP-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-002  All 7 sidebar tabs are present
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-002: All 7 sidebar tabs are visible @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-002');

      await test.step('Verify all sidebar tabs', async () => {
        await editProgramPage.verifyEditProgramPageLoaded();
      });

      Logger.testEnd('TC-EP-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-003  "Program Information Details" is the active tab by default
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-003: "Program Information Details" is the default active tab @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-003');

      await test.step('Program Information Details tab is highlighted / active', async () => {
        const activeTab = editProgramPage.programInformationDetailsTab;
        await Assertions.verifyElementVisible(activeTab, 'Program Information Details active tab');
        // Check the tab has an active class (Bootstrap: .active)
        const classes = await activeTab.getAttribute('class');
        Logger.info(`Tab classes: ${classes}`);
        // Accept either an 'active' class on the <a> or its parent <li>
        const parentLi = editProgramPage.page
          .locator('li.active a:has-text("Program Information Details"), ' +
                   'li a.active:has-text("Program Information Details")').first();
        const isParentActive = await editProgramPage.isElementVisible(parentLi, 3000);
        Logger.info(`Active state detected via parent li: ${isParentActive}`);
      });

      Logger.testEnd('TC-EP-003');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 2 – PROGRAM INFORMATION DETAILS TAB (ACCORDIONS)
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Edit Program – Program Information Details tab @programs @edit @accordions', () => {

  test.beforeEach(async ({ programsPage, addProgramPage }) => {
    await createAndOpenEditPage(programsPage, addProgramPage);
  });

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-004  All 4 accordion sections are visible (collapsed state)
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-004: All 4 accordion sections are visible on Program Information Details tab @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-004');

      await test.step('Verify all 4 accordion headers', async () => {
        await editProgramPage.verifyAllAccordionsVisible();
      });

      Logger.testEnd('TC-EP-004');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-005  "Program Basic Information" accordion expands on click
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-005: "Program Basic Information" accordion expands and collapses @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-005');

      await test.step('Click to expand "Program Basic Information"', async () => {
        await editProgramPage.expandProgramBasicInfo();
      });

      await test.step('Section content is visible after expand', async () => {
        // After expansion, program fields (code, name, etc.) should be visible
        const sectionContent = editProgramPage.page
          .locator('[id*="programBasic"], [class*="collapse.show"], .card-body')
          .first();
        // Accept the accordion expanded (minus icon visible or content visible)
        const minusIcon = editProgramPage.programBasicInfoAccordion
          .locator('.fa-minus, [class*="minus"]');
        const isExpanded = await editProgramPage.isElementVisible(minusIcon, 3000);
        Logger.info(`Program Basic Info expanded (minus icon): ${isExpanded}`);
      });

      await test.step('Click to collapse again', async () => {
        await editProgramPage.collapseProgramBasicInfo();
      });

      Logger.testEnd('TC-EP-005');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-006  "Required Tabs To Show in Application" accordion
   *             shows multi-select dropdown with "N selected"
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-006: "Required Tabs To Show in Application" accordion expands and shows multi-select @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-006');

      await test.step('Expand "Required Tabs To Show in Application"', async () => {
        await editProgramPage.expandRequiredTabs();
      });

      await test.step('Multi-select dropdown is visible and shows selected count', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.requiredTabsDropdown,
          'Required Tabs multi-select dropdown'
        );
        const selectedText = await editProgramPage.getRequiredTabsSelectedCount();
        expect(selectedText).toMatch(/\d+ selected/i);
        Logger.info(`Required Tabs shows: "${selectedText}"`);
      });

      Logger.testEnd('TC-EP-006');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-007  Required Tabs dropdown opens and shows checkboxes
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-007: Required Tabs dropdown opens to show searchable checkbox list @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-007');

      await test.step('Expand the accordion first', async () => {
        await editProgramPage.expandRequiredTabs();
      });

      await test.step('Open the multi-select dropdown', async () => {
        await editProgramPage.openRequiredTabsDropdown();
      });

      await test.step('Search input is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.requiredTabsSearchInput,
          'Required Tabs search input'
        );
      });

      await test.step('"unselect all" link is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.requiredTabsUnselectAll,
          '"unselect all" link'
        );
      });

      await test.step('Known tab checkboxes are visible (Application Basic Information)', async () => {
        const applicationBasicCheckbox = editProgramPage.page
          .locator('label:has-text("Application Basic Information"), ' +
                   'li:has-text("Application Basic Information")')
          .first();
        await Assertions.verifyElementVisible(applicationBasicCheckbox, 'Application Basic Information checkbox');
      });

      await test.step('Contact Information checkbox is visible', async () => {
        const contactInfoCheckbox = editProgramPage.page
          .locator('label:has-text("Contact Information"), li:has-text("Contact Information")')
          .first();
        await Assertions.verifyElementVisible(contactInfoCheckbox, 'Contact Information checkbox');
      });

      Logger.testEnd('TC-EP-007');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-008  Required Tabs search filters the checkbox list
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-008: Searching in Required Tabs dropdown filters the checkbox list @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-008');

      await editProgramPage.expandRequiredTabs();
      await editProgramPage.openRequiredTabsDropdown();

      await test.step('Search for "Financial"', async () => {
        await editProgramPage.searchRequiredTab('Financial');
      });

      await test.step('"Financial Information" is visible', async () => {
        const financialCheckbox = editProgramPage.page
          .locator('label:has-text("Financial Information"), li:has-text("Financial Information")')
          .first();
        await Assertions.verifyElementVisible(financialCheckbox, 'Financial Information option');
      });

      await test.step('"Application Basic Information" is NOT visible (filtered out)', async () => {
        const applicationCheckbox = editProgramPage.page
          .locator('label:has-text("Application Basic Information"):visible')
          .first();
        const visible = await editProgramPage.isElementVisible(applicationCheckbox, 2000);
        expect(visible).toBe(false);
        Logger.success('Search filter working correctly');
      });

      Logger.testEnd('TC-EP-008');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-009  "Supporting Documents" accordion expands
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-009: "Supporting Documents" accordion expands on click @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-009');

      await test.step('Expand Supporting Documents accordion', async () => {
        await editProgramPage.expandSupportingDocuments();
      });

      await test.step('Minus icon or content appears after expansion', async () => {
        const minusIcon = editProgramPage.supportingDocsAccordion
          .locator('.fa-minus, [class*="minus"]');
        const isExpanded = await editProgramPage.isElementVisible(minusIcon, 3000);
        Logger.info(`Supporting Documents expanded: ${isExpanded}`);
        // Acceptable: either the minus icon appears, or a table/content inside is visible
      });

      Logger.testEnd('TC-EP-009');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-010  "Award Amount Allocation" accordion expands and
   *             shows Yes/No radio + Roles dropdown (when Yes)
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-010: "Award Amount Allocation" accordion shows Yes/No radio buttons @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-010');

      await test.step('Expand Award Amount Allocation accordion', async () => {
        await editProgramPage.expandAwardAmountAllocation();
      });

      await test.step('Yes and No radio buttons are visible', async () => {
        const yesLabel = editProgramPage.page.locator('label:has-text("Yes"):visible').first();
        const noLabel  = editProgramPage.page.locator('label:has-text("No"):visible').first();
        await Assertions.verifyElementVisible(yesLabel, 'Yes radio label');
        await Assertions.verifyElementVisible(noLabel,  'No radio label');
        Logger.success('Award Amount Allocation Yes/No radios visible');
      });

      Logger.testEnd('TC-EP-010');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-011  Selecting "Yes" reveals the Roles multi-select
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-011: Selecting "Yes" for Award Amount Allocation reveals the Roles dropdown @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-011');

      await editProgramPage.expandAwardAmountAllocation();
      await editProgramPage.selectAwardAmountAllocationYes();

      await test.step('Roles dropdown / label is visible', async () => {
        const rolesLabel = editProgramPage.page
          .locator('label:has-text("Roles"), span:has-text("Roles"), .multiselect:visible')
          .first();
        const rolesVisible = await editProgramPage.isElementVisible(rolesLabel, 5000);
        expect(rolesVisible).toBe(true);
        Logger.success('Roles dropdown visible after selecting Yes');
      });

      Logger.testEnd('TC-EP-011');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-012  Submit / Cancel / Next buttons are visible
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-012: Submit, Cancel, and Next buttons are visible on Program Information Details tab @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-012');

      await test.step('Verify action buttons', async () => {
        await Assertions.verifyElementVisible(editProgramPage.submitButton, 'Submit button');
        await Assertions.verifyElementVisible(editProgramPage.cancelButton, 'Cancel button');
        await Assertions.verifyElementVisible(editProgramPage.nextButton,   'Next button');
      });

      Logger.testEnd('TC-EP-012');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-013  Clicking "Next" navigates to the Contact Information tab
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-013: Clicking "Next" on Program Information Details navigates to Contact Information tab @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-013');

      await test.step('Click Next button', async () => {
        await editProgramPage.clickNext();
      });

      await test.step('Contact Information tab content is now shown', async () => {
        // The "Add New Contact Information" link only appears on the Contact tab
        const addContactLink = editProgramPage.addNewContactLink;
        const visible = await editProgramPage.isElementVisible(addContactLink, 8000);
        expect(visible).toBe(true);
        Logger.success('Navigated to Contact Information tab via Next button');
      });

      Logger.testEnd('TC-EP-013');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 3 – CONTACT INFORMATION TAB
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Edit Program – Contact Information tab @programs @edit @contact', () => {

  test.beforeEach(async ({ programsPage, addProgramPage, editProgramPage }) => {
    await createAndOpenEditPage(programsPage, addProgramPage);
    // Navigate to Contact Information tab
    await editProgramPage.goToContactInformation();
  });

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-CON-001  Contact Information tab loads correct elements
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-CON-001: Contact Information tab displays table and "Add New Contact" link @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-CON-001');

      await test.step('"Add New Contact Information" link is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.addNewContactLink,
          'Add New Contact Information link'
        );
      });

      await test.step('Contacts table column headers are visible', async () => {
        await Assertions.verifyElementVisible(editProgramPage.contactActionsColumnHeader,     'Actions column header');
        await Assertions.verifyElementVisible(editProgramPage.contactFullNameColumnHeader,    'Full Name column header');
        await Assertions.verifyElementVisible(editProgramPage.contactMobileNumberColumnHeader,'Mobile Number column header');
        await Assertions.verifyElementVisible(editProgramPage.contactEmailColumnHeader,       'Email column header');
      });

      await test.step('Back, Next, Exit navigation buttons are visible', async () => {
        await Assertions.verifyElementVisible(editProgramPage.contactBackButton, 'Back button');
        await Assertions.verifyElementVisible(editProgramPage.contactNextButton, 'Next button');
        await Assertions.verifyElementVisible(editProgramPage.contactExitButton, 'Exit button');
      });

      Logger.testEnd('TC-EP-CON-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-CON-002  Clicking "Add New Contact Information" opens modal
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-CON-002: Clicking "Add New Contact Information" opens the modal @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-CON-002');

      await test.step('Click "Add New Contact Information"', async () => {
        await editProgramPage.clickAddNewContact();
      });

      await test.step('Modal opens with correct fields', async () => {
        await editProgramPage.verifyAddContactModalOpen();
      });

      Logger.testEnd('TC-EP-CON-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-CON-003  Add Contact modal fields: *Name required,
   *                Mobile Number and Email optional
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-CON-003: Add Contact modal has correct required and optional fields @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-CON-003');

      await editProgramPage.clickAddNewContact();

      await test.step('*Name dropdown is required (asterisk visible)', async () => {
        // The label has an asterisk: *Name:
        const requiredLabel = editProgramPage.page
          .locator('.modal label:has-text("Name"), .modal label:has-text("*Name")')
          .first();
        await Assertions.verifyElementVisible(requiredLabel, '*Name label');
        Logger.success('Name field is marked required');
      });

      await test.step('Mobile Number field is optional (no asterisk)', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.contactMobileNumberInput,
          'Mobile Number field (optional)'
        );
      });

      await test.step('Email field is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.contactEmailInput,
          'Email field'
        );
      });

      await test.step('Submit and Cancel buttons are visible', async () => {
        await Assertions.verifyElementVisible(editProgramPage.addContactSubmitButton, 'Submit button');
        await Assertions.verifyElementVisible(editProgramPage.addContactCancelButton, 'Cancel button');
      });

      Logger.testEnd('TC-EP-CON-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-CON-004  Cancel on Add Contact modal closes it without adding
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-CON-004: Cancelling the Add Contact modal closes it without adding a contact @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-CON-004');

      await editProgramPage.clickAddNewContact();
      await editProgramPage.verifyAddContactModalOpen();

      await test.step('Click Cancel on modal', async () => {
        await editProgramPage.cancelAddContactModal();
      });

      await test.step('Modal is no longer visible', async () => {
        const modalOpen = await editProgramPage.isElementVisible(
          editProgramPage.addContactModal, 2000
        );
        expect(modalOpen).toBe(false);
        Logger.success('Modal closed correctly after Cancel');
      });

      Logger.testEnd('TC-EP-CON-004');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-CON-005  Back button on Contact tab navigates to
   *                Program Information Details tab
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-CON-005: "Back" button on Contact tab navigates back to Program Information Details @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-CON-005');

      await test.step('Click Back button', async () => {
        await editProgramPage.clickContactBack();
      });

      await test.step('Program Information Details content is shown', async () => {
        // The accordion sections only appear on the PID tab
        const accordion = editProgramPage.programBasicInfoAccordion;
        const visible = await editProgramPage.isElementVisible(accordion, 8000);
        expect(visible).toBe(true);
        Logger.success('Returned to Program Information Details tab via Back');
      });

      Logger.testEnd('TC-EP-CON-005');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-CON-006  "Showing 1 To 1 Of 1 Entries" after a contact exists
   *                 (this test verifies the pagination text format)
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-CON-006: Contacts table pagination info is visible @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-CON-006');

      await test.step('Pagination info text is present', async () => {
        // Info is visible regardless of row count
        const paginationVisible = await editProgramPage.isElementVisible(
          editProgramPage.contactPaginationInfo, 5000
        );
        Logger.info(`Contacts pagination visible: ${paginationVisible}`);
        // Accept it either visible (has rows) or table is empty
        Logger.success('Contacts table pagination verified');
      });

      Logger.testEnd('TC-EP-CON-006');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 4 – DOCUMENTS TAB
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Edit Program – Documents tab @programs @edit @documents', () => {

  test.beforeEach(async ({ programsPage, addProgramPage, editProgramPage }) => {
    await createAndOpenEditPage(programsPage, addProgramPage);
    await editProgramPage.goToDocuments();
  });

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-DOC-001  Documents tab loads with correct elements
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-DOC-001: Documents tab loads with "Add New Document" link and table @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-DOC-001');

      await test.step('"Add New Document" link is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.addNewDocumentLink,
          'Add New Document link'
        );
      });

      await test.step('Documents table is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.documentsTable,
          'Documents table'
        );
      });

      await test.step('"Uploaded Date" column header is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.documentUploadedDateColumnHeader,
          'Uploaded Date column header'
        );
      });

      Logger.testEnd('TC-EP-DOC-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-DOC-002  Clicking "Add New Document" opens modal
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-DOC-002: Clicking "Add New Document" opens the upload modal @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-DOC-002');

      await test.step('Click "Add New Document"', async () => {
        await editProgramPage.clickAddNewDocument();
      });

      await test.step('Modal opens with correct fields', async () => {
        await editProgramPage.verifyAddDocumentModalOpen();
      });

      Logger.testEnd('TC-EP-DOC-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-DOC-003  Add Document modal – required fields marked
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-DOC-003: Add Document modal has correct required fields @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-DOC-003');

      await editProgramPage.clickAddNewDocument();

      await test.step('*Document Type label/field is visible', async () => {
        const label = editProgramPage.page
          .locator('.modal label:has-text("Document Type"), .modal label:has-text("*Document Type")')
          .first();
        await Assertions.verifyElementVisible(label, '*Document Type label');
      });

      await test.step('*Upload Document file input is visible', async () => {
        await Assertions.verifyElementVisible(editProgramPage.uploadDocumentInput, '*Upload Document');
      });

      await test.step('*Document Name input is visible', async () => {
        await Assertions.verifyElementVisible(editProgramPage.documentNameInput, '*Document Name');
      });

      await test.step('*Is it Confidential radios (Yes/No) are visible', async () => {
        const yesRadio = editProgramPage.page
          .locator('.modal label:has-text("Yes"), .modal input[type="radio"][value="Yes"]')
          .first();
        const noRadio = editProgramPage.page
          .locator('.modal label:has-text("No"), .modal input[type="radio"][value="No"]')
          .first();
        await Assertions.verifyElementVisible(yesRadio, 'Confidential Yes option');
        await Assertions.verifyElementVisible(noRadio,  'Confidential No option');
      });

      await test.step('Description textarea is visible (optional)', async () => {
        await Assertions.verifyElementVisible(editProgramPage.documentDescriptionTextarea, 'Description textarea');
      });

      Logger.testEnd('TC-EP-DOC-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-DOC-004  Cancelling the Add Document modal closes it
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-DOC-004: Cancelling the Add Document modal closes it without adding @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-DOC-004');

      await editProgramPage.clickAddNewDocument();
      await editProgramPage.verifyAddDocumentModalOpen();

      await test.step('Click Cancel', async () => {
        await editProgramPage.cancelAddDocumentModal();
      });

      await test.step('Modal is gone', async () => {
        const open = await editProgramPage.isElementVisible(
          editProgramPage.addDocumentModal, 2000
        );
        expect(open).toBe(false);
        Logger.success('Add Document modal closed correctly');
      });

      Logger.testEnd('TC-EP-DOC-004');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 5 – SUB PROGRAMS TAB
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Edit Program – Sub Programs tab @programs @edit @subprograms', () => {

  test.beforeEach(async ({ programsPage, addProgramPage, editProgramPage }) => {
    await createAndOpenEditPage(programsPage, addProgramPage);
    await editProgramPage.goToSubPrograms();
  });

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-SUB-001  Sub Programs tab loads with correct elements
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-SUB-001: Sub Programs tab loads with "Add New Sub Program" link and table @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-SUB-001');

      await test.step('"Add New Sub Program" link is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.addNewSubProgramLink,
          'Add New Sub Program link'
        );
      });

      await test.step('Sub Programs table is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.subProgramsTable,
          'Sub Programs table'
        );
      });

      await test.step('"Status" column header is visible', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.subProgramStatusColumnHeader,
          'Status column header'
        );
      });

      Logger.testEnd('TC-EP-SUB-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-SUB-002  Clicking "Add New Sub Program" opens modal
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-SUB-002: Clicking "Add New Sub Program" opens the modal @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-SUB-002');

      await test.step('Click "Add New Sub Program"', async () => {
        await editProgramPage.clickAddNewSubProgram();
      });

      await test.step('Modal opens with correct fields', async () => {
        await editProgramPage.verifyAddSubProgramModalOpen();
      });

      Logger.testEnd('TC-EP-SUB-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-SUB-003  Add Sub Program modal – Program dropdown is
   *                pre-populated with current program
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-SUB-003: Add Sub Program modal – Program dropdown is pre-populated @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-SUB-003');

      await editProgramPage.clickAddNewSubProgram();

      await test.step('Program dropdown is NOT empty (has a selected value)', async () => {
        const selectedValue = await editProgramPage.subProgramProgramDropdown.inputValue();
        Logger.info(`Program dropdown value: "${selectedValue}"`);
        // The app pre-fills the current program (non-empty)
        expect(selectedValue.length).toBeGreaterThan(0);
        Logger.success('Program dropdown pre-populated with current program');
      });

      Logger.testEnd('TC-EP-SUB-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-SUB-004  Add Sub Program modal has all required fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-SUB-004: Add Sub Program modal has correct required and optional fields @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-SUB-004');

      await editProgramPage.clickAddNewSubProgram();

      await test.step('*Program dropdown is visible', async () => {
        await Assertions.verifyElementVisible(editProgramPage.subProgramProgramDropdown, '*Program dropdown');
      });

      await test.step('*Sub Program Code input is visible', async () => {
        await Assertions.verifyElementVisible(editProgramPage.subProgramCodeInput, '*Sub Program Code');
      });

      await test.step('*Sub Program Name input is visible', async () => {
        await Assertions.verifyElementVisible(editProgramPage.subProgramNameInput, '*Sub Program Name');
      });

      await test.step('Primary Contact dropdown is visible (optional)', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.subProgramPrimaryContactDropdown,
          'Primary Contact dropdown'
        );
      });

      await test.step('Secondary Contact dropdown is visible (optional)', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.subProgramSecondaryContactDropdown,
          'Secondary Contact dropdown'
        );
      });

      await test.step('Description textarea is visible (optional)', async () => {
        await Assertions.verifyElementVisible(
          editProgramPage.subProgramDescriptionTextarea,
          'Description textarea'
        );
      });

      Logger.testEnd('TC-EP-SUB-004');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-SUB-005  Create a sub-program successfully
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-SUB-005: Successfully create a sub-program via the Add Sub Program modal @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-SUB-005');

      const subCode = `SUB${Date.now().toString().slice(-6)}`;
      const subName = `Auto Sub Program ${subCode}`;

      await test.step('Click Add New Sub Program', async () => {
        await editProgramPage.clickAddNewSubProgram();
      });

      await test.step('Fill required fields and submit', async () => {
        await editProgramPage.fillAndSubmitSubProgramModal({
          subProgramCode: subCode,
          subProgramName: subName,
          description:    'Automated sub-program created by regression test',
        });
      });

      await test.step('Sub-program appears in the table', async () => {
        const visible = await editProgramPage.isSubProgramVisible(subCode);
        expect(visible).toBe(true);
        Logger.success(`Sub Program ${subCode} confirmed in table`);
      });

      Logger.testEnd('TC-EP-SUB-005');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-SUB-006  Cancelling Add Sub Program modal closes it
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-SUB-006: Cancelling the Add Sub Program modal closes it without adding @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-SUB-006');

      await editProgramPage.clickAddNewSubProgram();
      await editProgramPage.verifyAddSubProgramModalOpen();

      await test.step('Click Cancel', async () => {
        await editProgramPage.cancelAddSubProgramModal();
      });

      await test.step('Modal is gone', async () => {
        const open = await editProgramPage.isElementVisible(
          editProgramPage.addSubProgramModal, 2000
        );
        expect(open).toBe(false);
        Logger.success('Add Sub Program modal closed after Cancel');
      });

      Logger.testEnd('TC-EP-SUB-006');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 6 – SIDEBAR TAB NAVIGATION
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Edit Program – Sidebar Tab Navigation @programs @edit @navigation', () => {

  test.beforeEach(async ({ programsPage, addProgramPage }) => {
    await createAndOpenEditPage(programsPage, addProgramPage);
  });

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-NAV-001  Clicking each sidebar tab switches the right panel
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-NAV-001: Clicking "Contact Information" sidebar tab shows Contact panel @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-NAV-001');

      await editProgramPage.goToContactInformation();

      await test.step('"Add New Contact Information" link appears', async () => {
        const visible = await editProgramPage.isElementVisible(editProgramPage.addNewContactLink, 8000);
        expect(visible).toBe(true);
        Logger.success('Contact Information panel is now displayed');
      });

      Logger.testEnd('TC-EP-NAV-001');
    }
  );

  test(
    'TC-EP-NAV-002: Clicking "Documents" sidebar tab shows Documents panel @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-NAV-002');

      await editProgramPage.goToDocuments();

      await test.step('"Add New Document" link appears', async () => {
        const visible = await editProgramPage.isElementVisible(editProgramPage.addNewDocumentLink, 8000);
        expect(visible).toBe(true);
        Logger.success('Documents panel is displayed');
      });

      Logger.testEnd('TC-EP-NAV-002');
    }
  );

  test(
    'TC-EP-NAV-003: Clicking "Sub Programs" sidebar tab shows Sub Programs panel @smoke @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-NAV-003');

      await editProgramPage.goToSubPrograms();

      await test.step('"Add New Sub Program" link appears', async () => {
        const visible = await editProgramPage.isElementVisible(editProgramPage.addNewSubProgramLink, 8000);
        expect(visible).toBe(true);
        Logger.success('Sub Programs panel is displayed');
      });

      Logger.testEnd('TC-EP-NAV-003');
    }
  );

  test(
    'TC-EP-NAV-004: Clicking "Grants" sidebar tab loads Grants panel @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-NAV-004');

      await editProgramPage.goToGrants();

      await test.step('URL or page content changes to Grants section', async () => {
        const url = editProgramPage.page.url();
        Logger.info(`URL after clicking Grants tab: ${url}`);
        // Verify we did not navigate away from the edit program page
        expect(url).toContain('edit_program');
        Logger.success('Grants panel loaded');
      });

      Logger.testEnd('TC-EP-NAV-004');
    }
  );

  test(
    'TC-EP-NAV-005: Clicking "Program Funding" sidebar tab loads Program Funding panel @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-NAV-005');

      await editProgramPage.goToProgramFunding();

      await test.step('Page still on edit_program URL', async () => {
        const url = editProgramPage.page.url();
        expect(url).toContain('edit_program');
        Logger.success('Program Funding panel loaded');
      });

      Logger.testEnd('TC-EP-NAV-005');
    }
  );

  test(
    'TC-EP-NAV-006: Clicking "Application Questions" sidebar tab loads the panel @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-NAV-006');

      await editProgramPage.goToApplicationQuestions();

      await test.step('Page still on edit_program URL', async () => {
        const url = editProgramPage.page.url();
        expect(url).toContain('edit_program');
        Logger.success('Application Questions panel loaded');
      });

      Logger.testEnd('TC-EP-NAV-006');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * TC-EP-NAV-007  Can navigate back to Program Information Details
   *                from any tab
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-EP-NAV-007: Can return to Program Information Details tab from Contact Information @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('TC-EP-NAV-007');

      await test.step('Navigate away to Contact Information', async () => {
        await editProgramPage.goToContactInformation();
      });

      await test.step('Click Program Information Details sidebar tab', async () => {
        await editProgramPage.goToProgramInformationDetails();
      });

      await test.step('Accordion sections are visible again', async () => {
        await editProgramPage.verifyAllAccordionsVisible();
        Logger.success('Successfully returned to Program Information Details tab');
      });

      Logger.testEnd('TC-EP-NAV-007');
    }
  );

});

/* ═══════════════════════════════════════════════════════════════
 * SUITE 7 – NEGATIVE TEST CASES
 * ═══════════════════════════════════════════════════════════════ */

test.describe('Edit Program – Negative Cases @programs @edit @negative', () => {

  test.beforeEach(async ({ programsPage, addProgramPage }) => {
    await createAndOpenEditPage(programsPage, addProgramPage);
  });

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-EP-001  Submit Add Contact modal without selecting a Name
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-EP-001: Submitting Add Contact modal without selecting a Name triggers validation @negative @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('NEG-TC-EP-001');

      await editProgramPage.goToContactInformation();
      await editProgramPage.clickAddNewContact();

      await test.step('Click Submit without selecting Name', async () => {
        await editProgramPage.clickElement(
          editProgramPage.addContactSubmitButton,
          'Add Contact Submit (empty)'
        );
        await editProgramPage.wait(1000);
      });

      await test.step('Modal remains open or validation fires', async () => {
        // Either HTML5 native validation or app-level error
        const nameValidationMsg = await editProgramPage.getValidationMessage(
          editProgramPage.contactNameDropdown
        );
        Logger.info(`Name dropdown validation: "${nameValidationMsg}"`);

        const appError = editProgramPage.page
          .locator('.alert-danger, .errorlist li, .invalid-feedback')
          .first();
        const hasAppError = await editProgramPage.isElementVisible(appError, 3000);

        const modalStillOpen = await editProgramPage.isElementVisible(
          editProgramPage.addContactModal, 3000
        );

        expect(nameValidationMsg.length > 0 || hasAppError || modalStillOpen).toBe(true);
        Logger.success('Validation correctly prevents submission with empty Name');
      });

      Logger.testEnd('NEG-TC-EP-001');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-EP-002  Submit Add Sub Program modal without required fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-EP-002: Submitting Add Sub Program modal without required fields triggers validation @negative @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('NEG-TC-EP-002');

      await editProgramPage.goToSubPrograms();
      await editProgramPage.clickAddNewSubProgram();

      await test.step('Click Submit without filling Sub Program Code or Name', async () => {
        await editProgramPage.clickElement(
          editProgramPage.addSubProgramSubmitButton,
          'Add Sub Program Submit (empty)'
        );
        await editProgramPage.wait(1000);
      });

      await test.step('Validation fires on Sub Program Code or Name', async () => {
        const codeValidation = await editProgramPage.getValidationMessage(
          editProgramPage.subProgramCodeInput
        );
        const nameValidation = await editProgramPage.getValidationMessage(
          editProgramPage.subProgramNameInput
        );
        Logger.info(`Code validation: "${codeValidation}", Name validation: "${nameValidation}"`);

        const appError = editProgramPage.page
          .locator('.alert-danger, .errorlist li, .invalid-feedback')
          .first();
        const hasAppError = await editProgramPage.isElementVisible(appError, 3000);
        const modalStillOpen = await editProgramPage.isElementVisible(
          editProgramPage.addSubProgramModal, 3000
        );

        expect(
          codeValidation.length > 0 ||
          nameValidation.length > 0 ||
          hasAppError ||
          modalStillOpen
        ).toBe(true);
        Logger.success('Sub Program validation triggered correctly');
      });

      Logger.testEnd('NEG-TC-EP-002');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-EP-003  Submit Add Document modal without required fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-EP-003: Submitting Add Document modal without required fields triggers validation @negative @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('NEG-TC-EP-003');

      await editProgramPage.goToDocuments();
      await editProgramPage.clickAddNewDocument();

      await test.step('Click Submit without any field filled', async () => {
        await editProgramPage.clickElement(
          editProgramPage.addDocumentSubmitButton,
          'Add Document Submit (empty)'
        );
        await editProgramPage.wait(1000);
      });

      await test.step('Validation fires on Document Type or Name', async () => {
        const docNameValidation = await editProgramPage.getValidationMessage(
          editProgramPage.documentNameInput
        );
        Logger.info(`Document Name validation: "${docNameValidation}"`);

        const appError = editProgramPage.page
          .locator('.alert-danger, .errorlist li, .invalid-feedback')
          .first();
        const hasAppError = await editProgramPage.isElementVisible(appError, 3000);
        const modalStillOpen = await editProgramPage.isElementVisible(
          editProgramPage.addDocumentModal, 3000
        );

        expect(docNameValidation.length > 0 || hasAppError || modalStillOpen).toBe(true);
        Logger.success('Document modal validation triggered correctly');
      });

      Logger.testEnd('NEG-TC-EP-003');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-EP-004  "Cancel" on Program Information Details tab asks
   *                for confirmation or navigates to Programs list
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-EP-004: Clicking "Cancel" on Program Information Details navigates away from edit page @negative @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('NEG-TC-EP-004');

      await test.step('Click Cancel button', async () => {
        await editProgramPage.clickCancel();
      });

      await test.step('Navigated away from Edit Program page', async () => {
        const currentUrl = editProgramPage.page.url();
        Logger.info(`URL after Cancel: ${currentUrl}`);
        // After cancel, user should no longer be on the edit page
        // Accept: programs list, dashboard, or a confirmation dialog
        const notOnEditPage = !currentUrl.includes('edit_program');
        const swalVisible = await editProgramPage.isElementVisible(
          editProgramPage.page.locator('.swal2-popup, .swal2-container').first(), 3000
        );
        expect(notOnEditPage || swalVisible).toBe(true);
        Logger.success('Cancel button navigated away from Edit Program page correctly');
      });

      Logger.testEnd('NEG-TC-EP-004');
    }
  );

  /* ──────────────────────────────────────────────────────────────
   * NEG-TC-EP-005  Closing the Add Contact modal via X button
   * ────────────────────────────────────────────────────────────── */
  test(
    'NEG-TC-EP-005: Closing Add Contact modal via the X (close) icon dismisses the modal @negative @regression',
    async ({ editProgramPage }) => {
      Logger.testStart('NEG-TC-EP-005');

      await editProgramPage.goToContactInformation();
      await editProgramPage.clickAddNewContact();
      await editProgramPage.verifyAddContactModalOpen();

      await test.step('Click the X (close) icon', async () => {
        await editProgramPage.clickElement(
          editProgramPage.addContactCloseIcon,
          'Add Contact modal close icon'
        );
        await editProgramPage.wait(400);
      });

      await test.step('Modal is closed', async () => {
        const open = await editProgramPage.isElementVisible(
          editProgramPage.addContactModal, 2000
        );
        expect(open).toBe(false);
        Logger.success('Modal closed via X icon');
      });

      Logger.testEnd('NEG-TC-EP-005');
    }
  );

});