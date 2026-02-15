---
description: Modify a component or page with browser verification
---

This workflow guides modifications to UI components or pages, including delegated browser verification to ensure everything works as expected.

### When to Use

- Adding or modifying components in `app/components/`
- Modifying pages in `app/page.tsx`, `app/game/`, `app/team/`
- Changing layout, styling, or user interactions

### Steps

1. **Implement the Change**

   - Follow patterns in [.github/copilot-instructions.md](../../.github/copilot-instructions.md)
   - Co-locate tests with components
   - Use Tailwind CSS and CSS Modules per project conventions

2. **Run Automated Checks**

   - Lint: `pnpm run lint`
   - Build: `pnpm run build`
   - Unit tests: `pnpm run test`
   - E2E tests: `pnpm run playwright:test`

3. **Delegate Browser Verification**

   - **CRITICAL**: Delegate to the browser subagent (cursor-ide-browser MCP) to verify the changes visually and interactively.
   - Ensure the dev server is running: `pnpm dev`
   - Browser workflow:
     1. Use `browser_tabs` (action: list) to check existing tabs
     2. Use `browser_navigate` to load the base URL (e.g. `http://localhost:3000`)
     3. Use `browser_lock` before interactions (after navigation)
     4. Use `browser_snapshot` to inspect page structure
     5. Navigate to and interact with the modified component/page
     6. Verify: correct rendering, no console errors, expected behavior
     7. Use `browser_unlock` when done

4. **Page-Specific Verification Targets**

   - **Landing page** (`/`): Date picker (#datepickerInput), league selector, game cards, correct date in URL
   - **Game details** (`/game/nhl/[id]`, `/game/qmjhl/[id]`): Score display, team logos, team links
   - **Team details** (`/team/[league]/[id]`): Team name, logo, Schedule, Roster, Skaters, Goalies sections

5. **If Issues Found**
   - Fix and repeat steps 2–3 until verification passes.
