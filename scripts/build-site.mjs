#!/usr/bin/env node
// The whole site, every edition in its own folder (AGENTS.md, "Editions on the site"):
//   dist/latest/              this checkout, built with base <root>/latest
//   dist/<version>/           this checkout again, built with base <root>/<version> (package.json's version)
//   dist/<earlier version>/   every edition published before, from the `versions` branch (scripts/archive-edition.sh),
//                             without its PDF unless it is one of the two newest (the link goes to GitHub instead)
//                             or from build/editions/ for one a canceled run never archived (scripts/build-edition.sh)
//   dist/next/                while [Unreleased] holds changes, this checkout again as next/, the batch waiting for the
//                             next edition (scripts/build-next.mjs); while it doesn't, a redirect to latest/ per page
//   dist/versions.json        every edition, which one is latest, and next/ when it is built; public/versions.js reads
//                             it on every page
//   dist/<page>/index.html    a redirect to latest/<page>/ for every page, so links from before editions had folders work
//   dist/downloads/, CNAME, 404.html, versions.js   copies of the latest edition's: GitHub Pages reads them at the root
//   dist/llms.txt, llms-full.txt, rules.json   the latest edition's, where coding agents look for them (src/lib/llms.mjs)
//   dist/robots.txt   written here: everything allowed, latest/'s sitemap
//   dist/family/      the family appendix, in no edition (scripts/build-appendix.mjs): from this checkout, or from
//                     $PAUTA_APPENDIX, which CI builds from the commit it runs on
// In latest/ and <version>/, links into the apps' code point at the commits pins.json recorded for this edition.
//
// "This checkout" is this script's own, or $PAUTA_ROOT: while a batch waits under [Unreleased], CI builds the current
// edition from its release commit with master's copy of this script, so a fix to the build made after the release
// applies (.github/workflows/pages.yml, "Keep this run's scripts"). What the tree owns stays the tree's: its pages
// and src/ as `astro build` reads them there, with its own node_modules, so rules.json, llms.txt and every page are
// what that edition generates; its package.json, CHANGELOG.md and pins.json; and its own scripts/check-rules.mjs,
// which checks its pages with the parser that builds its rules.json (master's might ask more of them than the
// edition's did). The steps around them are the scripts beside this one, with the src/lib they import.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { compareVersions, isVersion, parseEditions, released, unreleased } from "../src/lib/editions.mjs";

const scripts = dirname(fileURLToPath(import.meta.url));
process.chdir(process.env.PAUTA_ROOT || fileURLToPath(new URL("..", import.meta.url))); // not .pathname, which keeps a space as %20
if (process.env.PAUTA_ROOT) process.env.PAUTA_ROOT = process.cwd(); // absolute, for the scripts started below
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const { version } = pkg;
const url = new URL(pkg.guidelines.url);
const root = url.pathname.replace(/\/?$/, "/");
const step = (what) => console.log(`\n▶ ${what}`);

const run = (cmd, args, options = {}) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", ...options });
  if (r.status !== 0) {
    console.error(`${cmd} ${args.join(" ")} failed`);
    process.exit(r.status ?? 1);
  }
};

// 0. Every rule well formed (scripts/check-rules.mjs): rules.json and llms-full.txt are built from them. The tree's
// own copy, never the one beside this script (see the top).
step("rules");
run("node", ["scripts/check-rules.mjs"]);

// While CHANGELOG.md's [Unreleased] holds changes, this checkout is not the edition its number names. CI builds latest/
// and <version>/ from the commit that released it instead, and next/ from this one (.github/workflows/pages.yml).
const pending = unreleased(readFileSync("CHANGELOG.md", "utf8")) !== "";
if (pending) {
  console.warn(`Note: [Unreleased] holds changes, so dist/${version}/ and latest/ show them under ${version} here; next/ is what CI deploys of them.`);
}

// 1. This edition, twice: at latest/ and at its own number.
rmSync("dist", { recursive: true, force: true });
for (const edition of ["latest", version]) {
  step(`astro build → dist/${edition}/`);
  run("npx", ["astro", "build"], { env: { ...process.env, PAUTA_PATH: edition } });
}

// 1b. The References this edition links, pinned to the commits pins.json recorded at its release (src/lib/pins.mjs).
step("references");
run("node", [join(scripts, "pin-dist.mjs"), ".", join("dist", "latest"), join("dist", version)]);

