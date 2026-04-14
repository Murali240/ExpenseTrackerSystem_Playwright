import { PublicPage } from "@pages/public/PublicPage";
import { Logger } from "@utils/logger";

export class OrganizationRegistrationPage extends PublicPage{

    /**
       * Click on Org register button 
       */
      async clickRegisterButton(portal: string = 'Grantor Portal'): Promise<void> {
        Logger.step(`Performing staff "${portal}" Registration`);
        
        const radioLocator = this.page.locator(`div.portal-option:has(span.portal-option-title:has-text("${portal}"))`);
          
        if (await radioLocator.isVisible({ timeout: 5000 }).catch(() => false)) {
          await radioLocator.click();
        }
        
        await this.clickElement(this.registerButton, `${portal} Register button`);
        await this.waitForPageLoad();
        Logger.success(`Clicked on ${portal} Register button`);
      }
}