import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Meetings - Cancel Meeting', () => {

  test('TC-MTG-001: Cancel Scheduled Meeting', async ({ meetingsPage }) => {

      Logger.testStart('TC-MTG-001: Cancel Scheduled Meeting');

      /* ==================== NAVIGATE TO MEETINGS ==================== */

      await meetingsPage.goto();

      Logger.success('Navigated to Scheduled Meetings page');

      /* ==================== CHECK SCHEDULED MEETING AVAILABLE ==================== */

      const isScheduledMeetingAvailable =
        await meetingsPage
          .isScheduledMeetingAvailable();

      /* ==================== CREATE NEW MEETING IF NO SCHEDULED MEETING ==================== */

      if (!isScheduledMeetingAvailable) {

        Logger.info('No Scheduled meeting available. Creating new meeting');

        const unique = Date.now();

        await meetingsPage.createMeeting({
          title: `Automation Cancel Meeting ${unique}`,
          meetingType: 1,
          meetingThrough: 1,
          priority: 1,
          chairpersonIndex: 1,
          participantIndex: 1,
          agenda:
            'Automation testing cancel meeting agenda'
        });

        Logger.success('New Scheduled meeting created successfully');

        await meetingsPage.waitForLoadingToComplete();

      } else {

        Logger.success('Scheduled meeting already available. Using existing meeting');
      }

      /* ==================== CLICK CANCEL / RESCHEDULE ICON ==================== */

      await meetingsPage
        .clickCancelOrRescheduleForFirstScheduledMeeting();

      /* ==================== VALIDATE SELECT ACTION POPUP ==================== */

      await meetingsPage
        .validateSelectMeetingActionPopupVisible();

      await Assertions.verifyElementVisible(
        meetingsPage.selectMeetingActionPopupHeading,
        'Select Meeting Action Popup Heading'
      );

      /* ==================== SELECT REASON TYPE ==================== */

      await meetingsPage.selectReasonTypeByIndex(1);

      Logger.success('Selected Reason Type');

      /* ==================== ENTER CANCEL REASON ==================== */

      await meetingsPage.enterCancelReason(
        'Automation testing scheduled meeting cancellation validation.'
      );

      /* ==================== CLICK OK BUTTON ==================== */

      await meetingsPage
        .clickCancelOrRescheduleOkButton();

      /* ==================== VALIDATE SUCCESS POPUP ==================== */

      await meetingsPage
        .validateMeetingCancelledSuccessPopup();

      await Assertions.verifyElementVisible(
        meetingsPage.getSuccessMessage(),
        'Meeting Cancelled Success Popup'
      );

      Logger.success('Meeting cancelled successfully');

      Logger.testEnd('TC-MTG-001');
    }
  );
});
