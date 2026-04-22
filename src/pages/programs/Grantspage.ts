import { Page, Locator } from '@playwright/test';
import { SharedComponents } from '../base/SharedComponents';
import { Logger } from '../../utils/logger';

/**
 * GrantsPage
 *
 * Covers THREE distinct pages/states for the Grants module:
 *
 * ① Grants List Page   URL: /grants/
 *    Navigation Method A: My Grants menu → Grants sub-menu
 *    Navigation Method B: Edit Program → Grants tab → "Add New Grant For Program" (skips list)
 *
 * ② Add Grant Page     URL: /grants/add/<program-id>/
 *    Single accordion "Grant Basic Information" with ~20 fields.
 *    Submit → lands on Edit Grant page in Draft status.
 *
 * ③ Edit Grant Page    URL: /grants/grantedit/<id>/
 *    8 collapsible accordions (all with + icons, expand on click):
 *      1. Grant Basic Information
 *      2. Grant Purpose
 *      3. Important Dates
 *      4. Funding Life Cycle
 *      5. Grant Funding
 *      6. Documents
 *      7. Milestones
 *      8. Proposal Structure
 *    Submit / Cancel buttons at bottom.
 *
 * ═══════════════════════════════════════════════════════════════
 * GRANTS LIST PAGE (① /grants/)
 * ═══════════════════════════════════════════════════════════════
 * Columns: Select All | Grant Source | Grant | Program |
 *          Budget($) | Days Remaining | Application Start Date |
 *          Application End Date | Status | Actions
 * Filters: Active | Inactive | Draft | Review | Closed | All
 * Bulk actions: Delete | Choose Format | Export
 * Row actions: View (👁) | Edit (✏️) | Print (🖨) | Delete (🗑)
 *
 * ═══════════════════════════════════════════════════════════════
 * ADD GRANT PAGE (② /grants/add/<id>/)
 * ═══════════════════════════════════════════════════════════════
 * Header: "Add Grant for <Program Name>"
 * Required (*): Fiscal Year, Grant Name, Program, Eligible Applicants
 * Optional: Grants From, Reference No, Sub Program, Department,
 *           Opportunity Category, Allow Multiple Times (Yes/No),
 *           Allow for Sub Awards (Yes/No), Allow for Sub Grants (Yes/No),
 *           Allow Multiple Reviewer Score (Yes/No),
 *           Grant Budget($), Grant Ceiling($), Grant Floor($),
 *           Submit To, Delivery Address, District, District Areas,
 *           Status (default: Draft)
 *
 * ═══════════════════════════════════════════════════════════════
 * EDIT GRANT PAGE (③ /grants/grantedit/<id>/)
 * ═══════════════════════════════════════════════════════════════
 * Header: "Edit Grants" (navy banner)
 * Accordion 1 – Grant Basic Information (same fields as Add)
 *   Status field: change from Draft → Active here
 * Accordion 2 – Grant Purpose:
 *   Description (0/500), Special Project Grants,
 *   Grant Purpose, Availability and Awards of Funds,
 *   Additional Terms & Requirements, Notes
 * Accordion 3 – Important Dates:
 *   Planning Start/End, Announcement, Posted,
 *   *Grant Start, *Grant End, *Application Period Start/End,
 *   Award Period Start/End, *Review Period Start/End,
 *   Closeout Period Start/End,
 *   LOI Required (Yes/No), Allow Multiple LOI for Same Org (Yes/No)
 * Accordion 4 – Funding Life Cycle:
 *   Table: Actions | Funding Life Cycle Name | Financial Year | Quarter | Start Date | End Date
 *   "Add Funding Life Cycle" link → modal:
 *     Grant (pre-filled), Financial Year, *Funding Life Cycle Name,
 *     Quarter (--Select--), *Start Date, *End Date
 * Accordion 5 – Grant Funding:
 *   Table: Actions | Funding Source | Funding Year | Funding Amount($) | Total Amount
 *   "Add New Grant Funding" link → modal:
 *     *Program (pre-filled), *Grant (pre-filled),
 *     *Funding Source, Funding Instrument Type, Category of Funding Activity,
 *     Funding Year, *Amount($)
 * Accordion 6 – Documents:
 *   Table: Actions | Document Type | Document Name | Description | Uploaded Date
 *   "Add New Document" link → modal (same as other doc modals):
 *     *Document Type, *Upload Document, *Document Name,
 *     *Is it Confidential (Yes/No), Description
 * Accordion 7 – Milestones:
 *   Table: Actions | Funding Life Cycle Name | Milestone Code | Milestone Name
 *   "Add New Milestone" link → modal:
 *     Grant Name (bold header), *Funding Life Cycle Name (--Select--),
 *     Milestone Code, *Milestone Name, *Start Date, *End Date
 * Accordion 8 – Proposal Structure:
 *   Table: Actions | Content Name | Description
 *   "Add New Table of content" link → modal:
 *     Grant Name (bold header), *Content Name, Description
 */
export class GrantsPage extends SharedComponents {

  /* ═══════════════════════════════════════════════════════════
   * ① GRANTS LIST PAGE LOCATORS
   * ═══════════════════════════════════════════════════════════ */

  /** "Grants" page header */
  readonly grantsListHeader: Locator;

  /** "Add New Grant" link (top-right, red) */
  readonly addNewGrantLink: Locator;

  /* ── Status filter radios ── */
  readonly filterActive: Locator;
  readonly filterInactive: Locator;
  readonly filterDraft: Locator;
  readonly filterReview: Locator;
  readonly filterClosed: Locator;
  readonly filterAll: Locator;

  /* ── Main grants table ── */
  readonly grantsTable: Locator;

  /* ── Column headers ── */
  readonly selectAllCheckbox: Locator;
  readonly grantSourceColumnHeader: Locator;
  readonly grantColumnHeader: Locator;
  readonly programColumnHeader: Locator;
  readonly budgetColumnHeader: Locator;
  readonly daysRemainingColumnHeader: Locator;
  readonly appStartDateColumnHeader: Locator;
  readonly appEndDateColumnHeader: Locator;
  readonly statusColumnHeader: Locator;
  readonly actionsColumnHeader: Locator;

