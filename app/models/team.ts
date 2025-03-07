import { LocalizedName } from "./localized-name";
import { Odds } from "./odds";

export class Team {
  id: number;
  commonName: LocalizedName;
  placeName: LocalizedName;
  placeNameWithPreposition: LocalizedName;
  abbrev: string;
  logo: string;
  darkLogo: string;
  awaySplitSquad: boolean;
  radioLink: string;
  odds: Odds[];

  constructor(data: Partial<Team>) {
    this.id = data.id ?? 0;
    this.commonName = data.commonName ?? { default: "" };
    this.placeName = data.placeName ?? { default: "" };
    this.placeNameWithPreposition = data.placeNameWithPreposition ?? {
      default: "",
    };
    this.abbrev = data.abbrev ?? "";
    this.logo = data.logo ?? "";
    this.darkLogo = data.darkLogo ?? "";
    this.awaySplitSquad = data.awaySplitSquad ?? false;
    this.radioLink = data.radioLink ?? "";
    this.odds = data.odds ?? [];
  }
}
