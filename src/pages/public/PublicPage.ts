import { SharedComponents } from "@pages/base/SharedComponents";
import { Page, Locator } from "@playwright/test";
import { Logger } from "@utils/logger";
import { Assertions } from "@utils/assertions";


/**
 * Public Page (Homepage)
 * Handles public homepage interactions before authentication
 */

export class PublicPage extends SharedComponents {

    // Locators
  readonly loginButton: Locator;
  

    constructor(page :Page){
        super(page);

    this.loginButton = page.locator('a:has-text("Login")');
    
    }


     /* ==================== Navigation ==================== */

     async goto() : Promise<void> { //When a function is marked async, it always returns a Promise.
      await this.navigateTo('/pages/public');
      Logger.success('on pulic homepage')
     }



    /* ==================== Action ==================== */

     async clickOnLogin():Promise<void>{
      await this.clickElement(this.loginButton,'Login button')
      Logger.success('Clicked Login button')
     }
    
}