  /* ── Inline filter inputs ── */
  readonly grantSourceFilterInput: Locator;
  readonly grantFilterInput: Locator;
  readonly programFilterInput: Locator;

  /* ── Pagination ── */
  readonly listPaginationInfo: Locator;

  /* ── Bulk actions ── */
  readonly deleteButton: Locator;
  readonly chooseFormatDropdown: Locator;
  readonly exportButton: Locator;

  /* ═══════════════════════════════════════════════════════════
   * ② ADD GRANT PAGE LOCATORS
   * ═══════════════════════════════════════════════════════════ */

  /** "Add Grant for <Program Name>" dark-navy header banner */
  readonly addGrantPageHeader: Locator;

  /** "Grant Basic Information" accordion header (on Add Grant page) */
  readonly addGrantBasicInfoAccordion: Locator;

  /* ── Required fields ── */
  readonly fiscalYearDropdown: Locator;
  readonly grantNameInput: Locator;
  readonly programDropdown: Locator;
  readonly eligibleApplicantsDropdown: Locator;

  /* ── Optional fields ── */
  readonly grantsFromDropdown: Locator;
  readonly referenceNoInput: Locator;
  readonly subProgramDropdown: Locator;
  readonly departmentDropdown: Locator;
  readonly opportunityCategoryDropdown: Locator;

  /* ── Boolean radios (all default to "No") ── */
  readonly allowMultipleTimesYes: Locator;
  readonly allowMultipleTimesNo: Locator;
  readonly allowForSubAwardsYes: Locator;
  readonly allowForSubAwardsNo: Locator;
  readonly allowForSubGrantsYes: Locator;
  readonly allowForSubGrantsNo: Locator;
  readonly allowMultipleReviewerScoreYes: Locator;
  readonly allowMultipleReviewerScoreNo: Locator;

  /* ── Financial fields ── */
  readonly grantBudgetInput: Locator;
  readonly grantCeilingInput: Locator;
  readonly grantFloorInput: Locator;

  /* ── Other optional fields ── */
  readonly submitToInput: Locator;
  readonly deliveryAddressTextarea: Locator;
  readonly districtDropdown: Locator;
  readonly districtAreasDropdown: Locator;
  readonly statusDropdown: Locator;

  /* ── Add Grant page action buttons ── */
  readonly addGrantSubmitButton: Locator;
  readonly addGrantCancelButton: Locator;

  /* ═══════════════════════════════════════════════════════════
   * ③ EDIT GRANT PAGE LOCATORS
   * ═══════════════════════════════════════════════════════════ */

  /** "Edit Grants" dark-navy banner */
  readonly editGrantPageHeader: Locator;

  /* ── 8 accordion headers ── */
  readonly basicInfoAccordion: Locator;
  readonly grantPurposeAccordion: Locator;
  readonly importantDatesAccordion: Locator;
  readonly fundingLifeCycleAccordion: Locator;
  readonly grantFundingAccordion: Locator;
  readonly documentsAccordion: Locator;
  readonly milestonesAccordion: Locator;
  readonly proposalStructureAccordion: Locator;

  /* ── Accordion 2: Grant Purpose fields ── */
  readonly grantDescriptionTextarea: Locator;
  readonly specialProjectGrantsTextarea: Locator;
  readonly grantPurposeTextarea: Locator;
  readonly availabilityAwardsFundsTextarea: Locator;
  readonly additionalTermsTextarea: Locator;
  readonly notesTextarea: Locator;

  /* ── Accordion 3: Important Dates ── */
  readonly planningStartDateInput: Locator;
  readonly planningEndDateInput: Locator;
  readonly announcementDateInput: Locator;
  readonly postedDateInput: Locator;
  readonly grantStartDateInput: Locator;
  readonly grantEndDateInput: Locator;
  readonly appPeriodStartDateInput: Locator;
  readonly appPeriodEndDateInput: Locator;
  readonly awardPeriodStartDateInput: Locator;
  readonly awardPeriodEndDateInput: Locator;
  readonly reviewPeriodStartDateInput: Locator;
  readonly reviewPeriodEndDateInput: Locator;
  readonly closeoutPeriodStartDateInput: Locator;
  readonly closeoutPeriodEndDateInput: Locator;
  readonly loiRequiredYes: Locator;
  readonly loiRequiredNo: Locator;
  readonly allowMultipleLOIYes: Locator;
  readonly allowMultipleLOINo: Locator;

  /* ── Accordion 4: Funding Life Cycle ── */
  readonly addFundingLifeCycleLink: Locator;
  readonly fundingLifeCycleTable: Locator;

  /* ── Funding Life Cycle modal ── */
  readonly flcModal: Locator;
  readonly flcModalGrantDropdown: Locator;
  readonly flcModalFinancialYearInput: Locator;
  readonly flcModalNameInput: Locator;
  readonly flcModalQuarterDropdown: Locator;
  readonly flcModalStartDateInput: Locator;
  readonly flcModalEndDateInput: Locator;
  readonly flcModalSubmit: Locator;
  readonly flcModalCancel: Locator;

  /* ── Accordion 5: Grant Funding ── */
  readonly addNewGrantFundingLink: Locator;
  readonly grantFundingTable: Locator;
  readonly grantFundingTotalAmount: Locator;

  /* ── Grant Funding modal ── */
  readonly grantFundingModal: Locator;
  readonly grantFundingModalProgramDropdown: Locator;
  readonly grantFundingModalGrantDropdown: Locator;
  readonly grantFundingModalFundingSourceDropdown: Locator;
  readonly grantFundingModalInstrumentTypeDropdown: Locator;
  readonly grantFundingModalCategoryDropdown: Locator;
  readonly grantFundingModalFundingYearDropdown: Locator;
  readonly grantFundingModalAmountInput: Locator;
  readonly grantFundingModalSubmit: Locator;
  readonly grantFundingModalCancel: Locator;

  /* ── Accordion 6: Documents ── */
  readonly addNewDocumentLink: Locator;
  readonly documentsTable: Locator;

