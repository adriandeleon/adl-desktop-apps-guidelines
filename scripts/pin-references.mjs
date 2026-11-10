#!/usr/bin/env node
// Part of a release (AGENTS.md, "Guidance collects under [Unreleased]"): records in pins.json the commit at the head of
// each repository the pages link into, for the version package.json names. The edition then serves those commits in
// its links (src/lib/pins.mjs), and scripts/check-edition.mjs fails a release whose pins.json names another edition.
//
//   node scripts/pin-references.mjs        after setting the release's version; needs network access to GitHub
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { linkedRepos, OWNER } from "../src/lib/pins.mjs";

process.chdir(fileURLToPath(new URL("..", import.meta.url))); // not .pathname, which keeps a space as %20
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

// scripts/check-edition.mjs reads the same folders and file types to check pins.json; change both together.
const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : /\.(md|mdx|mjs|astro)$/.test(name) ? [path] : [];
  });
const text = ["src", "skills"].flatMap(files).map((f) => readFileSync(f, "utf8")).join("\n");
// Never wait on a password prompt or a hung connection: a renamed or private repository fails instead.
const env = { ...process.env, GIT_TERMINAL_PROMPT: "0" };
const gitIn = (args, opts = {}) => execFileSync("git", args, { encoding: "utf8", env, timeout: 120_000, ...opts }).trim();

const repos = {};
const problems = [];
for (const [repo, branches] of [...linkedRepos(text)].sort(([a], [b]) => a.localeCompare(b))) {
  if (branches.length > 1) {
    problems.push(`${repo} is linked on ${branches.join(" and ")}; use its default branch everywhere`);
    continue;
  }
  const out = gitIn(["ls-remote", `https://github.com/${OWNER}/${repo}.git`, `refs/heads/${branches[0]}`]);
  const sha = out.split(/\s+/)[0];
  if (!/^[0-9a-f]{40}$/.test(sha)) problems.push(`${repo}: no branch ${branches[0]} on GitHub`);
  else repos[repo] = sha;
}
// Every linked path must exist at its pinned commit, or the edition would carry a link that 404s forever. Each
// repository's tree is fetched without file contents (a partial, shallow fetch) and listed.
const linked = new Map();
for (const m of text.matchAll(/github\.com\/adriandeleon\/([A-Za-z0-9_.-]+)\/(?:blob|tree)\/(?:master|main)\/([^)\s"'`#<>]+)/g)) {
  if (!repos[m[1]]) continue;
  linked.set(m[1], (linked.get(m[1]) ?? new Set()).add(decodeURIComponent(m[2]).replace(/\/$/, "")));
}
const scratch = mkdtempSync(join(tmpdir(), "pauta-pins-"));
try {
  for (const [repo, paths] of linked) {
    const dir = join(scratch, repo);
    gitIn(["init", "--quiet", "--bare", dir]);
    gitIn(["-C", dir, "fetch", "--quiet", "--depth=1", "--filter=blob:none", `https://github.com/${OWNER}/${repo}.git`, repos[repo]]);
    const tree = new Set(gitIn(["-C", dir, "ls-tree", "-r", "-t", "--name-only", repos[repo]], { maxBuffer: 64 << 20 }).split("\n"));
    for (const path of paths) if (!tree.has(path)) problems.push(`${repo}: ${path} is linked but not at ${repos[repo].slice(0, 12)}`);
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
if (problems.length) {
  console.error(`Not pinned:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}

const pins = {
  comment:
    "The commit of each repository the pages link into, when this edition was released (scripts/pin-references.mjs). " +
    "The edition's pages, agent files and downloads link these commits instead of the branches (src/lib/pins.mjs).",
  edition: pkg.version,
  date: pkg.guidelines.date,
  repos,
};
writeFileSync("pins.json", JSON.stringify(pins, null, 2) + "\n");
console.log(`pins.json: ${Object.keys(repos).length} repositories pinned for ${pkg.version}`);
for (const [repo, sha] of Object.entries(repos)) console.log(`  ${repo} ${sha.slice(0, 12)}`);
