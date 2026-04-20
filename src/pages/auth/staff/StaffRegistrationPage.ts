/**
 * StaffRegistrationPage
 *
 * PATTERN: readonly locator + constructor  ← consistent with the whole framework
 * Previously used getter pattern (get usernameInput()). Fixed here.
 */

import { SharedComponents } from '@pages/base/SharedComponents';
import { Page, Locator } from '@playwright/test';
import { Logger } from '@utils/logger';

export class StaffRegistrationPage extends SharedComponents {

  /* ==================== FORM LOCATORS ==================== */

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput        = page.locator('input[name="username"]');
    this.passwordInput        = page.locator('input[name="password1"]');
    this.confirmPasswordInput = page.locator('input[name="password2"]');
    this.firstNameInput       = page.locator('input[name="first_name"]');
    this.lastNameInput        = page.locator('input[name="last_name"]');
    this.emailInput           = page.locator('input[name="email"]');
    this.mobileNumberInput    = page.locator('input[name="mobilenum"]');
    this.submitButton         = page.locator('input[type="submit"]');
    this.cancelButton         = page.locator('button:has-text("Cancel")');
  }

  /* ==================== ACTION METHODS ==================== */

  /** Wait for registration form to be visible */
  async waitForRegistrationForm(): Promise<void> {
    Logger.step('Waiting for registration form to load');
    await this.waitForElement(this.usernameInput);
    Logger.success('Registration form loaded');
  }

  /** Fill username */
  async fillUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username, 'Username');
  }

  /** Fill password */
  async fillPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password, 'Password');
  }

  /** Fill confirm password */
  async fillConfirmPassword(password: string): Promise<void> {
    await this.fillInput(this.confirmPasswordInput, password, 'Confirm Password');
  }

  /** Fill first name */
  async fillFirstName(firstName: string): Promise<void> {
    await this.fillInput(this.firstNameInput, firstName, 'First Name');
  }

  /** Fill last name */
  async fillLastName(lastName: string): Promise<void> {
    await this.fillInput(this.lastNameInput, lastName, 'Last Name');
  }

  /** Fill email */
  async fillEmail(email: string): Promise<void> {
    await this.fillInput(this.emailInput, email, 'Email');
  }

  /** Fill mobile number */
  async fillMobileNumber(mobileNumber: string): Promise<void> {
    await this.fillInput(this.mobileNumberInput, mobileNumber, 'Mobile Number');
  }

  /** Fill the entire form at once */
  async fillRegistrationForm(staffData: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
  }): Promise<void> {
    Logger.step('Filling complete registration form');
    await this.fillUsername(staffData.username);
    await this.fillPassword(staffData.password);
    await this.fillConfirmPassword(staffData.password);
    await this.fillFirstName(staffData.firstName);
    await this.fillLastName(staffData.lastName);
    await this.fillEmail(staffData.email);
    await this.fillMobileNumber(staffData.mobileNumber);
    Logger.success('Registration form filled successfully');
  }

  /** Submit the form */
  async submitRegistration(): Promise<void> {
    Logger.step('Submitting registration form');
    await this.clickElement(this.submitButton, 'Submit button');
    await this.waitForPageLoad();
    Logger.success('Registration form submitted');
  }

  /** Cancel and go back */
  async cancelRegistration(): Promise<void> {
    Logger.step('Cancelling registration');
    await this.clickElement(this.cancelButton, 'Cancel button');
    Logger.success('Registration cancelled');
  }
}