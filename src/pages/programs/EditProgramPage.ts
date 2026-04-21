import { Page, Locator } from '@playwright/test';
import { SharedComponents } from '../base/SharedComponents';
import { Logger } from '../../utils/logger';

/**
 * EditProgramPage
 * URL pattern: /programs/edit_program/<encoded-id>/
 *
 * Layout (from screenshots):
 *
 *  Left sidebar (7 tabs)
 *  ┌────────────────────────────┐
 *  │ ● Program Information      │  ← active tab (dark background)
 *  │   Details                  │
 *  │   Contact Information      │
 *  │   Documents                │
 *  │   Sub Programs             │
 *  │   Grants                   │
 *  │   Program Funding          │
 *  │   Application Questions    │
 *  └────────────────────────────┘
 *
 *  Right panel – "Program Information Details" (dark-navy header)
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  [+] Program Basic Information          ← collapsible        │
 *  │  [+] Required Tabs To Show in Application                    │
 *  │  [+] Supporting Documents                                    │
 *  │  [+] Award Amount Allocation                                 │
 *  │                                                              │
 *  │          [Submit]  [Cancel]  [Next]                          │
 *  └──────────────────────────────────────────────────────────────┘
 *
 *  Contact Information tab:
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  "Add New Contact Information" link (top-right)              │
 *  │  Table: Actions | Full Name | Mobile Number | Email          │
 *  │  [Back]  [Next]  [Exit]                                      │
 *  └──────────────────────────────────────────────────────────────┘
 *
 *  Add Contact Information modal:
 *  ┌──────────────────────────────┐
 *  │  *Name: [--Select--] ▼       │   Mobile Number: [          ] │
 *  │   Email: [          ]        │
 *  │          [Submit]  [Cancel]  │
 *  └──────────────────────────────┘
 *
 *  Documents tab:
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  "Add New Document" link (top-right)                         │
 *  │  Table: Actions | Uploaded Date                              │
 *  └──────────────────────────────────────────────────────────────┘
 *
 *  Add Document modal:
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  *Document Type: [--Select--]  *Upload Document: [Choose]   │
 *  │  *Document Name: [          ]                                │
 *  │  *Is it Confidential: ○ Yes  ○ No                           │
 *  │   Description: [textarea]                                   │
 *  │          [Submit]  [Cancel]                                 │
 *  └──────────────────────────────────────────────────────────────┘
 *
 *  Sub Programs tab:
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  "Add New Sub Program" link (top-right)                      │
 *  │  Table: Actions | Status                                     │
 *  └──────────────────────────────────────────────────────────────┘
 *
 *  Add Sub Program modal:
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  *Program: [FY-26-27-Test Program] ▼   *Sub Program Code: [ ]│
 *  │  *Sub Program Name: [              ]                         │
 *  │   Primary Contact: [--Select--]   Secondary Contact: [     ] │
 *  │   Description: [textarea]                                    │
 *  │          [Submit]  [Cancel]                                  │
 *  └──────────────────────────────────────────────────────────────┘
 *
 * Fixtures wiring (AuthFixtures.ts):
 *   editProgramPage: async ({ grantorPage }, use) => {
 *     await use(new EditProgramPage(grantorPage));
 *   }
 */
export class EditProgramPage extends SharedComponents {

  /* ═══════════════════════════════════════════════════════════
   * PAGE HEADER
   * ═══════════════════════════════════════════════════════════ */

  /** "Edit Program for <ProgramName>" banner at the top */
  readonly pageHeader: Locator;

  /** "Note:Please Add At Least One Contact" helper text (top-right) */
  readonly contactNoteMessage: Locator;

  /* ═══════════════════════════════════════════════════════════
   * LEFT SIDEBAR TABS
   * ═══════════════════════════════════════════════════════════ */

  readonly programInformationDetailsTab: Locator;
  readonly contactInformationTab: Locator;
  readonly documentsTab: Locator;
  readonly subProgramsTab: Locator;
  readonly grantsTab: Locator;
  readonly programFundingTab: Locator;
  readonly applicationQuestionsTab: Locator;

  /* ═══════════════════════════════════════════════════════════
   * PROGRAM INFORMATION DETAILS TAB
   * Accordion / collapsible sections (toggled with + / - icon)
   * ═══════════════════════════════════════════════════════════ */

  /** Collapsible header rows – click to expand/collapse */
  readonly programBasicInfoAccordion: Locator;
  readonly requiredTabsAccordion: Locator;
  readonly supportingDocsAccordion: Locator;
  readonly awardAmountAllocationAccordion: Locator;

  /* ── Required Tabs To Show in Application ─────────────────── */

  /**
   * Multi-select dropdown showing "18 selected" (or N selected).
   * Opens a searchable checkbox list with tab names.
   */
  readonly requiredTabsDropdown: Locator;

  /** Search box inside the Required Tabs dropdown */
  readonly requiredTabsSearchInput: Locator;

  /** "unselect all" link inside the Required Tabs dropdown */
  readonly requiredTabsUnselectAll: Locator;

  /* ── Award Amount Allocation ──────────────────────────────── */

  /** "Yes" radio – allow modify 'Amount Allocation' field */
  readonly awardAmountAllocationYes: Locator;
  /** "No" radio – do NOT allow modify */
  readonly awardAmountAllocationNo: Locator;

  /**
   * Roles multi-select dropdown (shown when 'Yes' is selected).
   * Screenshot shows "1 selected" with "Grant Coordinator" checked.
   */
  readonly awardAmountRolesDropdown: Locator;

