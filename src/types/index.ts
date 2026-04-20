/**
 * Type definitions for the test framework
 */

export interface UserCredentials {
  username: string;
  password: string;
  email?: string;
}

export interface OrganizationCredentials extends UserCredentials {
  organization: string;
}

export type UserRole = 'Grantor' | 'Grantee' | 'Organization' | 'individual';

export interface TestData {
  username: string;
  password: string;
  email: string;
}

export interface CsvData {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

export interface ExcelData {
  [key: string]: any;
}

export interface PageFixtures {
  staffPage: any;
  orgPage: any;
  individualPage: any;
}

export interface EnvironmentVariables {
  ISSI_GMS_URL: string;
  STAFF_USERNAME: string;
  STAFF_PASSWORD: string;
  ORG_USERNAME: string;
  ORG_PASSWORD: string;
  ORG_NAME: string;
  IND_USERNAME: string;
  IND_PASSWORD: string;
  DEBUG?: string;
  HEADLESS?: string;
}