  /* ── Documents modal (same structure as other doc modals) ── */
  readonly documentModal: Locator;
  readonly documentTypeDropdown: Locator;
  readonly uploadDocumentInput: Locator;
  readonly documentNameInput: Locator;
  readonly documentConfidentialYes: Locator;
  readonly documentConfidentialNo: Locator;
  readonly documentDescriptionTextarea: Locator;
  readonly documentModalSubmit: Locator;
  readonly documentModalCancel: Locator;

  /* ── Accordion 7: Milestones ── */
  readonly addNewMilestoneLink: Locator;
  readonly milestonesTable: Locator;

  /* ── Milestone modal ── */
  readonly milestoneModal: Locator;
  readonly milestoneGrantNameHeader: Locator;
  readonly milestoneFLCNameDropdown: Locator;
  readonly milestoneCodeInput: Locator;
  readonly milestoneNameInput: Locator;
  readonly milestoneStartDateInput: Locator;
  readonly milestoneEndDateInput: Locator;
  readonly milestoneModalSubmit: Locator;
  readonly milestoneModalCancel: Locator;

  /* ── Accordion 8: Proposal Structure ── */
  readonly addNewTableOfContentLink: Locator;
  readonly proposalStructureTable: Locator;

  /* ── Proposal Structure (Table of Content) modal ── */
  readonly tocModal: Locator;
  readonly tocGrantNameHeader: Locator;
  readonly tocContentNameInput: Locator;
  readonly tocDescriptionTextarea: Locator;
  readonly tocModalSubmit: Locator;
  readonly tocModalCancel: Locator;

  /* ── Edit Grant page buttons ── */
  readonly editGrantSubmitButton: Locator;
  readonly editGrantCancelButton: Locator;

