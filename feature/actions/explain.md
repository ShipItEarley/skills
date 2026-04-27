# /feature explain — narrate the diff

## When to use

Mid-feature or post-feature, when the user (or a reviewer) wants a plain-English walk-through of what changed and why. Read-only — does not modify state or files.

## Steps

1. Read `context/current-feature.md` for goal context if a feature is active; otherwise rely on `git log` since `main`.

2. Run `git diff main --name-only` to list changed files. If on `main`, use `git log -p` for the most recent feature.

3. For each file (created vs modified):
   - Path
   - 1–2 sentences on what it does / what changed
   - Any key functions, classes, or patterns introduced

4. End with one paragraph on how the pieces connect (data/control flow).

## Output format

### Files changed

**path/to/file.py** *(new)*
What it does and why it was added.

**path/to/other.tsx** *(modified)*
What changed and why.

### How it connects

One paragraph on data/control flow between these files.
