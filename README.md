# 🎭 Playwright Test Automation Framework

![Playwright Tests](https://github.com/Rajno1/PlaywrightProject/actions/workflows/playwright.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-1.57.0-45ba4b?logo=playwright&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

## 📖 Table of Contents
1. [What is This Framework?](#what-is-this-framework)
2. [Simple Explanation (Non-Technical)](#simple-explanation-non-technical)
3. [Framework Architecture](#framework-architecture)
4. [Setup Instructions](#setup-instructions)
5. [How to Run Tests](#how-to-run-tests)
6. [Creating New Tests](#creating-new-tests)
7. [Interview Explanation Guide](#interview-explanation-guide)

---

## 🎯 What is This Framework?

This is a **professional-grade test automation framework** built for testing the **ISSI GMS (Grants Management System)** web application. It uses **Playwright** with **TypeScript** to automate user interactions and verify system behavior.

### Key Features:
✅ **Automated Testing** - Tests run automatically without manual clicking
✅ **Multiple User Roles** - Tests staff, organization, and individual users
✅ **Smart Test Data** - Generates unique test data every run
✅ **Comprehensive Reporting** - Beautiful reports with screenshots
✅ **Fast Execution** - Caches login to save time
✅ **Easy Maintenance** - Well-organized, reusable code

---

## 🌟 Simple Explanation (Non-Technical)

### What Does This Framework Do?

Imagine you're testing a website manually:
1. You open the browser
2. You log in
3. You click buttons, fill forms
4. You check if everything works correctly

**This framework does ALL of that automatically!**

### How Does It Work?

```
┌─────────────────────────────────────────────┐
│  1. Framework Reads Test Instructions      │
│     (What to test?)                         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  2. Opens Browser & Logs In                 │
│     (Uses saved login to go faster)         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  3. Performs Actions                        │
│     (Clicks buttons, fills forms)           │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  4. Checks Results                          │
│     (Did it work correctly?)                │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  5. Creates Report                          │
│     (Shows what passed/failed)              │
└─────────────────────────────────────────────┘
```

### Real Example:

**Manual Testing (You):**
```
1. Open browser (1 minute)
2. Go to website (10 seconds)
3. Click "Login" (5 seconds)
4. Enter username/password (10 seconds)
5. Click "Staff Portal" (5 seconds)
6. Wait for dashboard (5 seconds)
7. Click "Programs" menu (5 seconds)
8. Check if page loads (5 seconds)
Total Time: ~2 minutes PER TEST
```

**Automated Testing (This Framework):**
```
1. Framework does ALL steps in 10 seconds!
2. Can run 100 tests while you have coffee ☕
3. Runs same test every time (no human error)
4. Creates detailed report automatically
```

---

## 🏗️ Framework Architecture

### Folder Structure (Simple Explanation)

```
PlaywrightProject/
│
├── 📁 src/                          # Framework Code (The Engine)
│   │
│   ├── 📁 pages/                    # Page Objects (Blueprint of each webpage)
│   │   ├── base/BasePage.ts        # Common actions (click, type, wait)
│   │   ├── login/LoginPage.ts      # Login page actions
│   │   └── programs/               # Programs module pages
│   │       ├── ProgramsPage.ts     # Program list page
│   │       ├── AddProgramPage.ts   # Add new program page
│   │       └── EditProgramPage.ts  # Edit program page
│   │
│   ├── 📁 fixtures/                 # Setup & Teardown (Before/After test)
│   │   └── authFixtures.ts         # Handles login automatically
│   │
│   ├── 📁 utils/                    # Helper Tools (Supporting functions)
│   │   ├── logger.ts               # Prints what's happening
│   │   ├── assertions.ts           # Checks if test passed
│   │   ├── dataReader.ts           # Reads test data files
│   │   └── factories/              # Test Data Generators
│   │       ├── ProgramFactory.ts   # Creates program test data
│   │       ├── GrantFactory.ts     # Creates grant test data
│   │       └── ApplicationFactory.ts # Creates application test data
│   │
│   ├── 📁 constants/                # Fixed Values (URLs, paths)
│   │   └── Paths.ts                # File locations
│   │
│   ├── 📁 enums/                    # Lists of Options
│   │   └── Enums.ts                # User types, menu names, etc.
│   │
│   └── 📁 types/                    # Data Structure Definitions
│       └── index.ts                # TypeScript types
│
├── 📁 tests/                        # Test Files (What to test)
│   ├── programs/                   # Program module tests
│   │   ├── program.spec.ts         # Current tests
│   │   ├── week1foundation.spec.ts # Basic tests
│   │   ├── week2positive.spec.ts   # Happy path tests
│   │   └── week3negative.spec.ts   # Error handling tests
│   │
│   └── datadriven/                 # Data-driven tests
│       └── dataDriven.spec.ts      # Tests using external data
│
├── 📁 testData/                     # Test Data Files
│   ├── json/data.json              # JSON format data
│   ├── csv/data.csv                # CSV format data
│   └── excel/data.xlsx             # Excel format data
│
├── 📁 .auth/                        # Saved Login Sessions (Auto-generated)
│   ├── staffLogin.json             # Staff user session
│   ├── orgLogin.json               # Organization session
│   └── individualLogin.json        # Individual session
│
├── 📁 allure-results/               # Raw test results (Auto-generated)
├── 📁 allure-report/                # Beautiful HTML reports (Auto-generated)
├── 📁 playwright-report/            # Playwright HTML report (Auto-generated)
│
├── 📄 .env                          # Environment variables (Passwords, URLs)
├── 📄 playwright.config.ts          # Framework configuration
├── 📄 tsconfig.json                 # TypeScript configuration
└── 📄 package.json                  # Project dependencies
```

### What Each Folder Does (Simple Terms):

| Folder | What It Does | Example |
|--------|--------------|---------|
| `src/pages/` | Contains "blueprints" of web pages | LoginPage knows how to log in |
| `src/fixtures/` | Sets up tests before they run | Logs in user automatically |
| `src/utils/` | Helper functions | Logger prints what's happening |
| `tests/` | Actual test cases | "Test: Create a program" |
| `testData/` | Data to use in tests | List of usernames/passwords |
| `.auth/` | Saved login sessions | No need to login every time! |
| `*-report/` | Test results | Shows what passed/failed |

---

## 🚀 Setup Instructions

### Prerequisites (What You Need)

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org
   - Check version: `node --version`

2. **Git** (for version control)
   - Download: https://git-scm.com
   - Check version: `git --version`

3. **VS Code** (recommended editor)
   - Download: https://code.visualstudio.com

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
# Clone from GitHub
git clone <your-repo-url>

# Navigate to project
cd PlaywrightProject
```

#### 2. Install Dependencies
```bash
# Install all required packages
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

#### 3. Create Environment File
```bash
# Copy example file
cp .env.example .env

# Edit .env with your credentials
# (Use text editor or VS Code)
```

**Example .env file:**
```bash
# Application URL
ISSI_GMS_URL=https://issigmsdev.issi-software.com

# Staff User Credentials
STAFF_USERNAME=admin
STAFF_PASSWORD=Issi@123

# Organization User Credentials
ORG_USERNAME=orguser
ORG_PASSWORD=password
ORG_NAME=Test Organization

# Individual User Credentials
IND_USERNAME=individual
IND_PASSWORD=password

# Test Configuration
HEADLESS=false
DEBUG=false
```

#### 4. Verify Setup
```bash
# Run a simple test
npm test -- tests/programs/program.spec.ts

# If browser opens and test runs, setup is complete! ✅
```

---

## ▶️ How to Run Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific test file
npm test tests/programs/program.spec.ts

# Run tests in debug mode (step-by-step)
npm run test:debug

# Run tests in UI mode (interactive)
npm run test:ui
```

### Advanced Commands

```bash
# Run tests in Chrome only
npm run test:chrome

# Run tests in Firefox
npm run test:firefox

# Run tests with specific tag
npm run test:tag @smoke

# Run tests in parallel (4 workers)
npm run test:parallel

# Run tests one at a time
npm run test:serial

# Run full spec	
npm run test -- tests/programs/program.spec.ts

# Run single test	
npm run test -- tests/programs/program.spec.ts -g "TC-PP-001"

# Headed + single test
npm run test:headed -- tests/programs/program.spec.ts -g "TC-PP-001"

# Run by tag	
npm run test -- -g "@programs"

```





### View Reports

```bash
# View Playwright HTML report
npm run report

# Generate Allure report
npm run allure:generate

# Open Allure report in browser
npm run allure:open

# Generate and serve Allure report
npm run allure:serve
```

### Cleanup

```bash
# Clean test results
npm run clean

# Clean everything (including auth files)
npm run clean:all

# Clean only auth files
npm run clean:auth
```

---

## 📝 Creating New Tests

### Simple Template (Copy-Paste This!)

```typescript
import { test, expect } from '@fixtures/authFixtures';
import { ProgramsPage } from '@pages/programs/ProgramsPage';
import { Logger } from '@utils/logger';

test.describe('My New Test Suite', () => {
  
  test('TC-001: Test Name Here', async ({ staffPage }) => {
    Logger.testStart('TC-001: Test Name Here');
    
    const programsPage = new ProgramsPage(staffPage);
    
    await test.step('Step 1: Navigate somewhere', async () => {
      await programsPage.navigateToProgramsPage();
      Logger.success('Navigated successfully');
    });
    
    await test.step('Step 2: Do something', async () => {
      // Your test actions here
      Logger.info('Doing something...');
    });
    
    await test.step('Step 3: Verify result', async () => {
      // Your assertions here
      expect(true).toBeTruthy();
      Logger.success('Verification passed');
    });
    
    Logger.testEnd('TC-001: Test Name Here');
  });
});
```

### Using Test Data Factory

```typescript
import { ProgramFactory } from '@utils/factories/ProgramFactory';

test('TC-002: Create Program', async ({ staffPage }) => {
  // Generate unique test data
  const programData = ProgramFactory.generateBasicInfo();
  
  // Use it in your test
  await addProgramPage.enterProgramCode(programData.programCode);
  await addProgramPage.enterProgramName(programData.programName);
  
  // Data is automatically unique every time!
  Logger.info(`Created program: ${programData.programName}`);
});
```

### Best Practices for Writing Tests

1. **Use descriptive names**
   ```typescript
   // ❌ Bad
   test('test1', async () => {});
   
   // ✅ Good
   test('TC-PL-001: Verify staff can view programs list', async () => {});
   ```

2. **Use test.step() for clarity**
   ```typescript
   await test.step('Navigate to Programs page', async () => {
     // navigation code
   });
   
   await test.step('Click Add New Program', async () => {
     // click code
   });
   ```

3. **Use factories for test data**
   ```typescript
   // ❌ Bad - Hard-coded data
   await page.fill('#code', 'PROG001');
   
   // ✅ Good - Generated data
   const data = ProgramFactory.generateBasicInfo();
   await page.fill('#code', data.programCode);
   ```

4. **Add logging**
   ```typescript
   Logger.info('Performing action...');
   Logger.success('Action completed');
   Logger.warn('Warning message');
   Logger.error('Error occurred');
   ```

## 📊 Framework Capabilities

### What This Framework Can Do:

✅ **Multiple User Roles**
- Staff users
- Organization users  
- Individual users
- Automatic login for all roles

✅ **Test Data Management**
- Generate unique test data
- Read data from JSON/CSV/Excel
- Track created data for cleanup
- Support multiple data formats

✅ **Page Coverage**
- Login flows
- Programs module (list, add, edit)
- Grants module (prepared)
- Applications module (prepared)

✅ **Test Types**
- Smoke tests (critical paths)
- Functional tests (complete flows)
- Negative tests (error handling)
- Data-driven tests (multiple data sets)

✅ **Reporting**
- Playwright HTML reports
- Allure reports with history
- JSON reports for CI/CD
- JUnit XML for integrations
- Screenshots on failure
- Video recordings

✅ **Advanced Features**
- Parallel execution
- Smart retry logic
- Authentication caching
- Custom logging
- Type safety with TypeScript
- Path aliases for clean imports

---

## 🎓 Learning Resources

### If You Want to Learn More:

1. **Playwright Documentation**
   - https://playwright.dev/docs/intro

2. **TypeScript Handbook**
   - https://www.typescriptlang.org/docs/handbook/intro.html

3. **Page Object Model**
   - https://playwright.dev/docs/pom

4. **Allure Reporting**
   - https://docs.qameta.io/allure/

---

## 🤝 Contributing

### How to Add New Tests:

1. Create test file in appropriate folder
2. Import required page objects and fixtures
3. Use factories for test data
4. Follow naming convention: `TC-[MODULE]-[NUMBER]: Description`
5. Add proper logging
6. Use test.step() for clarity
7. Add to appropriate test suite

### Code Review Checklist:

- [ ] Uses fixtures for authentication
- [ ] Uses factories for test data
- [ ] Has proper logging
- [ ] Uses test.step() for readability
- [ ] Follows naming conventions
- [ ] Has assertions
- [ ] No hard-coded data
- [ ] No hard-coded waits (use Playwright auto-wait)

---

## 🐛 Troubleshooting

### Common Issues:

**1. Tests fail with "Element not found"**
```bash
Solution: 
- Check if locator is correct
- Add wait before action
- Verify page loaded completely
```

**2. Authentication fails**
```bash
Solution:
- Check .env credentials
- Delete .auth folder and run again
- Verify application is accessible
```

**3. Tests are slow**
```bash
Solution:
- Enable parallel execution
- Check headless mode is enabled
- Verify network connection
```

**4. Import errors**
```bash
Solution:
- Run: npm install
- Check tsconfig.json path aliases
- Restart VS Code
```

---

## 📧 Support

For questions or issues:
1. Check this README first
2. Review code comments in source files
3. Check Playwright documentation
4. Reach out to framework maintainer

---

## 🎉 Success Indicators

You'll know the framework is working when:
- ✅ Tests run without errors
- ✅ Reports generate automatically
- ✅ Can run tests in parallel
- ✅ New tests take <15 minutes to write
- ✅ Test data is unique every run
- ✅ Authentication happens automatically

---

## 📝 License

This framework is for internal use in testing the ISSI GMS application.

---

**Last Updated**: February 2026
**Framework Version**: 1.0.0
**Maintained By**: Rajasekhar Maddigalla (QA Lead)
