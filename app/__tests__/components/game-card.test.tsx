import { render, screen, fireEvent } from '@testing-library/react';

import { GameCard } from '../../components/game-card/game-card';
import { Game } from '../../models/game';
import { GameState } from '../../models/game-state';
import { Team } from '../../models/team';

// Mock TeamDisplay
jest.mock('../../components/team-display/team-display', () => ({
  TeamDisplay: ({ team }: { team: Team }) => (
    <div data-testid={`team-display-${team.abbrev}`}>{team.placeName.default}</div>
  ),
}));

// Mock next/navigation
const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

describe('GameCard', () => {
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
  const game = new Game({
    id: 123,
    league: 'NHL',
    homeTeam,
    awayTeam,
    gameState: GameState.FUTURE,
    period: 1,
    clock: {
      timeRemaining: '20:00',
      secondsRemaining: 1200,
      running: false,
      inIntermission: false,
    },
  });

  beforeEach(() => {
    push.mockClear();
  });

  it('renders both teams', () => {
    render(<GameCard game={game} />);
    expect(screen.getByTestId('team-display-TOR')).toHaveTextContent('Toronto Maple Leafs');
    expect(screen.getByTestId('team-display-MTL')).toHaveTextContent('Montreal Canadiens');
  });

  it('navigates to game page on click', () => {
    render(<GameCard game={game} />);
    fireEvent.click(screen.getByRole('button'));
    expect(push).toHaveBeenCalledWith('/game/NHL/123');
  });

  it('navigates to game page on Enter key', () => {
    render(<GameCard game={game} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(push).toHaveBeenCalledWith('/game/NHL/123');
  });

  it('navigates to game page on Space key', () => {
    render(<GameCard game={game} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(push).toHaveBeenCalledWith('/game/NHL/123');
  });

  it('shows game status string', () => {
    render(<GameCard game={game} />);
    expect(screen.getByText(game.statusString)).toBeInTheDocument();
  });

  it('shows clock and period if game is in progress', () => {
    const liveGame = new Game({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...game,
      gameState: GameState.LIVE,
      period: 2,
      clock: {
        timeRemaining: '12:34',
        secondsRemaining: 754,
        running: true,
        inIntermission: false,
      },
    });
    render(<GameCard game={liveGame} />);
    expect(screen.getByText('12:34')).toBeInTheDocument();
    expect(screen.getByText('Period 2')).toBeInTheDocument();
  });
});
