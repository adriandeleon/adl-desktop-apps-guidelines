// What a coding agent reads: rules.json (every rule as data), llms.txt (the index, https://llmstxt.org), llms-full.txt
// (every rule as Markdown, one file) and <page>.md (one page as Markdown, prose and rules). Served per edition by
// src/pages/*.js; every link points at the numbered edition, so a citation never moves. scripts/build-site.mjs copies
// the latest llms.txt, llms-full.txt and rules.json to the site root.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { STATUSES } from "./audit.mjs";
import { parseEditions } from "./editions.mjs";
import { absoluteLinks, editionUrl, outsideCode, readRules } from "./rules.mjs";

const LEVELS = {
  MUST: "A release blocker for a new app.",
  SHOULD: "Expected unless the app has a stated reason.",
  MAY: "A pattern worth copying when the app grows into it.",
};

const SKILL = "skills/pauta-audit/SKILL.md";

function load(root = process.cwd()) {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const base = editionUrl(pkg);
  const { pages, retired } = readRules(root);
  for (const p of pages) {
    p.url = `${base}${p.slug}/`;
    p.md = `${base}${p.slug}.md`;
  }
  return { pkg, base, pages, retired, rules: pages.flatMap((p) => p.rules.map((r) => ({ page: p, rule: r }))) };
}

/** Page slugs in reading order: one <slug>.md each. */
export function pageSlugs(root) {
  return load(root).pages.map((p) => p.slug);
}

export function rulesJson(root) {
  const { pkg, base, pages, rules, retired } = load(root);
  const abs = (s, page) => (s == null ? null : absoluteLinks(s, page.url));
  const urlOf = new Map(rules.map(({ page, rule }) => [rule.id, `${page.url}#${rule.id.toLowerCase()}`]));
  return {
    $schema: `${base}rules.schema.json`,
    name: "Pauta",
    edition: pkg.version,
    date: pkg.guidelines.date,
    url: base,
    levels: LEVELS,
    checks: {
      code: "Verify by reading or searching the app's source, as the check says.",
      test: "A named test holds the rule; confirm the app has it, or its equivalent, and that it runs in the build.",
      "by hand": "Needs the running app; source alone can't settle it.",
    },
    statuses: STATUSES,
    audit: `${base}audit.schema.json`,
    pages: pages.map((p) => ({
      slug: p.slug,
      title: p.title,
      prefix: p.prefix,
      url: p.url,
      markdown: p.md,
      description: p.description,
      appliesTo: abs(p.appliesTo, p),
      rules: p.rules.length,
    })),
    rules: rules.map(({ page, rule }) => ({
      id: rule.id,
      level: rule.level,
      page: page.slug,
      pageTitle: page.title,
      section: rule.section || null,
      appliesTo: abs(rule.appliesTo, page),
      url: `${page.url}#${rule.id.toLowerCase()}`,
      text: abs(rule.text, page),
      why: abs(rule.why, page),
      check: { kind: rule.check.kind, text: abs(rule.check.text, page), command: rule.command },
      reference: abs(rule.reference, page),
    })),
    // IDs no longer in use. They are never reused, so an app's pauta.json entry for one is stale.
    retired: retired.map((r) => ({ id: r.id, edition: r.edition, see: r.see, seeUrl: r.see ? (urlOf.get(r.see) ?? null) : null })),
  };
}

// How to use the edition. In llms.txt it is the prose before the first H2, as https://llmstxt.org has it; in
// llms-full.txt it is a section of its own.
const howTo = (base, version) => {
  const edition = base.replace(`${version}/`, "<edition>/");
  return `**Starting a new app:** create it from the GitHub template repository
https://github.com/adriandeleon/adl-desktop-app-template (\`gh repo create <name> --template
adriandeleon/adl-desktop-app-template\`, or **Use this template** on GitHub), then run \`scripts/rename.sh <AppName>
<package>\`. It is built to the edition its README and AGENTS.md name; audit it against this edition and add what is
missing.

**Building a feature:** read its page first (\`<page>.md\`, below, has the prose, the rules and the spec tables), then
copy from the code each rule's *Reference* names. Editora is the reference implementation.

**Auditing an app:** the full procedure is the pauta-audit skill, ${base}${SKILL}. It decides how to audit and how
to write the report; an edition supplies only its rules. In short:

1. Find the edition the app implements: \`pauta.version\` in its \`pom.xml\`, the About window, or its README. Read that
   edition's rules at \`${edition}rules.json\`. If the app names none, ask which edition to audit against and offer
   the newest; with no one to ask, use the newest and say so in the report. Editions before 2.0.0 serve no
   rules.json: audit against 2.0.0 or newer, and report a failed rule that the app's own edition didn't have as
   upgrade work.
2. Take each rule in turn. *Check (code)*: when it has a *Command* (\`check.command\`), run it with \`sh -c\` from the
   app's repository root. Exit 0: the check passes; still read the rest of the rule and cite the file:line that meets
   it. Any other exit: the check fails, and what it printed is the evidence. Otherwise read or search the source as the
   check says. *Check (test)*: find the named test, or the app's equivalent, and confirm the build runs it.
   *Check (by hand)*: source can't settle it; report it as manual. A name the rule's statement gives (a command id,
   a key, a file) is required as written; one only its Check gives is Editora's spelling, and the app's equivalent
   meets it.
3. A rule applies to every app unless it is limited: its text names the apps it covers ("An app with user
   documents…"), its page or section opens with an **Applies to** line (\`appliesTo\` in rules.json), or it details a
   rule that is limited. A limited rule the app is outside of is \`limited\` and needs no exception.
4. Read the app's \`src/main/resources/com/<app>/pauta.json\`, its recorded exceptions. An unmet rule it lists gets the
   entry's kind as its status (not-applicable, deviation, pending, or in a template app-only); MAYs need no entry.
   An unmet MUST or SHOULD it doesn't list is \`fail\`. An entry for a rule that passes or is limited, and a deviation
   or pending entry with no link, are problems to report.
5. Report one result per rule: ID, level, status and evidence as \`file:line\`. The statuses: ${Object.keys(STATUSES)
    .map((s) => `\`${s}\``)
    .join(", ")}. As JSON, the report follows ${base}audit.schema.json. A failed MUST blocks a release.

