// Where each edition was released, read from git: the first commit on a ref's first-parent history whose package.json
// carries the version. Node scripts only (scripts/release-state.mjs, scripts/missing-editions.mjs,
// scripts/check-edition.mjs); the site never imports it.
import { execFileSync } from "node:child_process";

const git = (...a) => execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

/** Version -> the commit that released it, for every version on `ref`'s first-parent history. */
export function releaseCommits(ref = "HEAD") {
  const first = new Map();
  for (const c of git("log", "--first-parent", "--reverse", "--format=%H", ref, "--", "package.json").split("\n")) {
    if (!c) continue;
    let v;
    try {
      v = JSON.parse(git("show", `${c}:package.json`)).version;
    } catch {
      continue;
    }
    if (!first.has(v)) first.set(v, c);
  }
  return first;
}

/** The versions tagged v<x.y.z> on origin, each with the commit its tag points at (an annotated tag's `^{}` wins). */
export function originTags() {
  const tags = new Map();
  for (const line of git("ls-remote", "--tags", "origin").split("\n")) {
    const m = line.match(/^(\w+)\s+refs\/tags\/v(\d+\.\d+\.\d+)(\^\{\})?$/);
    if (m && (m[3] || !tags.has(m[2]))) tags.set(m[2], m[1]);
  }
  return tags;
}
