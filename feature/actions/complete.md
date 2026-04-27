# /feature complete — Phase 4 (verify → ask → merge → reset)

## Charter

- Run the spec's §7 verification commands. **Pristine output required** — no warnings, no skipped tests, no "expected failure" workarounds.
- **Ask the user before merging.** Single yes/no prompt; if no, stop.
- On yes: merge to `main` locally, reset state, delete the branch.
- Push to origin is **not** automatic — the user runs `git push` separately.

## Skills to invoke

- `superpowers:verification-before-completion` — for the §7 gate. **Evidence before assertions, always.**

## Steps

1. **Gate.** Read `current-feature.md`. If reviewers haven't signed off (no clean review summaries in Notes), stop.

2. **Run §7 verification.** Per `superpowers:verification-before-completion`, execute every command in the spec's §7 verbatim. Capture stdout + exit code. **Do not summarize without evidence.** If anything is non-pristine (warnings, skips, errors), stop and report — do not proceed to ask.

3. **Show the user what's about to happen and ask.** Output a short summary:
   - Spec path (link)
   - RED → GREEN SHAs lifted from Notes
   - §7 verification result (pass/fail counts)
   - Branch that will be merged

   Then ask:

   > **Merge `<branch>` into `main` and commit? (y/n)**

   Wait for the user's response.

4. **If the user says anything other than yes/y**, stop. Leave Status, branch, and state as-is so the user can iterate (e.g., re-run `/feature review`, edit, or amend).

5. **If the user confirms yes:**

   a. Verify the working tree is clean (the `test(...)` and `feat(...)` commits from `/feature start` should already cover everything; if there are stray unstaged edits, stop and report — do not silently `git add`).

   b. Merge into main with a templated commit message. **No Claude attribution** — the message body is exactly what's templated below, with no `Co-Authored-By: Claude` line and no `🤖 Generated with...` footer:
      ```bash
      git checkout main
      git merge --no-ff <branch> -m "feat(slice NN/spec N): <one-line summary>

      Spec: <relative spec path>
      RED: <test-author commit SHA>
      GREEN: <implementer commit SHA>
      Verified: <one-line §7 result, e.g. '12 pytest + 3 vitest passed'>"
      ```

   c. Reset `current-feature.md`:
      - `## Status` → `Not Started`
      - `## Current spec` → empty (placeholder comment only)
      - `## Goals` → empty (placeholder comment only)
      - `## Notes` → empty (placeholder comment only)

   d. Append one bullet to `## History`:
      ```
      YYYY-MM-DD — slice NN spec-N {slug}: <one-sentence shipped> (X pytest + Y vitest)
      ```

   e. Commit the reset: `chore: reset current-feature.md after slice NN spec-N`. **No Claude attribution** in this commit either — plain `-m` message only, no `Co-Authored-By` trailer, no `🤖 Generated with...` footer.

   f. Delete the local branch: `git branch -d <branch>`. **Never `-D`** without explicit user confirmation.

6. Output: the appended History bullet + green light: "ready to `/feature load` the next spec".

## When to push

Not part of this action. If the user asks to push:

```bash
git push origin main
# and if the branch was previously pushed:
git push origin --delete <branch>
```
