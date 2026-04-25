import { test } from '@fixtures/AuthFixtures'
import { Logger } from '@utils/logger';

test.describe('Meetings Module - Navigation', () => {

  test('TC-MEETINGS-001: Navigate to Scheduled Meetings Page', async ({ meetingsPage, dashboardPage }) => {

    Logger.testStart('TC-MEETINGS-001: Navigate to Scheduled Meetings Page');

    // Optional safety check (since fixture already logs in)
    await dashboardPage.verifyDashboardLoaded();

    // Navigate to Meetings → Scheduled Meetings
    await meetingsPage.navigateToScheduledMeetings();

    // Verify Scheduled Meetings Page
    await meetingsPage.verifyScheduledMeetingsPage();

    Logger.success('Navigation to Scheduled Meetings page successful');
    Logger.testEnd('TC-MEETINGS-001');
  });

});