  /* ═══════════════════════════════════════════════════════════
   * CONSTRUCTOR
   * ═══════════════════════════════════════════════════════════ */
  constructor(page: Page) {
    super(page);

    /* ══ ① GRANTS LIST ══ */
    this.grantsListHeader = page.locator('.card-header, h2, h3, h1').filter({ hasText: 'Grants' }).first();
    this.addNewGrantLink  = page.locator('a.link-btn, a').filter({ hasText: 'Add New Grant' }).first();

    this.filterActive   = page.locator('input[type="radio"]').filter({ hasText: '' }).nth(0);
    this.filterInactive = page.locator('label:has-text("Inactive") input[type="radio"]').first();
    this.filterDraft    = page.locator('label:has-text("Draft") input[type="radio"]').first();
    this.filterReview   = page.locator('label:has-text("Review") input[type="radio"]').first();
    this.filterClosed   = page.locator('label:has-text("Closed") input[type="radio"]').first();
    this.filterAll      = page.locator('label:has-text("All") input[type="radio"]').first();

    // Use label-based locators for filters (more reliable)
    this.filterActive   = page.locator('label:has-text("Active") input[type="radio"]').first();

    this.grantsTable = page.locator('table').filter({
      has: page.locator('th:has-text("Grant")')
    }).first();

    this.selectAllCheckbox        = page.locator('th:has-text("Select All") input[type="checkbox"]').first();
    this.grantSourceColumnHeader  = page.locator('th:has-text("Grant Source")').first();
    this.grantColumnHeader        = page.locator('th a:has-text("Grant")').first();
    this.programColumnHeader      = page.locator('th a:has-text("Program")').first();
    this.budgetColumnHeader       = page.locator('th:has-text("Budget")').first();
    this.daysRemainingColumnHeader = page.locator('th:has-text("Days Remaining")').first();
    this.appStartDateColumnHeader = page.locator('th:has-text("Application Start Date")').first();
    this.appEndDateColumnHeader   = page.locator('th:has-text("Application End Date")').first();
    this.statusColumnHeader       = page.locator('th a:has-text("Status")').first();
    this.actionsColumnHeader      = page.locator('th:has-text("Actions")').first();

    this.grantSourceFilterInput = page.locator('input[placeholder="Grant Source"]').first();
    this.grantFilterInput       = page.locator('input[placeholder="Grant"]').first();
    this.programFilterInput     = page.locator('input[placeholder="Program"]').first();

    this.listPaginationInfo = page.locator('text=/Showing \\d+ To \\d+ Of \\d+ Entries/i').first();

    this.deleteButton         = page.locator('button:has-text("Delete")').first();
    this.chooseFormatDropdown = page.locator('select:near(button:has-text("Export"))').first();
    this.exportButton         = page.locator('button:has-text("Export")').first();

    /* ══ ② ADD GRANT ══ */
    this.addGrantPageHeader       = page.locator('[class*="card-header"], .page-header, h1, h2, div').filter({ hasText: /Add Grant for/i }).first();
    this.addGrantBasicInfoAccordion = page.locator('[data-toggle="collapse"], .card-header, .accordion-header').filter({ hasText: 'Grant Basic Information' }).first();

    this.fiscalYearDropdown         = page.locator('select[name*="fiscal"], select[id*="fiscal"]').first();
    this.grantNameInput             = page.locator('input[name*="grant_name"], input[id*="grant_name"], input[name*="name"]').first();
    this.programDropdown            = page.locator('select[name*="program"], select[id*="program"]').first();
    this.eligibleApplicantsDropdown = page.locator('[id*="eligible"], [name*="eligible"], select[name*="applicant"]').first();

    this.grantsFromDropdown           = page.locator('select[name*="grants_from"], select[name*="from"]').first();
    this.referenceNoInput             = page.locator('input[name*="reference"], input[id*="reference"]').first();
    this.subProgramDropdown           = page.locator('select[name*="sub_program"]').first();
    this.departmentDropdown           = page.locator('select[name*="department"]').first();
    this.opportunityCategoryDropdown  = page.locator('select[name*="opportunity"], select[name*="category"]').first();

    // Boolean radios – use label text approach
    this.allowMultipleTimesYes = page.locator('label:has-text("Allow an applicant") ~ label:has-text("Yes") input, label:has-text("Allow an applicant to apply multiple times") + * label:has-text("Yes") input').first();
    this.allowMultipleTimesNo  = page.locator('label:has-text("Allow an applicant") ~ label:has-text("No") input').first();
    this.allowForSubAwardsYes  = page.locator('label:has-text("Allow for Sub Awards") ~ label:has-text("Yes") input').first();
    this.allowForSubAwardsNo   = page.locator('label:has-text("Allow for Sub Awards") ~ label:has-text("No") input').first();
    this.allowForSubGrantsYes  = page.locator('label:has-text("Allow for Sub Grants") ~ label:has-text("Yes") input').first();
    this.allowForSubGrantsNo   = page.locator('label:has-text("Allow for Sub Grants") ~ label:has-text("No") input').first();
    this.allowMultipleReviewerScoreYes = page.locator('label:has-text("Multiple Reviewer") ~ label:has-text("Yes") input').first();
    this.allowMultipleReviewerScoreNo  = page.locator('label:has-text("Multiple Reviewer") ~ label:has-text("No") input').first();

    this.grantBudgetInput   = page.locator('input[name*="budget"], input[id*="budget"]').first();
    this.grantCeilingInput  = page.locator('input[name*="ceiling"]').first();
    this.grantFloorInput    = page.locator('input[name*="floor"]').first();

    this.submitToInput          = page.locator('input[name*="submit_to"]').first();
    this.deliveryAddressTextarea = page.locator('textarea[name*="delivery"], textarea[name*="address"]').first();
    this.districtDropdown       = page.locator('[name*="district"]:not([name*="areas"])').first();
    this.districtAreasDropdown  = page.locator('[name*="district_areas"]').first();
    this.statusDropdown         = page.locator('select[name*="status"], select[id*="status"]').first();

    this.addGrantSubmitButton = page.locator('button:has-text("Submit")').first();
    this.addGrantCancelButton = page.locator('button:has-text("Cancel")').first();

    /* ══ ③ EDIT GRANT ══ */
    this.editGrantPageHeader = page.locator('.card-header, h1, h2, div').filter({ hasText: 'Edit Grants' }).first();

    // 8 accordion headers
    this.basicInfoAccordion       = page.locator('[data-toggle="collapse"], .card-header, div').filter({ hasText: 'Grant Basic Information' }).first();
    this.grantPurposeAccordion    = page.locator('[data-toggle="collapse"], .card-header, div').filter({ hasText: 'Grant Purpose' }).first();
    this.importantDatesAccordion  = page.locator('[data-toggle="collapse"], .card-header, div').filter({ hasText: 'Important Dates' }).first();
    this.fundingLifeCycleAccordion = page.locator('[data-toggle="collapse"], .card-header, div').filter({ hasText: 'Funding Life Cycle' }).first();
    this.grantFundingAccordion    = page.locator('[data-toggle="collapse"], .card-header, div').filter({ hasText: 'Grant Funding' }).first();
    this.documentsAccordion       = page.locator('[data-toggle="collapse"], .card-header, div').filter({ hasText: 'Documents' }).first();
    this.milestonesAccordion      = page.locator('[data-toggle="collapse"], .card-header, div').filter({ hasText: 'Milestones' }).first();
    this.proposalStructureAccordion = page.locator('[data-toggle="collapse"], .card-header, div').filter({ hasText: 'Proposal Structure' }).first();

    // Grant Purpose fields
    this.grantDescriptionTextarea         = page.locator('textarea[name*="description"]').first();
    this.specialProjectGrantsTextarea     = page.locator('textarea[name*="special_project"]').first();
    this.grantPurposeTextarea             = page.locator('textarea[name*="grant_purpose"]').first();
    this.availabilityAwardsFundsTextarea  = page.locator('textarea[name*="availability"]').first();
    this.additionalTermsTextarea          = page.locator('textarea[name*="additional_terms"]').first();
    this.notesTextarea                    = page.locator('textarea[name*="notes"]').first();

    // Important Dates fields
    this.planningStartDateInput    = page.locator('input[name*="planning_start"]').first();
    this.planningEndDateInput      = page.locator('input[name*="planning_end"]').first();
    this.announcementDateInput     = page.locator('input[name*="announcement"]').first();
    this.postedDateInput           = page.locator('input[name*="posted"]').first();
    this.grantStartDateInput       = page.locator('input[name*="grant_start"]').first();
    this.grantEndDateInput         = page.locator('input[name*="grant_end"]').first();
    this.appPeriodStartDateInput   = page.locator('input[name*="application_period_start"], input[name*="app_start"]').first();
    this.appPeriodEndDateInput     = page.locator('input[name*="application_period_end"], input[name*="app_end"]').first();
    this.awardPeriodStartDateInput = page.locator('input[name*="award_period_start"]').first();
    this.awardPeriodEndDateInput   = page.locator('input[name*="award_period_end"]').first();
    this.reviewPeriodStartDateInput = page.locator('input[name*="review_period_start"]').first();
    this.reviewPeriodEndDateInput  = page.locator('input[name*="review_period_end"]').first();
    this.closeoutPeriodStartDateInput = page.locator('input[name*="closeout_start"]').first();
    this.closeoutPeriodEndDateInput   = page.locator('input[name*="closeout_end"]').first();
    this.loiRequiredYes      = page.locator('label:has-text("Letter of Intent") ~ label:has-text("Yes") input, label:has-text("LOI Required") ~ label:has-text("Yes") input').first();
    this.loiRequiredNo       = page.locator('label:has-text("LOI Required") ~ label:has-text("No") input').first();
    this.allowMultipleLOIYes = page.locator('label:has-text("Allow Multiple LOI") ~ label:has-text("Yes") input').first();
    this.allowMultipleLOINo  = page.locator('label:has-text("Allow Multiple LOI") ~ label:has-text("No") input').first();

    // Accordion 4 – Funding Life Cycle
    this.addFundingLifeCycleLink = page.locator('a:has-text("Add Funding Life Cycle")').first();
    this.fundingLifeCycleTable   = page.locator('table').filter({ has: page.locator('th:has-text("Funding Life Cycle Name")') }).first();

    this.flcModal              = page.locator('.modal:visible').first();
    this.flcModalGrantDropdown = page.locator('.modal select[name*="grant"]').first();
    this.flcModalFinancialYearInput = page.locator('.modal input[name*="financial_year"], .modal input[name*="year"]').first();
    this.flcModalNameInput     = page.locator('.modal input[name*="name"]').first();
    this.flcModalQuarterDropdown = page.locator('.modal select[name*="quarter"]').first();
    this.flcModalStartDateInput = page.locator('.modal input[name*="start"]').first();
    this.flcModalEndDateInput   = page.locator('.modal input[name*="end"]').first();
    this.flcModalSubmit = page.locator('.modal button:has-text("Submit")').first();
    this.flcModalCancel = page.locator('.modal button:has-text("Cancel")').first();

    // Accordion 5 – Grant Funding
    this.addNewGrantFundingLink = page.locator('a:has-text("Add New Grant Funding")').first();
    this.grantFundingTable      = page.locator('table').filter({ has: page.locator('th:has-text("Funding Source")') }).first();
    this.grantFundingTotalAmount = page.locator('td:has-text("Total Amount:")').first();

    this.grantFundingModal                     = page.locator('.modal:visible').first();
    this.grantFundingModalProgramDropdown      = page.locator('.modal select[name*="program"]').first();
    this.grantFundingModalGrantDropdown        = page.locator('.modal select[name*="grant"]').first();
    this.grantFundingModalFundingSourceDropdown = page.locator('.modal select[name*="funding_source"], .modal select[name*="source"]').first();
    this.grantFundingModalInstrumentTypeDropdown = page.locator('.modal select[name*="instrument"]').first();
    this.grantFundingModalCategoryDropdown      = page.locator('.modal select[name*="category"]').first();
    this.grantFundingModalFundingYearDropdown   = page.locator('.modal select[name*="year"]').first();
    this.grantFundingModalAmountInput           = page.locator('.modal input[name*="amount"]').first();
    this.grantFundingModalSubmit                = page.locator('.modal button:has-text("Submit")').first();
    this.grantFundingModalCancel                = page.locator('.modal button:has-text("Cancel")').first();

    // Accordion 6 – Documents
    this.addNewDocumentLink    = page.locator('a:has-text("Add New Document")').first();
    this.documentsTable        = page.locator('table').filter({ has: page.locator('th:has-text("Document Type")') }).first();

    this.documentModal               = page.locator('.modal:visible').first();
    this.documentTypeDropdown        = page.locator('.modal select[name*="doc_type"], .modal select').first();
    this.uploadDocumentInput         = page.locator('.modal input[type="file"]').first();
    this.documentNameInput           = page.locator('.modal input[name*="doc_name"]').first();
    this.documentConfidentialYes     = page.locator('.modal input[type="radio"][value="Yes"]').first();
    this.documentConfidentialNo      = page.locator('.modal input[type="radio"][value="No"]').first();
    this.documentDescriptionTextarea = page.locator('.modal textarea').first();
    this.documentModalSubmit         = page.locator('.modal button:has-text("Submit")').first();
    this.documentModalCancel         = page.locator('.modal button:has-text("Cancel")').first();

    // Accordion 7 – Milestones
    this.addNewMilestoneLink = page.locator('a:has-text("Add New Milestone")').first();
    this.milestonesTable     = page.locator('table').filter({ has: page.locator('th:has-text("Milestone Code")') }).first();

    this.milestoneModal          = page.locator('.modal:visible').first();
    this.milestoneGrantNameHeader = page.locator('.modal strong, .modal b, .modal h5, .modal h4').filter({ hasText: 'Grant Name:' }).first();
    this.milestoneFLCNameDropdown = page.locator('.modal select[name*="funding_life_cycle"], .modal select[name*="flc"]').first();
    this.milestoneCodeInput       = page.locator('.modal input[name*="milestone_code"], .modal input[name*="code"]').first();
    this.milestoneNameInput       = page.locator('.modal input[name*="milestone_name"], .modal input[name*="name"]').first();
    this.milestoneStartDateInput  = page.locator('.modal input[name*="start"]').first();
    this.milestoneEndDateInput    = page.locator('.modal input[name*="end"]').first();
    this.milestoneModalSubmit     = page.locator('.modal button:has-text("Submit")').first();
    this.milestoneModalCancel     = page.locator('.modal button:has-text("Cancel")').first();

    // Accordion 8 – Proposal Structure
    this.addNewTableOfContentLink = page.locator('a:has-text("Add New Table of content"), a:has-text("Add New Table Of Content")').first();
    this.proposalStructureTable   = page.locator('table').filter({ has: page.locator('th:has-text("Content Name")') }).first();

    this.tocModal              = page.locator('.modal:visible').first();
    this.tocGrantNameHeader    = page.locator('.modal strong, .modal b, .modal h5').filter({ hasText: 'Grant Name:' }).first();
    this.tocContentNameInput   = page.locator('.modal input[name*="content_name"], .modal input[name*="name"]').first();
    this.tocDescriptionTextarea = page.locator('.modal textarea[name*="description"], .modal textarea').first();
    this.tocModalSubmit        = page.locator('.modal button:has-text("Submit")').first();
    this.tocModalCancel        = page.locator('.modal button:has-text("Cancel")').first();

    // Edit Grant page buttons
    this.editGrantSubmitButton = page.locator('button:has-text("Submit")').first();
    this.editGrantCancelButton = page.locator('button:has-text("Cancel")').first();
  }

