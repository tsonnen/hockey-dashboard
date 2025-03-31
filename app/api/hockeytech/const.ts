export enum LEAGUES {
  "OHL" = "ohl",
  "PWHL" = "pwhl",
  "WHL" = "whl",
  "QMJHL" = "qmjhl",
}

export const LEAGUE_KEY_MAPPINGS: {
  [K in LEAGUES]: { key: string; client_code: string };
} = Object.freeze({
  ohl: { key: "2976319eb44abe94", client_code: "ohl" },
  pwhl: { key: "694cfeed58c932ee", client_code: "pwhl" },
  whl: { key: "f1aa699db3d81487", client_code: "whl" },
  qmjhl: { key: "f1aa699db3d81487", client_code: "lhjmq" },
});

export const BASE_URL = "https://lscluster.hockeytech.com/feed";
