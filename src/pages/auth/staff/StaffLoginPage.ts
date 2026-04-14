import { PublicPage } from "@pages/public/PublicPage";
import { Locator, Page } from "@playwright/test";
import { Logger } from "@utils/logger";
import { DashboardTitles } from '@enums/Enums';

export class StaffLoginPage extends PublicPage {
    
    
    readonly grantorRadioButton: Locator;
    readonly granteeRadioButton: Locator;


    constructor(page: Page){
      super(page)

      this.grantorRadioButton = this.page.locator(`div.portal-option:has(span.portal-option-title:has-text("Grantor Portal"))`);
      this.granteeRadioButton = this.page.locator(`div.portal-option:has(span.portal-option-title:has-text("Grantee Portal"))`);
    }



    async selectGrantorPortalOption(): Promise<void> {
      await this.clickElement(this.grantorRadioButton, 'Grantor Portal Option')
      Logger.info('Selected Grantor Portal Option')
    }


    async selectGranteePortalOption(): Promise<void> {
      await this.clickElement(this.grantorRadioButton, 'Grantee Portal Option')
      Logger.info('Selected Grantee Portal Option')
    }



  async doGrantorLogin(username: string, password: string): Promise<void> {
    Logger.step(`Performing staff Grantor login`);
    await this.fillInput(this.userNameField, username, 'Username');
    await this.fillInput(this.passwordField, password, 'Password');
    await this.clickElement(this.loginButton, 'Login submit button');
    await this.waitForPageLoad();
    Logger.success('Grantor login completed');
  }


  async doGranteeLogin(username: string, password: string): Promise<void> {
    Logger.step(`Performing staff Grantee login`);
    await this.fillInput(this.userNameField, username, 'Username');
    await this.fillInput(this.passwordField, password, 'Password');
    await this.clickElement(this.loginButton, 'Login submit button');
    await this.waitForPageLoad();
    Logger.success('Grantee login completed');
  }














  /* ==================== Get Dashboard Titles Methods ==================== */
  
     get staffGrantorDashboardHeader(): Locator {
      return this.getDashboardTitle(DashboardTitles.STAFF_GRANTOR_DASHBOARD_TITLE);
    }

    get staffGranteeDashboardHeader(): Locator {
      return this.getDashboardTitle(DashboardTitles.STAFF_GRANTEE_DASHBOARD_TITLE);
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