// The guide's rules, read from the page Markdown (AGENTS.md, "Rule IDs"). A rule is a list item that opens with
// "**KBD-07 · MUST.**", then sub-items "*Why:*", "*Check (code|test|by hand):*", "*Command:*" (optional, a code check
// only: one shell command in backticks that exits 0 when the check passes) and "*Reference:*". Shared by the
// rules.json, llms.txt and llms-full.txt endpoints (src/pages/) and scripts/check-rules.mjs, which fails the build
// on a malformed rule.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notReadOnly } from "./command.mjs";

const HEAD = /^- \*\*([A-Z]{2,6})-(\d{2,3}) · (MUST|SHOULD|MAY)\.\*\*\s*(.*)$/;
// What looks like a rule's head and is not one: an ID and a level with the dot between them, however they are dressed
// (HEADLIKE), or an ID in bold of either kind ("**Kbd-7", "__KBD-07"). The site would render it as text and no rule
// would exist.
const HEADLIKE = /\b[A-Za-z]{2,}-\d+[*_]* · [*_]*(?:MUST|SHOULD|MAY)\b/;
const LOOSE = new RegExp(`(?:\\*\\*|__)[A-Za-z]{2,}-\\d|${HEADLIKE.source}`);
const SUB = /^ {2}- \*(Why|Check \((code|test|by hand)\)|Command|Reference):\*\s*(.*)$/;
// A Command is one code span, in single or double backticks (double when the command itself has a backtick). It opens
// with GUARD, so run anywhere but an app's root it fails rather than passing on an empty tree, and it only reads:
// every command it runs is on command.mjs's list of readers, and it redirects into no file (agents run these from a
// downloaded file).
const COMMAND = /^(`{1,2}) ?(.+?) ?\1$/;
export const GUARD = "[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; };";
// "the table above", "see below", "the following list", "the states that follow": words that point at the page around
// a rule, which an agent reading the rule alone does not have.
const THING = "(?:tables?|lists?|mockups?|matrix|languages|targets|specs?|sections?|states|shapes?|steps|rows?|figures?)";
const LEANS = new RegExp(
  `\\b(?:(?:as (?:defined |shown |described |listed )?|shown |listed |described )(?:above|below)\\b` +
    `|see (?:[\\w'’-]+ ){0,5}(?:above|below)(?=\\s*(?:[.,;:)\\]]|$))` + // "see In the apps below"
    `|${THING} (?:above|below|that follows?)\\b|(?:above|following) ${THING}\\b)`,
  "i",
);
// "**Applies to:** an app with a tray icon." limits every rule after it: at the top of a page, before its first heading
// and rule, it holds for the page; right under a "## " heading, for that section. A rule with neither applies to every
// app unless its own text names the apps it covers (Conformance, PAUTA-05).
const APPLIES = /^\*\*Applies to:\*\*\s*(.*)$/;
// The same words written any other way ("**Applies to**:", "*Applies to:*", in a list item, in the middle of a
// paragraph): the site shows them, and no rule would carry them.
const APPLIES_LOOSE = /(\*\*|__|\*|_)[Aa]pplies [Tt]o(?::\1|\1:)|^\s*(?:[-*+>] )?Applies to:/;
// A line that may follow a rule's item without being part of it: a new item, a heading, a table, a fence, HTML, a quote.
const STARTS_BLOCK = /^(?:[-*+] |\d+[.)] |#{1,6} |`{3}|~{3}|[<|>]|(?:-{3,}|\*{3,}|_{3,})\s*$)/;

/** Page slugs in reading order, from pages.json. */
export function pageOrder(pagesJson) {
  return pagesJson.groups.flatMap((g) => g.items);
}

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  const get = (key) => m?.[1].match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1] ?? "";
  const offset = m ? m[0].split("\n").length - 1 : 0; // so problems name the file's own line numbers
  return { title: get("title"), description: get("description"), body: m ? text.slice(m[0].length) : text, offset };
}

const join_ = (lines) => lines.map((l) => l.trim()).join(" ").trim();

/**
 * `markdown` with what is not prose blanked out, character for character, so offsets and line numbers hold: fenced
 * code blocks and HTML comments, and with `spans` the code spans too. An example of a rule, a heading, an Applies to
 * line or a link is not one.
 */
export function blankCode(markdown, spans = false) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return markdown.replace(
    /^ *(`{3,}|~{3,})[^\n]*(?:\n[\s\S]*?^ *\1[^\n]*$|[\s\S]*)|<!--(?:[\s\S]*?-->|[\s\S]*)|``[^\n]*?``|`[^`\n]*`/gm,
    (m, fence) => (fence || m.startsWith("<!--") || spans ? blank(m) : m),
  );
}
const noSpans = (line) => line.replace(/``[^\n]*?``|`[^`\n]*`/g, (m) => " ".repeat(m.length));

/**
 * One page's rules.
 * @returns {{ slug, title, description, prefix, rules: object[], problems: string[] }}
 */
export function parsePage(slug, text) {
  const { title, description, body, offset } = frontmatter(text);
  const lines = body.split("\n");
  // The same lines with fenced code and comments blanked: what the page is read by. A rule's own text comes from `lines`.
  const prose = blankCode(body).split("\n");
  const rules = [];
  const problems = [];
  let section = "";
  let appliesTo = null; // the page's
  let sectionAppliesTo = null;
  let opening = true; // nothing but prose since the top of the page or the last "## " heading: no rule, list or table
  for (let i = 0; i < lines.length; i++) {
    const line = prose[i];
    const at = `${slug}:${i + 1 + offset}`;
    if (/^## /.test(line)) {
      section = line.slice(3).trim();
      sectionAppliesTo = null;
      opening = true;
      continue;
    }
    if (/^(?:#{3,} |[-*+] |\d+[.)] |\|)/.test(line)) opening = false;
    const a = line.match(APPLIES);
    if (a) {
      const alone = i === 0 || prose[i - 1].trim() === "";
      const para = [a[1]];
      while (i + 1 < lines.length && prose[i + 1].trim() !== "") para.push(prose[++i]);
      const text = join_(para);
      if (!opening) problems.push(`${at}: an Applies to line after a rule, a list, a table or a ### heading; it belongs at the top of the page or right under a ## heading`);
      else if (!alone) problems.push(`${at}: an Applies to line in the middle of a paragraph; it opens its own`);
      else if (!text) problems.push(`${at}: an Applies to line that says nothing`);
      else if (section) sectionAppliesTo = text;
      else appliesTo = text;
      continue;
    }
    const bare = noSpans(line);
    if (APPLIES_LOOSE.test(bare)) {
      problems.push(`${at}: an Applies to line is written "**Applies to:** an app with…", alone at the start of its own paragraph: ${line.trim().slice(0, 60)}`);
    }
    // A header row with a "Level" cell, not a row that happens to hold the word ("| Log Level | … |").
    if (/^\|(?:.*\|)?\s*Level\s*\|/.test(line) && /^\|[\s:|-]+\|\s*$/.test(prose[i + 1] ?? "")) {
      problems.push(`${at}: a table with a Level column; rules are list items`);
    }
    const m = line.trim() ? lines[i].match(HEAD) : null;
    if (!m) {
      if (LOOSE.test(bare)) problems.push(`${at}: malformed rule head: ${line.slice(0, 60)}`);
      continue;
    }
    opening = false;
    const first = i;
    const block = [lines[i]];
    while (i + 1 < lines.length && lines[i + 1].startsWith("  ")) block.push(lines[++i]);
    const id = `${m[1]}-${m[2]}`;
    if (m[2].length > 2 && m[2].startsWith("0")) problems.push(`${at}: ${id} pads its number; it is ${m[1]}-${m[2].slice(1)} (two digits until a page has a hundred rules)`);
    // Inside the item, outside its code: no second head, no Applies to.
    for (let k = first; k <= i; k++) {
      const inside = noSpans(k === first ? m[4] : prose[k]);
      if (HEADLIKE.test(inside)) problems.push(`${slug}:${k + 1 + offset}: a second rule head inside ${id}; a rule is its own list item: ${inside.trim().slice(0, 60)}`);
      if (APPLIES_LOOSE.test(inside)) problems.push(`${slug}:${k + 1 + offset}: an Applies to line inside ${id}; it opens its own paragraph, above the rules it limits`);
    }
    // What Markdown still counts as the item, and this reader does not: a line that carries on without its indent
    // (cut from the rule), and an indented paragraph after a blank line (on the page, not in rules.json).
    const next = prose[i + 1] ?? "";
    if (next.trim() !== "" && !STARTS_BLOCK.test(next.trimStart())) {
      problems.push(`${slug}:${i + 2 + offset}: a line that carries on ${id} without its indent, so the rule loses it: ${next.trim().slice(0, 50)}`);
    }
    let after = i + 1;
    while (after < lines.length && lines[after].trim() === "") after++;
    if (after > i + 1 && after < lines.length && lines[after].startsWith("  ")) {
      problems.push(`${slug}:${after + 1 + offset}: an indented paragraph after a blank line stays in ${id}'s item on the page but is no part of the rule; put it in the statement or a sub-item, or unindent it: ${lines[after].trim().slice(0, 50)}`);
    }
    const rule = { id, prefix: m[1], number: Number(m[2]), level: m[3], section, appliesTo: sectionAppliesTo ?? appliesTo, text: "", why: null, check: null, command: null, reference: null, markdown: block.join("\n") };
    const statement = [m[4]];
    let current = null; // the sub-item being continued
    for (const l of block.slice(1)) {
      const s = l.match(SUB);
      if (s) {
        current = { label: s[1], kind: s[2], lines: [s[3]] };
        if (s[1] === "Why") rule.why !== null ? problems.push(`${slug}: ${id} has two Why lines`) : (rule.why = current);
        else if (s[1] === "Reference") rule.reference !== null ? problems.push(`${slug}: ${id} has two Reference lines`) : (rule.reference = current);
        else if (s[1] === "Command") rule.command !== null ? problems.push(`${slug}: ${id} has two Command lines`) : (rule.command = current);
        else rule.check !== null ? problems.push(`${slug}: ${id} has two Check lines`) : (rule.check = current);
      } else if (/^ {2}[-*+] /.test(l)) {
        problems.push(`${slug}: ${id} has a sub-item that is not "- *Why:*", "- *Check (…):*", "- *Command:*" or "- *Reference:*": ${l.trim().slice(0, 50)}`);
        current = null;
      } else if (current && /^ {4}/.test(l)) current.lines.push(l);
      else if (!current) statement.push(l);
      else problems.push(`${slug}: ${id} has a line outside its sub-items: ${l.trim().slice(0, 50)}`);
    }
    rule.text = join_(statement);
    if (!rule.text) problems.push(`${slug}: ${id} has no statement`);
    if (rule.why) rule.why = join_(rule.why.lines);
    if (rule.reference) rule.reference = join_(rule.reference.lines);
    else problems.push(`${slug}: ${id} has no Reference line`);
    if (rule.check) rule.check = { kind: rule.check.kind, text: join_(rule.check.lines) };
    else problems.push(`${slug}: ${id} has no Check line`);
    for (const [label, said] of [["Why", rule.why], ["Check", rule.check?.text], ["Reference", rule.reference]]) {
      if (said === "") problems.push(`${slug}: ${id}'s ${label} line is empty`);
    }
    if (rule.command) {
      const c = join_(rule.command.lines).match(COMMAND);
      if (!c) problems.push(`${slug}: ${id}'s Command is not one code span: ${join_(rule.command.lines).slice(0, 50)}`);
      else if (rule.check?.kind !== "code") problems.push(`${slug}: ${id} has a Command, but only a Check (code) takes one`);
      else if (!c[2].startsWith(GUARD + " ")) problems.push(`${slug}: ${id}'s Command must open with the app-root guard: ${GUARD}`);
      else {
        const w = notReadOnly(c[2]);
        if (w) problems.push(`${slug}: ${id}'s Command may only read; it has ${w}`);
      }
      rule.command = c ? c[2] : null;
    }
    // A rule reaches agents on its own (rules.json, llms-full.txt), so it can't lean on "the table above": it says
    // what it means, or links the section. Its Reference is read alone too.
    const leans = noSpans([rule.text, rule.why, rule.check?.text, rule.reference].join(" ")).match(LEANS);
    if (leans) problems.push(`${slug}: ${id} points at "${leans[0]}" on its page; say it in the rule, or link the section`);
    rules.push(rule);
  }
  const prefixes = [...new Set(rules.map((r) => r.prefix))];
  if (prefixes.length > 1) problems.push(`${slug}: several prefixes (${prefixes.join(", ")}); a page has one`);
  // IDs are permanent (AGENTS.md): a retired rule leaves a gap and a new one takes the next free number wherever it
  // sits, so only a repeat is wrong.
  const seen = new Map(); // number -> the ID that took it ("KBD-007" is "KBD-07" again)
  for (const r of rules) {
    const taken = seen.get(r.number);
    if (taken === r.id) problems.push(`${slug}: ${r.id} is used twice`);
    else if (taken) problems.push(`${slug}: ${r.id} and ${taken} are one number written two ways`);
    seen.set(r.number, r.id);
  }
  return { slug, title, description, appliesTo, prefix: prefixes[0] ?? null, rules, problems, body };
}

