import { SharedComponents } from '@pages/base/SharedComponents';
import { Locator, Page, expect } from '@playwright/test';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';

export class ExpenseManagementPage extends SharedComponents {

    /* ==================== MENU ==================== */

    readonly expenseManagementMenu: Locator;
    readonly submittedExpensesSubMenu: Locator;
    readonly expenseManagerSubMenu: Locator;

    /* ==================== FORM ==================== */

    readonly addNewExpenseButton: Locator;

    readonly expenseTitleInputField: Locator;

    readonly fromDateSelection: Locator;
    readonly toDateSelection: Locator;
    readonly dateOfExpenseSelection: Locator;

    readonly clientDropdown: Locator;
    readonly projectDropdown: Locator;

    readonly expenseTypeDropdown: Locator;

    readonly merchantNameInputField: Locator;

    readonly paymentMethodSelection: Locator;

    readonly expenseAmountInputField: Locator;

    readonly expenseDescriptionTextAreaBox: Locator;

    readonly documentNameInputField: Locator;

    readonly attachReceipt: Locator;

    readonly totalExpenseAmountLabel: Locator;

    readonly submitButton: Locator;

    readonly searchInput: Locator;

    readonly searchButton: Locator;

    /* ==================== SUCCESS ==================== */

    readonly successMessage: Locator;

    // Multple expenses section locators can be added here as needed, following the same pattern.

    readonly addNewExpenseSectionButton: Locator;

    readonly expenseSectionHeading: Locator;


    constructor(page: Page) {
        super(page);

        /* Menu */

        this.expenseManagementMenu =
            page.getByRole('link', { name: 'Expense Management' });

        this.submittedExpensesSubMenu =
            page.getByRole('link', { name: 'Submitted Expenses' });

        this.expenseManagerSubMenu =
            page.getByRole('link', { name: 'Expenses Manager' });

        /* Form */

        this.addNewExpenseButton =
            page.getByRole('link', { name: '+ Add New Expense' });

        this.expenseTitleInputField =
            page.getByRole('textbox', { name: 'Enter title' });

        this.fromDateSelection =
            page.locator('[name="start_date"]');

        this.toDateSelection =
            page.locator('[name="end_date"]');

        this.dateOfExpenseSelection =
            page.locator('[name="details_id_expenses_mstr-0-dt_event"]');

        this.clientDropdown =
            page.locator('#id_details_id_expenses_mstr-0-id_client');

        this.projectDropdown =
            page.locator('#id_details_id_expenses_mstr-0-id_project');

        this.expenseTypeDropdown =
            page.locator('#id_details_id_expenses_mstr-0-id_exp');

        this.merchantNameInputField =
            page.locator('#id_details_id_expenses_mstr-0-merchant_name');

        this.paymentMethodSelection =
            page.locator('#id_details_id_expenses_mstr-0-id_paymentmethod');

        this.expenseAmountInputField =
            page.locator('#id_details_id_expenses_mstr-0-user_amt');

        this.expenseDescriptionTextAreaBox =
            page.locator('#id_details_id_expenses_mstr-0-expense_purpose');

        // this.documentNameInputField =
        //     page.getByRole('textbox', {name: 'Enter document name'});    

        this.documentNameInputField =
            page.locator('#id_details_id_expenses_mstr-0-receipt');

        this.attachReceipt =
            page.locator('[name="form-0-document"]');

        this.totalExpenseAmountLabel =
            page.locator(`//strong[contains(normalize-space(),'Total Expense Amount')]`);

        this.submitButton =
            page.locator('.btn.btn-success');

        /* Success */

        this.successMessage =
            page.locator(`//div[contains(@class,'swal2-popup')]`);

        this.searchInput =
            this.page.locator('input[placeholder="Search"], input[type="search"]').first();

        this.searchButton =
            this.page.locator('button:has-text("Search")').first();

        // Multple expenses section locators can be added here as needed, following the same pattern.

        this.addNewExpenseSectionButton =
            this.page.locator(".btn.btn-outline-primary.btn-sm");

        this.expenseSectionHeading =
            this.page.locator("div").filter({
                hasText: /^Expense Details- #/
            });
        }
        

    /* ==================== NAVIGATION ==================== */

