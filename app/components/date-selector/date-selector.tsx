import { useState, type JSX } from 'react';
import Datepicker, { type DateValueType } from 'react-tailwindcss-datepicker';

import styles from './date-selector.module.css';
import { DAY_IN_MS } from '@/app/consts/date-consts';

const getLocalMidnight = (utcDate: Date): Date => {
  const [year, month, day] = utcDate.toISOString().slice(0, 10).split('-');
  const updatedDate = new Date(`${year}-${month}-${day}T00:00:00`);

  return updatedDate;
};

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
    startDate: getLocalMidnight(selectedDate),
    endDate: getLocalMidnight(selectedDate),
  });

  const handlePreviousDay = (): void => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
    setValue({ startDate: getLocalMidnight(newDate), endDate: getLocalMidnight(newDate) });
  };

  const handleNextDay = (): void => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
    setValue({ startDate: getLocalMidnight(newDate), endDate: getLocalMidnight(newDate) });
  };

  const handleDateChange = (newValue: DateValueType): void => {
    setValue(newValue);
    if (newValue?.startDate) {
      const newDate = newValue.startDate;
      onDateChange(
        new Date(`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`),
      );
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
        inputId="datepickerInput"
        required={true}
        useRange={false}
        value={value}
        onChange={handleDateChange}
        showShortcuts={true}
        configs={{
          shortcuts: {
            yesterday: {
              text: 'Yesterday',
              period: {
                start: getLocalMidnight(new Date(Date.now() - DAY_IN_MS)),
                end: getLocalMidnight(new Date(Date.now() - DAY_IN_MS)),
              },
            },
            today: {
              text: 'Today',
              period: {
                start: getLocalMidnight(new Date()),
                end: getLocalMidnight(new Date()),
              },
            },
            tomorrow: {
              text: 'Tomorrow',
              period: {
                start: getLocalMidnight(new Date(Date.now() + DAY_IN_MS)),
                end: getLocalMidnight(new Date(Date.now() + DAY_IN_MS)),
              },
            },
          },
        }}
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
