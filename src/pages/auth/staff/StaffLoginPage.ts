import { PublicPage } from "@pages/public/PublicPage";
import { Locator, Page } from "@playwright/test";
import { Logger } from "@utils/logger";
import { DashboardHeaders } from '@enums/Enums';

export class StaffLoginPage extends PublicPage {
    
    
    readonly grantorRadioButton: Locator;
    readonly granteeRadioButton: Locator;
    readonly grantorDashboardHeader: Locator;
    readonly granteeDashboardHeader: Locator;
    

    constructor(page: Page){
      super(page)

      this.grantorRadioButton = this.page.locator(`div.portal-option:has(span.portal-option-title:has-text("Grantor Portal"))`);
      this.granteeRadioButton = this.page.locator(`div.portal-option:has(span.portal-option-title:has-text("Grantee Portal"))`);
      
      this.grantorDashboardHeader = this.page.locator('.top-title.d-display .header-subtitle:has-text("Staff User - Grantor Portal")').first();
      this.granteeDashboardHeader = this.page.locator('.top-title.d-display .header-subtitle:has-text("Staff User - Grantee Portal")').first();
 
    }



    async selectGrantorPortalOption(): Promise<void> {
      await this.clickElement(this.grantorRadioButton, 'Grantor Portal Option')
      Logger.info('Selected Grantor Portal Option')
    }


    async selectGranteePortalOption(): Promise<void> {
      await this.clickElement(this.granteeRadioButton, 'Grantee Portal Option')
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

async doStaffLogin(
  username: string,
  password: string,
  staffRole: string = 'Grantor'
): Promise<void> {

  Logger.step(`Performing ${staffRole} login`);

  if (staffRole === 'Grantor') {

    await this.selectGrantorPortalOption();
    await this.doGrantorLogin(username, password);

  } else if (staffRole === 'Grantee') {
    await this.selectGranteePortalOption();
    await this.doGranteeLogin(username, password);

  } else {
    throw new Error(`Invalid staff role provided: ${staffRole}`);
  }

  Logger.success(`${staffRole} login completed successfully`);
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