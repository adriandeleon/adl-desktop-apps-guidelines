---
title: "Coding agents and LLMs"
description: "What every edition serves to coding agents, how an app's AGENTS.md points its agent at the edition it is built to, and how to have an agent build a feature to the rules or audit an app against them."
---

Pauta has two readers: the developer, and the coding agent working beside them. The pages are written for the
developer. Every edition also serves the same rules as plain text and as JSON, so an agent (Claude Code, Codex,
Copilot, or any LLM that can fetch a URL) reads the exact rules of the edition the app is built to, instead of what
it remembers of some other one.

## What each edition serves

| File | What it holds | Read it when |
|---|---|---|
| `llms.txt` | The index, in the [llms.txt](https://llmstxt.org) format: what Pauta is, how to start an app, build a feature and audit an app, and every page with its rule count and prefix. | First. It is short. |
| `llms-full.txt` | Every rule of the edition as Markdown, grouped by page and section, with every link made absolute. No prose, screenshots or mockups. | Building or auditing: the whole rule set in one read. |
| `rules.json` | Every rule as data, with the levels and the three kinds of check explained. | Scripts, filtering by page or level, comparing editions. |
| The page itself | The prose, screenshots, mockups and spec tables around the rules. | When the rule alone isn't enough, as on a template page. |

Each one lives under its edition: `https://pauta-project.dev/2.0.2/llms.txt`, `.../2.0.2/llms-full.txt` and
`.../2.0.2/rules.json`. `latest/` always holds the newest edition, and `https://pauta-project.dev/llms.txt`, at
the site root, is a copy of the latest one, where agents look for it first. Every link inside these files points at
the numbered edition, so a rule an agent cites keeps its address. The first edition that serves them is 2.0.0;
earlier editions have their pages only. `versions.json` at the site root lists every published edition.

An agent that also needs the prose can read the [single Markdown file](../downloads/adl-desktop-apps-guidelines.md),
the whole guide in one file. It is large, and its rules are the same.

## What a rule looks like

Every rule is one testable statement with a permanent ID. In `llms-full.txt` it is the same list item as on its
page: the ID and level in bold, the statement, then *Why*, *Check* and *Reference* lines. In `rules.json` the same
rule is:

```json
{
  "id": "KBD-07",
  "level": "MUST",
  "page": "keyboard",
  "pageTitle": "Keyboard first",
  "section": "Command Palette",
  "url": "https://pauta-project.dev/2.0.2/keyboard/#kbd-07",
  "text": "The palette is an in-scene overlay in the window's root `StackPane`, not a `javafx.stage.Popup`.",
  "why": "on Windows a Popup does not reliably take OS keyboard focus, and the whole app can stop receiving keystrokes.",
  "check": {
    "kind": "code",
    "text": "the palette and every picker add their node to the root `StackPane`; none creates a `Popup`."
  },
  "reference": "Editora `ui/CommandPalette.java`."
}
```

- **`id`** is permanent. It is never renumbered or reused; a removed rule leaves a gap. The prefix names the page
  (`KBD` is Keyboard first), and `llms.txt` lists every page's prefix.
- **`level`** is MUST (a release blocker for a new app), SHOULD (expected unless the app has a stated reason) or
  MAY (worth copying when the app grows into it).
- **`check.kind`** says how the rule is verified: `code` by reading or searching the source, `test` by a named test
  the build runs, `by hand` in the running app, which source alone can't settle.
- **`reference`** names the Editora file, or the other app, that does it. The agent copies from there.
- **`why`** is `null` when the rule has no reason worth stating.

## Point the app's agent at its edition

An app is built to one edition, the one `pauta.version` in its `pom.xml` names (see
[About window](../templates/about/)). Its agent should read that edition, not `latest/`: a newer edition may hold
MUSTs the app doesn't meet yet, and an agent that reads them will "fix" what nobody asked it to.

Say so in the app's `AGENTS.md` ([Repository documents](../repository/)), next to the line that names the edition.
The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`AGENTS.md`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/AGENTS.md) already names its edition in its first lines;
add the addresses:

```markdown
## Pauta

This app is built to Pauta <edition>. Its rules: https://pauta-project.dev/<edition>/llms.txt
(every rule in one file: https://pauta-project.dev/<edition>/llms-full.txt).

- Before building a feature, read the rules on its page and copy from the code each rule's Reference names.
- Cite a rule by its ID and edition: "KBD-07 (Pauta <edition>)".
- Read the numbered edition, never latest/. Moving to a newer edition is its own change: pauta.version in
  pom.xml, this file and the README change together.
```