  /* ── Program Information Details – action buttons ─────────── */

  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly nextButton: Locator;

  /* ═══════════════════════════════════════════════════════════
   * CONTACT INFORMATION TAB
   * ═══════════════════════════════════════════════════════════ */

  /** Section header inside the right panel */
  readonly contactInformationPanelHeader: Locator;

  /** "Add New Contact Information" link (top-right of contacts panel) */
  readonly addNewContactLink: Locator;

  /** Contacts DataTable */
  readonly contactsTable: Locator;

  /** Column headers */
  readonly contactActionsColumnHeader: Locator;
  readonly contactFullNameColumnHeader: Locator;
  readonly contactMobileNumberColumnHeader: Locator;
  readonly contactEmailColumnHeader: Locator;

  /** Inline filter rows (below column headers) */
  readonly contactFullNameFilterInput: Locator;
  readonly contactMobileFilterInput: Locator;
  readonly contactEmailFilterInput: Locator;

  /** Pagination on contacts table */
  readonly contactPaginationInfo: Locator;

  /** Contact tab navigation buttons */
  readonly contactBackButton: Locator;
  readonly contactNextButton: Locator;
  readonly contactExitButton: Locator;

  /* ── Add Contact Information Modal ───────────────────────── */

  readonly addContactModal: Locator;
  readonly addContactModalTitle: Locator;

  /**
   * *Name: dropdown (required) – lists existing staff/users
   * Screenshot shows "---Select---" placeholder
   */
  readonly contactNameDropdown: Locator;

  /** Mobile Number: text input (optional) */
  readonly contactMobileNumberInput: Locator;

  /** Email: text input (optional, auto-fills when name is selected) */
  readonly contactEmailInput: Locator;

  /** Modal submit & cancel */
  readonly addContactSubmitButton: Locator;
  readonly addContactCancelButton: Locator;
  readonly addContactCloseIcon: Locator;

  /* ═══════════════════════════════════════════════════════════
   * DOCUMENTS TAB
   * ═══════════════════════════════════════════════════════════ */

  /** Section header inside the right panel */
  readonly documentsPanelHeader: Locator;

  /** "Add New Document" link (top-right of documents panel) */
  readonly addNewDocumentLink: Locator;

  /** Documents DataTable */
  readonly documentsTable: Locator;

  /** Document table column headers */
  readonly documentActionsColumnHeader: Locator;
  readonly documentUploadedDateColumnHeader: Locator;

  /** Pagination info on documents table */
  readonly documentPaginationInfo: Locator;

  /* ── Add Document Modal ───────────────────────────────────── */

  readonly addDocumentModal: Locator;
  readonly addDocumentModalTitle: Locator;

  /**
   * *Document Type: dropdown (required)
   * Screenshot: "--Select--" placeholder
   */
  readonly documentTypeDropdown: Locator;

  /**
   * *Upload Document: file input (required)
   * Screenshot: "Choose file  No file chosen"
   */
  readonly uploadDocumentInput: Locator;

  /**
   * *Document Name: text input (required)
   */
  readonly documentNameInput: Locator;

  /**
   * *Is it Confidential: radio buttons (required)
   * Screenshot: ○ Yes  ○ No
   */
  readonly documentConfidentialYes: Locator;
  readonly documentConfidentialNo: Locator;

  /** Description: textarea (optional) */
  readonly documentDescriptionTextarea: Locator;

  /** Modal submit & cancel */
  readonly addDocumentSubmitButton: Locator;
  readonly addDocumentCancelButton: Locator;
  readonly addDocumentCloseIcon: Locator;

  /* ═══════════════════════════════════════════════════════════
   * SUB PROGRAMS TAB
   * ═══════════════════════════════════════════════════════════ */

  /** Section header inside the right panel */
  readonly subProgramsPanelHeader: Locator;

  /** "Add New Sub Program" link (top-right of sub programs panel) */
  readonly addNewSubProgramLink: Locator;

  /** Sub Programs DataTable */
  readonly subProgramsTable: Locator;

  /** Sub Programs column headers */
  readonly subProgramActionsColumnHeader: Locator;
  readonly subProgramStatusColumnHeader: Locator;

  /** Pagination info on sub programs table */
  readonly subProgramPaginationInfo: Locator;

  /* ── Add Sub Program Modal ────────────────────────────────── */

  readonly addSubProgramModal: Locator;
  readonly addSubProgramModalTitle: Locator;

  /**
   * *Program: dropdown (pre-filled with current program, e.g. "FY-26-27 - Test Program")
   */
  readonly subProgramProgramDropdown: Locator;

  /**
   * *Sub Program Code: text input (required)
   */
  readonly subProgramCodeInput: Locator;

  /**
   * *Sub Program Name: text input (required)
   */
  readonly subProgramNameInput: Locator;

  /**
   * Primary Contact: dropdown (optional) – "---Select---"
   */
  readonly subProgramPrimaryContactDropdown: Locator;

  /**
   * Secondary Contact: dropdown (optional) – "---Select---"
   */
  readonly subProgramSecondaryContactDropdown: Locator;

  /** Description: textarea (optional) */
  readonly subProgramDescriptionTextarea: Locator;

  /** Modal submit & cancel */
  readonly addSubProgramSubmitButton: Locator;
  readonly addSubProgramCancelButton: Locator;
  readonly addSubProgramCloseIcon: Locator;

  /* ═══════════════════════════════════════════════════════════
   * CONSTRUCTOR
   * ═══════════════════════════════════════════════════════════ */

