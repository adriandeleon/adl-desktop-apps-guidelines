#!/usr/bin/env node
// Keeps editions in order when several people or sessions work at once. Compares HEAD with a base commit:
//
//   node scripts/check-edition.mjs [base]          base defaults to origin/master; run it before you push
//   node scripts/check-edition.mjs --tag <base>    CI, on a push to master: the checks, then tag v<version> at the
//                                                  commit that released it, and push the tag
//
// Guidance collects on master under CHANGELOG.md's "## [Unreleased]" and is published in batches (AGENTS.md,
// "Editions"). A change is one of two kinds:
//   - an unreleased change keeps package.json's version. If it touches what readers take as guidance (a page,
//     pages.json, a screenshot), it adds to [Unreleased], unless the commits that change those files carry an
//     `Edition: none` trailer (a format change: typos, links, markup); a trailer waives only its own commit's files,
//     and never a rule added, retired or re-leveled: that is guidance whatever the commit says. A rule it retires is
//     listed in retired-rules.json with the edition "Unreleased".
//   - a release raises the version, moves everything under [Unreleased] into "## [<version>] - <date>" and leaves
//     [Unreleased] empty. Its number is judged against the edition before it (that edition's tag), so it covers the
//     whole batch: rules gained, lost or re-leveled make at least a minor (AGENTS.md, "Version numbers"), and every ID
//     retired since is listed with this version. The number must be above the base's and every tag on origin, and
//     pins.json must pin it (scripts/pin-references.mjs): a full commit SHA for every repository the pages link into,
//     and for no other.
// Either way CHANGELOG.md's newest numbered section is package.json's version and date, and a change adds at most one.
// Tags are CI's: nothing else creates or pushes them.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { unreleased } from "../src/lib/editions.mjs";
import { linkedRepos } from "../src/lib/pins.mjs";
import { originTags, releaseCommits } from "../src/lib/releases.mjs";
import { pageOrder, parsePage, readRetired } from "../src/lib/rules.mjs";

// The tree to check is the current directory, or $PAUTA_ROOT when CI runs master's copy of this script on the checkout
// of a released edition (.github/workflows/pages.yml, "Keep this run's scripts"). package.json, CHANGELOG.md,
// pins.json, retired-rules.json and the pages are that tree's, at HEAD and at the base. The libraries imported above
// are the ones beside this script, src/lib/rules.mjs among them: the check and the parser it calls are one tool, and
// the same parser reads both commits it compares, so an older edition's rules are never read two ways.
if (process.env.PAUTA_ROOT) process.chdir(process.env.PAUTA_ROOT);
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
const tags = originTags();
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
// A release is judged against the edition before it, so the whole batch counts: its tag, or, when a canceled run left
// it untagged, the commit that released it. An unreleased change is judged against its base.
let previous = base;
if (release) {
  previous = tagCommit(baseVersion) || releaseCommits(base).get(baseVersion);
  if (!previous) {
    errors.push(`${baseVersion}, the edition before this one, has no tag on origin and no release commit on ${base}'s history`);
    previous = base;
  }
}
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

if (release) {
  // A release names the batch; it doesn't change it. Anything else it touches would reach readers unchecked.
  const allowed = new Set(["package.json", "CHANGELOG.md", "retired-rules.json", "pins.json"]);
  const others = git("diff", "--name-only", base, "HEAD").split("\n").filter((f) => f && !allowed.has(f));
  if (others.length) {
    errors.push(`a release changes only ${[...allowed].join(", ")}; land these first, under [Unreleased]:\n    ${others.join("\n    ")}`);
  }
  const left = readRetired().filter((r) => r.edition === "Unreleased").map((r) => r.id);
  if (left.length) errors.push(`retired-rules.json still says "Unreleased" for ${left.join(", ")}; a release numbers them ${version}`);
}

