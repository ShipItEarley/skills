# /feature start — Phase 2 (subagent-driven TDD)

## Charter

- A spec MUST be loaded (Status = `Not Started` and `## Current spec` set).
- The agent that writes the test never writes the impl.
- The implementer never edits any file under `backend/tests/` or `frontend/tests/`.
- If a test turns out wrong mid-impl, **escalate to the user** — do not silently amend.

## Skills to invoke

Before dispatching subagents, read these:

- `superpowers:test-driven-development` — the engine for the RED → GREEN → REFACTOR cycle.
- `superpowers:subagent-driven-development` — for dispatching test-author and implementer subagents in fresh contexts.

## Steps

1. **Gate.** Read `context/current-feature.md`. If Status ≠ `Not Started` or `## Current spec` is empty, stop and tell the user to `/feature load` first.

2. Update `context/current-feature.md`: `## Status` → `In Progress`.

3. Derive branch name from the spec path: `feat/slice-NN-{slug}-N-{short}` where NN, N, and {slug} come from the path and `{short}` is a 2–3 word kebab summary of §1 Overview. Create + checkout.

4. **Dispatch the test-author subagent** (per `superpowers:subagent-driven-development`).
   - **Inputs (only):** the spec file path, the design-doc section §8 cites, the existing test folder layout (`backend/tests/`, `frontend/tests/`), `context/coding-standards.md`.
   - **Charter:** translate spec §4 into failing test files under `backend/tests/features/slice-NN-{slug}/spec-N/` and/or `frontend/tests/features/slice-NN-{slug}/spec-N/`. Run the suite. Capture the RED output verbatim. Commit as `test(slice NN/spec N): add failing tests`.
   - **Forbidden:** writing any production code (helpers, stubs, fixtures in the impl tree all count). Modifying spec §4 — if §4 is unworkable, stop and escalate.
   - **Returns:** the commit SHA and pasted RED output.

5. **Dispatch the implementer subagent** (per `superpowers:subagent-driven-development`, **fresh context** — must not reuse the test-author's session).
   - **Inputs (only):** the spec file path, the test files written in step 4, the RED output.
   - **Charter:** write the minimum production code to turn every test green. Apply strict canonical Red-Green-Refactor one test at a time. Commit as `feat(slice NN/spec N): impl`.
   - **Forbidden:** modifying any file under `backend/tests/` or `frontend/tests/`. If a test is genuinely wrong, stop and escalate to the user; the user decides whether to amend the test (which re-runs steps 4 and 5 from the top).
   - **Returns:** the GREEN test summary and commit SHA.

6. Append both subagent reports under `## Notes` in `current-feature.md` so `/feature complete` can lift them into the PR body later. Format:

   ```
   ### /feature start RED (test-author, <commit-sha>)
   <pasted RED output>

   ### /feature start GREEN (implementer, <commit-sha>)
   <pasted GREEN summary>
   ```

7. Output: branch name, both commit SHAs, RED→GREEN delta. Green light: "ready to `/feature review`".
