---
description: Verify changes (Lint, Build, Test, Browser)
---

This workflow performs a standard verification pass to ensure code quality and build integrity.

1. **Linting**

   - Checks for code style and potential errors.
   - Command: `pnpm run lint`

2. **Type Checking & Build**

   - Ensures TypeScript types are valid and the project builds successfully.
   - Command: `pnpm run build`

3. **Unit Tests**

   - Verifies that unit tests pass.
   - Command: `pnpm run test`

4. **E2E Tests**

   - Verifies that e2e tests pass.
   - Command: `pnpm run playwright:test`

5. **Browser Verification** (when modifying components or pages)
   - **Delegate to the browser subagent** to verify the UI works correctly in a real browser.
   - Start dev server: `pnpm dev`
   - Use browser tools: navigate to affected pages, interact with modified features, confirm correct rendering and behavior.
   - See `modify_component_or_page.md` for the full browser verification workflow.
