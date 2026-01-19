import { test, expect } from '@playwright/test';

test.describe('Sauce Demo Login Page Tests', () => {

  test('TC001 - Verify Sauce Demo login page loads correctly', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');

    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(page.locator('#login-button')).toBeVisible();
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('TC002 - Verify login button is disabled until valid input is provided', async ({ page }) => {

  // Step 1: Open login page
  await page.goto('https://www.saucedemo.com/');

  // Step 2: Do not enter username or password

  // Step 3: Verify login button is disabled
  const loginButton = page.locator('#login-button');
  await expect(loginButton).toBeDisabled();

});


});
