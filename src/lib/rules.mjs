// The guide's rules, read from the page Markdown (AGENTS.md, "Rule IDs"). A rule is a list item that opens with
// "**KBD-07 · MUST.**", then sub-items "*Why:*", "*Check (code|test|by hand):*" and "*Reference:*". Shared by the
// rules.json, llms.txt and llms-full.txt endpoints (src/pages/) and scripts/check-rules.mjs, which fails the build
// on a malformed rule.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const HEAD = /^- \*\*([A-Z]{2,6})-(\d{2,3}) · (MUST|SHOULD|MAY)\.\*\*\s*(.*)$/;
const LOOSE = /\*\*[A-Z]{2,6}-\d/;
const SUB = /^ {2}- \*(Why|Check \((code|test|by hand)\)|Reference):\*\s*(.*)$/;
// "**Applies to:** an app with a tray icon." limits every rule after it: at the top of a page, before its first heading
// and rule, it holds for the page; right under a "## " heading, for that section. A rule with neither applies to every
// app unless its own text names the apps it covers (Conformance, PAUTA-05).
const APPLIES = /^\*\*Applies to:\*\*\s*(.*)$/;

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
 * One page's rules.
 * @returns {{ slug, title, description, prefix, rules: object[], problems: string[] }}
 */
export function parsePage(slug, text) {
  const { title, description, body, offset } = frontmatter(text);
  const lines = body.split("\n");
  const rules = [];
  const problems = [];
  let section = "";
  let appliesTo = null; // the page's
  let sectionAppliesTo = null;
  let opening = true; // nothing but prose since the top of the page or the last "## " heading
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^## /.test(line)) {
      section = line.slice(3).trim();
      sectionAppliesTo = null;
      opening = true;
      continue;
    }
    if (/^#{3,} /.test(line)) opening = false;
    const a = line.match(APPLIES);
    if (a) {
      const para = [a[1]];
      while (i + 1 < lines.length && lines[i + 1].trim() !== "") para.push(lines[++i]);
      const text = join_(para);
      if (!opening) problems.push(`${slug}:${i + 1 + offset}: an Applies to line after a rule or a ### heading; it belongs at the top of the page or right under a ## heading`);
      else if (section) sectionAppliesTo = text;
      else appliesTo = text;
      continue;
    }
    if (/^\|.*\bLevel\b.*\|\s*$/.test(line)) problems.push(`${slug}:${i + 1 + offset}: a table with a Level column; rules are list items`);
    const m = line.match(HEAD);
    if (!m) {
      if (LOOSE.test(line)) problems.push(`${slug}:${i + 1 + offset}: malformed rule head: ${line.slice(0, 60)}`);
      continue;
    }
    opening = false;
    const block = [line];
    while (i + 1 < lines.length && lines[i + 1].startsWith("  ")) block.push(lines[++i]);
    const id = `${m[1]}-${m[2]}`;
    const rule = { id, prefix: m[1], number: Number(m[2]), level: m[3], section, appliesTo: sectionAppliesTo ?? appliesTo, text: "", why: null, check: null, reference: null, markdown: block.join("\n") };
    const statement = [m[4]];
    let current = null; // the sub-item being continued
    for (const l of block.slice(1)) {
      const s = l.match(SUB);
      if (s) {
        current = { label: s[1], kind: s[2], lines: [s[3]] };
        if (s[1] === "Why") rule.why !== null ? problems.push(`${slug}: ${id} has two Why lines`) : (rule.why = current);
        else if (s[1] === "Reference") rule.reference !== null ? problems.push(`${slug}: ${id} has two Reference lines`) : (rule.reference = current);
        else rule.check !== null ? problems.push(`${slug}: ${id} has two Check lines`) : (rule.check = current);
      } else if (/^ {2}- /.test(l)) {
        problems.push(`${slug}: ${id} has a sub-item that is not Why, Check or Reference: ${l.trim().slice(0, 50)}`);
        current = null;
      } else if (current && /^ {4}/.test(l)) current.lines.push(l);
      else if (!current) statement.push(l);
      else problems.push(`${slug}: ${id} has a line outside its sub-items: ${l.trim().slice(0, 50)}`);
    }
    rule.text = join_(statement);
    if (rule.why) rule.why = join_(rule.why.lines);
    if (rule.reference) rule.reference = join_(rule.reference.lines);
    else problems.push(`${slug}: ${id} has no Reference line`);
    if (rule.check) rule.check = { kind: rule.check.kind, text: join_(rule.check.lines) };
    else problems.push(`${slug}: ${id} has no Check line`);
    rules.push(rule);
  }
  const prefixes = [...new Set(rules.map((r) => r.prefix))];
  if (prefixes.length > 1) problems.push(`${slug}: several prefixes (${prefixes.join(", ")}); a page has one`);
  // IDs are permanent (AGENTS.md): a retired rule leaves a gap and a new one takes the next free number wherever it
  // sits, so only a repeat is wrong.
  const seen = new Set();
  for (const r of rules) {
    if (seen.has(r.id)) problems.push(`${slug}: ${r.id} is used twice`);
    seen.add(r.id);
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

/** Where an edition lives: https://pauta-project.dev/2.0.0/ for package.json's url and version. */
export function editionUrl(pkg, edition = pkg.version) {
  const url = new URL(pkg.guidelines.url);
  return `${url.origin}${url.pathname.replace(/\/?$/, "/")}${edition}/`;
}