  constructor(page: Page) {
    super(page);

    /* ── Page header ── */
    this.pageHeader = page.locator(
      '.breadcrumb-item.active, h2:has-text("Edit Program"), div.page-header:has-text("Edit Program")'
    ).first();
    this.contactNoteMessage = page.locator('text=/Note.*Please Add At Least One Contact/i').first();

    /* ── Sidebar tabs ──
     * The sidebar uses a list-based nav. Text matching is the safest
     * selector because the app doesn't expose data-* attributes. */
    this.programInformationDetailsTab = page
      .locator('ul.nav-pills li a, ul.nav li a, aside li a, .left-nav li a')
      .filter({ hasText: 'Program Information Details' })
      .first();

    this.contactInformationTab = page
      .locator('ul.nav-pills li a, ul.nav li a, aside li a, .left-nav li a')
      .filter({ hasText: 'Contact Information' })
      .first();

    this.documentsTab = page
      .locator('ul.nav-pills li a, ul.nav li a, aside li a, .left-nav li a')
      .filter({ hasText: 'Documents' })
      .first();

    this.subProgramsTab = page
      .locator('ul.nav-pills li a, ul.nav li a, aside li a, .left-nav li a')
      .filter({ hasText: 'Sub Programs' })
      .first();

    this.grantsTab = page
      .locator('ul.nav-pills li a, ul.nav li a, aside li a, .left-nav li a')
      .filter({ hasText: 'Grants' })
      .first();

    this.programFundingTab = page
      .locator('ul.nav-pills li a, ul.nav li a, aside li a, .left-nav li a')
      .filter({ hasText: 'Program Funding' })
      .first();

    this.applicationQuestionsTab = page
      .locator('ul.nav-pills li a, ul.nav li a, aside li a, .left-nav li a')
      .filter({ hasText: 'Application Questions' })
      .first();

    /* ── Program Information Details accordions ── */
    this.programBasicInfoAccordion = page
      .locator('div.card-header, .accordion-header, [data-toggle="collapse"]')
      .filter({ hasText: 'Program Basic Information' })
      .first();

    this.requiredTabsAccordion = page
      .locator('div.card-header, .accordion-header, [data-toggle="collapse"]')
      .filter({ hasText: 'Required Tabs To Show in Application' })
      .first();

    this.supportingDocsAccordion = page
      .locator('div.card-header, .accordion-header, [data-toggle="collapse"]')
      .filter({ hasText: 'Supporting Documents' })
      .first();

    this.awardAmountAllocationAccordion = page
      .locator('div.card-header, .accordion-header, [data-toggle="collapse"]')
      .filter({ hasText: 'Award Amount Allocation' })
      .first();

    /* ── Required Tabs multi-select ── */
    this.requiredTabsDropdown = page
      .locator('.multiselect-container, div.multiselect, [class*="multiselect"]')
      .first();
    this.requiredTabsSearchInput = page
      .locator('input[placeholder="Search Required Tabs"], .multiselect__input')
      .first();
    this.requiredTabsUnselectAll = page.locator('a:has-text("unselect all")').first();

    /* ── Award Amount Allocation radios ── */
    this.awardAmountAllocationYes = page
      .locator('input[type="radio"][value="Yes"], input[type="radio"]')
      .filter({ hasText: '' })
      .nth(0);
    // Use a more robust selector based on context
    this.awardAmountAllocationYes = page.locator(
      'label:has-text("Yes") input[type="radio"], input[type="radio"] + label:has-text("Yes")'
    ).first();
    this.awardAmountAllocationNo = page.locator(
      'label:has-text("No") input[type="radio"], input[type="radio"] + label:has-text("No")'
    ).first();
    this.awardAmountRolesDropdown = page.locator(
      'select[name*="role"], select[name*="Role"], .multiselect[id*="role"]'
    ).first();

    /* ── Program Information Details buttons ── */
    this.submitButton = page.locator('button:has-text("Submit")').first();
    this.cancelButton = page.locator('button:has-text("Cancel")').first();
    this.nextButton   = page.locator('button:has-text("Next")').first();

    /* ═══ CONTACT INFORMATION TAB ═══ */
    this.contactInformationPanelHeader = page
      .locator('.card-header, .panel-heading, h4, h5')
      .filter({ hasText: 'Contact Information' })
      .first();

    this.addNewContactLink = page
      .locator('a.link-btn, a[class*="link"]')
      .filter({ hasText: 'Add New Contact Information' })
      .first();

    this.contactsTable = page.locator('table').filter({
      has: page.locator('th:has-text("Full Name")')
    }).first();

    this.contactActionsColumnHeader     = page.locator('th:has-text("Actions")').first();
    this.contactFullNameColumnHeader    = page.locator('th:has-text("Full Name")').first();
    this.contactMobileNumberColumnHeader = page.locator('th:has-text("Mobile Number")').first();
    this.contactEmailColumnHeader       = page.locator('th:has-text("Email")').first();

    this.contactFullNameFilterInput  = page.locator('th:has-text("Full Name") ~ th input, input[placeholder="Full Name"]').first();
    this.contactMobileFilterInput    = page.locator('input[placeholder="Mobile Number"]').first();
    this.contactEmailFilterInput     = page.locator('input[placeholder="Email"]').first();

    this.contactPaginationInfo = page.locator('text=/Showing \\d+ To \\d+ Of \\d+ Entries/i').first();

    this.contactBackButton = page.locator('a:has-text("Back"), button:has-text("Back")').first();
    this.contactNextButton = page.locator('a:has-text("Next"), button:has-text("Next")').nth(1);
    this.contactExitButton = page.locator('a:has-text("Exit"), button:has-text("Exit")').first();

    /* ── Add Contact Modal ── */
    this.addContactModal      = page.locator('.modal:visible, #contactModal, [id*="contact"][class*="modal"]').first();
    this.addContactModalTitle = page.locator('.modal-title:has-text("Add Contact Information"), .modal-header h5').first();

    this.contactNameDropdown = page.locator(
      '.modal select[name="name"], .modal select[id*="name"], .modal select'
    ).first();
    this.contactMobileNumberInput = page.locator(
      '.modal input[name*="mobile"], .modal input[placeholder*="Mobile"], .modal input[type="text"]'
    ).nth(0);
    this.contactEmailInput = page.locator(
      '.modal input[name*="email"], .modal input[placeholder*="Email"], .modal input[type="email"]'
    ).first();

    this.addContactSubmitButton = page.locator(
      '.modal button:has-text("Submit"), .modal input[type="submit"]'
    ).first();
    this.addContactCancelButton = page.locator(
      '.modal button:has-text("Cancel")'
    ).first();
    this.addContactCloseIcon = page.locator(
      '.modal .close, .modal button[aria-label="Close"], .modal .btn-close'
    ).first();

    /* ═══ DOCUMENTS TAB ═══ */
    this.documentsPanelHeader = page
      .locator('.card-header, .panel-heading, h4, h5')
      .filter({ hasText: 'Documents' })
      .first();

    this.addNewDocumentLink = page
      .locator('a.link-btn, a[class*="link"]')
      .filter({ hasText: 'Add New Document' })
      .first();

    this.documentsTable = page.locator('table').filter({
      has: page.locator('th:has-text("Uploaded Date")')
    }).first();

    this.documentActionsColumnHeader      = page.locator('th:has-text("Actions")').nth(1);
    this.documentUploadedDateColumnHeader = page.locator('th:has-text("Uploaded Date")').first();

    this.documentPaginationInfo = page.locator('text=/Showing \\d+ To \\d+ Of \\d+ Entries/i').nth(1);

    /* ── Add Document Modal ── */
    this.addDocumentModal      = page.locator('.modal:visible').first();
    this.addDocumentModalTitle = page.locator('.modal-title:has-text("Add Document")').first();

    this.documentTypeDropdown = page.locator(
      '.modal select[name*="doc_type"], .modal select[name*="document_type"], .modal select'
    ).first();
    this.uploadDocumentInput = page.locator(
      '.modal input[type="file"]'
    ).first();
    this.documentNameInput = page.locator(
      '.modal input[name*="doc_name"], .modal input[name*="document_name"], .modal input[type="text"]'
    ).first();
    this.documentConfidentialYes = page.locator(
      '.modal input[type="radio"][value="Yes"], .modal label:has-text("Yes") input'
    ).first();
    this.documentConfidentialNo = page.locator(
      '.modal input[type="radio"][value="No"], .modal label:has-text("No") input'
    ).first();
    this.documentDescriptionTextarea = page.locator(
      '.modal textarea[name*="description"], .modal textarea'
    ).first();

    this.addDocumentSubmitButton = page.locator(
      '.modal button:has-text("Submit"), .modal input[type="submit"]'
    ).first();
    this.addDocumentCancelButton = page.locator(
      '.modal button:has-text("Cancel")'
    ).first();
    this.addDocumentCloseIcon = page.locator(
      '.modal .close, .modal button[aria-label="Close"], .modal .btn-close'
    ).first();

    /* ═══ SUB PROGRAMS TAB ═══ */
    this.subProgramsPanelHeader = page
      .locator('.card-header, .panel-heading, h4, h5')
      .filter({ hasText: 'Sub Programs' })
      .first();

    this.addNewSubProgramLink = page
      .locator('a.link-btn, a[class*="link"]')
      .filter({ hasText: 'Add New Sub Program' })
      .first();

    this.subProgramsTable = page.locator('table').filter({
      has: page.locator('th:has-text("Status")')
    }).first();

    this.subProgramActionsColumnHeader = page.locator('th:has-text("Actions")').first();
    this.subProgramStatusColumnHeader  = page.locator('th:has-text("Status")').first();

    this.subProgramPaginationInfo = page.locator('text=/Showing \\d+ To \\d+ Of \\d+ Entries/i').first();

    /* ── Add Sub Program Modal ── */
    this.addSubProgramModal      = page.locator('.modal:visible').first();
    this.addSubProgramModalTitle = page.locator('.modal-title:has-text("Add Sub Program")').first();

    this.subProgramProgramDropdown = page.locator(
      '.modal select[name="program"], .modal select[name*="program"]'
    ).first();
    this.subProgramCodeInput = page.locator(
      '.modal input[name*="sub_program_code"], .modal input[name*="code"]'
    ).first();
    this.subProgramNameInput = page.locator(
      '.modal input[name*="sub_program_name"], .modal input[name*="name"]'
    ).first();
    this.subProgramPrimaryContactDropdown = page.locator(
      '.modal select[name*="primary"], .modal select'
    ).nth(1);
    this.subProgramSecondaryContactDropdown = page.locator(
      '.modal select[name*="secondary"], .modal select'
    ).nth(2);
    this.subProgramDescriptionTextarea = page.locator(
      '.modal textarea'
    ).first();

    this.addSubProgramSubmitButton = page.locator(
      '.modal button:has-text("Submit"), .modal input[type="submit"]'
    ).first();
    this.addSubProgramCancelButton = page.locator(
      '.modal button:has-text("Cancel")'
    ).first();
    this.addSubProgramCloseIcon = page.locator(
      '.modal .close, .modal button[aria-label="Close"], .modal .btn-close'
    ).first();
  }

