import { SharedComponents } from '@pages/base/SharedComponents';
import { Page, Locator } from '@playwright/test';
import { Logger } from '@utils/logger';

export class PortalSelectionPage extends SharedComponents {

    /**
 * Portal Selection Page
 * Displays 3 portal options: Staff, Organization, Individual
 */
    readonly staffPortalLoginLink: Locator;
    readonly individualPortalLoginLink: Locator;
    readonly organizationPortalLoginLink: Locator;

    constructor(page: Page) {
        super(page);
        this.staffPortalLoginLink = page.locator('a:has-text("Staff Portal Login")');
        this.individualPortalLoginLink = page.locator('a:has-text("Individual Portal Login")');
        this.organizationPortalLoginLink = page.locator('a:has-text("Organization Portal Login")');
    }

    async clickOnStaffPortalLoginLink(): Promise<void>{
        await this.clickElement(this.staffPortalLoginLink,'Staff Portal Login');
        Logger.success('Clicked on Staff Portal Login link');
    }

    async clickOnOrganizationPortalLoginLink(): Promise<void>{
        await this.clickElement(this.organizationPortalLoginLink,'Organization Portal Login')
        Logger.success('Clicked on Organization Portal Login link')
    }

    async clickOnIndividualPortalLoginLink(): Promise<void>{
        await this.clickElement(this.individualPortalLoginLink,'Individual Portal Login')
        Logger.success('Clicked on Individual Portal Login link')
    }

}