import { test, expect } from '@playwright/test';

test.describe('Team Details Page', () => {
  test('Can navigate to Team Details from NHL Game', async ({ page }) => {
    // Go to a known NHL game
    await page.goto('/game/nhl/2024020049');
    
    // Check for Home Team link and click it
    // The link wraps the name and logo. We can find by text or href pattern.
    // In game 2024020049, home team is likely... let's assume we find any link to /team/nhl/...
    
    // We can select the home team section specifically
    const _homeTeamContainer = page.getByTestId('game-score-display').locator('div.flex-col').last();
    /* Actually structure is:
       Away Team (first flex-col)
       Status
       Home Team (last flex-col)
    */
    
    // Wait for the link to be available
    const teamLink = page.locator('a[href^="/team/nhl/"]').first();
    await expect(teamLink).toBeVisible();
    await teamLink.click();
    
    // Verify URL
    await expect(page).toHaveURL(/\/team\/nhl\//);
    
    // Verify Page Content
    await expect(page.locator('h1')).toBeVisible(); // Team Name
    await expect(page.locator('img[alt="Team Logo"]')).toBeVisible();
    
    // Verify Sections
    await expect(page.getByText('Schedule')).toBeVisible();
    await expect(page.getByText('Roster')).toBeVisible();
    await expect(page.getByText('Skaters')).toBeVisible();
    await expect(page.getByText('Goalies')).toBeVisible();
  });

  // Since we don't have a real running server with mocked data for this test run in this environment easily (or do we?),
  // we rely on the app running against real API or mocks if configured.
  // The existing tests go to real URLs (or mocked network).
  // I'll assume I can verify structure at least.
});
