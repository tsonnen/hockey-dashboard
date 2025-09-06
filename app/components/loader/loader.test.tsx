import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

import { Loader } from '@/app/components/loader/loader';

describe('Loader', () => {
  it('renders with spinner classes', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild?.firstChild).toHaveClass('spinner');
  });
});
