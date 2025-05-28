import { render } from '@testing-library/react';

import { Loader } from '@/app/components/loader/loader';

describe('Loader', () => {
  it('renders with spinner classes', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass('spinnerContainer');
    expect(container.firstChild?.firstChild).toHaveClass('spinner');
  });
});
