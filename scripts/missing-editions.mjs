#!/usr/bin/env node
// The editions a deploy skipped. CI tags and archives each edition in the run that deploys it, but GitHub cancels a
// pending run when a newer one queues in the same concurrency group, so three merges in quick succession can leave the
// middle edition with no tag and no folder on the `versions` branch. Each run puts that right:
//
//   node scripts/missing-editions.mjs          prints "<version> <commit>" for every released edition older than
//                                              package.json's that the versions branch lacks; scripts/build-edition.sh
//                                              builds each one, and the publish job archives it
//   node scripts/missing-editions.mjs --tag    tags every such edition that has no tag on origin, at its commit, and
//                                              pushes the tag (CI only, like scripts/check-edition.mjs --tag)
//
// An edition's commit is the first on HEAD's first-parent history whose package.json carries its version: the merge
// that released it. "Released" is CHANGELOG.md's word: a section headed by a version and a date.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { releaseCommits } from "../src/lib/releases.mjs";
import { compareVersions, parseEditions, released } from "../src/lib/editions.mjs";

process.chdir(fileURLToPath(new URL("..", import.meta.url))); // not .pathname, which keeps a space as %20
const tag = process.argv.includes("--tag");
const git = (...a) => execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const current = JSON.parse(readFileSync("package.json", "utf8")).version;
const older = released(parseEditions(readFileSync("CHANGELOG.md", "utf8")))
  .map((e) => e.version)
  .filter((v) => compareVersions(v, current) > 0); // compareVersions sorts newest first: > 0 is older

let wanted;
if (tag) {
  const tags = new Set(
    git("ls-remote", "--tags", "origin")
      .split("\n")
      .map((l) => l.match(/refs\/tags\/v(\d+\.\d+\.\d+)$/)?.[1])
      .filter(Boolean),
  );
  wanted = older.filter((v) => !tags.has(v));
} else {
  git("fetch", "--quiet", "origin", "+versions:refs/remotes/origin/versions"); // fails the script when unreachable
  const folders = new Set(git("ls-tree", "-d", "--name-only", "refs/remotes/origin/versions").split("\n"));
  wanted = older.filter((v) => !folders.has(v));
}
if (!wanted.length) process.exit(0);

const commits = releaseCommits();
let failed = false;
for (const v of wanted) {
  const c = commits.get(v);
  if (!c) {
    console.error(`${v}: no commit on HEAD's first-parent history carries this version`);
    failed = true;
    continue;
  }
  if (!tag) {
    console.log(`${v} ${c}`);
    continue;
  }
  git("tag", "-a", `v${v}`, "-m", `Pauta ${v}`, c);
  git("push", "origin", `refs/tags/v${v}`);
  console.error(`tagged v${v} at ${c.slice(0, 7)}, which a canceled run left untagged`);
}
process.exit(failed ? 1 : 0);
