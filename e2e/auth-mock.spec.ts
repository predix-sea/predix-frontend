import { test, expect } from '@playwright/test';

test.describe('Auth mock', () => {
  test('unauthenticated users can browse portfolio without login redirect', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page).toHaveURL(/\/portfolio/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('/login redirects to home and opens auth modal', async ({ page }) => {
    await page.goto('/login?redirect=/');
    await page.waitForURL((url) => !url.pathname.includes('/login'));
    await expect(page).toHaveURL(/\//);
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
