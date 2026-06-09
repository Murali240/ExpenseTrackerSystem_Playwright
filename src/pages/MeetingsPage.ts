import { Page, Locator } from '@playwright/test';
import { SharedComponents } from '@pages/base/SharedComponents';
import { Logger } from '@utils/logger';

export type MeetingCreateOptions = {
  title: string;
  meetingType: string | number;
  meetingThrough: string | number;
  priority: string | number;
  chairpersonIndex: number;
  participantIndex: number;
  agenda: string;
};

export class MeetingsPage extends SharedComponents {

  constructor(page: Page) {
    super(page);
  }

  /* ==================== EXISTING LOCATORS (UNCHANGED) ==================== */

  readonly meetingsMenu = this.page.locator(`//span[normalize-space()='Meetings']`);
  readonly scheduledMeetingsSubMenu = this.page.locator(`//span[normalize-space()='Scheduled Meetings']`);

  readonly scheduleNewMeetingButton = this.page.locator(`a[href="/meetingminutes/Addminutes"]`);
  readonly scheduleMeetingHeading = this.page.getByRole('heading', { name: 'Schedule Meeting' });

  readonly meetingTitleInput = this.page.getByRole('textbox', { name: 'Title/Subject *' });

  readonly fromTimeInput = this.page.locator(`#meetingStartTime`);
  readonly toTimeInput = this.page.locator(`#meetingEndTime`);

  readonly timeUpArrows = this.page.locator('.arrowUp');

  readonly meetingTypeDropdown = this.page.locator(`#id_Meeting_Type`);
  readonly meetingThroughDropdown = this.page.locator(`#id_Meeting_through`);
  readonly priorityDropdown = this.page.locator(`#id_Priority`);

  readonly chairpersonDropdown = this.page.locator(`//a[@class='chosen-single']`);
  readonly chairpersonOptions = this.page.locator(`.chosen-results li`);

  readonly inPersonDropdown = this.page.locator(`//div[16]/div/button`);
  readonly inPersonOptions = this.page.locator(`//div[16]//input[@type='checkbox']`);

  readonly agendaTab = this.page.locator(`#agendaAccordionButton`);
  readonly agendaInput = this.page.locator(`#agendaItem_1`);

  readonly submitButton = this.page.locator(`#submitMeetingMinutes`);

  readonly successPopup = this.page.locator(`//div[contains(@class,'swal2-popup')]`);

  readonly chairpersonBusyValidation = this.page.locator(
    `//*[contains(text(),'The selected chairperson already has a meeting scheduled')]`
  );

  /* ==================== NEW LOCATORS (UPDATE FLOW) ==================== */

  readonly meetingRows = this.page.locator('table tbody tr');

  readonly editScheduledMeetingHeading = this.page
    .getByRole('heading')
    .filter({ hasText: 'Edit Scheduled Meeting' });

  readonly meetingTitleInputBox = this.page.locator('[name="mm_subject"]');

  /* ==================== CREATE FOLLOW-UP MEETING LOCATORS ==================== */

  readonly createFollowUpPopupHeading = this.page.locator(
    `//h5[normalize-space()='Create Follow-up Meeting']`
  );

  readonly followUpTypeDropdown = this.page.locator(
    `//select[@id='followup_type']`
  );

  readonly followUpNotesTextArea = this.page.locator(
    `//textarea[@id='followupReasonText']`
  );

  readonly followUpOkButton = this.page.locator(
    `//button[@id='actionConfirm']`
  );

  readonly proceedButton = this.page.locator(
    '.swal2-confirm.btn.btn-success.mx-2'
  );

  readonly createFollowUpMeetingPageHeading = this.page.locator(
    `//h1[normalize-space()='Create Follow-up Meeting']`
  );

  /* ==================== CANCEL / RESCHEDULE MEETING LOCATORS ==================== */

  readonly selectMeetingActionPopupHeading = this.page.locator(
    `//h5[normalize-space()='Select Meeting Action']`
  );

  //readonly cancelRadioButton = this.page.getByLabel('Cancel');

  readonly rescheduleRadioButton = this.page.getByLabel('Re-schedule');

  readonly reasonTypeDropdown = this.page.locator(
    `//select[@id='shared_reason_type']`
  );

  readonly cancelReasonTextAreaBox = this.page.locator(
    `//textarea[@id='cancelReasonText']`
  );

  readonly cancelOrRescheduleOkButton = this.page.locator(
    `//button[@id='actionConfirm']`
  );

