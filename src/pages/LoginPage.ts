import { SharedComponents } from "@pages/base/SharedComponents";
import { Locator, Page } from "@playwright/test";
import { Logger } from "@utils/logger";


export class LoginPage extends SharedComponents {
    
    
    readonly userNameField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly dashboardHeader: Locator;
    readonly loginErrorMessage: Locator;
    

    constructor(page: Page){
      super(page)

      this.userNameField = this.page.locator(`[name="username"]`);
      this.passwordField = this.page.locator(`[name="password"]`);
      this.loginButton = this.page.locator('button[type="submit"]');

      this.dashboardHeader = this.page.locator(`//span[normalize-space()='Dashboard']`);
      this.loginErrorMessage = this.page.locator(`strong:has-text("Username or Password Incorrect")`);

    }


      /* ==================== Navigation ==================== */

     async goto() : Promise<void> { //When a function is marked async, it always returns a Promise.
      await this.navigateTo('/accounts/login');
      Logger.success('on login page')
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