#!/usr/bin/env node
// The screenshots as JPEG, for the PDF only (scripts/build-print.sh). Chrome embeds a PNG as raw pixels and a JPEG as
// it is, so this keeps the PDF a fraction of the size. At most 1200 px wide, which is 180 dpi across the column, on white. Uses
// sharp, which the site's own build (Astro) installs from the lockfile.
//
//   node scripts/print-shots.mjs <shots folder> <out folder>
import { mkdirSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// sharp is loaded from the tree being built (its node_modules, installed from its lockfile), not from beside this
// script: CI runs master's copy of the script from a folder that holds no packages, on the checkout of a released
// edition (scripts/build-print.sh sets PAUTA_ROOT). An `import "sharp"` would look beside the script only.
const root = resolve(process.env.PAUTA_ROOT || fileURLToPath(new URL("..", import.meta.url)));
const sharp = createRequire(join(root, "package.json"))("sharp");

const [src, dst] = process.argv.slice(2);
mkdirSync(dst, { recursive: true });
for (const name of readdirSync(src).filter((n) => n.endsWith(".png")).sort()) {
  await sharp(join(src, name))
    .flatten({ background: "#ffffff" })
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(dst, `${parse(name).name}.jpg`));
}