Use the same number everywhere the app names its edition: `pom.xml`, `AGENTS.md`, the README and the About window.

## Build a feature to the rules

Give the agent the rules of the page the feature belongs to, the page itself when it has a mockup or a spec table,
and the reference code. For example:

```text
Add a find bar to the editor. Read the Find bar rules (FIND-*) in
https://pauta-project.dev/<edition>/llms-full.txt and the page
https://pauta-project.dev/<edition>/templates/find-bar/ for its layout. Copy from the
Editora files each rule's Reference names. Meet every MUST; list the SHOULDs you
skipped and why.
```

- **Template pages** keep their mockups and spec tables on the page; `llms-full.txt` holds only their rules. Give
  the agent the page's address too.
- **Reference code** is in [Editora](https://github.com/adriandeleon/Editora), or the app the reference names. An
  agent with Editora checked out beside the app reads it faster and more reliably than over the web.
- **When the rule and Editora disagree,** the code is right until someone checks. Ask the agent to report the
  difference instead of picking a side, and fix the guide or the app in the same change.

## Audit an app

`llms.txt` and `llms-full.txt` both carry the procedure, so an agent pointed at either one knows it:

1. Find the edition the app implements: `pauta.version` in its `pom.xml`, the About window, or its README. Read
   that edition's rules. If the app names none, use the newest.
2. Take each rule in turn. A *code* check: read or search the source as it says. A *test* check: find the named
   test, or the app's equivalent, and confirm the build runs it. A *by hand* check: report it as manual.
3. Report one line per rule: its ID, its level, pass, fail, not applicable or manual, and the evidence as
   `file:line`. A failed MUST blocks a release.
4. A rule applies to every app unless its text names the apps it covers ("An app with user documents…").

A prompt as short as this one is enough:

```text
Audit this app against Pauta. Start at https://pauta-project.dev/llms.txt and follow
its "Auditing an app" steps. Write the report to pauta-audit.md, failed MUSTs first.
```

The report reads like this:

```text
KBD-07   MUST    pass     src/main/java/com/example/app/ui/CommandPalette.java:57
KBD-17   MUST    fail     src/main/java/com/example/app/ui/MainToolbar.java:88 builds an icon button by hand
KBD-15   SHOULD  manual   Tab order needs the running app
TRAY-01  MUST    n/a      the app has no tray icon
```

- **Split a large audit.** An edition has hundreds of rules. Give each page, or each prefix, its own pass or its own
  agent, and start with the MUSTs (`jq '.rules[] | select(.level == "MUST")' rules.json`).
- **Check the evidence.** A verdict without `file:line` is a guess. Open a sample of the passes as well as the
  failures before you act on the report.
- **Manual means a person.** A *by hand* check needs the running app, often on a particular OS. The agent lists
  them; someone runs them.
- **Gaps per app** on this site is the same audit, done by hand for the six apps. An agent's report for one of them
  should agree with [Gaps per app](../family/gaps/); where it doesn't, one of them is wrong.

## Move an app to a newer edition

The [Changelog](../changelog/) says what each edition added and which rules became stronger. To see it rule by
rule, compare two editions' `rules.json`:

```bash
old=2.0.0 new=2.0.2
diff <(curl -s https://pauta-project.dev/$old/rules.json | jq -r '.rules[] | "\(.id) \(.level)"' | sort) \
     <(curl -s https://pauta-project.dev/$new/rules.json | jq -r '.rules[] | "\(.id) \(.level)"' | sort)
```

A line only in the new edition is a new rule or a raised level; one only in the old is a retired rule or a lowered
level. Give the agent that list and the new edition's `llms-full.txt`, have it meet each new MUST, then change
`pauta.version`, `AGENTS.md` and the README together.

## Working on Pauta itself

This repository has its own [`AGENTS.md`](https://github.com/adriandeleon/adl-desktop-apps-guidelines/blob/master/AGENTS.md):
the rule syntax, each page's prefix, and how a change becomes an edition. `npm run check` fails on a malformed rule,
and `rules.json`, `llms.txt` and `llms-full.txt` are built from the pages, so a rule written on a page reaches agents
in the next edition with nothing else to update.