  /* ==================== RESCHEDULE MEETING LOCATORS ==================== */

  readonly rescheduleReasonTextAreaBox = this.page.locator(
    `//textarea[@id='rescheduleReasonText']`
  );

  readonly rescheduleFromTime = this.page.locator(
    `//input[@id='reschedule_from_time']`
  );

  readonly rescheduleToTime = this.page.locator(
    `//input[@id='reschedule_to_time']`
  );

  readonly upArrowIcons = this.page.locator('.arrowUp');

  readonly rescheduleMeetingHeading = this.page.locator(
    `//h1[normalize-space()='Reschedule Meeting']`
  );

  /* ==================== RESCHEDULE CANCELLED MEETING LOCATORS ==================== */

  readonly rescheduleMeetingPopupHeading = this.page.locator(
  `//h5[normalize-space()='Reschedule Meeting']`
  );

  /* ==================== NAVIGATION ==================== */

  async goto(): Promise<void> {

    await this.clickElement(this.meetingsMenu, 'Meetings Menu');

    await this.clickElement(
      this.scheduledMeetingsSubMenu,
      'Scheduled Meetings'
    );

    await this.waitForPageLoad();
    await this.waitForLoadingToComplete();
  }

  /* ==================== TIME HANDLING ==================== */

  async setFutureTime(): Promise<void> {

    await this.clickElement(this.fromTimeInput, 'From Time');

    await this.timeUpArrows.nth(1).click();

    Logger.info('From Time increased by +1 hour');

    await this.clickElement(this.toTimeInput, 'To Time');

    await this.timeUpArrows.nth(3).click();

    Logger.info('To Time increased by +1 hour');
  }

  /* ==================== CREATE MEETING ==================== */

  async createMeeting(
    options: MeetingCreateOptions,
    expectSuccess: boolean = true
  ): Promise<void> {

    await this.clickElement(
      this.scheduleNewMeetingButton,
      'Schedule New Meeting'
    );

    await this.waitForElement(this.scheduleMeetingHeading);

    await this.fillInput(
      this.meetingTitleInput,
      options.title,
      'Meeting Title'
    );

    await this.setFutureTime();

    await this.selectDropdownOption(
      this.meetingTypeDropdown,
      options.meetingType,
      'Meeting Type'
    );

    await this.selectDropdownOption(
      this.meetingThroughDropdown,
      options.meetingThrough,
      'Meeting Through'
    );

    await this.selectDropdownOption(
      this.priorityDropdown,
      options.priority,
      'Priority'
    );

    await this.clickElement(
      this.chairpersonDropdown,
      'Chairperson'
    );

    await this.chairpersonOptions
      .nth(options.chairpersonIndex)
      .click();

    await this.clickElement(
      this.inPersonDropdown,
      'Participants'
    );

    await this.inPersonOptions
      .nth(options.participantIndex)
      .check();

    await this.agendaTab.scrollIntoViewIfNeeded();

    await this.clickElement(this.agendaTab, 'Agenda Tab');

    await this.waitForElement(this.agendaInput);

    await this.fillInput(
      this.agendaInput,
      options.agenda,
      'Agenda'
    );

    await this.submitButton.scrollIntoViewIfNeeded();

    await this.waitForElement(this.submitButton);

    await this.clickElement(this.submitButton, 'Submit');

    if (expectSuccess) {

      await this.waitForElement(this.successPopup, 30000);

      Logger.success('Meeting created successfully');
    } else {

      Logger.info(
        'Skipping success validation (negative scenario)'
      );
    }
  }

  /* ==================== UPDATE FLOW ==================== */

  private getStatusInRow(row: Locator): Locator {
    return row.locator('.badge.rounded-pill');
  }

  private getEditIconInRow(row: Locator): Locator {
    return row.locator('.fa-pen-to-square');
  }

  async updateMeetingTitle(newTitle: string): Promise<void> {

    await this.waitForElement(
      this.editScheduledMeetingHeading,
      30000
    );

    Logger.info('Edit Scheduled Meeting page opened');

    await this.meetingTitleInputBox.click();

    await this.meetingTitleInputBox.fill('');

    await this.meetingTitleInputBox.type(newTitle);

    Logger.info(`Updated meeting title: ${newTitle}`);

    await this.submitButton.scrollIntoViewIfNeeded();

    await this.waitForElement(this.submitButton);

    await this.clickElement(
      this.submitButton,
      'Submit Updated Meeting'
    );
  }

