import { test } from "@playwright/test";
import { LoginPage } from "@pages/common/LoginPage";
import { ExpenseReviewPage } from "@pages/manager/ExpenseReviewPage";

test(
    "Manager can approve submitted expense",
    async ({ browser }) => {

        const context = await browser.newContext();

        const page = await context.newPage();

        const loginPage = new LoginPage(page);

        const managerPage = new ExpenseReviewPage(page);

        await loginPage.goto();

        await loginPage.doLogin(

            process.env.ETS_MANAGER_USERNAME!,
            process.env.ETS_MANAGER_PASSWORD!,
            "Manager"

        );

        await managerPage.navigateToExpenseManager();

        await managerPage.openFirstSubmittedExpense();

        await managerPage.verifyExpenseStatusVisible();

        await managerPage.approveExpense();

        await managerPage.submitApproval();

        await context.close();

    }
);