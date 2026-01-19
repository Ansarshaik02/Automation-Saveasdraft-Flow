import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

async function loginValidUser(page) {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
}

async function completeOrder(page) {
  await page.click('button[data-test^="add-to-cart"]');
  await page.click('.shopping_cart_link');
  await page.click('#checkout');

  await page.fill('#first-name', 'Ansar');
  await page.fill('#last-name', 'Shaik');
  await page.fill('#postal-code', '500001');
  await page.click('#continue');
  await page.click('#finish');

  await expect(page).toHaveURL(/checkout-complete.html/);
}

test.describe('Thank You Page Tests', () => {

  test('TC076 - Verify Thank You page is displayed after order submission', async ({ page }) => {
    await loginValidUser(page);
    await completeOrder(page);

    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('TC077 - Verify application logo is displayed on Thank You page', async ({ page }) => {
    await loginValidUser(page);
    await completeOrder(page);

    await expect(page.locator('.app_logo')).toBeVisible();
  });

  test('TC078 - Verify Back Home button redirects to products page', async ({ page }) => {
    await loginValidUser(page);
    await completeOrder(page);

    await page.click('#back-to-products');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('TC079 - Verify Thank You page cannot be accessed without order submission', async ({ page }) => {
    await loginValidUser(page);

    await page.goto(`${BASE_URL}checkout-complete.html`);
    await expect(page.url()).not.toContain('checkout-complete.html');
  });

  test('TC080 - Verify refreshing Thank You page does not duplicate order', async ({ page }) => {
    await loginValidUser(page);
    await completeOrder(page);

    await page.reload();
    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('TC081 - Verify browser back does not resubmit order', async ({ page }) => {
    await loginValidUser(page);
    await completeOrder(page);

    await page.goBack();
    await expect(page.url()).not.toContain('checkout-complete.html');
  });

});
