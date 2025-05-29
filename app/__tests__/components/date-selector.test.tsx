import { render, screen, fireEvent } from '@testing-library/react';

import { DateSelector } from '@/app/components/date-selector/date-selector';

describe('DateSelector', () => {
  it('handles date navigation and input', () => {
    const mockOnChange = jest.fn();
    const initialDate = new Date('2024-03-15');

    render(<DateSelector selectedDate={initialDate} onDateChange={mockOnChange} />);

    fireEvent.click(screen.getByLabelText('Next day'));
    expect(mockOnChange).toHaveBeenCalledWith(new Date('2024-03-16'));

    fireEvent.click(screen.getByLabelText('Previous day'));
    expect(mockOnChange).toHaveBeenCalledWith(new Date('2024-03-14'));

    fireEvent.change(screen.getByDisplayValue('2024-03-15'), { target: { value: '2024-03-20' } });
    expect(mockOnChange).toHaveBeenCalledWith(new Date('2024-03-20'));
  });
});