  /* ═══════════════════════════════════════════════════════════
   * ① GRANTS LIST – NAVIGATION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Navigate to Grants list via: My Grants menu → Grants sub-menu.
   * This is Navigation Method A (from the top menu bar).
   */
  async navigateToGrantsListViaMenu(): Promise<void> {
    Logger.step('Navigating to Grants list via My Grants → Grants');
    await this.openSubMenu('My Grants', 'Grants');
    await this.page.waitForLoadState('networkidle');
    Logger.success('Grants list page loaded via menu');
  }

  async clickAddNewGrant(): Promise<void> {
    Logger.step('Clicking "Add New Grant"');
    await this.clickElement(this.addNewGrantLink, 'Add New Grant link');
    await this.waitForPageLoad();
    Logger.success('Navigated to Add Grant page');
  }

  /**
   * Get a grant table row by grant name/title.
   */
  getGrantRow(grantName: string): Locator {
    return this.page.locator(`tr:has-text("${grantName}")`).first();
  }

  async isGrantVisible(grantName: string): Promise<boolean> {
    return this.isElementVisible(this.getGrantRow(grantName), 5000);
  }

  async clickViewGrant(grantName: string): Promise<void> {
    Logger.step(`Viewing grant: "${grantName}"`);
    const viewIcon = this.getGrantRow(grantName).locator('.fa-eye, a[title="View"]').first();
    await viewIcon.click();
    await this.waitForPageLoad();
  }