  async clickEditForFirstScheduledMeeting(): Promise<void> {

    const row = this.page.locator('tbody tr', {
      has: this.page.locator('.badge:has-text("Scheduled")')
    }).first();

    await this.waitForElement(row, 30000);

    const editIcon = row.locator('.fa-pen-to-square');

    await this.waitForElement(editIcon);

    await editIcon.click();

    Logger.success(
      'Clicked Edit icon for Scheduled meeting'
    );
  }

  /* ==================== CREATE FOLLOW-UP MEETING ==================== */

  async clickCreateFollowUpForFirstCompletedMeeting(): Promise<void> {

    const completedMeetingRow = this.page.locator('tbody tr', {
      has: this.page.locator('.badge.rounded-pill.bg-success')
    }).first();

    await this.waitForElement(
      completedMeetingRow,
      30000
    );

    Logger.success(
      'First completed status meeting found'
    );

    const followUpIcon = completedMeetingRow.locator(
      '.bi.bi-arrow-repeat.text-success.fa-lg'
    );

    await this.waitForElement(
      followUpIcon,
      30000
    );

    await followUpIcon.scrollIntoViewIfNeeded();

    await followUpIcon.click();

    Logger.success(
      'Clicked Create Follow-up Meeting icon'
    );
  }

  async validateCreateFollowUpPopupVisible(): Promise<void> {

    await this.waitForElement(
      this.createFollowUpPopupHeading,
      30000
    );

    Logger.success(
      'Create Follow-up Meeting popup displayed'
    );
  }

  async selectFollowUpReasonByIndex(
    index: number
  ): Promise<void> {

    await this.waitForElement(
      this.followUpTypeDropdown,
      30000
    );

    await this.followUpTypeDropdown.selectOption({
      index
    });

    Logger.info(
      `Selected follow-up reason index: ${index}`
    );
  }

  async enterFollowUpNotes(notes: string): Promise<void> {

    await this.waitForElement(
      this.followUpNotesTextArea,
      30000
    );

    await this.followUpNotesTextArea.fill(notes);

    Logger.info('Entered follow-up meeting notes');
  }

  async clickFollowUpOkButton(): Promise<void> {

    await this.waitForElement(
      this.followUpOkButton,
      30000
    );

    await this.followUpOkButton.click();

    Logger.success('Clicked Follow-up OK button');
  }

  async clickProceedButton(): Promise<void> {

    await this.waitForElement(
      this.proceedButton,
      30000
    );

    await this.proceedButton.click();

    Logger.success('Clicked Proceed button');
  }

  async waitForCreateFollowUpMeetingPage(): Promise<void> {

    await this.waitForElement(
      this.createFollowUpMeetingPageHeading,
      60000
    );

    await this.waitForLoadingToComplete();

    Logger.success(
      'Create Follow-up Meeting page displayed'
    );
  }

  async submitCreateFollowUpMeeting(): Promise<void> {

    await this.submitButton.scrollIntoViewIfNeeded();

    await this.waitForElement(
      this.submitButton,
      30000
    );

    await this.submitButton.click();

    Logger.success('Clicked Submit button');
  }

