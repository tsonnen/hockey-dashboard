# Agent Workflows

Workflows for AI agents working on the Hockey Dashboard. Adapted for Cursor; originally written for antigravity.

## Workflows

| File                                                                 | Description                                       |
| -------------------------------------------------------------------- | ------------------------------------------------- |
| [add_endpoint.md](workflows/add_endpoint.md)                         | Add a new API endpoint wrapper                    |
| [run_tests.md](workflows/run_tests.md)                               | Run all tests (unit and E2E)                      |
| [verify_changes.md](workflows/verify_changes.md)                     | Full verification: lint, build, test, browser     |
| [modify_component_or_page.md](workflows/modify_component_or_page.md) | Modify components/pages with browser verification |

## Browser Verification

When modifying components or pages, always delegate to the browser subagent (cursor-ide-browser MCP) to verify changes work correctly in a real browser. See `modify_component_or_page.md` for details.
