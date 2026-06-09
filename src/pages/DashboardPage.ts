import { Locator, Page } from '@playwright/test';
import { SharedComponents } from '@pages/base/SharedComponents';
import { Logger } from '@utils/logger';

export class DashboardPage extends SharedComponents {

  readonly dashboardHeader: Locator;
  readonly scheduleNewMeetingLink: Locator;
  readonly backToDashboardLink: Locator;
  readonly scheduleMeetingHeading: Locator;

  constructor(page: Page) {
    super(page);

    this.dashboardHeader = this.page.locator(`//span[normalize-space()='Dashboard']`);

    this.scheduleNewMeetingLink = this.page.locator(
      `a[href="/schedulemeeting/?from=dashboard"]`
    );

    this.backToDashboardLink = this.page.getByRole('link', {
      name: 'Back to Dashboard'
    });

    this.scheduleMeetingHeading = this.page.getByRole('heading', {
      name: 'Schedule Meeting'
    });
  }

  /* ==================== ACTIONS ==================== */

  async clickScheduleNewMeeting(): Promise<void> {
    Logger.info('Clicking Schedule New Meeting link');
    await this.clickElement(this.scheduleNewMeetingLink, 'Schedule New Meeting link');
    await this.waitForPageLoad();
  }

  /* ==================== VERIFICATIONS ==================== */

  async verifyDashboardLoaded(): Promise<void> {
    Logger.info('Verifying Dashboard loaded');
    await this.verifyElementVisible(this.dashboardHeader, 'Dashboard header');
  }

  async verifyScheduleMeetingPage(): Promise<void> {

  Logger.info('Waiting for Schedule Meeting page to load');

  // Wait for page load/navigation
  await this.page.waitForLoadState('networkidle');

  // Wait until Schedule Meeting heading becomes visible
  await this.waitForElement(
    this.scheduleMeetingHeading,
    30000
  );

  Logger.info('Verifying Schedule Meeting page');

  await this.verifyElementVisible(
    this.scheduleMeetingHeading,
    'Schedule Meeting Heading'
  );

  await this.verifyElementVisible(
    this.backToDashboardLink,
    'Back to Dashboard Link'
  );

  Logger.success(
    'Schedule Meeting page loaded successfully'
  );
 }


}