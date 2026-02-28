/** @jest-environment node */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Game } from '@/app/models/game';
import { GET } from './route';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
globalThis.fetch = mockFetch;

function getUrl(input: RequestInfo | URL) {
  if (typeof input === 'string') {
    return input;
  }

  if ('url' in input) {
    return input.url;
  }

  return input.toString();
}

describe('NHL API Route - Buffering', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch schedules for today and yesterday, and scores for yesterday, today, and tomorrow', async () => {
    const date = '2025-02-10';
    const mockParams = Promise.resolve({ date });

    mockFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = getUrl(input);
      if (url.includes('/schedule/2025-02-09')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ gameWeek: [{ date: '2025-02-09', games: [{ id: 101 }] }] }),
        } as Response);
      }
      if (url.includes('/schedule/2025-02-10')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ gameWeek: [{ date: '2025-02-10', games: [{ id: 102 }] }] }),
        } as Response);
      }
      if (url.includes('/score/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ games: [] }),
        } as Response);
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });

    const response = await GET(new Request('http://localhost'), { params: mockParams });
    const data = await response.json();

    // Verify calls
    expect(mockFetch).toHaveBeenCalledWith('https://api-web.nhle.com/v1/schedule/2025-02-09');
    expect(mockFetch).toHaveBeenCalledWith('https://api-web.nhle.com/v1/schedule/2025-02-10');
    expect(mockFetch).toHaveBeenCalledWith('https://api-web.nhle.com/v1/score/2025-02-09');
    expect(mockFetch).toHaveBeenCalledWith('https://api-web.nhle.com/v1/score/2025-02-10');
    expect(mockFetch).toHaveBeenCalledWith('https://api-web.nhle.com/v1/score/2025-02-11');

    // Verify merging/deduplication
    expect(data).toHaveLength(2);
    expect(data.map((g: Game) => g.id)).toContain(101);
    expect(data.map((g: Game) => g.id)).toContain(102);
  });

  it('should merge score data into games', async () => {
    const date = '2025-02-10';
    const mockParams = Promise.resolve({ date });

    mockFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = getUrl(input);
      if (url.includes('/schedule/2025-02-10')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              gameWeek: [
                { date: '2025-02-10', games: [{ id: 102, startTimeUTC: '2025-02-10T19:00:00Z' }] },
              ],
            }),
        } as Response);
      }
      if (url.includes('/score/2025-02-10')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              games: [
                { id: 102, gameState: 'LIVE', homeTeam: { score: 2 }, awayTeam: { score: 1 } },
              ],
            }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ gameWeek: [], games: [] }),
      } as Response);
    });

    const response = await GET(new Request('http://localhost'), { params: mockParams });
    const data = await response.json();

    expect(data[0].id).toBe(102);
    expect(data[0].gameState).toBe('LIVE');
    expect(data[0].homeTeam.score).toBe(2);
    expect(data[0].awayTeam.score).toBe(1);
  });
});
