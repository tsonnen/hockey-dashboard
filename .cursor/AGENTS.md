# Hockey Dashboard - Agent Instructions

This file provides instructions for AI agents working on the Hockey Dashboard project. Follow these guidelines to work productively with the codebase.

## Quick Reference

- **Project overview**: [.github/copilot-instructions.md](../.github/copilot-instructions.md)
- **Rules**: `.cursor/rules/*.mdc` (project conventions, development workflow)

## Workflows

Reference these workflows when performing the corresponding tasks:

| Task                               | Workflow                                                                                        |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| Add new API endpoint               | [.agent/workflows/add_endpoint.md](../.agent/workflows/add_endpoint.md)                         |
| Run all tests                      | [.agent/workflows/run_tests.md](../.agent/workflows/run_tests.md)                               |
| Verify changes (lint, build, test) | [.agent/workflows/verify_changes.md](../.agent/workflows/verify_changes.md)                     |
| **Modify component or page**       | [.agent/workflows/modify_component_or_page.md](../.agent/workflows/modify_component_or_page.md) |

## Component/Page Changes → Browser Verification

**Whenever you modify a component or page**, you MUST:

1. Run the standard verification (lint, build, unit tests, e2e tests)
2. **Delegate to the browser subagent** to verify the changes in a real browser

Use the `cursor-ide-browser` MCP tools to:

- Navigate to the affected page(s)
- Interact with the modified feature
- Confirm correct rendering and behavior
- Check for console errors or visual regressions

See [modify_component_or_page.md](../.agent/workflows/modify_component_or_page.md) for the full workflow.

## Development Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint
pnpm test             # Unit tests
pnpm playwright:test  # E2E tests
```
