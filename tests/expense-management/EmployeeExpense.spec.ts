import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/common/LoginPage';
import { EmployeeExpensePage } from '../../src/pages/employee/EmployeeExpensePage';

test('Employee can create expense and see it in submitted list', async ({ browser }) => {
 
 test.setTimeout(120000);  // Set timeout to 2 minutes for this test

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
  const data = {
    title: `AutoExpense ${timestamp}`,
    fromDate: '2026-06-01',
    toDate: '2026-06-10',
    expenseDate: '2026-06-05',
    merchantName: 'AutoMerchant',
    expenseAmount: '10000',
    expenseDescription: 'Automated test expense',
    documentName: `doc-${timestamp}`,
    receiptFilePath: 'test-data/files/expense-receipt.pdf',
    paymentMethod: 'UPI'
  };

  await expensePage.createExpense(data);

  await expensePage.searchExpense(data.title);
  await expensePage.verifyExpenseCreated(data.title);

  await context.close();
});
