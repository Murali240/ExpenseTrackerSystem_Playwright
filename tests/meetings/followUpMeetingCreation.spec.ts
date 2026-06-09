import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Meetings - Create Follow-up Meeting', () => {

  test(
    'TC-MTG-001: Create Follow-up Meeting For Completed Status Meeting',
    async ({ meetingsPage }) => {

      test.setTimeout(120000);

      Logger.testStart(
        'TC-MTG-001: Create Follow-up Meeting For Completed Status Meeting'
      );

      /* ==================== NAVIGATE TO MEETINGS ==================== */

      await meetingsPage.goto();

      Logger.success(
        'Navigated to Scheduled Meetings page'
      );

      /* ==================== CHECK COMPLETED MEETING AVAILABLE ==================== */

      const isCompletedMeetingAvailable =
        await meetingsPage.isCompletedMeetingAvailable();

      /* ==================== CREATE COMPLETED MEETING IF NOT AVAILABLE ==================== */

      if (!isCompletedMeetingAvailable) {

        Logger.info(
          'No Completed meeting available. Creating one.'
        );

        const unique = Date.now();

        await meetingsPage.createCompletedMeeting({
          title: `Automation Completed Meeting ${unique}`,
          meetingType: 1,
          meetingThrough: 1,
          priority: 1,
          chairpersonIndex: 1,
          participantIndex: 1,
          agenda: 'Automation completed meeting agenda'
        });

        Logger.success(
          'Completed meeting created successfully'
        );

        await meetingsPage.page.reload();

        await meetingsPage.waitForLoadingToComplete();

      } else {

        Logger.success(
          'Completed meeting already available. Using existing meeting.'
        );
      }

      /* ==================== CLICK FOLLOW-UP ICON ==================== */

      await meetingsPage
        .clickCreateFollowUpForFirstCompletedMeeting();

      /* ==================== VALIDATE FOLLOW-UP POPUP ==================== */

      await meetingsPage
        .validateCreateFollowUpPopupVisible();

      await Assertions.verifyElementVisible(
        meetingsPage.createFollowUpPopupHeading,
        'Create Follow-up Meeting Popup Heading'
      );

      /* ==================== SELECT FOLLOW-UP TYPE ==================== */

      await meetingsPage.selectFollowUpReasonByIndex(1);

      Logger.success(
        'Selected Follow-up Type'
      );

      /* ==================== ENTER FOLLOW-UP NOTES ==================== */

      await meetingsPage.enterFollowUpNotes(
        'Automation testing follow-up meeting created for completed status meeting validation.'
      );

      /* ==================== CLICK OK BUTTON ==================== */

      await meetingsPage.clickFollowUpOkButton();

      /* ==================== CLICK PROCEED BUTTON ==================== */

      await meetingsPage.clickProceedButton();

      /* ==================== VALIDATE FOLLOW-UP PAGE ==================== */

      await meetingsPage.waitForCreateFollowUpMeetingPage();

      await Assertions.verifyElementVisible(
        meetingsPage.createFollowUpMeetingPageHeading,
        'Create Follow-up Meeting Page Heading'
      );

      Logger.success(
        'Create Follow-up Meeting page loaded successfully'
      );

      /* ==================== SUBMIT FOLLOW-UP MEETING ==================== */

      await meetingsPage.submitCreateFollowUpMeeting();

      /* ==================== VALIDATE SUCCESS POPUP ==================== */

      await Assertions.verifyElementVisible(
        meetingsPage.getSuccessMessage(),
        'Record Follow-up Done Successfully Popup'
      );

      Logger.success(
        'Follow-up meeting created successfully'
      );

      Logger.testEnd(
        'TC-MTG-001'
      );
    }
  );
});