#!/usr/bin/env node
// What a run on master publishes (.github/workflows/pages.yml), written as GitHub step outputs:
//
//   version=<x.y.z>   package.json's: the newest released edition
//   pending=<bool>    CHANGELOG.md's [Unreleased] holds changes, so HEAD is not the edition its number names
//   publish=<sha>     the commit whose edition to tag and archive before the deploy, or empty for none:
//                       - HEAD, when nothing is pending;
//                       - the commit that released <version>, when nothing is pending, that commit is not HEAD and the
//                         edition has no tag on origin: its own run was canceled, and the pushes since changed only
//                         the site. The site is still built from HEAD, but the commit that is checked (against its
//                         first parent, as a release) and tagged is the one that released the edition; checked
//                         against the push before, HEAD is no release at all, and the edition would be tagged
//                         without ever having been compared with what came before it;
//                       - the commit that released <version>, when something is pending and that edition has no tag
//                         on origin, or the site says another edition is live (its run was canceled while it waited,
//                         or failed): the release is published from its own commit, and the batch after it waits;
//                       - empty, when something is pending and the edition is tagged and live, or tagged while the
//                         site can't be asked (below).
//   site=<sha>        the commit latest/ and <version>/ are built from, which every run on master deploys: HEAD when
//                     nothing is pending, else the commit that released <version>
//   next=<sha>        HEAD when something is pending: next/ is built from it (scripts/build-next.mjs), else empty
//   base=<sha>        what scripts/check-edition.mjs compares `publish` with: the release commit's first parent, or
//                     $BEFORE (a push's previous master), or HEAD's first parent (a manual run)
//
//   node scripts/release-state.mjs             prints the outputs; CI appends them to $GITHUB_OUTPUT
//   node scripts/release-state.mjs --site      prints only the commit `site` would be, asking neither origin for its
//                                              tags nor the site what is live: a pull request uses it to build what
//                                              master will build once it is merged (pages.yml, "Rehearse")
//
// "Live" is the `latest` of the site's versions.json, asked only when the answer decides something (an untagged
// edition is published whatever the site serves) and up to four times, since one failed request says nothing about
// the site. "The site names another edition" and "the site could not be asked" (a network error, a timeout, any
// status but 200, a body that isn't a versions.json) are different answers. When it still can't be asked, a tagged
// edition counts as live and nothing new is published, with a warning on the run. That is the safest of the three
// ways out:
//   - This run deploys the edition from its release commit either way (`site`), so it is live when the run ends. All
//     that waits is its folder on the `versions` branch, and if that is missing, the next release's run rebuilds it
//     from the same commit (scripts/missing-editions.mjs). Nothing is lost.
//   - Counting it as not live archives it again from its release commit, over a folder that holds the site-only fixes
//     deployed since the release. Nothing brings those back.
//   - Failing the run loses nothing either, but holds back the deploy and next/ over a question whose answer changes
//     only the archive, until someone runs it again.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { unreleased } from "../src/lib/editions.mjs";
import { originTags, releaseCommits } from "../src/lib/releases.mjs";

process.chdir(fileURLToPath(new URL("..", import.meta.url))); // not .pathname, which keeps a space as %20
const git = (...a) => execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const version = pkg.version;
const pending = unreleased(readFileSync("CHANGELOG.md", "utf8")) !== "";
const head = git("rev-parse", "HEAD");
if (process.argv.includes("--site")) {
  const release = pending ? releaseCommits("HEAD").get(version) : head;
  if (!release) {
    console.error(`no commit on HEAD's first-parent history carries ${version}`);
    process.exit(1);
  }
  console.log(release);
  process.exit(0);
}

// The edition the site serves at latest/, or null when the site could not be asked. Only a versions.json that names
// an edition is an answer. A 404 is not: Pages answers that for a site whose domain or deployment is broken too, and a
// site that really has no versions.json gets one from this run's deploy.
async function liveVersion() {
  const url = new URL("versions.json", new URL(pkg.guidelines.url));
  const waits = [2_000, 5_000, 10_000]; // before the second, third and fourth request
  for (let attempt = 0; ; attempt++) {
    let problem;
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (r.status === 200) {
        const latest = (await r.json())?.latest;
        if (typeof latest === "string" && /^\d+\.\d+\.\d+$/.test(latest)) return latest;
        problem = "it names no latest edition";
      } else {
        problem = `HTTP ${r.status}`;
      }
    } catch (e) {
      problem = e.cause?.code ?? e.cause?.message ?? e.message;
    }
    const again = attempt < waits.length;
    console.error(`${url}: ${problem}${again ? `; asking again in ${waits[attempt] / 1000} s` : ""}`);
    if (!again) return null;
    await new Promise((done) => setTimeout(done, waits[attempt]));
  }
}

let publish = head;
let site = head;
let base = process.env.BEFORE && !/^0+$/.test(process.env.BEFORE) ? process.env.BEFORE : `${head}^1`;
let why = "nothing pending: HEAD is the edition";
if (pending) {
  const tagged = originTags().has(version);
  const release = releaseCommits("HEAD").get(version);
  if (!release) {
    console.error(`no commit on HEAD's first-parent history carries ${version}`);
    process.exit(1);
  }
  site = release;
  const live = tagged ? await liveVersion() : null;
  if (tagged && live === version) {
    publish = "";
    why = `${version} is tagged and live: serving it from ${release.slice(0, 7)}, and the batch under [Unreleased] at next/`;
  } else if (tagged && live === null) {
    publish = "";
    why = `${version} is tagged, and the site could not be asked whether it is live: publishing nothing new, serving it from ${release.slice(0, 7)}, and the batch under [Unreleased] at next/`;
    // An annotation on the run, so "could not be asked" is seen and not only logged.
    console.error(`::warning title=Pauta ${version} may not be archived::${pkg.guidelines.url} could not be asked which edition is live, so ${version} was not archived again. This run deploys it; if the versions branch lacks ${version}/, the next release's run rebuilds it.`);
  } else {
    publish = release;
    base = `${release}^1`;
    why = `${version} is ${tagged ? `tagged but not live (live: ${live})` : "untagged"}: publishing it from ${release.slice(0, 7)}`;
  }
} else {
  const release = releaseCommits("HEAD").get(version);
  if (release && release !== head && !originTags().has(version)) {
    publish = release;
    base = `${release}^1`;
    why = `nothing pending, and ${version} is untagged: checking and tagging it at ${release.slice(0, 7)}, the commit that released it, and building the site from HEAD`;
  }
}
if (publish) base = git("rev-parse", base);

console.log(`version=${version}`);
console.log(`pending=${pending}`);
console.log(`publish=${publish}`);
console.log(`base=${publish ? base : ""}`);
console.log(`site=${site}`);
console.log(`next=${pending ? head : ""}`);
console.error(why);
