import { test } from "@playwright/test";
import { LoginPage } from "@pages/common/LoginPage";
import { ExpenseReviewPage } from "@pages/manager/ExpenseReviewPage";
import { Logger } from "@utils/logger";

test(
    "TC-EXP-MGR-001: Manager can partially approve submitted expense",
    async ({ browser }) => {

        test.setTimeout(120000);  // Set timeout to 2 minutes for this test

        Logger.testStart("TC-EXP-MGR-001");

        const context = await browser.newContext();

        const page = await context.newPage();

        const loginPage = new LoginPage(page);
        const expenseReviewPage = new ExpenseReviewPage(page);

        await loginPage.goto();

        await loginPage.doLogin(
            process.env.ETS_MANAGER_USERNAME!,
            process.env.ETS_MANAGER_PASSWORD!,
            "Manager"
        );

        await expenseReviewPage.navigateToExpenseManager();

        await expenseReviewPage.openFirstSubmittedExpense();

        await expenseReviewPage.verifyExpenseStatusVisible();

        await expenseReviewPage.partialApproveExpense();

        await expenseReviewPage.submitApproval();

        Logger.testEnd("TC-EXP-MGR-001");

        await context.close();
    }
);