  async clickEditGrant(grantName: string): Promise<void> {
    Logger.step(`Editing grant: "${grantName}"`);
    const editIcon = this.getGrantRow(grantName).locator('.fa-edit, a[title="Edit"]').first();
    await editIcon.click();
    await this.waitForPageLoad();
  }

  /* ── Status filter helpers ── */
  async selectStatusFilter(status: 'Active' | 'Inactive' | 'Draft' | 'Review' | 'Closed' | 'All'): Promise<void> {
    Logger.step(`Selecting status filter: ${status}`);
    const filterMap: Record<string, Locator> = {
      Active:   this.filterActive,
      Inactive: this.filterInactive,
      Draft:    this.filterDraft,
      Review:   this.filterReview,
      Closed:   this.filterClosed,
      All:      this.filterAll,
    };
    await filterMap[status].check();
    await this.waitForPageLoad();
    Logger.success(`Filter set to: ${status}`);
  }

  /* ═══════════════════════════════════════════════════════════
   * ② ADD GRANT PAGE – FORM FILL HELPERS
   * ═══════════════════════════════════════════════════════════ */

  /**
   * Fill only the required fields on the Add Grant form.
   * @param data.fiscalYear – label in dropdown
   * @param data.grantName  – text input
   * @param data.eligibleApplicants – label in multi-select / dropdown
   */
  async fillRequiredGrantFields(data: {
    fiscalYear: string;
    grantName: string;
    eligibleApplicants?: string;
  }): Promise<void> {
    Logger.step('Filling required grant fields');

    await this.fiscalYearDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.fiscalYearDropdown.selectOption({ label: data.fiscalYear });

    await this.fillInput(this.grantNameInput, data.grantName, 'Grant Name');

    if (data.eligibleApplicants) {
      // Eligible Applicants is a custom multi-select (Select2/Chosen)
      // Try native select first; fall back to clicking the visible custom dropdown
      try {
        await this.eligibleApplicantsDropdown.selectOption({ label: data.eligibleApplicants });
      } catch {
        Logger.warn('Native select failed for Eligible Applicants – trying click approach');
        await this.eligibleApplicantsDropdown.click();
        const option = this.page.locator(`li:has-text("${data.eligibleApplicants}")`).first();
        await option.click();
      }
    }

    Logger.success('Required grant fields filled');
  }

  /**
   * Fill ALL fields on the Add Grant form.
   */
  async fillAllGrantFields(data: {
    fiscalYear: string;
    grantName: string;
    grantsFrom?: string;
    referenceNo?: string;
    eligibleApplicants?: string;
    grantBudget?: string;
    grantCeiling?: string;
    grantFloor?: string;
    status?: string;
  }): Promise<void> {
    Logger.step('Filling all grant fields');

    await this.fillRequiredGrantFields({
      fiscalYear:          data.fiscalYear,
      grantName:           data.grantName,
      eligibleApplicants:  data.eligibleApplicants,
    });

    if (data.grantsFrom) {
      await this.grantsFromDropdown.selectOption({ label: data.grantsFrom });
    }
    if (data.referenceNo) {
      await this.fillInput(this.referenceNoInput, data.referenceNo, 'Reference No');
    }
    if (data.grantBudget) {
      await this.grantBudgetInput.click({ clickCount: 3 });
      await this.grantBudgetInput.fill(data.grantBudget);
    }
    if (data.grantCeiling) {
      await this.grantCeilingInput.click({ clickCount: 3 });
      await this.grantCeilingInput.fill(data.grantCeiling);
    }
    if (data.grantFloor) {
      await this.grantFloorInput.click({ clickCount: 3 });
      await this.grantFloorInput.fill(data.grantFloor);
    }
    if (data.status) {
      await this.statusDropdown.selectOption({ label: data.status });
    }

    Logger.success('All grant fields filled');
  }

  async clickAddGrantSubmit(): Promise<void> {
    Logger.step('Clicking Submit on Add Grant page');
    await this.clickElement(this.addGrantSubmitButton, 'Add Grant Submit');
    await this.waitForPageLoad();
  }

  async clickAddGrantCancel(): Promise<void> {
    Logger.step('Clicking Cancel on Add Grant page');
    await this.clickElement(this.addGrantCancelButton, 'Add Grant Cancel');
    await this.waitForPageLoad();
  }

