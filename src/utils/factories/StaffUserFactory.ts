/**
 * Staff User Factory
 * Generates test data for staff registration
 */

import { BaseTestDataFactory, TestDataTracker } from './BaseTestDataFactory';

/* ==================== STAFF USER INTERFACES ==================== */

export interface StaffUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  userType: string;
}

/* ==================== STAFF USER FACTORY ==================== */

export class StaffUserFactory extends BaseTestDataFactory {

  /**
   * Generate random username
   */
  private static generateUsername(prefix: string = 'staff'): string {
    const timestamp = this.generateTimestamp();
    return `${prefix}${timestamp}`;
  }

  /**
   * Generate secure password
   */
  private static generatePassword(): string {

    return 'Issi@123';
    // Pattern: Capital letter, lowercase, number, special char, 8+ chars
   // return `Staff${this.generateTimestamp()}@`;
  }

  /**
   * Generate staff first name
   */
  private static generateFirstName(): string {
    const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'Robert', 'Jessica'];
    return firstNames[Math.floor(Math.random() * firstNames.length)];
  }

  /**
   * Generate staff last name
   */
  private static generateLastName(): string {
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    return lastNames[Math.floor(Math.random() * lastNames.length)];
  }

  /**
   * Generate mobile number in specific format
   */
  private static generateMobileNumber(): string {
    const areaCode = this.generateRandomNumber(900, 999);
    const exchange = this.generateRandomNumber(200, 999);
    const subscriber = this.generateRandomNumber(1000, 9999);
    return `${areaCode}${exchange}${subscriber}`;
  }

  /**
   * Generate complete staff user data
   */
  static generateStaffUser(overrides: Partial<StaffUserData> = {}): StaffUserData {
    const username = this.generateUsername('staff');
    const password = this.generatePassword();
    const email = this.generateEmail('staff');
    const firstName = this.generateFirstName();
    const lastName = this.generateLastName();
    const mobileNumber = this.generateMobileNumber();

    const staffUser: StaffUserData = {
      username,
      email,
      password,
      firstName,
      lastName,
      mobileNumber,
      userType: 'staff',
      ...overrides
    };

    // Track the user in centralized data tracker
    TestDataTracker.trackUser(staffUser.email, staffUser.password, staffUser.userType);

    return staffUser;
  }

  /**
   * Generate multiple staff users
   */
  static generateMultipleStaffUsers(count: number): StaffUserData[] {
    const users: StaffUserData[] = [];
    for (let i = 0; i < count; i++) {
      users.push(this.generateStaffUser());
    }
    return users;
  }

  /**
   * Get last registered staff user from tracker
   */
  static getLastStaffUser(): StaffUserData | null {
    const lastUser = TestDataTracker.getLastUser('staff');
    if (!lastUser) return null;
    
    return {
      username: lastUser.email.split('@')[0], // Extract from email
      email: lastUser.email,
      password: lastUser.password,
      firstName: 'Tracked',
      lastName: 'User',
      mobileNumber: '',
      userType: 'staff'
    };
  }
}