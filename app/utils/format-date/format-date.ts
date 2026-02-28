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

/**
 * Parses a YYYY-MM-DD string into a Date object at local midnight
 * @param dateStr - The date string to parse
 * @returns Date object at local midnight
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formats a Date or UTC string into a local ISO date format (YYYY-MM-DD)
 * @param date - The Date or UTC string to format
 * @returns Formatted local date string (YYYY-MM-DD)
 */
export function formatLocalDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
