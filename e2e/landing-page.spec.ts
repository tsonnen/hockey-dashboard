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
      const gameCards = page.locator('[data-testid-gamecard]');
      await expect(gameCards).toHaveCount(13, { timeout: 10_000 });

      const expectedMatchups = [
        ['Tampa Bay', 'Carolina'],
        ['Brantford', 'Ottawa'],
        ['Owen Sound', 'Niagara'],
        ['Barrie', 'London'],
        ['Sudbury', 'Kingston'],
        ['North Bay', 'Erie'],
        ['Windsor', 'Brampton'],
        ['Oshawa', 'Sarnia'],
        ['Kitchener', 'Sault Ste. Marie'],
        ['Peterborough', 'Guelph'],
        ['Chicago', 'Winnipeg'],
        ['Philadelphia', 'Vancouver'],
        ['St. Louis', 'Vegas'],
      ];

      for (const [i, [away, home]] of expectedMatchups.entries()) {
        const card = gameCards.nth(i);
        await expect(card.locator(`img[alt="${away} logo"]`)).toBeVisible();
        await expect(card.locator(`img[alt="${home} logo"]`)).toBeVisible();
      }
    });
  });
});
