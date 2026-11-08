#!/usr/bin/env node
// Fails when a rule is malformed (AGENTS.md, "Rule IDs"): a head that doesn't match, an ID used twice, a prefix on
// two pages, a rule without its one Check and one Reference line, a table with a Level column, or a retired ID back
// in use. It also holds the pages to the rules:
//   - a link to a rule's anchor (`../keyboard/#kbd-07`) points at a rule that exists, on that page;
//   - a retired ID is not named anywhere in the pages;
//   - every line of the New app checklist names its rules, every MUST is on a line, and a line's level is its rules'
//     level: a line marked "(SHOULD)" names only SHOULDs, any other line only MUSTs.
// `npm run check`; scripts/build-site.mjs runs it before building, so CI catches it.
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { readRules } from "../src/lib/rules.mjs";

process.chdir(new URL("..", import.meta.url).pathname);
const { pages, retired, problems } = readRules();
const rules = pages.flatMap((p) => p.rules);
const ruleById = new Map(pages.flatMap((p) => p.rules.map((r) => [r.id, { ...r, slug: p.slug }])));
const count = (key) => rules.reduce((n, r) => ((n[key(r)] = (n[key(r)] ?? 0) + 1), n), {});

// Every page under src/content/docs, rule pages or not, by its slug.
const DOCS = "src/content/docs";
const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : /\.mdx?$/.test(e.name) ? [join(dir, e.name)] : [],
  );
const docs = files(DOCS).map((file) => ({ slug: relative(DOCS, file).replace(/\.mdx?$/, ""), text: readFileSync(file, "utf8") }));

// Links to a rule's anchor resolve to that rule, on its own page.
const RULE_ANCHOR = /\]\(([^)\s]*#([a-z]{2,6}-\d{2,3}))\)/g;
for (const { slug, text } of docs) {
  text.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(RULE_ANCHOR)) {
      const id = m[2].toUpperCase();
      const rule = ruleById.get(id);
      const here = slug === "index" ? "" : `${slug}/`;
      const target = new URL(m[1], `https://x/${here}`).pathname.replace(/^\/|\/$/g, "");
      if (!rule) problems.push(`${slug}:${i + 1}: a link to ${id}, which is not a rule`);
      else if (target !== rule.slug) problems.push(`${slug}:${i + 1}: the link to ${id} points at "${target}", but the rule is on ${rule.slug}`);
    }
  });
}

// A retired ID is not named in the pages. The changelog, which records retirements, is CHANGELOG.md, not a page here.
for (const { slug, text } of docs) {
  for (const r of retired) {
    const re = new RegExp(`(?<![A-Z-])${r.id}(?!\\d)`);
    text.split("\n").forEach((line, i) => {
      if (re.test(line)) problems.push(`${slug}:${i + 1}: names ${r.id}, retired in ${r.edition}${r.see ? `; ${r.see} holds it now` : ""}`);
    });
  }
}

// The checklist: each item names its rules, its level matches theirs, and every MUST is on it.
const checklist = docs.find((d) => d.slug === "checklist");
const listed = new Set();
checklist.text.split("\n").forEach((line, i) => {
  if (!/^- \[ \] /.test(line)) return;
  const at = `checklist:${i + 1}`;
  const ids = [...line.matchAll(RULE_ANCHOR)].map((m) => m[2].toUpperCase());
  if (!ids.length) return problems.push(`${at}: names no rule; end the line with links to the rules it sums up`);
  const level = /\(SHOULD\)/.test(line) ? "SHOULD" : "MUST";
  for (const id of ids) {
    listed.add(id);
    const rule = ruleById.get(id);
    if (rule && rule.level !== level) {
      const hint = level === "MUST" ? ' (mark the line "(SHOULD)", or split it)' : "";
      problems.push(`${at}: ${id} is a ${rule.level} on its page, but the line reads as a ${level}${hint}`);
    }
  }
});
for (const r of rules) if (r.level === "MUST" && !listed.has(r.id)) problems.push(`checklist: ${r.id} is a MUST, but no line names it`);

if (problems.length) {
  console.error(`${problems.length} problem(s) in the rules:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
const levels = count((r) => r.level);
const checks = count((r) => r.check.kind);
console.log(
  `${rules.length} rules on ${pages.filter((p) => p.rules.length).length} pages: ` +
    `${levels.MUST ?? 0} MUST, ${levels.SHOULD ?? 0} SHOULD, ${levels.MAY ?? 0} MAY; ` +
    `checked by code ${checks.code ?? 0}, test ${checks.test ?? 0}, hand ${checks["by hand"] ?? 0}; ` +
    `${retired.length} IDs retired; every MUST is on the checklist`,
);
