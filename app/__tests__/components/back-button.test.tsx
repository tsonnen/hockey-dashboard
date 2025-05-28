import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import { BackButton } from '@/app/components/back-button';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('BackButton', () => {
  it('renders with default class and handles click', () => {
    const mockBack = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });

    render(<BackButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors');
    expect(button).toHaveTextContent('Back');
    fireEvent.click(button);
    expect(mockBack).toHaveBeenCalled();
  });

  it('renders with custom class', () => {
    render(<BackButton className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
