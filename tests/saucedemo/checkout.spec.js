import { test, expect } from '@playwright/test';


const BASE_URL = 'https://www.saucedemo.com/';

async function loginValidUser(page) {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL(/inventory.html/);
}

async function addProductAndGoToCheckout(page) {
  await page.click('button[data-test^="add-to-cart"]');
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart.html/);
  await page.click('#checkout');
  await expect(page).toHaveURL(/checkout-step-one.html/);
}

async function fillCheckoutInfo(page, firstName, lastName, postalCode) {
  if (firstName !== undefined) await page.fill('#first-name', firstName);
  if (lastName !== undefined) await page.fill('#last-name', lastName);
  if (postalCode !== undefined) await page.fill('#postal-code', postalCode);
}

test.describe('Checkout Page Tests', () => {

  test('TC067 - Verify checkout page opens from cart', async ({ page }) => {
    await loginValidUser(page);
    await addProductAndGoToCheckout(page);
  });

  test('TC068 - Verify user can enter name and pincode', async ({ page }) => {
    await loginValidUser(page);
    await addProductAndGoToCheckout(page);

    await fillCheckoutInfo(page, 'Ansar', 'Shaik', '500001');

    await expect(page.locator('#first-name')).toHaveValue('Ansar');
    await expect(page.locator('#last-name')).toHaveValue('Shaik');
    await expect(page.locator('#postal-code')).toHaveValue('500001');
  });

  test('TC069 - Verify checkout blocked when first name is missing', async ({ page }) => {
    await loginValidUser(page);
    await addProductAndGoToCheckout(page);

    await fillCheckoutInfo(page, undefined, 'Shaik', '500001');
    await page.click('#continue');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one.html/);
  });

  test('TC070 - Verify checkout blocked when pincode is missing', async ({ page }) => {
    await loginValidUser(page);
    await addProductAndGoToCheckout(page);

    await fillCheckoutInfo(page, 'Ansar', 'Shaik', undefined);
    await page.click('#continue');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one.html/);
  });

  test('TC071 - Verify checkout overview page is displayed', async ({ page }) => {
    await loginValidUser(page);
    await addProductAndGoToCheckout(page);

    await fillCheckoutInfo(page, 'Ansar', 'Shaik', '500001');
    await page.click('#continue');

    await expect(page).toHaveURL(/checkout-step-two.html/);
  });

  test('TC072 - Verify user can review product details on overview page', async ({ page }) => {
    await loginValidUser(page);
    await addProductAndGoToCheckout(page);

    await fillCheckoutInfo(page, 'Ansar', 'Shaik', '500001');
    await page.click('#continue');

    await expect(page.locator('.inventory_item_name')).toBeVisible();
    await expect(page.locator('.inventory_item_price')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('TC073 - Verify overview page cannot be accessed without checkout info', async ({ page }) => {
    await loginValidUser(page);
    await addProductAndGoToCheckout(page);

    await page.goto(`${BASE_URL}checkout-step-two.html`);
    await expect(page).toHaveURL(/checkout-step-one.html/);
  });

  test('TC074 - Verify behavior with special characters in checkout fields', async ({ page }) => {
    await loginValidUser(page);
    await addProductAndGoToCheckout(page);

    await fillCheckoutInfo(page, '@@@', '###', '!!!');
    await page.click('#continue');

    await expect(page).toHaveURL(/checkout-step-two.html/);
  });

  test('TC075 - Verify checkout works with mixed case names', async ({ page }) => {
    await loginValidUser(page);
    await addProductAndGoToCheckout(page);

    await fillCheckoutInfo(page, 'AnSaR', 'ShAiK', '500001');
    await page.click('#continue');

    await expect(page).toHaveURL(/checkout-step-two.html/);
  });

});
