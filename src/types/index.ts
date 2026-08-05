/**
 * ============================================================================
 * Type Definitions
 * ============================================================================
 */

/* ==================== USER ROLES ==================== */

export type UserRole =
    | 'Administrator'
    | 'Employee'
    | 'Manager'
    | 'Accountant'
    | 'LDAP';

/* ==================== USER CREDENTIALS ==================== */

export interface UserCredentials {
    username: string;
    password: string;
    email?: string;
}

export interface OrganizationCredentials extends UserCredentials {
    organization: string;
}

/* ==================== TEST DATA ==================== */

export interface TestData {
    username: string;
    password: string;
    email: string;
}

/* ==================== CSV DATA ==================== */

export interface CsvData {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}

/* ==================== EXCEL DATA ==================== */

export interface ExcelData {
    [key: string]: any;
}

/* ==================== PAGE FIXTURES ==================== */

export interface PageFixtures {
    staffPage: any;
    orgPage: any;
    individualPage: any;
}

/* ==================== ENVIRONMENT VARIABLES ==================== */

export interface EnvironmentVariables {

    URL: string;

    /* Administrator */

    USERNAME: string;
    PASSWORD: string;

    /* Employee */

    EMPLOYEE_USERNAME: string;
    EMPLOYEE_PASSWORD: string;

    /* Manager */

    MANAGER_USERNAME: string;
    MANAGER_PASSWORD: string;

    /* Accountant */

    ACCOUNTANT_USERNAME: string;
    ACCOUNTANT_PASSWORD: string;

    /* Invalid Credentials */

    INVALID_USERNAME: string;
    INVALID_PASSWORD: string;

    /* Optional */

    DEBUG?: string;
    HEADLESS?: string;
}

/* ==================== EMPLOYEE EXPENSE DATA ==================== */

export interface EmployeeExpenseData {
    title: string;
    fromDate: string; // ISO date
    toDate: string; // ISO date
    expenseDate: string; // ISO date
    merchantName: string;
    expenseAmount: string; // use string to keep formatting consistent with UI
    expenseDescription: string;
    documentName: string;
    receiptFilePath?: string;
    paymentMethod?: string;
}