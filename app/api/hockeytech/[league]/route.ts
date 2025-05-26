import { NextResponse } from 'next/server';

import type { LEAGUES } from '../const';
import { LEAGUE_KEY_MAPPINGS } from '../const';
import { getKeyAndClientCode } from '../utils';

export async function GET({ params }: { params: { league: LEAGUES } }) {
  return NextResponse.json({ ...getKeyAndClientCode(params.league) });
}
