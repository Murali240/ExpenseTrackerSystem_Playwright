import { FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Loads `.env` when present; CI variables come from the environment as usual.
 * Fails fast before any browser work when required keys are missing.
 */
export default async function globalSetup(_config: FullConfig): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, '.env') });

  const required = [
    'Base_URL',
    'APP_USERNAME',
    'APP_PASSWORD',
    'LDAP_USERNAME',
    'LDAP_PASSWORD',
    'INVALID_USERNAME',
    'INVALID_PASSWORD',
  ] as const;

  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    console.error('[global-setup] Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }
}
