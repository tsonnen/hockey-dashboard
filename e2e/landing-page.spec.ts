import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('leagues are selected in the dropdown on first load', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be ready (date picker is populated)
    await expect(page.locator('#datepickerInput')).toHaveValue(/\d{4}-\d{2}-\d{2}/);

    // Open the leagues dropdown
    await page.getByRole('button', { name: 'Select Leagues' }).click();

    // All 7 leagues should be selected (checked) on first load
    await expect(page.getByRole('checkbox', { checked: true })).toHaveCount(7);
  });

  test('defaults to current date', async ({ page }) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    await page.goto('/');
    await expect(page.locator('#datepickerInput')).toHaveValue(date.toISOString().slice(0, 10));
  });

  test('can view determined date', async ({ page }) => {
    const testDate = '2024-10-11';
    await page.goto(`/?date=${testDate}`);
    await test.step('date input reflects date in query param', async () => {
      await expect(page.locator('#datepickerInput')).toHaveValue(testDate);
    });

    await test.step('correct games are displayed', async () => {
      await expect(page.locator('[data-testid-gamecard]')).toHaveCount(13);
    });
  });
});