  /* ═══════════════════════════════════════════════════════════
   * NAVIGATION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Click the "Program Information Details" sidebar tab.
   * This is the default active tab when the Edit Program page opens.
   */
  async goToProgramInformationDetails(): Promise<void> {
    Logger.step('Navigating to Program Information Details tab');
    await this.clickElement(this.programInformationDetailsTab, 'Program Information Details tab');
    await this.waitForPageLoad();
    Logger.success('On Program Information Details tab');
  }

  async goToContactInformation(): Promise<void> {
    Logger.step('Navigating to Contact Information tab');
    await this.clickElement(this.contactInformationTab, 'Contact Information tab');
    await this.waitForPageLoad();
    Logger.success('On Contact Information tab');
  }

  async goToDocuments(): Promise<void> {
    Logger.step('Navigating to Documents tab');
    await this.clickElement(this.documentsTab, 'Documents tab');
    await this.waitForPageLoad();
    Logger.success('On Documents tab');
  }

  async goToSubPrograms(): Promise<void> {
    Logger.step('Navigating to Sub Programs tab');
    await this.clickElement(this.subProgramsTab, 'Sub Programs tab');
    await this.waitForPageLoad();
    Logger.success('On Sub Programs tab');
  }

  async goToGrants(): Promise<void> {
    Logger.step('Navigating to Grants tab');
    await this.clickElement(this.grantsTab, 'Grants tab');
    await this.waitForPageLoad();
    Logger.success('On Grants tab');
  }

