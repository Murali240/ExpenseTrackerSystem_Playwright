# 🎭 Playwright Test Automation Framework (ISSI GMS)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.57.0-45ba4b?logo=playwright&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

## 📖 Table of Contents

- [What is This Framework?](#-what-is-this-framework)
- [Project Folder Structure](#-project-folder-structure)
- [Prerequisites](#-prerequisites)
- [Setup & Installation (5-Minute Quick Start)](#-setup--installation-5-minute-quick-start)
- [How to Run Tests](#-how-to-run-tests)
- [Viewing Reports](#-viewing-reports)
- [Creating Your First Test](#-creating-your-first-test)
- [Best Practices & Guidelines](#-best-practices--guidelines)
- [Troubleshooting](#-troubleshooting)
- [Contribution Guidelines](#-contribution-guidelines)

---

## 🎯 What is This Framework?

This is a **professional-grade test automation framework** built for testing the **ISSI GMS (Grants Management System)** web application. It uses **Playwright** with **TypeScript** to automate user interactions, verify system behavior, and ensure quality.

### Key Features:
- ✅ **Automated End-to-End Testing** - Tests run automatically without manual clicking.
- ✅ **Multiple User Roles** - Seamlessly test staff, organization, department, and individual user flows.
- ✅ **Smart Test Data** - Generates unique test data for every run (using dynamic factories).
- ✅ **Comprehensive Reporting** - Generates beautiful HTML and Allure reports with screenshots and test steps.
- ✅ **Fast Execution** - Reduces run times by caching authentication states automatically.
- ✅ **Robust Architecture** - Built on the Page Object Model (POM) pattern for scalable and easy-to-maintain code.

---

## 🏗️ Project Folder Structure

A clean, high-level overview of how the codebase is organized:

```text
ISSI GMS/
├── src/                          # 🧠 Framework Core (The Engine)
│   ├── constants/                # Fixed values (URLs, error messages, static paths)
│   ├── enums/                    # TypeScript enums (User roles, menu items)
│   ├── fixtures/                 # Playwright fixtures (e.g., auto-login context injection)
│   ├── pages/                    # Page Objects (Blueprints for web pages e.g., LoginPage)
│   ├── types/                    # TypeScript definitions/interfaces for strict typing
│   └── utils/                    # Helper tools (Logger, assertions, data factories)
│
├── tests/                        # 🧪 Test Files (The actual test case executions)
│   ├── auth/                     # Authentication & Login tests
│   ├── department/               # Department module tests
│   ├── programs/                 # Programs module tests
│   └── public/                   # Public-facing page tests
│
├── testData/                     # 📂 Data Files (JSON, CSV, or Excel formats)
├── .auth/                        # 🔐 Cached Logins (Speeds up execution, auto-generated)
├── allure-results/               # Raw test result outputs for Allure reporting
├── playwright-report/            # Auto-generated Playwright HTML test reports
│
├── bitbucket-pipelines.yml       # ☁️ CI/CD configuration for Bitbucket
├── playwright.config.ts          # ⚙️ Global Playwright configuration
├── package.json                  # 📦 Project dependencies and NPM scripts
└── tsconfig.json                 # 📘 TypeScript compiler configuration
```

---

## 🚀 Prerequisites

Before you start, make sure you have the following installed on your machine:
1. **Node.js** (v18 or higher)
   - Checking your version: `node -v`
2. **Git** (for version control)
   - Checking your version: `git --version`
3. **VS Code** (highly recommended IDE)
   - Useful Extensions: *Playwright Test for VSCode*, *ESLint*, *Prettier*.

---

## ⚡ Setup & Installation (5-Minute Quick Start)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "PlayWright Project/ISSI GMS"
```

### 2. Install Dependencies
```bash
# Install all required npm packages
npm install

# Install Playwright specific browsers
npx playwright install --with-deps
```

### 3. Configure the Environment
We use a `.env` file to securely store application URLs and user credentials.
```bash
# Copy the provided example to create your actual environment file
cp .env.example .env
```
*(Open the newly created `.env` file in your editor and ensure all usernames, passwords, and URLs are properly configured.)*

### 4. Verify the Setup
Let's run a quick smoke test to make sure everything works!
```bash
# Run tests with the @smoke tag in a headed browser (so you can watch it!)
npm run test:quick
```

---

## ▶️ How to Run Tests

We have configured several convenient NPM scripts inside `package.json`. You can easily trigger them from your terminal.

### Basic Test Execution Commands
| Command | What it does |
|---------|-------------|
| `npm test` | Runs all tests in headless mode. |
| `npm run test:headed` | Runs tests in a visible browser window. |
| `npm run test:ui` | Opens the Playwright interactive UI mode (great for debugging). |
| `npm run test:debug` | Runs tests with the Playwright Inspector attached. |

### Running Specific Tests
| Command | What it does |
|---------|-------------|
| `npm test tests/programs/program.spec.ts` | Runs a specific test file. |
| `npm test tests/auth/staff/staff.login.spec.ts -- --grep "TC-STAFF-LOGIN-001" `
| `npm run test:tag @smoke` | Runs all tests tagged with `@smoke`. |
| `npm run test:regression` | Runs all tests tagged with `@regression`. |

### Browser Specific Execution
| Command | What it does |
|---------|-------------|
| `npm run test:chrome` | Runs tests only in Chromium (Chrome/Edge). |
| `npm run test:firefox` | Runs tests only in Firefox. |
| `npm run test:webkit` | Runs tests only in WebKit (Safari). |
| `npm run test:all-browsers` | Runs tests across all 3 browsers. |

---

## 📊 Viewing Reports

Playwright out-of-the-box HTML reporting and Allure reporting are both integrated!

**Playwright Default HTML Report**
```bash
# Generates and serves the standard Playwright HTML report
npm run report
```

**Allure Reports (Advanced Reporting)**
```bash
# Generate the allure report and directly open it in your browser
npm run allure:serve
```

**Cleaning Old Reports**
```bash
# Deletes old test results, reports, and cached authentications
npm run clean:all
```

---

## 📝 Creating Your First Test

We use the Page Object Model (POM) pattern. This keeps web locators and UI actions visually separated from the actual test script logic. 

### Step 1: Create a Spec file
Create `tests/programs/my-first-test.spec.ts` and use the following template:

```typescript
import { test, expect } from '@fixtures/authFixtures';
import { ProgramsPage } from '@pages/programs/ProgramsPage';
import { Logger } from '@utils/logger';

// Group your tests. Adding tags like @smoke is highly encouraged!
test.describe('My First Feature Suite @smoke', () => {
  
  test('TC-001: My First Test Scenario', async ({ staffPage }) => {
    Logger.testStart('TC-001: My First Test Scenario');
    
    // Initialize the Page Object
    const programsPage = new ProgramsPage(staffPage);
    
    await test.step('Step 1: Navigate to the Programs Page', async () => {
      await programsPage.navigateToProgramsPage();
    });
    
    await test.step('Step 2: Verify correct initialization', async () => {
      const currentUrl = await programsPage.getCurrentUrl();
      expect(currentUrl).toContain('program');
      Logger.success('Programs page successfully validated!');
    });
    
    Logger.testEnd('TC-001: My First Test Scenario');
  });
});
```

### Step 2: Run Your Test
```bash
npm test tests/programs/my-first-test.spec.ts
```

---

## 🛡️ Best Practices & Guidelines

### DO:
- **Use Fixtures for Reusability:** Always use predefined fixtures like `{ staffPage }`, `{ orgPage }` instead of manually logging in. The framework will automatically fetch the cached login state from `.auth/`.
- **Use `test.step()`:** Wrap logical blocks of actions inside `test.step()`. This drastically improves report readability.
- **Use Data Factories:** Avoid hardcoded data. Utilize the generators in `/src/utils/factories` to dynamically generate unique entries.
  ```typescript
  const mockProgramData = ProgramFactory.generateBasicInfo();
  ```
- **Use Centralized Loggers:** Use `Logger.info()`, `Logger.success()`, `Logger.error()` to accurately stream steps instead of standard console logs.

### DON'T:
- ❌ **Hardcode wait times** (e.g., `await page.waitForTimeout(5000)`). Use Playwright's auto-waiting web assertions or locator actionability instead.
- ❌ **Write Assertions inside Pages.** Keep assertions (`expect()`) strictly inside your test `spec.ts` files. The Page Object files should only contain actions and locators.
- ❌ **Hardcode sensitive credentials.** Always use the environment variable configuration (`.env`).

---

## 🐛 Troubleshooting

| Common Issue | Solution |
|--------------|----------|
| **"Cannot find module '@pages/...'"** | Run `npm install`, check the `tsconfig.json` path aliases are correct, or simply restart your IDE TS Server. |
| **"Authentication failed / Invalid Login"** | Ensure the `.env` credentials are correct. Run `npm run clean:auth` to delete the corrupted auth cache and try running tests again. |
| **Tests are running too slowly** | Enable workers for parallelism (`npm run test:parallel`) or run tests purely in headless mode. |
| **"Browser node found / Protocol Error"** | The playwright browser binaries are missing. Run `npx playwright install --with-deps`. |

---

## 🤝 Contribution Guidelines

To help new developers get started and scale appropriately:
1. **Module First:** Pick up a ticket or select a test module you wish to tackle carefully.
2. **Strict Pattern:** Keep your `src/pages` objects purely for returning locators and performing UI logical actions.
3. **Isolate Logic:** Keep assertions (`expect`) strictly inside your tests under `tests/.../**/*.spec.ts`!
4. **Code Quality:** Run `npm run lint` and `npm run format` locally before submitting a Pull Request.

---

**Happy Testing!** 🚀

*Maintained By:* Rajasekhar Maddigalla (QA Lead)  
*Version:* 1.0.0
