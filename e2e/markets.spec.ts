import { test, expect } from '@playwright/test';

test.describe('Markets flow', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Markets' })).toBeVisible();
  });

  test('login route redirects home and opens auth modal', async ({ page }) => {
    await page.goto('/login');
    await page.waitForURL((url) => !url.pathname.includes('/login'));
    await expect(page).toHaveURL(/\//);
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('compliance blocked page', async ({ page }) => {
    await page.goto('/compliance-blocked');
    await expect(page.getByText(/Access Restricted/i)).toBeVisible();
  });
});
