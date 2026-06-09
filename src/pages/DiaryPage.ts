import { Page } from '@playwright/test';
import { SharedComponents } from '@pages/base/SharedComponents';
import { Logger } from '@utils/logger';

export class DiaryPage extends SharedComponents {

  constructor(page: Page) {
    super(page);
  }

  /* ==================== DIARY LOCATORS ==================== */

  readonly diaryModule = this.page.locator(
    `//span[normalize-space()='Diary']`
  );

  readonly dayTab = this.page.locator(
    `//button[@data-view='day']`
  );

  readonly fullCurrentDate = this.page.locator(
    `//span[@id='calTitle']`
  );

  readonly currentDate = this.page.locator(
    `//div[@class='tv-date-num is-today']`
  );

  readonly weekDayText = this.page.locator(
    `//div[@class='tv-weekday']`
  );

  readonly allMeetingsTitles = this.page.locator(
    '.ev-bar-title'
  );

  readonly allMeetingsTimes = this.page.locator(
    '.ev-bar-time'
  );

  /* ==================== DIARY PAGE METHODS ==================== */

  async openDiaryDayView(): Promise<void> {

    await this.clickElement(
      this.diaryModule,
      'Diary Module'
    );

    await this.waitForLoadingToComplete();

    await this.waitForElement(
      this.dayTab,
      30000
    );

    await this.clickElement(
      this.dayTab,
      'Day Tab'
    );

    await this.waitForLoadingToComplete();

    Logger.success(
      'Diary Day view opened successfully'
    );
  }

  async printDayViewMeetings(): Promise<void> {

    /* ==================== FULL CURRENT DATE ==================== */

    await this.waitForElement(
      this.fullCurrentDate,
      30000
    );

    const fullDateText =
      (await this.fullCurrentDate.textContent())?.trim();

    Logger.info(`Diary Full Current Date: ${fullDateText}`);

    /* ==================== CURRENT DATE ==================== */

    await this.waitForElement(
      this.currentDate,
      30000
    );

    const currentDateText =
      (await this.currentDate.textContent())?.trim();

    /* ==================== WEEK DAY ==================== */

    await this.waitForElement(
      this.weekDayText,
      30000
    );

    const weekDay =
      (await this.weekDayText.textContent())?.trim();

    Logger.info(`Current Day: ${weekDay} ${currentDateText}`);

    /* ==================== WAIT FOR MEETINGS SECTION ==================== */

    await this.page.waitForLoadState('networkidle');

    /* ==================== GET MEETINGS COUNT ==================== */

    const meetingsCount =
      await this.allMeetingsTitles.count();

    Logger.info(`Total Meetings Available: ${meetingsCount}`);

    /* ==================== NO MEETINGS AVAILABLE ==================== */

    if (meetingsCount === 0) {

      Logger.info('No meetings available in Diary Day view');
      return;
    }

    /* ==================== PRINT ALL MEETINGS ==================== */

    for (let index = 0; index < meetingsCount; index++) {

      const meetingTitle =
        (await this.allMeetingsTitles
          .nth(index)
          .textContent())?.trim();

      const meetingTime =
        (await this.allMeetingsTimes
          .nth(index)
          .textContent())?.trim();

      Logger.info(`Meeting ${index + 1}: ${meetingTitle} - ${meetingTime}`);
    }

    Logger.success('All Diary meetings printed successfully');
  }



}