import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Meetings - Reschedule Cancelled Meeting', () => {

  test('TC-MTG-001: Reschedule Cancelled Status Meeting', async ({ meetingsPage }) => {

      Logger.testStart('TC-MTG-001: Reschedule Cancelled Status Meeting');

      /* ==================== NAVIGATE TO MEETINGS ==================== */

      await meetingsPage.goto();

      Logger.success('Navigated to Scheduled Meetings page');

      /* ==================== CLICK RESCHEDULE ICON ==================== */

      // ✅ Step 1: Identify first Cancelled status meeting
      // and click Reschedule icon

      await meetingsPage
        .clickRescheduleForFirstCancelledMeeting();

      /* ==================== VALIDATE RESCHEDULE POPUP ==================== */

      // ✅ Step 2: Validate Reschedule Meeting popup

      await meetingsPage
        .validateRescheduleMeetingPopupVisible();

      await Assertions.verifyElementVisible(
        meetingsPage.rescheduleMeetingPopupHeading,
        'Reschedule Meeting Popup Heading'
      );

      /* ==================== SELECT REASON TYPE ==================== */

      // ✅ Step 3: Select Reschedule Reason Type

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

      /* ==================== ENTER RESCHEDULE REASON ==================== */

      // ✅ Step 4: Enter Reschedule Notes

      await meetingsPage.enterRescheduleReason(
        'Automation testing reschedule for cancelled meeting validation.'
      );

      /* ==================== SET RESCHEDULE TIME ==================== */

      // ✅ Step 5: Increase From & To Time by +1 hour

      await meetingsPage.setRescheduleMeetingTime();

      /* ==================== CLICK OK BUTTON ==================== */

      // ✅ Step 6: Click OK button

      await meetingsPage
        .clickCancelOrRescheduleOkButton();

      /* ==================== CLICK PROCEED BUTTON ==================== */

      // ✅ Step 7: Click Proceed button

      await meetingsPage.clickProceedButton();

      /* ==================== VALIDATE RESCHEDULE PAGE ==================== */

      // ✅ Step 8: Validate Reschedule Meeting page

      await meetingsPage.waitForRescheduleMeetingPage();

      await Assertions.verifyElementVisible(
        meetingsPage.rescheduleMeetingHeading,
        'Reschedule Meeting Page Heading'
      );

      Logger.success('Reschedule Meeting page loaded successfully');

      /* ==================== SUBMIT RESCHEDULE MEETING ==================== */

      // ✅ Step 9: Submit Rescheduled Meeting

      await meetingsPage.submitRescheduledMeeting();

      /* ==================== VALIDATE SUCCESS POPUP ==================== */

      // ✅ Step 10: Validate Success Popup

      await meetingsPage
        .validateRescheduleMeetingSuccessPopup();

      await Assertions.verifyElementVisible(
        meetingsPage.getSuccessMessage(),
        'Record Rescheduled Successfully Popup'
      );

      Logger.success('Cancelled meeting rescheduled successfully');

      Logger.testEnd('TC-MTG-001');
    }
  );
});