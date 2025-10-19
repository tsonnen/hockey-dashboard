import { test, expect } from '@playwright/test';

test.describe('Game Details Page', () => {
  test('Can View NHL Game Details', async ({ page }) => {
    await page.goto('/game/nhl/2024020049');
    await expect(page.getByTestId('game-score-display')).toBeVisible();
    await expect(page.getByTestId('away-team-logo')).toBeVisible();
    await expect(page.getByTestId('home-team-logo')).toBeVisible();
    await expect(page.getByTestId('away-team-score')).toHaveText('2');
    await expect(page.getByTestId('home-team-score')).toHaveText('4');
  });

  test('Can View HockeyTech Game Details', async ({ page }) => {
    await page.goto('/game/qmjhl/31874');
    await expect(page.getByTestId('game-score-display')).toBeVisible();
    await expect(page.getByTestId('away-team-logo')).toBeVisible();
    await expect(page.getByTestId('home-team-logo')).toBeVisible();
    await expect(page.getByTestId('away-team-score')).toHaveText('2');
    await expect(page.getByTestId('home-team-score')).toHaveText('4');
  });
});
