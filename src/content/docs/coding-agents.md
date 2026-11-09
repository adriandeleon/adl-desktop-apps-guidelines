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
| `rules.json` | Every rule as data, with the levels, the three kinds of check and the audit statuses explained, every page, and every retired ID. | Scripts, filtering by page or level, comparing editions. |
| `<page>.md` | One page as Markdown: its prose, rules and spec tables, each mockup as a sentence and its numbered parts as a list. `keyboard.md` beside `keyboard/`, `templates/about.md` beside `templates/about/`. | Building a feature: the page it belongs to, in one small read. |
| `skills/pauta-audit/SKILL.md` | The audit procedure as an agent skill: how to judge each rule, read `pauta.json` and write the report. | Auditing an app. |
| `audit.schema.json`, `rules.schema.json` | The [JSON Schema](https://json-schema.org) of an audit report and of `rules.json`. | Writing or checking a report; reading `rules.json` in code. |
| The page itself | The prose, screenshots, mockups and spec tables around the rules. | When the picture matters. |

Each one lives under its edition: `https://pauta-project.dev/4.3.1/llms.txt`, `.../4.3.1/rules.json`,
`.../4.3.1/keyboard.md`. `latest/` always holds the newest edition, and the site root holds a copy of the latest
`llms.txt`, `llms-full.txt` and `rules.json`, where agents look first. Every link inside these files points at the
numbered edition, so a rule an agent cites keeps its address. `llms.txt`, `llms-full.txt` and `rules.json` are
served from 2.0.0 on, the page Markdown, the skill and the schemas from 4.3.1; the 1.x editions, from before rules
had IDs, have their pages only. `versions.json` at the site root lists every published edition.

The [single Markdown file](../downloads/adl-desktop-apps-guidelines.md) is the whole guide in one file. It is large,
and its pages and rules are the same.

## What a rule looks like

Every rule is one testable statement with a permanent ID. In `llms-full.txt` it is the same list item as on its
page: the ID and level in bold, the statement, then *Why*, *Check*, sometimes *Command*, and *Reference* lines. In
`rules.json` the same
rule is:

```json
{
  "id": "KBD-07",
  "level": "MUST",
  "page": "keyboard",
  "pageTitle": "Keyboard first",
  "section": "Command Palette",
  "appliesTo": null,
  "url": "https://pauta-project.dev/4.3.1/keyboard/#kbd-07",
  "text": "The palette is an in-scene overlay in the window's root `StackPane`, not a `javafx.stage.Popup`.",
  "why": "on Windows a Popup does not reliably take OS keyboard focus, and the whole app can stop receiving keystrokes.",
  "check": {
    "kind": "code",
    "text": "the palette and every picker add their node to the root `StackPane`; none creates a `Popup`.",
    "command": null
  },
  "reference": "Editora `ui/CommandPalette.java`."
}
```

- **`id`** is permanent. It is never renumbered or reused; a removed rule leaves a gap. The prefix names the page
  (`KBD` is Keyboard first), and `llms.txt` lists every page's prefix. `rules.json` ends with `retired`, every ID no
  longer in use: the `edition` that removed it and `see`, the rule that holds its requirement now (with its `seeUrl`),
  or `null`. A `pauta.json` entry for a retired ID is stale; move it to the `see` rule, if the app still misses it.
- **`level`** is MUST (a release blocker for a new app), SHOULD (expected unless the app has a stated reason) or
  MAY (worth copying when the app grows into it).
- **`check.kind`** says how the rule is verified: `code` by reading or searching the source, `test` by a named test
  the build runs, `by hand` in the running app, which source alone can't settle.
- **`check.command`**, on some `code` checks, is one POSIX shell command (Linux, macOS, Git Bash or WSL): run it with
  `sh -c` from the app's repository root. Exit 0: the check passes; still read the rest of the rule and cite the
  file:line that meets it. Any other exit: the check fails, and what it printed is the evidence (OS-02's lists the
  classes that read `os.name`). Every command only reads, and opens with a guard that fails it outside an app's root.
  It is `null` where reading the code takes judgment.
- **`reference`** names the Editora file, or the other app, that does it. The agent copies from there. From the first
  edition released after 4.5.0, its links point at the commit each app was at when the edition came out, so they show
  the code as it was then; `blob/master` in a page's source becomes that commit in what the edition serves. Editions
  up to 4.5.0 link the apps' default branches.
- **`why`** is `null` when the rule has no reason worth stating.
- **`appliesTo`** is `null` for a rule that covers every app, unless its own text says otherwise. Otherwise it is the
  **Applies to** line its page or section opens with: "an app whose work goes on without its window" for the
  `TRAY` rules, and "every app that sends desktop notifications…" for TRAY-09 to TRAY-11. `pages` lists every page with its prefix, its Markdown address and its `appliesTo`.
- **`statuses`** are what an audit reports for a rule ([Audit an app](#audit-an-app)), and `audit` is the address
  of the report's schema.

## Point the app's agent at its edition

An app is built to one edition, the one `pauta.version` in its `pom.xml` names (see
[About window](../templates/about/)). Its agent should read that edition, not `latest/`: a newer edition may hold
MUSTs the app doesn't meet yet, and an agent that reads them will "fix" what nobody asked it to.

Say so in a `## Pauta` section of the app's `AGENTS.md` ([PAUTA-17](../conformance/#pauta-17)). The
[app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`AGENTS.md`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/AGENTS.md) has one; an app made before it adds this:

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

The procedure is the **pauta-audit skill**, which every edition serves at `skills/pauta-audit/SKILL.md`. Copy it
into the app's `.claude/skills/pauta-audit/` (the [app template](https://github.com/adriandeleon/adl-desktop-app-template)
ships it) or point the agent at it. `llms.txt` and `llms-full.txt` carry it in short:

1. Find the edition the app implements: `pauta.version` in its `pom.xml`, the About window, or its README. Read
   that edition's rules. If the app names none, use the newest. A 1.x edition has no `rules.json`: audit against
   2.0.0 or newer, and report what the app's own edition didn't ask for as upgrade work.
2. Take each rule in turn. A *code* check: run its `check.command` when it has one, else read or search the source as
   it says. A *test* check: find the named test, or the app's equivalent, and confirm the build runs it. A *by hand*
   check: report it as manual.
3. A rule applies to every app unless it is limited: its text names the apps it covers ("An app with user
   documents…"), its page or section opens with an **Applies to** line, or it details a limited rule
   ([PAUTA-05](../conformance/#pauta-05)). An app outside a limited rule gets `limited`, and needs no exception.
4. Read the app's `pauta.json` ([Conformance](../conformance/)). An unmet rule it lists gets the entry's kind as its
   status; MAYs need no entry. An unmet MUST or SHOULD it doesn't list is `fail`. An entry for a rule that passes or
   is limited, and a deviation or pending entry with no link, are problems.
5. Report one result per rule: its ID, level, status and evidence as `file:line`. A failed MUST blocks a release.

Every report uses the same statuses, which `rules.json` also lists:

| Status | Means | Needs an exception? |
|---|---|---|
| `pass` | Met. | No; an entry for it is stale. |
| `fail` | Not met, and `pauta.json` doesn't list it. A failed MUST blocks a release. | Yes: this is what the audit is for. |
| `manual` | Checked by hand: a person checks it in the running app. | Only if it fails then. |
| `pending`, `deviation`, `not-applicable`, `app-only` | Not met, and `pauta.json` lists it as that kind. | It has one. |
| `limited` | The rule covers apps with a feature this one lacks. | No; an entry for it is wrong. |

The skill writes the report twice: `docs/pauta-audit.json`, which follows the edition's `audit.schema.json` so two
audits can be compared by a script, and `docs/pauta-audit.md`, the same results as tables for people. A prompt as
short as this one is enough:

```text
Audit this app against Pauta with the pauta-audit skill
(https://pauta-project.dev/latest/skills/pauta-audit/SKILL.md). Failed MUSTs first.
```

Each result reads like this:

```text
KBD-07   MUST    pass     src/main/java/com/example/app/ui/CommandPalette.java:57
TBAR-01  MUST    fail     src/main/java/com/example/app/ui/MainToolbar.java:88 builds an icon button by hand
KBD-15   SHOULD  manual   Tab order needs the running app
TRAY-01  MUST    limited  no tray: no SystemTray or TrayIcon in src/
TABS-06  MUST    not-applicable  pauta.json: the app has no tabs
MENU-14  MUST    pending  pauta.json: issue #212
```

- **Split a large audit.** An edition has hundreds of rules. Give each page, or each prefix, its own pass or its own
  agent, and start with the MUSTs (`jq '.rules[] | select(.level == "MUST")' rules.json`). Each page's Markdown
  (`<page>.md`) is a small read for one pass.
- **Check the evidence.** A verdict without `file:line` is a guess. Open a sample of the passes as well as the
  failures before you act on the report.
- **Manual means a person.** A *by hand* check needs the running app, often on a particular OS. The agent lists
  them; someone runs them.
- **Gaps per app** on this site is the same audit, done by hand for the six apps. An agent's report for one of them
  should agree with [Gaps per app](../family/gaps/); where it doesn't, one of them is wrong.

## Move an app to a newer edition

The version says how much work the move is ([how editions are numbered](../changelog/#how-editions-are-numbered)): a
newer patch asks nothing of the app, a newer minor asks it to add, a newer major asks it to undo or redo something.
The [Changelog](../changelog/) says what each edition added and which rules became stronger. To see it rule by
rule, compare two editions' `rules.json`:

```bash
old=2.0.0 new=2.0.2
diff <(curl -s https://pauta-project.dev/$old/rules.json | jq -r '.rules[] | "\(.id) \(.level)"' | sort) \
     <(curl -s https://pauta-project.dev/$new/rules.json | jq -r '.rules[] | "\(.id) \(.level)"' | sort)
```

A line only in the new edition is a new rule or a raised level; one only in the old is a retired rule (the new
edition's `retired` list says where it went) or a lowered level. Give the agent that list and the new edition's `llms-full.txt`, have it meet each new MUST or record it in `pauta.json`,
replace `src/test/resources/pauta-rules.json` with the new edition's, then change `pauta.version`, `AGENTS.md` and the
README together ([PAUTA-11](../conformance/#pauta-11)).

## Working on Pauta itself

This repository has its own [`AGENTS.md`](https://github.com/adriandeleon/adl-desktop-apps-guidelines/blob/master/AGENTS.md):
the rule syntax, each page's prefix, and how a change becomes an edition. `npm run check` fails on a malformed rule,
and `rules.json`, `llms.txt` and `llms-full.txt` are built from the pages, so a rule written on a page reaches agents
in the next edition with nothing else to update.
