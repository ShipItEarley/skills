# /feature load — Phase 1 (no code, no branch, no subagents)

## Charter

- Pure context-loading. **Do not** create branches, write code, or dispatch subagents.
- Refuse to run if `context/current-feature.md` Status is anything but `Not Started`.

## Args

`$ARGUMENTS` may name a spec file or be empty.

- Path-like single arg → use it directly.
- Empty → infer from the active slice's `00-overview.md`: lowest-numbered `spec-N-{slug}.md` not yet in `## History`.

## Steps

1. **Gate.** Read `context/current-feature.md`. If Status ≠ `Not Started`, stop and tell the user to `/feature complete` (or recover state manually) first.

2. Resolve the spec path per the Args section above. If no spec file is found, stop.

3. **Validate the spec.** Check the file has:
   - §1 Overview, §2 Prerequisites, §3 Acceptance criteria, §4 Test plan, §5 Implementation notes, §6 Out of scope — all non-empty
   - §7 Verification — contains runnable commands (no `<...>` placeholders)
   - §8 References — cites a section in `docs/build-plan.md`

   If any check fails, stop and report — do not load. Do not proceed to `/feature start`.

4. Read into context (do not summarize, do not modify):
   - the active slice's `00-overview.md`
   - `context/coding-standards.md`
   - the `docs/build-plan.md` section §8 cites

5. Update `context/current-feature.md`:
   - `## Status` → `Not Started` (unchanged, but make explicit by writing it back)
   - `## Current spec` → the resolved spec path
   - `## Goals` → bullet list lifted verbatim from spec §3
   - `## Notes` → append spec §5 highlights the user should be aware of (gotchas, reuse hints)

6. Output confirmation:
   - which spec is loaded (path)
   - tests expected (one-line summary of §4)
   - files likely touched (from §5 Files to create/modify)
   - green light: "ready to `/feature start`"
