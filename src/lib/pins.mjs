// References link the apps' code on its default branch, which moves on after an edition is released. pins.json
// records each repository's commit at the release (scripts/pin-references.mjs), and what that edition serves links
// those commits instead, so its References keep pointing at the code they were checked against. Links into this
// repository point at the edition's tag. A checkout whose pins.json is for another edition (unreleased work, or an
// edition from before pins) keeps the branch links. Used by scripts/build-site.mjs; scripts/combine.py does the same
// for the downloads.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const OWNER = "adriandeleon";
export const SELF = "adl-desktop-apps-guidelines";
const LINK = /github\.com\/adriandeleon\/([A-Za-z0-9_.-]+)\/(blob|tree)\/(master|main)\//g;
const RAW = /raw\.githubusercontent\.com\/adriandeleon\/adl-desktop-apps-guidelines\/master\//g;

/** The repositories the text links into, with the branch each is linked on; this repository left out. */
export function linkedRepos(text) {
  const repos = new Map();
  for (const m of text.matchAll(LINK)) if (m[1] !== SELF) repos.set(m[1], [...new Set([...(repos.get(m[1]) ?? []), m[3]])]);
  return repos;
}

/** pins.json when it pins `version`, else null. */
export function pinsFor(version, root = process.cwd()) {
  const path = join(root, "pins.json");
  if (!existsSync(path)) return null;
  const pins = JSON.parse(readFileSync(path, "utf8"));
  return pins.edition === version ? pins : null;
}

/** `text` with its branch links pinned; unchanged when `pins` is null or doesn't know a repository. */
export function pin(text, pins) {
  if (!pins) return text;
  return text
    .replace(LINK, (link, repo, kind) => {
      const ref = repo === SELF ? `v${pins.edition}` : pins.repos[repo];
      return ref ? `github.com/${OWNER}/${repo}/${kind}/${ref}/` : link;
    })
    .replace(RAW, `raw.githubusercontent.com/${OWNER}/${SELF}/v${pins.edition}/`);
}
