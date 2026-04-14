import { PublicPage } from "@pages/public/PublicPage";
import { Locator } from "@playwright/test";
import { DashboardTitles } from '@enums/Enums';
import { Logger } from "@utils/logger";


export class IndividualLoginPage extends PublicPage {

get individualDashboardHeader(): Locator {
    return this.getDashboardTitle(DashboardTitles.INDIVIDUAL_DASHBOARD_TITLE);
  }


    /**
   * Perform individual login
   */
  async individualLogin(username: string, password: string): Promise<void> {
    Logger.step('Performing individual login');
    await this.fillInput(this.userNameField, username, 'Username');
    await this.fillInput(this.passwordField, password, 'Password');
    await this.clickElement(this.login, 'Login submit button');
    await this.waitForPageLoad();
    Logger.success('Individual login completed');
  }

}