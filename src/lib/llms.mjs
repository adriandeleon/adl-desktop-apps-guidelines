// What a coding agent reads: rules.json (every rule as data), llms.txt (the index, https://llmstxt.org) and
// llms-full.txt (every rule as Markdown, one file). Served per edition by src/pages/*.js; every link points at the
// numbered edition, so a citation never moves. scripts/build-site.mjs copies the latest llms.txt to the site root.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { absoluteLinks, editionUrl, readRules } from "./rules.mjs";

const LEVELS = {
  MUST: "A release blocker for a new app.",
  SHOULD: "Expected unless the app has a stated reason.",
  MAY: "A pattern worth copying when the app grows into it.",
};

function load(root = process.cwd()) {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const base = editionUrl(pkg);
  const { pages } = readRules(root);
  for (const p of pages) p.url = `${base}${p.slug}/`;
  return { pkg, base, pages, rules: pages.flatMap((p) => p.rules.map((r) => ({ page: p, rule: r }))) };
}

export function rulesJson(root) {
  const { pkg, base, rules } = load(root);
  const abs = (s, page) => (s == null ? null : absoluteLinks(s, page.url));
  return {
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
    rules: rules.map(({ page, rule }) => ({
      id: rule.id,
      level: rule.level,
      page: page.slug,
      pageTitle: page.title,
      section: rule.section || null,
      url: `${page.url}#${rule.id.toLowerCase()}`,
      text: abs(rule.text, page),
      why: abs(rule.why, page),
      check: { kind: rule.check.kind, text: abs(rule.check.text, page) },
      reference: abs(rule.reference, page),
    })),
  };
}

const howTo = (base, version) => `## Using Pauta

**Starting a new app:** create it from the GitHub template repository
https://github.com/adriandeleon/adl-desktop-app-template (\`gh repo create <name> --template
adriandeleon/adl-desktop-app-template\`, or **Use this template** on GitHub), then run \`scripts/rename.sh <AppName>
<package>\`. It is built to the edition its README and AGENTS.md name; audit it against this edition and add what is
missing.

**Building a feature:** read the rules on its page first, then copy from the code each rule's *Reference* names.
Editora is the reference implementation.

**Auditing an app:**

1. Find the edition the app implements: \`pauta.version\` in its \`pom.xml\`, the About window, or its README. Read that
   edition's rules at \`${base.replace(`${version}/`, "<edition>/")}rules.json\`; if the app names none, use this one.
2. Take each rule in turn. *Check (code)*: read or search the source as the check says. *Check (test)*: find the named
   test, or the app's equivalent, and confirm the build runs it. *Check (by hand)*: source can't settle it; report it
   as manual.
3. Report one line per rule: its ID, its level, pass / fail / not applicable / manual, and the evidence as
   \`file:line\`. A failed MUST blocks a release.
4. A rule applies to every app unless its text names the apps it covers ("An app with user documents…").
5. Read the app's \`src/main/resources/com/<app>/pauta.json\`, its recorded exceptions. A rule it lists is reported as
   its kind (not-applicable, deviation, pending, or in a template app-only), not as a failure; MAYs need no entry. An
   unmet rule it doesn't list, an entry for a rule that passes, and a deviation or pending entry with no link are
   findings.

Cite a rule by its ID and edition, for example "KBD-07 (Pauta ${version})". Each rule's address is the page's plus
\`#\` and the ID in lowercase: \`${base}keyboard/#kbd-07\`.

Levels: ${Object.entries(LEVELS).map(([k, v]) => `**${k}**: ${v}`).join(" ")}`;

export function llmsTxt(root) {
  const { pkg, base, pages, rules } = load(root);
  const v = pkg.version;
  const site = editionUrl(pkg, "latest");
  const listed = pages.map((p) => {
    const n = p.rules.length;
    const what = n ? ` ${n} rules, ${p.prefix}-*.` : "";
    return `- [${p.title}](${p.url}): ${p.description}${what}`;
  });
  return `# Pauta

> Pauta ${v} (${pkg.guidelines.date}): the UI, UX and platform rules for adl's family of JavaFX desktop apps, so the
> same apps look and work the same on Windows, macOS and Linux. ${rules.length} rules, each with a permanent ID, a level
> (MUST, SHOULD or MAY), a check that says how to verify it in an app, and a reference into the code that does it.

This file describes edition ${v}. The newest edition is always at ${site}llms.txt.

${howTo(base, v)}

## Rules

- [Every rule, as Markdown](${base}llms-full.txt): all ${rules.length} rules of this edition in one file, grouped by page.
- [Every rule, as JSON](${base}rules.json): id, level, page, section, address, text, why, check and reference.

## Pages

- [Overview](${base}): what Pauta is, the six apps, and how to read the rules.
${listed.join("\n")}

## Optional

- [Changelog](${base}changelog/): what each edition changed, and which rules became stronger.
- [Editions](${new URL(pkg.guidelines.url).origin}${new URL(pkg.guidelines.url).pathname.replace(/\/?$/, "/")}versions.json): every published edition and its address.
`;
}

export function llmsFullTxt(root) {
  const { pkg, base, pages, rules } = load(root);
  const out = [
    `# Pauta ${pkg.version}: every rule`,
    "",
    `> ${rules.length} rules from ${base}, published ${pkg.guidelines.date}. Each page's prose, screenshots and mockups are on`,
    "> the page itself; this file holds the rules alone.",
    "",
    howTo(base, pkg.version),
  ];
  for (const p of pages.filter((p) => p.rules.length)) {
    out.push("", `## ${p.title} (${p.prefix})`, "", `${p.url}: ${p.description}`);
    let section = null;
    for (const r of p.rules) {
      if (r.section && r.section !== section) {
        section = r.section;
        out.push("", `### ${section}`);
      }
      out.push("", absoluteLinks(r.markdown, p.url));
    }
  }
  return out.join("\n") + "\n";
}
