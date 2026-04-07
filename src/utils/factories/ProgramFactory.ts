/**
 * Program Factory
 * Handles test data for Programs module (all tabs/sections)
 */

import { BaseTestDataFactory, TestDataTracker } from './BaseTestDataFactory';

/* ==================== INTERFACES ==================== */

/**
 * Program Basic Information (Step 1 - Add Program page)
 */
export interface ProgramBasicInfo {
  programCode: string;
  programName: string;
  department?: string;
  division?: string;
  fiscalYear?: string;
  programManager?: string;
  programBudget?: string;
  programStartDate?: string;
  programEndDate?: string;
  description?: string;
}

/** Alias used by page objects (Add Program form = basic info shape). */
export type ProgramData = ProgramBasicInfo;

/**
 * Program Contact Information (Step 2 - Edit Program > Contact tab)
 */
export interface ProgramContact {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactTitle?: string;
  isPrimary?: boolean;
}

/**
 * Program Document (Edit Program > Documents tab)
 */
export interface ProgramDocument {
  documentName: string;
  documentType: string;
  filePath?: string;
  description?: string;
}

/**
 * Program Required Tabs Configuration
 */
export interface ProgramRequiredTabs {
  showBudget?: boolean;
  showDocuments?: boolean;
  showNarrative?: boolean;
  showAttachments?: boolean;
}

/**
 * Complete Program Data (all tabs/sections)
 */
export interface CompleteProgramData {
  basicInfo: ProgramBasicInfo;
  contacts?: ProgramContact[];
  documents?: ProgramDocument[];
  requiredTabs?: ProgramRequiredTabs;
  subPrograms?: string[]; // Sub-program codes
}

/* ==================== PROGRAM FACTORY ==================== */

export class ProgramFactory extends BaseTestDataFactory {
  
  /* ==================== BASIC INFO GENERATORS ==================== */

  /**
   * Generate program code
   */
  static generateProgramCode(prefix: string = 'PROG'): string {
    return this.generateUniqueId(prefix);
  }

  /**
   * Generate program name
   */
  static generateProgramName(baseName: string = 'Test Program'): string {
    const timestamp = this.generateTimestamp();
    return `${baseName} ${timestamp}`;
  }

  /**
   * Generate basic program information (for Add Program page)
   */
  static generateBasicInfo(overrides: Partial<ProgramBasicInfo> = {}): ProgramBasicInfo {
    const programCode = this.generateProgramCode();
    const programName = this.generateProgramName();
    
    const basicInfo: ProgramBasicInfo = {
      programCode,
      programName,
      department: 'Test Department',
      division: 'Test Division',
      fiscalYear: '2026',
      programManager: 'Test Manager',
      programBudget: '100000',
      programStartDate: this.generateFutureDate(7),
      programEndDate: this.generateFutureDate(365),
      description: 'Auto-generated test program',
      ...overrides
    };

    // Track the program
    TestDataTracker.trackProgram(basicInfo.programCode, basicInfo.programName);

    return basicInfo;
  }

  /**
   * Generate minimal program (only required fields)
   */
  static generateMinimalProgram(): ProgramBasicInfo {
    const programCode = this.generateProgramCode();
    const programName = this.generateProgramName();
    
    const basicInfo: ProgramBasicInfo = {
      programCode,
      programName
    };

    TestDataTracker.trackProgram(basicInfo.programCode, basicInfo.programName);
    
    return basicInfo;
  }

  /* ==================== CONTACT INFO GENERATORS ==================== */

  /**
   * Generate program contact
   */
  static generateContact(overrides: Partial<ProgramContact> = {}): ProgramContact {
    const timestamp = this.generateTimestamp();
    
    return {
      contactName: `Contact ${timestamp}`,
      contactEmail: this.generateEmail('contact'),
      contactPhone: this.generatePhoneNumber(),
      contactTitle: 'Program Coordinator',
      isPrimary: true,
      ...overrides
    };
  }

  /**
   * Generate multiple contacts
   */
  static generateContacts(count: number = 2): ProgramContact[] {
    const contacts: ProgramContact[] = [];
    
    for (let i = 0; i < count; i++) {
      contacts.push(this.generateContact({
        isPrimary: i === 0 // First one is primary
      }));
    }
    
    return contacts;
  }

  /* ==================== DOCUMENT GENERATORS ==================== */

  /**
   * Generate program document
   */
  static generateDocument(overrides: Partial<ProgramDocument> = {}): ProgramDocument {
    const timestamp = this.generateTimestamp();
    
    return {
      documentName: `Program Document ${timestamp}.pdf`,
      documentType: 'Guidelines',
      filePath: `./test-files/sample-${timestamp}.pdf`,
      description: 'Auto-generated test document',
      ...overrides
    };
  }

  /**
   * Generate multiple documents
   */
  static generateDocuments(count: number = 2): ProgramDocument[] {
    const documents: ProgramDocument[] = [];
    
    const types = ['Guidelines', 'Application Form', 'Budget Template', 'Instructions'];
    
    for (let i = 0; i < count; i++) {
      documents.push(this.generateDocument({
        documentType: types[i % types.length]
      }));
    }
    
    return documents;
  }

  /* ==================== REQUIRED TABS GENERATORS ==================== */

  /**
   * Generate required tabs configuration
   */
  static generateRequiredTabs(overrides: Partial<ProgramRequiredTabs> = {}): ProgramRequiredTabs {
    return {
      showBudget: true,
      showDocuments: true,
      showNarrative: true,
      showAttachments: true,
      ...overrides
    };
  }

  /* ==================== COMPLETE PROGRAM GENERATORS ==================== */

  /**
   * Generate complete program data (all tabs/sections)
   */
  static generateCompleteProgram(overrides: Partial<CompleteProgramData> = {}): CompleteProgramData {
    return {
      basicInfo: this.generateBasicInfo(overrides.basicInfo),
      contacts: overrides.contacts || this.generateContacts(2),
      documents: overrides.documents || this.generateDocuments(2),
      requiredTabs: overrides.requiredTabs || this.generateRequiredTabs(),
      subPrograms: overrides.subPrograms || []
    };
  }

  /**
   * Generate program with only basic info and 1 contact
   */
  static generateProgramWithMinimalSetup(): CompleteProgramData {
    return {
      basicInfo: this.generateBasicInfo(),
      contacts: [this.generateContact()],
      documents: [],
      requiredTabs: this.generateRequiredTabs()
    };
  }

  /* ==================== SCENARIO-SPECIFIC GENERATORS ==================== */

  /**
   * Generate program for specific fiscal year
   */
  static generateProgramForFiscalYear(year: string): ProgramBasicInfo {
    return this.generateBasicInfo({
      fiscalYear: year,
      programName: `FY${year} Program ${this.generateTimestamp()}`
    });
  }

  /**
   * Generate program with large budget
   */
  static generateLargeBudgetProgram(): ProgramBasicInfo {
    return this.generateBasicInfo({
      programBudget: '10000000', // 10 million
      programName: `Large Budget Program ${this.generateTimestamp()}`
    });
  }

  /**
   * Generate program with past dates (for testing validation)
   */
  static generateProgramWithPastDates(): ProgramBasicInfo {
    return this.generateBasicInfo({
      programStartDate: this.generatePastDate(30),
      programEndDate: this.generatePastDate(1)
    });
  }

  /* ==================== CLEANUP HELPERS ==================== */

  /**
   * Get all created programs
   */
  static getCreatedPrograms() {
    return TestDataTracker.getPrograms();
  }

  /**
   * Clear program tracking
   */
  static clearTracking(): void {
    TestDataTracker.clearPrograms();
  }
}