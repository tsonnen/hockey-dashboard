import { render, screen } from '@testing-library/react';

import { PeriodGoalsDisplay } from '../../components/period-goals-display';
import { Game } from '../../models/game';
import { type Goal, PeriodStats } from '../../models/game-summary';
import { Team } from '../../models/team';
import { GameProviderWrapper } from '../utils/test-utils';

// Mock GoalDisplay since we're testing PeriodGoalsDisplay in isolation
jest.mock('../../components/goal-display', () => ({
  GoalDisplay: ({ goal }: { goal: Goal }) => (
    <div data-testid="goal-display">{goal.timeInPeriod}</div>
  ),
}));

describe('PeriodGoalsDisplay', () => {
  const mockGame = new Game({
    id: 123,
    homeTeam: new Team({
      abbrev: 'TOR',
      commonName: { default: 'Maple Leafs' },
      id: 10,
      placeName: { default: 'Toronto Maple Leafs' },
      radioLink: '',
      awaySplitSquad: false,
      odds: [],
    }),
    awayTeam: new Team({
      abbrev: 'MTL',
      commonName: { default: 'Canadiens' },
      id: 8,
      placeName: { default: 'Montreal Canadiens' },
      radioLink: '',
      awaySplitSquad: false,
      odds: [],
    }),
  });

  const mockGoal: Goal = {
    timeInPeriod: '10:00',
    isHome: true,
    teamAbbrev: { default: 'TOR' },
    name: { default: 'John Doe' },
    goalsToDate: 1,
    homeScore: 1,
    awayScore: 0,
    assists: [],
    eventId: 1,
    firstName: { default: 'John' },
    lastName: { default: 'Doe' },
    playerId: 1,
    headshot: '',
    pptReplayUrl: '',
    shotType: '',
    situationCode: '',
    strength: '',
    goalModifier: '',
    homeTeamDefendingSide: 'left',
  };

  const mockPeriod = new PeriodStats({
    periodDescriptor: {
      number: 1,
      maxRegulationPeriods: 3,
      periodType: 'REGULAR',
    },
    goals: [mockGoal],
    homeShots: 10,
    awayShots: 8,
  });

  const renderWithGame = (game: Game, period: PeriodStats) => {
    return render(
      <GameProviderWrapper initialGame={game}>
        <PeriodGoalsDisplay period={period} />
      </GameProviderWrapper>,
    );
  };

  it('renders loading state when game is not available', () => {
    render(
      <GameProviderWrapper>
        <PeriodGoalsDisplay period={mockPeriod} />
      </GameProviderWrapper>,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders period title correctly', () => {
    renderWithGame(mockGame, mockPeriod);
    expect(screen.getByText('1st')).toBeInTheDocument();
  });

  it('renders goals when they exist', () => {
    renderWithGame(mockGame, mockPeriod);
    const goalDisplay = screen.getByTestId('goal-display');
    expect(goalDisplay).toBeInTheDocument();
    expect(goalDisplay).toHaveTextContent('10:00');
  });

  it('renders no goals message when period has no goals', () => {
    const periodWithoutGoals = new PeriodStats({
      periodDescriptor: mockPeriod.periodDescriptor,
      goals: [],
      homeShots: mockPeriod.homeShots,
      awayShots: mockPeriod.awayShots,
    });
    renderWithGame(mockGame, periodWithoutGoals);
    expect(screen.getByText('No goals scored in this period')).toBeInTheDocument();
    expect(screen.queryByTestId('goal-display')).not.toBeInTheDocument();
  });

  it('renders overtime period title correctly', () => {
    const overtimePeriod = new PeriodStats({
      periodDescriptor: {
        ...mockPeriod.periodDescriptor,
        number: 4,
      },
      goals: mockPeriod.goals,
      homeShots: mockPeriod.homeShots,
      awayShots: mockPeriod.awayShots,
    });
    renderWithGame(mockGame, overtimePeriod);
    expect(screen.getByText('1st OT')).toBeInTheDocument();
  });
});
