import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

async function loginValidUser(page) {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL(/inventory.html/);
}

async function addOneProduct(page) {
  await page.click('button[data-test^="add-to-cart"]');
}

async function goToCart(page) {
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart.html/);
}

test.describe('Cart Page Tests', () => {

  test('TC055 - Verify cart page opens from cart icon', async ({ page }) => {
    await loginValidUser(page);
    await goToCart(page);
  });

  test('TC057 - Verify added products are listed on cart page', async ({ page }) => {
    await loginValidUser(page);
    await addOneProduct(page);
    await goToCart(page);

    const cartItem = page.locator('.cart_item');
    await expect(cartItem).toHaveCount(1);
    await expect(cartItem.locator('.inventory_item_name')).toBeVisible();
    await expect(cartItem.locator('.inventory_item_price')).toBeVisible();
    await expect(cartItem.locator('.cart_quantity')).toBeVisible();
  });

  test('TC058 - Verify user can remove product from cart', async ({ page }) => {
    await loginValidUser(page);
    await addOneProduct(page);
    await goToCart(page);

    await page.click('button[data-test^="remove"]');
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('TC059 - Verify product quantity is displayed correctly on cart page', async ({ page }) => {
    await loginValidUser(page);
    await addOneProduct(page);
    await goToCart(page);

    await expect(page.locator('.cart_quantity')).toHaveText('1');
  });

  test('TC060 - Verify Continue Shopping button is visible and enabled', async ({ page }) => {
    await loginValidUser(page);
    await goToCart(page);

    const continueShoppingButton = page.locator('#continue-shopping');
    await expect(continueShoppingButton).toBeVisible();
    await expect(continueShoppingButton).toBeEnabled();
  });

  test('TC061 - Verify user can proceed to checkout from cart page', async ({ page }) => {
    await loginValidUser(page);
    await addOneProduct(page);
    await goToCart(page);

    await page.click('#checkout');
    await expect(page).toHaveURL(/checkout-step-one.html/);
  });

  test('TC062 - Verify clicking product name in cart opens product details page', async ({ page }) => {
    await loginValidUser(page);
    await addOneProduct(page);
    await goToCart(page);

    await page.click('.inventory_item_name');
    await expect(page).toHaveURL(/inventory-item.html/);
  });

  test('TC063 - Verify cart page shows empty state when no products added', async ({ page }) => {
    await loginValidUser(page);
    await goToCart(page);

    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('TC064 - Verify checkout is blocked when cart is empty', async ({ page }) => {
    await loginValidUser(page);
    await goToCart(page);

    await page.click('#checkout');
    await expect(page).toHaveURL(/cart.html/);
  });

  test('TC065 - Verify cart contents persist after refresh', async ({ page }) => {
    await loginValidUser(page);
    await addOneProduct(page);
    await goToCart(page);

    await page.reload();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('TC066 - Verify cart page cannot be accessed without login', async ({ page }) => {
    await page.goto(`${BASE_URL}cart.html`);

    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('#login-button')).toBeVisible();
  });

});
