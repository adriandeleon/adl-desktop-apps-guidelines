#!/usr/bin/env node
// Fails when a rule is malformed (AGENTS.md, "Rule IDs"): a head that doesn't match, an ID used twice, a prefix on
// two pages, a rule without its statement, its one Check and its one Reference line, a table with a Level column, or
// a retired ID back in use (src/lib/rules.mjs finds these). It also holds the pages to the rules:
//   - every page is in pages.json, and the two that are not (the overview and the changelog) hold no rule, nor do the
//     pages of the family appendix (pages.json's `appendix`), which no edition holds;
//   - a relative link leads somewhere: to a page, to a section or a rule that page has (`../keyboard/#kbd-07` points
//     at a rule that exists, on that page, and reads as that rule), to a screenshot that is there. An edition's page
//     reaches the appendix beside the editions (`../../family/gaps/`); the appendix reaches the rules in latest/
//     (`../../latest/menus/#menu-14`) and its own pages;
//   - a retired ID is not named anywhere in the pages or the audit skill, and retired-rules.json loses no entry,
//     repeats none and lists only IDs an edition had (src/lib/rules.mjs, against rule-changes.json);
//   - every line of the New app checklist names its rules, every MUST is on a line, and a line's level is its rules'
//     level: a line marked "(SHOULD)" names only SHOULDs, any other line only MUSTs. A line is the item as the page
//     shows it: with the lines it wraps onto, and not one inside a code block or a comment.
// `npm run check`; scripts/build-site.mjs runs it before building, so CI catches it.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { blankCode, parsePage, readRules } from "../src/lib/rules.mjs";
import { APPENDIX, NEXT } from "../src/lib/site.mjs";

process.chdir(fileURLToPath(new URL("..", import.meta.url))); // not .pathname, which keeps a space as %20
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
const docs = files(DOCS).map((file) => ({ file, slug: relative(DOCS, file).replace(/\.mdx?$/, ""), text: readFileSync(file, "utf8") }));

// Every page is in pages.json: the sidebar, the PDF and the rules are read from it, so a page it lacks is in none of
// them. The two it leaves out on purpose are no place for a rule.
const OUTSIDE = new Set(["index", "changelog"]); // the overview, and the page rendered from CHANGELOG.md
const inOrder = new Set(pages.map((p) => p.slug));
// The family appendix: its own build, beside the editions, and in none of them (src/lib/site.mjs).
const appendix = new Set(JSON.parse(readFileSync("pages.json", "utf8")).appendix?.items ?? []);
for (const slug of appendix) {
  if (!slug.startsWith(`${APPENDIX}/`)) problems.push(`pages.json: the appendix's page ${slug} is not under ${APPENDIX}/`);
  if (inOrder.has(slug)) problems.push(`pages.json: ${slug} is both in an edition's groups and in the appendix`);
}
for (const { file, slug, text } of docs) {
  if (inOrder.has(slug)) continue;
  if (slug.startsWith(`${APPENDIX}/`) && !appendix.has(slug)) {
    problems.push(`${file} is not in pages.json's appendix, so the appendix's sidebar leaves it out`);
    continue;
  }
  if (!OUTSIDE.has(slug) && !appendix.has(slug)) {
    problems.push(`${file} is not in pages.json, so the sidebar, the PDF and rules.json leave it out`);
    continue;
  }
  const stray = parsePage(slug, text);
  for (const r of stray.rules) problems.push(`${slug}: ${r.id} is a rule on a page outside an edition's pages, where no rule is read`);
  problems.push(...stray.problems.filter((p) => p.includes("malformed rule head")));
}

