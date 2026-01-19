import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

async function loginValidUser(page) {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL(/inventory.html/);
}

async function openMenu(page) {
  await page.click('#react-burger-menu-btn');
}

async function addOneProduct(page) {
  await page.click('button[data-test^="add-to-cart"]');
}

async function goToCart(page) {
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart.html/);
}

async function expectCenteredHorizontally(child, parent) {
  const childBox = await child.boundingBox();
  const parentBox = await parent.boundingBox();

  expect(
    Math.abs(
      (childBox.x + childBox.width / 2) -
      (parentBox.x + parentBox.width / 2)
    )
  ).toBeLessThan(5);
}

test.describe('Home Page Tests', () => {

  test('TC020 - Verify application logo is displayed at the top center of the header', async ({ page }) => {
    await loginValidUser(page);

    const logo = page.locator('.app_logo');
    const header = page.locator('#header_container');

    await expect(logo).toBeVisible();
    await expectCenteredHorizontally(logo, header);
  });

  test('TC021 - Verify logo is centered across different screen sizes', async ({ page }) => {
    await loginValidUser(page);

    const logo = page.locator('.app_logo');
    const header = page.locator('#header_container');

    const viewports = [
      { width: 1280, height: 800 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(logo).toBeVisible();
      await expectCenteredHorizontally(logo, header);
    }
  });

  test('TC023 - Verify menu button is visible in the top-left section of the header', async ({ page }) => {
    await loginValidUser(page);

    const menuButton = page.locator('#react-burger-menu-btn');
    await expect(menuButton).toBeVisible();

    const menuBox = await menuButton.boundingBox();
    expect(menuBox.x).toBeLessThan(100);
    expect(menuBox.y).toBeLessThan(100);
  });

  test('TC024 - Verify submenu options are displayed when menu button is clicked', async ({ page }) => {
    await loginValidUser(page);

    await openMenu(page);

    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await expect(page.locator('#reset_sidebar_link')).toBeVisible();
  });

  test('TC025 - Verify submenu options are not visible before clicking menu button', async ({ page }) => {
    await loginValidUser(page);

    await page.hover('#react-burger-menu-btn');

    await expect(page.locator('#inventory_sidebar_link')).toBeHidden();
    await expect(page.locator('#about_sidebar_link')).toBeHidden();
    await expect(page.locator('#logout_sidebar_link')).toBeHidden();
    await expect(page.locator('#reset_sidebar_link')).toBeHidden();
  });

  test('TC026 - Verify clicking close button hides submenu options', async ({ page }) => {
    await loginValidUser(page);

    await openMenu(page);
    await page.click('#react-burger-cross-btn');

    await expect(page.locator('#inventory_sidebar_link')).toBeHidden();
    await expect(page.locator('#about_sidebar_link')).toBeHidden();
    await expect(page.locator('#logout_sidebar_link')).toBeHidden();
    await expect(page.locator('#reset_sidebar_link')).toBeHidden();
  });

  test('TC028 - Verify clicking All Items redirects to products page', async ({ page }) => {
    await loginValidUser(page);

    await openMenu(page);
    await page.click('#inventory_sidebar_link');

    await expect(page).toHaveURL(/inventory.html/);
  });

  test('TC029 - Verify clicking About redirects to Sauce Labs page', async ({ page }) => {
    await loginValidUser(page);

    await openMenu(page);
    await page.click('#about_sidebar_link');

    await expect(page).toHaveURL(/saucelabs.com/);
  });

  test('TC030 - Verify user can logout', async ({ page }) => {
    await loginValidUser(page);

    await openMenu(page);
    await page.click('#logout_sidebar_link');

    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('TC031 - Verify Add to Cart button is displayed', async ({ page }) => {
    await loginValidUser(page);

    const buttons = page.locator('button[data-test^="add-to-cart"]');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toBeVisible();
    }
  });

  test('TC032 - Verify added product is listed with complete details', async ({ page }) => {
    await loginValidUser(page);

    await addOneProduct(page);
    await goToCart(page);

    const cartItem = page.locator('.cart_item');
    await expect(cartItem.locator('.inventory_item_name')).toBeVisible();
    await expect(cartItem.locator('.inventory_item_price')).toBeVisible();
    await expect(cartItem.locator('.cart_quantity')).toBeVisible();
  });

  test('TC033 - Verify user can remove product from cart', async ({ page }) => {
    await loginValidUser(page);

    await addOneProduct(page);
    await goToCart(page);

    await page.click('button[data-test^="remove"]');
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('TC040 - Verify cart contents retained while navigating pages', async ({ page }) => {
    await loginValidUser(page);

    await addOneProduct(page);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.click('.inventory_item_name');
    await page.click('#back-to-products');

    await goToCart(page);
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

});

