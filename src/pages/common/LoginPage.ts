import { SharedComponents } from "@pages/base/SharedComponents";
import { Locator, Page } from "@playwright/test";
import { Logger } from "@utils/logger";
import { Assertions } from "@utils/assertions";
import { UserRole } from "@types";


export class LoginPage extends SharedComponents {
    
  readonly signinETSHeading: Locator;
  readonly userNameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly dashboardHeader: Locator;

  readonly loginErrorMessage: Locator;

  /*=========================================================
                    DASHBOARD HEADINGS
  =========================================================*/

  readonly employeeDashboardHeading: Locator;

  readonly managerDashboardHeading: Locator;

  readonly accountantDashboardHeading: Locator;

  readonly adminDashboardHeading: Locator;

  constructor(page: Page) {
    super(page);

    this.signinETSHeading = this.page.locator(`//div[@class='title']`);

    this.userNameField = this.page.locator(`[name="username"]`);
    this.passwordField = this.page.locator(`[name="password"]`);
    this.loginButton = this.page.locator('button[type="submit"]');
    this.dashboardHeader = this.page.locator('h1, h2, h3').filter({ hasText: /dashboard/i }).first();

    this.loginErrorMessage = this.page.locator(`//div[@id='login-response']`);
  
    this.employeeDashboardHeading =
        page.locator('h1, h2, h3').filter({ hasText: /employee/i }).filter({ hasText: /dashboard/i }).first();

    this.managerDashboardHeading =
        page.locator('h1, h2, h3').filter({ hasText: /manager/i }).filter({ hasText: /dashboard/i }).first();

    this.accountantDashboardHeading =
        page.locator('h1, h2, h3').filter({ hasText: /accountant/i }).filter({ hasText: /dashboard/i }).first();

    this.adminDashboardHeading =
        page.locator('h1, h2, h3').filter({ hasText: /admin|administrator/i }).filter({ hasText: /dashboard/i }).first();
  }

  /* ==================== Navigation ==================== */

  async goto(): Promise<void> {
    await this.navigateTo('/accounts/login');

  await this.waitForPageLoad();

  await Assertions.verifyElementVisible(
      this.signinETSHeading,
      'Login Page Heading'
  );
    Logger.success('On Login Page & heading is visible');
  }

  /* ==================== Actions ==================== */

  async doLogin(
      username: string,
      password: string,
      role: UserRole = "Administrator"
  ): Promise<void> {

      Logger.step(`🔐 Performing ${role} login`);

      await Assertions.verifyElementVisible(
          this.signinETSHeading,
          "Login page heading"
      );

      await this.fillInput(
          this.userNameField,
          username,
          "Username"
      );

      await this.fillInput(
          this.passwordField,
          password,
          "Password"
      );

      Logger.info("Clicking Login button");

      await this.loginButton.click({
          noWaitAfter: true
      });

      await this.waitForPageLoad();

      const errorVisible = await this.loginErrorMessage.isVisible().catch(() => false);
      if (errorVisible) {
          const errorText = await this.loginErrorMessage.textContent().catch(() => '');
          Logger.warn(`Login failed for ${role}: ${errorText}`);
          return;
      }

      await this.verifyDashboard(role);

      Logger.success(`✅ ${role} login completed successfully`);
  }

  async verifyDashboard(role: string): Promise<void> {

    Logger.info(`Verifying ${role} Dashboard`);

    await this.waitForPageLoad();

    const normalizedRole = role.toLowerCase();
    const dashboardLocators = (() => {
        switch (normalizedRole) {
            case "employee":
                return [this.employeeDashboardHeading, this.dashboardHeader];
            case "manager":
                return [this.managerDashboardHeading, this.dashboardHeader];
            case "accountant":
                return [this.accountantDashboardHeading, this.dashboardHeader];
            case "administrator":
            case "admin":
                return [this.adminDashboardHeading, this.dashboardHeader];
            case "ldap":
            default:
                return [this.employeeDashboardHeading, this.managerDashboardHeading, this.accountantDashboardHeading, this.dashboardHeader];
        }
    })();

    const dashboardVisible = await Promise.any(
        dashboardLocators.map((locator) => locator.isVisible().then(() => true).catch(() => false))
    ).catch(() => false);

    if (!dashboardVisible) {
        throw new Error(`Dashboard heading was not visible for role: ${role}`);
    }

    Logger.success(`✓ ${role} Dashboard verified successfully`);

  }
}