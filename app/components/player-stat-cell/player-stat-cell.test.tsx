import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { PlayerStatCell } from './player-stat-cell';

describe('PlayerStatCell', () => {
  const defaultProps = {
    headshot: '/player.jpg',
    name: 'John Doe',
    sweaterNumber: 99,
    position: 'C',
    stats: [{ value: 25, statLabel: 'G' }],
  };

  it('renders player name', () => {
    render(<PlayerStatCell {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders player image with correct alt text', () => {
    render(<PlayerStatCell {...defaultProps} />);
    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();
  });

  it('renders sweater number', () => {
    render(<PlayerStatCell {...defaultProps} />);
    expect(screen.getByText(/#99/)).toBeInTheDocument();
  });

  it('renders position', () => {
    render(<PlayerStatCell {...defaultProps} />);
    expect(screen.getByText(/#99 C/)).toBeInTheDocument();
  });

  it('renders single stat with label', () => {
    render(<PlayerStatCell {...defaultProps} />);
    expect(screen.getByText(/25/)).toBeInTheDocument();
    expect(screen.getByText(/G/)).toBeInTheDocument();
  });

  it('renders multiple stats', () => {
    const propsWithMultipleStats = {
      ...defaultProps,
      stats: [
        { value: 25, statLabel: 'G' },
        { value: 30, statLabel: 'A' },
        { value: 55, statLabel: 'P' },
      ],
    };
    render(<PlayerStatCell {...propsWithMultipleStats} />);
    expect(screen.getByText(/25/)).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
    expect(screen.getByText(/55/)).toBeInTheDocument();
  });

  it('renders stat without label', () => {
    const propsWithoutLabel = {
      ...defaultProps,
      stats: [{ value: 25 }],
    };
    render(<PlayerStatCell {...propsWithoutLabel} />);
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('handles string stat values', () => {
    const propsWithStringValue = {
      ...defaultProps,
      stats: [{ value: '2.45', statLabel: 'GAA' }],
    };
    render(<PlayerStatCell {...propsWithStringValue} />);
    expect(screen.getByText(/2.45/)).toBeInTheDocument();
    expect(screen.getByText(/GAA/)).toBeInTheDocument();
  });

  it('renders goalie stats correctly', () => {
    const goalieProps = {
      headshot: '/goalie.jpg',
      name: 'Bob Smith',
      sweaterNumber: 30,
      position: 'G',
      stats: [
        { value: 2.45, statLabel: 'GAA' },
        { value: 0.915, statLabel: 'SVP' },
      ],
    };
    render(<PlayerStatCell {...goalieProps} />);
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText(/#30 G/)).toBeInTheDocument();
    expect(screen.getByText(/2.45/)).toBeInTheDocument();
    expect(screen.getByText(/0.915/)).toBeInTheDocument();
  });

  it('handles empty stats array', () => {
    const propsWithNoStats = {
      ...defaultProps,
      stats: [],
    };
    const { container } = render(<PlayerStatCell {...propsWithNoStats} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(container.querySelector('.text-lg.font-semibold.text-gray-600')).not.toBeInTheDocument();
  });

  it('renders with different positions', () => {
    const positions = ['C', 'LW', 'RW', 'D', 'G'];
    for (const pos of positions) {
      const { rerender } = render(<PlayerStatCell {...defaultProps} position={pos} />);
      expect(screen.getByText(new RegExp(`#99 ${pos}`))).toBeInTheDocument();
      rerender(<></>); // Clean up for next iteration
    }
  });
});
