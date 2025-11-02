import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Multiselect } from '../multiselect';
import { describe, it, expect, jest } from '@jest/globals';

describe('Multiselect', () => {
  const options = [
    { key: '1', label: 'Option 1' },
    { key: '2', label: 'Option 2' },
    { key: '3', label: 'Option 3' },
  ];

  it('renders label and options', () => {
    render(<Multiselect options={options} label="Test Label" selected={[]} onApply={() => {}} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    for (const option of options) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
  });

  it('calls onApply with selected options', () => {
    const onApply = jest.fn();
    render(<Multiselect options={options} label="Test Label" selected={[]} onApply={onApply} />);
    fireEvent.click(screen.getByText('Test Label'));
    fireEvent.click(screen.getByLabelText('Option 1'));
    fireEvent.click(screen.getByText('Apply'));
    expect(onApply).toHaveBeenCalledWith(['1']);
  });

  it('selects and deselects all options', () => {
    render(<Multiselect options={options} label="Test Label" selected={[]} onApply={() => {}} />);
    fireEvent.click(screen.getByText('Test Label'));
    fireEvent.click(screen.getByText('Select All'));
    for (const option of options) {
      expect((screen.getByLabelText(option.label) as HTMLInputElement).checked).toBe(true);
    }
    fireEvent.click(screen.getByText('Deselect All'));
    for (const option of options) {
      expect((screen.getByLabelText(option.label) as HTMLInputElement).checked).toBe(false);
    }
  });

  it('closes dropdown on outside click without applying changes', () => {
    const onApply = jest.fn();
    render(
      <div>
        <Multiselect options={options} label="Test Label" selected={[]} onApply={onApply} />
        <button data-testid="outside-button">Outside</button>
      </div>,
    );
    fireEvent.click(screen.getByText('Test Label'));
    fireEvent.click(screen.getByLabelText('Option 1'));
    fireEvent.click(screen.getByTestId('outside-button'));
    expect(onApply).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Test Label'));
  });
});
