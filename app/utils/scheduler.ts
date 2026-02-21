/**
 * Splits a list of games into last 10 (past) and upcoming (future) based on the current date.
 * Assumes games are comparable by their `date` field (ISO string 'YYYY-MM-DD').
 */
export function splitSchedule<T extends { date: string }>(
  games: T[],
): { last10: T[]; upcoming: T[] } {
  const today = new Date().toISOString().split('T')[0];

  // Sort all games by date ascending
  const sorted = [...games].toSorted((a, b) => a.date.localeCompare(b.date));

  const past = sorted.filter((g) => g.date < today);
  const future = sorted.filter((g) => g.date >= today);

  return {
    // Last 10 played games (most recent last)
    last10: past.slice(-10),
    // Next 10 upcoming games (most imminent first)
    upcoming: future.slice(0, 10),
  };
}
