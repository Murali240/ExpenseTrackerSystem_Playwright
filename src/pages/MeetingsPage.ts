import { SharedComponents } from "@pages/base/SharedComponents";
import { Locator, Page } from "@playwright/test";
import { Logger } from "@utils/logger";

export class MeetingsPage extends SharedComponents {

  readonly meetingsModuleDropdown: Locator;
  readonly scheduledMeetingsSubMenuLink: Locator;
  readonly scheduleMeetingsHeading: Locator;

  constructor(page: Page) {
    super(page);

    this.meetingsModuleDropdown = this.page.locator(`//span[normalize-space()='Meetings']`);

    this.scheduledMeetingsSubMenuLink = this.page.locator(
      `a[href="/meetingminutes"]`
    );

    this.scheduleMeetingsHeading = this.page.locator(
      `button:has-text("Schedule Meetings")`
    );
  }

  /* ==================== Navigation ==================== */

  async navigateToScheduledMeetings(): Promise<void> {
    Logger.info('Navigating to Meetings → Scheduled Meetings');

    await this.clickElement(this.meetingsModuleDropdown, 'Meetings module dropdown');

    await this.clickElement(
      this.scheduledMeetingsSubMenuLink,
      'Scheduled Meetings submenu'
    );

    Logger.success('Navigated to Scheduled Meetings page');
  }

  /* ==================== Verification ==================== */

  async verifyScheduledMeetingsPage(): Promise<void> {
    Logger.info('Verifying Scheduled Meetings page');

    await this.verifyElementVisible(
      this.scheduleMeetingsHeading,
      'Schedule Meetings heading',
      30000
    );

    Logger.success('Scheduled Meetings page verified');
  }
}