import { render, screen } from '@testing-library/react';

import { GoalDisplay } from '@/app/components/goal-display';
import type { Game } from '@/app/models/game';
import type { Goal, Player } from '@/app/models/game-summary';

// Mock next/image since it's not available in test environment
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-explicit-any
  default: (props: any) => <img {...props} />,
}));

describe('GoalDisplay', () => {
  const mockGame = {
    id: '123',
    homeTeam: {
      id: 1,
      placeName: { default: 'Home Team' },
      logo: '/home-logo.png',
    },
    awayTeam: {
      id: 2,
      placeName: { default: 'Away Team' },
      logo: '/away-logo.png',
    },
  } as unknown as Game;

  const mockGoal = {
    assists: [],
    awayScore: 1,
    eventId: 123,
    firstName: { default: 'John' },
    headshot: '/player-headshot.png',
    homeScore: 0,
    isHome: false,
    lastName: { default: 'Doe' },
    name: { default: 'John Doe' },
    playerId: 456,
    situationCode: 'EV',
    strength: 'EV',
    timeInPeriod: '10:30',
  } as unknown as Goal;

  it('renders a regular even strength goal', () => {
    render(<GoalDisplay game={mockGame} goal={mockGoal} />);

    expect(screen.getByText('10:30')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('(1-0)')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe')).toHaveAttribute('src', '/player-headshot.png');
    expect(screen.getByAltText('Away Team')).toHaveAttribute('src', '/away-logo.png');
  });

  it('renders a power play goal', () => {
    const ppGoal = {
      ...mockGoal,
      situationCode: 'PP',
      strength: 'PP',
    };

    render(<GoalDisplay game={mockGame} goal={ppGoal} />);

    expect(screen.getByText('PP')).toBeInTheDocument();
    expect(screen.getByText('PP')).toHaveClass('text-blue-600');
  });

  it('renders a short-handed goal', () => {
    const shGoal = {
      ...mockGoal,
      situationCode: 'SH',
      strength: 'SH',
    };

    render(<GoalDisplay game={mockGame} goal={shGoal} />);

    expect(screen.getByText('SH')).toBeInTheDocument();
    expect(screen.getByText('SH')).toHaveClass('text-red-600');
  });

  it('renders goal with assists', () => {
    const mockAssists: Player[] = [
      {
        playerId: 789,
        firstName: { default: 'Assist' },
        lastName: { default: 'One' },
        name: { default: 'Assist 1' },
      },
      {
        playerId: 101,
        firstName: { default: 'Assist' },
        lastName: { default: 'Two' },
        name: { default: 'Assist 2' },
      },
    ];

    const goalWithAssists = {
      ...mockGoal,
      assists: mockAssists,
    };

    render(<GoalDisplay game={mockGame} goal={goalWithAssists} />);

    expect(screen.getByText('Assist 1, Assist 2')).toBeInTheDocument();
  });

  it('renders a home team goal', () => {
    const homeGoal = {
      ...mockGoal,
      awayScore: 0,
      homeScore: 1,
      isHome: true,
    };

    render(<GoalDisplay game={mockGame} goal={homeGoal} />);

    expect(screen.getByAltText('Home Team')).toHaveAttribute('src', '/home-logo.png');
    expect(screen.getByText('(0-1)')).toBeInTheDocument();
  });

  it('renders an away team goal', () => {
    const homeGoal = {
      ...mockGoal,
      awayScore: 1,
      homeScore: 0,
      isHome: false,
    };

    render(<GoalDisplay game={mockGame} goal={homeGoal} />);

    expect(screen.getByAltText('Away Team')).toHaveAttribute('src', '/away-logo.png');
    expect(screen.getByText('(1-0)')).toBeInTheDocument();
  });
});
