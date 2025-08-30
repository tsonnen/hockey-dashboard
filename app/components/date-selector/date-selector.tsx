import { useState, type JSX } from 'react';
import Datepicker, { type DateValueType } from 'react-tailwindcss-datepicker';

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
  const [value, setValue] = useState<DateValueType>({
    startDate: selectedDate,
    endDate: selectedDate,
  });

  const handlePreviousDay = (): void => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
    setValue({ startDate: newDate, endDate: newDate });
  };

  const handleNextDay = (): void => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
    setValue({ startDate: newDate, endDate: newDate });
  };

  const handleDateChange = (newValue: DateValueType): void => {
    setValue(newValue);
    if (newValue?.startDate) {
      onDateChange(newValue.startDate);
    }
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
      <Datepicker
        asSingle={true}
        disabled={disabled}
        inputClassName={styles.dateInput}
        required={true}
        useRange={false}
        value={value}
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
