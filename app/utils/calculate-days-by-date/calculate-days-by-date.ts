const MILLIS_IN_A_DAY = 86_400_000;
const MILLIS_IN_MINUTE = 60 * 1000;

export function calculateDaysByDate(targetDate: Date): { daysBack: number; daysAhead: number } {
  const today = new Date(Date.now());
  const targetDateSanitized = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  const offsetDifference =
    (targetDate.getTimezoneOffset() - today.getTimezoneOffset()) * MILLIS_IN_MINUTE;
  const todaySanitized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayTZAdjusted = new Date(todaySanitized.getTime() + offsetDifference);

  const differenceInDays = Math.floor(
    (targetDateSanitized.getTime() - todayTZAdjusted.getTime()) / MILLIS_IN_A_DAY,
  );

  if (differenceInDays < 0) {
    return { daysBack: Math.abs(differenceInDays), daysAhead: 0 };
  }

  return { daysBack: 0, daysAhead: differenceInDays };
}
