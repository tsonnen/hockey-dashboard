/**
 * Formats a UTC date string into a long date format (e.g., Saturday, February 21, 2026)
 * @param utcTime - The UTC time string to format
 * @returns Formatted date string
 */
export function formatDate(utcTime: string): string {
  if (!utcTime) return '';
  const date = new Date(utcTime);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