  async goToProgramFunding(): Promise<void> {
    Logger.step('Navigating to Program Funding tab');
    await this.clickElement(this.programFundingTab, 'Program Funding tab');
    await this.waitForPageLoad();
    Logger.success('On Program Funding tab');
  }

  async goToApplicationQuestions(): Promise<void> {
    Logger.step('Navigating to Application Questions tab');
    await this.clickElement(this.applicationQuestionsTab, 'Application Questions tab');
    await this.waitForPageLoad();
    Logger.success('On Application Questions tab');
  }

  /* ═══════════════════════════════════════════════════════════
   * ACCORDION HELPERS – Program Information Details tab
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Expand an accordion section by clicking its header row.
   * Uses the minus icon presence to decide if already expanded.
   */
  private async expandAccordion(header: Locator, sectionName: string): Promise<void> {
    Logger.step(`Expanding accordion: "${sectionName}"`);
    const minusIcon = header.locator('.fa-minus, [class*="minus"]');
    const isExpanded = await minusIcon.isVisible({ timeout: 1500 }).catch(() => false);
    if (!isExpanded) {
      await header.click();
      await this.wait(400);
      Logger.success(`"${sectionName}" accordion expanded`);
    } else {
      Logger.info(`"${sectionName}" accordion already expanded`);
    }
  }

  private async collapseAccordion(header: Locator, sectionName: string): Promise<void> {
    Logger.step(`Collapsing accordion: "${sectionName}"`);
    const minusIcon = header.locator('.fa-minus, [class*="minus"]');
    const isExpanded = await minusIcon.isVisible({ timeout: 1500 }).catch(() => false);
    if (isExpanded) {
      await header.click();
      await this.wait(400);
      Logger.success(`"${sectionName}" accordion collapsed`);
    } else {
      Logger.info(`"${sectionName}" accordion already collapsed`);
    }
  }

  async expandProgramBasicInfo(): Promise<void> {
    await this.expandAccordion(this.programBasicInfoAccordion, 'Program Basic Information');
  }

  async collapseProgramBasicInfo(): Promise<void> {
    await this.collapseAccordion(this.programBasicInfoAccordion, 'Program Basic Information');
  }

  async expandRequiredTabs(): Promise<void> {
    await this.expandAccordion(this.requiredTabsAccordion, 'Required Tabs To Show in Application');
  }

  async collapseRequiredTabs(): Promise<void> {
    await this.collapseAccordion(this.requiredTabsAccordion, 'Required Tabs To Show in Application');
  }

  async expandSupportingDocuments(): Promise<void> {
    await this.expandAccordion(this.supportingDocsAccordion, 'Supporting Documents');
  }

  async collapseSupportingDocuments(): Promise<void> {
    await this.collapseAccordion(this.supportingDocsAccordion, 'Supporting Documents');
  }

  async expandAwardAmountAllocation(): Promise<void> {
    await this.expandAccordion(this.awardAmountAllocationAccordion, 'Award Amount Allocation');
  }

  async collapseAwardAmountAllocation(): Promise<void> {
    await this.collapseAccordion(this.awardAmountAllocationAccordion, 'Award Amount Allocation');
  }

  /* ═══════════════════════════════════════════════════════════
   * REQUIRED TABS MULTI-SELECT HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Open the Required Tabs dropdown if it is not already open.
   */
  async openRequiredTabsDropdown(): Promise<void> {
    Logger.step('Opening Required Tabs dropdown');
    await this.requiredTabsDropdown.click();
    await this.wait(300);
    Logger.success('Required Tabs dropdown opened');
  }

  /**
   * Get the text shown in the Required Tabs button (e.g. "18 selected").
   */
  async getRequiredTabsSelectedCount(): Promise<string> {
    const text = await this.requiredTabsDropdown.textContent();
    Logger.info(`Required Tabs selection: ${text?.trim()}`);
    return text?.trim() || '';
  }

