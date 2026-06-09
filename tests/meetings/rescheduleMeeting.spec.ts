import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Meetings - Reschedule Meeting', () => {

  test('TC-MTG-004: Reschedule Scheduled Meeting', async ({ meetingsPage }) => {

    test.setTimeout(120000);

      Logger.testStart('TC-MTG-001: Reschedule Scheduled Meeting');

      /* ==================== NAVIGATE TO MEETINGS ==================== */

      await meetingsPage.goto();

      Logger.success('Navigated to Scheduled Meetings page');

      // ✅ Step 1: Click Cancel/Reschedule icon
      // for first Scheduled meeting

      await meetingsPage
        .clickCancelOrRescheduleForFirstScheduledMeeting();

      // ✅ Step 2: Validate Select Meeting Action popup

      await meetingsPage
        .validateSelectMeetingActionPopupVisible();

      await Assertions.verifyElementVisible(
        meetingsPage.selectMeetingActionPopupHeading,
        'Select Meeting Action Popup Heading'
      );

      // ✅ Step 3: Select Reschedule radio button

      await meetingsPage.selectRescheduleMeetingAction();

      // ✅ Step 4: Select Reschedule Reason Type

      /**
       * Dropdown Index Reference:
       * 0 = Select Reason Type
       * 1 = Scheduling Conflicts
       * 2 = Incomplete preparation
       * 3 = Availability of key participants
       * 4 = Change in priorities
       * 5 = Technical or Logistical Issues
       * 6 = Need for Better Timing/ Proposal a New Time
       * 7 = Health or Personal Reasons
       * 8 = External Factors
       */

      await meetingsPage.selectReasonTypeByIndex(1);

      Logger.success('Selected Reschedule Reason Type');

      // ✅ Step 5: Enter Reschedule Notes

      await meetingsPage.enterRescheduleReason(
        'Automation testing reschedule meeting validation.'
      );

      // ✅ Step 6: Increase From & To time by +1 hour

      await meetingsPage.setRescheduleMeetingTime();

      // ✅ Step 7: Click OK button

      await meetingsPage
        .clickCancelOrRescheduleOkButton();

      // ✅ Step 8: Click Proceed button

      await meetingsPage.clickProceedButton();

      // ✅ Step 9: Validate Reschedule Meeting page

      await meetingsPage.waitForRescheduleMeetingPage();

      await Assertions.verifyElementVisible(
        meetingsPage.rescheduleMeetingHeading,
        'Reschedule Meeting Page Heading'
      );

      Logger.success('Reschedule Meeting page loaded successfully');

      // ✅ Step 10: Submit Rescheduled Meeting

      await meetingsPage.submitRescheduledMeeting();

      // ✅ Step 11: Validate Success Popup

      await meetingsPage
        .validateRescheduleMeetingSuccessPopup();

      await Assertions.verifyElementVisible(
        meetingsPage.getSuccessMessage(),
        'Record Rescheduled Successfully Popup'
      );

      Logger.success('Meeting rescheduled successfully');

      Logger.testEnd('TC-MTG-001');
    }
  );
});