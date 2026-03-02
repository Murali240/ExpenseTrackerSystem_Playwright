// src/utils/authHelper.ts

import { Page } from '@playwright/test';
import { PublicPage } from '@pages/public/PublicPage';
import { PortalSelectionPage } from '@pages/public/PortalSelectionPage';
import { UserRole } from '../../types';
import { Logger } from '../logger';
import { StaffLoginPage } from '@pages/auth/staff/StaffLoginPage';
import { OrganizationLoginPage } from '@pages/auth/organization/OrganizationLoginPage';
import { IndividualLoginPage } from '@pages/auth/individual/IndividualLoginPage';


/**
 * Authentication Helper
 * Handles login for different user roles with real credentials
 * Used by: AuthFixtures.ts to create authenticated sessions
 */
export async function loginAs(page: Page, role: UserRole): Promise<void> {
  const publicPage = new PublicPage(page);
  const portalSelectionPage = new PortalSelectionPage(page);

  try {
    Logger.info(`Attempting login as: ${role}`);
    
    // Navigate to public page
    await publicPage.goto();
    
    // Click Login button
    await publicPage.clickOnLogin();

    // Select portal and login based on role
    switch (role) {
      case 'staff':
        const staffLoginPage = new StaffLoginPage(page)

        await portalSelectionPage.clickOnStaffPortalLoginLink();
        await staffLoginPage.staffLogin(
          process.env.STAFF_USERNAME!,
          process.env.STAFF_PASSWORD!
        );
        Logger.success('✅ Staff login successful');
        break;

      case 'Organization':
        const organizationLoginPage = new OrganizationLoginPage(page);

        await portalSelectionPage.clickOnOrganizationPortalLoginLink();
        await organizationLoginPage.organizationLogin(
          process.env.ORG_USERNAME!,
          process.env.ORG_PASSWORD!,
          process.env.ORG_NAME!
        );
        Logger.success('✅ Organization login successful');
        break;

      case 'individual':
        const individualLoginPage = new IndividualLoginPage(page);
        
        await portalSelectionPage.clickOnIndividualPortalLoginLink();
        await individualLoginPage.individualLogin(
          process.env.IND_USERNAME!,
          process.env.IND_PASSWORD!
        );
        Logger.success('✅ Individual login successful');
        break;

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  } catch (error) {
    Logger.error(`❌ Login failed for role: ${role}`, error);
    throw error;
  }
}

/**
 * Validate environment variables
 */
export function validateEnvVariables(): void {
  const requiredVars = [
    'ISSI_GMS_URL',
    'STAFF_USERNAME',
    'STAFF_PASSWORD',
    'ORG_USERNAME',
    'ORG_PASSWORD',
    'ORG_NAME',
    'IND_USERNAME',
    'IND_PASSWORD'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    Logger.error(`Missing environment variables: ${missingVars.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  Logger.success('✅ All environment variables validated');
}