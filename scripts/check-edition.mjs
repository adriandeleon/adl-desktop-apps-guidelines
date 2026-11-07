#!/usr/bin/env node
// Keeps editions in order when several people or sessions work at once. Compares HEAD with a base commit:
//
//   node scripts/check-edition.mjs [base]          base defaults to origin/master; run it before you push
//   node scripts/check-edition.mjs --tag <base>    CI, on a push to master: the checks, then tag v<version> and push it
//
// It fails when
//   - CHANGELOG.md's newest section isn't `## [<version>] - <date>` from package.json, or [Unreleased] holds anything;
//   - the change adds more than one edition (fold them into one);
//   - a content change (a page, pages.json, a screenshot) keeps the base's version;
//   - a new version isn't above the base's and above every tag on origin, or its tag is already taken.
// Tags are CI's: nothing else creates or pushes them.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const tag = args[0] === "--tag";
const base = (tag ? args[1] : args[0]) || "origin/master";
const git = (...a) => execFileSync("git", a, { encoding: "utf8" }).trim();
const errors = [];

const parse = (v) => v.split(".").map(Number);
const cmp = (a, b) => {
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};
const sections = (md) => [...md.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm)].map((m) => m[1]);

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const changelog = readFileSync("CHANGELOG.md", "utf8");
const version = pkg.version;
const basePkg = JSON.parse(git("show", `${base}:package.json`));
const baseVersion = basePkg.version;

// The changelog agrees with package.json, and [Unreleased] is empty.
const head = changelog.match(/^## \[(\d+\.\d+\.\d+)\] - (\S+)$/m);
if (!head || head[1] !== version || head[2] !== pkg.guidelines.date) {
  errors.push(`CHANGELOG.md's newest section must be "## [${version}] - ${pkg.guidelines.date}" (package.json)`);
}
const unreleased = changelog.match(/^## \[Unreleased\]\n([\s\S]*?)^## \[/m);
if (unreleased && unreleased[1].trim()) errors.push("## [Unreleased] must be empty: put the change under its edition");

// One edition per change.
const baseSections = new Set(sections(git("show", `${base}:CHANGELOG.md`)));
const added = sections(changelog).filter((v) => !baseSections.has(v));
if (added.length > 1) {
  errors.push(`this change adds ${added.length} editions (${added.join(", ")}); fold them into one`);
}

// The tags on origin, not local ones: a local tag may be a stray from another session.
// Version -> the commit its tag points at (an annotated tag's peeled `^{}` line wins).
const tags = new Map();
for (const line of git("ls-remote", "--tags", "origin").split("\n")) {
  const m = line.match(/^(\w+)\s+refs\/tags\/v(\d+\.\d+\.\d+)(\^\{\})?$/);
  if (m && (m[3] || !tags.has(m[2]))) tags.set(m[2], m[1]);
}
const tagCommit = (v) => tags.get(v) ?? "";
const newest = [...tags.keys()].sort(cmp).at(-1);

if (version === baseVersion) {
  const content = git("diff", "--name-only", base, "HEAD", "--", "src/content/docs", "pages.json", "src/assets/shots");
  if (content) {
    errors.push(`these change what readers take as guidance but keep version ${version}; make them an edition:\n    ${content.split("\n").join("\n    ")}`);
  }
} else {
  if (cmp(version, baseVersion) <= 0) errors.push(`version ${version} must be above ${base}'s ${baseVersion}`);
  if (newest && cmp(version, newest) <= 0 && !(tag && tagCommit(version) === git("rev-parse", "HEAD"))) {
    errors.push(`version ${version} must be above the newest tag on origin, v${newest}; another change took that number, so fetch, rebase and renumber`);
  }
  if (added.length === 1 && added[0] !== version) errors.push(`the edition added is ${added[0]}, but package.json says ${version}`);
}

if (errors.length) {
  console.error(`Edition check against ${base} failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

if (!tag) {
  console.log(version === baseVersion ? `no new edition; ${version} as on ${base}` : `edition ${version} (${base} has ${baseVersion})`);
} else if (tags.has(version)) {
  console.log(`v${version} is already tagged`);
} else {
  git("tag", "-a", `v${version}`, "-m", `Pauta ${version}`);
  git("push", "origin", `refs/tags/v${version}`);
  console.log(`tagged v${version}`);
}
