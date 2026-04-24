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

export type UserRole = 'Administrator';

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
  URL: string;
  USERNAME: string;
  PASSWORD: string;
  INVALID_USERNAME: string;
  INVALID_PASSWORD: string;
  DEBUG?: string;
  HEADLESS?: string;
}
