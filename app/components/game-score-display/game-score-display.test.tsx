import { render, screen } from '@testing-library/react';

import { GameProviderWrapper } from '@/app/__tests__/utils/test-utils';
import { GameScoreDisplay } from '@/app/components/game-score-display/game-score-display';
import { Game } from '@/app/models/game';
import { GameState } from '@/app/models/game-state';
import { Team } from '@/app/models/team';
import { describe, it, expect } from '@jest/globals';

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

  const renderWithGame = (game: Game): ReturnType<typeof render> => {
    return render(
      <GameProviderWrapper initialGame={game}>
        <GameScoreDisplay />
      </GameProviderWrapper>,
    );
  };

  it('renders loading state when game is not available', () => {
    render(
      <GameProviderWrapper>
        <GameScoreDisplay />
      </GameProviderWrapper>,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders game information correctly', () => {
    const game = new Game({ homeTeam, awayTeam, gameState: GameState.LIVE });
    renderWithGame(game);

    expect(screen.getByText('Toronto Maple Leafs')).toBeInTheDocument();
    expect(screen.getByText('Montreal Canadiens')).toBeInTheDocument();
    expect(screen.getByTestId('game-date')).toBeInTheDocument();
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
    expect(screen.getByText('SOG: 25')).toBeInTheDocument();
    expect(screen.getByText('SOG: 30')).toBeInTheDocument();
  });

  it('renders does not render score if game has not started', () => {
    const game = new Game({ homeTeam, awayTeam, gameState: GameState.FUTURE });
    renderWithGame(game);

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
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(screen.queryByText('SOG: 25')).not.toBeInTheDocument();
    expect(screen.queryByText('SOG: 30')).not.toBeInTheDocument();
  });

  it('shows game status string', () => {
    const game = new Game({ homeTeam, awayTeam });
    renderWithGame(game);
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
    renderWithGame(game);
    expect(screen.getByText('12:34')).toBeInTheDocument();
    expect(screen.getByText('Period 2')).toBeInTheDocument();
  });
});
