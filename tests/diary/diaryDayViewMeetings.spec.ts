import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Diary Module - Day View Meetings', () => {

  test('TC-DIARY-001: Validate Day View Meetings', async ({ diaryPage }) => {

      Logger.testStart('TC-DIARY-001: Validate Day View Meetings');

      /* ==================== OPEN DIARY DAY VIEW ==================== */

      await diaryPage.openDiaryDayView();

      /* ==================== PRINT ALL MEETINGS ==================== */

      await diaryPage.printDayViewMeetings();

      Logger.testEnd('TC-DIARY-001');
    }
  );
});