---
description: Verify changes (Lint, Build, Test)
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
   - Command: `pnpm playwright:test`