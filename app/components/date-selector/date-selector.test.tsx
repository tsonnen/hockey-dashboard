import { render, screen, fireEvent } from '@testing-library/react';

import { DateSelector, type DateSelectorProps } from './date-selector';

// Mock react-tailwindcss-datepicker
jest.mock('react-tailwindcss-datepicker', () => ({
  __esModule: true,
  default: ({
    onChange,
    value,
    disabled,
    asSingle,
    required,
    inputClassName,
  }: {
    onChange?: (value: { startDate: Date; endDate: Date }) => void;
    value?: { startDate: Date; endDate: Date };
    disabled?: boolean;
    asSingle?: boolean;
    _useRange?: boolean;
    required?: boolean;
    inputClassName?: string;
  }) => {
    const formatDate = (date: Date): string => {
      try {
        if (date instanceof Date && !isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
        return '';
      } catch {
        return '';
      }
    };

    return (
      <div data-testid="mock-datepicker">
        <input
          className={inputClassName}
          data-testid="date-input"
          disabled={disabled}
          required={required}
          type="text"
          value={value?.startDate ? formatDate(value.startDate) : ''}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            if (!isNaN(newDate.getTime())) {
              onChange?.({
                startDate: newDate,
                endDate: asSingle ? newDate : (value?.endDate ?? newDate),
              });
            }
          }}
        />
      </div>
    );
  },
}));

describe('DateSelector', () => {
  const mockDate = new Date('2025-08-30');
  const mockOnDateChange = jest.fn();

  const defaultProps: DateSelectorProps = {
    selectedDate: mockDate,
    onDateChange: mockOnDateChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with all elements', () => {
    render(<DateSelector {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Previous day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next day' })).toBeInTheDocument();
    expect(screen.getByTestId('mock-datepicker')).toBeInTheDocument();
    expect(screen.getByTestId('date-input')).toBeInTheDocument();
  });

  it('displays the correct initial date', () => {
    render(<DateSelector {...defaultProps} />);

    const dateInput = screen.getByTestId('date-input');
    expect(dateInput).toHaveValue('2025-08-30');
  });

  it('calls onDateChange when previous day button is clicked', () => {
    render(<DateSelector {...defaultProps} />);

    const previousButton = screen.getByRole('button', { name: 'Previous day' });
    fireEvent.click(previousButton);

    expect(mockOnDateChange).toHaveBeenCalledWith(new Date('2025-08-29'));
  });

  it('calls onDateChange when next day button is clicked', () => {
    render(<DateSelector {...defaultProps} />);

    const nextButton = screen.getByRole('button', { name: 'Next day' });
    fireEvent.click(nextButton);

    expect(mockOnDateChange).toHaveBeenCalledWith(new Date('2025-08-31'));
  });

  it('calls onDateChange when date is changed via datepicker', () => {
    render(<DateSelector {...defaultProps} />);

    const dateInput = screen.getByTestId('date-input');
    fireEvent.change(dateInput, { target: { value: '2025-09-01' } });

    const utcDate = new Date('2025-09-01');
    expect(mockOnDateChange).toHaveBeenCalledWith(
      new Date(`${utcDate.getFullYear()}-${utcDate.getMonth() + 1}-${utcDate.getDate()}`),
    );
  });

  it('disables buttons and datepicker when disabled prop is true', () => {
    render(<DateSelector {...defaultProps} disabled={true} />);

    const previousButton = screen.getByRole('button', { name: 'Previous day' });
    const nextButton = screen.getByRole('button', { name: 'Next day' });
    const dateInput = screen.getByTestId('date-input');

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(dateInput).toBeDisabled();
  });

  it('does not call onDateChange when buttons are clicked while disabled', () => {
    render(<DateSelector {...defaultProps} disabled={true} />);

    const previousButton = screen.getByRole('button', { name: 'Previous day' });
    const nextButton = screen.getByRole('button', { name: 'Next day' });

    fireEvent.click(previousButton);
    fireEvent.click(nextButton);

    expect(mockOnDateChange).not.toHaveBeenCalled();
  });

  it('handles date changes across month boundaries correctly', () => {
    const endOfMonthDate = new Date('2025-08-31');
    render(<DateSelector {...defaultProps} selectedDate={endOfMonthDate} />);

    const nextButton = screen.getByRole('button', { name: 'Next day' });
    fireEvent.click(nextButton);

    expect(mockOnDateChange).toHaveBeenCalledWith(new Date('2025-09-01'));
  });

  it('handles date changes across year boundaries correctly', () => {
    const endOfYearDate = new Date('2025-12-31');
    render(<DateSelector {...defaultProps} selectedDate={endOfYearDate} />);

    const nextButton = screen.getByRole('button', { name: 'Next day' });
    fireEvent.click(nextButton);

    expect(mockOnDateChange).toHaveBeenCalledWith(new Date('2026-01-01'));
  });

  it('handles leap year dates correctly', () => {
    const leapYearDate = new Date('2024-02-28');
    render(<DateSelector {...defaultProps} selectedDate={leapYearDate} />);

    const nextButton = screen.getByRole('button', { name: 'Next day' });
    fireEvent.click(nextButton);

    expect(mockOnDateChange).toHaveBeenCalledWith(new Date('2024-02-29'));
  });

  it('does not call onDateChange when datepicker receives invalid input', () => {
    render(<DateSelector {...defaultProps} />);

    const dateInput = screen.getByTestId('date-input');
    fireEvent.change(dateInput, { target: { value: 'invalid-date' } });

    // Should not call onDateChange with invalid date
    expect(mockOnDateChange).not.toHaveBeenCalled();
  });

  it('maintains button functionality after multiple date changes', () => {
    const { rerender } = render(<DateSelector {...defaultProps} />);

    const nextButton = screen.getByRole('button', { name: 'Next day' });

    // First click
    fireEvent.click(nextButton);
    expect(mockOnDateChange).toHaveBeenNthCalledWith(1, new Date('2025-08-31'));

    // Simulate parent component updating selectedDate prop
    rerender(<DateSelector {...defaultProps} selectedDate={new Date('2025-08-31')} />);

    // Second click
    fireEvent.click(nextButton);
    expect(mockOnDateChange).toHaveBeenNthCalledWith(2, new Date('2025-09-01'));

    // Simulate parent component updating selectedDate prop again
    rerender(<DateSelector {...defaultProps} selectedDate={new Date('2025-09-01')} />);

    // Third click
    fireEvent.click(nextButton);
    expect(mockOnDateChange).toHaveBeenNthCalledWith(3, new Date('2025-09-02'));

    expect(mockOnDateChange).toHaveBeenCalledTimes(3);
  });
});
