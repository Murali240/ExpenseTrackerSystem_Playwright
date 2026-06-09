import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Meetings - Update', () => {

  test('TC-MTG-001: Update Scheduled Meeting Title', async ({ meetingsPage }) => {

    Logger.testStart('TC-MTG-001: Update Scheduled Meeting Title');

    const unique = Date.now();

    await meetingsPage.goto();

    // ✅ Step 1: Click Edit for Scheduled Meeting
    await meetingsPage.clickEditForFirstScheduledMeeting();

    // ✅ Step 2: Update Meeting Title
    const updatedTitle = `Updated Meeting ${unique}`;

    await meetingsPage.updateMeetingTitle(updatedTitle);

    // ✅ Step 3: Validate Success Popup
    await Assertions.verifyElementVisible(
      meetingsPage.getSuccessMessage(),
      'Record Updated Successfully Popup'
    );

    Logger.success('✅ Meeting updated successfully');
    Logger.testEnd('TC-MTG-001');

  });

});