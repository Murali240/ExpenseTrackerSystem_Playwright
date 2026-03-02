import { SharedComponents } from "@pages/base/SharedComponents";
import { Page,Locator } from "@playwright/test";
import { Logger } from "@utils/logger";
import { DashboardTitles } from '@enums/Enums';

export class StaffLoginPage extends SharedComponents {
    

  /* ==================== Get Dashboard Titles Methods ==================== */
  
     get staffDashboardHeader(): Locator {
      return this.getDashboardTitle(DashboardTitles.STAFF_DASHBOARD_TITLE);
    }

   /**
   * Perform staff login
   */
  async staffLogin(username: string, password: string): Promise<void> {
    Logger.step('Performing staff login');
    await this.fillInput(this.userNameField, username, 'Username');
    await this.fillInput(this.passwordField, password, 'Password');
    await this.clickElement(this.login, 'Login submit button');
    await this.waitForPageLoad();
    Logger.success('Staff login completed');
  }

}