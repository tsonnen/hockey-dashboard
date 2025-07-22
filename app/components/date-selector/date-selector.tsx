import type { JSX } from 'react';

import styles from './date-selector.module.css';

export interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  disabled?: boolean;
}

export function DateSelector({
  selectedDate,
  onDateChange,
  disabled = false,
}: DateSelectorProps): JSX.Element {
  const handlePreviousDay = (): void => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = (): void => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newDate = new Date(e.target.value);
    onDateChange(newDate);
  };

  return (
    <div className={styles.dateSelector}>
      <button
        aria-label="Previous day"
        className={styles.navButton}
        disabled={disabled}
        onClick={handlePreviousDay}
      >
        ←
      </button>
      <input
        className={styles.dateInput}
        disabled={disabled}
        type="date"
        value={selectedDate.toISOString().split('T')[0]}
        onChange={handleDateChange}
      />
      <button
        aria-label="Next day"
        className={styles.navButton}
        disabled={disabled}
        onClick={handleNextDay}
      >
        →
      </button>
    </div>
  );
}
