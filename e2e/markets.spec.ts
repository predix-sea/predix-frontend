import { test, expect } from '@playwright/test';

test.describe('Markets flow', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Markets' })).toBeVisible();
  });

  test('login page shows connect button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /Connect MetaMask/i })).toBeVisible();
  });

  test('compliance blocked page', async ({ page }) => {
    await page.goto('/compliance-blocked');
    await expect(page.getByText(/Access Restricted/i)).toBeVisible();
  });
});
