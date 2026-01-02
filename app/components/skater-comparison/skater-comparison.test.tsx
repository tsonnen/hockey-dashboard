import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { SkaterComparison } from './skater-comparison';
import type { SkaterComparisonProps } from '@/app/models/game-matchup';

describe('SkaterComparison', () => {
  const mockLeaders: SkaterComparisonProps['leaders'] = [
    {
      category: 'goals',
      awayLeader: {
        playerId: 101,
        headshot: '/player1.jpg',
        positionCode: 'LW',
        sweaterNumber: 99,
        name: { default: 'John Doe' },
        value: '25',
      },
      homeLeader: {
        playerId: 201,
        headshot: '/player2.jpg',
        positionCode: 'C',
        sweaterNumber: 88,
        name: { default: 'Jane Smith' },
        value: '30',
      },
    },
    {
      category: 'assists',
      awayLeader: {
        playerId: 102,
        headshot: '/player3.jpg',
        positionCode: 'RW',
        sweaterNumber: 77,
        name: { default: 'Bob Johnson' },
        value: '35',
      },
      homeLeader: {
        playerId: 202,
        headshot: '/player4.jpg',
        positionCode: 'D',
        sweaterNumber: 44,
        name: { default: 'Alice Brown' },
        value: '40',
      },
    },
    {
      category: 'points',
      awayLeader: {
        playerId: 103,
        headshot: '/player5.jpg',
        positionCode: 'C',
        sweaterNumber: 66,
        name: { default: 'Charlie Wilson' },
        value: '60',
      },
      homeLeader: {
        playerId: 203,
        headshot: '/player6.jpg',
        positionCode: 'LW',
        sweaterNumber: 55,
        name: { default: 'Diana Davis' },
        value: '65',
      },
    },
  ];

  it('renders section header', () => {
    render(<SkaterComparison leaders={mockLeaders} />);
    expect(screen.getByText('Skater Stat Leaders')).toBeInTheDocument();
  });

  it('renders all stat categories with title case', () => {
    render(<SkaterComparison leaders={mockLeaders} />);
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Assists')).toBeInTheDocument();
    expect(screen.getByText('Points')).toBeInTheDocument();
  });

  it('renders away and home labels', () => {
    render(<SkaterComparison leaders={mockLeaders} />);
    const awayLabels = screen.getAllByText('Away');
    const homeLabels = screen.getAllByText('Home');
    expect(awayLabels.length).toBe(3); // One for each category
    expect(homeLabels.length).toBe(3);
  });

  it('renders all player names', () => {
    render(<SkaterComparison leaders={mockLeaders} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('Alice Brown')).toBeInTheDocument();
    expect(screen.getByText('Charlie Wilson')).toBeInTheDocument();
    expect(screen.getByText('Diana Davis')).toBeInTheDocument();
  });

  it('displays stat values', () => {
    render(<SkaterComparison leaders={mockLeaders} />);
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('65')).toBeInTheDocument();
  });

  it('renders jersey numbers', () => {
    render(<SkaterComparison leaders={mockLeaders} />);
    expect(screen.getByText(/#99/)).toBeInTheDocument();
    expect(screen.getByText(/#88/)).toBeInTheDocument();
    expect(screen.getByText(/#77/)).toBeInTheDocument();
    expect(screen.getByText(/#44/)).toBeInTheDocument();
  });

  it('renders position codes', () => {
    render(<SkaterComparison leaders={mockLeaders} />);
    expect(screen.getByText(/#99 LW/)).toBeInTheDocument();
    expect(screen.getByText(/#88 C/)).toBeInTheDocument();
    expect(screen.getByText(/#77 RW/)).toBeInTheDocument();
    expect(screen.getByText(/#44 D/)).toBeInTheDocument();
  });

  it('handles empty leaders array', () => {
    render(<SkaterComparison leaders={[]} />);
    expect(screen.getByText('Skater Stat Leaders')).toBeInTheDocument();
    // Should not crash and should still render the header
  });

  it('handles single category', () => {
    const singleCategory = [mockLeaders[0]];
    render(<SkaterComparison leaders={singleCategory} />);
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.queryByText('Assists')).not.toBeInTheDocument();
    expect(screen.queryByText('Points')).not.toBeInTheDocument();
  });
});
