import { Page } from '@playwright/test';
import { ExpenseManagementPage } from '@pages/ExpenseManagementPage';
import { Logger } from '@utils/logger';
import { Assertions } from '@utils/assertions';
import { EmployeeExpenseData } from '@types';

export class EmployeeExpensePage extends ExpenseManagementPage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToSubmittedExpenses(): Promise<void> {
    Logger.step('Navigating To Submitted Expenses');
    await this.clickElement(this.expenseManagementMenu, 'Expense Management Menu');
    await this.clickElement(this.submittedExpensesSubMenu, 'Submitted Expenses Sub Menu');
    await this.waitForPageLoad();
    await Assertions.verifyElementVisible(this.addNewExpenseButton, 'Add New Expense Button', 15000);
  }

  async clickAddNewExpense(): Promise<void> {
    Logger.step('Click Add New Expense');
    await this.clickElement(this.addNewExpenseButton, 'Add New Expense Button');
    await this.waitForPageLoad();
  }

  async fillExpenseTitle(title: string): Promise<void> {
    await this.fillInput(this.expenseTitleInputField, title, 'Expense Title');
  }

  async selectFromDate(dateIso: string): Promise<void> {
    Logger.info('Setting From Date');
    await this.page.evaluate((value) => {
      const element = document.querySelector('[name="start_date"]') as HTMLInputElement | null;
      if (!element) return;
      element.removeAttribute('readonly');
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }, dateIso);
  }

  async selectToDate(dateIso: string): Promise<void> {
    Logger.info('Setting To Date');
    await this.page.evaluate((value) => {
      const element = document.querySelector('[name="end_date"]') as HTMLInputElement | null;
      if (!element) return;
      element.removeAttribute('readonly');
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }, dateIso);
  }

  async selectExpenseDate(dateIso: string): Promise<void> {
    Logger.info('Setting Expense Date');
    await this.page.evaluate((value) => {
      const element = document.querySelector('[name="details_id_expenses_mstr-0-dt_event"]') as HTMLInputElement | null;
      if (!element) return;
      element.removeAttribute('readonly');
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }, dateIso);
  }

  async selectFirstClient(): Promise<void> {
    await super.selectFirstClient();
  }

  async selectFirstProject(): Promise<void> {
    await super.selectFirstProject();
  }

  async selectExpenseType(type?: string): Promise<void> {
    await super.selectExpenseType(type || 'Air Fare');
  }

  async fillMerchantName(name: string): Promise<void> {
    await this.fillInput(this.merchantNameInputField, name, 'Merchant Name');
  }

  async selectPaymentMethod(method: string): Promise<void> {
    await super.selectPaymentMethod(method);
  }

  async fillExpenseAmount(amount: string): Promise<void> {
    await this.fillInput(this.expenseAmountInputField, amount, 'Expense Amount');
  }

  async fillExpenseDescription(desc: string): Promise<void> {
    await this.fillInput(this.expenseDescriptionTextAreaBox, desc, 'Expense Description');
  }

  async fillDocumentName(name: string): Promise<void> {
    await this.fillInput(this.documentNameInputField, name, 'Document Name');
  }

  async uploadReceipt(filePath: string): Promise<void> {
    Logger.step(`Uploading receipt: ${filePath}`);
    await this.attachReceipt.setInputFiles(filePath);
    Logger.info('Receipt uploaded');
  }

  async verifyTotalExpenseAmount(expected: string): Promise<void> {
    await super.verifyTotalExpenseAmount(expected);
  }

  async submitExpense(): Promise<void> {
    Logger.step('Submitting expense');
    await this.clickElement(this.submitButton, 'Submit Expense');
    await this.page.waitForLoadState('networkidle');
    await this.verifyExpenseSubmittedSuccessfully();
  }


  async searchExpense(title: string): Promise<void> {

      Logger.step(`Searching Expense : ${title}`);

      const expenseTitleSearch = this.page.locator(
          'input[placeholder="Expense Title"]'
      );

      await expenseTitleSearch.fill(title);

      await this.page.keyboard.press("Enter");

      await this.waitForPageLoad();
  }

  async verifyExpenseCreated(title: string): Promise<void> {
    Logger.step(`Verifying expense exists in list: ${title}`);
    const row = this.page.locator(`tr:has-text("${title}")`).first();
    await row.waitFor({ state: 'visible', timeout: 30000 });
    await Assertions.verifyElementVisible(row, `Expense row ${title}`);
  }

  async verifyExpenseStatus(
      title: string,
      expectedStatus: string
  ): Promise<void> {

      Logger.step(`Verifying '${expectedStatus}' status for expense : ${title}`);

      // Find row using Expense Title
      const row = this.page
          .locator("table tbody tr")
          .filter({
              has: this.page.locator(`text="${title}"`)
          })
          .first();

      await row.waitFor({
          state: "visible",
          timeout: 30000
      });

      // Status badge is in last column
      const statusBadge = row
          .locator("td")
          .last()
          .locator("span");

      await Assertions.verifyElementVisible(
          statusBadge,
          "Expense Status Badge"
      );

      const actualStatus =
          (await statusBadge.textContent())?.trim();

      Logger.info(`Expected Status : ${expectedStatus}`);
      Logger.info(`Actual Status   : ${actualStatus}`);

      if (actualStatus !== expectedStatus) {

          throw new Error(
              `Expected '${expectedStatus}' but found '${actualStatus}'`
          );

      }

      Logger.success(
          `Expense status verified successfully as '${expectedStatus}'`
      );
  }

  async createExpense(data: EmployeeExpenseData): Promise<void> {
    await this.fillExpenseTitle(data.title);
    await this.selectFromDate(data.fromDate);
    await this.selectToDate(data.toDate);
    await this.selectExpenseDate(data.expenseDate);
    await this.selectFirstClient();
    await this.selectFirstProject();
    await this.selectExpenseType(data.paymentMethod ? undefined : 'Air Fare');
    await this.fillMerchantName(data.merchantName);
    await this.selectPaymentMethod(data.paymentMethod || 'UPI');
    await this.fillExpenseAmount(data.expenseAmount);
    await this.fillExpenseDescription(data.expenseDescription);
    await this.fillDocumentName(data.documentName);
    if (data.receiptFilePath) await this.uploadReceipt(data.receiptFilePath);
    await this.verifyTotalExpenseAmount(data.expenseAmount);
    await this.submitExpense();
  }

  async enterExpenseAmount(amount: string): Promise<void> {
    await this.fillExpenseAmount(amount);
  }

  async enterExpenseDescription(desc: string): Promise<void> {
    await this.fillExpenseDescription(desc);
  }

  async enterDocumentName(name: string): Promise<void> {
    await this.fillDocumentName(name);
  }

  async verifyExpenseSubmitted(): Promise<void> {
    await this.verifyExpenseSubmittedSuccessfully();
  }
}
