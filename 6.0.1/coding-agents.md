# Coding agents and LLMs

> What every edition serves to coding agents, how an app's AGENTS.md points its agent at the edition it is built to, and how to have an agent build a feature to the rules or audit an app against them.

Pauta 6.0.1 (2026-11-11). The page with its screenshots and mockups: https://pauta-project.dev/6.0.1/coding-agents/.
Every rule of the edition: https://pauta-project.dev/6.0.1/llms-full.txt.

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
| `changelog.md` | The Changelog page as Markdown: how editions are numbered and what each one changed. | Moving an app to a newer edition. |
| `skills/pauta-audit/SKILL.md` | The audit procedure as an agent skill: how to judge each rule, read `pauta.json` and write the report. | Auditing an app. |
| `audit.schema.json`, `rules.schema.json` | The [JSON Schema](https://json-schema.org) of an audit report and of `rules.json`. | Writing or checking a report; reading `rules.json` in code. |
| The page itself | The prose, screenshots, mockups and spec tables around the rules. | When the picture matters. |

Each one lives under its edition: `https://pauta-project.dev/4.3.1/llms.txt`, `.../4.3.1/rules.json`,
`.../4.3.1/keyboard.md`. `latest/` always holds the newest edition, and the site root holds a copy of the latest
`llms.txt`, `llms-full.txt` and `rules.json`, where agents look first. Every link inside these files points at the
numbered edition, so a rule an agent cites keeps its address. `llms.txt`, `llms-full.txt` and `rules.json` are
served from 2.0.0 on, the page Markdown, the skill and the schemas from 4.3.1, and `changelog.md` from the edition
after 4.5.0; the 1.x editions, from before rules
had IDs, have their pages only. `versions.json` at the site root lists every published edition.

The [single Markdown file](https://pauta-project.dev/6.0.1/downloads/adl-desktop-apps-guidelines.md) is the whole guide in one file. It is large.
Its pages and rules are the site's, and each mockup reads as it does in `<page>.md`: a sentence saying what it
shows.

## What a rule looks like

Every rule is one testable statement with a permanent ID. In `llms-full.txt` it is the same list item as on its
page: the ID and level in bold, the statement, then *Why*, *Check*, sometimes *Command*, and *Reference* lines. In
`rules.json` the same
rule is:

```json
{
  "id": "KBD-07",
  "level": "MUST",
  "changed": "x.y.z",
  "page": "keyboard",
  "pageTitle": "Keyboard first",
  "section": "Command Palette",
  "appliesTo": null,
  "url": "https://pauta-project.dev/<edition>/keyboard/#kbd-07",
  "text": "The palette and every picker (a card that lists choices to filter and pick one from: [QOPEN-01](https://pauta-project.dev/<edition>/templates/quick-open/#qopen-01)) are in-scene overlays in the window's root `StackPane`, never a `javafx.stage.Popup`.",
  "why": "on Windows a Popup does not reliably take OS keyboard focus, and the whole app can stop receiving keystrokes.",
  "check": {
    "kind": "code",
    "text": "the palette and every picker add their node to the root `StackPane`; none creates a `Popup`.",
    "command": null
  },
  "reference": "Editora [`ui/OverlayHost.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/OverlayHost.java), the one host installed in the scene's root `StackPane`, which shows the palette ([`ui/CommandPalette.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/CommandPalette.java)), the picker ([`ui/QuickOpen.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/QuickOpen.java)) and the picker's relatives ([QOPEN-12](https://pauta-project.dev/<edition>/templates/quick-open/#qopen-12))."
}
```

- **`id`** is permanent. It is never renumbered or reused; a removed rule leaves a gap. The prefix names the page
  (`KBD` is Keyboard first), and `llms.txt` lists every page's prefix. `rules.json` ends with `retired`, every ID no
  longer in use: the `edition` that removed it and `see`, the rule that holds its requirement now (with its `seeUrl`),
  or `null`. A `pauta.json` entry for a retired ID is stale; move it to the `see` rule, if the app still misses it.
- **`level`** is MUST (a release blocker for a new app), SHOULD (expected unless the app has a stated reason) or
  MAY (worth copying when the app grows into it).
- **`check.kind`** says how the rule is verified: `code` by reading or searching the source, `test` by a named test
  the build runs, `by hand` by a person, in the running app or where the check sends them (DOCS-16 reads the
  repository's pull requests), which source alone can't settle. A rule has a `test` check only
  when its statement requires the test ("A test holds it.", or a rule that is itself about a test). A `code` check may end "A test that asserts it is the
  surest evidence": that test is evidence, and an app without it still meets the rule by the behavior its code
  shows. A check that reads what the app's checkout does not hold, the website's repository or a repository
  setting, says so in its last sentence ([`not-checked`](https://pauta-project.dev/6.0.1/coding-agents/#audit-an-app)).
- **`check.command`**, on some `code` checks, is one POSIX shell command (Linux, macOS, Git Bash or WSL): run it with
  `sh -c` from the app's repository root. Exit 0: the check passes; still read the rest of the rule and cite the
  file:line that meets it. Any other exit: the check fails, and what it printed is the evidence (OS-02's lists the
  classes that read `os.name`). Every command only reads, and opens with a guard that fails it outside an app's root.
  It is `null` where reading the code takes judgment. A search written inside `check.text` (the `grep` of
  PERF-01, say) is not a command in this sense: it lists candidate lines for a person or an agent to judge, and
  its exit code is no verdict.
- **`reference`** names the Editora file, or the other app, that does it. The agent copies from there. From the first
  edition released after 4.5.0, its links point at the commit each app was at when the edition came out, so they show
  the code as it was then; `blob/master` in a page's source becomes that commit in what the edition serves. Editions
  up to 4.5.0 link the apps' default branches.
- **Names in a rule.** Some names in a rule's `text` are required as spelled, because a user, the docs or another tool
  finds the thing by that name: a command id, a catalog key, a chord, a command-line flag, an environment variable, a
  property in `pom.xml` or `pauta.json`, and a file the repository must carry, whether a document at its root or a
  resource or tool configuration the rule names. For example `help.about`, `palette.show`, `--config-dir`,
  `pauta.version`, `AGENTS.md`, `emacs.json`, `messages_<code>.properties` and `jreleaser.yml`. A platform API the rule names
  (`javafx.stage.Popup`, `SystemTray`, `Platform.setImplicitExit(false)`, `Future.get()`) is the requirement itself:
  the JDK and JavaFX spell it one way for every app. Any other name is how Editora spells it, and the app's equivalent
  meets the rule: a class, method or constant of the app's own code, a CSS file or style class, a branch or workflow
  file, a file the app writes as it runs (its config files).
- **`why`** is `null` when the rule has no reason worth stating.
- **`appliesTo`** is `null` for a rule that covers every app, unless its own text says otherwise. Otherwise it is the
  **Applies to** line its page or section opens with: "an app whose work goes on without its window" for the
  `TRAY` rules, and "every app that sends desktop notifications…" for TRAY-09 to TRAY-11. `pages` lists every page with its prefix, its Markdown address and its `appliesTo`.
- **`changed`** is the edition in which the rule's level, scope or statement last changed, as a version
  (`"5.0.0"`). A `checked` entry in an app's `pauta.json` whose `edition` is older than it is stale
  ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)). A rule unchanged since it was added has the edition that added it, 2.0.0 at the earliest; a rule's Why, Check,
  Command and Reference do not move it. Editions up to 5.0.0 don't have the field. In `next/`, the batch that is
  not an edition yet, a rule new or changed since the last edition has `"next"`.
- **`statuses`** are what an audit reports for a rule ([Audit an app](https://pauta-project.dev/6.0.1/coding-agents/#audit-an-app)), and `audit` is the address
  of the report's schema.

## Point the app's agent at its edition

An app is built to one edition, the one `pauta.version` in its `pom.xml` names (see
[About window](https://pauta-project.dev/6.0.1/templates/about/)). Its agent should read that edition, not `latest/`: a newer edition may hold
MUSTs the app doesn't meet yet, and an agent that reads them will "fix" what nobody asked it to.

Say so in a section of the app's `AGENTS.md` ([PAUTA-17](https://pauta-project.dev/6.0.1/conformance/#pauta-17)). The
[app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`AGENTS.md`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/AGENTS.md) has one, headed "Pauta"; an app made before it adds this:

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
An app whose conformance is Partial writes `is working toward Pauta <edition>` instead of `is built to`, as its
README and About do ([Conformance](https://pauta-project.dev/6.0.1/conformance/#complete-core-and-partial)).

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
ships it) or point the agent at it. Use the copy of the edition the app is built to (the newest edition's for an
app on an edition before 4.3.1, which serves none), and replace the app's copy when the app moves to a newer
edition ([PAUTA-11](https://pauta-project.dev/6.0.1/conformance/#pauta-11)). The skill decides how to audit and how to write the report, and
`rules.json` supplies the rules. `llms.txt` and `llms-full.txt` carry the procedure in short; where an edition's
short version differs from the skill, the skill wins:

1. Find the edition the app implements: `pauta.version` in its `pom.xml`, or failing that the "Built to Pauta"
   line of its README. Read that edition's rules. If the app names none, ask which edition to audit against and
   offer the newest; with no one to ask, use the newest and say so in the report. A 1.x edition has no
   `rules.json`: audit against 2.0.0 or newer, and report what the app's own edition didn't ask for as upgrade work.
2. Take each rule in turn. A *code* check: run its `check.command` when it has one, else read or search the source as
   it says. A *test* check: find the named test, or the app's equivalent, and confirm the build runs it. A *by hand*
   check: the source can't confirm it, so report it as manual, unless `pauta.json` lists the rule (step 4) or the
   source plainly shows it unmet, which is a `fail` like any other. A check that needs the website's repository or
   a repository setting, which the app's checkout does not hold, is `not-checked` when the audit can't reach
   it. Which names in a rule are required as spelled is under [What a rule looks like](https://pauta-project.dev/6.0.1/coding-agents/#what-a-rule-looks-like).
3. A rule applies to every app unless it is limited: its text names the apps it covers ("An app with user
   documents…"), its page or section opens with an **Applies to** line, or it details a limited rule
   ([PAUTA-05](https://pauta-project.dev/6.0.1/conformance/#pauta-05)). An app outside a limited rule gets `limited`, and needs no exception.
   Those three are the only places a scope is written: an audit never infers one from what the app lacks.
4. Read the app's `pauta.json` ([Conformance](https://pauta-project.dev/6.0.1/conformance/)). An unmet rule it lists gets the entry's kind as its
   status; MAYs need no entry. An unmet MUST or SHOULD it doesn't list is `fail`; so is an unmet MAY, which has no
   consequence. An entry for a rule that passes or is limited, and a deviation or pending entry with no link, are
   problems. A by-hand rule it lists as an exception gets that kind too, not `manual`. Its `checked` list records
   the by-hand rules a person checked in the running app and found met ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)): a
   `manual` result carries its entry, and one with no entry is reported as not recorded, which is not a failure:
   the list is the app's to keep or not, and PAUTA-18 governs only the entries that are there.
   An entry older than the rule's `changed` is stale, and a problem.
5. Report one result per rule: its ID, level, status and evidence as `file:line`. A failed MUST blocks a release;
   a `manual` or `not-checked` MUST does not, and stays in the report until someone settles it.

Every report uses the same statuses, which `rules.json` also lists:

| Status | Means | Needs an exception? |
|---|---|---|
| `pass` | Met. | No; an entry for it is stale. |
| `fail` | Not met, and `pauta.json` doesn't list it. A failed MUST blocks a release; a failed MAY has no consequence. | A MUST or SHOULD, yes: this is what the audit is for. A MAY, no. |
| `manual` | Checked by hand: the source leaves it open. A person checks it, in the running app or where the Check sends them (the repository's pull requests, for DOCS-16), and may record it in `pauta.json`'s `checked` list once it is met; the report gives that entry, or says "not recorded". | No, recorded or not. Found unmet by the person who checks, it gets one, and its status is that kind from then on. |
| `not-checked` | The Check needs something the audit could not read: another repository (the website's), what the repository's host keeps and no file shows (a repository setting, an issue's state), or the rules of the edition the app names, in an audit run against another ([ABOUT-07](https://pauta-project.dev/6.0.1/templates/about/#about-07)). Not a finding and not a pass; the evidence says what would settle it. It does not block a release. | No. Found unmet by whoever settles it, it gets one. |
| `pending`, `deviation`, `not-applicable`, `app-only` | Not met, and `pauta.json` lists it as that kind. | It has one. |
| `limited` | The rule covers apps with a feature this one lacks. | No; an entry for it is wrong. |

The skill writes the report twice: `docs/pauta-audit.json`, which follows the edition's `audit.schema.json` so two
audits can be compared by a script, and `docs/pauta-audit.md`, the same results as tables for people. A prompt as
short as this one is enough:

```text
Audit this app against Pauta <edition> with the pauta-audit skill
(https://pauta-project.dev/<edition>/skills/pauta-audit/SKILL.md). Failed MUSTs first.
```

Each result reads like this:

```text
KBD-07   MUST    pass     src/main/java/com/example/app/ui/CommandPalette.java:57
TBAR-01  MUST    fail     src/main/java/com/example/app/ui/MainToolbar.java:88 builds an icon button by hand
SET-02   MUST    manual   the Settings window's layout needs the running app; checked 2026-11-02 against <edition>
PWIN-02  MUST    manual   compare the Pauta window with pauta.json in the running app; not recorded
TRAY-01  MUST    limited  no tray: no SystemTray or TrayIcon in src/
PAUTA-13 MUST    not-checked  needs the website's repository: its docs have a Pauta conformance page
DIAG-07  SHOULD  not-applicable  pauta.json: the app depends on no outside tool, so a Doctor has nothing to check
MENU-14  MUST    pending  pauta.json: issue #212
```

- **Split a large audit.** An edition has hundreds of rules. Give each page, or each prefix, its own pass or its own
  agent, and start with the MUSTs (`jq '.rules[] | select(.level == "MUST")' rules.json`). Each page's Markdown
  (`<page>.md`) is a small read for one pass.
- **Check the evidence.** A verdict without `file:line` is a guess. Open a sample of the passes as well as the
  failures before you act on the report.
- **Manual means a person.** A *by hand* check needs the running app, often on a particular OS, or in a few rules
  a look at the repository's pull requests ([DOCS-16](https://pauta-project.dev/6.0.1/documentation/#docs-16)). The agent lists
  them; someone runs them and may record each one met in `pauta.json`'s `checked` list
  ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)), which the next audit reads back. One with no entry is reported as not
  recorded: that is not a failure, it needs no exception, and it leaves the conformance as it is. One the person
  finds unmet gets an exception like any other rule ([PAUTA-04](https://pauta-project.dev/6.0.1/conformance/#pauta-04)). The agent settles one
  case by itself: a by-hand rule the source plainly shows unmet is a `fail`, with the `file:line`.
- **Not checked means out of reach.** A few checks read the app's website repository
  ([DOCS-01](https://pauta-project.dev/6.0.1/documentation/#docs-01), [PAUTA-13](https://pauta-project.dev/6.0.1/conformance/#pauta-13)) or a repository setting
  ([REL-19](https://pauta-project.dev/6.0.1/release/#rel-19)). An audit run from the app's checkout alone reports them as `not-checked` and
  says what would settle each; with the website checked out beside the app, or `gh` signed in, it judges them.
  The checkout still settles what it holds: an app whose repository and About name no website fails DOCS-01,
  [DOCS-02](https://pauta-project.dev/6.0.1/documentation/#docs-02) and PAUTA-13 outright, with no website to read. And an audit run against
  an edition other than the one the app names reports [ABOUT-07](https://pauta-project.dev/6.0.1/templates/about/#about-07) as `not-checked`
  when About says *Built to*: only the app's own edition's rules settle it.
- **Nothing to judge is not a guess.** A rule about how a required part behaves (the find bar of a log shown as
  text, the Pauta window) fails with the rule that requires the part, and its evidence names that rule, so a
  missing find bar reads as one cause. So does a rule that limits every item of a kind some rule requires: with
  no keymap file, the rule on a keymap's macOS variant fails with the rule that requires the files. A rule that
  constrains things no rule requires an app to have (every entry, row or file of a kind) passes in an app that
  has none. The skill's step 4 has the order.
- **Gaps per app** on this site is the same audit, done by hand for the six apps. An agent's report for one of them
  should agree with [Gaps per app](https://pauta-project.dev/6.0.1/family/gaps/); where it doesn't, one of them is wrong.

## Move an app to a newer edition

The version says how much work the move is ([how editions are numbered](https://pauta-project.dev/6.0.1/changelog/#how-editions-are-numbered)): a
newer patch asks nothing of the app, a newer minor asks it to add, a newer major asks it to undo or redo something.
The [Changelog](https://pauta-project.dev/6.0.1/changelog/) says what each edition added and which rules became stronger. To see it rule by
rule, compare two editions' `rules.json`:

```bash
old=2.0.0 new=2.0.2
diff <(curl -s https://pauta-project.dev/$old/rules.json | jq -r '.rules[] | "\(.id) \(.level)"' | sort) \
     <(curl -s https://pauta-project.dev/$new/rules.json | jq -r '.rules[] | "\(.id) \(.level)"' | sort)
```

A line only in the new edition is a new rule or a raised level; one only in the old is a retired rule (the new
edition's `retired` list says where it went) or a lowered level. A rule whose `changed` is newer than the app's
edition has a new level, scope or statement since then. Then, in one change
([PAUTA-11](https://pauta-project.dev/6.0.1/conformance/#pauta-11)):

1. Replace `src/test/resources/pauta-rules.json` with the new edition's, and the app's copy of the audit skill
   (`.claude/skills/pauta-audit/SKILL.md` in an app made from the template) with the one the new edition serves.
2. Remove the `checked` entries the new `rules.json` makes stale, those whose `edition` is older than their rule's
   `changed`, and have a person check those rules again ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)).
3. Give the agent the list and the new edition's `llms-full.txt`, and have it meet each new MUST or record it in
   `pauta.json`. Run the audit again.
4. Change `pauta.version`, `AGENTS.md` and the README together.

## Working on Pauta itself

This repository has its own [`AGENTS.md`](https://github.com/adriandeleon/adl-desktop-apps-guidelines/blob/v6.0.1/AGENTS.md):
the rule syntax, each page's prefix, and how a change becomes an edition. `npm run check` fails on a malformed rule,
and `rules.json`, `llms.txt` and `llms-full.txt` are built from the pages, so a rule written on a page reaches agents
in the next edition with nothing else to update.
