#!/usr/bin/env node
// Part of a release (AGENTS.md, "Guidance collects under [Unreleased]"): records in pins.json the commit at the head of
// each repository the pages link into, for the version package.json names. The edition then serves those commits in
// its links (src/lib/pins.mjs), and scripts/check-edition.mjs fails a release whose pins.json names another edition.
//
//   node scripts/pin-references.mjs        after setting the release's version; needs network access to GitHub
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { linkedRepos, OWNER } from "../src/lib/pins.mjs";

process.chdir(new URL("..", import.meta.url).pathname);
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : /\.(md|mdx|mjs|astro)$/.test(name) ? [path] : [];
  });
const text = ["src", "skills"].flatMap(files).map((f) => readFileSync(f, "utf8")).join("\n");

const repos = {};
const problems = [];
for (const [repo, branches] of [...linkedRepos(text)].sort(([a], [b]) => a.localeCompare(b))) {
  if (branches.length > 1) {
    problems.push(`${repo} is linked on ${branches.join(" and ")}; use its default branch everywhere`);
    continue;
  }
  const out = execFileSync("git", ["ls-remote", `https://github.com/${OWNER}/${repo}.git`, `refs/heads/${branches[0]}`], {
    encoding: "utf8",
  }).trim();
  const sha = out.split(/\s+/)[0];
  if (!/^[0-9a-f]{40}$/.test(sha)) problems.push(`${repo}: no branch ${branches[0]} on GitHub`);
  else repos[repo] = sha;
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
