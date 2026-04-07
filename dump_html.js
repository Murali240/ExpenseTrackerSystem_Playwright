const { chromium } = require('playwright');
require('dotenv').config();

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(process.env.ISSI_GMS_URL + '/pages/public');
  await page.locator('*:has-text("Staff Login")').last().click();
  await page.waitForLoadState('networkidle');
  console.log("STAFF LOGIN INPUTS:");
  console.log(await page.locator('input').evaluateAll(els => els.map(e => ({ placeholder: e.placeholder, name: e.name, type: e.type, id: e.id }))));

  await page.goto(process.env.ISSI_GMS_URL + '/pages/public');
  await page.locator('label:has-text("INDIVIDUAL")').click();
  await page.waitForLoadState('networkidle');
  console.log("INDIVIDUAL LOGIN INPUTS:");
  console.log(await page.locator('input').evaluateAll(els => els.map(e => ({ placeholder: e.placeholder, name: e.name, type: e.type, id: e.id }))));
  
  await page.goto(process.env.ISSI_GMS_URL + '/pages/public');
  await page.locator('label:has-text("ORGANIZATION")').click();
  await page.waitForLoadState('networkidle');
  console.log("ORGANIZATION LOGIN INPUTS:");
  console.log(await page.locator('input').evaluateAll(els => els.map(e => ({ placeholder: e.placeholder, name: e.name, type: e.type, id: e.id }))));

  await browser.close();
})();
