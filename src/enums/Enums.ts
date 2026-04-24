/**
 * Enums for the test framework
 * Helps avoid typo errors and provides type safety
 */

export enum ExcelOutputType {
  JSON = 'json',
  CSV = 'csv'
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
