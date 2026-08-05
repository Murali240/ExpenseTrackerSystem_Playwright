import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/common/LoginPage';
import { EmployeeExpensePage } from '../../src/pages/employee/EmployeeExpensePage';
import { Logger } from '@utils/logger';

test.only('Employee can submit multiple expenses in a single expense request', async ({ browser }) => {

    test.setTimeout(180000);

    const context = await browser.newContext();
    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    const expensePage = new EmployeeExpensePage(page);

    await loginPage.goto();

    await loginPage.doLogin(
        process.env.ETS_EMPLOYEE_USERNAME!,
        process.env.ETS_EMPLOYEE_PASSWORD!,
        'Employee'
    );

    await expensePage.navigateToSubmittedExpenses();

    await expensePage.clickAddNewExpense();

    const timestamp = Date.now();

    // ==========================
    // Common Header
    // ==========================

    await expensePage.fillInput(
        expensePage.expenseTitleInputField,
        `Multiple Expense ${timestamp}`,
        'Expense Title'
    );

    await expensePage.selectFromDate('2026-06-01');

    await expensePage.selectToDate('2026-06-10');

    // ======================================================
    // Expense Section 1
    // ======================================================

    await expensePage.selectExpenseDate('2026-06-05');

    await expensePage.selectFirstClient();

    await expensePage.selectFirstProject();

   // await page.pause();

    await expensePage.selectExpenseType('Train');

    await expensePage.fillInput(
        expensePage.merchantNameInputField,
        'Amazon',
        'Merchant'
    );

    await expensePage.selectPaymentMethod('UPI');

    await expensePage.fillInput(
        expensePage.expenseAmountInputField,
        '6000',
        'Expense Amount'
    );

    await expensePage.fillInput(
        expensePage.expenseDescriptionTextAreaBox,
        'Travel Expense',
        'Description'
    );

    await expensePage.fillInput(
        expensePage.documentNameInputField,
        `Receipt-1-${timestamp}`,
        'Document Name'
    );

    await expensePage.uploadReceipt(
        'test-data/files/expense-receipt.pdf'
    );

    // ======================================================
    // Add another Expense Section
    // ======================================================

    await expensePage.addNewExpenseSection();

    // ======================================================
    // Expense Section 2
    // ======================================================

    await expensePage.fillExpenseSection(
        1,
        4000,
        'Flipkart',
        'Food Expense',
        `Receipt-2-${timestamp}`,
        'test-data/files/expense-receipt.pdf'
    );

    // ======================================================
    // Verify Total
    // ======================================================

    await expensePage.verifyMultipleExpenseTotalAmount(
        6000,
        4000
    );

    // ======================================================
    // Submit
    // ======================================================

    await expensePage.submitExpense();

    // Wait until Submitted Expenses page loads
    await expensePage.waitForPageLoad();

    // ======================================================
    // Verify Expense Created
    // ======================================================

    const expenseTitle = `Multiple Expense ${timestamp}`;

    await expensePage.searchExpense(
        expenseTitle
    );

    await expensePage.verifyExpenseCreated(
        expenseTitle
    );

    Logger.success(
        "Multiple Expense Created Successfully"
    );

    await context.close();

});