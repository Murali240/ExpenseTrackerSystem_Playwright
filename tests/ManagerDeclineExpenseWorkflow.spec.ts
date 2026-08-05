import { test } from "@playwright/test";
import { LoginPage } from "@pages/common/LoginPage";
import { ExpenseReviewPage } from "@pages/manager/ExpenseReviewPage";
import { Logger } from "@utils/logger";

test(
    "TC-EXP-MGR-002: Manager can decline submitted expense",
    async ({ browser }) => {

        test.setTimeout(120000);

        Logger.testStart("TC-EXP-MGR-002");

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

        await expenseReviewPage.declineExpense();

        await expenseReviewPage.submitApproval();

        Logger.testEnd("TC-EXP-MGR-002");

        await context.close();
    }
);