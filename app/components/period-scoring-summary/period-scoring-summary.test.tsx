import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

import { GameProviderWrapper } from '@/app/__tests__/utils/test-utils';
import { PeriodScoringSummary } from '@/app/components/period-scoring-summary';
import { Game } from '@/app/models/game';
import { PeriodStats } from '@/app/models/game-summary';
import ordinal_suffix_of from '@/app/utils/ordinal-suffix-of';

describe('PeriodScoringSummary', () => {
  const mockGame = {
    id: '123',
    homeTeam: {
      id: 1,
      placeName: { default: 'Home Team' },
      logo: '/home-logo.png',
      abbrev: 'HOM',
    },
    awayTeam: {
      id: 2,
      placeName: { default: 'Away Team' },
      logo: '/away-logo.png',
      abbrev: 'AWY',
    },
    summary: {
      scoring: [
        new PeriodStats({
          periodDescriptor: {
            number: 1,
            periodType: 'REG',
            maxRegulationPeriods: 3,
          },
          goals: [],
        }),
        new PeriodStats({
          periodDescriptor: {
            number: 2,
            periodType: 'REG',
            maxRegulationPeriods: 3,
          },
          goals: [],
        }),
        new PeriodStats({
          periodDescriptor: {
            number: 3,
            periodType: 'REG',
            maxRegulationPeriods: 3,
          },
          goals: [],
        }),
      ],
    },
  } as unknown as Game;

  const renderWithGame = (game: Game): ReturnType<typeof render> => {
    return render(
      <GameProviderWrapper initialGame={game}>
        <PeriodScoringSummary />
      </GameProviderWrapper>,
    );
  };

  it('renders loading state when game is not available', () => {
    render(
      <GameProviderWrapper>
        <PeriodScoringSummary />
      </GameProviderWrapper>,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders a table with all periods', () => {
    renderWithGame(mockGame);

    // Check if all period headers are present
    expect(screen.getByText('Team')).toBeInTheDocument();
    for (let i = 1; i <= 3; i++) {
      expect(screen.getByText(ordinal_suffix_of(i))).toBeInTheDocument();
    }

    // Check if team abbreviations are present
    expect(screen.getByText('HOM')).toBeInTheDocument();
    expect(screen.getByText('AWY')).toBeInTheDocument();
  });

  it('renders empty periods correctly', () => {
    const gameWithOnePeriod = new Game({
      ...mockGame,
      summary: {
        scoring: [
          new PeriodStats({
            periodDescriptor: {
              number: 1,
              periodType: 'REG',
              maxRegulationPeriods: 3,
            },
            goals: [],
          }),
        ],
        shootout: [],
        threeStars: [],
        penalties: [],
      },
    });

    renderWithGame(gameWithOnePeriod);

    // Should still show all period headers
    for (let i = 1; i <= 3; i++) {
      expect(screen.getByText(ordinal_suffix_of(i))).toBeInTheDocument();
    }
    expect(screen.getByText('Total')).toBeInTheDocument();
  });
});
