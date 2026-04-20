/**
 * OrgRegistrationFactory
 * Generates test data for Organization Registration (3-tab form)
 *
 * Tab 1 - Organization Information
 * Tab 2 - Contact Information
 * Tab 3 - Supporting Documents
 */

import { BaseTestDataFactory, TestDataTracker } from './BaseTestDataFactory';

/* ==================== INTERFACES ==================== */

/** Tab 1 – Organization Information */
export interface OrgInfo {
  isNonProfit: boolean;                  // Yes / No radio
  natureOfOrganization: string;          // dropdown
  legalName: string;
  mission: string;                       // max 200 chars
  natureOfAffiliation?: string;          // max 2000 chars
  mdCharityId: string;                   // MD CID
  federalTaxId: string;                  // EIN  XX-XXXXXXX
  marylandStateId: string;               // Maryland State Dept of Assessments ID
  financialYearBegins: string;           // e.g. "01/01"
  financialYearEnds: string;             // e.g. "12/31"
  yearIncorporated?: string;             // 4-digit year
  taxExempt: boolean;
  website?: string;
  physicalAddress: OrgAddress;
  mailingAddressSameAsPhysical: boolean;
  mailingAddress?: OrgAddress;           // only filled when not same
}

export interface OrgAddress {
  addressLine1: string;
  addressLine2?: string;
  state: string;                         // dropdown value e.g. "Maryland"
  county?: string;                       // dropdown
  district?: string;                     // dropdown
  districtArea?: string;                 // dropdown
  city: string;
  zipCode: string;
}

/** Tab 1 – Primary Contact Details (bottom of first tab) */
export interface OrgPrimaryContact {
  title?: string;                        // dropdown: Mr / Ms / Dr etc.
  firstName: string;
  lastName: string;
  email: string;
  officePhone: string;
  personalPhone?: string;
}

/** Tab 1 – User Details (bottom of first tab) */
export interface OrgUserDetails {
  username: string;
  password: string;
  confirmPassword: string;
  organizationRole: string;             // dropdown
}

/** Complete data bundle for Tab 1 */
export interface OrgTab1Data {
  orgInfo: OrgInfo;
  primaryContact: OrgPrimaryContact;
  userDetails: OrgUserDetails;
}

/** Tab 2 – Add Contact Information (modal) */
export interface OrgContactData {
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  officePhone: string;
  personalPhone?: string;
  username: string;
  password: string;
  confirmPassword: string;
  organizationRole: string;
}

/** Tab 3 – Supporting Document entry */
export interface OrgSupportingDoc {
  slNo: number;                          // 1-18 as seen in the checklist
  description: string;                   // label text (for logging/verification)
  filePath?: string;                     // local file path for upload (optional)
}

/** Full registration data across all 3 tabs */
export interface CompleteOrgRegistrationData {
  tab1: OrgTab1Data;
  tab2Contacts: OrgContactData[];
  tab3Documents: OrgSupportingDoc[];
}

/* ==================== FACTORY ==================== */

export class OrgRegistrationFactory extends BaseTestDataFactory {

  /* ---- helpers ---- */

  private static generateEIN(): string {
    const p1 = this.generateRandomNumber(10, 99);
    const p2 = this.generateRandomNumber(1000000, 9999999);
    return `${p1}-${p2}`;
  }

  private static generateMDCharityId(): string {
    return `MD${this.generateRandomNumber(100000, 999999)}`;
  }

  private static generateMarylandStateId(): string {
    return `MSD${this.generateRandomNumber(10000000, 99999999)}`;
  }

  private static generatePassword(): string {
    // Meets the portal rule: 8+ chars, upper, lower, number, special char
    const ts = this.generateTimestamp();
    return `Org@${ts}`;
  }

  private static generateUsername(prefix = 'org'): string {
    return `${prefix}${this.generateTimestamp()}`;
  }

  /* ---- address ---- */

  static generateAddress(isPO = false): OrgAddress {
    return {
      addressLine1: isPO ? '123 Main Street' : `${this.generateRandomNumber(100, 9999)} Test Ave`,
      addressLine2: '',
      state: 'Maryland',
      county: 'Montgomery',
      district: '',
      districtArea: '',
      city: 'Rockville',
      zipCode: `${this.generateRandomNumber(20800, 20899)}`,
    };
  }

  /* ---- Tab 1 ---- */

  static generateOrgInfo(overrides: Partial<OrgInfo> = {}): OrgInfo {
    const ts = this.generateTimestamp();
    const physicalAddress = this.generateAddress();

    return {
      isNonProfit: true,
      natureOfOrganization: 'Charitable Organization',
      legalName: `Test Organization ${ts}`,
      mission: `To provide automated testing services for grant management systems. Created ${ts}.`,
      natureOfAffiliation: `Affiliated with testing consortium ${ts}`,
      mdCharityId: this.generateMDCharityId(),
      federalTaxId: this.generateEIN(),
      marylandStateId: this.generateMarylandStateId(),
      financialYearBegins: '01/01',
      financialYearEnds: '12/31',
      yearIncorporated: '2010',
      taxExempt: true,
      website: `https://testorg${ts}.example.com`,
      physicalAddress,
      mailingAddressSameAsPhysical: true,
      ...overrides,
    };
  }

  static generatePrimaryContact(overrides: Partial<OrgPrimaryContact> = {}): OrgPrimaryContact {
    const ts = this.generateTimestamp();
    return {
      title: 'Mr.',
      firstName: 'Primary',
      lastName: `Contact${ts}`,
      email: this.generateEmail('primary'),
      officePhone: this.generatePhoneNumber(),
      personalPhone: this.generatePhoneNumber(),
      ...overrides,
    };
  }

