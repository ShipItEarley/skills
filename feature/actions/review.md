# /feature review — Phase 3 (reviewer subagent loop)

## Charter

- Status = `In Progress` and the GREEN summary must be in `current-feature.md` Notes.
- Reviewer findings are addressed by **fixer implementer subagents** under the same forbidden-from-editing-tests rule.
- Loop until both reviewers report no blockers.

## Skills to invoke

- `superpowers:requesting-code-review` — for invoking each reviewer subagent.
- `superpowers:dispatching-parallel-agents` — the two reviewers (spec-compliance + code-quality) run in parallel.
- `superpowers:subagent-driven-development` — for any fixer subagent dispatched in response.

## Steps

1. **Gate.** Read `current-feature.md`. If Status ≠ `In Progress` or no GREEN summary in Notes, stop.

2. **Dispatch reviewer subagents in parallel** (per `superpowers:dispatching-parallel-agents`):

   - **Spec-compliance reviewer:** check the diff against the spec — nothing missing, nothing extra. Inputs: spec file, full diff vs `main`, `context/current-feature.md`. Returns: `{blockers: [...], suggestions: [...]}`.

   - **Code-quality reviewer:** check against `context/coding-standards.md` and obvious code smells (dead code, misuse of patterns, missing error handling at boundaries). Same return shape.

3. For each blocker, **dispatch a fixer implementer subagent** (fresh context):
   - **Inputs (only):** the spec, the offending diff hunks, the reviewer's blocker description, `coding-standards.md`.
   - **Charter:** address the blocker without scope creep.
   - **Forbidden:** editing files under `backend/tests/` or `frontend/tests/` — unless the reviewer explicitly flagged a test file. If the fixer can't address without touching tests, escalate.
   - Commit as `fix(slice NN/spec N): <reviewer summary>`.

4. **Re-run only the reviewer that found blockers** until it returns ✅. Suggestions (non-blockers) may be deferred but should be noted in Notes.

5. Append final reviewer reports under `## Notes` in `current-feature.md`:

   ```
   ### /feature review (spec-compliance, ✅)
   <reviewer summary>

   ### /feature review (code-quality, ✅)
   <reviewer summary>
   ```

6. Output: clean diff summary + green light: "ready to `/feature complete`".
