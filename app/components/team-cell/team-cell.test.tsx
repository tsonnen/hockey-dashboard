import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

import { TeamCell } from '@/app/components/team-cell';

describe('TeamCell', () => {
  it('renders with logo', () => {
    const props = {
      logo: '/team-logo.png',
      teamName: 'Test Team',
      abbrev: 'TEST',
    };

    render(
      <table>
        <tbody>
          <tr>
            <TeamCell {...props} />
          </tr>
        </tbody>
      </table>,
    );
    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('border border-gray-300 p-2');
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Test Team logo');
    expect(image).toHaveAttribute('src', '/team-logo.png');
    expect(image).toHaveClass('h-10');
    expect(cell).toHaveTextContent('TEST');
  });
});
