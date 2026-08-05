import { test, expect } from "@playwright/test";

import { LoginPage } from "../src/pages/common/LoginPage";
import { EmployeeExpensePage } from "../src/pages/employee/EmployeeExpensePage";

import { Logger } from "../src/utils/logger";

test.describe("Employee Expense Management", () => {

    test("TC-EMP-001 : Employee should create expense successfully",
        async ({ browser }) => {

            Logger.separator();
            Logger.info("Starting Employee Expense Creation Test");

            /*===========================================================
                            Browser Context
            ===========================================================*/

            const employeeContext =
                await browser.newContext();

            const employeePage =
                await employeeContext.newPage();

            /*===========================================================
                            Page Objects
            ===========================================================*/

            const loginPage =
                new LoginPage(employeePage);

            const employeeExpensePage =
                new EmployeeExpensePage(employeePage);

            /*===========================================================
                            Login
            ===========================================================*/

            await loginPage.goto();

            await loginPage.doLogin(
                process.env.ETS_EMPLOYEE_USERNAME!,
                process.env.ETS_EMPLOYEE_PASSWORD!,
                "Employee"
            );

            /*===========================================================
                            Navigate
            ===========================================================*/

            await employeeExpensePage.navigateToSubmittedExpenses();

            await employeeExpensePage.clickAddNewExpense();

            /*===========================================================
                            Expense Details
            ===========================================================*/

            const expenseTitle =
                `Automation Expense ${Date.now()}`;

            await employeeExpensePage.fillExpenseTitle(
                expenseTitle
            );

            await employeeExpensePage.selectFromDate(
                "2026-06-01"
            );

            await employeeExpensePage.selectToDate(
                "2026-06-10"
            );

            await employeeExpensePage.selectExpenseDate(
                "2026-06-05"
            );

            /*===========================================================
                            Client & Project
            ===========================================================*/

            await employeeExpensePage.selectFirstClient();

            await employeeExpensePage.selectFirstProject();

            /*===========================================================
                            Expense Information
            ===========================================================*/

            await employeeExpensePage.selectExpenseType(
                "Air Fare"
            );

            await employeeExpensePage.fillMerchantName(
                "Indigo Airlines"
            );

            await employeeExpensePage.selectPaymentMethod(
                "UPI"
            );

            await employeeExpensePage.enterExpenseAmount(
                "5000"
            );

            await employeeExpensePage.enterExpenseDescription(
                "Expense created through Playwright Automation"
            );

            await employeeExpensePage.enterDocumentName(
                `Receipt ${Date.now()}`
            );

            /*===========================================================
                            Upload
            ===========================================================*/

            await employeeExpensePage.uploadReceipt(
                "test-data/files/expense-receipt.pdf"
            );

            /*===========================================================
                            Verification
            ===========================================================*/

            await employeeExpensePage.verifyTotalExpenseAmount(
                "5000"
            );

            /*===========================================================
                            Submit
            ===========================================================*/

            await employeeExpensePage.submitExpense();

            await employeeExpensePage.verifyExpenseCreated(
                expenseTitle
            );

            Logger.success("Employee Expense Created Successfully");

            await employeeContext.close();
        });

});