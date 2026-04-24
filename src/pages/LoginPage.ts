import { PublicPage } from "@pages/public/PublicPage";
import { Locator, Page } from "@playwright/test";
import { Logger } from "@utils/logger";


export class LoginPage extends PublicPage {
    
    
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


      /* ==================== Navigation ==================== */

     async goto() : Promise<void> { //When a function is marked async, it always returns a Promise.
      await this.navigateTo('/pages/public');
      Logger.success('on pulic homepage')
     }


async doLogin(
  username: string,
  password: string,
  role: string = 'Administrator'
): Promise<void> {

  Logger.step(`Performing ${role} login`);

  if (role === 'Administrator') {
    Logger.step(`Performing login`);
    await this.fillInput(this.userNameField, username, 'Username');
    await this.fillInput(this.passwordField, password, 'Password');
    await this.clickElement(this.loginButton, 'Login submit button');
    await this.waitForPageLoad();
    Logger.success('login completed');
    

  } else if (role === 'Grantee') {
    Logger.step(`Performing login`);
    await this.fillInput(this.userNameField, username, 'Username');
    await this.fillInput(this.passwordField, password, 'Password');
    await this.clickElement(this.loginButton, 'Login submit button');
    await this.waitForPageLoad();
    Logger.success('login completed');
   
  } else {
    throw new Error(`Invalid role provided: ${role}`);
  }

  Logger.success(`${role} login completed successfully`);
}

}