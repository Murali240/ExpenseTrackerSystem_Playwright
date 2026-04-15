/**
 * Enums for the test framework
 * Helps avoid typo errors and provides type safety
 */

export enum ExcelOutputType {
  JSON = 'json',
  CSV = 'csv'
}

export enum LoginPortalHeaders {
  STAFF_LOGIN_PORTAL_TITLE = 'Staff Login',
  ORGANIZATION_LOGIN_PORTAL_TITLE = 'Organization Portal Sign In',
  INDIVIDUAL_LOGIN_PORTAL_TITLE = 'Individual Portal Sign In'
}

export enum MainMenu {
  DASHBOARD = 'Dashboard',
  DIARY = 'Diary',
  PROGRAMS = 'Programs',
  GRANTS_MANAGEMENT = 'Grants Management',
  FINANCIAL_MANAGEMENT = 'Financial Management'
}

export enum SubMenu {
  GRANTS = 'Grants',
  APPLICATIONS = 'Applications',
  AWARDS = 'Awards',
  SUB_AWARDS = 'Sub Awards',
  MASTER_FUNDING_SOURCES = 'Master Funding Sources'
}

export enum DashboardHeaders {
  STAFF_GRANTOR_DASHBOARD_HEADER = 'Staff User - Grantor Portal',
  STAFF_GRANTEE_DASHBOARD_HEADER = 'Staff User - Grantee Portal',
  ORGANIZATION_DASHBOARD_HEADER= 'Organization User - Applicant Portal',
  INDIVIDUAL_DASHBOARD_HEADER = 'Individual User - Applicant Portal'
}

export enum PageHeaders {
  DASHBOARD = 'Dashboard',
  PROGRAMS = 'Programs',
  GRANTS = 'Grants',
  APPLICATIONS = 'Applications',
  AWARDS = 'Awards',
  SUB_AWARDS = 'Sub Awards',
  MASTER_FUNDING_SOURCES = 'Master Funding Sources'
}

export enum AddNewLinkText {
  PROGRAM = 'Add New Program',
  GRANT = 'Add New Grant',
  APPLICATION = 'Add New Application',
  AWARD = 'Add New Award',
  SUB_AWARD = 'Add New Sub Award',
  MASTER_FUNDING_SOURCE = 'Add New Master Funding Source'
}

export enum UserType {
  STAFF = 'staff',
  ORGANIZATION = 'Organization',
  INDIVIDUAL = 'individual'
}

export enum BrowserType {
  CHROMIUM = 'chromium',
  FIREFOX = 'firefox',
  WEBKIT = 'webkit'
}

export enum TestEnvironment {
  DEV = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}