// 2. The earlier editions, archived on the `versions` branch: origin's if reachable, else a local one. In CI (where
// GitHub sets CI=true) a deploy without them would take every earlier address off the site, so anything less than
// every released edition fails the build instead.
step("earlier editions from the versions branch");
const ci = Boolean(process.env.CI);
const fail = (message) => {
  if (!ci) return console.warn(`Warning: ${message}`);
  console.error(message);
  process.exit(1);
};
const git = (...args) => spawnSync("git", args, { encoding: "utf8" });
const shallow = git("rev-parse", "--is-shallow-repository").stdout.trim() === "true";
const fetched = git("fetch", "--quiet", ...(shallow ? ["--depth=1"] : []), "origin", "+versions:refs/remotes/origin/versions");
if (fetched.status !== 0) fail(`could not fetch the versions branch from origin: ${fetched.stderr.trim()}`);
const ref = ["origin/versions", "versions"].find((r) => git("rev-parse", "--verify", "--quiet", `${r}^{commit}`).status === 0);
const earlier = [];
if (!ref) {
  fail("No `versions` branch reachable: the site would carry this edition alone.");
} else {
  const archive = "build/versions";
  rmSync(archive, { recursive: true, force: true });
  mkdirSync(archive, { recursive: true });
  run("bash", ["-o", "pipefail", "-c", `git archive ${ref} | tar -x -C ${archive}`]);
  for (const v of readdirSync(archive).filter((d) => isVersion(d) && d !== version && statSync(join(archive, d)).isDirectory())) {
    cpSync(join(archive, v), join("dist", v), { recursive: true });
    earlier.push(v);
  }
  console.log(earlier.length ? `${ref}: ${[...earlier].sort(compareVersions).join(", ")}` : `${ref} holds no other edition`);
}
// Editions a canceled run never archived, rebuilt from their commits by scripts/build-edition.sh; the publish job
// archives them after this deploy.
if (existsSync("build/editions")) {
  for (const v of readdirSync("build/editions").filter((d) => isVersion(d) && d !== version && !earlier.includes(d))) {
    cpSync(join("build/editions", v), join("dist", v), { recursive: true });
    earlier.push(v);
    console.log(`build/editions: ${v}, rebuilt from its commit`);
  }
}
earlier.sort(compareVersions);
const dates = Object.fromEntries(released(parseEditions(readFileSync("CHANGELOG.md", "utf8"))).map((e) => [e.version, e.date]));
const absent = Object.keys(dates).filter((v) => compareVersions(v, version) > 0 && !earlier.includes(v));
if (absent.length) {
  fail(
    `released but not on the site: ${absent.join(", ")}. scripts/missing-editions.mjs lists them with their commits; ` +
      `scripts/build-edition.sh <version> <commit> rebuilds each into build/editions/.`,
  );
}

// 3. The root: what GitHub Pages reads there, and the editions list.
step("root files and versions.json");
const latest = "dist/latest";
for (const name of ["CNAME", "404.html", "versions.js", "downloads", "llms.txt", "llms-full.txt", "rules.json"]) {
  if (existsSync(join(latest, name))) cpSync(join(latest, name), join("dist", name), { recursive: true });
}
// The downloads come from `npm run print` (scripts/build-print.sh), which the build does not run; without them every
// page's PDF and Markdown links are dead.
for (const file of ["adl-desktop-apps-guidelines.pdf", "adl-desktop-apps-guidelines.md"]) {
  const path = join(latest, "downloads", file);
  if (!existsSync(path) || statSync(path).size === 0) fail(`${path} is missing or empty: run npm run print before the build`);
}
// Crawlers may read everything: a numbered edition's pages carry noindex, which a crawler only sees if it may fetch
// them. The sitemap is latest/'s, the edition search engines index.
writeFileSync("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${url.origin}${root}latest/sitemap-index.xml\n`);
const versions = [...new Set([version, ...earlier])].sort(compareVersions);
writeFileSync(
  "dist/versions.json",
  JSON.stringify(
    { latest: version, versions: versions.map((v) => ({ version: v, date: dates[v] ?? null, path: `${root}${v}/` })) },
    null,
    2,
  ) + "\n",
);
// 3b. next/: this checkout as the batch waiting for its release, or redirects to latest/ when nothing waits.
step("next/");
if (pending) run("node", [join(scripts, "build-next.mjs"), "--build", "dist/next"]);
run("node", [join(scripts, "build-next.mjs"), "--add", "dist/next", "dist"]);

// The PDF of the two newest editions only (scripts/trim-pdfs.mjs).
run("node", [join(scripts, "trim-pdfs.mjs"), "dist"]);

// 4. A redirect for every page at its old, unnumbered address. The script keeps the fragment; the meta tag is the fallback.
step("redirects from the unnumbered addresses");
let redirects = 0;
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name === "index.html") {
      const rest = relative(latest, dirname(path)).replace(/\\/g, "/");
      const target = `${root}latest/${rest ? `${rest}/` : ""}`;
      const stub = join("dist", rest, "index.html");
      if (existsSync(stub)) continue; // an edition's folder, never a page's
      mkdirSync(dirname(stub), { recursive: true });
      writeFileSync(
        stub,
        `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pauta</title><meta name="robots" content="noindex">` +
          `<link rel="canonical" href="${url.origin}${target}"><meta http-equiv="refresh" content="0; url=${target}">` +
          `<script>location.replace(${JSON.stringify(target)} + location.hash)</script></head>` +
          `<body><p>Pauta's pages now live under an edition: <a href="${target}">${target}</a>.</p></body></html>\n`,
      );
      redirects++;
    }
  }
};
walk(latest);
console.log(`${redirects} redirects`);

// 5. The family appendix at family/, beside the editions and in none of them (scripts/build-appendix.mjs): built from
// this checkout, unless $PAUTA_APPENDIX holds one built from the commit CI runs on, which may be newer than the release
// commit this script is building latest/ from. After the redirects, so it replaces any an older latest/ left there.
step("family appendix");
const appendix = process.env.PAUTA_APPENDIX || "build/family";
if (!process.env.PAUTA_APPENDIX) run("node", [join(scripts, "build-appendix.mjs"), "--build", appendix]);
run("node", [join(scripts, "build-appendix.mjs"), "--add", appendix, "dist"]);

console.log(`\nPauta ${version} built: latest/${pending ? ", next/" : ""} and ${versions.join(", ")} in dist/`);
