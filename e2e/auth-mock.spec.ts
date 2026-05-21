import { test, expect } from '@playwright/test';

test.describe('Auth mock', () => {
  test('redirects unauthenticated users from portfolio', async ({ page }) => {
    await page.goto('/portfolio');
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain('/login');
  });
});
