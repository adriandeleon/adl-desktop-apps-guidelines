#!/usr/bin/env node
// Keeps editions in order when several people or sessions work at once. Compares HEAD with a base commit:
//
//   node scripts/check-edition.mjs [base]          base defaults to origin/master; run it before you push
//   node scripts/check-edition.mjs --tag <base>    CI, on a push to master: the checks, then tag v<version> and push it
//
// Guidance collects on master under CHANGELOG.md's "## [Unreleased]" and is published in batches (AGENTS.md,
// "Editions"). A change is one of two kinds:
//   - an unreleased change keeps package.json's version. If it touches what readers take as guidance (a page,
//     pages.json, a screenshot), it adds to [Unreleased], unless a commit carries an `Edition: none` trailer (a format
//     change: typos, links, markup). A rule it retires is listed in retired-rules.json with the edition "Unreleased".
//   - a release raises the version, moves everything under [Unreleased] into "## [<version>] - <date>" and leaves
//     [Unreleased] empty. Its number is judged against the edition before it (that edition's tag), so it covers the
//     whole batch: rules gained, lost or re-leveled make at least a minor (AGENTS.md, "Version numbers"), and every ID
//     retired since is listed with this version. The number must be above the base's and every tag on origin.
// Either way CHANGELOG.md's newest numbered section is package.json's version and date, and a change adds at most one.
// Tags are CI's: nothing else creates or pushes them.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pageOrder, parsePage, readRetired } from "../src/lib/rules.mjs";

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
const unreleased = (md) => (md.match(/^## \[Unreleased\]\n([\s\S]*?)(?=^## \[)/m)?.[1] ?? "").trim();
const pending = unreleased(changelog);
const basePending = unreleased(git("show", `${base}:CHANGELOG.md`));
const release = version !== baseVersion;
if (release && pending) errors.push(`a release moves everything under ## [Unreleased] into ## [${version}]; [Unreleased] must be empty`);

// One edition per change.
const baseSections = new Set(sections(git("show", `${base}:CHANGELOG.md`)));
const added = sections(changelog).filter((v) => !baseSections.has(v));
if (added.length > 1) {
  errors.push(`this change adds ${added.length} editions (${added.join(", ")}); fold them into one`);
} else if (added.length && !release) {
  errors.push(`this change adds the section ${added[0]} but keeps version ${version}; an unreleased change goes under ## [Unreleased]`);
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

// Every rule's ID and level at a commit, read as rules.mjs reads them (a page is .md or .mdx).
const show = (ref, path) => {
  try {
    return execFileSync("git", ["show", `${ref}:${path}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
};
const levels = (ref) => {
  const map = new Map();
  for (const slug of pageOrder(JSON.parse(show(ref, "pages.json")))) {
    const text = show(ref, `src/content/docs/${slug}.md`) ?? show(ref, `src/content/docs/${slug}.mdx`) ?? "";
    for (const r of parsePage(slug, text).rules) map.set(r.id, r.level);
  }
  return map;
};
// A release is judged against the edition before it, so the whole batch counts; an unreleased change against its base.
const previous = release ? tagCommit(baseVersion) || base : base;
const [before, after] = [levels(previous), levels("HEAD")];
const ruleChanges = [];
for (const [id, level] of after) {
  if (!before.has(id)) ruleChanges.push(`${id} added (${level})`);
  else if (before.get(id) !== level) ruleChanges.push(`${id} ${before.get(id)} -> ${level}`);
}
for (const id of before.keys()) if (!after.has(id)) ruleChanges.push(`${id} retired`);
// A retired ID is recorded, so it is never reused (scripts/check-rules.mjs) and agents can see where it went.
const retiredIn = new Map(readRetired().map((r) => [r.id, r.edition]));
for (const id of before.keys()) {
  if (after.has(id)) continue;
  const edition = release ? version : "Unreleased";
  if (!retiredIn.has(id)) errors.push(`${id} is retired, but retired-rules.json doesn't list it`);
  else if (retiredIn.get(id) !== edition) errors.push(`retired-rules.json says ${id} was retired in ${retiredIn.get(id)}; it must say "${edition}"`);
}

const [major, minor] = parse(version);
const [baseMajor, baseMinor] = parse(baseVersion);
if (release && ruleChanges.length && major === baseMajor && minor === baseMinor) {
  errors.push(
    `the rules changed since ${baseVersion}, so this is at least a minor edition (it is only a patch, ${version}):\n    ${ruleChanges.join("\n    ")}`,
  );
}

if (!release) {
  const content = git("diff", "--name-only", base, "HEAD", "--", "src/content/docs", "pages.json", "src/assets/shots");
  const formatOnly = /^Edition: none\s*$/im.test(git("log", "--format=%B", `${base}..HEAD`));
  if (content && !formatOnly && pending === basePending) {
    errors.push(
      `these change what readers take as guidance, but ## [Unreleased] in CHANGELOG.md says nothing new; describe the` +
        ` change there, or, if it only changes format (typos, links, markup), add an "Edition: none" trailer to a` +
        ` commit:\n    ${content.split("\n").join("\n    ")}`,
    );
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
  if (release) console.log(`edition ${version} (${base} has ${baseVersion})`);
  else console.log(`no new edition; ${version} as on ${base}${pending ? ", with changes under [Unreleased]" : ""}`);
} else if (tags.has(version)) {
  console.log(`v${version} is already tagged`);
} else {
  git("tag", "-a", `v${version}`, "-m", `Pauta ${version}`);
  git("push", "origin", `refs/tags/v${version}`);
  console.log(`tagged v${version}`);
}
