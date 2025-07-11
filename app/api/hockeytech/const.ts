export enum LEAGUES {
  'OHL' = 'ohl',
  'PWHL' = 'pwhl',
  'WHL' = 'whl',
  'QMJHL' = 'qmjhl',
  'AHL' = 'ahl',
  'ECHL' = 'echl',
}

// Going back and forth on the right way to handle this. If these were my own API keys, then hiding them
// would be an easy choice, but since these are publicly available, I'm not sure...
export const LEAGUE_KEY_MAPPINGS: Record<LEAGUES, { key: string; client_code: string }> =
  Object.freeze({
    ohl: { key: '2976319eb44abe94', client_code: 'ohl' },
    pwhl: { key: '694cfeed58c932ee', client_code: 'pwhl' },
    whl: { key: 'f1aa699db3d81487', client_code: 'whl' },
    qmjhl: { key: 'f1aa699db3d81487', client_code: 'lhjmq' },
    ahl: { key: 'ccb91f29d6744675', client_code: 'ahl' },
    echl: { key: '2c2b89ea7345cae8', client_code: 'echl' },
  });

export const BASE_URL = 'https://lscluster.hockeytech.com/feed';
