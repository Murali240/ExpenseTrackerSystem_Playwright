import { PublicPage } from "@pages/public/PublicPage";
import { Locator, Page } from "@playwright/test";
import { DashboardHeaders } from '@enums/Enums';
import { Logger } from "@utils/logger";


export class IndividualLoginPage extends PublicPage {



    readonly individualDashboardHeader: Locator;
  
    constructor(page: Page) {
      super(page);
      this.individualDashboardHeader = this.page.locator('text="Individual User - Applicant Portal"').first();
    }



    /**
   * Perform individual login
   */
  async individualLogin(username: string, password: string): Promise<void> {
    Logger.step('Performing individual login');
    await this.fillInput(this.userNameField, username, 'Username');
    await this.fillInput(this.passwordField, password, 'Password');
    await this.clickElement(this.loginButton, 'Login submit button');
    await this.waitForPageLoad();
    Logger.success('Individual login completed');
  }


    async verifyIndividualSuccessfulLogin(): Promise<void> {
    Logger.step('Verifying successful organization login');
    await this.page.waitForURL('**/dashboard', { timeout: 30000 });
    await this.verifyElementVisible(this.individualDashboardHeader, 'Dashboard header');
    await this.verifyElementText(
      this.individualDashboardHeader,DashboardHeaders.INDIVIDUAL_DASHBOARD_HEADER,
      'Dashboard title'
    );
    Logger.success('Verified successful Individual login');
  }
}