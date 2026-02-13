import { render, screen } from '@testing-library/react';
import { TeamRoster } from './team-roster';
import { Player } from '@/app/models/team-details';
import { describe, it, expect } from '@jest/globals';

const mockSkaters: Player[] = [
  {
    id: 1,
    firstName: { default: 'Auston' },
    lastName: { default: 'Matthews' },
    sweaterNumber: 34,
    positionCode: 'C',
    gamesPlayed: 50,
    goals: 40,
    assists: 30,
    points: 70,
    hits: 20,
    blocks: 15,
  },
  {
    id: 2,
    firstName: { default: 'Mitch' },
    lastName: { default: 'Marner' },
    sweaterNumber: 16,
    positionCode: 'RW',
    gamesPlayed: 50,
    goals: 20,
    assists: 50,
    points: 70,
    hits: 0, // Should be treated as undefined if all are 0
    blocks: 0,
  },
];

const mockGoalies: Player[] = [
  {
    id: 3,
    firstName: { default: 'Joseph' },
    lastName: { default: 'Woll' },
    sweaterNumber: 60,
    positionCode: 'G',
    gamesPlayed: 20,
    wins: 12,
    losses: 5,
    savePct: 0.915,
    gaa: 2.5,
  },
];

describe('TeamRoster', () => {
  it('renders skaters and goalies tables', () => {
    render(
      <TeamRoster
        roster={{ forwards: [mockSkaters[0]], defensemen: [mockSkaters[1]], goalies: mockGoalies }}
      />,
    );
    expect(screen.getByText('Skaters')).toBeInTheDocument();
    expect(screen.getByText('Goalies')).toBeInTheDocument();
    expect(screen.getByText('Auston Matthews')).toBeInTheDocument();
    expect(screen.getByText('Joseph Woll')).toBeInTheDocument();
  });

  it('hides columns when all values are undefined or null', () => {
    // In this case, hits and blocks are provided for at least one player in mockSkaters[0]
    const { rerender } = render(
      <TeamRoster roster={{ forwards: [mockSkaters[0]], defensemen: [], goalies: [] }} />,
    );
    expect(screen.getByText('HIT')).toBeInTheDocument();
    expect(screen.getByText('BLK')).toBeInTheDocument();

    // Rerender with only players who have undefined hits/blocks
    const playerWithNoHits = { ...mockSkaters[1], hits: undefined, blocks: undefined };
    rerender(<TeamRoster roster={{ forwards: [playerWithNoHits], defensemen: [], goalies: [] }} />);
    expect(screen.queryByText('HIT')).not.toBeInTheDocument();
    expect(screen.queryByText('BLK')).not.toBeInTheDocument();
  });

  it('formats save percentage to 3 decimal places', () => {
    render(<TeamRoster roster={{ forwards: [], defensemen: [], goalies: mockGoalies }} />);
    expect(screen.getByText('0.915')).toBeInTheDocument();
  });
});
