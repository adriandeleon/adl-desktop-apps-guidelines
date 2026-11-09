#!/usr/bin/env node
// Keeps the PDF of the two newest editions on the site and no other (AGENTS.md, "Editions on the site"). Each PDF is
// about 10 MB, most of the site, and GitHub Pages slows past its deploy timeout as the site grows. Every edition's PDF
// stays on the `versions` branch; an older edition's one link to it, on its overview, points there on GitHub instead.
//
//   node scripts/trim-pdfs.mjs <dist>     after the build: scripts/build-site.mjs runs it, and so does CI with
//                                         master's copy, so an edition published again from its own commit is trimmed too
//
// Self-contained (node: only), so CI can run master's copy against any checkout. Running it twice changes nothing.
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const KEEP = 2;
const PDF = "downloads/adl-desktop-apps-guidelines.pdf";
const REPO = process.env.GITHUB_REPOSITORY || "adriandeleon/adl-desktop-apps-guidelines";
const dist = process.argv[2] || "dist";

// versions.json lists every edition on the site, newest first, each with its path (scripts/build-site.mjs).
const { versions } = JSON.parse(readFileSync(join(dist, "versions.json"), "utf8"));
const problems = [];
for (const { version: v, path } of versions.slice(KEEP)) {
  const pdf = join(dist, v, PDF);
  if (!existsSync(pdf)) continue;
  rmSync(pdf);
  const onGitHub = `https://github.com/${REPO}/raw/versions/${v}/${PDF}`;
  const link = new RegExp(`href="(?:${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})?${PDF.replace(/\./g, "\\.")}"`, "g");
  let links = 0;
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(".html")) {
        const text = readFileSync(p, "utf8");
        const fixed = text.replace(link, () => (links++, `href="${onGitHub}"`));
        if (fixed !== text) writeFileSync(p, fixed);
      }
    }
  };
  walk(join(dist, v));
  if (!links) problems.push(`${v}: no link to ${PDF} to point at GitHub`);
}
console.log(`PDFs on the site: ${versions.slice(0, KEEP).map((e) => e.version).join(", ")}`);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
