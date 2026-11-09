# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and editions are numbered as the [Changelog page](https://pauta-project.dev/latest/changelog/) says: a patch asks
nothing of an app, a minor asks it to add, a major asks it to undo or redo.

## [Unreleased]

### Added

- **Commands for code checks.** Twelve rules whose check a shell command can settle carry one, as a *Command* line
  under the Check and as `check.command` in `rules.json`: OS-02, PAUTA-01, PLAT-01, PLAT-03, PLAT-08, PLAT-09,
  PLAT-10, PLAT-13, REPO-03, KBD-09, KBD-10 and REL-22. Run from an app's root, each exits 0 when the check passes and
  prints what it found when it fails; each was tried on the six apps and the template. The audit skill and
  `llms.txt` run it before reading the code.
- **Pinned References.** From the next edition, what an edition serves links each app's code at the commit it was at
  when the edition was released, not `master`, so a Reference keeps showing the code as it was then.
- **PAUTA-17 · MUST.** An app's `AGENTS.md` has a `## Pauta` section that names the edition `pauta.version` names and
  links that edition's `llms.txt` and `llms-full.txt`, never `latest/`, so its coding agent reads the rules the app
  is built to. The Coding agents page has the block to copy, and the checklist the line.

### Changed

- **Editions come out in batches.** Changes to the guidance now collect under *Unreleased* and are published together
  as one edition when a batch is ready, instead of each change being an edition of its own. The Changelog page says
  so, and the largest change in the batch sets the number.

### Fixed

- **ACC-01's Reference** no longer says Editora's menu rows carry their text: only its macOS system-menu rows do; the
  in-window rows are drawn and silent to a screen reader.
- **PAUTA-17's Reference** says the template's test checks the edition its `AGENTS.md` names, not yet the `llms.txt`
  link.
- **PLAT-01** and **PLAT-10**'s Checks test what their rules ask: a compiler release of 25 or later, and Spotless's
  check run by CI either as `spotless:check` or bound to a phase CI runs, which Torrenta, Modula and Mirada do.
- **The check commands** open with a guard that fails them outside an app's root, so an empty folder no longer passes
  three of them; OS-02's needs exactly one class reading `os.name`; REPO-03's reads a Windows checkout's line endings.
  The skill, `llms.txt`, the schema and the Coding agents page now say the same thing about a result: exit 0 passes the
  check, and the agent still reads the rest of the rule.


## [4.5.0] - 2026-11-08

Accessibility gets a page and rules of its own, and the facts the 4.2.0 review found stale or wrong are corrected
against the apps' code. A minor: seven new rules and one raised to a MUST; no rule is retired, and none asks an app to
undo work.

### Added

- **Accessibility**, a page after Keyboard first, with the prefix `ACC`. It says what JavaFX gives a screen reader on
  each OS (Narrator on Windows, VoiceOver on macOS, nothing on Linux), links the accessibility rules already on other
  pages, and adds:
  - **ACC-01 · MUST.** Every control a person can reach has an accessible name, rows drawn from graphics included.
  - **ACC-02 · SHOULD.** A control the app builds itself states its role and its state.
  - **ACC-03 · SHOULD.** Content painted on a `Canvas` is exposed to the screen reader.
  - **ACC-04 · SHOULD.** Animations follow the OS's reduced-motion setting.
  - **ACC-05 · SHOULD.** Color is never the only signal.
  - **ACC-06 · SHOULD.** Commands move focus between the window's regions, bound in every keymap.
  - **ACC-07 · SHOULD.** The release smoke test includes a pass with Narrator and VoiceOver.
- *Same on every OS* lists the screen reader among the differences between OSes.
- The New app checklist has an *Accessibility* group.

### Changed

- **KBD-15 is a MUST**: every control is reachable with Tab and works with Space or Enter. Its exception now names
  the find bar's buttons beside the toolbar's, as the find bar's spec already had them.
- **REL-20** asks for the pure suite on Linux, macOS and Windows and the FX suite on Linux and at least one more OS,
  which is what Editora runs; it used to ask for the full suite on all three, which no app did.
- **KBD-05** and **PAL-01** let the IntelliJ keymap open the palette with IntelliJ's `Ctrl+Shift+A`, as Editora's does.
- **REL-21** recommends a version-shaped tag pattern over a bare `v*`, and **REL-22**'s Check accepts a branch name
  in the comment of an action that publishes no tag.

### Fixed

- Conformance, About and the Pauta window cite the app template, which implements them, and Termina, whose About
  names its edition, instead of "no app yet".
- Principle 9 allows the network calls the user set up (feeds, transfers) beside the release check.
- The tray anatomy states nux's number as the exception it is; the shared-features list says only Mirada (and Termina,
  About only) put About and Settings in the macOS application menu; QOPEN-01 names the three `ChoiceDialog`s Editora
  still has.
- ICON-11 says the emphasis ink is white only in the light themes; ICON-09 gives subtle ink's real range (2.7:1 to
  3.9:1); the Caret & Ink table names `-color-bg-inset` for `#12141d`; KBD-16 and ICON-12 say the focus-ring block
  comes after the rules it must win over, not at the very end of `app.css`.
- PLAT-11's Check allows xvfb in a release leg that trains the AOT cache; the Performance page no longer calls
  `daemon()` a shared Editora helper.
- The matrix: Torrenta's JaCoCo gate is ◐ (lines only), Termina's ◐ (0.73 branches), Termina's About names its
  edition, and Termina's close-running-program question now has a named red button.
