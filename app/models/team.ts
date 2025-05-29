import type { LocalizedName } from './localized-name';
import type { Odds } from './odds';

export class Team {
  id: number;
  commonName: LocalizedName;
  placeName: LocalizedName;
  placeNameWithPreposition?: LocalizedName;
  name?: LocalizedName;
  abbrev: string;
  logo?: string;
  darkLogo?: string;
  awaySplitSquad: boolean;
  radioLink: string;
  odds: Odds[];
  score?: number;
  sog?: number;

  constructor(data: Partial<Team>) {
    this.id = data.id ?? 0;
    this.commonName = data.commonName ?? { default: '' };
    this.placeName = data.placeName ?? { default: '' };
    this.placeNameWithPreposition = data.placeNameWithPreposition;
    this.name = data.name;
    this.abbrev = data.abbrev ?? '';
    this.logo = data.logo;
    this.darkLogo = data.darkLogo;
    this.awaySplitSquad = data.awaySplitSquad ?? false;
    this.radioLink = data.radioLink ?? '';
    this.odds = data.odds ?? [];
    this.score = data.score;
    this.sog = data.sog;
  }
}
