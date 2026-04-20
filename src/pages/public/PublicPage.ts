import { SharedComponents } from "@pages/base/SharedComponents";
import { Page, Locator } from "@playwright/test";
import { Logger } from "@utils/logger";

/**
 * Public Page (Homepage)
 * Handles public homepage interactions before authentication
 */

export class PublicPage extends SharedComponents {

    // Locators
    readonly staffLoginButton: Locator;

    readonly organizationRadio: Locator;
    readonly individualRadio: Locator;
    
    
    // Login-related locators (moved from SharedComponents)
    readonly userNameField: Locator;
    readonly passwordField: Locator;
    readonly organizationDropDown: Locator;
    readonly forgotPasswordLink: Locator;
    readonly loginButton: Locator;
    readonly registerButton: Locator;
    
    readonly loginPortalHeader: Locator;
  

    constructor(page :Page){
        
      super(page);
        
        this.staffLoginButton = page.locator('*:has-text("Staff Login")').last();
        this.organizationRadio = page.locator('label.toggle-option:has-text("ORGANIZATION")')
        this.individualRadio = page.locator('label.toggle-option:has-text("INDIVIDUAL")')
        this.loginButton = page.locator('button:has-text("LOGIN"):visible');
        
        // Initialize login locators
        this.userNameField = page.locator('input[placeholder="Username"]:visible');
        this.passwordField = page.locator('input[placeholder="Enter your password"]:visible');
        this.organizationDropDown = page.locator('#id_org');
        this.forgotPasswordLink = page.locator('');
        this.registerButton = page.locator('button:has-text("Register"):visible');
        this.loginPortalHeader = page.locator('.login100-form-title-1');
       

    }


     /* ==================== Navigation ==================== */

     async goto() : Promise<void> { //When a function is marked async, it always returns a Promise.
      await this.navigateTo('/pages/public');
      Logger.success('on pulic homepage')
     }



    /* ==================== Action ==================== */

    async clickOnStaffLogin():Promise<void>{
      await this.clickElement(this.staffLoginButton,'Staff Login button')
      Logger.success('Clicked Staff Login button')
     }


    /* ==================== Login Action ==================== */


     async selectIndividualLoginOption(): Promise<void> {
       Logger.info('Selecting INDIVIDUAL radio button');
       await this.clickElement(this.individualRadio, 'INDIVIDUAL radio button');
       Logger.success('Selected INDIVIDUAL option');
     }
     
     async selectOrganizationLoginOption(): Promise<void> {
       Logger.info('Selecting ORGANIZATION radio button');
       await this.clickElement(this.organizationRadio, 'ORGANIZATION radio button');
       Logger.success('Selected ORGANIZATION option');
     }

     async navigateToOrganizationLogin(): Promise<void> {
       await this.selectOrganizationLoginOption();
       Logger.success('Navigated to Organization Login');
     }

     async navigateToIndividualLogin(): Promise<void> {
      await this.selectIndividualLoginOption();
      Logger.success('Navigated to Individual Login')
     }

     async clickOnLogin():Promise<void>{
      await this.clickElement(this.loginButton,'Login button')
      Logger.success('Clicked Login button')
     }


/* ==================== Registrataion Actions ==================== */

     async clickRegister(): Promise<void> {
       Logger.info('Clicking Register button');
       await this.clickElement(this.registerButton, 'Register button');
       Logger.success('Clicked Register button');
     }
     

     // Combined method for navigation to registration
     async navigateToOrganizationRegistration(): Promise<void> {
      // await this.selectOrganizationLoginOption();
       await this.clickRegister();
       Logger.success('Navigated to Organization Registration Page');
     }
    
     async navigateToIndividualRegistratoin(): Promise<void> {
     // await this.selectIndividualLoginOption();
      await this.clickRegister();
      Logger.success('Navigated to Individual Registration Page');
     }
}