  static generateUserDetails(overrides: Partial<OrgUserDetails> = {}): OrgUserDetails {
    const password = this.generatePassword();
    return {
      username: this.generateUsername('orguser'),
      password,
      confirmPassword: password,
      organizationRole: 'Administrator',
      ...overrides,
    };
  }

  /** Full Tab 1 bundle */
  static generateTab1Data(overrides: Partial<OrgTab1Data> = {}): OrgTab1Data {
    const tab1: OrgTab1Data = {
      orgInfo: this.generateOrgInfo(overrides.orgInfo),
      primaryContact: this.generatePrimaryContact(overrides.primaryContact),
      userDetails: this.generateUserDetails(overrides.userDetails),
    };

    // Track the org user
    TestDataTracker.trackUser(
      tab1.primaryContact.email,
      tab1.userDetails.password,
      'organization'
    );

    return tab1;
  }

  /* ---- Tab 2 ---- */

  static generateContact(overrides: Partial<OrgContactData> = {}): OrgContactData {
    const ts = this.generateTimestamp();
    const password = this.generatePassword();
    return {
      title: 'Ms.',
      firstName: 'Additional',
      lastName: `Contact${ts}`,
      email: this.generateEmail('contact'),
      officePhone: this.generatePhoneNumber(),
      personalPhone: this.generatePhoneNumber(),
      username: this.generateUsername('contact'),
      password,
      confirmPassword: password,
      organizationRole: 'Standard User',
      ...overrides,
    };
  }

  static generateContacts(count = 1): OrgContactData[] {
    return Array.from({ length: count }, () => this.generateContact());
  }

  /* ---- Tab 3 ---- */

  /** Returns the full checklist of 18 supporting documents (no files by default) */
  static generateSupportingDocumentChecklist(): OrgSupportingDoc[] {
    return [
      { slNo: 1,  description: 'Attachment A – Orgs with total annual revenue < $10,000 (If Applicable)' },
      { slNo: 2,  description: 'Attachment B – Mission/Purpose of the Organization' },
      { slNo: 3,  description: 'Attachment C – Narrative description of proposed use of grant funds' },
      { slNo: 4,  description: 'Attachment D – Grants received from County Council (past 5 years)' },
      { slNo: 5,  description: 'Attachment E – Grants received from ISSI GMS (past 5 years)' },
      { slNo: 6,  description: 'ISSI GMS Authorization for Electronic Funds Transfer Form' },
      { slNo: 7,  description: 'Current MD Charity Certificate of Registration' },
      { slNo: 8,  description: 'Evidence for Non Profit Organization' },
      { slNo: 9,  description: 'Letter of Good Standing (umbrella orgs only)' },
      { slNo: 10, description: 'Independent Audit – required for orgs with total revenue >= $300,000' },
      { slNo: 11, description: 'IRS Form 990, 990-EZ or applicable tax return' },
      { slNo: 12, description: 'IRS Form W-9' },
      { slNo: 13, description: 'IRS Tax-Exempt Determination/Status Letter' },
      { slNo: 14, description: "Organization's Financial Statements" },
      { slNo: 15, description: "Organization's signed By-Laws or Articles of Incorporation" },
      { slNo: 16, description: 'Fiscal/calendar year Organizational budget including grant funds' },
      { slNo: 17, description: 'Line item budget for requested grant funds' },
      { slNo: 18, description: "Roster of Organization's current Board of Directors & Staff Members" },
    ];
  }

  /**
   * Returns a subset of documents that have a filePath set.
   * Pass your actual test-file paths here.
   */
  static generateDocsWithFiles(filePaths: Record<number, string> = {}): OrgSupportingDoc[] {
    return this.generateSupportingDocumentChecklist().map(doc => ({
      ...doc,
      filePath: filePaths[doc.slNo],
    }));
  }

  /* ---- Complete registration ---- */

  static generateCompleteRegistration(
    overrides: Partial<CompleteOrgRegistrationData> = {}
  ): CompleteOrgRegistrationData {
    return {
      tab1: this.generateTab1Data(overrides.tab1),
      tab2Contacts: overrides.tab2Contacts ?? this.generateContacts(1),
      tab3Documents: overrides.tab3Documents ?? this.generateSupportingDocumentChecklist(),
    };
  }

  /* ---- Scenario helpers ---- */

  /** Minimal registration – only required fields, no optional ones */
  static generateMinimalRegistration(): CompleteOrgRegistrationData {
    const password = this.generatePassword();
    const ts = this.generateTimestamp();

    return {
      tab1: {
        orgInfo: {
          isNonProfit: true,
          natureOfOrganization: 'Charitable Organization',
          legalName: `Minimal Org ${ts}`,
          mission: `Minimal mission statement ${ts}`,
          mdCharityId: this.generateMDCharityId(),
          federalTaxId: this.generateEIN(),
          marylandStateId: this.generateMarylandStateId(),
          financialYearBegins: '01/01',
          financialYearEnds: '12/31',
          taxExempt: true,
          physicalAddress: this.generateAddress(),
          mailingAddressSameAsPhysical: true,
        },
        primaryContact: {
          firstName: 'Min',
          lastName: `User${ts}`,
          email: this.generateEmail('minimal'),
          officePhone: this.generatePhoneNumber(),
        },
        userDetails: {
          username: this.generateUsername('minorg'),
          password,
          confirmPassword: password,
          organizationRole: 'Administrator',
        },
      },
      tab2Contacts: [],
      tab3Documents: this.generateSupportingDocumentChecklist(),
    };
  }
}