#!/usr/bin/env node
import { readdirSync, statSync, existsSync, cpSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function discoverSkills() {
  return readdirSync(repoRoot)
    .filter((entry) => {
      const full = join(repoRoot, entry);
      if (!statSync(full).isDirectory()) return false;
      if (entry.startsWith(".") || entry === "bin" || entry === "node_modules") return false;
      return existsSync(join(full, "SKILL.md"));
    })
    .sort();
}

function parseArgs(argv) {
  const args = { command: "install", skills: [], global: false, force: false, help: false };
  for (const arg of argv) {
    if (arg === "--global" || arg === "-g") args.global = true;
    else if (arg === "--force" || arg === "-f") args.force = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "install" || arg === "list") args.command = arg;
    else if (arg.startsWith("-")) {
      console.error(`Unknown flag: ${arg}`);
      process.exit(2);
    } else {
      args.skills.push(arg);
    }
  }
  return args;
}

function printHelp() {
  console.log(`swavy-skills — install Claude Code skills into a project

Usage:
  npx swavy-skills [install] [skills...] [options]
  npx swavy-skills list

Commands:
  install [skills...]   Copy skills into .claude/skills/ (default if omitted)
  list                  List available skills

Options:
  -g, --global   Install into ~/.claude/skills/ instead of ./.claude/skills/
  -f, --force    Overwrite existing skills without prompting
  -h, --help     Show this help

Examples:
  npx swavy-skills                       # install all into ./.claude/skills
  npx swavy-skills install feature       # install one
  npx swavy-skills --global --force      # install all globally, overwrite
`);
}

async function confirm(question) {
  if (!stdin.isTTY) return false;
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = (await rl.question(`${question} (y/N) `)).trim().toLowerCase();
  rl.close();
  return answer === "y" || answer === "yes";
}

async function install({ skills, global, force }) {
  const available = discoverSkills();
  if (available.length === 0) {
    console.error("No skills found in package.");
    process.exit(1);
  }

  const requested = skills.length > 0 ? skills : available;
  const unknown = requested.filter((s) => !available.includes(s));
  if (unknown.length > 0) {
    console.error(`Unknown skill(s): ${unknown.join(", ")}`);
    console.error(`Available: ${available.join(", ")}`);
    process.exit(1);
  }

  const targetRoot = global
    ? join(homedir(), ".claude", "skills")
    : join(process.cwd(), ".claude", "skills");

  mkdirSync(targetRoot, { recursive: true });
  console.log(`Installing into: ${targetRoot}\n`);

  let installed = 0;
  let skipped = 0;
  for (const name of requested) {
    const src = join(repoRoot, name);
    const dest = join(targetRoot, name);

    if (existsSync(dest) && !force) {
      const ok = await confirm(`  ${name} exists — overwrite?`);
      if (!ok) {
        console.log(`  skip  ${name}`);
        skipped++;
        continue;
      }
    }

    cpSync(src, dest, { recursive: true, force: true });
    console.log(`  ok    ${name}`);
    installed++;
  }

  console.log(`\nDone — ${installed} installed, ${skipped} skipped.`);
}

function list() {
  const skills = discoverSkills();
  if (skills.length === 0) {
    console.log("(none)");
    return;
  }
  console.log("Available skills:");
  for (const s of skills) console.log(`  ${s}`);
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  printHelp();
} else if (args.command === "list") {
  list();
} else {
  await install(args);
}