Cite a rule by its ID and edition, for example "KBD-07 (Pauta ${version})". Each rule's address is the page's plus
\`#\` and the ID in lowercase: \`${base}keyboard/#kbd-07\`.

Levels: ${Object.entries(LEVELS)
    .map(([k, v]) => `**${k}**: ${v}`)
    .join(" ")}`;
};

export function llmsTxt(root) {
  const { pkg, base, pages, rules } = load(root);
  const v = pkg.version;
  const site = editionUrl(pkg, "latest");
  const origin = new URL(pkg.guidelines.url);
  const listed = pages.map((p) => {
    const n = p.rules.length;
    const what = n ? ` ${n} rules, ${p.prefix}-*.` : "";
    return `- [${p.title}](${p.md}): ${p.description}${what}`;
  });
  return `# Pauta

> Pauta ${v} (${pkg.guidelines.date}): the UI, UX and platform rules for adl's family of JavaFX desktop apps, so the
> same apps look and work the same on Windows, macOS and Linux. ${rules.length} rules, each with a permanent ID, a level
> (MUST, SHOULD or MAY), a check that says how to verify it in an app, and a reference into the code that does it.

This file describes edition ${v}. The newest edition is always at ${site}llms.txt. Each page below is Markdown; the
same page as HTML, with its screenshots and mockups, drops the \`.md\` and ends in \`/\`.

${howTo(base, v)}

## Rules

- [Every rule, as Markdown](${base}llms-full.txt): all ${rules.length} rules of this edition in one file, grouped by page.
- [Every rule, as JSON](${base}rules.json): id, level, page, pageTitle, section, appliesTo, url, text, why, check and reference, with every page and every retired ID.
- [Audit skill](${base}${SKILL}): how to audit an app against an edition, step by step, and write the report.
- [Audit report schema](${base}audit.schema.json): the JSON Schema of an audit's report.

## Pages

${listed.join("\n")}

## Optional

- [Overview](${base}): what Pauta is, the six apps, and how to read the rules.
- [Changelog](${base}changelog.md): what each edition changed, and which rules became stronger.
- [The whole guide, as Markdown](${base}downloads/adl-desktop-apps-guidelines.md): every page in one file. Large.
- [rules.json schema](${base}rules.schema.json): the JSON Schema of rules.json.
- [Editions](${origin.origin}${origin.pathname.replace(/\/?$/, "/")}versions.json): every published edition and its address.
`;
}

export function llmsFullTxt(root) {
  const { pkg, base, pages, rules } = load(root);
  const out = [
    `# Pauta ${pkg.version}: every rule`,
    "",
    `> ${rules.length} rules from ${base}, published ${pkg.guidelines.date}. Each page's prose, screenshots and mockups are on`,
    "> the page itself (as Markdown at the page's address with `.md` for the trailing `/`); this file holds the rules alone.",
    "",
    "## Using Pauta",
    "",
    howTo(base, pkg.version),
  ];
  for (const p of pages.filter((p) => p.rules.length)) {
    out.push("", `## ${p.title} (${p.prefix})`, "", `${p.url}: ${p.description}`);
    if (p.appliesTo) out.push("", `**Applies to:** ${absoluteLinks(p.appliesTo, p.url)}`);
    let section = null;
    for (const r of p.rules) {
      if (r.section && r.section !== section) {
        section = r.section;
        out.push("", `### ${section}`);
        if (r.appliesTo && r.appliesTo !== p.appliesTo) out.push("", `**Applies to:** ${absoluteLinks(r.appliesTo, p.url)}`);
      }
      out.push("", absoluteLinks(r.markdown, p.url));
    }
  }
  return out.join("\n") + "\n";
}

