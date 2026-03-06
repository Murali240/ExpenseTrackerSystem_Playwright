// src/pages/auth/organization/OrganizationLoginPage.ts

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

  /**
   * Wait for organization dropdown to load options and select
   */
  async selectOrganization(organizationName: string): Promise<void> {
    Logger.info(`Selecting organization: ${organizationName}`);
    
    // ✅ Wait for dropdown to be visible
    await this.organizationDropDown.waitFor({ 
      state: 'visible',
      timeout: 10000 
    });
    
    // ✅ Wait for options to load (more than just "--Select--")
    Logger.info('Waiting for organization options to load');
    await this.page.waitForFunction(
      () => {
        const dropdown = document.querySelector('#id_org') as HTMLSelectElement;
        if (!dropdown) return false;
        
        // Check if dropdown has more than just the placeholder
        const hasOptions = dropdown.options.length > 1;
        console.log('Dropdown options count:', dropdown.options.length);
        return hasOptions;
      },
      { timeout: 15000 }
    );
    
    // ✅ Log available options for debugging
    const options = await this.organizationDropDown.locator('option').allTextContents();
    Logger.info(`Available organizations: ${options.join(', ')}`);
    
    // ✅ Wait for the specific option to be available
    await this.organizationDropDown.locator(`option:has-text("${organizationName}")`).waitFor({ 
      state: 'attached',
      timeout: 10000 
    });
    
    Logger.info(`Organization option '${organizationName}' is available`);
    
    // ✅ Select the organization by label
    await this.organizationDropDown.selectOption({ label: organizationName });
    
    // ✅ Wait for any onChange handlers to complete
    await this.page.waitForTimeout(500);
    
    Logger.success(`✅ Selected organization: ${organizationName}`);
  }

  /**
   * Perform organization login with AJAX-loaded dropdown support
   */
  async organizationLogin(username: string, password: string, organization: string): Promise<void> {
    Logger.step('Performing organization login');
    
    // ✅ Click on username field
    await this.userNameField.click();
    
    // ✅ Clear any existing value
    await this.userNameField.clear();
    
    // ✅ Type username character-by-character to trigger keyup events
    Logger.info(`Typing username: ${username}`);
    await this.userNameField.type(username, { delay: 100 }); // 100ms delay between characters
    
    // ✅ Wait for AJAX call to complete and dropdown to populate
    Logger.info('Waiting for organization dropdown to load via AJAX');
    await this.page.waitForTimeout(2000); // Give AJAX time to complete
    
    // ✅ Verify dropdown has loaded
    const optionCount = await this.organizationDropDown.locator('option').count();
    Logger.info(`Organization dropdown has ${optionCount} options`);
    
    if (optionCount <= 1) {
      Logger.warn('⚠️  Dropdown not loaded yet, waiting longer...');
      await this.page.waitForTimeout(2000);
    }
    
    // ✅ Fill password
    Logger.info(`Filling password`);
    await this.fillInput(this.passwordField, password, 'Password');
    
    // ✅ Select organization
    await this.selectOrganization(organization);
    
    // ✅ Click login button
    await this.clickElement(this.login, 'Login submit button');
    await this.waitForPageLoad();
    
    Logger.success('✅ Organization login completed');
  }
}