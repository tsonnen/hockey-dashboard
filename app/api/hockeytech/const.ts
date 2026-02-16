export enum LEAGUES {
  'OHL' = 'ohl',
  'PWHL' = 'pwhl',
  'WHL' = 'whl',
  'QMJHL' = 'qmjhl',
  'AHL' = 'ahl',
  'ECHL' = 'echl',
}

// These are publicly available API keys for HockeyTech's public endpoints.
// They are safe to commit to version control as they are not sensitive credentials.
// These keys are used to identify which league's data to fetch from the public API.
// See /external-api-docs/hockeyTechApi.md for more information on the API and its endpoints.
export const LEAGUE_KEY_MAPPINGS: Record<LEAGUES, { key: string; client_code: string }> =
  Object.freeze({
    ohl: { key: '2976319eb44abe94', client_code: 'ohl' },
    pwhl: { key: '694cfeed58c932ee', client_code: 'pwhl' },
    whl: { key: '41b145a848f4bd67', client_code: 'whl' },
    qmjhl: { key: 'f1aa699db3d81487', client_code: 'lhjmq' },
    ahl: { key: 'ccb91f29d6744675', client_code: 'ahl' },
    echl: { key: '2c2b89ea7345cae8', client_code: 'echl' },
  });

export const BASE_URL = 'https://lscluster.hockeytech.com/feed';
