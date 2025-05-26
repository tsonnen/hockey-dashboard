import { useState } from 'react';
import styles from './date-selector.module.css';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    onDateChange(newDate);
  };

  return (
    <div className={styles.dateSelector}>
      <button 
        onClick={handlePreviousDay}
        className={styles.navButton}
        aria-label="Previous day"
      >
        ←
      </button>
      <input
        type="date"
        value={selectedDate.toISOString().split('T')[0]}
        onChange={handleDateChange}
        className={styles.dateInput}
      />
      <button 
        onClick={handleNextDay}
        className={styles.navButton}
        aria-label="Next day"
      >
        →
      </button>
    </div>
  );
} 