- The Settings Sync subtitle matches Editora's string, and the About examples name 4.2.0 throughout.

## [4.4.0] - 2026-11-08

The reason the family exists, one app that is the same on Windows, macOS and Linux, now has rules an audit can check.
A minor: five new rules, four of them MUSTs, of which no app meets OS-02 or WIN-11 yet. No rule changes or retires.

### Added

- **Same on every OS**, a page in *Start here* after Principles, with the prefix `OS`. It lists every place where an
  app follows the OS's own way (the modifier key, the menu bar, file dialogs, opening files and links, the tray,
  notifications, start at login, saved secrets, installers), each with its rule, and says that any other difference
  is a bug or a recorded deviation. Its rules:
  - **OS-01 · MUST.** Every command, setting and window exists on every OS with the same default; one the OS can't
    serve is disabled and says why, never hidden.
  - **OS-02 · MUST.** One class answers which OS the app runs on, and no other class reads `os.name`. No app does
    this yet: each reads it in several classes, Editora in about fifty.
  - **OS-03 · SHOULD.** Tests can run as any OS, and one compares the commands, menu rows and settings pages across
    the three.
- **KBD-21 · MUST.** A keymap's `.mac.json` variant binds the same commands as the keymap it varies; only the chords
  may differ. Editora's `KeymapsTest` already checks it.
- **WIN-11 · MUST.** A dialog's buttons are in one order on every OS, Cancel to the left of the action. JavaFX
  orders a `ButtonBar` by OS, so today the same confirmation puts its action on the left on Windows and on the right
  on macOS and Linux.
- The New app checklist has a *Same on every OS* group, and its keyboard and window lines name KBD-21 and WIN-11.

### Changed

- Principle 1 says where the OS's own way wins and links the new page.

## [4.3.1] - 2026-11-08

What coding agents read now carries what a person reads around the rules: which apps a page's rules cover, each page
in full, and one way to report an audit. A patch: no rule's ID, level or requirement changes.

### Added

- **Applies to.** A page or section whose rules cover only some apps now says so in one line, which the site, the
  PDF and the agent files all show, and `rules.json` gives every rule its `appliesTo`. Tray and background (an app
  whose work goes on without its window), Settings Sync (an app with user data worth carrying between computers) and
  the Welcome page's behavior (an app with a Welcome page) have one. PAUTA-05 names it as one way a rule is limited.
- **One audit report.** Every edition lists the statuses an audit gives a rule (`pass`, `fail`, `manual`, the four
  exception kinds, and `limited` for a rule that covers apps with a feature this one lacks) and serves the report's
  JSON Schema, `audit.schema.json`, beside `rules.schema.json`. The *Coding agents and LLMs* page shows both.
- **The audit skill is part of Pauta.** Each edition serves `skills/pauta-audit/SKILL.md`, which the app template's
  copy follows. It now reads `pauta.json`, writes `docs/pauta-audit.json` beside `docs/pauta-audit.md`, and reads an
  edition offline from the `versions` branch instead of building the site.
- **Each page as Markdown**, at `<page>.md` beside the page (`keyboard.md`, `templates/about.md`): its prose, rules
  and spec tables, each mockup as a sentence and its numbered parts as a list. `llms.txt` links them.
- `rules.json` names its schema and lists every page, with its prefix, Markdown address and `appliesTo`.
- `llms-full.txt` and `rules.json` are at the site root too, beside `llms.txt`.

### Changed

- **Not applicable and limited are two results.** The Conformance page said an audit's "n/a" lines were exceptions,
  while PAUTA-05 said a limited rule needs none. A limited rule is now `limited`, with no entry; `not-applicable`
  is an exception, as `pauta.json` has always had it. PAUTA-04's check reads the report's `fail` results.
- `llms.txt` puts how to use Pauta before its first heading, as the llms.txt format has it, and says that the 1.x
  editions have no `rules.json`.

### Fixed

- Links to a rule on the same page (`#pauta-03`) were left relative in `rules.json` and `llms-full.txt`; they are
  absolute now.

## [4.3.0] - 2026-11-08

One requirement, one rule, and one place that sets its level. A review of 4.2.0 found about twenty requirements stated
under two or three IDs, sometimes at different levels, and a checklist that gave other levels than the pages. This
edition retires the copies and makes the page the only source of a level. It is a minor: no rule's level changes on
its page and nothing an app did has to be undone. An app built to 4.2.0 moves each `pauta.json` entry for a retired
ID to the rule that holds it now, which `rules.json` names.

### Changed

- **A rule's level is the one on its page.** The checklist used to set it too ("a rule the checklist lists is a
  MUST"), and the two disagreed: TABS-13 and ICON-11 were MUSTs on their pages and SHOULDs on the checklist, PERF-04
  the other way round, and Inter was a SHOULD on one checklist line and a MUST on another. `rules.json`, the Pauta
  window and the conformance already used the page's level; now the checklist agrees with it.
- **The New app checklist names its rules.** Every line ends with links to the rules it sums up, every MUST of the
  edition is on a line, and a line marked SHOULD holds only SHOULDs. New lines cover the MUSTs it left out (About's
  Pauta edition, the Pauta window's links, the find bar's filter for list apps, the toolbar's right-click menu,
  pinning, right-click menus everywhere, notifications, the Debug Log window, `NOTICE` credits for icons and fonts).
  Lines that claimed what no rule says are gone or fixed: a drift test for every repeated fact, themes that follow the
  system by default, start at login "with no setting beside it", and the template "built to" its edition (it is
  made toward it). Ticks kept in the browser reset for the lines that changed.
