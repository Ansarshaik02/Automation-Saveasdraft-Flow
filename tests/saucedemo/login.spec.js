import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

async function openLoginPage(page) {
  await page.goto(BASE_URL);
}

async function login(page, username, password) {
  await openLoginPage(page);
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');
}

async function loginValidUser(page) {
  await login(page, 'standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory.html/);
}

function getLoginError(page) {
  return page.locator('[data-test="error"]');
}

test.describe('Login Page Tests', () => {

  test('TC001 - Verify user can login with valid credentials', async ({ page }) => {
    await loginValidUser(page);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC002 - Verify login with special characters in username', async ({ page }) => {
    await login(page, '@#$%', 'secret_sauce');

    const errorMessage = getLoginError(page);
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username and password do not match');
  });

  test('TC003 - Verify login button is disabled until valid input is provided', async ({ page }) => {
    await openLoginPage(page);
    await expect(page.locator('#login-button')).toBeDisabled();
  });

  test('TC004 - Verify error message for locked user', async ({ page }) => {
    await login(page, 'locked_out_user', 'secret_sauce');

    const errorMessage = getLoginError(page);
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('TC005 - Verify error for incorrect password', async ({ page }) => {
    await login(page, 'standard_user', 'wrong_password');
    await expect(getLoginError(page)).toBeVisible();
  });

  test('TC006 - Verify login behavior when password contains spaces', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce ');
    await expect(getLoginError(page)).toBeVisible();
  });

  test('TC007 - Verify user session is cleared after closing the browser', async ({ browser }) => {
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();

    await loginValidUser(page1);
    await context1.close();

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();

    await openLoginPage(page2);
    await expect(page2.locator('#login-button')).toBeVisible();

    await context2.close();
  });

  test('TC008 - Verify username field is empty after reopening browser', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await loginValidUser(page);
    await context.close();

    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();

    await openLoginPage(newPage);
    await expect(newPage.locator('#user-name')).toHaveValue('');

    await newContext.close();
  });

  test('TC009 - Verify password field is empty after reopening browser', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await loginValidUser(page);
    await context.close();

    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();

    await openLoginPage(newPage);
    await expect(newPage.locator('#password')).toHaveValue('');

    await newContext.close();
  });

  test('TC010 - Verify browser back button does not restore session', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await loginValidUser(page);
    await context.close();

    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();

    await openLoginPage(newPage);
    await newPage.goBack();

    await expect(newPage.locator('#login-button')).toBeVisible();
    await expect(newPage).toHaveURL(BASE_URL);

    await newContext.close();
  });

  test('TC016 - Verify Sauce Demo login page loads correctly', async ({ page }) => {
    await openLoginPage(page);

    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(page.locator('#login_button_container')).toBeVisible();
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('.login_logo')).toBeVisible();
  });

  test('TC017 & TC018 - Verify application logo visibility before and after refresh', async ({ page }) => {
    await loginValidUser(page);

    const logo = page.locator('.app_logo');
    await expect(logo).toBeVisible();

    await page.reload();
    await expect(logo).toBeVisible();
  });

  test('TC019 - Verify logo image is loaded correctly before and after login', async ({ page }) => {
    await openLoginPage(page);
    await expect(page.locator('.login_logo')).toBeVisible();

    await loginValidUser(page);
    await expect(page.locator('.app_logo')).toBeVisible();
  });

});

