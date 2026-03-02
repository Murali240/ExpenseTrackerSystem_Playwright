// src/utils/NavigationHelper.ts

import { Page } from '@playwright/test';
import { PublicPage } from '@pages/public/PublicPage';
import { PortalSelectionPage } from '@pages/public/PortalSelectionPage';
import { Logger } from '@utils/logger';

/**
 * Navigation Helper
 * Handles common navigation flows for authentication pages
 * 
 * Purpose: Reduce fixture clutter in tests by providing reusable navigation methods
 * Used by: Tests (NOT fixtures!)
 * 
 * Examples:
 * - goToStaffRegistration(): Public → Login → Staff Portal → Register
 * - goToStaffLogin(): Public → Login → Staff Portal
 * - goToForgotPassword(): Public → Login → Portal → Forgot Password
 */
export class NavigationHelper {
  private page: Page;
  private publicPage: PublicPage;
  private portalSelectionPage: PortalSelectionPage;

  constructor(page: Page) {
    this.page = page;
    this.publicPage = new PublicPage(page);
    this.portalSelectionPage = new PortalSelectionPage(page);
  }

  /* ==================== REGISTRATION NAVIGATION ==================== */

  /**
   * Navigate to Staff Registration page
   * Flow: Public → Login Button → Staff Portal Link → Register Link
   */
  async goToStaffRegistration(): Promise<void> {
    Logger.info('→ Navigating to Staff Registration');
    await this.publicPage.clickOnLogin();
    await this.portalSelectionPage.clickOnStaffPortalLoginLink();
    
    // Click Register link on Staff Login page
    const registerLink = this.page.locator('a:has-text("Register"), button:has-text("Register")');
    await registerLink.click();
    await this.page.waitForLoadState('networkidle');
    
    Logger.success('✓ On Staff Registration page');
  }

  /**
   * Navigate to Organization Registration page
   * Flow: Public → Login Button → Organization Portal Link → Register Link
   */
  async goToOrgRegistration(): Promise<void> {
    Logger.info('→ Navigating to Organization Registration');
    await this.publicPage.clickOnLogin();
    await this.portalSelectionPage.clickOnOrganizationPortalLoginLink();
    
    // Click Register link on Organization Login page
    const registerLink = this.page.locator('a:has-text("Register"), button:has-text("Register")');
    await registerLink.click();
    await this.page.waitForLoadState('networkidle');
    
    Logger.success('✓ On Organization Registration page');
  }

  /**
   * Navigate to Individual Registration page
   * Flow: Public → Login Button → Individual Portal Link → Register Link
   */
  async goToIndividualRegistration(): Promise<void> {
    Logger.info('→ Navigating to Individual Registration');
    await this.publicPage.clickOnLogin();
    await this.portalSelectionPage.clickOnIndividualPortalLoginLink();
    
    // Click Register link on Individual Login page
    const registerLink = this.page.locator('a:has-text("Register"), button:has-text("Register")');
    await registerLink.click();
    await this.page.waitForLoadState('networkidle');
    
    Logger.success('✓ On Individual Registration page');
  }

  /* ==================== LOGIN NAVIGATION ==================== */

  /**
   * Navigate to Staff Login page
   * Flow: Public → Login Button → Staff Portal Link
   */
  async goToStaffLogin(): Promise<void> {
    Logger.info('→ Navigating to Staff Login');
    await this.publicPage.clickOnLogin();
    await this.portalSelectionPage.clickOnStaffPortalLoginLink();
    Logger.success('✓ On Staff Login page');
  }

  /**
   * Navigate to Organization Login page
   * Flow: Public → Login Button → Organization Portal Link
   */
  async goToOrgLogin(): Promise<void> {
    Logger.info('→ Navigating to Organization Login');
    await this.publicPage.clickOnLogin();
    await this.portalSelectionPage.clickOnOrganizationPortalLoginLink();
    Logger.success('✓ On Organization Login page');
  }