// Where a link can land on each page: its headings, slugged as the site slugs them (github-slugger: lowercase,
// punctuation dropped, spaces to hyphens, a repeat numbered), its rules, and the ids its HTML carries.
const words = (md) =>
  md
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>|&\w+;/g, "")
    .replace(/[`*]|(?<![\p{L}\p{N}])_+|_+(?![\p{L}\p{N}])/gu, "");
const slugify = (heading) => words(heading).trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, "").replace(/ /g, "-");
const anchors = new Map(
  docs.map(({ slug, text }) => {
    const ids = new Set(["_top"]);
    const used = new Map();
    const body = blankCode(text.replace(/^---\n[\s\S]*?\n---\n/, ""));
    for (const [, heading] of body.matchAll(/^#{1,6} +(.+?)(?: +#+)?\s*$/gm)) {
      const base = slugify(heading);
      const n = used.get(base) ?? 0;
      used.set(base, n + 1);
      ids.add(n ? `${base}-${n}` : base);
    }
    for (const [, id] of body.matchAll(/\sid="([^"]+)"/g)) ids.add(id);
    return [slug === "index" ? "" : slug, ids];
  }),
);
for (const r of ruleById.values()) anchors.get(r.slug).add(r.id.toLowerCase());

// Every relative link, outside code: "[label](target)" with or without a title, href="target" in the page's own HTML,
// and "[ref]: target". A link to a rule's anchor resolves to that rule, on its own page, under its own name.
const LINK = /(!?\[(?:[^\]\\]|\\.)*)?\]\(\s*<?([^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)|\bhref=(["'])([^"']*)\3|^ {0,3}\[[^\]]+\]:\s*<?([^\s>]+)/gm;
const RULE_ID = /^[A-Za-z]{2,6}-\d{2,3}$/;
// What an edition serves beside its pages (src/pages/, scripts/build-print.sh).
const SERVED = /^(?:rules\.json|llms(?:-full)?\.txt|(?:rules|audit)\.schema\.json|skills\/.+|downloads\/adl-desktop-apps-guidelines\.(?:md|pdf))$/;
for (const { file, slug, text } of docs) {
  const body = blankCode(text, true);
  for (const m of body.matchAll(LINK)) {
    const target = m[2] ?? m[4] ?? m[5];
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) continue; // another site
    const at = `${slug}:${body.slice(0, m.index).split("\n").length}`;
    if (target.startsWith("/")) {
      problems.push(`${at}: a link to "${target}"; pages link with relative paths, which carry the edition's folder`);
      continue;
    }
    if (/\.(?:png|jpe?g|gif|svg|webp|avif)$/i.test(target)) {
      // A screenshot is a file, found from the page's own folder.
      if (!existsSync(join(dirname(file), target))) problems.push(`${at}: the image ${target} is not there`);
      continue;
    }
    // Resolved inside a folder that stands for the edition's, so a link that climbs out of it is seen. An appendix
    // page sits at the site root's family/ instead, beside the editions, and reaches them through latest/.
    const inAppendix = appendix.has(slug);
    const url = new URL(target, inAppendix ? `https://x/${slug}/` : `https://x/edition/${slug === "index" ? "" : `${slug}/`}`);
    if (!inAppendix && url.pathname === `/${NEXT}/`) continue; // Pauta Next, a folder beside the editions (scripts/build-next.mjs)
    const folder = inAppendix ? "/latest/" : "/edition/";
    let page;
    if (url.pathname.startsWith(`/${APPENDIX}/`)) {
      page = decodeURIComponent(url.pathname.slice(1)).replace(/\/$/, "");
      if (!appendix.has(page)) {
        problems.push(`${at}: a link to "${target}", which is no page of the family appendix (pages.json's appendix)`);
        continue;
      }
    } else if (url.pathname.startsWith(folder)) {
      page = decodeURIComponent(url.pathname.slice(folder.length - 1)).replace(/^\/|\/$/g, "");
      if (appendix.has(page)) {
        problems.push(`${at}: a link to "${target}"; no edition holds the family appendix, which lives beside them at ../../${page}/ from a page one folder deep`);
        continue;
      }
    } else {
      problems.push(
        inAppendix
          ? `${at}: a link to "${target}"; the family appendix reaches the guide through latest/ ("../../latest/menus/") and its own pages ("../gaps/")`
          : `${at}: a link to "${target}", which leaves the edition's folder; only ${NEXT}/ and the family appendix live beside it`,
      );
      continue;
    }
    const anchor = decodeURIComponent(url.hash.slice(1));
    if (RULE_ID.test(anchor)) {
      const id = anchor.toUpperCase();
      const rule = ruleById.get(id);
      const label = words((m[1] ?? "").replace(/^!?\[/, "")).trim();
      if (!rule) problems.push(`${at}: a link to ${id}, which is not a rule`);
      else if (page !== rule.slug) problems.push(`${at}: the link to ${id} points at "${page}", but the rule is on ${rule.slug}`);
      else if (anchor !== anchor.toLowerCase()) problems.push(`${at}: the link to ${id} is written "#${anchor}"; a rule's anchor is lowercase, #${anchor.toLowerCase()}`);
      else if (RULE_ID.test(label) && label.toUpperCase() !== id) problems.push(`${at}: the link reads ${label} but leads to ${id}`);
    } else if (anchors.has(page)) {
      // The overview and the changelog draw headings from components, so only their own address is checked.
      if (anchor && !OUTSIDE.has(page || "index") && !anchors.get(page).has(anchor)) {
        problems.push(`${at}: a link to "#${anchor}" on ${page}, which has no such section, rule or id`);
      }
    } else if (!(SERVED.test(page) || (page.endsWith(".md") && anchors.has(page.slice(0, -3))))) {
      problems.push(`${at}: a link to "${target}", which is no page of the guide (pages.json) and nothing an edition serves`);
    }
  }
}

