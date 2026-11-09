#!/usr/bin/env node
// Pins the links in built pages (src/lib/pins.mjs): every .html, .md, .txt and .json file under each folder given,
// with the pins.json and version of the checkout at <root>. Nothing changes when that pins.json is for another
// edition. scripts/build-site.mjs runs it on latest/ and <version>/, and scripts/build-edition.sh on an edition it
// rebuilds from an older commit, so an edition is pinned however it was built.
//
//   node scripts/pin-dist.mjs <root> <dir>...
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pin, pinsFor } from "../src/lib/pins.mjs";

const [root, ...dirs] = process.argv.slice(2);
if (!root || !dirs.length) {
  console.error("usage: node scripts/pin-dist.mjs <root> <dir>...");
  process.exit(2);
}
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
const pins = pinsFor(version, root);
if (!pins) {
  console.log(`references left on their branches: ${root}/pins.json doesn't pin ${version}`);
  process.exit(0);
}
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : /\.(html|md|txt|json)$/.test(name) ? [path] : [];
  });
let changed = 0;
for (const file of dirs.flatMap(walk)) {
  const text = readFileSync(file, "utf8");
  const pinned = pin(text, pins);
  if (pinned !== text) {
    writeFileSync(file, pinned);
    changed++;
  }
}
console.log(`references pinned to pins.json (${version}): ${changed} files`);
