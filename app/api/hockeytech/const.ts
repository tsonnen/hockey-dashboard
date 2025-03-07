export enum LEAGUES {
  "OHL" = "ohl",
}

export const LEAGUE_KEY_MAPPINGS: {
  [K in LEAGUES]: { key: string; client_code: string };
} = Object.freeze({
  ohl: { key: "2976319eb44abe94", client_code: "ohl" },
});