// A retired ID is not named in the pages or in the audit skill, in either case (an anchor is lowercase). The
// changelog, which records retirements, is CHANGELOG.md, not a page here.
const skill = files("skills").map((file) => ({ slug: file, text: readFileSync(file, "utf8") }));
for (const { slug, text } of [...docs, ...skill]) {
  for (const r of retired) {
    const re = new RegExp(`(?<![A-Za-z-])${r.id}(?!\\d)`, "i");
    text.split("\n").forEach((line, i) => {
      if (re.test(line)) problems.push(`${slug}:${i + 1}: names ${r.id}, retired in ${r.edition}${r.see ? `; ${r.see} holds it now` : ""}`);
    });
  }
}

// The checklist: each item names its rules, its level matches theirs, and every MUST is on it.
const checklist = docs.find((d) => d.slug === "checklist");
const listed = new Set();
const RULE_ANCHOR = /\]\(\s*<?[^)\s>]*#([a-z]{2,6}-\d{2,3})>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/gi;
// The page as it is shown: code blocks, comments and code spans blanked, so an item that is commented out or given
// as an example names no rule. An item runs on through the lines it wraps onto, up to a blank line or the next
// item, heading, table or quote, so a rule linked on a continuation line is on that item and held to its level.
const shown = blankCode(checklist.text, true).split("\n");
const TASK = /^\s*[-*+] \[[ xX]\] /; // a task item, however it is bulleted, nested or ticked
const ENDS_ITEM = /^\s*(?:$|[-*+] |\d+[.)] |#{1,6} |[|>])/;
shown.forEach((first, i) => {
  if (!TASK.test(first)) return;
  // Four spaces in, with no item above to be nested under, is an indented code block.
  if (/^ {4}/.test(first) && !/^\s*[-*+] /.test(shown.slice(0, i).findLast((l) => l.trim() && !/^ {2}/.test(l)) ?? "")) return;
  let end = i + 1;
  while (end < shown.length && !ENDS_ITEM.test(shown[end])) end++;
  const line = shown.slice(i, end).join(" ");
  const at = `checklist:${i + 1}`;
  const ids = [...line.matchAll(RULE_ANCHOR)].map((m) => m[1].toUpperCase());
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
