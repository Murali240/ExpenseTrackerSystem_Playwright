// src/utils/helpers/authHelper.ts

import { Page } from '@playwright/test';
import { LoginPage } from '../../pages/common/LoginPage';
import { UserRole } from '../../types';
import { Logger } from '../logger';

/**
 * Returns environment variable value or throws an error.
 */
function requireEnvVar(key: string): string {
    const value = process.env[key]?.trim();

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
}

/**
 * Login with specified user role.
 */
export async function loginAs(
    page: Page,
    role: UserRole
): Promise<void> {

    const loginPage = new LoginPage(page);

    Logger.info(`Logging in as ${role}`);

    await loginPage.goto();

    switch (role) {

        case 'Administrator':

            await loginPage.doLogin(
                requireEnvVar('ETS_ADMIN_USERNAME'),
                requireEnvVar('ETS_ADMIN_PASSWORD'),
                role
            );

            break;

        case 'Employee':

            await loginPage.doLogin(
                requireEnvVar('ETS_EMPLOYEE_USERNAME'),
                requireEnvVar('ETS_EMPLOYEE_PASSWORD'),
                role
            );

            break;

        case 'Manager':

            await loginPage.doLogin(
                requireEnvVar('ETS_MANAGER_USERNAME'),
                requireEnvVar('ETS_MANAGER_PASSWORD'),
                role
            );

            break;

        case 'Accountant':

            await loginPage.doLogin(
                requireEnvVar('ETS_ACCOUNTANT_USERNAME'),
                requireEnvVar('ETS_ACCOUNTANT_PASSWORD'),
                role
            );

            break;

        case 'LDAP':

            await loginPage.doLogin(
                process.env.ETS_LDAP_USERNAME?.trim() || requireEnvVar('ETS_EMPLOYEE_USERNAME'),
                process.env.ETS_LDAP_PASSWORD?.trim() || requireEnvVar('ETS_EMPLOYEE_PASSWORD'),
                role
            );

            break;

        default:
            throw new Error(`Unsupported role: ${role}`);
    }

    Logger.success(`${role} login completed successfully`);
}

/**
 * Validate required environment variables.
 */
export function validateEnvVariables(): void {

    const requiredVariables = [

        'ETS_BASE_URL',

        'ETS_ADMIN_USERNAME',
        'ETS_ADMIN_PASSWORD',

        'ETS_EMPLOYEE_USERNAME',
        'ETS_EMPLOYEE_PASSWORD',

        'ETS_MANAGER_USERNAME',
        'ETS_MANAGER_PASSWORD',

        'ETS_ACCOUNTANT_USERNAME',
        'ETS_ACCOUNTANT_PASSWORD'

    ];

    const missingVariables = requiredVariables.filter(
        variable => !process.env[variable]
    );

    if (missingVariables.length > 0) {

        throw new Error(
            `Missing environment variables:\n${missingVariables.join('\n')}`
        );

    }

    Logger.success('All required environment variables are configured.');
}