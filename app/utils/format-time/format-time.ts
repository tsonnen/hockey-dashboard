/**
 * Formats seconds into MM:SS format
 * @param seconds - The number of seconds to format
 * @returns Formatted time string (MM:SS) or undefined if seconds is not provided
 */
export function formatTime(seconds?: number): string | undefined {
  if (!seconds) return;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