  /* ==================== CANCEL / RESCHEDULE MEETING METHODS ==================== */

async clickCancelOrRescheduleForFirstScheduledMeeting(): Promise<void> {

  const scheduledMeetingRow = this.page.locator('tbody tr', {
    has: this.page.locator('.badge:has-text("Scheduled")')
  }).first();

  await this.waitForElement(
    scheduledMeetingRow,
    30000
  );

  Logger.success(
    'First Scheduled status meeting found'
  );

  const cancelOrRescheduleIcon = scheduledMeetingRow.locator(
    '.bi.bi-arrow-repeat.text-danger.fa-lg'
  );

  await this.waitForElement(
    cancelOrRescheduleIcon,
    30000
  );

  await cancelOrRescheduleIcon.scrollIntoViewIfNeeded();

  await cancelOrRescheduleIcon.click();

  Logger.success(
    'Clicked Cancel/Reschedule icon'
  );
}

async validateSelectMeetingActionPopupVisible(): Promise<void> {

  await this.waitForElement(
    this.selectMeetingActionPopupHeading,
    30000
  );

  Logger.success(
    'Select Meeting Action popup displayed'
  );
}

async selectRescheduleRadioButton(): Promise<void> {

  await this.waitForElement(
    this.rescheduleRadioButton,
    30000
  );

  await this.rescheduleRadioButton.check();

  Logger.success(
    'Selected Reschedule radio button'
  );
}

async selectReasonTypeByIndex(
  index: number
): Promise<void> {

  await this.waitForElement(
    this.reasonTypeDropdown,
    30000
  );

  await this.reasonTypeDropdown.selectOption({
    index
  });

  Logger.info(
    `Selected reason type index: ${index}`
  );
}

async enterCancelReason(
  reason: string
): Promise<void> {

  await this.waitForElement(
    this.cancelReasonTextAreaBox,
    30000
  );

  await this.cancelReasonTextAreaBox.fill(reason);

  Logger.info('Entered cancel reason');
}

async clickCancelOrRescheduleOkButton(): Promise<void> {

  await this.waitForElement(
    this.cancelOrRescheduleOkButton,
    30000
  );

  // ✅ Important for Reschedule popup
  await this.cancelOrRescheduleOkButton
    .scrollIntoViewIfNeeded();

  // ✅ Wait until clickable
  await this.cancelOrRescheduleOkButton.waitFor({
    state: 'visible',
    timeout: 30000
  });

  // ✅ Small stabilization wait
  await this.wait(500);

  await this.cancelOrRescheduleOkButton.click();

  Logger.success(
    'Clicked Cancel/Reschedule OK button'
  );

  // ✅ Wait for popup to close
  await this.selectMeetingActionPopupHeading
    .waitFor({
      state: 'hidden',
      timeout: 30000
    });

  Logger.success(
    'Select Meeting Action popup closed'
  );
}

async validateMeetingCancelledSuccessPopup(): Promise<void> {

  await this.waitForElement(
    this.successPopup,
    60000
  );

  Logger.success(
    'Meeting cancelled success popup displayed'
  );
}

/* ==================== RESCHEDULE MEETING METHODS ==================== */

async selectRescheduleMeetingAction(): Promise<void> {

  await this.selectRescheduleRadioButton();

  Logger.success(
    'Selected Reschedule meeting action'
  );
}

async enterRescheduleReason(
  reason: string
): Promise<void> {

  await this.waitForElement(
    this.rescheduleReasonTextAreaBox,
    30000
  );

  await this.rescheduleReasonTextAreaBox.fill(reason);

  Logger.info('Entered reschedule reason');
}

async setRescheduleMeetingTime(): Promise<void> {

  /* ==================== FROM TIME +2 HOURS ==================== */

  await this.waitForElement(
    this.rescheduleFromTime,
    30000
  );

  await this.rescheduleFromTime.click();

  // ✅ +1 Hour
  await this.upArrowIcons.nth(2).click();

  // ✅ +2 Hour
  await this.upArrowIcons.nth(2).click();

  Logger.success(
    'Reschedule From Time increased by +2 hours'
  );

  /* ==================== TO TIME +2 HOURS ==================== */

  await this.waitForElement(
    this.rescheduleToTime,
    30000
  );

  await this.rescheduleToTime.click();

  // ✅ +1 Hour
  await this.upArrowIcons.nth(4).click();

  // ✅ +2 Hour
  await this.upArrowIcons.nth(4).click();

  Logger.success(
    'Reschedule To Time increased by +2 hours'
  );
}

async waitForRescheduleMeetingPage(): Promise<void> {

  await this.waitForElement(
    this.rescheduleMeetingHeading,
    60000
  );

  await this.waitForLoadingToComplete();

  Logger.success(
    'Reschedule Meeting page displayed'
  );
}

async submitRescheduledMeeting(): Promise<void> {

  await this.submitButton.scrollIntoViewIfNeeded();

  await this.waitForElement(
    this.submitButton,
    30000
  );

  await this.submitButton.click();

  Logger.success(
    'Clicked Reschedule Meeting Submit button'
  );
}

async validateRescheduleMeetingSuccessPopup(): Promise<void> {

  await this.waitForElement(
    this.successPopup,
    60000
  );

  Logger.success(
    'Record Rescheduled Successfully popup displayed'
  );
}

/* ==================== RESCHEDULE CANCELLED MEETING METHODS ==================== */

async clickRescheduleForFirstCancelledMeeting(): Promise<void> {

  const cancelledMeetingRow = this.page.locator('tbody tr', {
    has: this.page.locator('.badge.rounded-pill.bg-dark')
  }).first();

  await this.waitForElement(
    cancelledMeetingRow,
    30000
  );

  Logger.success(
    'First Cancelled status meeting found'
  );

  const rescheduleMeetingIcon = cancelledMeetingRow.locator(
    '.bi.bi-arrow-repeat.text-info.fa-lg'
  );

  await this.waitForElement(
    rescheduleMeetingIcon,
    30000
  );

  await rescheduleMeetingIcon.scrollIntoViewIfNeeded();

  await rescheduleMeetingIcon.click();

  Logger.success(
    'Clicked Reschedule icon for Cancelled meeting'
  );
}

async validateRescheduleMeetingPopupVisible(): Promise<void> {

  await this.waitForElement(
    this.rescheduleMeetingPopupHeading,
    30000
  );

  Logger.success(
    'Reschedule Meeting popup displayed'
  );
}

/* ==================== CHECK SCHEDULED MEETING ==================== */

async isScheduledMeetingAvailable(): Promise<boolean> {

  // ✅ Wait for page/API/grid loading complete
  await this.waitForLoadingToComplete();

  // ✅ Wait until Meeting List table rows appear
  await this.page.locator('tbody tr')
    .first()
    .waitFor({
      state: 'visible',
      timeout: 15000
    });

  // ✅ Scheduled status badges
  const scheduledMeetingBadges = this.page.locator(
    '.badge.rounded-pill.bg-info.text-white'
  );

  // ✅ Dynamic count check
  const scheduledMeetingCount =
    await scheduledMeetingBadges.count();

  Logger.info(
    `Scheduled Meetings Count: ${scheduledMeetingCount}`
  );

  return scheduledMeetingCount > 0;
}

// Check Completed Meeting Available
async isCompletedMeetingAvailable(): Promise<boolean> {

  await this.waitForLoadingToComplete();

  const tableRows = this.page.locator(
    'table tbody tr'
  );

  await tableRows.first().waitFor({
    state: 'visible',
    timeout: 10000
  });

  const completedMeetingBadges = this.page.locator(
    '.badge.rounded-pill.bg-success'
  );

  const completedMeetingCount =
    await completedMeetingBadges.count();

  Logger.info(
    `Completed Meetings Count: ${completedMeetingCount}`
  );

  return completedMeetingCount > 0;
}

// Create Meeting With Past Time
async setPastTime(): Promise<void> {

  /* ==================== FROM TIME ==================== */

  await this.clickElement(
    this.fromTimeInput,
    'From Time'
  );

  // 2nd arrow = From Hour Down Arrow
  await this.page.locator('.arrowDown')
    .nth(1)
    .click();

  Logger.info(
    'From Time decreased by 1 hour'
  );

  /* ==================== TO TIME ==================== */

  await this.clickElement(
    this.toTimeInput,
    'To Time'
  );

  // 4th arrow = To Hour Down Arrow
  await this.page.locator('.arrowDown')
    .nth(3)
    .click();

  Logger.info(
    'To Time decreased by 1 hour'
  );
}

// Create Completed Meeting
async createCompletedMeeting(
  options: MeetingCreateOptions
): Promise<void> {

  await this.clickElement(
    this.scheduleNewMeetingButton,
    'Schedule New Meeting'
  );

  await this.waitForElement(
    this.scheduleMeetingHeading
  );

  await this.fillInput(
    this.meetingTitleInput,
    options.title,
    'Meeting Title'
  );

  await this.setPastTime();

  await this.selectDropdownOption(
    this.meetingTypeDropdown,
    options.meetingType,
    'Meeting Type'
  );

  await this.selectDropdownOption(
    this.meetingThroughDropdown,
    options.meetingThrough,
    'Meeting Through'
  );

  await this.selectDropdownOption(
    this.priorityDropdown,
    options.priority,
    'Priority'
  );

  await this.clickElement(
    this.chairpersonDropdown,
    'Chairperson'
  );

  await this.chairpersonOptions
    .nth(options.chairpersonIndex)
    .click();

  await this.clickElement(
    this.inPersonDropdown,
    'Participants'
  );

  await this.inPersonOptions
    .nth(options.participantIndex)
    .check();

  await this.clickElement(
    this.agendaTab,
    'Agenda Tab'
  );

  await this.fillInput(
    this.agendaInput,
    options.agenda,
    'Agenda'
  );

  await this.clickElement(
    this.submitButton,
    'Submit'
  );

  await this.waitForElement(
    this.successPopup,
    30000
  );

  Logger.success(
    'Completed meeting created successfully'
  );
}

  /* ==================== VALIDATION ==================== */

  getSuccessMessage(): Locator {
    return this.successPopup;
  }

  getChairpersonBusyMessage(): Locator {
    return this.chairpersonBusyValidation;
  }
}