- **Rules that repeated part of another** now link to it instead: PLAT-13 (`java.util.logging` only; DIAG-02
  captures it), PLAT-14 (Jackson; SET-09 versions the files), DOCS-05 (the GitHub release is REL-04), WIN-08
  (`--no-session` is CLI-04), SET-07 (the flags are CLI-02), DIAG-06 (`--report` is CLI-05), DIAG-01 (a click on the
  echo area is WIN-01), MLOG-02 and MLOG-03 (what they add beyond DIAG-01), PAL-01 (its chords are KBD-05) and
  SYNC-02 (refusing a URL with a password is SET-15). The Settings Sync rules SET-18 to SET-21 are for an app that
  offers sync.

### Removed

- **Sixteen duplicate rules are retired**, each for the rule that holds its requirement: PLAT-07 (ICON-01, ICON-02),
  QUAL-01 (PLAT-09), QUAL-12 (INTL-08, DOCS-09), QUAL-14 (ICON-14), DOCS-19 (REPO-01), KBD-08 (QOPEN-01), KBD-17 and
  ICON-21 (TBAR-01), KBD-20 (INTL-04), WIN-02 (ICON-15, ICON-16, ICON-18), WIN-05 (CONF-01 to CONF-04), WIN-06
  (WELC-01), WIN-07 (ABOUT-02, ABOUT-09), SET-17 (SYNC-01, SYNC-02), PAL-03 (KBD-07) and MLOG-01 (DIAG-01). Where
  the copy was a MUST and its owner a SHOULD, the owner's level stands: what the state colors mean (ICON-18) and the
  release notes on the GitHub release (REL-04) are SHOULDs. The edition has 360 rules: 171 MUST, 180 SHOULD, 9 MAY.

### Added

- **Retired IDs are on record.** `rules.json` ends with `retired`: every ID no longer in use, the edition that
  removed it and the rule that holds its requirement now. *Coding agents and LLMs* says how to use it when an app
  moves to a newer edition.

## [4.2.0] - 2026-11-08

The first audit of an app against 4.1.0, of the app template, found gaps in the conformance rules. This edition
closes them. It is a minor: one rule is added and others now cover cases they left open; nothing an app did to meet
4.1.0 has to be undone.

### Added

- **Templates** (PAUTA-16). A template repository sets `"template": true` in its `pauta.json` and records as
  `app-only` the rules only an app made from it can meet: its own website, screenshots or repository settings.
  `app-only` leaves the conformance as it is, and only a template may use it. Making an app from the template sets
  `template` to `false`: the app's everyday build then lists those entries and any pending link to the template's
  issues, and its release build fails until each is met or pending in the app's own repository. Without this, a
  template could never be better than Partial.
- **Commands for the Pauta links.** `help.pautaRules` opens the edition's rules (About's edition link and the Pauta
  window's) and `help.pautaDocs` the app's conformance page, so both are in the Command Palette (PWIN-04, PWIN-07).

### Changed

- **Issues.** A pending exception's issue is in the app's own repository and may hold several rules, one per page
  for example, if it names each rule's ID and edition (PAUTA-07). The test reports a pending link to another
  repository, and the release build fails on it (PAUTA-10).
- **What needs an entry.** MAYs never do; a rule checked by hand is checked before the conformance is claimed, and
  pending if it fails (PAUTA-04). A rule that details a limited rule is limited too, as WELC-03 onward are under
  WELC-01 (PAUTA-05). PAUTA-03 is for the app made from a template, not the template.
- **Pauta window copy.** `command.help.pauta.desc` no longer takes an argument, since command descriptions take
  none. Counts use `MessageFormat` `choice` ("1 SHOULD is pending"), and the table lists the count, app-only and
  decision strings. The docs link opens `/docs/v-<version>/pauta/` where the site has versioned docs and
  `/docs/pauta/` until then.
- **About.** The `Pauta conformance:` line says `(1 exception)` with one and `(no exceptions)` with none (ABOUT-09).
- **README badge colors:** green `2ea043` for Complete, blue `5b8def` for Core, amber `d29922` for Partial.
- **Audit procedure** (Coding agents, `llms.txt`): `app-only` is a kind; MAYs need no entry.

## [4.1.0] - 2026-11-08

### Added

- **Conformance.** A new page under *Start here* says how an app implements Pauta: it names one edition and states
  its conformance, **Complete** (every MUST met, every SHOULD met or a recorded deviation), **Core** (every MUST met,
  some SHOULDs pending) or **Partial** (some MUSTs pending), and records every rule it does not meet as an
  **exception** in `src/main/resources/com/<app>/pauta.json`. An exception is `not-applicable` (with a reason), a
  `deviation` (SHOULDs only, with a decision record in `docs/decisions/`) or `pending` (with an issue). The
  conformance is computed from the exceptions by one tested helper, never stored; a `PautaConformanceTest` holds the
  file and the README to a copy of the edition's `rules.json`; the app's user docs get a *Pauta conformance* page
  with the same list; and a new app's first release is Core or Complete. "Built to an edition" keeps its meaning,
  that the app meets its MUSTs: a Partial app says *Working toward Pauta 4.1.0* instead. The page says "conformance",
  not "level", so "level" keeps meaning MUST, SHOULD or MAY. Rules PAUTA-01 to PAUTA-15.
- **Pauta window.** A new template: a read-only panel built like About that shows the edition, the conformance and
  every exception, grouped pending, deviation, not applicable, with each rule linked in the app's edition. It is the
  `help.pauta` command, so it is in the Command Palette, in the Help menu as *Pauta Conformance* just above About,
  and opened from About. Rules PWIN-01 to PWIN-08.
