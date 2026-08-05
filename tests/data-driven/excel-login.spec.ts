import { test } from '@fixtures/AuthFixtures';
import { Assertions } from '@utils/assertions';
import { Logger } from '@utils/logger';
import type { UserCredentials, UserRole } from '@types';

import ExcelDataReader from '../../src/utils/ExcelDataReader';
import path from 'path';

interface LoginTestData extends UserCredentials {
  expectedOutcome: 'valid' | 'invalid';
  scenarioName: string;
  role: UserRole;
}

const reader = new ExcelDataReader(path.resolve(__dirname, '../../testData/excel'));
const credentials = reader.read('data.xlsx');

const userRoleMap: Record<string, UserRole> = {
  admin: "Administrator",
  kmkrishna: "Employee",
  mhemanth: "Accountant",
  spilli: "Manager",
  dummyUsername: "Administrator",
};

const loginData: LoginTestData[] = (credentials as any[]).map(({ username, password }) => {
  const isInvalid = username === 'dummyUsername' && password === 'dummyPassword@123';
  const role = userRoleMap[username] ?? 'Administrator';
  const effectivePassword = role === 'Administrator'
    ? process.env.ETS_ADMIN_PASSWORD || password
    : role === 'Employee'
      ? process.env.ETS_EMPLOYEE_PASSWORD || password
      : role === 'Manager'
        ? process.env.ETS_MANAGER_PASSWORD || password
        : role === 'Accountant'
          ? process.env.ETS_ACCOUNTANT_PASSWORD || password
          : password;

  return {
    username,
    password: effectivePassword,
    role,
    expectedOutcome: isInvalid ? 'invalid' : 'valid',
    scenarioName: isInvalid ? 'Negative login with invalid credentials' : `Positive login with ${username} (${role})`,
  };
});

test.describe('@regression Login Module - Data Driven Authentication (Excel)', () => {
  test.beforeEach(async ({ loginPage }) => {
    Logger.info('Navigating to Login Page');
    await loginPage.goto();
  });

  loginData.forEach((data, index) => {
    const testId = data.expectedOutcome === 'valid' ? `TC-LOGIN-DD-${String(index + 1).padStart(3, '0')}` : `NEG-TC-LOGIN-DD-${String(index + 1).padStart(3, '0')}`;

    test(`${testId}: ${data.scenarioName}`, async ({ loginPage }) => {
      Logger.testStart(`${testId}: ${data.scenarioName}`);

      test.info().annotations.push({ type: 'data-driven', description: data.scenarioName });
      test.info().annotations.push({ type: 'role', description: data.role });

      await Assertions.verifyElementVisible(loginPage.userNameField, 'Username field');
      await Assertions.verifyElementVisible(loginPage.passwordField, 'Password field');
      await Assertions.verifyElementVisible(loginPage.loginButton, 'Login button');

      await loginPage.doLogin(data.username, data.password, data.role);

      if (data.expectedOutcome === 'valid') {
        await loginPage.page.waitForURL('**/dashboard/', { timeout: 30000 });
        await loginPage.verifyDashboard(data.role);
        Logger.success(`✅ ${data.scenarioName} passed`);
      } else {
        await Assertions.verifyElementVisible(loginPage.loginErrorMessage, 'Login error message', 30000);
        Logger.success(`✅ ${data.scenarioName} passed`);
      }

      Logger.testEnd(testId);
    });
  });
});
