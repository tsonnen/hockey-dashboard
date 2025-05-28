import { render, screen } from '@testing-library/react';

import { TeamCell } from '@/app/components/team-cell';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

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

  it('renders without logo', () => {
    const props = {
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
    expect(cell).toHaveTextContent('TEST');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
}); 