// One page as Markdown. The site's mockups are HTML drawn for the eye: each becomes its accessible name, and its
// numbered anatomy list a Markdown list, so the page reads whole as text.
const decode = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const inline = (html) =>
  decode(
    html
      .replace(/<span class="pin[^"]*"[^>]*>.*?<\/span>/g, "")
      .replace(/<(strong|b)>(.*?)<\/\1>/g, "**$2**")
      .replace(/<(em|i)>(.*?)<\/\1>/g, "*$2*")
      .replace(/<(code|kbd)>(.*?)<\/\1>/g, "`$2`")
      .replace(/<a [^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();

function htmlBlock(block) {
  if (/^<svg[^>]*aria-hidden="true"/.test(block)) return null; // icon definitions the mockups use
  if (/^<ol class="anatomy"/.test(block)) {
    const items = [...block.matchAll(/<li><span class="pin[^"]*">(\d+)<\/span>(.*?)<\/li>/g)];
    return items.map(([, n, html]) => `${n}. ${inline(html)}`).join("\n");
  }
  // A mockup that is a table to a screen reader (role="table", rows of cells) is a Markdown table here too.
  const table = block.match(/role="table"[^>]*aria-label="([^"]*)"/);
  if (table) {
    const rows = [...block.matchAll(/<div[^>]*role="row"[^>]*>(.*?)<\/div>/g)].map(([, row]) =>
      [...row.matchAll(/<span[^>]*role="(?:columnheader|rowheader|cell)"[^>]*>(.*?)<\/span>/g)].map(([, c]) => inline(c).replace(/\|/g, "\\|")),
    );
    if (rows.length > 1) {
      const line = (cells) => `| ${cells.join(" | ")} |`;
      return [`*${decode(table[1]).replace(/\.$/, "")}:*`, "", line(rows[0]), line(rows[0].map(() => "---")), ...rows.slice(1).map(line)].join("\n");
    }
  }
  const labels = [...block.matchAll(/role="img"[^>]*aria-label="([^"]*)"|aria-label="([^"]*)"[^>]*role="img"/g)].map((m) =>
    decode(m[1] ?? m[2]),
  );
  if (labels.length) return labels.map((l) => `*${l.replace(/\.$/, "")}. Drawn on the page; the numbers below mark its parts.*`).join("\n\n");
  return `*${inline(block)}*`;
}

/** The Changelog page as Markdown: its prose, then every edition from CHANGELOG.md, as the page renders them. */
export function changelogMarkdown(root = process.cwd()) {
  const { pkg, base } = load(root);
  const url = `${base}changelog/`;
  const page = readFileSync(join(root, "src/content/docs/changelog.mdx"), "utf8");
  const fm = page.match(/^---\n([\s\S]*?)\n---\n/);
  const get = (key) => fm?.[1].match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1] ?? "";
  const prose = page
    .slice(fm ? fm[0].length : 0)
    .split("\n")
    .filter((l) => !/^import\s/.test(l) && !/^<Changelog\s*\/>/.test(l))
    .join("\n");
  const editions = parseEditions(readFileSync(join(root, "CHANGELOG.md"), "utf8"))
    .map((e) => `## [${e.version}]${e.date ? ` - ${e.date}` : ""}\n\n${e.body}`)
    .join("\n\n");
  const body = absoluteLinks(`${prose.trim()}\n\n${editions}`, url).replace(/\n{3,}/g, "\n\n");
  return `# ${get("title")}

> ${get("description")}

Pauta ${pkg.version} (${pkg.guidelines.date}). The page: ${url}.

${body}
`;
}

export function pageMarkdown(slug, root) {
  const { pkg, base, pages } = load(root);
  const p = pages.find((q) => q.slug === slug);
  const out = [];
  const lines = p.body.split("\n");
  let fenced = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^ *```/.test(lines[i])) fenced = !fenced;
    if (!fenced && lines[i].startsWith("<") && (i === 0 || lines[i - 1].trim() === "")) {
      const block = [];
      while (i < lines.length && lines[i].trim() !== "") block.push(lines[i++]);
      const md = htmlBlock(block.join("\n"));
      if (md !== null) out.push(md);
      out.push("");
      continue;
    }
    out.push(lines[i]);
  }
  // A screenshot is its caption: the image is on the page.
  const shots = (s) =>
    s.replace(/!\[([^\]]*)\]\((?!https?:)[^)\s]*assets\/[^)\s]+(?:\s+"([^"]*)")?\)/g, (_, alt, caption) => `*Screenshot: ${(caption || alt).replace(/\.$/, "")}.*`);
  const body = absoluteLinks(outsideCode(out.join("\n"), shots).replace(/\n{3,}/g, "\n\n"), p.url).trim();
  return `# ${p.title}

> ${p.description}

Pauta ${pkg.version} (${pkg.guidelines.date}). The page with its screenshots and mockups: ${p.url}.
Every rule of the edition: ${base}llms-full.txt.

${body}
`;
}
