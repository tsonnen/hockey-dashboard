import type { GameMatchup, StatLeaderProps } from './game-matchup';

interface HockeyTechLeadingScorer {
  player_id: string;
  first_name: string;
  last_name: string;
  jersey_number: string;
  goals: number;
  assists: number;
  points: number;
  penalty_minutes: number;
  rookie: string;
}

interface HockeyTechTeamPreview {
  team_id: string;
  name: string;
  city: string;
  team_code: string;
  nickname: string;
  leadingScorers: HockeyTechLeadingScorer[];
}

interface HockeyTechPreviewData {
  home_team: HockeyTechTeamPreview;
  visitor_team: HockeyTechTeamPreview;
  current_season: {
    id: string;
    season_name: string;
  };
}

export interface HockeyTechGamePreview {
  GC: {
    Preview: HockeyTechPreviewData;
  };
}

function convertLeadingScorer(
  scorer: HockeyTechLeadingScorer,
  statType: 'goals' | 'assists' | 'points',
  league: string,
): StatLeaderProps {
  return {
    playerId: Number(scorer.player_id),
    headshot: `https://assets.leaguestat.com/${league}/120x160/${scorer.player_id}.jpg`, // HockeyTech preview doesn't provide headshot URLs
    positionCode: '', // Position not provided in preview
    sweaterNumber: Number(scorer.jersey_number),
    name: {
      default: `${scorer.first_name} ${scorer.last_name}`,
    },
    value: String(scorer[statType]),
  };
}

export function convertHockeyTechGamePreview(
  data: HockeyTechGamePreview,
  league: string,
): Partial<GameMatchup> {
  const preview = data.GC.Preview;

  // Get top scorers for each category
  const homeScorers = preview.home_team.leadingScorers;
  const awayScorers = preview.visitor_team.leadingScorers;

  // Find leaders for each category
  const categories: Array<{ category: string; key: 'goals' | 'assists' | 'points' }> = [
    { category: 'Goals', key: 'goals' },
    { category: 'Assists', key: 'assists' },
    { category: 'Points', key: 'points' },
  ];

  const leaders = categories.map(({ category, key }) => {
    // Sort to find top scorer for each team
    const homeLeader = [...homeScorers].sort((a, b) => b[key] - a[key])[0];
    const awayLeader = [...awayScorers].sort((a, b) => b[key] - a[key])[0];

    return {
      category,
      homeLeader: convertLeadingScorer(homeLeader, key, league),
      awayLeader: convertLeadingScorer(awayLeader, key, league),
    };
  });

  return {
    season: Number(preview.current_season.id),
    gameType: undefined, // HockeyTech doesn't provide game types. We need to find a way to leverage the season ID to determine this later.
    skaterComparison: {
      contextLabel: preview.current_season.season_name,
      contextSeason: Number(preview.current_season.id),
      leaders,
    },
    // Goalie comparison not available in preview data
    goalieComparison: undefined,
  };
}
