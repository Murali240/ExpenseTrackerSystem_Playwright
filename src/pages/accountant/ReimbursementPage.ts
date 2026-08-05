import { Locator, Page } from "@playwright/test";
import { ExpenseManagementPage } from "@pages/ExpenseManagementPage";
import { Logger } from "@utils/logger";
import { Assertions } from "@utils/assertions";

export class ReimbursementPage extends ExpenseManagementPage {

    /*=========================================================
                        EXPENSE MANAGER
    =========================================================*/

    readonly approvedStatusBadge: Locator;

    readonly viewIcon: Locator;

    readonly addReviewButton: Locator;

    readonly expenseReviewPopup: Locator;

    /*=========================================================
                        PAYMENT DETAILS
    =========================================================*/

    readonly performTaskDropdown: Locator;

    readonly paymentDetailsTab: Locator;

    readonly expenseTypeCheckbox: Locator;

    readonly paymentMethodDropdown: Locator;

    readonly transactionNumberTextbox: Locator;

    readonly upiAppDropdown: Locator;

    readonly paymentTypeDropdown: Locator;

    readonly receivedByDropdown: Locator;

    readonly saveReviewButton: Locator;

    readonly successMessage: Locator;

    constructor(page: Page) {

        super(page);

        /*=========================================================
                        EXPENSE LIST
        =========================================================*/

        this.approvedStatusBadge =
            page.locator(".badge.rounded-pill.bg-success");

        this.viewIcon =
            page.locator(".fa.fa-eye");

        /*=========================================================
                        REVIEW
        =========================================================*/

        this.addReviewButton =
            page.locator("#btn-add-review");

        this.expenseReviewPopup =
            page.locator(".modal-header.bg-primary.text-white.py-3");

        this.performTaskDropdown =
            page.locator("#pop_pfrm_task");

        /*=========================================================
                        PAYMENT
        =========================================================*/

        this.paymentDetailsTab =
            page.locator("#pop-payment-tab");

        this.expenseTypeCheckbox =
            page.locator("#pop_expense_select_all");

        this.paymentMethodDropdown =
            page.locator("#pop_payment_method");

        this.transactionNumberTextbox =
            page.locator("#pop_transaction_number");

        this.upiAppDropdown =
            page.locator("#pop_upi_app");

        this.paymentTypeDropdown =
            page.locator("#pop_payment_type");

        this.receivedByDropdown =
            page.locator("#pop_received_by");

        this.saveReviewButton =
            page.locator("#btn-save-pop-review");

        this.successMessage = this.page.locator("#swal2-html-container");

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
            this.expenseManagerSubMenu,
            "Expense Manager Sub Menu"
        );

        await this.waitForPageLoad();

    }

    /*=========================================================
                OPEN FIRST APPROVED EXPENSE
    =========================================================*/

    async openFirstApprovedExpense(): Promise<void> {

        Logger.step("Searching Approved Expense");

        await this.page.waitForLoadState("networkidle");

        await this.page.locator("table tbody tr").first().waitFor({
            state: "visible",
            timeout: 30000
        });

        const approvedBadge = this.page.locator(
            "//span[normalize-space()='Approved']"
        );

        try {

            await approvedBadge.first().waitFor({
                state: "visible",
                timeout: 10000
            });

        } catch {

            throw new Error(
                "No Approved expense available in Expense List."
            );

        }

        Logger.success("Approved expense found.");

        const approvedRow =
            approvedBadge.first().locator("xpath=ancestor::tr");

        await approvedRow.locator(".fa.fa-eye").click();

        await this.waitForPageLoad();
    }

    /*=========================================================
                    VERIFY APPROVED STATUS
    =========================================================*/

    async verifyApprovedStatusVisible(): Promise<void> {

        Logger.step("Verify Approved Status");

        await Assertions.verifyElementVisible(

            this.approvedStatusBadge.first(),

            "Approved Status"

        );

    }

    /*=========================================================
                    ADD REVIEW
    =========================================================*/

    async clickAddReview(): Promise<void> {

        Logger.step("Click Add Review");

        await this.clickElement(

            this.addReviewButton,

            "Add Review Button"

        );

        await Assertions.verifyElementVisible(

            this.expenseReviewPopup,

            "Expense Review Popup"

        );

    }

    /*=========================================================
                PERFORM TASK
    =========================================================*/

    async selectPerformTask(): Promise<void> {

        Logger.step("Selecting Perform Task : Reimbursed");

        await this.waitForElement(this.performTaskDropdown);

        await this.performTaskDropdown.selectOption({
            label: "Reimbursed"
        });

    }

    /*=========================================================
                    PAYMENT DETAILS TAB
    =========================================================*/

    async openPaymentDetailsTab(): Promise<void> {

        Logger.step("Open Payment Details Tab");

        await this.clickElement(
            this.paymentDetailsTab,
            "Payment Details Tab"
        );

    }

    /*=========================================================
                    SELECT EXPENSE
    =========================================================*/

    async selectExpense(): Promise<void> {

        Logger.step("Select Expense");

        await this.clickElement(
            this.expenseTypeCheckbox,
            "Expense Checkbox"
        );

    }

    /*=========================================================
                    PAYMENT METHOD
    =========================================================*/

    async selectPaymentMethod(): Promise<void> {

        Logger.step("Payment Method : UPI");

        await this.paymentMethodDropdown.selectOption({
            label: "UPI"
        });

    }

    /*=========================================================
                    TRANSACTION NUMBER
    =========================================================*/

    async enterTransactionNumber(): Promise<string> {

        const transactionId =
            `UPI${Date.now()}`;

        Logger.info(`Transaction Id : ${transactionId}`);

        await this.fillInput(
            this.transactionNumberTextbox,
            transactionId,
            "Transaction Number"
        );

        return transactionId;

    }

    /*=========================================================
                    UPI APP
    =========================================================*/

    async selectUpiApp(): Promise<void> {

        Logger.step("UPI App : PhonePe");

        await this.upiAppDropdown.selectOption({
            label: "PhonePe"
        });

    }

    /*=========================================================
                    PAYMENT TYPE
    =========================================================*/

    async selectPaymentType(): Promise<void> {

        Logger.step("Payment Type : Full Reimbursement");

        await this.paymentTypeDropdown.selectOption({
            label: "Full Reimbursement"
        });

    }

    /*=========================================================
                    RECEIVED BY
    =========================================================*/

    async selectReceivedBy(): Promise<void> {

        Logger.step("Selecting Employee");

        await this.receivedByDropdown.selectOption({
            index: 1
        });

    }

    /*=========================================================
                    SAVE REVIEW
    =========================================================*/

    async saveReview(): Promise<void> {

        Logger.step("Saving Review");

        await this.clickElement(
            this.saveReviewButton,
            "Save Review Button"
        );

        await this.waitForPageLoad();

        // Wait until Review Saved Successfully popup appears
        await Assertions.verifyElementVisible(
            this.successMessage,
            "Review Saved Successfully Message",
            30000
        );

        Logger.success("Review saved successfully");

        // Give backend enough time to update status
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(3000);

    }

    /*=========================================================
                    COMPLETE REIMBURSEMENT
    =========================================================*/

    async reimburseExpense(): Promise<void> {

        await this.openFirstApprovedExpense();

        await this.verifyApprovedStatusVisible();

        await this.clickAddReview();

        await this.selectPerformTask();

        await this.openPaymentDetailsTab();

        await this.selectExpense();

        await this.selectPaymentMethod();

        await this.enterTransactionNumber();

        await this.selectUpiApp();

        await this.selectPaymentType();

        await this.selectReceivedBy();

        await this.saveReview();

    }

}