    async navigateToSubmittedExpenses(): Promise<void> {

        Logger.step('Navigating To Submitted Expenses');

        await this.clickElement(
            this.expenseManagementMenu,
            'Expense Management Menu'
        );

        await this.clickElement(
            this.submittedExpensesSubMenu,
            'Submitted Expenses Sub Menu'
        );

        await this.waitForPageLoad();
    }

    async navigateToExpensesManager(): Promise<void> {

        Logger.step('Navigating To Expenses Manager');

        await this.clickElement(
            this.expenseManagementMenu,
            'Expense Management Menu'
        );

        await this.clickElement(
            this.expenseManagerSubMenu,
            'Expenses Manager Sub Menu'
        );

        await this.waitForPageLoad();
    }

    /* ==================== ACTIONS ==================== */

    async clickAddNewExpense(): Promise<void> {

        await this.clickElement(
            this.addNewExpenseButton,
            'Add New Expense Button'
        );
    }

    /* ==================== DATE SELECTION ==================== */

    async selectFromDate(date: string): Promise<void> {

        await this.page.evaluate((value) => {

            const element =
                document.querySelector(
                    '[name="start_date"]'
                ) as HTMLInputElement;

            element.removeAttribute('readonly');

            element.value = value;

            element.dispatchEvent(
                new Event('input', { bubbles: true })
            );

            element.dispatchEvent(
                new Event('change', { bubbles: true })
            );

        }, date);

        Logger.info(`From Date Selected: ${date}`);
    }

    async selectToDate(date: string): Promise<void> {

        await this.page.evaluate((value) => {

            const element =
                document.querySelector(
                    '[name="end_date"]'
                ) as HTMLInputElement;

            element.removeAttribute('readonly');

            element.value = value;

            element.dispatchEvent(
                new Event('input', { bubbles: true })
            );

            element.dispatchEvent(
                new Event('change', { bubbles: true })
            );

        }, date);

        Logger.info(`To Date Selected: ${date}`);
    }

    async selectExpenseDate(date: string): Promise<void> {

        await this.page.evaluate((value) => {

            const element =
                document.querySelector(
                    '[name="details_id_expenses_mstr-0-dt_event"]'
                ) as HTMLInputElement;

            element.removeAttribute('readonly');

            element.value = value;

            element.dispatchEvent(
                new Event('input', { bubbles: true })
            );

            element.dispatchEvent(
                new Event('change', { bubbles: true })
            );

        }, date);

        Logger.info(`Expense Date Selected: ${date}`);
    }

    /* ==================== DROPDOWNS ==================== */

    async selectFirstClient(): Promise<void> {

        Logger.info('Loading Client dropdown values');

        await Assertions.verifyElementVisible(
            this.clientDropdown,
            'Client Dropdown'
        );

        await this.clientDropdown.click();

        // Wait until API loads client options
        await expect(async () => {

            const optionCount =
                await this.clientDropdown.locator('option').count();

            expect(optionCount).toBeGreaterThan(1);

        }).toPass({
            timeout: 30000,
            intervals: [500]
        });

        const options =
            this.clientDropdown.locator('option');

        const clientValue =
            await options.nth(1).getAttribute('value');

        if (!clientValue) {
            throw new Error('First Client option not found.');
        }

        await this.clientDropdown.selectOption(clientValue);

        const clientName =
            await options.nth(2).textContent();

        Logger.success(
            `Client Selected: ${clientName?.trim()}`
        );
    }

    async selectFirstProject(): Promise<void> {

        Logger.info('Loading Project dropdown values');

        await Assertions.verifyElementVisible(
            this.projectDropdown,
            'Project Dropdown'
        );

        await this.projectDropdown.click();

        // Wait until API loads project options
        await expect(async () => {

            const optionCount =
                await this.projectDropdown.locator('option').count();

            expect(optionCount).toBeGreaterThan(1);

        }).toPass({
            timeout: 30000,
            intervals: [500]
        });

        const options =
            this.projectDropdown.locator('option');

        const projectValue =
            await options.nth(1).getAttribute('value');

        if (!projectValue) {
            throw new Error('First Project option not found.');
        }

        await this.projectDropdown.selectOption(projectValue);

        const projectName =
            await options.nth(1).textContent();

        Logger.success(
            `Project Selected: ${projectName?.trim()}`
        );
    }