  /* ═══════════════════════════════════════════════════════════
   * ③ EDIT GRANT – ACCORDION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  private async expandAccordion(header: Locator, name: string): Promise<void> {
    Logger.step(`Expanding accordion: "${name}"`);
    const minusIcon = header.locator('.fa-minus, [class*="minus"]');
    const expanded  = await minusIcon.isVisible({ timeout: 1500 }).catch(() => false);
    if (!expanded) {
      await header.click();
      await this.wait(400);
      Logger.success(`"${name}" expanded`);
    } else {
      Logger.info(`"${name}" already expanded`);
    }
  }

  async expandBasicInfo(): Promise<void>         { await this.expandAccordion(this.basicInfoAccordion,        'Grant Basic Information'); }
  async expandGrantPurpose(): Promise<void>      { await this.expandAccordion(this.grantPurposeAccordion,     'Grant Purpose'); }
  async expandImportantDates(): Promise<void>    { await this.expandAccordion(this.importantDatesAccordion,   'Important Dates'); }
  async expandFundingLifeCycle(): Promise<void>  { await this.expandAccordion(this.fundingLifeCycleAccordion, 'Funding Life Cycle'); }
  async expandGrantFunding(): Promise<void>      { await this.expandAccordion(this.grantFundingAccordion,     'Grant Funding'); }
  async expandDocuments(): Promise<void>         { await this.expandAccordion(this.documentsAccordion,        'Documents'); }
  async expandMilestones(): Promise<void>        { await this.expandAccordion(this.milestonesAccordion,       'Milestones'); }
  async expandProposalStructure(): Promise<void> { await this.expandAccordion(this.proposalStructureAccordion,'Proposal Structure'); }

  /**
   * Change Status from "Draft" to "Active" inside Grant Basic Information.
   * Caller must first call expandBasicInfo().
   */
  async changeStatusToActive(): Promise<void> {
    Logger.step('Changing Grant Status to Active');
    await this.statusDropdown.waitFor({ state: 'visible', timeout: 8000 });
    await this.statusDropdown.selectOption({ label: 'Active' });
    Logger.success('Status changed to Active');
  }

  /* ── Accordion 4: Funding Life Cycle modal ── */
  async clickAddFundingLifeCycle(): Promise<void> {
    Logger.step('Clicking "Add Funding Life Cycle"');
    await this.clickElement(this.addFundingLifeCycleLink, 'Add Funding Life Cycle link');
    await this.page.waitForSelector('.modal:visible', { timeout: 10000 });
    Logger.success('Add Funding Life Cycle modal opened');
  }

  async fillAndSubmitFLCModal(data: {
    fundingLifeCycleName: string;
    startDate: string;
    endDate: string;
    quarter?: string;
    financialYear?: string;
  }): Promise<void> {
    Logger.step(`Adding FLC: "${data.fundingLifeCycleName}"`);
    await this.flcModalNameInput.waitFor({ state: 'visible', timeout: 8000 });
    await this.fillInput(this.flcModalNameInput, data.fundingLifeCycleName, 'FLC Name');
    if (data.financialYear) await this.fillInput(this.flcModalFinancialYearInput, data.financialYear, 'Financial Year');
    if (data.quarter) await this.flcModalQuarterDropdown.selectOption({ label: data.quarter });
    await this.fillInput(this.flcModalStartDateInput, data.startDate, 'Start Date');
    await this.fillInput(this.flcModalEndDateInput,   data.endDate,   'End Date');
    await this.clickElement(this.flcModalSubmit, 'FLC Submit');
    await this.page.waitForSelector('.modal:visible', { state: 'hidden', timeout: 10000 });
    await this.wait(600);
    Logger.success(`FLC "${data.fundingLifeCycleName}" added`);
  }

  async cancelFLCModal(): Promise<void> {
    await this.clickElement(this.flcModalCancel, 'FLC Cancel');
    await this.wait(400);
  }

  /* ── Accordion 5: Grant Funding modal ── */
  async clickAddNewGrantFunding(): Promise<void> {
    Logger.step('Clicking "Add New Grant Funding"');
    await this.clickElement(this.addNewGrantFundingLink, 'Add New Grant Funding link');
    await this.page.waitForSelector('.modal:visible', { timeout: 10000 });
    Logger.success('Add Grant Funding modal opened');
  }

  async cancelGrantFundingModal(): Promise<void> {
    await this.clickElement(this.grantFundingModalCancel, 'Grant Funding Cancel');
    await this.wait(400);
  }

  /* ── Accordion 6: Documents modal ── */
  async clickAddNewDocument(): Promise<void> {
    Logger.step('Clicking "Add New Document"');
    await this.clickElement(this.addNewDocumentLink, 'Add New Document link');
    await this.page.waitForSelector('.modal:visible', { timeout: 10000 });
    Logger.success('Add Document modal opened');
  }

  async cancelDocumentModal(): Promise<void> {
    await this.clickElement(this.documentModalCancel, 'Document Cancel');
    await this.wait(400);
  }

  /* ── Accordion 7: Milestones modal ── */
  async clickAddNewMilestone(): Promise<void> {
    Logger.step('Clicking "Add New Milestone"');
    await this.clickElement(this.addNewMilestoneLink, 'Add New Milestone link');
    await this.page.waitForSelector('.modal:visible', { timeout: 10000 });
    Logger.success('Add Milestone modal opened');
  }

  async cancelMilestoneModal(): Promise<void> {
    await this.clickElement(this.milestoneModalCancel, 'Milestone Cancel');
    await this.wait(400);
  }

  /* ── Accordion 8: Proposal Structure modal ── */
  async clickAddNewTableOfContent(): Promise<void> {
    Logger.step('Clicking "Add New Table of content"');
    await this.clickElement(this.addNewTableOfContentLink, 'Add New Table of Content link');
    await this.page.waitForSelector('.modal:visible', { timeout: 10000 });
    Logger.success('Add Table Of Content modal opened');
  }

  async fillAndSubmitTOCModal(data: {
    contentName: string;
    description?: string;
  }): Promise<void> {
    Logger.step(`Adding TOC: "${data.contentName}"`);
    await this.tocContentNameInput.waitFor({ state: 'visible', timeout: 8000 });
    await this.fillInput(this.tocContentNameInput, data.contentName, 'Content Name');
    if (data.description) {
      await this.fillInput(this.tocDescriptionTextarea, data.description, 'Description');
    }
    await this.clickElement(this.tocModalSubmit, 'TOC Submit');
    await this.page.waitForSelector('.modal:visible', { state: 'hidden', timeout: 10000 });
    await this.wait(600);
    Logger.success(`TOC "${data.contentName}" added`);
  }

  async cancelTOCModal(): Promise<void> {
    await this.clickElement(this.tocModalCancel, 'TOC Cancel');
    await this.wait(400);
  }

