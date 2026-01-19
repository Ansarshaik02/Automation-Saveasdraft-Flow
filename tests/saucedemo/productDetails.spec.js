import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

async function loginValidUser(page) {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL(/inventory.html/);
}

async function openProductDetails(page) {
  await page.click('.inventory_item_name');
  await expect(page).toHaveURL(/inventory-item.html/);
}

async function addProductFromDetails(page) {
  await page.click('button[data-test^="add-to-cart"]');
}

async function goToCart(page) {
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart.html/);
}

test.describe('Product Details Page Tests', () => {

  test('TC041 - Verify product details page opens on product name click', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);
  });

  test('TC042 - Verify product details page opens on product image click', async ({ page }) => {
    await loginValidUser(page);
    await page.click('.inventory_item_img');
    await expect(page).toHaveURL(/inventory-item.html/);
  });

  test('TC043 - Verify product name and description are displayed', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
  });

  test('TC044 - Verify product image is displayed on details page', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    await expect(page.locator('.inventory_details_img')).toBeVisible();
  });

  test('TC045 - Verify product details page cannot be accessed without login', async ({ page }) => {
    await page.goto(`${BASE_URL}inventory-item.html`);

    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('TC046 - Verify refresh does not break product details page', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    await page.reload();

    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
    await expect(page.locator('.inventory_details_img')).toBeVisible();
  });

  test('TC047 - Verify Back to Products navigates to products list', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    await page.click('#back-to-products');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('TC048 - Verify product image is clickable on details page', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    const image = page.locator('.inventory_details_img');
    await expect(image).toBeVisible();
    await image.click();
    await expect(image).toBeVisible();
  });

  test('TC049 - Verify user can add product to cart from details page', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    await addProductFromDetails(page);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC050 - Verify added product appears in cart with correct details', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    const name = await page.locator('.inventory_details_name').innerText();
    const price = await page.locator('.inventory_details_price').innerText();

    await addProductFromDetails(page);
    await goToCart(page);

    await expect(page.locator('.inventory_item_name')).toHaveText(name);
    await expect(page.locator('.inventory_item_price')).toHaveText(price);
  });

  test('TC051 - Verify product can be removed from cart from details page', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    await addProductFromDetails(page);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.click('button[data-test^="remove"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('TC052 - Verify Add to Cart changes to Remove after adding product', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    await addProductFromDetails(page);
    await expect(page.locator('button[data-test^="remove"]')).toBeVisible();
  });

  test('TC053 - Verify Back to Products button works from details page', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    await page.click('#back-to-products');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('TC054 - Verify same product cannot be added multiple times', async ({ page }) => {
    await loginValidUser(page);
    await openProductDetails(page);

    await addProductFromDetails(page);

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.locator('button[data-test^="add-to-cart"]')).toHaveCount(0);
    await expect(page.locator('button[data-test^="remove"]')).toBeVisible();

    await goToCart(page);
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.cart_quantity')).toHaveText('1');
  });

});