  /**
   * Search for a tab name inside the multi-select dropdown.
   * Caller must first call openRequiredTabsDropdown().
   */
  async searchRequiredTab(tabName: string): Promise<void> {
    Logger.step(`Searching for tab: "${tabName}"`);
    await this.fillInput(this.requiredTabsSearchInput, tabName, 'Required Tabs search');
  }

  /**
   * Check whether a specific tab checkbox is currently checked.
   * Call openRequiredTabsDropdown() first.
   */
  async isRequiredTabChecked(tabName: string): Promise<boolean> {
    const checkbox = this.page.locator(
      `label:has-text("${tabName}") input[type="checkbox"], ` +
      `li:has-text("${tabName}") input[type="checkbox"]`
    ).first();
    return checkbox.isChecked();
  }

  /**
   * Toggle (check/uncheck) a specific tab in the multi-select dropdown.
   */
  async toggleRequiredTab(tabName: string): Promise<void> {
    Logger.step(`Toggling required tab: "${tabName}"`);
    const checkbox = this.page.locator(
      `label:has-text("${tabName}") input[type="checkbox"], ` +
      `li:has-text("${tabName}") input[type="checkbox"]`
    ).first();
    await checkbox.click();
    Logger.success(`Tab "${tabName}" toggled`);
  }

  /**
   * Click "unselect all" inside the Required Tabs dropdown.
   */
  async unselectAllRequiredTabs(): Promise<void> {
    Logger.step('Clicking "unselect all" in Required Tabs dropdown');
    await this.clickElement(this.requiredTabsUnselectAll, 'unselect all link');
    Logger.success('All required tabs unselected');
  }

  /* ═══════════════════════════════════════════════════════════
   * AWARD AMOUNT ALLOCATION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Select "Yes" for the Award Amount Allocation option.
   * This reveals the Roles dropdown.
   */
  async selectAwardAmountAllocationYes(): Promise<void> {
    Logger.step('Selecting Award Amount Allocation: Yes');
    // Scope to the accordion content area to avoid modal radio conflicts
    const yesRadio = this.page.locator(
      'input[type="radio"][value="1"], label:has-text("Yes") input[type="radio"]'
    ).first();
    await yesRadio.check();
    await this.wait(300);
    Logger.success('Award Amount Allocation set to Yes');
  }

  async selectAwardAmountAllocationNo(): Promise<void> {
    Logger.step('Selecting Award Amount Allocation: No');
    const noRadio = this.page.locator(
      'input[type="radio"][value="0"], label:has-text("No") input[type="radio"]'
    ).first();
    await noRadio.check();
    await this.wait(300);
    Logger.success('Award Amount Allocation set to No');
  }

  /* ═══════════════════════════════════════════════════════════
   * PROGRAM INFORMATION DETAILS – ACTION BUTTONS
   * ═══════════════════════════════════════════════════════════ */

  async clickSubmit(): Promise<void> {
    Logger.step('Clicking Submit on Program Information Details');
    await this.clickElement(this.submitButton, 'Submit button');
    await this.waitForPageLoad();
  }

  async clickCancel(): Promise<void> {
    Logger.step('Clicking Cancel on Program Information Details');
    await this.clickElement(this.cancelButton, 'Cancel button');
    await this.waitForPageLoad();
  }

  async clickNext(): Promise<void> {
    Logger.step('Clicking Next on Program Information Details');
    await this.clickElement(this.nextButton, 'Next button');
    await this.waitForPageLoad();
  }

  /* ═══════════════════════════════════════════════════════════
   * CONTACT INFORMATION – ACTION METHODS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Click "Add New Contact Information" to open the modal.
   * Waits for the modal to appear before returning.
   */
  async clickAddNewContact(): Promise<void> {
    Logger.step('Clicking "Add New Contact Information"');
    await this.clickElement(this.addNewContactLink, 'Add New Contact Information link');
    await this.page.waitForSelector('.modal:visible', { timeout: 10000 });
    Logger.success('Add Contact Information modal opened');
  }

  /**
   * Fill and submit the Add Contact Information modal.
   * @param nameValue – the value/label to select from the Name dropdown
   * @param mobileNumber – optional mobile number
   * @param email – optional email (may auto-fill when name is selected)
   */
  async fillAndSubmitContactModal(data: {
    nameValue: string;
    mobileNumber?: string;
    email?: string;
  }): Promise<void> {
    Logger.step(`Adding contact: "${data.nameValue}"`);

    await this.contactNameDropdown.waitFor({ state: 'visible', timeout: 8000 });
    await this.contactNameDropdown.selectOption({ label: data.nameValue });
    await this.wait(400); // allow auto-fill of email

    if (data.mobileNumber) {
      await this.fillInput(this.contactMobileNumberInput, data.mobileNumber, 'Mobile Number');
    }
    if (data.email) {
      await this.fillInput(this.contactEmailInput, data.email, 'Email');
    }

    await this.clickElement(this.addContactSubmitButton, 'Add Contact Submit');
    await this.page.waitForSelector('.modal:visible', { state: 'hidden', timeout: 10000 });
    await this.wait(600); // DataTable refresh
    Logger.success(`Contact "${data.nameValue}" added`);
  }

  /**
   * Close the Add Contact modal by clicking Cancel.
   */
  async cancelAddContactModal(): Promise<void> {
    Logger.step('Cancelling Add Contact modal');
    await this.clickElement(this.addContactCancelButton, 'Add Contact Cancel button');
    await this.wait(400);
    Logger.success('Add Contact modal cancelled');
  }

  /**
   * Returns the row locator for a contact by full name.
   */
  getContactRowByName(fullName: string): Locator {
    return this.page.locator(`tr:has-text("${fullName}")`).first();
  }

