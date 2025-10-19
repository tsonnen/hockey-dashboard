export function calculateDaysByDate(targetDate: Date): { daysBack: number; daysAhead: number } {
  const differenceInDays = Math.ceil((targetDate.valueOf() - Date.now().valueOf()) / 86_400_000);

  if (differenceInDays < 0) {
    return { daysBack: Math.abs(differenceInDays), daysAhead: 0 };
  }

  return { daysBack: 0, daysAhead: differenceInDays };
}
