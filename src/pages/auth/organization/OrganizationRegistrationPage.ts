/**
 * OrganizationRegistrationPage
 *
 * Locators derived directly from the live HTML source of issigmsdev.issi-software.com/create
 *
 * Pattern: readonly locator + constructor  ← consistent with every page in this framework
 *
 * ── IMPORTANT NOTES FROM THE HTML SOURCE ──────────────────────────────────────
 *
 *  1. The 3 tabs are Bootstrap tabs (data-toggle="tab"), NOT separate pages.
 *     Clicking "Next" uses jQuery .tab('show') — the URL never changes.
 *     Flow: Tab 1 →(#orginfoNextBtn)→ Tab 2 →(#contactButton)→ Tab 3
 *
 *  2. Physical Address Line 1 & Line 2 are <textarea> elements, NOT <input>.
 *     Use fillInput() — it works on both.
 *
 *  3. State dropdowns populate county via AJAX on change.
 *     Selecting by label is safe: page.selectOption({ label: 'Maryland' })
 *     Always wait ~1500ms after state selection for county AJAX to complete.
 *
 *  4. Radios:
 *       Non-profit  → name="profitorg_not"   values: "Y" / "N"
 *       Tax exempt  → name="tax_exempt"       values: "Y" / "N"  (Y pre-checked)
 *       Mailing     → name="contact_yes_no"   values: "Yes" / "No"
 *         "Yes" triggers JS fillContactInfoFromDropdown(true) → copies physical,
 *              disables mailing fields
 *         "No"  triggers fillContactInfoFromDropdown(false) → re-enables them
 *
 *  5. Upload buttons on Tab 3 are <button class="show-form attachments"> that
 *     open a popup via AJAX. There is NO native <input type="file"> accessible
 *     from the main page. File upload must be handled inside that popup.
 *
 *  6. "Add New Contact" on Tab 2 is <a class="show-form-con link-btn"> that
 *     loads a form into #modal-lgbook .modal-content via AJAX.
 *
 *  7. Password field IDs: create_password1 / create_password2 (NOT id_password1).
 *
 *  8. Org Role dropdown id="id_Organization_role" name="Organization_role"
 *     Option values: "21" Clerk | "2" Director | "4" Applicant
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { Page, Locator } from '@playwright/test';
import { SharedComponents } from '@pages/base/SharedComponents';
import { Logger } from '@utils/logger';
import {
  OrgInfo,
  OrgAddress,
  OrgPrimaryContact,
  OrgUserDetails,
  OrgContactData,
  OrgSupportingDoc,
} from '@utils/factories/OrgRegistrationFactory';

export class OrganizationRegistrationPage extends SharedComponents {

  /* ============================================================
   * TAB NAVIGATION  (left sidebar nav-pills)
   * ============================================================ */
  readonly tabOrgInfo: Locator;         // id="orgadeneral-tab"
  readonly tabContactInfo: Locator;     // id="orgcontact-tab"
  readonly tabSupportingDocs: Locator;  // id="document-tab"

  /* ============================================================
   * TAB 1 – ORGANIZATION INFORMATION
   * ============================================================ */

  // ── Non-profit radios  name="profitorg_not" ──────────────────
  readonly radioNonProfitYes: Locator;    // id="id_profitorg_not_0"  value="Y"
  readonly radioNonProfitNo: Locator;     // id="id_profitorg_not_1"  value="N"

  // ── Nature of organization ────────────────────────────────────
  readonly selectNatureOfOrg: Locator;    // id="id_natureof_organization"

  // ── Core org fields ───────────────────────────────────────────
  readonly inputLegalName: Locator;              // id="id_org_legalname"         maxlength=500
  readonly textareaMission: Locator;             // id="id_mission_pur_of_org"    maxlength=200
  readonly textareaNatureOfAffiliation: Locator; // id="id_nature_of_affiliation" maxlength=2000
  readonly inputMdCharityId: Locator;            // id="id_cid_number"            maxlength=5, numberonly
  readonly inputFederalTaxId: Locator;           // id="id_federaltax_id"         maxlength=10
  readonly inputMarylandStateId: Locator;        // id="id_maryland_id"           maxlength=9

  // ── Financial year dates (datepicker) ─────────────────────────
  readonly inputFinancialYearBegins: Locator;    // id="YearBegins"  name="org_startdate"
  readonly inputFinancialYearEnds: Locator;      // id="YearEnds"    name="org_enddate"
                                                 //   JS auto-populates this when YearBegins changes

  // ── Year incorporated (optional) ──────────────────────────────
  readonly inputYearIncorporated: Locator;       // id="id_year_incorporated"  maxlength=4

  // ── Tax exempt radios  name="tax_exempt" ──────────────────────
  readonly radioTaxExemptYes: Locator;           // id="id_tax_exempt_0"  value="Y"  (pre-checked)
  readonly radioTaxExemptNo: Locator;            // id="id_tax_exempt_1"  value="N"

  // ── Website (optional) ────────────────────────────────────────
  readonly inputWebsite: Locator;                // id="id_website"  maxlength=1000

  /* ── Physical Address ────────────────────────────────────────── */
  readonly textareaPhysicalAddressLine1: Locator;  // id="id_physical_address"  textarea  maxlength=200
  readonly textareaPhysicalAddressLine2: Locator;  // id="id_phy_address2"       textarea  maxlength=200
  readonly selectPhysicalState: Locator;           // id="id_state"              triggers AJAX → county
  readonly selectPhysicalCounty: Locator;          // id="id_county"             populated via AJAX
  readonly selectPhysicalDistrict: Locator;        // id="id_phy_district"
  readonly selectPhysicalDistrictAreas: Locator;   // id="id_phy_areas"          multiple, jquery.multiselect
  readonly inputPhysicalCity: Locator;             // id="id_city"               maxlength=30  nameonlyorg
  readonly inputPhysicalZipCode: Locator;          // id="id_zip"                maxlength=5   numberonly

  /* ── Mailing-same toggle  name="contact_yes_no" ──────────────── */
  readonly radioMailingSameYes: Locator;           // id="award_sent_yes"  value="Yes"
  readonly radioMailingSameNo: Locator;            // id="award_sent_no"   value="No"

  /* ── Mailing Address (enabled only when "No" is chosen) ──────── */
  readonly textareaMailingAddressLine1: Locator;   // id="id_mailing_address"  textarea  maxlength=200
  readonly textareaMailingAddressLine2: Locator;   // id="id_mail_address2"    textarea  maxlength=200
  readonly selectMailingState: Locator;            // id="id_mail_state"       triggers AJAX → county
  readonly selectMailingCounty: Locator;           // id="id_mail_county"      populated via AJAX
  readonly inputMailingCity: Locator;              // id="id_mail_city"        maxlength=30
  readonly inputMailingZipCode: Locator;           // id="id_mail_zipcode"     maxlength=5
  readonly inputMailingTelephone: Locator;         // id="id_telephone_number" maxlength=14

  /* ── Primary Contact Details ──────────────────────────────────── */
  readonly selectPrimaryTitle: Locator;            // id="id_title"          options: Mr./Mrs./Ms./Dr./Hon.
  readonly inputPrimaryFirstName: Locator;         // id="id_first_name"     maxlength=120  nameonlyorg
  readonly inputPrimaryLastName: Locator;          // id="id_last_name"      maxlength=120  nameonlyorg
  readonly inputPrimaryEmail: Locator;             // id="id_email"          maxlength=100
  readonly inputPrimaryOfficePhone: Locator;       // id="id_phoneno_office" maxlength=14   numberonly
  readonly inputPrimaryPersonalPhone: Locator;     // id="id_phoneno_cell"   maxlength=14   numberonly

  /* ── User Details ──────────────────────────────────────────────── */
  readonly inputUsername: Locator;                 // id="id_username"          maxlength=120
  readonly inputPassword: Locator;                 // id="create_password1"     name="password1"
  readonly inputConfirmPassword: Locator;          // id="create_password2"     name="password2"
  readonly selectOrganizationRole: Locator;        // id="id_Organization_role" name="Organization_role"
                                                   //   options: "21" Clerk | "2" Director | "4" Applicant

  /* ── Tab 1 action buttons ──────────────────────────────────────── */
  readonly btnNextTab1: Locator;    // id="orginfoNextBtn"  type="button"  (JS: shows orgcontact tab)
  readonly btnResetTab1: Locator;   // id="reset_id"        type="reset"
  readonly btnCancelTab1: Locator;  // id="canclled"        shows SweetAlert confirm before redirecting

  /* ============================================================
   * TAB 2 – CONTACT INFORMATION
   * ============================================================ */

  // "Add New Contact" link — AJAX loads form into #modal-lgbook
  readonly linkAddNewContact: Locator;   // a.show-form-con.link-btn  text="+ Add New Contact"

  // Modal wrapper
  readonly modalAddContact: Locator;    // #modal-lgbook .modal-content

  // Modal inner fields (scoped to modal) — rendered via AJAX after clicking Add New Contact
  // Field names come from the Add Contact Information modal shown in the screenshots
  readonly modalSelectTitle: Locator;
  readonly modalInputFirstName: Locator;
  readonly modalInputLastName: Locator;
  readonly modalInputEmail: Locator;
  readonly modalInputOfficePhone: Locator;
  readonly modalInputPersonalPhone: Locator;
  readonly modalInputUsername: Locator;
  readonly modalInputPassword: Locator;
  readonly modalInputConfirmPassword: Locator;
  readonly modalSelectOrgRole: Locator;
  readonly modalBtnSubmit: Locator;
  readonly modalBtnCancel: Locator;

  // Contact DataTable
  readonly contactTable: Locator;       // id="contactinfoorgindex"

  /* ── Tab 2 action buttons ── */
  readonly btnBackTab2: Locator;    // id="prevButton"     (goes back to Tab 1)
  readonly btnNextTab2: Locator;    // id="contactButton"  (goes to Tab 3)

  /* ============================================================
   * TAB 3 – SUPPORTING DOCUMENTS
   * ============================================================ */

  readonly supportingDocumentsTable: Locator;  // id="supportingdocments"
  readonly supportingDocError: Locator;         // id="id_suportingerror"

  /* ── Tab 3 action buttons ── */
  readonly btnSubmitTab3: Locator;          // id="button_id"               type="submit"
  readonly btnBackTab3: Locator;            // id="supportpreviousButton"   (goes back to Tab 2)

  /* ============================================================
   * CONSTRUCTOR
   * ============================================================ */
  constructor(page: Page) {
    super(page);

    /* ── Tab sidebar ── */
    this.tabOrgInfo        = page.locator('.nav-link active,#orgadeneral-tab');
    this.tabContactInfo    = page.locator('#orgcontact-tab');
    this.tabSupportingDocs = page.locator('#document-tab');

    /* ── Non-profit radios ── */
    this.radioNonProfitYes = page.locator('#id_profitorg_not_0');
    this.radioNonProfitNo  = page.locator('#id_profitorg_not_1');

    /* ── Org fields ── */
    this.selectNatureOfOrg           = page.locator('#id_natureof_organization');
    this.inputLegalName              = page.locator('#id_org_legalname');
    this.textareaMission             = page.locator('#id_mission_pur_of_org');
    this.textareaNatureOfAffiliation = page.locator('#id_nature_of_affiliation');
    this.inputMdCharityId            = page.locator('#id_cid_number');
    this.inputFederalTaxId           = page.locator('#id_federaltax_id');
    this.inputMarylandStateId        = page.locator('#id_maryland_id');
    this.inputFinancialYearBegins    = page.locator('#YearBegins');
    this.inputFinancialYearEnds      = page.locator('#YearEnds');
    this.inputYearIncorporated       = page.locator('#id_year_incorporated');

    /* ── Tax exempt radios ── */
    this.radioTaxExemptYes = page.locator('#id_tax_exempt_0');
    this.radioTaxExemptNo  = page.locator('#id_tax_exempt_1');

    this.inputWebsite = page.locator('#id_website');

    /* ── Physical address ── */
    this.textareaPhysicalAddressLine1 = page.locator('#id_physical_address');
    this.textareaPhysicalAddressLine2 = page.locator('#id_phy_address2');
    this.selectPhysicalState          = page.locator('#id_state');
    this.selectPhysicalCounty         = page.locator('#id_county');
    this.selectPhysicalDistrict       = page.locator('#id_phy_district');
    this.selectPhysicalDistrictAreas  = page.locator('#id_phy_areas');
    this.inputPhysicalCity            = page.locator('#id_city');
    this.inputPhysicalZipCode         = page.locator('#id_zip');

    /* ── Mailing same toggle ── */
    this.radioMailingSameYes = page.locator('#award_sent_yes');
    this.radioMailingSameNo  = page.locator('#award_sent_no');

    /* ── Mailing address ── */
    this.textareaMailingAddressLine1 = page.locator('#id_mailing_address');
    this.textareaMailingAddressLine2 = page.locator('#id_mail_address2');
    this.selectMailingState          = page.locator('#id_mail_state');
    this.selectMailingCounty         = page.locator('#id_mail_county');
    this.inputMailingCity            = page.locator('#id_mail_city');
    this.inputMailingZipCode         = page.locator('#id_mail_zipcode');
    this.inputMailingTelephone       = page.locator('#id_telephone_number');

    /* ── Primary contact ── */
    this.selectPrimaryTitle        = page.locator('#id_title');
    this.inputPrimaryFirstName     = page.locator('#id_first_name');
    this.inputPrimaryLastName      = page.locator('#id_last_name');
    this.inputPrimaryEmail         = page.locator('#id_email');
    this.inputPrimaryOfficePhone   = page.locator('#id_phoneno_office');
    this.inputPrimaryPersonalPhone = page.locator('#id_phoneno_cell');

    /* ── User details ── */
    this.inputUsername          = page.locator('#id_username');
    this.inputPassword          = page.locator('#create_password1');
    this.inputConfirmPassword   = page.locator('#create_password2');
    this.selectOrganizationRole = page.locator('#id_Organization_role');

    /* ── Tab 1 buttons ── */
    this.btnNextTab1   = page.locator('#orginfoNextBtn');
    this.btnResetTab1  = page.locator('#reset_id');
    this.btnCancelTab1 = page.locator('#canclled').first();

    /* ── Tab 2 ── */
    this.linkAddNewContact = page.locator('a.show-form-con.link-btn');
    this.modalAddContact   = page.locator('#modal-lgbook .modal-content');

    // Modal fields scoped to the modal wrapper
    this.modalSelectTitle          = this.modalAddContact.locator('select[name="title"]');
    this.modalInputFirstName       = this.modalAddContact.locator('input[name="first_name"]');
    this.modalInputLastName        = this.modalAddContact.locator('input[name="last_name"]');
    this.modalInputEmail           = this.modalAddContact.locator('input[name="email"]');
    this.modalInputOfficePhone     = this.modalAddContact.locator('input[name="phoneno_office"]');
    this.modalInputPersonalPhone   = this.modalAddContact.locator('input[name="phoneno_cell"]');
    this.modalInputUsername        = this.modalAddContact.locator('input[name="username"]');
    this.modalInputPassword        = this.modalAddContact.locator('input[name="password1"]');
    this.modalInputConfirmPassword = this.modalAddContact.locator('input[name="password2"]');
    this.modalSelectOrgRole        = this.modalAddContact.locator('select[name="Organization_role"]');
    this.modalBtnSubmit            = this.modalAddContact.locator('button:has-text("Submit"), input[type="submit"]').first();
    this.modalBtnCancel            = this.modalAddContact.locator('button:has-text("Cancel")').first();

    this.contactTable = page.locator('#contactinfoorgindex');
    this.btnBackTab2  = page.locator('#prevButton');
    this.btnNextTab2  = page.locator('#contactButton');

    /* ── Tab 3 ── */
    this.supportingDocumentsTable = page.locator('#supportingdocments');
    this.supportingDocError       = page.locator('#id_suportingerror');
    this.btnSubmitTab3            = page.locator('#button_id');
    this.btnBackTab3              = page.locator('#supportpreviousButton');
  }

  /* ============================================================
   * HELPER LOCATORS (dynamic, based on row number)
   * ============================================================ */

  /**
   * Get the Upload button for a specific row (1–18) in the Supporting Documents table.
   * Each row's first <td> contains the row number as text.
   * The button: <button class="show-form attachments supdoc-upload-btn">
   *
   * ⚠️ These buttons open a custom AJAX popup — NOT a native file dialog.
   */
  getUploadButtonForRow(slNo: number): Locator {
    return this.page
      .locator('#supportingdocments tbody tr')
      .filter({ has: this.page.locator(`td:first-child:text-is("${slNo}")`) })
      .locator('button.attachments');
  }

  /**
   * Get the hidden input that tracks upload status for a row.
   * id="suportingdocument_1" through "suportingdocument_18"
   * value="0" = not uploaded, value="1" = uploaded
   */
  getDocumentStatusInput(slNo: number): Locator {
    return this.page.locator(`#suportingdocument_${slNo}`);
  }

  /* ============================================================
   * TAB 1 – ACTION METHODS
   * ============================================================ */

  /** Select the non-profit radio: "Y" = Yes, "N" = No */
  async selectNonProfitStatus(isNonProfit: boolean): Promise<void> {
    Logger.step(`Selecting non-profit status: ${isNonProfit ? 'Yes' : 'No'}`);
    const radio = isNonProfit ? this.radioNonProfitYes : this.radioNonProfitNo;
    await radio.check();
    Logger.success('Non-profit status selected');
  }

  /** Fill all Organization Information fields */
  async fillOrgInfo(orgInfo: OrgInfo): Promise<void> {
    Logger.step('Filling Organization Information');

    await this.selectNonProfitStatus(orgInfo.isNonProfit);

    if (orgInfo.natureOfOrganization) {
      await this.selectNatureOfOrg.selectOption({ label: orgInfo.natureOfOrganization });
    }

    await this.fillInput(this.inputLegalName, orgInfo.legalName, 'Legal Name');
    await this.fillInput(this.textareaMission, orgInfo.mission, 'Mission/Purpose');

    if (orgInfo.natureOfAffiliation) {
      await this.fillInput(this.textareaNatureOfAffiliation, orgInfo.natureOfAffiliation, 'Nature of Affiliation');
    }

    await this.fillInput(this.inputMdCharityId, orgInfo.mdCharityId, 'MD Charity ID');
    await this.fillInput(this.inputFederalTaxId, orgInfo.federalTaxId, 'Federal Tax ID');
    await this.fillInput(this.inputMarylandStateId, orgInfo.marylandStateId, 'Maryland State ID');

    // Fill year begins then trigger change so JS auto-populates year ends
    await this.fillInput(this.inputFinancialYearBegins, orgInfo.financialYearBegins, 'Financial Year Begins');
    await this.inputFinancialYearBegins.dispatchEvent('change');
    await this.wait(600);
    await this.fillInput(this.inputFinancialYearEnds, orgInfo.financialYearEnds, 'Financial Year Ends');

    if (orgInfo.yearIncorporated) {
      await this.fillInput(this.inputYearIncorporated, orgInfo.yearIncorporated, 'Year Incorporated');
    }

    // Tax exempt is pre-checked "Y"; only uncheck if explicitly false
    if (!orgInfo.taxExempt) {
      await this.radioTaxExemptNo.check();
      Logger.info('Tax exempt set to No');
    }

    if (orgInfo.website) {
      await this.fillInput(this.inputWebsite, orgInfo.website, 'Website');
    }

    await this.fillPhysicalAddress(orgInfo.physicalAddress);

    if (orgInfo.mailingAddressSameAsPhysical) {
      await this.radioMailingSameYes.check();
      await this.wait(800); // wait for JS fillContactInfoFromDropdown(true)
      Logger.info('Mailing address set to same as physical');
    } else {
      await this.radioMailingSameNo.check();
      await this.wait(300);
      if (orgInfo.mailingAddress) {
        await this.fillMailingAddress(orgInfo.mailingAddress);
      }
    }

    Logger.success('Organization Information filled');
  }

  /**
   * Fill the Physical Address section.
   *
   * State selection triggers AJAX to populate the county dropdown.
   * Always waits 1500ms after state selection before choosing county.
   */
  async fillPhysicalAddress(address: OrgAddress): Promise<void> {
    Logger.step('Filling Physical Address');

    await this.fillInput(this.textareaPhysicalAddressLine1, address.addressLine1, 'Physical Address Line 1');

    if (address.addressLine2) {
      await this.fillInput(this.textareaPhysicalAddressLine2, address.addressLine2, 'Physical Address Line 2');
    }

    // Select state by label (e.g. "Maryland") — triggers AJAX for county
    await this.selectPhysicalState.selectOption({ label: address.state });
    Logger.info(`Physical state: ${address.state} — waiting for county AJAX`);
    await this.wait(1500);

    if (address.county) {
      await this.selectPhysicalCounty.selectOption({ label: address.county });
      Logger.info(`Physical county: ${address.county}`);
    }

    await this.fillInput(this.inputPhysicalCity, address.city, 'Physical City');
    await this.fillInput(this.inputPhysicalZipCode, address.zipCode, 'Physical Zip Code');

    Logger.success('Physical Address filled');
  }

  /**
   * Fill the Mailing Address section.
   * Only called when "No" is selected for the mailing-same toggle.
   */
  async fillMailingAddress(address: OrgAddress): Promise<void> {
    Logger.step('Filling Mailing Address');

    await this.fillInput(this.textareaMailingAddressLine1, address.addressLine1, 'Mailing Address Line 1');

    if (address.addressLine2) {
      await this.fillInput(this.textareaMailingAddressLine2, address.addressLine2, 'Mailing Address Line 2');
    }

    await this.selectMailingState.selectOption({ label: address.state });
    Logger.info(`Mailing state: ${address.state} — waiting for county AJAX`);
    await this.wait(1500);

    if (address.county) {
      await this.selectMailingCounty.selectOption({ label: address.county });
    }

    await this.fillInput(this.inputMailingCity, address.city, 'Mailing City');
    await this.fillInput(this.inputMailingZipCode, address.zipCode, 'Mailing Zip Code');

    Logger.success('Mailing Address filled');
  }

  /** Fill Primary Contact Details section */
  async fillPrimaryContact(contact: OrgPrimaryContact): Promise<void> {
    Logger.step('Filling Primary Contact Details');

    if (contact.title) {
      await this.selectPrimaryTitle.selectOption({ label: contact.title });
    }

    await this.fillInput(this.inputPrimaryFirstName, contact.firstName, 'Primary First Name');
    await this.fillInput(this.inputPrimaryLastName, contact.lastName, 'Primary Last Name');
    await this.fillInput(this.inputPrimaryEmail, contact.email, 'Primary Email');
    await this.fillInput(this.inputPrimaryOfficePhone, contact.officePhone, 'Primary Office Phone');

    if (contact.personalPhone) {
      await this.fillInput(this.inputPrimaryPersonalPhone, contact.personalPhone, 'Primary Personal Phone');
    }

    Logger.success('Primary Contact Details filled');
  }

  /**
   * Fill User Details section.
   * Org Role: pass label text e.g. "Clerk" / "Director" / "Applicant"
   */
  async fillUserDetails(userDetails: OrgUserDetails): Promise<void> {
    Logger.step('Filling User Details');

    await this.fillInput(this.inputUsername, userDetails.username, 'Username');
    await this.fillInput(this.inputPassword, userDetails.password, 'Password');
    await this.inputPassword.blur();
    await this.wait(200);
    await this.fillInput(this.inputConfirmPassword, userDetails.confirmPassword, 'Confirm Password');
    await this.inputConfirmPassword.blur();
    await this.wait(200);
    await this.selectOrganizationRole.selectOption({ label: userDetails.organizationRole });

    Logger.success('User Details filled');
  }

  /** Click the "Next →" button on Tab 1 (id="orginfoNextBtn") to navigate to Tab 2 */
  async clickNextOnTab1(): Promise<void> {
    Logger.step('Clicking Next on Tab 1');
    await this.clickElement(this.btnNextTab1, 'Next button (Tab 1)');
    await this.wait(500); // Bootstrap tab animation
    Logger.success('Navigated to Tab 2 – Contact Information');
  }

  /** Click Reset Form on Tab 1 (type="reset") */
  async clickResetTab1(): Promise<void> {
    Logger.step('Clicking Reset Form');
    await this.clickElement(this.btnResetTab1, 'Reset Form button');
    await this.wait(300);
    Logger.success('Form reset');
  }

  /* ============================================================
   * TAB 2 – ACTION METHODS
   * ============================================================ */

  /**
   * Click "+ Add New Contact" link.
   * Sends AJAX GET to load the contact form HTML into #modal-lgbook .modal-content,
   * then shows the Bootstrap modal.
   */
  async clickAddNewContact(): Promise<void> {
    Logger.step('Clicking "+ Add New Contact"');
    await this.clickElement(this.linkAddNewContact, 'Add New Contact link');
    // Wait for AJAX to render the form inside the modal
    await this.page.waitForSelector('#modal-lgbook .modal-content input[name="first_name"]', {
      state: 'visible',
      timeout: 10000,
    });
    Logger.success('Add Contact modal loaded');
  }

  /**
   * Fill and submit the Add Contact Information modal.
   * After Submit, waits for the modal to close before returning.
   */
  async fillAndSubmitContactModal(contact: OrgContactData): Promise<void> {
    Logger.step(`Filling contact: ${contact.firstName} ${contact.lastName}`);

    if (contact.title) {
      await this.modalSelectTitle.selectOption({ label: contact.title });
    }

    await this.fillInput(this.modalInputFirstName, contact.firstName, 'Modal First Name');
    await this.fillInput(this.modalInputLastName, contact.lastName, 'Modal Last Name');
    await this.fillInput(this.modalInputEmail, contact.email, 'Modal Email');
    await this.fillInput(this.modalInputOfficePhone, contact.officePhone, 'Modal Office Phone');

    if (contact.personalPhone) {
      await this.fillInput(this.modalInputPersonalPhone, contact.personalPhone, 'Modal Personal Phone');
    }

    await this.fillInput(this.modalInputUsername, contact.username, 'Modal Username');
    await this.fillInput(this.modalInputPassword, contact.password, 'Modal Password');
    await this.fillInput(this.modalInputConfirmPassword, contact.confirmPassword, 'Modal Confirm Password');
    await this.modalSelectOrgRole.selectOption({ label: contact.organizationRole });

    await this.clickElement(this.modalBtnSubmit, 'Modal Submit');

    // Wait for modal to close
    await this.page.waitForSelector('#modal-lgbook .modal-content input[name="first_name"]', {
      state: 'hidden',
      timeout: 10000,
    });

    await this.wait(600); // DataTable refresh
    Logger.success(`Contact added: ${contact.email}`);
  }

  /** Add multiple contacts via the modal */
  async addContacts(contacts: OrgContactData[]): Promise<void> {
    Logger.step(`Adding ${contacts.length} contact(s)`);
    for (const contact of contacts) {
      await this.clickAddNewContact();
      await this.fillAndSubmitContactModal(contact);
    }
    Logger.success(`${contacts.length} contact(s) added`);
  }

  /** Check if a contact email appears in the DataTable */
  async verifyContactInTable(email: string): Promise<boolean> {
    return await this.isElementVisible(
      this.page.locator(`#contactinfoorgindex tbody td:has-text("${email}")`),
      5000
    );
  }

  /** Click "Next →" on Tab 2 (id="contactButton") to navigate to Tab 3 */
  async clickNextOnTab2(): Promise<void> {
    Logger.step('Clicking Next on Tab 2');
    await this.clickElement(this.btnNextTab2, 'Next button (Tab 2)');
    await this.wait(500);
    Logger.success('Navigated to Tab 3 – Supporting Documents');
  }

  /** Click "← Back" on Tab 2 (id="prevButton") to return to Tab 1 */
  async clickBackOnTab2(): Promise<void> {
    Logger.step('Clicking Back on Tab 2');
    await this.clickElement(this.btnBackTab2, 'Back button (Tab 2)');
    await this.wait(500);
  }

  /* ============================================================
   * TAB 3 – ACTION METHODS
   * ============================================================ */

  /**
   * Click the Upload button for a specific row (1–18).
   *
   * ⚠️ This opens an AJAX popup — NOT a native file dialog.
   * The actual file upload must be handled inside the popup.
   */
  async clickUploadButtonForRow(slNo: number): Promise<void> {
    Logger.step(`Clicking Upload for row ${slNo}`);
    const btn = this.getUploadButtonForRow(slNo);
    await this.waitForElement(btn);
    await btn.click();
    Logger.success(`Upload popup opened for row ${slNo}`);
  }

  /** Returns true if the hidden status input for a row has value="1" */
  async isDocumentUploaded(slNo: number): Promise<boolean> {
    const value = await this.getDocumentStatusInput(slNo).inputValue();
    return value === '1';
  }

  /** Count how many of the 18 documents have been uploaded */
  async getUploadedDocumentCount(): Promise<number> {
    let count = 0;
    for (let i = 1; i <= 18; i++) {
      if (await this.isDocumentUploaded(i)) count++;
    }
    Logger.info(`Uploaded documents: ${count}/18`);
    return count;
  }

  /** Click Submit on Tab 3 (id="button_id") */
  async clickSubmit(): Promise<void> {
    Logger.step('Clicking Submit on Tab 3');
    await this.clickElement(this.btnSubmitTab3, 'Submit button (Tab 3)');
    await this.waitForPageLoad();
    Logger.success('Registration submitted');
  }

  /** Click "← Back" on Tab 3 (id="supportpreviousButton") */
  async clickBackOnTab3(): Promise<void> {
    Logger.step('Clicking Back on Tab 3');
    await this.clickElement(this.btnBackTab3, 'Back button (Tab 3)');
    await this.wait(500);
  }

  /* ============================================================
   * FULL REGISTRATION FLOW
   * ============================================================ */

  async completeFullRegistration(data: {
    orgInfo: OrgInfo;
    primaryContact: OrgPrimaryContact;
    userDetails: OrgUserDetails;
    contacts?: OrgContactData[];
    documents?: OrgSupportingDoc[];
  }): Promise<void> {
    Logger.testStart('Organization Registration – Full 3-Tab Flow');

    await this.fillOrgInfo(data.orgInfo);
    await this.fillPrimaryContact(data.primaryContact);
    await this.fillUserDetails(data.userDetails);
    await this.clickNextOnTab1();

    if (data.contacts && data.contacts.length > 0) {
      await this.addContacts(data.contacts);
    } else {
      Logger.info('No additional contacts — skipping');
    }
    await this.clickNextOnTab2();

    if (data.documents && data.documents.length > 0) {
      Logger.info(
        `${data.documents.length} document(s) provided — ` +
        'Upload popup requires custom handling; auto-upload skipped.'
      );
    }
    await this.clickSubmit();

    Logger.testEnd('Organization Registration – Full 3-Tab Flow');
  }

  /* ============================================================
   * VERIFICATION METHODS
   * ============================================================ */

  /** Verify Organization Information tab pane is the active one */
  async verifyOrgInfoTabVisible(): Promise<void> {
    await this.verifyElementVisible(
      this.tabOrgInfo,
      'Organization Information tab'
    );
  }

  /** Verify Contact Information tab pane is active */
  async verifyContactInfoTabVisible(): Promise<void> {
    await this.verifyElementVisible(
      this.page.locator('#orgcontact.tab-pane.active'),
      'Contact Information tab'
    );
  }

  /** Verify Supporting Documents tab pane is active */
  async verifySupportingDocsTabVisible(): Promise<void> {
    await this.verifyElementVisible(
      this.page.locator('#document.tab-pane.active'),
      'Supporting Documents tab'
    );
  }

  /** Verify the documents table has exactly 18 rows */
  async verifySupportingDocumentsTableHas18Rows(): Promise<void> {
    Logger.step('Verifying 18 rows in Supporting Documents table');
    const count = await this.page.locator('#supportingdocments tbody tr').count();
    Logger.info(`Row count: ${count}`);
    if (count < 18) {
      throw new Error(`Expected 18 rows, found ${count}`);
    }
    Logger.success(`Supporting Documents table has ${count} rows ✓`);
  }

  /** Verify a specific document row is present by its partial checklist text */
  async verifyDocumentRowVisible(partialText: string): Promise<void> {
    await this.verifyElementVisible(
      this.page.locator(`#supportingdocments tbody td:has-text("${partialText}")`).first(),
      `Document row: "${partialText}"`
    );
  }

  /** Verify success message after submission */
  async verifyRegistrationSuccess(): Promise<void> {
    Logger.step('Verifying registration success message');
    const successMsg = this.page.locator('.swal2-html-container, .alert-success').first();
    await this.verifyElementVisible(successMsg, 'Registration success message');
    Logger.success('Organization registered successfully');
  }
}