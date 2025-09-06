import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';

import { GameCard } from '@/app/components/game-card/game-card';
import { Game } from '@/app/models/game';
import { GameState } from '@/app/models/game-state';
import { Team } from '@/app/models/team';

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
    globalThis.resetRouterMocks();
  });

  it('renders both teams', () => {
    render(<GameCard game={game} />);
    expect(screen.getByAltText('Toronto Maple Leafs logo')).toBeInTheDocument();
    expect(screen.getByAltText('Montreal Canadiens logo')).toBeInTheDocument();
  });

  it('navigates to game page on click', () => {
    render(<GameCard game={game} />);
    fireEvent.click(screen.getByRole('button'));
    expect(globalThis.mockRouter.push).toHaveBeenCalledWith('/game/NHL/123');
  });

  it('shows game status string', () => {
    render(<GameCard game={game} />);
    expect(screen.getByText(game.statusString)).toBeInTheDocument();
  });

  it('shows clock and period if game is in progress', () => {
    const liveGame = new Game({
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
