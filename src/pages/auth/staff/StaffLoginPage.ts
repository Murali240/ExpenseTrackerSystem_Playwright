import { SharedComponents } from "@pages/base/SharedComponents";
import { Locator } from "@playwright/test";
import { Logger } from "@utils/logger";
import { DashboardTitles } from '@enums/Enums';

export class StaffLoginPage extends SharedComponents {
    

  /* ==================== Get Dashboard Titles Methods ==================== */
  
     get staffGrantorDashboardHeader(): Locator {
      return this.getDashboardTitle(DashboardTitles.STAFF_GRANTOR_DASHBOARD_TITLE);
    }

    get staffGranteeDashboardHeader(): Locator {
      return this.getDashboardTitle(DashboardTitles.STAFF_GRANTEE_DASHBOARD_TITLE);
    }

   /**
   * Perform staff login
   */
  async staffLogin(username: string, password: string, portal: string = 'Grantor Portal'): Promise<void> {
    Logger.step(`Performing staff "${portal}" login`);
  const radioLocator = this.page.locator(`div.portal-option:has(span.portal-option-title:has-text("${portal}"))`
);
    if (await radioLocator.isVisible({ timeout: 5000 }).catch(() => false)) {
        await radioLocator.click();
    }
    await this.fillInput(this.userNameField, username, 'Username');
    await this.fillInput(this.passwordField, password, 'Password');
    await this.clickElement(this.login, 'Login submit button');
    await this.waitForPageLoad();
    Logger.success('Staff login completed');
  }

/**
 * Click on staff registration
 */

 async clickRegisterButton(portal: string = 'Grantor Portal'): Promise<void> {
   
  Logger.step(`Performing staff "${portal}" Registration`);
  
  const radioLocator = this.page.locator(`div.portal-option:has(span.portal-option-title:has-text("${portal}"))`);
    
  if (await radioLocator.isVisible({ timeout: 5000 }).catch(() => false)) {
        await radioLocator.click();
    }
    await this.clickElement(this.registerButton,`${portal} Register button`);
    await this.waitForPageLoad();
    Logger.success(`Clicked on ${portal} Register button`);
  }
}