/** Every page in pages.json order, read from src/content/docs under `root`. */
export function readRules(root = process.cwd()) {
  const pagesJson = JSON.parse(readFileSync(join(root, "pages.json"), "utf8"));
  const pages = pageOrder(pagesJson).map((slug) => {
    const base = join(root, "src/content/docs", slug);
    let text;
    try { text = readFileSync(`${base}.md`, "utf8"); } catch { text = readFileSync(`${base}.mdx`, "utf8"); }
    return parsePage(slug, text);
  });
  const problems = pages.flatMap((p) => p.problems);
  const owner = new Map();
  for (const p of pages) {
    if (!p.prefix) continue;
    if (owner.has(p.prefix)) problems.push(`${p.slug}: prefix ${p.prefix} is also ${owner.get(p.prefix)}'s`);
    owner.set(p.prefix, p.slug);
  }
  // A retired ID never comes back, and the rule it points readers to exists.
  const retired = readRetired(root);
  const live = new Set(pages.flatMap((p) => p.rules.map((r) => r.id)));
  for (const r of retired) {
    if (live.has(r.id)) problems.push(`${r.id} is retired (retired-rules.json, ${r.edition}); a new rule takes the page's next free number`);
    if (r.see && !live.has(r.see)) problems.push(`retired-rules.json: ${r.id} points to ${r.see}, which is not a rule`);
  }
  return { pages, retired, problems };
}

