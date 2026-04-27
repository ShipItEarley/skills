# /feature test — ad-hoc test addition

## When to use

After a `/feature complete` ships, you notice a coverage gap on a server route, ARQ job, or pure utility. **Not** for new features — those go through `/feature start`, which dispatches the test-author subagent.

## Steps

1. Identify the file(s) lacking tests. Either named in `$ARGUMENTS` or inferred from recent `git log`.

2. Determine the test surface and framework:
   - Pure Python utilities → unit tests with `pytest` (no fixtures, no DB)
   - FastAPI routes / DB-touching code → integration tests with `pytest-asyncio` + testcontainers (mark `@pytest.mark.slow`)
   - HTTP clients (Anthropic, Voyage, MS Graph, Resend) → cassette tests with `respx` under `backend/tests/cassettes/`
   - React components → Vitest + jsdom + `@testing-library/react`
   - User-visible flows → Playwright (only if a real critical path is missing)

3. Write tests following `context/coding-standards.md` "Test-suite expectations". One behavior per test. Snapshot tests for user-visible output.

4. Run the relevant command and report:
   - `uv run pytest backend/tests/<path> -v`
   - `uv run pytest -m slow` (for integration)
   - `pnpm --filter frontend vitest run frontend/tests/<path>`

5. Commit as `test: add coverage for <surface>`.

**Skip writing tests just to write them.** Use judgment: focus on real behavioral coverage (especially error paths and boundary conditions), not line-count.
