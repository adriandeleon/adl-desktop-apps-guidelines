#!/usr/bin/env node
// What a run on master publishes (.github/workflows/pages.yml), written as GitHub step outputs:
//
//   version=<x.y.z>   package.json's: the newest released edition
//   pending=<bool>    CHANGELOG.md's [Unreleased] holds changes, so HEAD is not the edition its number names
//   publish=<sha>     the commit to build, deploy, tag and archive, or empty for none:
//                       - HEAD, when nothing is pending;
//                       - the commit that released <version>, when something is pending and that edition isn't both
//                         tagged on origin and live (its run was canceled while it waited, or failed): the release
//                         is published from its own commit, and the batch after it waits;
//                       - empty, when something is pending and the edition is tagged and live.
//   base=<sha>        what scripts/check-edition.mjs compares `publish` with: the release commit's first parent, or
//                     $BEFORE (a push's previous master), or HEAD's first parent (a manual run)
//
//   node scripts/release-state.mjs             prints the outputs; CI appends them to $GITHUB_OUTPUT
//
// "Live" is the site's versions.json; when it can't be read, the edition counts as not live and is published again,
// which is safe: a deploy of the same commit serves the same files.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { unreleased } from "../src/lib/editions.mjs";
import { originTags, releaseCommits } from "../src/lib/releases.mjs";

process.chdir(new URL("..", import.meta.url).pathname);
const git = (...a) => execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const version = pkg.version;
const pending = unreleased(readFileSync("CHANGELOG.md", "utf8")) !== "";
const head = git("rev-parse", "HEAD");

async function liveVersion() {
  try {
    const url = new URL("versions.json", new URL(pkg.guidelines.url));
    const r = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    return r.ok ? (await r.json()).latest : null;
  } catch {
    return null;
  }
}

let publish = head;
let base = process.env.BEFORE && !/^0+$/.test(process.env.BEFORE) ? process.env.BEFORE : `${head}^1`;
let why = "nothing pending: HEAD is the edition";
if (pending) {
  const tagged = originTags().has(version);
  const live = await liveVersion();
  if (tagged && live === version) {
    publish = "";
    why = `${version} is tagged and live; the batch under [Unreleased] waits for its release`;
  } else {
    const release = releaseCommits("HEAD").get(version);
    if (!release) {
      console.error(`no commit on HEAD's first-parent history carries ${version}`);
      process.exit(1);
    }
    publish = release;
    base = `${release}^1`;
    why = `${version} is ${tagged ? "" : "untagged"}${!tagged && live !== version ? " and " : ""}${live !== version ? `not live (live: ${live ?? "unknown"})` : ""}: publishing it from ${release.slice(0, 7)}`;
  }
}
if (publish) base = git("rev-parse", base);

console.log(`version=${version}`);
console.log(`pending=${pending}`);
console.log(`publish=${publish}`);
console.log(`base=${publish ? base : ""}`);
console.error(why);
