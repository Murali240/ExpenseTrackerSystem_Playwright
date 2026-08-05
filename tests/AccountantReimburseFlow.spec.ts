import { test } from "@playwright/test";
import { LoginPage } from "@pages/common/LoginPage";
import { ReimbursementPage } from "@pages/accountant/ReimbursementPage";

test(
    "Accountant can reimburse approved expense",
    async ({ browser }) => {

        const context = await browser.newContext();

        const page = await context.newPage();

        const loginPage = new LoginPage(page);

        const reimbursementPage = new ReimbursementPage(page);

        await loginPage.goto();

        await loginPage.doLogin(
            process.env.ETS_ACCOUNTANT_USERNAME!,
            process.env.ETS_ACCOUNTANT_PASSWORD!,
            "Accountant"
        );

        await reimbursementPage.navigateToExpenseManager();

        await reimbursementPage.reimburseExpense();

        await context.close();

    }
);