if (!release) {
  const paths = ["src/content/docs", "pages.json", "src/assets/shots", "skills"];
  const changed = new Set(git("diff", "--name-only", base, "HEAD", "--", ...paths).split("\n").filter(Boolean));
  // A rule added, retired or re-leveled is what an edition is made of: no trailer says otherwise.
  if (ruleChanges.length && pending === basePending) {
    errors.push(
      `the rules changed, but ## [Unreleased] in CHANGELOG.md says nothing new; describe the change there (an` +
        ` "Edition: none" trailer covers format only, never a rule):\n    ${ruleChanges.join("\n    ")}`,
    );
  }
  // An "Edition: none" trailer waives only the files its own commits change: a file another commit changes too still
  // needs a changelog entry, so one format-only commit can't carry a whole branch past this check. It is read as git
  // reads trailers (the message's last paragraph, beside Co-Authored-By), so the words in a message's prose waive
  // nothing.
  const waived = (c) => git("log", "-1", "--format=%(trailers:key=Edition,valueonly)", c).split("\n").some((v) => /^none$/i.test(v.trim()));
  const unwaived = new Set();
  for (const c of git("rev-list", "--no-merges", `${base}..HEAD`).split("\n").filter(Boolean)) {
    if (waived(c)) continue;
    for (const f of git("diff-tree", "--no-commit-id", "--name-only", "-r", c, "--", ...paths).split("\n")) if (changed.has(f)) unwaived.add(f);
  }
  const content = [...unwaived].join("\n");
  if (content && pending === basePending) {
    errors.push(
      `these change what readers take as guidance, but ## [Unreleased] in CHANGELOG.md says nothing new; describe the` +
        ` change there, or, if it only changes format (typos, links, markup), add an "Edition: none" trailer (in the` +
        ` message's last paragraph, with its other trailers) to each commit that changes these:\n    ${content.split("\n").join("\n    ")}`,
    );
  }
} else {
  if (cmp(version, baseVersion) <= 0) errors.push(`version ${version} must be above ${base}'s ${baseVersion}`);
  // A tag at this very commit is this release, checked again (a re-run, or a deploy published again).
  if (newest && cmp(version, newest) <= 0 && tagCommit(version) !== git("rev-parse", "HEAD")) {
    errors.push(`version ${version} must be above the newest tag on origin, v${newest}; another change took that number, so fetch, rebase and renumber`);
  }
  if (added.length === 1 && added[0] !== version) errors.push(`the edition added is ${added[0]}, but package.json says ${version}`);
  let pins = null;
  try {
    pins = JSON.parse(readFileSync("pins.json", "utf8"));
  } catch {}
  const again = "run node scripts/pin-references.mjs";
  if (pins?.edition !== version) {
    errors.push(`pins.json pins ${pins?.edition ?? "nothing"}; a release pins its References: ${again}`);
  } else if (!pins.repos || typeof pins.repos !== "object" || Array.isArray(pins.repos)) {
    errors.push(`pins.json has no "repos" (repository -> commit); ${again}`);
  } else {
    // pins.json is whole: a commit for every repository the pages link into, each a full SHA, and none left for a
    // repository nothing links to any more. The pages are read as scripts/pin-references.mjs reads them (the same
    // folders and file types; change both together). Shape and completeness only: nothing here asks GitHub, so
    // whether each commit exists in its repository is not checked. pin-references.mjs took each one from the
    // repository when it wrote the file; a value edited by hand afterwards would pass here and link to a 404.
    const files = (dir) =>
      readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? files(path) : /\.(md|mdx|mjs|astro)$/.test(name) ? [path] : [];
      });
    const linked = linkedRepos(["src", "skills"].flatMap(files).map((f) => readFileSync(f, "utf8")).join("\n"));
    const missing = [...linked.keys()].filter((repo) => !Object.hasOwn(pins.repos, repo)).sort();
    const malformed = Object.entries(pins.repos).filter(([, sha]) => typeof sha !== "string" || !/^[0-9a-f]{40}$/.test(sha));
    const unlinked = Object.keys(pins.repos).filter((repo) => !linked.has(repo)).sort();
    if (missing.length) errors.push(`pins.json pins no commit for ${missing.join(", ")}, which the pages link into; ${again}`);
    if (malformed.length) {
      errors.push(
        `pins.json must pin each repository at a full commit SHA (40 hex digits, lower case); these are not:\n    ${malformed.map(([repo, sha]) => `${repo}: ${JSON.stringify(sha)}`).join("\n    ")}`,
      );
    }
    if (unlinked.length) errors.push(`pins.json pins ${unlinked.join(", ")}, which no page links into; ${again}`);
  }
}

if (errors.length) {
  console.error(`Edition check against ${base} failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

if (!tag) {
  if (release) console.log(`edition ${version} (${base} has ${baseVersion})`);
  else console.log(`no new edition; ${version} as on ${base}${pending ? ", with changes under [Unreleased]" : ""}`);
} else {
  // The tag goes on the commit that released the edition, whichever commit this run is on. After a release's own run
  // is canceled, the run that tags it may be on a later, site-only commit, and v<version> there would name files the
  // edition never had (its pinned links into this repository point at the tag). The release commit is found as
  // scripts/release-state.mjs and scripts/missing-editions.mjs find it: the first on HEAD's first-parent history whose
  // package.json carries the version. It must also look like a release (the version's section in CHANGELOG.md, and
  // nothing under [Unreleased]), or nothing is tagged: a tag is never moved, so a wrong one stays wrong.
  const at = releaseCommits("HEAD").get(version);
  const here = git("rev-parse", "HEAD");
  const refuse = (why) => {
    console.error(`v${version} is not tagged: ${why}`);
    process.exit(1);
  };
  if (tags.has(version)) {
    const elsewhere = at && tagCommit(version) !== at;
    console.log(`v${version} is already tagged${elsewhere ? ` (at ${tagCommit(version).slice(0, 7)}, not at ${at.slice(0, 7)}, the commit that released it; a tag is never moved)` : ""}`);
  } else if (git("rev-parse", "--is-shallow-repository") === "true") {
    // With history cut short, the oldest commit in it would pass for the one that released the edition.
    refuse(`this clone is shallow, so the commit that released ${version} can't be told from a later one (CI fetches with fetch-depth: 0)`);
  } else if (!at) {
    refuse(`no commit on HEAD's first-parent history carries ${version}`);
  } else {
    const then = show(at, "CHANGELOG.md") ?? "";
    if (sections(then)[0] !== version) refuse(`${at.slice(0, 7)} is the first commit to carry ${version}, but its CHANGELOG.md has no section for it on top`);
    if (unreleased(then)) refuse(`${at.slice(0, 7)} is the first commit to carry ${version}, but it left changes under [Unreleased]`);
    git("tag", "-a", `v${version}`, "-m", `Pauta ${version}`, at);
    git("push", "origin", `refs/tags/v${version}`);
    console.log(`tagged v${version} at ${at.slice(0, 7)}${at === here ? "" : `, the commit that released it (this run is on ${here.slice(0, 7)})`}`);
  }
}
