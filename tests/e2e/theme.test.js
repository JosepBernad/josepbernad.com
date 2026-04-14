import { test, expect } from '@playwright/test';

test.describe('Theme toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage so theme starts from system preference
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('theme-preference'));
    await page.reload();
  });

  test('page has a data-theme attribute on load', async ({ page }) => {
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(['light', 'dark']).toContain(theme);
  });

  test('theme toggle button switches the theme', async ({ page }) => {
    const html = page.locator('html');
    const before = await html.getAttribute('data-theme');

    await page.locator('.theme-toggle').click();

    const after = await html.getAttribute('data-theme');
    expect(after).not.toBe(before);
    expect(['light', 'dark']).toContain(after);
  });

  test('theme persists after page reload', async ({ page }) => {
    await page.locator('.theme-toggle').click();
    const theme = await page.locator('html').getAttribute('data-theme');

    await page.reload();

    const themeAfterReload = await page.locator('html').getAttribute('data-theme');
    expect(themeAfterReload).toBe(theme);
  });

  test('toggling twice returns to original theme', async ({ page }) => {
    const original = await page.locator('html').getAttribute('data-theme');
    await page.locator('.theme-toggle').click();
    await page.locator('.theme-toggle').click();
    const current = await page.locator('html').getAttribute('data-theme');
    expect(current).toBe(original);
  });
});
