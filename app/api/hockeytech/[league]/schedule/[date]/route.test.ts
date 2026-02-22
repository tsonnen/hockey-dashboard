import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { NextRequest } from 'next/server';
import type { HockeyTechGame } from '@/app/models/hockeytech-game';

// 1. Mock EVERYTHING before any imports
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: unknown) => ({
      json: async () => data,
      status: 200,
    })),
  },
}));

// 2. Mock the utils to avoid dependencies during route testing
jest.mock('@/app/api/hockeytech/utils', () => ({
  getBaseUrl: jest.fn(() => new URL('https://test.hockeytech.com')),
}));

// 3. Mock the models that might use Next.js internal features
jest.mock('@/app/models/hockeytech-game', () => ({
  convertHockeyTechGame: jest.fn((game: HockeyTechGame) => game),
}));

// We use dynamic imports inside the tests to ensure mocks are applied correctly
// and to avoid top-level environment issues.

describe('Schedule API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  it('calculates parameters correctly for tomorrow when called late at night', async () => {
    const { GET } = await import('./route');
    const { NextResponse } = await import('next/server');

    // Scenario: Today is Feb 21, 17:35 (5:35 PM) PST.
    // This is Feb 22, 01:35 AM UTC.
    const mockNow = new Date('2026-02-21T17:35:13-08:00');
    jest.setSystemTime(mockNow);

    const league = 'ohl';
    const date = '2026-02-22';

    const params = Promise.resolve({ league, date });
    const request = { url: 'http://localhost' } as unknown as NextRequest;

    const mockHTResponse = { SiteKit: { Scorebar: [] } };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockHTResponse,
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    await GET(request, { params });

    const fetchUrl = new URL(mockFetch.mock.calls[0][0] as string);

    expect(fetchUrl.searchParams.get('numberofdaysahead')).toBe('2');
    expect(fetchUrl.searchParams.get('numberofdaysback')).toBe('1');
    expect(NextResponse.json).toHaveBeenCalled();
  });

  it('calculates parameters correctly for a past date', async () => {
    const { GET } = await import('./route');

    const mockNow = new Date('2026-02-21T12:00:00-08:00');
    jest.setSystemTime(mockNow);

    const league = 'ohl';
    const date = '2026-02-19'; // 2 days ago

    const params = Promise.resolve({ league, date });
    const request = { url: 'http://localhost' } as unknown as NextRequest;

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ SiteKit: { Scorebar: [] } }),
    });
    globalThis.fetch = mockFetch as unknown as typeof fetch;

    await GET(request, { params });

    const fetchUrl = new URL(mockFetch.mock.calls[0][0] as string);

    expect(fetchUrl.searchParams.get('numberofdaysback')).toBe('3');
    expect(fetchUrl.searchParams.get('numberofdaysahead')).toBe('1');
  });
});