    async selectExpenseTypeBySection(
        expenseType: string,
        sectionIndex: number = 0
    ): Promise<void> {

        Logger.info(
            `Selecting Expense Type '${expenseType}' for Section ${sectionIndex + 1}`
        );

        // Click Expense Type dropdown of required section
        await this.page
            .locator(".exp-type-caret")
            .nth(sectionIndex)
            .click();

        // Wait for category list
        const categoryHeaders =
            this.page.locator("//div[@class='exp-cat-header']");

        await categoryHeaders.first().waitFor({
            state: "visible"
        });

        const categoryCount =
            await categoryHeaders.count();

        // Calculate starting category for current section
        const categoryStart =
            Math.floor(categoryCount / (sectionIndex + 1)) * sectionIndex;

        // Expand first category
        await categoryHeaders
            .nth(categoryStart)
            .click();

        // Expense options
        const expenseOptions =
            this.page.locator("//div[@class='exp-item-option']");

        await expenseOptions.first().waitFor({
            state: "visible"
        });

        // Select by text
        const option =
            expenseOptions.filter({
                hasText: expenseType
            }).first();

        if (await option.count() > 0) {

            await option.click();

        } else {

            throw new Error(
                `Expense Type '${expenseType}' not found`
            );

        }

        Logger.success(
            `Expense Type Selected : ${expenseType}`
        );
    }

    async selectExpenseType(
        expenseType: string
    ): Promise<void> {

        await this.selectExpenseTypeBySection(
            expenseType,
            0
        );
    }

    // async selectExpenseType(
    //     expenseType: string
    // ): Promise<void> {

    //     await this.expenseTypeDropdown.selectOption({
    //         label: expenseType
    //     });

    //     Logger.info(
    //         `Expense Type Selected: ${expenseType}`
    //     );
    // }

    async selectPaymentMethod(
        paymentMethod: string
    ): Promise<void> {

        await this.paymentMethodSelection.selectOption({
            label: paymentMethod
        });

        Logger.info(
            `Payment Method Selected: ${paymentMethod}`
        );
    }

    /* ==================== FILE UPLOAD ==================== */

    async uploadReceipt(
        filePath: string
    ): Promise<void> {

        await this.attachReceipt.setInputFiles(
            filePath
        );

        Logger.info(
            `Receipt Uploaded: ${filePath}`
        );
    }

    /* ==================== VALIDATIONS ==================== */

    async verifyTotalExpenseAmount(
        expectedAmount: string
    ): Promise<void> {

        await Assertions.verifyElementVisible(
            this.totalExpenseAmountLabel,
            'Total Expense Amount Label'
        );

        const totalAmountText =
            await this.totalExpenseAmountLabel
                .locator('..')
                .textContent() ?? '';

        Logger.info(`Displayed Total Amount : ${totalAmountText}`);

        // Extract only digits and decimal point
        const actualAmount = Number(
            totalAmountText.replace(/[^\d.]/g, '')
        );

        const expected = Number(expectedAmount);

        expect(actualAmount).toBe(expected);

        Logger.success(
            `Expense Amount Verified. Expected: ${expected}, Actual: ${actualAmount}`
        );
    }

    async submitExpense(): Promise<void> {

        await this.clickElement(
            this.submitButton,
            'Submit Button'
        );

        await this.page.waitForLoadState(
            'networkidle'
        );
    }

    async verifyExpenseSubmittedSuccessfully(): Promise<void> {

        await expect(
            this.successMessage
        ).toBeVisible({
            timeout: 30000
        });

        Logger.success(
            'Expense Submitted Successfully'
        );
    }

        async searchExpense(text: string): Promise<void> {

            Logger.step(`Searching Expense : ${text}`);

            if (await this.searchInput.count() === 0) {
                Logger.warn("Search controls not available.");
                return;
            }

            await this.fillInput(
                this.searchInput,
                text,
                "Expense Search"
            );

            await this.clickElement(
                this.searchButton,
                "Search Button"
            );

            await this.waitForPageLoad();
        }

        // Multple expenses section methods can be added here as needed, following the same pattern.

        async addNewExpenseSection(): Promise<void> {

            Logger.step("Adding another Expense Section");

            await this.clickElement(
                this.addNewExpenseSectionButton,
                "Add New Expense Button"
            );

            await Assertions.verifyElementVisible(

                this.expenseSectionHeading.nth(1),

                "Expense Details #2"

            );

            Logger.success("Expense Details #2 displayed");

        }

