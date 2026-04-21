/**
 * Programs Module – End-to-End Tests
 *
 * File: tests/programs/programs-e2e.spec.ts
 *
 * Covers full flow:
 * Menu → Programs List → Add Program → Verify in List
 */

import { test, expect } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import { ProgramFactory } from '@utils/factories/ProgramFactory';
import { PageHeaders } from '@enums/Enums';

test.describe('Programs Module – End-to-End Flows @programs @e2e', () => {

  /* ──────────────────────────────────────────────────────────────
   * TC-AP-E2E-001
   * Create program and verify it appears in Programs list
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AP-E2E-001: Created program appears in the Programs list @e2e @regression',
    async ({ programsPage, addProgramPage }) => {

      Logger.testStart('TC-AP-E2E-001');

      const data = ProgramFactory.generateMinimalProgram();

      await test.step('Navigate to Programs page', async () => {
        await programsPage.navigateToProgramsPage();
        await programsPage.verifyPageLoaded();
      });

      await test.step('Click "Add New Program"', async () => {
        await programsPage.clickAddNewProgram();
        await addProgramPage.verifyAddProgramPageLoaded();
      });

      await test.step('Create program with required fields', async () => {
        await addProgramPage.fillRequiredFields({
          programCode: data.programCode,
          programName: data.programName,
        });

        await addProgramPage.clickSubmit();

        await Assertions.verifyElementVisible(
          addProgramPage.getSuccessMessage(),
          'Success message'
        );

        Logger.success(`Program ${data.programCode} created successfully`);
      });

      await test.step('Navigate back to Programs list', async () => {
        await programsPage.navigateToProgramsPage();
      });

      await test.step('Search and verify program in list', async () => {
        await programsPage.searchByProgramCode(data.programCode);

        const visible = await programsPage.isProgramVisible(data.programCode);
        expect(visible).toBe(true);

        Logger.success(`Program ${data.programCode} found in list`);
      });

      Logger.testEnd('TC-AP-E2E-001');
    }
  );


  /* ──────────────────────────────────────────────────────────────
   * TC-AP-E2E-002
   * Full E2E flow with department creation + all fields
   * ────────────────────────────────────────────────────────────── */
  test(
    'TC-AP-E2E-002: Full E2E – create department, fill all fields, verify in list @e2e @smoke @regression',
    async ({ programsPage, addProgramPage }) => {

      Logger.testStart('TC-AP-E2E-002');

      const deptName = `E2EDept_${Date.now()}`;
      const programData = ProgramFactory.generateBasicInfo();

      /* Step 1 – Navigate to Programs page */
      await test.step('Navigate to Programs page and verify header', async () => {
        await programsPage.navigateToProgramsPage();

        await Assertions.verifyElementVisible(
          programsPage.programPageHeader,
          'Programs page header'
        );

        await Assertions.verifyElementText(
          programsPage.programPageHeader,
          PageHeaders.PROGRAMS,
          'Programs page header text'
        );

        Logger.success('Programs page loaded successfully');
      });

      /* Step 2 – Go to Add Program page */
      await test.step('Click "Add New Program" and verify navigation', async () => {
        await programsPage.clickAddNewProgram();

        await Assertions.verifyPageUrlContains(
          addProgramPage.page,
          'programs/create'
        );

        await addProgramPage.verifyAddProgramPageLoaded();

        Logger.success('Navigated to Add Program page');
      });

      /* Step 3 – Create Department */
      await test.step('Create new department via modal', async () => {
        await addProgramPage.createNewDepartment(deptName);

        const options = await addProgramPage.getDepartmentOptions();
        expect(options.some(o => o.includes(deptName))).toBe(true);

        Logger.success(`Department created: ${deptName}`);
      });

      /* Step 4 – Fill all fields */
      await test.step('Fill all program fields', async () => {
        await addProgramPage.fillAllFields({
          department: deptName,
          fiscalYear: '2026',
          programCode: programData.programCode,
          programName: programData.programName,
          programBudget: '100000',
          programStartDate: '04/22/2026',
          programEndDate: '04/22/2027',
          description: 'E2E automation test – full form submission',
        });

        Logger.success('All fields filled successfully');
      });

      /* Step 5 – Submit */
      await test.step('Submit program form', async () => {
        await addProgramPage.clickSubmit();
      });

      /* Step 6 – Verify success */
      await test.step('Verify success message', async () => {
        await Assertions.verifyElementVisible(
          addProgramPage.getSuccessMessage(),
          'Success message'
        );

        Logger.success('Program created successfully');
      });

      /* Step 7 – Verify in list */
      await test.step('Verify program appears in Programs list', async () => {
        await programsPage.navigateToProgramsPage();

        await programsPage.searchByProgramCode(programData.programCode);

        const visible = await programsPage.isProgramVisible(programData.programCode);
        expect(visible).toBe(true);

        Logger.success(`Program ${programData.programCode} verified in list`);
      });

      Logger.testEnd('TC-AP-E2E-002');
    }
  );

});