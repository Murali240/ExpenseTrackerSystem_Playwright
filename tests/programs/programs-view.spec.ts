import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { PageHeaders, AddNewLinkText } from '@enums/Enums';
import { ProgramsPage } from '@pages/programs/ProgramsPage';

/**
 * Programs List Page Tests
 * Tests for viewing, searching, filtering programs
 */

test.describe('Programs View Page @programs @list', () => {

  /* ==================== VIEW/NAVIGATION TESTS ==================== */

  test('TC-PP-001: View Programs Page @smoke @regression', async ({ programsPage }) => {
    Logger.testStart('TC-PP-001: View Programs Page');

    await test.step('User navigates to Programs page', async () => {
      await programsPage.navigateToProgramsPage();
    });

    await test.step('Page heading should display as "Programs"', async () => {

       await Assertions.verifyElementVisible(programsPage.programPageHeader, 'Programs page header');
      
      await Assertions.verifyElementText(programsPage.programPageHeader,
        PageHeaders.PROGRAMS,
        'Programs page header'
      );
      
      Logger.success('Page header displays correctly');
    
    });

    await test.step('"Add New Program" link is visible', async () => {

      await Assertions.verifyElementVisible(programsPage.addNewProgramLink, 'Add New Program link');

      await Assertions.verifyElementText(programsPage.addNewProgramLink,
        AddNewLinkText.PROGRAM,
        'Add new program link'
      )

      Logger.success('Add new program link displays correctly');
  
    });

    await test.step('Filter options (Active, Inactive, All) are visible', async () => {
      // ✅ Use inherited methods from SharedComponents
      await Assertions.verifyElementVisible(
        programsPage.getActiveRadioButton(),
        'Active filter'
      );
      await Assertions.verifyElementVisible(
        programsPage.getInactiveRadioButton(),
        'Inactive filter'
      );
      await Assertions.verifyElementVisible(
        programsPage.getAllRadioButton(),
        'All filter'
      );
      Logger.success('All filter options are visible');
    });

    Logger.testEnd('TC-PP-001: View Programs Page');
  });

  
  test('TC-PP-002: Add New Program Navigation @smoke @regression', async ({ programsPage,  }) => {
    Logger.testStart('TC-PP-002: Add New Program Navigation');

    await test.step('User is on Programs list page', async () => {
      await programsPage.navigateToProgramsPage();
      await programsPage.verifyPageLoaded();
    });

    await test.step('User clicks "Add New Program" button', async () => {
      await programsPage.clickAddNewProgram();
    });

    // await test.step('User is navigated to Add Program page', async () => {
    //  // await staffPage.waitForTimeout(1000);
    
    //   const currentUrl = await staffPage.url();
    //   expect(currentUrl).toContain('add');
    //   Logger.success('Successfully navigated to Add Program page');
    // });

    // await test.step('Page title shows "Add Program"', async () => {
    //   const pageTitle = await staffPage.locator('h1, h2').first().textContent();
    //   expect(pageTitle).toContain('Add Program');
    //   Logger.success('Page title shows "Add Program"');
    // });

    Logger.testEnd('TC-PP-002: Add New Program Navigation');
  });

  // /* ==================== FILTER TESTS ==================== */

  // test('TC-PP-003: Filter Active Programs @regression', async ({ programsPage }) => {
  //   Logger.testStart('TC-PP-003: Filter Active Programs');

  //   await test.step('Navigate to Programs page', async () => {
  //     await programsPage.navigateToProgramsPage();
  //   });

  //   await test.step('User selects "Active" filter', async () => {
  //     // ✅ Call inherited method from SharedComponents
  //     await programsPage.selectActiveFilter();
  //   });

  //   await test.step('Active filter is selected', async () => {
  //     await Assertions.verifyElementChecked(
  //       programsPage.getActiveRadioButton(),
  //       'Active filter'
  //     );
  //     Logger.success('Active filter applied successfully');
  //   });

  //   Logger.testEnd('TC-PP-003: Filter Active Programs');
  // });

  // test('TC-PP-004: Filter Inactive Programs @regression', async ({ programsPage }) => {
  //   Logger.testStart('TC-PP-004: Filter Inactive Programs');

  //   await test.step('Navigate to Programs page', async () => {
  //     await programsPage.navigateToProgramsPage();
  //   });

  //   await test.step('User selects "Inactive" filter', async () => {
  //     // ✅ Call inherited method from SharedComponents
  //     await programsPage.selectInactiveFilter();
  //   });

  //   await test.step('Inactive filter is selected', async () => {
  //     await Assertions.verifyElementChecked(
  //       programsPage.getInactiveRadioButton(),
  //       'Inactive filter'
  //     );
  //     Logger.success('Inactive filter applied successfully');
  //   });

  //   Logger.testEnd('TC-PP-004: Filter Inactive Programs');
  // });

  // test('TC-PP-005: Show All Programs @regression', async ({ programsPage }) => {
  //   Logger.testStart('TC-PP-005: Show All Programs');

  //   await test.step('Navigate to Programs page', async () => {
  //     await programsPage.navigateToProgramsPage();
  //   });

  //   await test.step('User selects "All" filter', async () => {
  //     // ✅ Call inherited method from SharedComponents
  //     await programsPage.selectAllFilter();
  //   });

  //   await test.step('All filter is selected', async () => {
  //     await Assertions.verifyElementChecked(
  //       programsPage.getAllRadioButton(),
  //       'All filter'
  //     );
  //     Logger.success('All filter applied successfully');
  //   });

  //   Logger.testEnd('TC-PP-005: Show All Programs');
  // });

  // /* ==================== SEARCH TESTS ==================== */

  // test('TC-PP-006: Search by Program Code @regression', async ({ programsPage, staffPage }) => {
  //   Logger.testStart('TC-PP-006: Search by Program Code');

  //   await test.step('Navigate to Programs page', async () => {
  //     await programsPage.navigateToProgramsPage();
  //   });

  //   await test.step('User enters program code in search field', async () => {
  //     const searchCode = 'GP'; // Use a known code from your system
  //     await programsPage.searchByProgramCode(searchCode);
  //   });

  //   await test.step('Search results are displayed', async () => {
  //     await staffPage.waitForTimeout(1000);
  //     Logger.success('Search executed successfully');
  //   });

  //   Logger.testEnd('TC-PP-006: Search by Program Code');
  // });

  // test('TC-PP-007: Search by Program Name @regression', async ({ programsPage, staffPage }) => {
  //   Logger.testStart('TC-PP-007: Search by Program Name');

  //   await test.step('Navigate to Programs page', async () => {
  //     await programsPage.navigateToProgramsPage();
  //   });

  //   await test.step('User enters program name in search field', async () => {
  //     await programsPage.searchByProgramName('Grant');
  //   });

  //   await test.step('Search results are displayed', async () => {
  //     await staffPage.waitForTimeout(1000);
  //     Logger.success('Search executed successfully');
  //   });

  //   Logger.testEnd('TC-PP-007: Search by Program Name');
  // });

  // /* ==================== PAGINATION TESTS ==================== */

  // test('TC-PP-008: Pagination - Next Page @regression', async ({ programsPage }) => {
  //   Logger.testStart('TC-PP-008: Pagination - Next Page');

  //   await test.step('Navigate to Programs page', async () => {
  //     await programsPage.navigateToProgramsPage();
  //   });

  //   await test.step('Click Next button if enabled', async () => {
  //     // ✅ Use inherited method from SharedComponents
  //     await programsPage.goToNextPage();
  //     Logger.success('Pagination test completed');
  //   });

  //   Logger.testEnd('TC-PP-008: Pagination - Next Page');
  // });

  // test('TC-PP-009: Pagination - Previous Page @regression', async ({ programsPage }) => {
  //   Logger.testStart('TC-PP-009: Pagination - Previous Page');

  //   await test.step('Navigate to Programs page', async () => {
  //     await programsPage.navigateToProgramsPage();
  //   });

  //   await test.step('Go to next page first', async () => {
  //     await programsPage.goToNextPage();
  //   });

  //   await test.step('Click Previous button', async () => {
  //     // ✅ Use inherited method from SharedComponents
  //     await programsPage.goToPreviousPage();
  //     Logger.success('Navigated to previous page');
  //   });

  //   Logger.testEnd('TC-PP-009: Pagination - Previous Page');
  // });

  // /* ==================== ACTION ICON TESTS ==================== */

  // test('TC-PP-010: Edit Program from List @regression', async ({ programsPage, staffPage }) => {
  //   Logger.testStart('TC-PP-010: Edit Program from List');

  //   await test.step('Navigate to Programs page', async () => {
  //     await programsPage.navigateToProgramsPage();
  //   });

  //   await test.step('Search for a program', async () => {
  //     await programsPage.searchByProgramCode('GP');
  //     await staffPage.waitForTimeout(1000);
  //   });

  //   await test.step('Click edit icon for program', async () => {
  //     // ✅ Use inherited method from SharedComponents
  //     await programsPage.editProgram('GP');
  //     Logger.success('Clicked edit icon');
  //   });

  //   await test.step('Verify navigation to edit page', async () => {
  //     await staffPage.waitForTimeout(1000);
  //     const currentUrl = await staffPage.url();
  //     expect(currentUrl).toContain('edit');
  //     Logger.success('Navigated to edit page');
  //   });

  //   Logger.testEnd('TC-PP-010: Edit Program from List');
  // });
});

/**
 * HOW TO RUN THESE TESTS:
 * 
 * Run all programs list tests:
 * npx playwright test programs-view.spec.ts
 * 
 * Run only smoke tests:
 * npx playwright test --grep @smoke
 * 
 * Run only regression tests:
 * npx playwright test --grep @regression
 * 
 * Run specific test:
 * npx playwright test -g "TC-PP-001"
 * 
 * Run with UI mode:
 * npx playwright test programs-view.spec.ts --ui
 * 
 * Run in headed mode (see browser):
 * npx playwright test programs-view.spec.ts --headed
 */