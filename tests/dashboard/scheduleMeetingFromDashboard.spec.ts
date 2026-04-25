import { test } from '@fixtures/AuthFixtures';
import { Logger } from '@utils/logger';

test.describe('Dashboard Module - Schedule Meeting Navigation', () => {

  test('TC-DASHBOARD-SM-001: Navigate to Schedule Meeting from Dashboard', async ({ dashboardPage }) => {

    Logger.testStart('TC-DASHBOARD-SM-001: Dashboard → Schedule Meeting Navigation');

    // Verify Dashboard after login (from fixture)
    await dashboardPage.verifyDashboardLoaded();

    // Click Schedule New Meeting
    await dashboardPage.clickScheduleNewMeeting();

    // Verify Schedule Meeting page
    await dashboardPage.verifyScheduleMeetingPage();

    Logger.success('Navigation to Schedule Meeting page from Dashboard is successful');
    Logger.testEnd('TC-DASHBOARD-SM-001');
  });

});