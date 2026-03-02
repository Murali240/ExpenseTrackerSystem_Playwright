import { SharedComponents } from "@pages/base/SharedComponents";
import { Page, Locator } from "@playwright/test";
import { DashboardTitles } from '@enums/Enums';
import { Logger } from "@utils/logger";

export class OrganizationLoginPage extends SharedComponents {

    



  constructor(page: Page) {
    super(page);

   

    
  }

   get organizationDashboardHeader(): Locator {
    return this.getDashboardTitle(DashboardTitles.ORGANIZATION_DASHBOARD_TITLE);
  }

      /* ==================== Organization Login Methods ==================== */
    
      /**
       * Perform organization login
       */
      async organizationLogin(username: string, password: string, organization: string): Promise<void> {
        Logger.step('Performing organization login');
        await this.fillInput(this.userNameField, username, 'Username');
        
        await this.fillInput(this.passwordField, password, 'Password');
        await this.selectOption(this.organizationDropDown, organization, 'Organization');
        await this.clickElement(this.login, 'Login submit button');
        await this.waitForPageLoad();
        Logger.success('Organization login completed');
      }
    
}