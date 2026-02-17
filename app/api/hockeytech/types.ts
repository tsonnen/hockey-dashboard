export interface HockeyTechBaseRow extends Record<string, unknown> {
  id?: string | number;
  season_id?: string | number;
}

export interface HockeyTechPlayerRow extends HockeyTechBaseRow {
  player_id?: string | number;
  person_id?: string | number;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  name?: string;
  player_name?: string;
  jersey?: string | number;
  tp_jersey_number?: string | number;
  position?: string;
  role?: string;
  face_image?: string;
  image_url?: string;
  // Stats
  games_played?: string | number;
  goals?: string | number;
  assists?: string | number;
  points?: string | number;
  plus_minus?: string | number;
  penalty_minutes?: string | number;
  // Goalie
  save_percentage?: string | number;
  goals_against_average?: string | number;
  wins?: string | number;
  losses?: string | number;
  shots?: string | number;
  saves?: string | number;
  shutouts?: string | number;
}

export interface HockeyTechGameRow extends HockeyTechBaseRow {
  game_id?: string | number;
  date_played?: string;
  date?: string;
  GameDateISO8601?: string;
  game_status?: string | number;
  status?: string | number;
  home_team?: string | number;
  home_team_id?: string | number;
  visiting_team?: string | number;
  visiting_team_id?: string | number;
  home_goal_count?: string | number;
  visiting_goal_count?: string | number;
  home_team_code?: string;
  home_team_abbrev?: string;
  visiting_team_code?: string;
  visiting_team_abbrev?: string;
  // Box score specific
  period?: string | number;
  clock?: string;
}

export type HockeyTechRow = HockeyTechPlayerRow | HockeyTechGameRow | Record<string, unknown>;
