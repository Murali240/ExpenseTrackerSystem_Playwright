import { SharedComponents } from "@pages/base/SharedComponents";
import { Locator } from "@playwright/test";
import { Logger } from "@utils/logger";

export class StaffRegistrationPage extends SharedComponents {

  /* ==================== FORM LOCATORS ==================== */

  get usernameInput(): Locator {
    return this.page.locator('input[name="username"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('input[name="password1"]');
  }

  get confirmPasswordInput(): Locator {
    return this.page.locator('input[name="password2"]');
  }

  get firstNameInput(): Locator {
    return this.page.locator('input[name="first_name"]');
  }

  get lastNameInput(): Locator {
    return this.page.locator('input[name="last_name"]');
  }

  get emailInput(): Locator {
    return this.page.locator('input[name="email"]');
  }

  get mobileNumberInput(): Locator {
    return this.page.locator('input[name="mobilenum"]');
  }

  get submitButton(): Locator {
    return this.page.locator('input[type="submit"]');
  }

  get cancelButton(): Locator {
    return this.page.locator('button:has-text("Cancel")');
  }

  /* ==================== ACTION METHODS ==================== */

  /**
   * Click on register button (from Staff Login Page)
   */
  async clickRegisterButton(portal: string = 'Grantor Portal'): Promise<void> {
    Logger.step(`Performing staff "${portal}" Registration`);
    
    const radioLocator = this.page.locator(`div.portal-option:has(span.portal-option-title:has-text("${portal}"))`);
      
    if (await radioLocator.isVisible({ timeout: 5000 }).catch(() => false)) {
      await radioLocator.click();
    }
    
    await this.clickElement(this.registerButton, `${portal} Register button`);
    await this.waitForPageLoad();
    Logger.success(`Clicked on ${portal} Register button`);
  }

  /**
   * Wait for registration form to load
   */
  async waitForRegistrationForm(): Promise<void> {
    Logger.step('Waiting for registration form to load');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    Logger.success('Registration form loaded');
  }

  /**
   * Fill username field
   */
  async fillUsername(username: string): Promise<void> {
    Logger.step(`Filling username: ${username}`);
    await this.fillInput(this.usernameInput, username, 'Username');
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    Logger.step(`Filling password`);
    await this.fillInput(this.passwordInput, password, 'Password');
  }

  /**
   * Fill confirm password field
   */
  async fillConfirmPassword(password: string): Promise<void> {
    Logger.step(`Filling confirm password`);
    await this.fillInput(this.confirmPasswordInput, password, 'Confirm Password');
  }

  /**
   * Fill first name field
   */
  async fillFirstName(firstName: string): Promise<void> {
    Logger.step(`Filling first name: ${firstName}`);
    await this.fillInput(this.firstNameInput, firstName, 'First Name');
  }

  /**
   * Fill last name field
   */
  async fillLastName(lastName: string): Promise<void> {
    Logger.step(`Filling last name: ${lastName}`);
    await this.fillInput(this.lastNameInput, lastName, 'Last Name');
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    Logger.step(`Filling email: ${email}`);
    await this.fillInput(this.emailInput, email, 'Email');
  }

  /**
   * Fill mobile number field
   */
  async fillMobileNumber(mobileNumber: string): Promise<void> {
    Logger.step(`Filling mobile number: ${mobileNumber}`);
    await this.fillInput(this.mobileNumberInput, mobileNumber, 'Mobile Number');
  }

  /**
   * Fill entire registration form with provided data
   */
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

  /**
   * Submit registration form
   */
  async submitRegistration(): Promise<void> {
    Logger.step('Submitting registration form');
    await this.clickElement(this.submitButton, 'Submit button');
    await this.waitForPageLoad();
    Logger.success('Registration form submitted');
  }

  /**
   * Cancel registration
   */
  async cancelRegistration(): Promise<void> {
    Logger.step('Cancelling registration');
    await this.clickElement(this.cancelButton, 'Cancel button');
    Logger.success('Registration cancelled');
  }
}