import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';

import { BackButton } from '@/app/components/back-button';

describe('BackButton', () => {
  beforeEach(() => {
    globalThis.resetRouterMocks();
  });

  it('renders with default class and handles click', () => {
    render(<BackButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Back');
    fireEvent.click(button);
    expect(globalThis.mockRouter.back).toHaveBeenCalled();
  });

  it('renders with custom class', () => {
    render(<BackButton className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