  /**
   * Returns true when a row with the given name is visible in the contacts table.
   */
  async isContactVisible(fullName: string): Promise<boolean> {
    return this.isElementVisible(this.getContactRowByName(fullName), 5000);
  }

  /**
   * Click the Edit icon for a specific contact row.
   */
  async editContact(fullName: string): Promise<void> {
    Logger.step(`Clicking Edit for contact: "${fullName}"`);
    const editIcon = this.getContactRowByName(fullName)
      .locator('a[title="Edit"], .fa-edit, [class*="edit"]')
      .first();
    await editIcon.click();
    await this.wait(500);
  }

  /**
   * Click the Delete icon for a specific contact row.
   */
  async deleteContact(fullName: string): Promise<void> {
    Logger.step(`Clicking Delete for contact: "${fullName}"`);
    const deleteIcon = this.getContactRowByName(fullName)
      .locator('a[title="Delete"], .fa-trash, [class*="delete"]')
      .first();
    await deleteIcon.click();
    await this.wait(500);
  }

  /* ── Contact tab pagination buttons ── */
  async clickContactBack(): Promise<void> {
    await this.clickElement(this.contactBackButton, 'Contact Back button');
    await this.waitForPageLoad();
  }

  async clickContactNext(): Promise<void> {
    await this.clickElement(this.contactNextButton, 'Contact Next button');
    await this.waitForPageLoad();
  }

  async clickContactExit(): Promise<void> {
    await this.clickElement(this.contactExitButton, 'Contact Exit button');
    await this.waitForPageLoad();
  }

  /* ═══════════════════════════════════════════════════════════
   * DOCUMENTS – ACTION METHODS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Click "Add New Document" to open the modal.
   */
  async clickAddNewDocument(): Promise<void> {
    Logger.step('Clicking "Add New Document"');
    await this.clickElement(this.addNewDocumentLink, 'Add New Document link');
    await this.page.waitForSelector('.modal:visible', { timeout: 10000 });
    Logger.success('Add Document modal opened');
  }

  /**
   * Fill and submit the Add Document modal.
   */
  async fillAndSubmitDocumentModal(data: {
    documentType: string;
    filePath: string;
    documentName: string;
    isConfidential: boolean;
    description?: string;
  }): Promise<void> {
    Logger.step(`Adding document: "${data.documentName}"`);

    await this.documentTypeDropdown.waitFor({ state: 'visible', timeout: 8000 });
    await this.documentTypeDropdown.selectOption({ label: data.documentType });

    // File upload
    await this.uploadDocumentInput.setInputFiles(data.filePath);

    await this.fillInput(this.documentNameInput, data.documentName, 'Document Name');

    if (data.isConfidential) {
      await this.documentConfidentialYes.check();
    } else {
      await this.documentConfidentialNo.check();
    }

    if (data.description) {
      await this.fillInput(this.documentDescriptionTextarea, data.description, 'Description');
    }

    await this.clickElement(this.addDocumentSubmitButton, 'Add Document Submit');
    await this.page.waitForSelector('.modal:visible', { state: 'hidden', timeout: 10000 });
    await this.wait(600);
    Logger.success(`Document "${data.documentName}" uploaded`);
  }

  async cancelAddDocumentModal(): Promise<void> {
    Logger.step('Cancelling Add Document modal');
    await this.clickElement(this.addDocumentCancelButton, 'Add Document Cancel button');
    await this.wait(400);
    Logger.success('Add Document modal cancelled');
  }

  /* ═══════════════════════════════════════════════════════════
   * SUB PROGRAMS – ACTION METHODS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Click "Add New Sub Program" to open the modal.
   */
  async clickAddNewSubProgram(): Promise<void> {
    Logger.step('Clicking "Add New Sub Program"');
    await this.clickElement(this.addNewSubProgramLink, 'Add New Sub Program link');
    await this.page.waitForSelector('.modal:visible', { timeout: 10000 });
    Logger.success('Add Sub Program modal opened');
  }

  /**
   * Fill and submit the Add Sub Program modal.
   * @param data.subProgramCode – required
   * @param data.subProgramName – required
   * @param data.primaryContact – optional; label in dropdown
   * @param data.secondaryContact – optional
   * @param data.description – optional
   */
  async fillAndSubmitSubProgramModal(data: {
    subProgramCode: string;
    subProgramName: string;
    primaryContact?: string;
    secondaryContact?: string;
    description?: string;
  }): Promise<void> {
    Logger.step(`Adding sub-program: "${data.subProgramName}"`);

    await this.subProgramCodeInput.waitFor({ state: 'visible', timeout: 8000 });
    await this.fillInput(this.subProgramCodeInput, data.subProgramCode, 'Sub Program Code');
    await this.fillInput(this.subProgramNameInput, data.subProgramName, 'Sub Program Name');

    if (data.primaryContact) {
      await this.subProgramPrimaryContactDropdown.selectOption({ label: data.primaryContact });
    }
    if (data.secondaryContact) {
      await this.subProgramSecondaryContactDropdown.selectOption({ label: data.secondaryContact });
    }
    if (data.description) {
      await this.fillInput(this.subProgramDescriptionTextarea, data.description, 'Description');
    }

    await this.clickElement(this.addSubProgramSubmitButton, 'Add Sub Program Submit');
    await this.page.waitForSelector('.modal:visible', { state: 'hidden', timeout: 10000 });
    await this.wait(600);
    Logger.success(`Sub Program "${data.subProgramName}" added`);
  }