  /**
   * Navigate to Individual Login page
   * Flow: Public → Login Button → Individual Portal Link
   */
  async goToIndividualLogin(): Promise<void> {
    Logger.info('→ Navigating to Individual Login');
    await this.publicPage.clickOnLogin();
    await this.portalSelectionPage.clickOnIndividualPortalLoginLink();
    Logger.success('✓ On Individual Login page');
  }

  /* ==================== FORGOT PASSWORD NAVIGATION ==================== */

  /**
   * Navigate to Forgot Password page for any portal
   * Flow: Public → Login Button → Portal Link → Forgot Password Link
   * 
   * @param portal - 'staff' | 'organization' | 'individual'
   */
  async goToForgotPassword(portal: 'staff' | 'organization' | 'individual'): Promise<void> {
    Logger.info(`→ Navigating to ${portal} Forgot Password`);
    await this.publicPage.clickOnLogin();
    
    // Select appropriate portal
    switch (portal) {
      case 'staff':
        await this.portalSelectionPage.clickOnStaffPortalLoginLink();
        break;
      case 'organization':
        await this.portalSelectionPage.clickOnOrganizationPortalLoginLink();
        break;
      case 'individual':
        await this.portalSelectionPage.clickOnIndividualPortalLoginLink();
        break;
    }
    
    // Click Forgot Password link
    const forgotPasswordLink = this.page.locator('a:has-text("Forgot Password"), a:has-text("Forgot your password")');
    await forgotPasswordLink.click();
    await this.page.waitForLoadState('networkidle');
    
    Logger.success(`✓ On ${portal} Forgot Password page`);
  }

  /* ==================== STAFF SPECIFIC NAVIGATION ==================== */

  /**
   * Navigate directly to Staff portal and click Register
   * Shorthand for goToStaffRegistration
   */
  async navigateToStaffRegistration(): Promise<void> {
    await this.goToStaffRegistration();
  }

  /**
   * Navigate directly to Staff portal Login
   * Shorthand for goToStaffLogin
   */
  async navigateToStaffLogin(): Promise<void> {
    await this.goToStaffLogin();
  }

  /* ==================== ORGANIZATION SPECIFIC NAVIGATION ==================== */

  /**
   * Navigate directly to Organization portal and click Register
   * Shorthand for goToOrgRegistration
   */
  async navigateToOrgRegistration(): Promise<void> {
    await this.goToOrgRegistration();
  }

  /**
   * Navigate directly to Organization portal Login
   * Shorthand for goToOrgLogin
   */
  async navigateToOrgLogin(): Promise<void> {
    await this.goToOrgLogin();
  }

  /* ==================== INDIVIDUAL SPECIFIC NAVIGATION ==================== */

  /**
   * Navigate directly to Individual portal and click Register
   * Shorthand for goToIndividualRegistration
   */
  async navigateToIndividualRegistration(): Promise<void> {
    await this.goToIndividualRegistration();
  }

  /**
   * Navigate directly to Individual portal Login
   * Shorthand for goToIndividualLogin
   */
  async navigateToIndividualLogin(): Promise<void> {
    await this.goToIndividualLogin();
  }

  /* ==================== UTILITY METHODS ==================== */

  /**
   * Go back to public homepage
   */
  async goToPublicPage(): Promise<void> {
    Logger.info('→ Navigating to Public Homepage');
    await this.page.goto('/pages/public', { waitUntil: 'networkidle' });
    Logger.success('✓ On Public Homepage');
  }

  /**
   * Verify we're on the login page by checking for username field
   */
  async verifyOnLoginPage(): Promise<boolean> {
    const usernameField = this.page.locator('input[placeholder="Enter Username"]');
    return await usernameField.isVisible({ timeout: 5000 });
  }

  /**
   * Verify we're on registration page by checking for confirm password field
   */
  async verifyOnRegistrationPage(): Promise<boolean> {
    const confirmPasswordField = this.page.locator('input[name="confirmPassword"]');
    return await confirmPasswordField.isVisible({ timeout: 5000 });
  }
}