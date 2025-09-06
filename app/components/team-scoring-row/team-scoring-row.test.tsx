import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

import { TeamScoringRow } from '@/app/components/team-scoring-row';
import type { Goal } from '@/app/models/game-summary';
import { Team } from '@/app/models/team';

describe('TeamScoringRow', () => {
  const mockTeam = new Team({
    abbrev: 'TOR',
    commonName: { default: 'Maple Leafs' },
    id: 10,
    logo: '/images/leafs.png',
    placeName: { default: 'Toronto Maple Leafs' },
    radioLink: '',
    awaySplitSquad: false,
    odds: [],
    score: 3,
  });

  const mockGoal: Goal = {
    assists: [],
    awayScore: 0,
    eventId: 1,
    firstName: { default: 'John' },
    goalsToDate: 1,
    headshot: '',
    homeScore: 1,
    isHome: true,
    lastName: { default: 'Doe' },
    name: { default: 'John Doe' },
    playerId: 1,
    pptReplayUrl: '',
    shotType: '',
    situationCode: '',
    strength: '',
    teamAbbrev: { default: 'TOR' },
    timeInPeriod: '10:00',
    goalModifier: '',
    homeTeamDefendingSide: 'left',
  };

  const mockPeriods = [
    {
      homeGoals: [mockGoal],
      awayGoals: [
        { ...mockGoal, isHome: false },
        { ...mockGoal, isHome: false },
      ],
    },
    {
      homeGoals: [mockGoal],
      awayGoals: [],
    },
  ];

  for (const isHome of [true, false]) {
    it(`it renders with isHome=${isHome}`, () => {
      render(
        <table>
          <tbody>
            <TeamScoringRow isHome={isHome} periods={mockPeriods} team={mockTeam} />
          </tbody>
        </table>,
      );

      // Check team cell
      const teamCell = screen.getByText('TOR');
      expect(teamCell).toBeInTheDocument();

      // Check period scores
      const periodScores = screen.getAllByTestId('period-score');
      expect(periodScores).toHaveLength(2);
      expect(periodScores[0]).toHaveTextContent(isHome ? '1' : '2'); // First period goals
      expect(periodScores[1]).toHaveTextContent(isHome ? '1' : '0'); // Second period goals

      // Check total score
      const totalScore = screen.getByTestId('total-score');
      expect(totalScore).toHaveTextContent('3');
      expect(totalScore).toHaveClass('font-bold');
    });
  }
});
