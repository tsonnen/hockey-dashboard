export default function startTime(utcTime: string): string {
  const date = new Date(utcTime);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}
