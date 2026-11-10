#!/usr/bin/env node
// The Markdown download, from the whole guide as scripts/combine.py joins it (scripts/build-print.sh). The pages draw
// their mockups in HTML, which the PDF prints and a Markdown reader shows as a wall of tags. Here each one becomes
// the text its page's own Markdown gives it (src/lib/llms.mjs, mockupsAsText): the mockup its name, its numbered
// parts a list, a table drawn in rows a Markdown table. So the download and <page>.md say the same.
//
//   node scripts/download-markdown.mjs <combined.md> <download.md>
//
// It reads and writes only its arguments, and imports nothing but src/lib beside it, so CI runs master's copy on the
// tree of a released edition (.github/workflows/pages.yml, "Keep this run's scripts").
import { readFileSync, writeFileSync } from "node:fs";
import { mockupsAsText } from "../src/lib/llms.mjs";
import { blankCode } from "../src/lib/rules.mjs";

const [from, to] = process.argv.slice(2);
if (!from || !to) {
  console.error("usage: download-markdown.mjs <combined.md> <download.md>");
  process.exit(2);
}
const text = mockupsAsText(readFileSync(from, "utf8")).replace(/\n{3,}/g, "\n\n");
// A mockup the conversion did not reach (one written without a blank line above it) would be left as tags.
const left = blankCode(text, true).split("\n").flatMap((line, i) => (/^<(?:div|svg|ol|ul|section|figure|table)\b/.test(line) ? [`${to}:${i + 1}: ${line.slice(0, 80)}`] : []));
if (left.length) {
  console.error(`download-markdown: ${left.length} block(s) of HTML left in the Markdown download; a mockup opens its own paragraph, after a blank line:\n  ${left.join("\n  ")}`);
  process.exit(1);
}
writeFileSync(to, text);
