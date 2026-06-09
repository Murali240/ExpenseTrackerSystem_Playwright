import { SharedComponents } from "@pages/base/SharedComponents";
import { Locator, Page } from "@playwright/test";
import { Logger } from "@utils/logger";
import { Assertions } from "@utils/assertions";
import { UserRole } from "../types";

export class LoginPage extends SharedComponents {
    
  readonly signinMMMHeading: Locator;
  readonly userNameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  readonly dashboardHeader: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.signinMMMHeading = this.page.getByRole('heading', {
      name: /Sign in to Meeting Minutes Manager/i
    });

    this.userNameField = this.page.locator(`[name="username"]`);
    this.passwordField = this.page.locator(`[name="password"]`);
    this.loginButton = this.page.locator('button[type="submit"]');

    this.dashboardHeader = this.page.locator(`//span[normalize-space()='Dashboard']`);
    this.loginErrorMessage = this.page.locator(`strong:has-text("Username or Password Incorrect")`);
  }

  /* ==================== Navigation ==================== */

  async goto(): Promise<void> {
    await this.navigateTo('/accounts/login');

    await Assertions.verifyElementVisible(
      this.signinMMMHeading,
      'Login page heading'
    );

    Logger.success('On Login Page & heading is visible');
  }

  /* ==================== Actions ==================== */

  async doLogin(
    username: string,
    password: string,
    role: UserRole = 'Administrator'
  ): Promise<void> {

    Logger.step(`🔐 Performing ${role} login`);

    // Ensure page is ready
    await Assertions.verifyElementVisible(
      this.signinMMMHeading,
      'Login page heading'
    );

    await this.fillInput(this.userNameField, username, 'Username');
    await this.fillInput(this.passwordField, password, 'Password');
    await this.clickElement(this.loginButton, 'Login button');

    await this.waitForPageLoad();

    Logger.success(`✅ ${role} login completed successfully`);
  }
}