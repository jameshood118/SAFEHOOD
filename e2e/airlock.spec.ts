import { expect, test } from '@playwright/test';

test.describe('SAFEHOOD Perimeter Defense', () => {
  test('AuthGuard blocks unauthenticated access and redirects to Airlock', async ({ page }) => {
    // 1. Attempt to access the protected Command Center
    await page.goto('/');

    // 2. The structural dampers should instantly redirect to the login route
    await expect(page).toHaveURL(/.*\/login/);

    // 3. Verify the visual presence of the Airlock UI (Adjust this text to match your actual Login screen)

    // If your login screen says something else, change 'SAFEHOOD AIRLOCK' to match!

    // 4. Ensure the page actually rendered the login UI
    await expect(page.locator('button', { hasText: /sign in/i })).toBeVisible();
  });
});