  /* ── Edit Grant page buttons ── */
  async clickEditGrantSubmit(): Promise<void> {
    Logger.step('Clicking Submit on Edit Grant page');
    await this.clickElement(this.editGrantSubmitButton, 'Edit Grant Submit');
    await this.waitForPageLoad();
  }

  async clickEditGrantCancel(): Promise<void> {
    Logger.step('Clicking Cancel on Edit Grant page');
    await this.clickElement(this.editGrantCancelButton, 'Edit Grant Cancel');
    await this.waitForPageLoad();
  }

  /* ═══════════════════════════════════════════════════════════
   * VERIFICATION HELPERS
   * ═══════════════════════════════════════════════════════════ */

  async verifyGrantsListLoaded(): Promise<void> {
    Logger.step('Verifying Grants list page is loaded');
    await Assertions.verifyPageUrlContains(this.page, 'grants');
    await this.verifyElementVisible(this.addNewGrantLink,       'Add New Grant link');
    await this.verifyElementVisible(this.grantsTable,           'Grants table');
    await this.verifyElementVisible(this.listPaginationInfo,    'Pagination info');
    Logger.success('Grants list page verified');
  }

  async verifyAddGrantPageLoaded(): Promise<void> {
    Logger.step('Verifying Add Grant page is loaded');
    await this.verifyElementVisible(this.addGrantPageHeader,    'Add Grant header');
    await this.verifyElementVisible(this.fiscalYearDropdown,    '*Fiscal Year dropdown');
    await this.verifyElementVisible(this.grantNameInput,        '*Grant Name input');
    await this.verifyElementVisible(this.addGrantSubmitButton,  'Submit button');
    await this.verifyElementVisible(this.addGrantCancelButton,  'Cancel button');
    Logger.success('Add Grant page verified');
  }

  async verifyEditGrantPageLoaded(): Promise<void> {
    Logger.step('Verifying Edit Grant page is loaded');
    await this.page.waitForURL('**/grantedit/**', { timeout: 15000 });
    await this.verifyElementVisible(this.editGrantPageHeader,      '"Edit Grants" header');
    await this.verifyElementVisible(this.basicInfoAccordion,       'Grant Basic Information accordion');
    await this.verifyElementVisible(this.grantPurposeAccordion,    'Grant Purpose accordion');
    await this.verifyElementVisible(this.importantDatesAccordion,  'Important Dates accordion');
    await this.verifyElementVisible(this.fundingLifeCycleAccordion,'Funding Life Cycle accordion');
    await this.verifyElementVisible(this.grantFundingAccordion,    'Grant Funding accordion');
    await this.verifyElementVisible(this.documentsAccordion,       'Documents accordion');
    await this.verifyElementVisible(this.milestonesAccordion,      'Milestones accordion');
    await this.verifyElementVisible(this.proposalStructureAccordion,'Proposal Structure accordion');
    Logger.success('Edit Grant page with all 8 accordions verified');
  }

  async verifyFLCModalOpen(): Promise<void> {
    await this.verifyElementVisible(this.flcModal,              'FLC modal');
    await this.verifyElementVisible(this.flcModalGrantDropdown, 'Grant dropdown (pre-filled)');
    await this.verifyElementVisible(this.flcModalNameInput,     '*Funding Life Cycle Name input');
    await this.verifyElementVisible(this.flcModalStartDateInput,'*Start Date input');
    await this.verifyElementVisible(this.flcModalEndDateInput,  '*End Date input');
    await this.verifyElementVisible(this.flcModalSubmit,        'Submit button');
    await this.verifyElementVisible(this.flcModalCancel,        'Cancel button');
    Logger.success('Add Funding Life Cycle modal verified');
  }

  async verifyGrantFundingModalOpen(): Promise<void> {
    await this.verifyElementVisible(this.grantFundingModal,                     'Grant Funding modal');
    await this.verifyElementVisible(this.grantFundingModalProgramDropdown,       '*Program dropdown');
    await this.verifyElementVisible(this.grantFundingModalGrantDropdown,         '*Grant dropdown');
    await this.verifyElementVisible(this.grantFundingModalFundingSourceDropdown, '*Funding Source dropdown');
    await this.verifyElementVisible(this.grantFundingModalAmountInput,           '*Amount($) input');
    await this.verifyElementVisible(this.grantFundingModalSubmit,                'Submit button');
    await this.verifyElementVisible(this.grantFundingModalCancel,                'Cancel button');
    Logger.success('Add Grant Funding modal verified');
  }

  async verifyMilestoneModalOpen(): Promise<void> {
    await this.verifyElementVisible(this.milestoneModal,          'Milestone modal');
    await this.verifyElementVisible(this.milestoneFLCNameDropdown,'*Funding Life Cycle Name dropdown');
    await this.verifyElementVisible(this.milestoneNameInput,      '*Milestone Name input');
    await this.verifyElementVisible(this.milestoneStartDateInput, '*Start Date input');
    await this.verifyElementVisible(this.milestoneEndDateInput,   '*End Date input');
    await this.verifyElementVisible(this.milestoneModalSubmit,    'Submit button');
    await this.verifyElementVisible(this.milestoneModalCancel,    'Cancel button');
    Logger.success('Add Milestone modal verified');
  }

  async verifyTOCModalOpen(): Promise<void> {
    await this.verifyElementVisible(this.tocModal,              'TOC modal');
    await this.verifyElementVisible(this.tocContentNameInput,   '*Content Name input');
    await this.verifyElementVisible(this.tocDescriptionTextarea,'Description textarea');
    await this.verifyElementVisible(this.tocModalSubmit,        'Submit button');
    await this.verifyElementVisible(this.tocModalCancel,        'Cancel button');
    Logger.success('Add Table Of Content modal verified');
  }

  /**
   * Get the current status value from the status dropdown.
   */
  async getCurrentStatus(): Promise<string> {
    const value = await this.statusDropdown.inputValue();
    const text  = await this.statusDropdown.locator(`option[value="${value}"]`).textContent();
    Logger.info(`Current grant status: "${text?.trim()}"`);
    return text?.trim() || value;
  }
}

// Import for use in spec
import { Assertions } from '@utils/assertions';