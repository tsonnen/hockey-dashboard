import { render, screen } from '@testing-library/react';

import { GameScoreDisplay } from '../../components/game-score-display/game-score-display';
import { Game } from '../../models/game';
import { GameState } from '../../models/game-state';
import { GameSummary } from '../../models/game-summary';
import { Team } from '../../models/team';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill: _fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} />;
  },
}));

describe('GameScoreDisplay', () => {
  const homeTeam = new Team({
    id: 1,
    abbrev: 'TOR',
    placeName: { default: 'Toronto Maple Leafs' },
    logo: '/images/leafs.png',
    score: 2,
    sog: 25,
    commonName: { default: 'Leafs' },
    radioLink: '',
    awaySplitSquad: false,
    odds: [],
  });
  const awayTeam = new Team({
    id: 2,
    abbrev: 'MTL',
    placeName: { default: 'Montreal Canadiens' },
    logo: '/images/habs.png',
    score: 3,
    sog: 30,
    commonName: { default: 'Canadiens' },
    radioLink: '',
    awaySplitSquad: false,
    odds: [],
  });

  const summary = new GameSummary({
    scoring: [
      {
        periodDescriptor: { number: 1, maxRegulationPeriods: 3, periodType: 'REGULAR' },
        goals: [
          { isHome: true, ...baseGoal('10:00', 'TOR') },
          { isHome: false, ...baseGoal('12:00', 'MTL') },
        ],
      },
      {
        periodDescriptor: { number: 2, maxRegulationPeriods: 3, periodType: 'REGULAR' },
        goals: [{ isHome: true, ...baseGoal('15:00', 'TOR') }],
      },
    ],
    shootout: [],
    threeStars: [],
    penalties: [],
  });

  function baseGoal(timeInPeriod: string, team: string) {
    return {
      timeInPeriod,
      teamAbbrev: { default: team },
      name: { default: 'Player' },
      goalsToDate: 1,
      homeScore: 1,
      awayScore: 1,
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
  }

  it('renders team names, logos, and scores', () => {
    const game = new Game({ homeTeam, awayTeam });
    render(<GameScoreDisplay game={game} />);
    expect(screen.getByText('Toronto Maple Leafs')).toBeInTheDocument();
    expect(screen.getByText('Montreal Canadiens')).toBeInTheDocument();
    expect(screen.getByAltText('Toronto Maple Leafs logo')).toHaveAttribute(
      'src',
      '/images/leafs.png',
    );
    expect(screen.getByAltText('Montreal Canadiens logo')).toHaveAttribute(
      'src',
      '/images/habs.png',
    );
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders SOG for both teams', () => {
    const game = new Game({ homeTeam, awayTeam });
    render(<GameScoreDisplay game={game} />);
    expect(screen.getByText('SOG: 25')).toBeInTheDocument();
    expect(screen.getByText('SOG: 30')).toBeInTheDocument();
  });

  it('calculates scores from summary if present', () => {
    const game = new Game({ homeTeam, awayTeam, summary });
    render(<GameScoreDisplay game={game} />);
    // 2 home goals, 1 away goal in summary
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows game status string', () => {
    const game = new Game({ homeTeam, awayTeam });
    render(<GameScoreDisplay game={game} />);
    expect(screen.getByText(game.statusString)).toBeInTheDocument();
  });

  it('shows clock and period if game is in progress', () => {
    const game = new Game({
      homeTeam,
      awayTeam,
      clock: {
        timeRemaining: '12:34',
        secondsRemaining: 754,
        running: true,
        inIntermission: false,
      },
      gameState: GameState.LIVE,
      period: 2,
    });
    render(<GameScoreDisplay game={game} />);
    expect(screen.getByText('12:34')).toBeInTheDocument();
    expect(screen.getByText('Period 2')).toBeInTheDocument();
  });
});