- **ABOUT-09.** About shows the conformance after the edition: a *Pauta conformance: Core* link that opens the Pauta
  window, and a `Pauta conformance: Core (2 exceptions)` line after the `Pauta:` line. At Partial the edition's link
  reads *Working toward Pauta 4.1.0*.

### Changed

- **ABOUT-07** says that an app at Partial names the edition it is working toward. ABOUT-05 and ABOUT-06 are
  unchanged: the edition's link and the `Pauta:` line stay as they were. WIN-07 names the conformance too.
- **Help menu.** DOCS-07 puts Pauta Conformance between Report a Problem and About.
- **README badges.** A Pauta badge after Platforms names the edition and conformance and links to the conformance
  docs page.
- **Auditing an app** (Coding agents, `llms.txt`): a fifth step reads `pauta.json`, reports a listed rule by its kind,
  and treats an unlisted failure, a stale entry or a missing link as a finding. *Move an app to a newer edition*
  replaces the test copy of `rules.json` and updates `pauta.json`.
- **Checklist, matrix and gaps.** A Conformance group on the checklist; a matrix row for the Pauta window and
  `pauta.json`; every app's gaps list them.

## [4.0.2] - 2026-11-08

### Added

- **How editions are numbered.** The Changelog page says what each part of the version means, judged by what moving
  an app to the edition costs. A patch asks nothing: wording, fixed facts, screenshots, pages without rules. A minor
  asks the app to add: a new rule at any level, a level raised or lowered, a rule retired. A major asks it to undo or
  redo work that conformed: a rule reversed or replaced, a requirement changed so the old way fails. A new MUST is a
  minor, even when every app fails it, so majors stay rare; 2.0.0 and 3.0.0 would be minors under these rules and
  keep their numbers. Typos, links, markup and the site's look take no edition at all. Coding agents and LLMs says
  what each part means when an app moves to a newer edition. No rule changed.

## [4.0.1] - 2026-11-07

### Changed

- **References link to the code.** Every file and class a rule names in Editora, Torrenta, Termina, Mirada, Modula,
  nux, the app template or editora-website links to it on GitHub, on that repository's default branch: about 740
  links, in the *Reference* lines, the spec tables and the prose. Names that don't point at one file in one
  repository (a file every app has, a glob, a class several apps share, what *Gaps per app* says an app lacks) stay
  plain text. No rule changed.

## [4.0.0] - 2026-11-07

### Added

