import { expect, Page, Locator } from "@playwright/test";
import { ExpenseManagementPage } from "@pages/ExpenseManagementPage";
import { Logger } from "@utils/logger";
import { Assertions } from "@utils/assertions";
import { test } from "@fixtures/AuthFixtures";

export class ExpenseReviewPage extends ExpenseManagementPage {

    /*=========================================================
                        MENU
    =========================================================*/

    readonly expenseManagementMenu: Locator;
    readonly expenseManagerMenu: Locator;

    /*=========================================================
                    EXPENSE LIST
    =========================================================*/

    readonly submittedExpenseRow: Locator;

    /*=========================================================
                    APPROVAL PAGE
    =========================================================*/

    readonly expenseStatusBadge: Locator;

    readonly approveRadioButton: Locator;

    readonly declineRadioButton: Locator;

    readonly submitApprovalButton: Locator;

    readonly yesSubmitButton: Locator;

    // adding locators for partial approval comments
    
    readonly submittedExpenseAmount: Locator;

    readonly approvedAmountInputField: Locator;

    readonly reasonForPartialApproval: Locator;

    readonly reasonForDeclineInputBox: Locator;

    readonly totalExpenseAmount: Locator;

    readonly totalApprovedAmount: Locator;

    constructor(page: Page) {

        super(page);

        this.expenseManagementMenu =
            page.getByRole("link", { name: "Expense Management" });

        this.expenseManagerMenu =
            page.getByRole("link", { name: "Expenses Manager" });

        this.submittedExpenseRow =
            page.locator(
                'table tbody tr:has(span.badge.rounded-pill.bg-primary:text("Submitted"))'
            );

        this.expenseStatusBadge =
            page.locator(".badge.rounded-pill.bg-primary");

        this.approveRadioButton =
            page.locator("#id_details_id_expenses_mstr-0-approvalstatus_0");

        this.declineRadioButton =
            page.locator("#id_details_id_expenses_mstr-0-approvalstatus_1");

        this.submitApprovalButton =
            page.locator("#btn-submit-approval");

        this.yesSubmitButton =
            page.locator(".swal2-confirm.swal2-styled");

        // adding locators for partial approval comments

        this.submittedExpenseAmount =
            page.locator('input[name="details_id_expenses_mstr-0-user_amt"]');

        this.approvedAmountInputField =
            page.locator('.form-control.approved-amt-field.amount-input.editable');

        this.reasonForPartialApproval =
            page.locator('.form-control.partial-note-input');

        this.reasonForDeclineInputBox =
            page.getByPlaceholder("Enter reason for decline...");

        this.totalExpenseAmount =
            page.locator('#total_expense_amt');

        this.totalApprovedAmount =
            page.locator('#summary_approved_amt');
            
    }

    /*=========================================================
                    NAVIGATION
    =========================================================*/

    async navigateToExpenseManager(): Promise<void> {

        Logger.step("Navigate To Expense Manager");

        await this.clickElement(
            this.expenseManagementMenu,
            "Expense Management Menu"
        );

        await this.clickElement(
            this.expenseManagerMenu,
            "Expense Manager Menu"
        );

        await this.waitForPageLoad();

    }

    /*=========================================================
                    LIST ACTIONS
    =========================================================*/

   async openFirstSubmittedExpense(): Promise<void> {

        Logger.step("Searching Submitted Expense");

        await this.page.waitForLoadState("networkidle");

        await this.page.waitForSelector("table tbody tr", {
            state: "visible",
            timeout: 30000
        });

        const submittedRow = this.page.locator(
            'table tbody tr:has(span.badge.rounded-pill.bg-primary:text("Submitted"))'
        );

        const count = await submittedRow.count();

        Logger.info(`Submitted Expense Count : ${count}`);

        if (count === 0) {

            throw new Error(
                "No Submitted expense available in Expense List."
            );

        }

        Logger.success("Submitted expense found.");

        await submittedRow
            .first()
            .locator(".fa.fa-eye")
            .click();

        await this.waitForPageLoad();

    }

    /*=========================================================
                    VERIFICATION
    =========================================================*/

    async verifyExpenseStatusVisible(): Promise<void> {

        await Assertions.verifyElementVisible(
            this.expenseStatusBadge,
            "Expense Status Badge"
        );

    }

    /*=========================================================
                    APPROVAL
    =========================================================*/

    async approveExpense(): Promise<void> {

        Logger.step("Approving Expense");

        await this.clickElement(
            this.approveRadioButton,
            "Approve Radio Button"
        );

    }

    async submitApproval(): Promise<void> {

        Logger.step("Submitting Approval");

        await this.clickElement(
            this.submitApprovalButton,
            "Submit Button"
        );

        await this.clickElement(
            this.yesSubmitButton,
            "Yes Confirmation Button"
        );

        await this.waitForPageLoad();

        await expect(this.successMessage).toContainText(
            "Expense Approval/Declined submitted successfully",
            {
                timeout: 30000
            }
        );

        const message = await this.getSuccessMessageText();

        Logger.success(`Success Message : ${message}`);
    }

    
    // Additional methods for partial approval

    private async getSubmittedAmount(): Promise<number> {

        const amountText =
            await this.submittedExpenseAmount.inputValue();

        Logger.info(`Submitted Amount : ${amountText}`);

        return Number(
            amountText.replace(/[$,]/g, "")
        );

    }

    async partialApproveExpense(): Promise<void> {

        Logger.step("Performing Partial Approval");

        await this.clickElement(
            this.approveRadioButton,
            "Approve Radio Button"
        );

        const submittedAmount =
            await this.getSubmittedAmount();

        Logger.info(`Employee Submitted Amount : ${submittedAmount}`);

        /*
            Generate Approved Amount

            Example

            Submitted = 5000

            Approved = 3000
        */

        const approvedAmount = Math.floor(
                               Math.random() * (submittedAmount - 100)
                               ) + 100;

        Logger.info(`Approved Amount : ${approvedAmount}`);

        await this.approvedAmountInputField.fill("");

        await this.approvedAmountInputField.fill(
            approvedAmount.toString()
        );

        await this.reasonForPartialApproval.fill(

            `Partially approved by Manager. Reduced amount after expense verification.`

        );

        Logger.info(
            `Reason entered successfully`
        );

        const totalExpense =
            await this.totalExpenseAmount.textContent();

        const totalApproved =
            await this.totalApprovedAmount.textContent();

        await test.info().attach(
            "Partial Approval Details",
            {
                body: `
        Submitted Amount : ${submittedAmount}
        Approved Amount : ${approvedAmount}
        Total Expense : ${totalExpense}
        Total Approved : ${totalApproved}
        `,
                contentType: "text/plain"
            }
        );

        }

        async declineExpense(): Promise<void> {

            Logger.step("Performing Expense Decline");

            // Click Decline (No) radio button
            await this.clickElement(
                this.declineRadioButton,
                "Decline Radio Button"
            );

            // Wait until Decline Reason textbox is visible
            await Assertions.verifyElementVisible(
                this.reasonForDeclineInputBox,
                "Decline Reason Textbox",
                10000
            );

            const reason =
                "Expense declined by Manager due to policy violation and insufficient supporting documents.";

            await this.reasonForDeclineInputBox.fill(reason);

            Logger.info(`Decline Reason : ${reason}`);

            await test.info().attach(
                "Decline Details",
                {
                    body: reason,
                    contentType: "text/plain"
                }
            );

            Logger.success("Expense decline details entered successfully");
        }
}