        async fillExpenseSection(

            index: number,

            amount: number,

            merchantName: string,

            description: string,

            documentName: string,

            receiptPath: string

        ): Promise<void> {

            Logger.step(`Filling Expense Section ${index + 1}`);

            // Dynamic Locators

            const expenseDate =
                this.page.locator(
                    `#id_details_id_expenses_mstr-${index}-dt_event`
                );

            const clientDropdown =
                this.page.locator(
                    `#id_details_id_expenses_mstr-${index}-id_client`
                );

            const projectDropdown =
                this.page.locator(
                    `#id_details_id_expenses_mstr-${index}-id_project`
                );

            // const expenseTypeDropdown =
            //     this.page.locator(
            //         `#id_details_id_expenses_mstr-${index}-id_exp`
            //     );

            const merchantInput =
                this.page.locator(
                    `#id_details_id_expenses_mstr-${index}-merchant_name`
                );

            const paymentDropdown =
                this.page.locator(
                    `#id_details_id_expenses_mstr-${index}-id_paymentmethod`
                );

            const amountInput =
                this.page.locator(
                    `#id_details_id_expenses_mstr-${index}-user_amt`
                );

            const descriptionInput =
                this.page.locator(
                    `#id_details_id_expenses_mstr-${index}-expense_purpose`
                );

            const documentNameInput =
                this.page.locator(
                    `#id_details_id_expenses_mstr-${index}-receipt`
                );

            const receiptUpload =
                this.page.locator(
                    `input[name="form-${index}-document"]`
                );

            await this.page.evaluate(
                ({ index, date }) => {

                    const element = document.querySelector(
                        `[name="details_id_expenses_mstr-${index}-dt_event"]`
                    ) as HTMLInputElement;

                    if (!element) {
                        throw new Error("Expense Date not found");
                    }

                    element.removeAttribute("readonly");

                    element.value = date;

                    element.dispatchEvent(
                        new Event("input", { bubbles: true })
                    );

                    element.dispatchEvent(
                        new Event("change", { bubbles: true })
                    );

                },
                {
                    index,
                    date: "2026-06-08"
                }
            );

            
            // Wait until client options are loaded
            await expect(async () => {
                const optionCount = await clientDropdown.locator("option").count();
                expect(optionCount).toBeGreaterThan(1);
            }).toPass({
                timeout: 30000,
                intervals: [500]
            });

            // Get first client value
            const clientValue = await clientDropdown
                .locator("option")
                .nth(1)
                .getAttribute("value");

            if (!clientValue) {
                throw new Error("Client not found");
            }

            // Select first client
            await clientDropdown.selectOption(clientValue);


            // Wait until project options are loaded after selecting client
            await expect(async () => {

                const optionCount =
                    await projectDropdown.locator("option").count();

                expect(optionCount).toBeGreaterThan(1);

            }).toPass({
                timeout: 30000,
                intervals: [500]
            });

            // Get first available project
            const projectValue = await projectDropdown
                .locator("option")
                .nth(1)
                .getAttribute("value");

            if (!projectValue) {
                throw new Error("Project not found");
            }

            // Select first project
            await projectDropdown.selectOption(projectValue);

            await this.selectExpenseTypeBySection(
                "Guest House",   // or pass a variable if you want it dynamic
                index
            );

            // await expenseTypeDropdown.selectOption({
            //     label: "Train"
            // });

            await merchantInput.fill(merchantName);

            await paymentDropdown.selectOption({
                label: "UPI"
            });

            await amountInput.fill(amount.toString());

            await descriptionInput.fill(description);

            await documentNameInput.fill(documentName);

            await receiptUpload.setInputFiles(receiptPath);
        }


        async verifyMultipleExpenseTotalAmount(
            amount1: number,
            amount2: number
        ): Promise<void> {

            const expected = amount1 + amount2;

            const totalText =
                await this.totalExpenseAmountLabel
                    .locator("..")
                    .textContent() ?? "";

            const actual =
                Number(totalText.replace(/[^\d.]/g, ""));

            Logger.info(`Expected Total : ${expected}`);
            Logger.info(`Actual Total : ${actual}`);

            expect(actual).toBe(expected);

            Logger.success(
                `Multiple Expense Total Verified Successfully`
            );
        }
}