  async cancelAddSubProgramModal(): Promise<void> {
    Logger.step('Cancelling Add Sub Program modal');
    await this.clickElement(this.addSubProgramCancelButton, 'Add Sub Program Cancel button');
    await this.wait(400);
    Logger.success('Add Sub Program modal cancelled');
  }

  /**
   * Returns the row locator for a sub-program by its code or name.
   */
  getSubProgramRow(identifier: string): Locator {
    return this.page.locator(`tr:has-text("${identifier}")`).first();
  }

  async isSubProgramVisible(identifier: string): Promise<boolean> {
    return this.isElementVisible(this.getSubProgramRow(identifier), 5000);
  }

  /* ═══════════════════════════════════════════════════════════
   * VERIFICATION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Verify the Edit Program page is loaded.
   * Checks URL pattern and key structural elements.
   */
  async verifyEditProgramPageLoaded(): Promise<void> {
    Logger.step('Verifying Edit Program page is loaded');
    await this.page.waitForURL('**/edit_program/**', { timeout: 15000 });

    // All 7 sidebar tabs must be present
    await this.verifyElementVisible(this.programInformationDetailsTab, 'Program Information Details tab');
    await this.verifyElementVisible(this.contactInformationTab,        'Contact Information tab');
    await this.verifyElementVisible(this.documentsTab,                  'Documents tab');
    await this.verifyElementVisible(this.subProgramsTab,                'Sub Programs tab');
    await this.verifyElementVisible(this.grantsTab,                     'Grants tab');
    await this.verifyElementVisible(this.programFundingTab,             'Program Funding tab');
    await this.verifyElementVisible(this.applicationQuestionsTab,       'Application Questions tab');

    Logger.success('Edit Program page loaded and all sidebar tabs visible');
  }

  /**
   * Verify the 4 accordion sections are visible on the Program Information Details tab.
   */
  async verifyAllAccordionsVisible(): Promise<void> {
    Logger.step('Verifying all accordion sections are visible');
    await this.verifyElementVisible(this.programBasicInfoAccordion,       'Program Basic Information accordion');
    await this.verifyElementVisible(this.requiredTabsAccordion,            'Required Tabs accordion');
    await this.verifyElementVisible(this.supportingDocsAccordion,          'Supporting Documents accordion');
    await this.verifyElementVisible(this.awardAmountAllocationAccordion,   'Award Amount Allocation accordion');
    Logger.success('All accordion sections verified');
  }

  /**
   * Verify the note message (Please Add At Least One Contact) is shown.
   */
  async verifyContactNoteVisible(): Promise<void> {
    await this.verifyElementVisible(this.contactNoteMessage, 'Contact note message');
  }

  /**
   * Verify the Add Contact Information modal is open.
   */
  async verifyAddContactModalOpen(): Promise<void> {
    await this.verifyElementVisible(this.addContactModal, 'Add Contact modal');
    await this.verifyElementVisible(this.contactNameDropdown,     '*Name dropdown');
    await this.verifyElementVisible(this.contactMobileNumberInput,'Mobile Number input');
    await this.verifyElementVisible(this.addContactSubmitButton,  'Submit button');
    await this.verifyElementVisible(this.addContactCancelButton,  'Cancel button');
    Logger.success('Add Contact Information modal verified');
  }

  /**
   * Verify the Add Document modal is open.
   */
  async verifyAddDocumentModalOpen(): Promise<void> {
    await this.verifyElementVisible(this.addDocumentModal,            'Add Document modal');
    await this.verifyElementVisible(this.documentTypeDropdown,        '*Document Type dropdown');
    await this.verifyElementVisible(this.uploadDocumentInput,         '*Upload Document input');
    await this.verifyElementVisible(this.documentNameInput,           '*Document Name input');
    await this.verifyElementVisible(this.documentConfidentialYes,     'Confidential Yes radio');
    await this.verifyElementVisible(this.documentConfidentialNo,      'Confidential No radio');
    await this.verifyElementVisible(this.addDocumentSubmitButton,     'Submit button');
    await this.verifyElementVisible(this.addDocumentCancelButton,     'Cancel button');
    Logger.success('Add Document modal verified');
  }

  /**
   * Verify the Add Sub Program modal is open.
   */
  async verifyAddSubProgramModalOpen(): Promise<void> {
    await this.verifyElementVisible(this.addSubProgramModal,                'Add Sub Program modal');
    await this.verifyElementVisible(this.subProgramProgramDropdown,         '*Program dropdown');
    await this.verifyElementVisible(this.subProgramCodeInput,               '*Sub Program Code input');
    await this.verifyElementVisible(this.subProgramNameInput,               '*Sub Program Name input');
    await this.verifyElementVisible(this.subProgramPrimaryContactDropdown,   'Primary Contact dropdown');
    await this.verifyElementVisible(this.subProgramSecondaryContactDropdown, 'Secondary Contact dropdown');
    await this.verifyElementVisible(this.subProgramDescriptionTextarea,      'Description textarea');
    await this.verifyElementVisible(this.addSubProgramSubmitButton,          'Submit button');
    await this.verifyElementVisible(this.addSubProgramCancelButton,          'Cancel button');
    Logger.success('Add Sub Program modal verified');
  }

  /**
   * Get the program name shown in the page header banner.
   * e.g. "Edit Program for Test Program 12345"
   */
  async getEditProgramHeaderText(): Promise<string> {
    const bannerText = await this.page
      .locator('text=/Edit Program for/i')
      .first()
      .textContent();
    Logger.info(`Edit Program header: ${bannerText}`);
    return bannerText?.trim() || '';
  }
}