/** The retired IDs, from retired-rules.json under `root`: `{ id, edition, see }`, `see` being the rule that holds the
 *  requirement now, or null. */
export function readRetired(root = process.cwd()) {
  try {
    return JSON.parse(readFileSync(join(root, "retired-rules.json"), "utf8")).retired;
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

/** `fn` applied to the Markdown outside code: a fenced block or a span in backticks is an example, kept as written. */
export function outsideCode(markdown, fn) {
  return markdown
    .split(/(^ *```[\s\S]*?^ *```|`[^`\n]*`)/m)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join("");
}

/** Relative Markdown links ("](../menus/)", "](#pauta-03)") made absolute against the page's own address. */
export function absoluteLinks(markdown, pageUrl) {
  return outsideCode(markdown, (s) =>
    s.replace(/\]\((?!https?:|mailto:)([^)\s]+)\)/g, (_, href) => `](${new URL(href, pageUrl).href})`),
  );
}

/** Where an edition lives: https://pauta-project.dev/2.0.0/ for package.json's url and version, or .../next/ while the
 *  build is for the next/ folder (PAUTA_PATH, scripts/build-next.mjs). */
export function editionUrl(pkg, edition = process.env.PAUTA_PATH === "next" ? "next" : pkg.version) {
  const url = new URL(pkg.guidelines.url);
  return `${url.origin}${url.pathname.replace(/\/?$/, "/")}${edition}/`;
}
