import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { GoalieComparison } from './goalie-comparison';
import type { GoalieComparisonProps } from '@/app/models/game-matchup';

describe('GoalieComparison', () => {
  const mockHomeTeam: GoalieComparisonProps['homeTeam'] = {
    leaders: [
      {
        playerId: 101,
        headshot: '/goalie1.jpg',
        positionCode: 'G',
        sweaterNumber: 30,
        name: { default: 'John Doe' },
        gamesPlayed: 25,
        seasonPoints: 50,
        record: '15-8-2',
        gaa: 2.45,
        savePctg: 0.915,
        shutouts: 3,
      },
      {
        playerId: 102,
        headshot: '/goalie2.jpg',
        positionCode: 'G',
        sweaterNumber: 31,
        name: { default: 'Jane Smith' },
        gamesPlayed: 25,
        seasonPoints: 48,
        record: '14-9-2',
        gaa: 2.78,
        savePctg: 0.905,
        shutouts: 2,
      },
    ],
  };

  const mockAwayTeam: GoalieComparisonProps['awayTeam'] = {
    leaders: [
      {
        playerId: 201,
        headshot: '/goalie3.jpg',
        positionCode: 'G',
        sweaterNumber: 1,
        name: { default: 'Bob Johnson' },
        gamesPlayed: 30,
        seasonPoints: 55,
        record: '18-10-2',
        gaa: 2.15,
        savePctg: 0.925,
        shutouts: 5,
      },
    ],
  };

  it('renders goalie section header', () => {
    render(<GoalieComparison homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />);
    expect(screen.getByText('Goalies')).toBeInTheDocument();
  });

  it('renders away team header', () => {
    render(<GoalieComparison homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />);
    expect(screen.getByText('Away Team')).toBeInTheDocument();
  });

  it('renders home team header', () => {
    render(<GoalieComparison homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />);
    expect(screen.getByText('Home Team')).toBeInTheDocument();
  });

  it('renders all home goalies who have played', () => {
    render(<GoalieComparison homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders all away goalies who have played', () => {
    render(<GoalieComparison homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />);
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('displays GAA stats', () => {
    render(<GoalieComparison homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />);
    expect(screen.getAllByText(/GAA/).length).toBeGreaterThan(0);
    expect(screen.getByText(/2\.45/)).toBeInTheDocument();
    expect(screen.getByText(/2\.15/)).toBeInTheDocument();
  });

  it('displays save percentage stats', () => {
    render(<GoalieComparison homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />);
    expect(screen.getAllByText(/SVP/).length).toBeGreaterThan(0);
    expect(screen.getByText(/0\.915/)).toBeInTheDocument();
    expect(screen.getByText(/0\.925/)).toBeInTheDocument();
  });

  it('filters out goalies with no games played', () => {
    const homeTeamWithBackup: GoalieComparisonProps['homeTeam'] = {
      ...mockHomeTeam,
      leaders: [
        ...mockHomeTeam.leaders,
        {
          playerId: 103,
          headshot: '/goalie4.jpg',
          positionCode: 'G',
          sweaterNumber: 32,
          name: { default: 'Backup Goalie' },
          gamesPlayed: 0,
          seasonPoints: 0,
          record: '0-0-0',
          gaa: 0,
          savePctg: 0,
          shutouts: 0,
        },
      ],
    };

    render(<GoalieComparison homeTeam={homeTeamWithBackup} awayTeam={mockAwayTeam} />);
    expect(screen.queryByText('Backup Goalie')).not.toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders jersey numbers for goalies', () => {
    render(<GoalieComparison homeTeam={mockHomeTeam} awayTeam={mockAwayTeam} />);
    expect(screen.getByText(/#30/)).toBeInTheDocument();
    expect(screen.getByText(/#31/)).toBeInTheDocument();
    expect(screen.getByText(/#1/)).toBeInTheDocument();
  });

  it('renders nothing when no goalies have played games', () => {
    const emptyTeam: GoalieComparisonProps['homeTeam'] = { leaders: [] };
    const { container } = render(<GoalieComparison homeTeam={emptyTeam} awayTeam={emptyTeam} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('Goalies')).not.toBeInTheDocument();
  });
});
