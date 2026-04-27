---
name: feature
description: Manage current feature workflow for a kurt slice spec — load, start, review, complete (plus test/explain helpers). Wraps the superpowers TDD + subagent-driven-development skills.
argument-hint: load|start|review|complete|test|explain [args]
---

# Feature workflow

Implements the four-phase slice workflow described in
[`context/ai-interaction.md`](../../../context/ai-interaction.md). Each
action enforces strict gates and dispatches subagents per kurt's discipline:

- the agent that writes the test never writes the impl
- the implementer never edits tests; if a test is wrong, escalate
- every phase reads/writes [`context/current-feature.md`](../../../context/current-feature.md)

This skill is a **workflow shell**. The actual TDD discipline, subagent
dispatch, code review, and verification primitives come from the
`superpowers:*` plugin — each action invokes the relevant superpowers
skill rather than reimplementing it.

## Working file

@context/current-feature.md

| Section | Values | Set by |
|---|---|---|
| `## Status` | `Not Started` / `In Progress` | load → start → complete |
| `## Current spec` | path to spec file | load |
| `## Goals` | bullet list, from spec §3 | load |
| `## Notes` | free-form, subagent reports | load (init), start, review |
| `## History` | append-only | complete (post-merge) |

## Action

Execute the requested action: $ARGUMENTS

| Action | When to run | Detail |
|---|---|---|
| `load` | before each spec | [actions/load.md](actions/load.md) |
| `start` | after `load` succeeds | [actions/start.md](actions/start.md) |
| `review` | after `start` returns GREEN | [actions/review.md](actions/review.md) |
| `complete` | after `review` is clean | [actions/complete.md](actions/complete.md) |
| `test` | ad-hoc, post-merge | [actions/test.md](actions/test.md) |
| `explain` | ad-hoc, any time | [actions/explain.md](actions/explain.md) |

If no action is provided, list the options and stop.
