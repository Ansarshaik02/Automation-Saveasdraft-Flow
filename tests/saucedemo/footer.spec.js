import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

async function loginValidUser(page) {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
}

async function scrollToFooter(page) {
  await page.locator('footer').scrollIntoViewIfNeeded();
}

test.describe('Footer Tests', () => {

  test('TC082 - Verify social media links are displayed in footer', async ({ page }) => {
    await loginValidUser(page);
    await scrollToFooter(page);

    await expect(page.locator('.social_twitter')).toBeVisible();
    await expect(page.locator('.social_facebook')).toBeVisible();
    await expect(page.locator('.social_linkedin')).toBeVisible();
  });

  test('TC084 - Verify social media links are clickable', async ({ page }) => {
    await loginValidUser(page);
    await scrollToFooter(page);

    const twitter = await page.locator('.social_twitter a').getAttribute('href');
    const facebook = await page.locator('.social_facebook a').getAttribute('href');
    const linkedin = await page.locator('.social_linkedin a').getAttribute('href');

    expect(twitter).toContain('twitter.com');
    expect(facebook).toContain('facebook.com');
    expect(linkedin).toContain('linkedin.com');
  });

  test('TC085 - Verify social media links open in a new tab', async ({ page }) => {
    await loginValidUser(page);
    await scrollToFooter(page);

    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click('.social_twitter')
    ]);

    await expect(newPage).not.toHaveURL(BASE_URL);
  });

  test('TC086 - Verify social media links do not lead to broken pages', async ({ page }) => {
    await loginValidUser(page);
    await scrollToFooter(page);

    const links = ['.social_twitter', '.social_facebook', '.social_linkedin'];

    for (const link of links) {
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        page.click(link)
      ]);

      await newPage.waitForLoadState('domcontentloaded');
      await expect(newPage.url()).not.toContain('saucedemo.com');
      await newPage.close();
    }
  });

});