- **An icon and the chord on every menu row.** Three new MUSTs on Menus, for every menu the app draws:
  the menu bar, right-click menus, menu-button and split-button drop-downs and the toolbar's overflow. MENU-14: every
  row carries an icon that depicts it (a check or radio row's mark stands in for it); where the icon set has no fitting
  glyph, the app adds one. MENU-15: a row whose command is bound shows its chord in the periwinkle column, in
  right-click menus and drop-downs as in the menu bar. MENU-16: titles in Inter 14 px and chords in Inter 11 px,
  whatever the menu was opened from. Menus the platform draws (the macOS system menu bar, a tray menu) stay text
  only. The checklist lists all three. Apps fail them today, so this is a major edition. Only
  Mirada has an icon on every row, and only Mirada shows chords in every menu; Editora gives about half its menu-bar
  rows and many right-click and drop-down rows no icon, and its right-click menus no chords; Termina's menu-bar rows
  and Modula's and nux's menus have no icons; Torrenta's RSS and priority menus have neither. Only Editora pins the
  menu font. *Gaps per app* and the feature matrix say which app misses what.

### Changed

- **Menus page.** The right-click mockup shows chords, the icon column is filled on every row, and the screenshot
  captions say what the earlier build lacks.

### Removed

- **ICON-22** (no invented glyph; a row with no fitting glyph gets none) is retired: MENU-14 asks for the opposite.
- **TBAR-11** (the toolbar's right-click menu at 14 px) is retired: MENU-16 holds it for every menu, and TBAR-10 links
  to it.

## [3.0.0] - 2026-11-07

### Changed

- **Secrets and config safety are MUSTs.** SET-11 (read a config file with suspicion: clamp on load, keep a file
  that can't be read as a backup, never stop startup over it), SET-13 (no secret in a config file; keys and tokens
  in the OS keychain, off the FX thread), SET-14 (a credential the app can ask for again stays in memory), SET-15 (a
  secret in the wrong place is refused) and SET-16 (an option that weakens security has no UI) were SHOULDs and are
  now MUSTs, and the checklist lists them. Apps fail them today, so this is a major edition: Torrenta, Modula, Mirada
  and nux keep no backup of a bad config file, and in Torrenta and nux a malformed `\uXXXX` escape stops startup;
  Editora keeps its AI keys in `settings.json` as a fallback and writes the keychain on the FX thread, and lets
  plugin signature checking be switched off from Settings; Torrenta keeps its proxy, Torznab and remote-profile
  secrets in plain text. SET-11 now asks for a backup, not the exact name `<name>.corrupt.bak`, and its check
  includes a parser that throws something other than an `IOException`.
- **The checklist sets the level.** Where a page and the checklist disagreed, the checklist wins, as `AGENTS.md`
  says: PLAT-04 (one JPMS module) is a MUST, which all six apps meet; TABS-15 (panel state restored), TBAR-07 (a
  toggle wears `:open`) and ICON-09 (readable text) are SHOULDs.
- **One rule for readable text.** ICON-09 now holds what ICON-03 and KBD-19 repeated; those two IDs are retired, and
  Keyboard links to ICON-09.

### Fixed

- **Follow the system.** The feature matrix marked every app as following the system's light or dark scheme; only
  Mirada and nux do. Editora, Torrenta, Termina and Modula switch live but have no system choice, and WIN-02 and
  ICON-16 name both apps that do.
- **Gaps per app** lists what each app fails among the MUSTs above, and Editora's row the MUSTs its rules' References
  already said it misses.
- **SET-15** said a problem report redacts hosts; it redacts tokens, credentials, e-mail addresses, user names and
  home paths, and keeps the host.

## [2.0.2] - 2026-11-06

### Added

- **Coding agents and LLMs.** A new page under *Start here* explains what every edition serves to coding agents
  (`llms.txt`, `llms-full.txt`, `rules.json`) and where each lives, what a rule looks like as JSON, how an app's
  `AGENTS.md` points its agent at the edition in `pauta.version` rather than `latest/`, how to have an agent build a
  feature to a page's rules, how to run and check an audit, and how to compare two editions' rules before moving an
  app to the newer one. The overview and the README link it. It adds no rules.

## [2.0.1] - 2026-11-06

### Changed

- **The template comes first.** The overview opens *Where to start* with the two ways to implement Pauta: a new app
  starts from [adl-desktop-app-template](https://github.com/adriandeleon/adl-desktop-app-template), an existing one works through the
  checklist and its gaps. The hero links the template, and the PDF, the Markdown download, `llms.txt` and the README
  name it at the top, and the checklist no longer says it meets every MUST. They say the template is built to the
  edition its README names, not to every MUST of this one.

## [2.0.0] - 2026-11-06

### Added

- **About names the Pauta edition.** The About window now MUST show the edition of these guidelines the app
  implements: a *Built to Pauta x.y.z* link to that edition's own address (`https://pauta-project.dev/x.y.z/`, not
  `latest/`) and a `Pauta: x.y.z` line in the environment block, so *Copy details* carries it. The number is the
  edition the app meets, not the newest, and comes from a `pauta.version` property in `pom.xml` read by `AppInfo`.
  No app does this yet; the matrix has a row for it and every app's gaps list it. Window shell and the checklist say
  the same.
- **Coding agents can read the rules.** Every edition serves `rules.json` (each rule's ID, level, page, section,
  address, text, why, check and reference), `llms-full.txt` (every rule as Markdown in one file) and `llms.txt`
  (the index, which says how to audit an app: find the edition it names, take each rule's check, report pass, fail,
  not applicable or manual with `file:line` evidence). The site root carries the latest `llms.txt`. Every link points
  at the numbered edition, so a citation never moves. The overview links them.
- **A malformed rule fails the build.** `npm run check` fails on a rule head that doesn't match, an ID used twice, a
  prefix on two pages, a rule without its Check or Reference line, or a table with a Level column; `npm run build`
  runs it first.

### Changed

- **Every rule has an ID, a level and a check.** 352 rules, from `PLAT-01` to `SYNC-02`, each with a permanent
  anchor (`#kbd-07`), a level, a *Check* line (237 by reading the code, 80 by a named test, 35 by hand in the running
  app) and a *Reference* line naming the code. People and coding agents can audit an app rule by rule and cite what
  they find. Rule tables became lists, so a page has one shape for every rule; template pages keep their mockups and
  spec tables and open with a *Rules* section. The overview explains IDs once, and `AGENTS.md` lists each page's
  prefix.
- **Levels.** A rule that had a level keeps it. One that had none takes the checklist's level, or SHOULD when the
  checklist doesn't list it, so no app fails a new MUST. That makes MUSTs, among others, of the palette chord,
  overlay and command catalog keys, the Emacs and CUA keymaps, keymap layers, the icon-button helper, the FX test
  tag, the release supply-chain steps, `--help` / `--version` / `--config-dir` / `--dev`, single instance, the find
  bar's Enter and Escape, the shared tray package, Settings search and live apply, and the six catalogs; and SHOULDs
  of `--new-instance`, `--no-session` and `[files…]`, which the command-line page only listed.
- **Split and narrowed.** Rules that held two requirements were split: keymap presets are now Emacs and CUA (MUST)
  and IntelliJ, VS Code and Sublime (SHOULD). Some rules were narrowed to what was meant: the rule against chords in
  translated text covers only command chords (Enter, Tab, Esc and a shell's keys may be written), the Settings chord
  is CUA's, an unknown theme falls back to the first-run default, a permission is write only where a job needs it,
  and an empty picker may say so in the status line instead. Tab reachability names toolbar buttons as the exception
  Toolbars and tooltips already makes.
- **Checked against the apps.** Converting each rule meant checking it against the apps' default branches, and the
  pages had facts wrong. Editora has 19 community themes, not 21; the window title's unsaved marker is `●`; the
  Redactor keeps hosts and drops e-mail addresses and credentials; the generated icons live in `branding/`; Editora's
  release build uses Liberica; the Message Log is a card in `OverlayHost`, not a popup; Home and End move the caret
  in a picker and `Ctrl/Cmd+Home/End` jump rows; `StatusSeverity` reads `fail` or `error` in a `status.*` key's last
  segment; the font classes are `Fonts.BUNDLED` and `Fonts.loadForFirstPaint`; adding a language also means listing
  it in `Messages.LANGUAGES` and `MessagesTest`.
- **Where Editora falls short.** A rule Editora fails now says so in its Reference instead of claiming it passes:
  fixed hexes left in `app.css`, about twenty FX tests without the `fx` tag, an exit wait on the common pool, the
  main toolbar's buttons without accessible text and in the Tab order, Shift+Enter in the editor's find bar, no
  follow-the-system theme, no previous-tab command, settings without a palette command, and the uncaught-exception
  echo no app shows; Editora's Universal Argument title still carries `C-u`.

## [1.4.1] - 2026-11-06

### Changed

- **Every rule names its code.** About twenty rules that named no class or file now do, checked against each app's
  default branch: the status bar, themes, title bar, Welcome, About, window state, zoom and modes on Window shell
  (`StatusBar`, `Themes`, `WindowColorScheme`, `ExtendedWindow`, `WorkspaceState`, `WindowChromeCoordinator`); the
  `MessagesTest` checks behind each i18n rule; `App.main`'s AWT guard and `ProcessRunner.augmentedPath`; the command
  sweep's home-directory check; the release workflow steps; `Chrome.disabledReason`, `SettingsKeymapsPage` and
  `ChordFormat` on Keyboard; `commitOnEnterOrBlur` and `SharedConfig` on Settings; `MainMenuBar.setSimple`; the
  bundled Inter folder; and `ToolbarCatalog`. Where Editora does not do what a rule says, the page now names the app
  that does or says that none does yet: following the system theme is Mirada's `Theme`, the per-OS smoke launch and
  the `io.github.adriandeleon.<App>` metainfo are Torrenta's, Editora zooms content only, no app lists a prefix's next
  keys, and no app ships a CJK or right-to-left language. Rules checked by hand (an English value in a catalog, a cut
  row at 1024 px) say so.

## [1.4.0] - 2026-11-06

### Added

- **Documentation**, a new Foundations page, and documentation is a MUST. Every app has user documentation on its
  website under `/docs/` (Getting started, a page per feature area, the keyboard reference, Settings, an FAQ), reached
  from the app by a `help.documentation` command first in the Help menu and on the Welcome page; a one-line description
  for every command; `docs/README.md` indexing the contributor guides, with `AGENTS.md`, `CONTRIBUTING.md` and `docs/`
  each doing one job; and the docs change in the same PR as the code, the code winning when they disagree. Deep links
  that open the running version's docs (`/docs/v-<version>/`), references generated from the source with a drift
  check, decision records, Javadoc on its member and retaken screenshots are SHOULDs; per-command help from the palette
  and a Help link on each Settings page are MAYs. From Editora's `AppInfo.docsUrl()`, `WindowCommandRegistrar`,
  `MenuBarModel`, `WelcomePane`, `CommandPalette` and `SettingsFrameBits`, its `docs/README.md` and
  `docs/conventions.md`, and the editora-website generators and `check-doc-commands.mjs`. The checklist gains a
  Documentation group, the matrix three rows, and the gaps table the apps that fail the new MUSTs: Modula and nux have
  no user docs beyond the README, and only Editora has a Help → Documentation command and a `docs/README.md`.

### Changed

- **Same app on every OS is principle 1.** Cross-OS consistency is the reason the family and the guide exist, so it
  moves from ninth to first, now naming the same commands, keymaps and look as well as the same features and installer
  quality, and the principles intro and the hero tagline say so. The former principles 1 to 8 are now 2 to 9; the
  Documentation page's reference to *Never claim what is not true* follows.

## [1.3.2] - 2026-11-06

### Changed

- **Mirada's homepage.** The overview's family grid and the matrix link Mirada to
  [mirada-project.dev](https://mirada-project.dev/) beside its GitHub repository, as Editora, Torrenta and
  Termina already are.

## [1.3.1] - 2026-11-06

### Changed

- **American spelling throughout.** Color, behavior, gray, license, customize and canceled, in every page, the
  changelog and the README; the Icons and color page's address follows (`/icons-and-color/`). `AGENTS.md` states
  the rule.

## [1.3.0] - 2026-11-06

### Added

- **Icons and color**, a new Experience page: Inter on every scene and JetBrains Mono for code; the Caret & Ink
  palette as a swatch grid of each token's light and dark value; the state vocabulary (amber not durable yet, red
  broken, green verified, accent an offer, periwinkle the keyboard and nothing else) named once on `.root` from the
  theme's roles, with the contrast rules `StyleContrastTest` pins; the 28 themes and the separate editor themes;
  and the two icon families (kit line glyphs stroked, Material glyphs filled), their classes, sizes and licenses,
  with what each of the six apps does. The checklist gains an Icons and color group and the matrix three rows.
- **Toolbars and tooltips**, a new Experience page: an icon-only button gets its tooltip and its accessible name from
  one helper, stays out of the Tab order and names its command and chord in the tooltip; groups are spaced, not
  ruled, on one chrome band with the menu bar and the tab strip; a toggle wears `:open` while its overlay shows; the
  pinned tail never overflows; and Editora's customizable toolbar (drag to reorder, drag off to remove, Escape) as a
  MAY. An annotated mockup and a spec table from Editora's `Icons`, `ToolbarCoordinator` and `ToolWindowManager`.
- **Tabs and tool panels**, a new Experience page. The tab header is a graphic label that carries the states (`•` and
  amber italic for unsaved, a pin and bold for pinned, muted italic for read-only, the Git colors), is the drag
  handle for reordering, and opens into the editor with a three-sided border; bulk close skips pinned tabs and Reopen
  Closed Tab brings the last one back. Tool panels dock on three stripes, two windows a side, toggled by commands and
  restored from `workspace-state.json`, with the SplitPane divider as their only edge. An annotated mockup and a spec
  table from Editora's `TabHeaders`, `ClosedTabs`, `Switcher` and `ToolWindowManager`; Torrenta's sidebar and detail
  pane, Mirada's panels and Termina's panes beside them.
- **Tray and background**, a new Experience page for the apps that keep working without their window: the tray icon
  (a StatusNotifierItem on Linux, AWT elsewhere, the app's own mark recolored by state), its text-only menu with the
  status line first and Quit last, close to tray only while an icon is actually up, `--minimized`, start at login as
  the OS's own entry with nothing beside it, and desktop notifications through one `Notifier` with one switch per
  event. From Torrenta's `tray/`, `os/Autostart` and `automation/Notifiers`, with Modula and nux. The checklist gains a
  Tray and background group and the matrix two rows.
- **QuickOpen picker template.** The palette card with a title and a prompt, for choosing one thing from a list:
  anatomy, spec (620 px, 26 px rows that hug the matches, 12 before scrolling), behavior (the supplier's order until
  you type, the current value pre-selected, preview with an undo, row actions), what each app picks with it, and the
  strings. From Editora's `QuickOpen`, `PickerKeys` and `OverlayHost`; Mirada's `CommandPalette.Choices` is the
  same shape.
- **Welcome page template.** Editora's start page as a mockup with its anatomy: Start actions that are commands with
  their chords, recent projects and files a digit away, Customize, Help and the footer; the spec from `WelcomePane`,
  when the page shows and when it does not (the empty-state hint after the last tab), and Torrenta's drop zone as
  the empty state for an app with no documents.
- **Confirm dialog**, a template. The question before a destructive action: it names the thing and the consequence, the button names the action in red (`danger`), Cancel is the catalog's word with Escape behind it, and where an undo exists there is no question. Mockup, the three-answer unsaved-changes variant, a spec tied to Editora's `CloseCoordinator` and `GitCoordinator.confirmDestructive` and Torrenta's `RemoveConfirm`, and the strings.
- **Find bar**, a template. In-scene and incremental with a count; Enter and Shift+Enter step, Escape closes the
  bar and gives the keyboard back; the keymap's caret chords work in the field; big documents and scrollbacks are
  searched off the FX thread. Editora's docked find and replace and Termina's floating card as mockups, Torrenta's
  filter box as the list app's version.

### Fixed

- **The palette's shared parts are named as the code has them.** Editora's caret-key helper is `TextInputKeymap`
  (`TextInputKeys` in Termina's and Mirada's copies), and Torrenta shares `MatchText` only, ranking with its own
  `CommandMatcher`; the Command Palette template and Shared features said all four were shared verbatim with all three.

## [1.2.0] - 2026-11-06

### Added

- **Menus**, a new Experience page. The menu bar and right-click menus share one look: Inter 14 px rows of 34 px, a
  22 px icon column with the command's own glyph, the chord right-aligned in its own column at 11 px in the keyboard
  color, radius 8 and a shadow that falls below the card. Right-click menus MUST open one at a time, close on a press
  anywhere outside them (including inside the control they were opened on, which JavaFX's auto-hide exempts), close on
  Escape and open from the Menu key at the selected row. Two annotated mockups, a spec table and the behavior, all
  from Editora's `MainMenuBar`, `ContextMenuDismissal`, `RowContextMenu` and `LazyContextMenu`. The checklist gains a
  Menus group and the feature matrix three menu rows.
- **What's new, and a Changelog page.** The overview shows the current edition's changes; the Changelog page lists
  every edition under its own anchor. Both are rendered from `CHANGELOG.md`, so there is nothing to keep in step.
- **Its own domain: [pauta-project.dev](https://pauta-project.dev/).** The old github.io address redirects there.
- **Five more principles**, from what the apps already do: speed comes first; never claim what is not true;
  one source of truth for each fact; separate the decision from the UI, then test it; verify by driving the
  real app. The principles are now thirteen, in two groups: for the people using the apps and for the people
  building them. Code quality gates and the checklist follow.
- **Four rules where they belong.** Settings: *Before adding a setting* (one right answer is not a setting; Modula's
  car-radio test), *never trust a config file* (clamp on read, `.corrupt.bak`), and *Secrets stay out of files*
  (the OS keychain or session-only, no UI for dangerous escape hatches). Window shell: a destructive action asks
  first, its button names the action, and undo beats a question.
- **Principle 3: the UI never waits**, and a **Performance** page behind it: keep the JavaFX application thread
  free (with the generation-guarded background shape every Editora service uses), coalesce hot-path work, bound
  memory, build only the first frame before it paints, and measure. The checklist gains a Performance group.
- **A name and a mark: Pauta.** Spanish for a guideline, and for the ruled lines on writing paper. The mark (three
  periwinkle rules and a teal tick on the family's Ink tile) is the favicon and the site logo; a 1280 × 640 card
  serves shared links. The README, the PDF and the footer carry the name. Sources and how to re-render them are in
  `branding/`.
- **Start from the template.** The New app checklist and Repository documents link to
  [adl-desktop-app-template](https://github.com/adriandeleon/adl-desktop-app-template), a GitHub template
  repository that meets every MUST: a runnable app with its tests, CI and release workflows, and an example of
  every repository document.

### Changed

- **Every content change is an edition.** A change to a page bumps the version and gets its changelog section in the
  same commit; `AGENTS.md` says so and how.
- **The New app checklist can be ticked.** Ticks are kept in the reader's browser, a line above the groups counts
  them, and *Clear ticks* resets them.
- **Principles opens with Editora's keymap picker** instead of repeating the overview's screenshot.
- **The "not found" dot is easier to see**, in dark mode especially: an outline in the muted text color.
- **The README links the new app template** and describes the dot and pill conventions as they now work.
- **Levels read the same everywhere.** MUST, SHOULD and MAY render as the level pill in prose and lists too
  ("**MUST.**", "(SHOULD)"), not only in table cells; on the site and in the PDF.
- **Rule tables stack on a phone.** A table with a Level column turns each row into a card with its level and
  Editora reference visible, instead of scrolling them off screen.
- **The feature matrix keeps its app row in view** while a long table scrolls (wide screens).
- **Screenshot galleries leave no gap.** Galleries are two to a row; with an odd count the first screenshot spans
  the row.
- **The overview is reorganized.** The Editora screenshot sits beside the title, with the edition under the
  actions (side by side from 64rem, so the three actions stay on one row; stacked below that); *Where to start*
  and *How to read it* come before the family, which is now six even tiles with Editora
  marked as the reference.

### Fixed

- **The feature matrix no longer widens the page on a phone.** Each matrix scrolls inside its own box, so the
  header's search and menu stay on screen.
- **A "—" outside the feature matrix stays a dash.** Only matrix cells become status dots; the Homepage column of
  "What the apps are" no longer shows a "No" dot for apps without a homepage. The print build does the same.
- **Template mockups fit the column.** Where a mockup is wider than the text column (Settings Sync and the Command
  Palette at laptop widths), it is scaled down to fit and says by how much, instead of being clipped.

## [1.1.0] - 2026-11-06

### Added

- **Visual templates** for four shared surfaces: the Command Palette, the About window, the Message Log and the
  Settings Sync page. Each has an annotated mockup at the apps' real sizes (light and dark), its anatomy, a spec
  table tied to Editora's code, its behavior, its exact strings, and the real screenshots from the apps.

### Fixed

- **The palette does not rank recently used commands first.** Keyboard first said it did; Editora ranks by match
  score, with a query that names a title first.

## [1.0.0] - 2026-11-06

### Changed

- **JDK 25 and JavaFX 27 are floors, not ceilings.** The platform baseline asks for JDK 25 or newer (an open enforcer
  range) and JavaFX 27 or newer; the badges read 25+ and 27+.
- **Inter is a SHOULD**, not a MUST.
- **Every repository document is a MUST except `TODO.md`**: `CONTRIBUTING.md`, `docs/` and `branding/` join the
  rest. The matrix gains a `CONTRIBUTING.md` row and the gaps table lists who lacks it; Torrenta and Modula are
  marked for committing only `CLAUDE.md`, with no `AGENTS.md`.
- **The checklist is grouped by area**, each group linking to its page, with a hanging indent for wrapped items.
- **The feature matrix fits on the page.** Its page is wider and notes under a dot wrap, so all six columns show
  without scrolling sideways.

### Added

- **First edition of the guidelines.** Principles, platform baseline, repository documents, quality gates,
  keyboard-first interaction, window shell, Settings, diagnostics, command line, internationalization,
  packaging and signing, and a new app checklist — extracted from Editora.
- **The family pages.** A feature matrix of Editora, Torrenta, Termina, Modula, Mirada and nux surveyed from
  each default branch on 2026-11-05, nineteen shared features worth standardizing, and the gaps per app.
- **Screenshots from the apps.** 21 captioned figures across Principles, Platform, Keyboard, Window shell, Settings,
  Diagnostics and Internationalization, and a gallery of the family on the overview. New Editora captures of the
  Settings search, Message Log, Report a Problem and About; the rest come from the apps' websites and READMEs.
  The PDF carries them too, and the single Markdown file links them from the repository.
- **The apps' own icons.** Each app's icon, copied from its `branding/` folder, heads its column in the feature
  matrix, labels its row in the gaps table, captions its screenshot on the overview, and appears in the PDF and
  the README.
- **A Mirada screenshot.** Mirada showing a folder of wallpapers with its info panel and thumbnail strip, on the
  overview and on Window shell beside Termina's title bar.
- **Click a screenshot to see it large.** Every screenshot on a page (and in the overview gallery) opens in a
  full-window viewer with its caption; ← and → step through the page's screenshots, Esc or a click outside closes
  it. Screenshots take keyboard focus and open with Enter or Space.
- **Install methods.** Packaging, signing and release covers Homebrew (a cask in `adriandeleon/homebrew-tap`) and
  winget (`AdrianDeLeon.<App>`) beside the GitHub release downloads, with what each needs and where each app
  stands.
- **CI/CD for GitHub Actions** as a table of the three workflows and the rules every workflow follows, and as its
  own group in the checklist.
- **The six languages, as a floor.** Internationalization lists them, says apps should add more, and what a new
  language takes (CJK font fallback, right-to-left orientation).
- **Homepage and GitHub links** for every app on the overview and the feature matrix.
- **Repository documents screenshots**: Editora's repository root and the top of its README on GitHub.
- **Web version on GitHub Pages** with search, light and dark themes, and PDF and single-Markdown downloads built
  in the same workflow.

[Unreleased]: https://github.com/adriandeleon/adl-desktop-apps-guidelines/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/adriandeleon/adl-desktop-apps-guidelines/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/adriandeleon/adl-desktop-apps-guidelines/releases/tag/v1.0.0
