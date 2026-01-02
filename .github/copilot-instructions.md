# Hockey Dashboard - AI Coding Instructions

## Project Overview

A Next.js 15 app that displays hockey games across multiple North American leagues (NHL, OHL, WHL, QMJHL, AHL, ECHL, PWHL) with real-time scores and game details. Uses pnpm, React 19 RC, TypeScript, and Tailwind CSS.

## Tone

- Be as clear and concise as possible.
- Talk as though you've been skating since you were able to walk.
- Use hockey analogies where appropriate; please overdo it.
- Prioritize readability and maintainability.
- Don't sacrifice clarity for cleverness.
- Follow established patterns in the codebase.
- When in doubt, refer to existing implementations for guidance.
- Don't be high on your own supply—keep it humble and practical.

## Architecture

### Data Flow & API Integration

- **Dual API Pattern**: NHL data fetched from `api-web.nhle.com`, all other leagues from HockeyTech API (`lscluster.hockeytech.com`)
- **Data Normalization**: Both APIs return different schemas - convert to unified `Game` class model (see [app/models/game.ts](app/models/game.ts))
  - NHL: Direct `Game` class construction in [app/api/nhl/week/[date]/route.ts](app/api/nhl/week/[date]/route.ts)
  - HockeyTech: Convert via `convertHockeyTechGame()` and `convertHockeyTechGameDetails()` helpers
- **API Keys**: HockeyTech keys in [app/api/hockeytech/const.ts](app/api/hockeytech/const.ts) are public and safe to commit - they identify league endpoints, not auth credentials

### Route Structure

- Dynamic routes: `/game/[league]/[id]` - league parameter switches between NHL and HockeyTech endpoints
- API routes follow pattern: `/api/{provider}/{league}/...` where provider is `nhl` or `hockeytech`
- Date-based fetching: Use `calculateDaysByDate()` utility to determine buffer windows for API queries

### State Management

- `GameContext` ([app/contexts/game-context.tsx](app/contexts/game-context.tsx)) provides game state to detail pages
- Client-side state: localStorage persists selected leagues filter
- URL state: Date parameter in search params (`?date=YYYY-MM-DD`)

## Development Patterns

### Component Structure

- Components live in `app/components/{name}/` with co-located `.tsx`, `.module.css`, `.test.tsx`, and `index.ts`
- Export pattern: Named export from implementation file, re-export from `index.ts`
- Example: `GameCard` in [app/components/game-card/game-card.tsx](app/components/game-card/game-card.tsx)

### Model Classes

- Domain models in `app/models/` - prefer classes (`Game`, `Team`, `Play`) over plain interfaces for behavior encapsulation
- Classes handle data transformation logic (e.g., `Game.gameStarted` getter, `startTime()` formatting)
- TypeScript interfaces for simple data shapes (`GameMatchup`, `HockeyTechGameDetails`)

### Testing Conventions

- Jest with React Testing Library - tests co-located with components
- Mock router using `globalThis.resetRouterMocks()` in test setup (see [jest.setup.js](jest.setup.js))
- Import pattern: Use `@/app/...` aliases consistently (configured in [jest.config.js](jest.config.js))
- Coverage excludes: layout/page files, type definitions (`*.d.ts`)
- Run: `pnpm test` (watch mode: `pnpm test:watch`, coverage: `pnpm test:coverage`)

### Styling Approach

- Tailwind CSS primary, CSS Modules for component-specific styles
- CSS Module pattern: `{component}.module.css` imported as `styles` object
- Responsive: Mobile-first grid layouts (`grid-cols-1` defaults)

## Critical Workflows

### Development Commands

```bash
pnpm dev          # Next.js dev server with Turbopack
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm lint:fix     # Auto-fix linting issues
pnpm format       # Prettier formatting
pnpm playwright:test  # E2E tests
```

### ESLint Configuration

- Flat config format ([eslint.config.mjs](eslint.config.mjs)) - not legacy `.eslintrc`
- Active plugins: TypeScript ESLint, React, Unicorn, Tailwind, Prettier
- Ignores: `.next/`, `coverage/`, config files

### Adding New Leagues

1. Add league to `LEAGUES` enum in [app/api/hockeytech/const.ts](app/api/hockeytech/const.ts)
2. Add API keys to `LEAGUE_KEY_MAPPINGS` object (same file)
3. Add league endpoint to `LEAGUE_ENDPOINTS` array in [app/page.tsx](app/page.tsx)
4. Update type unions in game detail page switch statement ([app/game/[league]/[id]/page.tsx](app/game/[league]/[id]/page.tsx))

## Key Gotchas

- **Game Status**: Use `Game.gameState` enum (FUTURE/LIVE/OFF/FUT/FINAL/CRIT) not string comparisons
- **Date Handling**: All dates ISO format `YYYY-MM-DD`, convert at boundaries with `Date.toISOString().slice(0, 10)`
- **API Responses**: Merge schedule + scores for NHL (parallel requests in route handler)
- **Client Components**: Main page is `'use client'` for hooks (date selection, filtering) - wrap async operations in `useEffect`
- **Router Navigation**: Use `router.push()` not `<Link>` for programmatic navigation (e.g., game card clicks)

## External Dependencies

- `react-tailwindcss-datepicker` for date selection component
- Vercel Analytics & Speed Insights enabled in production
- Playwright for E2E tests in `e2e/` directory
