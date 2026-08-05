import { test, expect } from "@playwright/test";

import { LoginPage } from "@pages/common/LoginPage";

import { EmployeeExpensePage } from "@pages/employee/EmployeeExpensePage";

import { ExpenseReviewPage } from "@pages/manager/ExpenseReviewPage";

import { ReimbursementPage } from "@pages/accountant/ReimbursementPage";

test("Complete Expense Workflow - Employee -> Manager -> Accountant -> Employee",
async ({ browser }) => {

    test.setTimeout(180000);  // Set timeout to 3 minutes for this test

    /************************************************************
                    TEST DATA
    ************************************************************/

    const timestamp = Date.now();

    const expense = {

        title: `Automation Expense ${timestamp}`,

        fromDate: "2026-07-01",

        toDate: "2026-07-10",

        expenseDate: "2026-07-10",

        merchantName: "Amazon",

        expenseAmount: "2500",

        expenseDescription: "Playwright End To End Test",

        documentName: `Receipt-${timestamp}`,

        receiptFilePath: "test-data/files/expense-receipt.pdf",

        paymentMethod: "UPI"

    };

    /************************************************************
                    EMPLOYEE
    ************************************************************/

    const employeeContext = await browser.newContext();

    const employeePage = await employeeContext.newPage();

    const employeeLogin = new LoginPage(employeePage);

    const employeeExpense = new EmployeeExpensePage(employeePage);

    await employeeLogin.goto();

    await employeeLogin.doLogin(

        process.env.ETS_EMPLOYEE_USERNAME!,
        process.env.ETS_EMPLOYEE_PASSWORD!,
        "Employee"

    );

    await employeeExpense.navigateToSubmittedExpenses();

    await employeeExpense.clickAddNewExpense();

    await employeeExpense.createExpense(expense);

    await employeeExpense.searchExpense(expense.title);

    await employeeExpense.verifyExpenseCreated(expense.title);

    await employeeContext.close();

    /************************************************************
                    MANAGER
    ************************************************************/

    const managerContext = await browser.newContext();

    const managerBrowser = await managerContext.newPage();

    const managerLogin = new LoginPage(managerBrowser);

    const managerPage = new ExpenseReviewPage(managerBrowser);

    await managerLogin.goto();

    await managerLogin.doLogin(

        process.env.ETS_MANAGER_USERNAME!,
        process.env.ETS_MANAGER_PASSWORD!,
        "Manager"

    );

    await managerPage.navigateToExpenseManager();

    // search using expense title
    await managerPage.searchExpense(expense.title);

    await managerPage.openFirstSubmittedExpense();

    await managerPage.verifyExpenseStatusVisible();

    await managerPage.approveExpense();

    await managerPage.submitApproval();

    await managerContext.close();

    /************************************************************
                    ACCOUNTANT
    ************************************************************/

    const accountantContext = await browser.newContext();

    const accountantBrowser = await accountantContext.newPage();

    const accountantLogin = new LoginPage(accountantBrowser);

    const reimbursement = new ReimbursementPage(accountantBrowser);

    await accountantLogin.goto();

    await accountantLogin.doLogin(

        process.env.ETS_ACCOUNTANT_USERNAME!,
        process.env.ETS_ACCOUNTANT_PASSWORD!,
        "Accountant"

    );

    await reimbursement.navigateToExpenseManager();

    // search using expense title
    await reimbursement.searchExpense(expense.title);

    await reimbursement.reimburseExpense();

    await accountantContext.close();

    /************************************************************
                    EMPLOYEE VERIFY
    ************************************************************/

    const verifyContext = await browser.newContext();

    const verifyBrowser = await verifyContext.newPage();

    const verifyLogin = new LoginPage(verifyBrowser);

    const verifyExpense = new EmployeeExpensePage(verifyBrowser);

    await verifyLogin.goto();

    await verifyLogin.doLogin(

        process.env.ETS_EMPLOYEE_USERNAME!,
        process.env.ETS_EMPLOYEE_PASSWORD!,
        "Employee"

    );

    await verifyExpense.navigateToSubmittedExpenses();

    await verifyExpense.searchExpense(expense.title);

    await verifyExpense.verifyExpenseCreated(expense.title);

    await verifyExpense.verifyExpenseStatus(
        expense.title,
        "Reimbursed"
    );

    await verifyContext.close();

});