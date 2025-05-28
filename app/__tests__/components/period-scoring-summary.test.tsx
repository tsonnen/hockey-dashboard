import { render, screen } from '@testing-library/react';

import { PeriodScoringSummary } from '@/app/components/period-scoring-summary';
import type { Game } from '@/app/models/game';
import { PeriodStats } from '@/app/models/game-summary';

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

  it('renders null when game summary is not available', () => {
    const gameWithoutSummary = { ...mockGame, summary: undefined };
    const { container } = render(<PeriodScoringSummary game={gameWithoutSummary} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders null when scoring summary is not available', () => {
    const gameWithoutScoring = { ...mockGame, summary: { scoring: undefined } };
    const { container } = render(<PeriodScoringSummary game={gameWithoutScoring} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a table with all periods', () => {
    render(<PeriodScoringSummary game={mockGame} />);
    
    // Check if all period headers are present
    expect(screen.getByText('1st')).toBeInTheDocument();
    expect(screen.getByText('2nd')).toBeInTheDocument();
    expect(screen.getByText('3rd')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();

    // Check if team abbreviations are present
    expect(screen.getByText('HOM')).toBeInTheDocument();
    expect(screen.getByText('AWY')).toBeInTheDocument();
  });

  it('adds missing periods to ensure 3 regulation periods are shown', () => {
    const gameWithOnePeriod = {
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
      },
    } as unknown as Game;

    render(<PeriodScoringSummary game={gameWithOnePeriod} />);
    
    // Should still show all three periods
    expect(screen.getByText('1st')).toBeInTheDocument();
    expect(screen.getByText('2nd')).toBeInTheDocument();
    expect(screen.getByText('3rd')).toBeInTheDocument();
  });
}); 