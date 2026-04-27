# swavy-skills

Personal Claude Code skills, installable into any project via `npx`.

## Usage

Install all skills into the current project (`./.claude/skills/`):

```bash
npx swavy-skills
```

Install globally (`~/.claude/skills/`):

```bash
npx swavy-skills --global
```

Install specific skills only:

```bash
npx swavy-skills install feature grill-me
```

List available skills:

```bash
npx swavy-skills list
```

## Flags

- `-g`, `--global` — install into `~/.claude/skills/` instead of the current project
- `-f`, `--force` — overwrite existing skills without prompting
- `-h`, `--help` — show help

## Skills

- **feature** — manage current feature workflow for a kurt slice spec (load, start, review, complete, test, explain)
- **grill-me** — interview relentlessly about a plan or design until reaching shared understanding
- **to-issues** — break a plan or PRD into independently-grabbable GitHub issues
- **to-prd** — turn the current conversation context into a PRD and submit it as a GitHub issue

## Adding a new skill

1. `mkdir my-skill` at the repo root
2. Add `my-skill/SKILL.md` with frontmatter (`name`, `description`)
3. Bump `version` in `package.json`

The CLI auto-discovers any top-level directory containing a `SKILL.md`.

## Run without publishing to npm

```bash
npx github:ShipItEarley/skills
```

Works as soon as the repo is pushed.
