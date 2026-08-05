import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

test.describe('Expense Management Module - Add New Expense', () => {

    test(
        'TC-EXPENSE-001: Submit New Expense Successfully',
        async ({ expenseManagementPage }) => {

            Logger.testStart(
                'TC-EXPENSE-001: Submit New Expense Successfully'
            );

            /* ==================== TEST DATA ==================== */

            const expenseData = {

                title: `Automation Expense ${Date.now()}`,

                fromDate: '2026-06-01',

                toDate: '2026-06-10',

                expenseDate: '2026-06-05',

                expenseType: 'Air Fare',

                merchantName: 'Indigo Airlines',

                paymentMethod: 'UPI',

                amount: '5000',

                description:
                    'Expense created through Playwright automation',

                receiptPath:
                    'test-data/files/expense-receipt.pdf'
            };

            /* ==================== NAVIGATION ==================== */

            await expenseManagementPage.navigateToSubmittedExpenses();

            await Assertions.verifyElementVisible(
                expenseManagementPage.addNewExpenseButton,
                'Add New Expense Button'
            );

            /* ==================== OPEN ADD EXPENSE FORM ==================== */

            await expenseManagementPage.clickAddNewExpense();

            await Assertions.verifyElementVisible(
                expenseManagementPage.expenseTitleInputField,
                'Expense Title Input Field'
            );

            /* ==================== BASIC INFORMATION ==================== */

            await expenseManagementPage.fillInput(
                expenseManagementPage.expenseTitleInputField,
                expenseData.title,
                'Expense Title'
            );

            /* ==================== DATE SELECTION ==================== */

            await expenseManagementPage.selectFromDate(
                expenseData.fromDate
            );

            await expenseManagementPage.selectToDate(
                expenseData.toDate
            );

            await expenseManagementPage.selectExpenseDate(
                expenseData.expenseDate
            );

            Logger.info(
                `From Date : ${await expenseManagementPage.fromDateSelection.inputValue()}`
            );

            Logger.info(
                `To Date : ${await expenseManagementPage.toDateSelection.inputValue()}`
            );

            Logger.info(
                `Expense Date : ${await expenseManagementPage.dateOfExpenseSelection.inputValue()}`
            );

            /* ==================== CLIENT & PROJECT ==================== */

            await expenseManagementPage.selectFirstClient();

            await expenseManagementPage.selectFirstProject();

            /* ==================== EXPENSE DETAILS ==================== */

            await expenseManagementPage.selectExpenseType(
                expenseData.expenseType
            );

            await expenseManagementPage.fillInput(
                expenseManagementPage.merchantNameInputField,
                expenseData.merchantName,
                'Merchant Name'
            );

            await expenseManagementPage.selectPaymentMethod(
                expenseData.paymentMethod
            );

            await expenseManagementPage.fillInput(
                expenseManagementPage.expenseAmountInputField,
                expenseData.amount,
                'Expense Amount'
            );

            await expenseManagementPage.fillInput(
                expenseManagementPage.expenseDescriptionTextAreaBox,
                expenseData.description,
                'Expense Description'
            );

            await expenseManagementPage.fillInput(
                 expenseManagementPage.documentNameInputField,
                 `Receipt ${Date.now()}`,
                 'Document Name'
            );

            /* ==================== FILE UPLOAD ==================== */

            await expenseManagementPage.uploadReceipt(
                expenseData.receiptPath
            );

            /* ==================== VERIFY TOTAL ==================== */

            await expenseManagementPage.verifyTotalExpenseAmount(
                expenseData.amount
            );

            /* ==================== SUBMIT ==================== */

            await expenseManagementPage.submitExpense();

            /* ==================== VERIFY SUCCESS ==================== */

            await expenseManagementPage.verifyExpenseSubmittedSuccessfully();

            Logger.success(
                '✅ Expense Submitted Successfully'
            );

            Logger.testEnd(
                'TC-EXPENSE-001'
            );
        }
    );
});