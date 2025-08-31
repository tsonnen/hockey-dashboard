import { render, screen } from '@testing-library/react';

import { TeamScoringRow } from '@/app/components/team-scoring-row';
import type { Goal } from '@/app/models/game-summary';
import { Team } from '@/app/models/team';

// Mock TeamCell since we're testing TeamScoringRow in isolation
jest.mock('@/app/components/team-cell', () => ({
  TeamCell: ({ abbrev }: { abbrev: string }) => <td data-testid="team-cell">{abbrev}</td>,
}));

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

  it('renders home team scoring row correctly', () => {
    render(
      <table>
        <tbody>
          <TeamScoringRow isHome={true} periods={mockPeriods} team={mockTeam} />
        </tbody>
      </table>,
    );

    // Check team cell
    const teamCell = screen.getByTestId('team-cell');
    expect(teamCell).toHaveTextContent('TOR');

    // Check period scores
    const periodScores = screen.getAllByRole('cell').slice(1, -1); // Exclude team cell and total
    expect(periodScores).toHaveLength(2);
    expect(periodScores[0]).toHaveTextContent('1'); // First period home goals
    expect(periodScores[1]).toHaveTextContent('1'); // Second period home goals

    // Check total score
    const totalScore = screen.getAllByRole('cell').pop();
    expect(totalScore).toHaveTextContent('3');
    expect(totalScore).toHaveClass('font-bold');
  });

  it('renders away team scoring row correctly', () => {
    render(
      <table>
        <tbody>
          <TeamScoringRow isHome={false} periods={mockPeriods} team={mockTeam} />
        </tbody>
      </table>,
    );

    // Check team cell
    const teamCell = screen.getByTestId('team-cell');
    expect(teamCell).toHaveTextContent('TOR');

    // Check period scores
    const periodScores = screen.getAllByRole('cell').slice(1, -1); // Exclude team cell and total
    expect(periodScores).toHaveLength(2);
    expect(periodScores[0]).toHaveTextContent('2'); // First period away goals
    expect(periodScores[1]).toHaveTextContent('0'); // Second period away goals

    // Check total score
    const totalScore = screen.getAllByRole('cell').pop();
    expect(totalScore).toHaveTextContent('3');
    expect(totalScore).toHaveClass('font-bold');
  });
});
