// src/utils/authHelper.ts

import { Page } from '@playwright/test';
import { UserRole } from '../../types';
import { Logger } from '../logger';
import { LoginPage } from '@pages/LoginPage';



/**
 * Authentication Helper
 * Handles login for different user roles with real credentials
 * Used by: AuthFixtures.ts to create authenticated sessions
 */
export async function loginAs(page: Page, role: UserRole): Promise<void> {
  //const publicPage = new PublicPage(page);
   const loginPage = new LoginPage(page)

  try {
    Logger.info(`Attempting login as: ${role}`);

    // Navigate to public page
    await loginPage.goto();

    // Click Login button
    

    switch (role) {
      
      case 'Administrator':
        await loginPage.doLogin(
         process.env.STAFF_USERNAME!,
         process.env.STAFF_PASSWORD!,
          'Administrator'
        );
        break;

      case 'Grantee':
        await loginPage.doLogin(
         process.env.STAFF_USERNAME!,
         process.env.STAFF_PASSWORD!,
          'Administrator'
        );
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
    'URL',
    'USERNAME',
    'PASSWORD',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    Logger.error(`Missing environment variables: ${missingVars.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  Logger.success('✅ All environment variables validated');
}