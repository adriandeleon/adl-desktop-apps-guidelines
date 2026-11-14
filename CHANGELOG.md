# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and editions are numbered as the [Changelog page](https://pauta-project.dev/latest/changelog/) says: a patch asks
nothing of an app, a minor asks it to add, a major asks it to undo or redo.

## [Unreleased]

### Changed

- **MENU-14 goes from MUST to MAY.** A menu row may carry an icon where a glyph depicts what it does or names; a
  row with no fitting glyph goes without one rather than borrow another command's, and the icon column stays on
  every row so the titles line up. An app no longer has to draw or invent a glyph for every row, so Editora's
  `MenuBarIconsTest`, which holds that a command without a fitting glyph gets none, now describes a conforming app.
  The checklist line drops MENU-14, *Gaps per app* drops the missing icons of Editora, Torrenta, Termina, Modula and
  nux, the menus page's spec, anatomy and captions no longer call a row without an icon a defect, and the
  conformance page, the *Coding agents and LLMs* page and the audit skill take MENU-15 for their example of a
  `pending` MUST.

## [6.0.1] - 2026-11-11

A patch: an app built to 6.0.0 does nothing to move to it. Every page now opens with a short paragraph saying what it
covers, and the References follow the app template, now Complete, and Editora to the code they describe. One
statement changed: WIN-10, a MAY, says Expert mode keeps only the status bar, as Editora's now does; a MAY obliges no
app, so it is fixed here as a fact about Editora. Still 405 rules, none added, retired or re-leveled.

### Changed

- **Every page opens by saying what it covers.** Platform baseline, Repository documents, Code quality gates,
  Keyboard first, Window shell, Settings, Diagnostics and support, Command line and launch, Internationalization and
  Packaging, signing and release now open with a short paragraph before their rules: what the page is about, why the
  apps share it, and which page holds what it leaves out. The New app checklist and Same on every OS gain a sentence
  each. No rule changed.

### Fixed

- **The app template's References follow it to 6.0.0.** The template now meets every MUST of 6.0.0 (Core), and the
  pages described it as it was before: no `app-only` kind, `template` field or `checked` list, no audit report, no UI
  zoom, no Settings or About in the macOS application menu, stock dialog buttons in JavaFX's order, `os.name` read in
  several classes, a find bar over its Debug Log alone (`DebugLogFindBar.java`, now `FindBar.java`), a fixed `Ctrl+G`,
  and the rest. The References of PAUTA-02, PAUTA-04, PAUTA-05, PAUTA-10, PAUTA-16, PAUTA-17, PAUTA-18, PWIN-05,
  OS-02, OS-03, OS-04, WIN-11, WIN-12, WIN-15, ACC-01, ACC-04, ACC-08, KBD-15, KBD-22, MENU-05, MENU-14, MENU-15,
  MENU-16, MENU-18, ABOUT-01, ABOUT-07, CONF-13, CONF-14, FIND-01, FIND-02, FIND-04 to FIND-07, FIND-16, PAL-07,
  QOPEN-07, MLOG-03, MLOG-04, ICON-08, ICON-09, ICON-14, TBAR-14, TABS-08, TABS-10, PERF-01, PERF-16, SET-07,
  SET-09, SET-22, CLI-05, CLI-11, CLI-12, CLI-13, INTL-14, PLAT-11, REL-25 and REPO-01 say what its code at its head
  does, and the Pauta window's catalog note, the README badge note and *Gaps per app* follow. No rule changed.
- **And to Complete.** The template then met every SHOULD too (its PR 38), and the References of the 35 rules it
  had pending say so: ACC-05, ACC-06, ACC-09, CLI-10, DIAG-07, FIND-05, FIND-09, ICON-14, KBD-04, KBD-06, KBD-10,
  MENU-12, PAL-06, PAL-08, PAL-09, PERF-09, PERF-10, PERF-17, PERF-19, PERF-20, QOPEN-02, QOPEN-04, QOPEN-06,
  QOPEN-12, QUAL-13, REL-17 (the signing step, waiting for a certificate), SET-08, SET-18, SET-20, WELC-03, WELC-04,
  WELC-05, WELC-11, WIN-08 and WIN-09. PAUTA-04, PAUTA-07, ABOUT-07, OS-04, WIN-12, SET-09, SET-22, the palette's
  ranking row and the README badge note follow it from Core to Complete.
- **Editora's References follow it to its head.** Editora moved on after 6.0.0 pinned it, and the pages said what
  it no longer does. Its right-click menus now show chords in the editor's, the tabs', the previews' and the output
  consoles' menus (`MenuChords`), so MENU-15's Reference and *Gaps per app* say which do and that the rest still
  don't, a Project Map card's among them. Its Expert mode now hides the menu bar too, so WIN-10's statement says
  Expert keeps only the status bar, and its Reference follows. QUAL-06 counts 38 untagged `*FxTest` classes, not 33;
  ICON-07 counts 79 component declarations that name a role, not 78, and ICON-08 lists `.debug-menu-logpoint`
  among the fixed hexes; the Quick open template's uses add breakpoint groups and loaded sources and modules.
  Every other Editora class, method, test, key and file the pages cite still exists and does what they say.

## [6.0.0] - 2026-11-10

Three reviews of 5.0.0 and a confirmation pass land as one edition. A rule about something an app lacks now says which
apps it covers, a test is part of a requirement only where the statement says "A test holds it", and an audit has a
result for what it cannot see from the app's checkout, so the same rule gives the same verdict in an app unlike Editora.
28 new rules, 17 of them MUSTs, among them a UI zoom (WIN-12), one quit method and a Quit in every app (WIN-13, WIN-14),
a default button that is never the red one (CONF-13), every dialog's buttons worded from the catalog (CONF-14), nothing
that differs by OS outside the table that allows it (OS-04) and an unknown command-line option refused (CLI-12);
ICON-09 and REL-20 raised to MUSTs, PLAT-02 and QUAL-05 lowered to SHOULDs; five rules retired. A major because it asks
an app that met 5.0.0 to redo work: dialog buttons in one order with Cancel on the left, keys read from the active
keymap, tooltips that name a command by its title, and the rest of the first list below. *Gaps per app* was rebuilt
from audits of every app, and `changed` on each rule in `rules.json` says which rules to read again.

One entry per rule, grouped by page, in four parts: Added, Changed, Removed, Fixed. Changed holds every rule that asks
something else than it did in 5.0.0; Fixed holds what changed without changing what a rule asks. Since 5.0.0 the guide
went from 382 rules to 405 (195 MUST, 201 SHOULD, 9 MAY): 28 are new, 17 of them MUSTs; five are retired; PLAT-02 and
QUAL-05 went from MUST to SHOULD, ICON-09 and REL-20 from SHOULD to MUST.

**What an app that met 5.0.0 must redo.** This is what makes the batch a major:

- Dialog buttons: one order on every OS, Cancel to the left of every action, and Cancel, Save, Discard where saving
  is an option (WIN-11, CONF-05).
- Keys read from the active keymap, not fixed in code: the line, page and cancel keys of the palette, the pickers and
  the Message Log (PAL-06, PAL-07, QOPEN-07, MLOG-03), and a find command that finds the next match while its bar is
  open (FIND-04).
- Tooltips and names: a tooltip names its command by the command's title, and an icon-only button's accessible name
  carries the chord as its tooltip does, stripe buttons included (TBAR-03, TBAR-01, TBAR-12). The palette no longer
  matches a command's description (KBD-06).
- Contrast tests: the test for readable text walks every rule of the stylesheets, and every contrast test reads the
  stylesheets without starting the toolkit (ICON-09, ICON-14).
- Launch and config: `--config-dir` wins over `--dev` and `--dev` over the config-folder variable, with the default
  folder in the user's home on every OS (SET-07); `--report` writes its file in the current folder (CLI-05);
  `--minimized` with the tray off starts the window minimized (TRAY-05); the Linux tray has no AWT fallback (TRAY-01).
- Build: no enforcer rule refuses a JDK newer than 25, in the main build or in a profile that turns itself on (PLAT-01);
  the format check is a job of its own (PLAT-10); no profile that activates by OS or by JDK version lowers a coverage
  floor or skips the check (PLAT-12); release notes are written for users, not generated from the commits (DOCS-05).

**What it must add.** The new MUSTs: OS-04, PAUTA-18 (only for an app that records by-hand checks), PERF-23, WIN-12,
WIN-13, WIN-14, SET-22, DIAG-11, DIAG-12, DIAG-13, CLI-12, INTL-14, CONF-13, CONF-14 (every button of a dialog with two
or more buttons worded from the catalog, a text prompt and a form included, which 5.0.0 said of a confirmation, in a
Spec table only), FIND-16, REL-30 and REL-31 (the `concurrency` group of a pull-request workflow, split out of REL-26),
with ICON-09 and REL-20 raised to MUST. Existing MUSTs that ask more: a find bar in the Debug Log window and a filter
over every log shown as a list (FIND-01, FIND-03); the Escape that closes a find bar over a terminal kept from the shell
(FIND-07); of a find bar's controls, only those FIND-16 names out of the Tab order (KBD-15); a theme setting that offers
"follow the system" (ICON-16); no fixed color of any spelling in a component rule, the `rgba()` of a scrim or a shadow
included, where 5.0.0 said "fixed hex" (ICON-08); a status bar shown by default (WIN-01); `Ctrl+Shift+P` and `Ctrl+,` in
an app with one key table (KBD-05, SET-01) and a terminal keymap's macOS file held to the same limit (KBD-09); every
toolbar's commands in the menus (TBAR-08); a `tool.<id>` command and its Emacs chord for every tool panel (TABS-13);
every right-click action a command, a right-click menu on a log shown as text, the Debug Log's among them, and the Menu
key opening the focused view's menu (MENU-05, MENU-09); the Tabs rules held of every tab of the main window's strip, a
viewer's as much as an editor's (TABS-01, TABS-02, TABS-06); About's links named, the home page, the source code and the
releases, where 5.0.0 said "links" (ABOUT-02); no page with a section for the app's user in `docs/`, where 5.0.0 said
no second copy (DOCS-02); everything the first window does not show built on first use, the dialogs and the other
windows included (PERF-14); a setting that waits for a restart saying so on its row (SET-04); a schema version in every
config file (SET-09); a secret held in memory, its Settings row saying so, when no keychain answers (SET-13); a case in
the test of `pauta.json` for each failure of a `checked` entry (PAUTA-10); the refusal of an unknown option printed in
the Windows console too (CLI-11); the status line saying why no tray icon came up and that closing the window quits
(TRAY-02); no notification for an event whose window or tab is the one in front (TRAY-10); an update check that starts
at least three seconds after the first frame and a notifier call that times out after ten seconds or less, where 5.0.0
said "a few seconds" for both (DIAG-05, TRAY-09).

**What it may drop.** A rule about something an app does not have now says so: 83 rules sit under an *Applies to*
line, against 25, and more name their apps in their own words, so the `not-applicable` entries for them go. A test is
part of a requirement only where the statement says "A test holds it": 72 rules are now checked by reading the code. A
class, method, style class, CSS file, branch, workflow or job name in a statement is Editora's spelling, not a
requirement. The `checked` list in `pauta.json` is the app's to keep or not.

### Added

#### Reading a rule

- **`changed` on every rule.** In `rules.json` each rule carries `changed`: the edition in which its level, its scope
  (`appliesTo`) or its statement last changed, 2.0.0 at the earliest. A rule's Why, Check, Command and Reference can
  change without moving it; any edit to the statement's words moves it. An app moving to a newer edition reads again the
  rules whose `changed` is newer than its own edition. Editions up to 5.0.0 don't have the field. The record behind it
  is `rule-changes.json` at the repository's root, which a release rewrites.

#### Auditing an app

- **A status for what an audit cannot reach.** `not-checked` is for a Check that reads what the app's checkout does not
  hold: the website's repository (DOCS-01 to DOCS-04, PAUTA-13, PAUTA-14), or what GitHub keeps and no file shows (the
  status checks REL-19 has the default branch require, the issue behind a `pending` entry in PAUTA-07). Such a Check
  says so. The audit judges the part the checkout holds first, and that part can fail the rule: an app whose repository
  and About name no website for its user docs fails DOCS-01, DOCS-02 and PAUTA-13 from the checkout, and `not-checked`
  is only for an app that names one. The audit reads the rest when it can (the website checked out beside the app as
  `../<app>-website`, `gh` signed in), and reports `not-checked` with what would settle it when it can't. ABOUT-07 gets
  the status too, in an audit run against an edition other than the one the app names. It is not a finding and not a
  pass, needs no exception and blocks no release.
- **By-hand checks, read back.** A `manual` result carries the rule's entry from the `checked` list of the app's
  `pauta.json` (PAUTA-18) when there is one: the edition it was checked against, the date, and the app's version where
  recorded. With no entry its evidence ends "not recorded", which is not a failure and needs no exception. An entry
  whose edition is older than the rule's `changed` is stale, and the report says so as a problem. The audit never writes
  an entry: that is for the person who checked the rule in the running app. A by-hand Check that sends the person
  somewhere other than the running app, to the repository's merged pull requests (DOCS-16, PERF-18, PERF-22) or to break
  a test and watch it fail (QUAL-10), is `manual` like the rest, never `not-checked`.
- **Two rules judged last.** PAUTA-04 and ABOUT-07 have the audit itself as their Check. The skill judges them after
  every other rule in scope, from those results; a `manual` or `not-checked` result fails neither, and an audit of part
  of the edition says it judged them from the rules in its scope. Only the rules of the edition the app names settle an
  About that says *Built to*: an audit run against another edition reports ABOUT-07 as `not-checked` and names the
  edition whose rules would settle it, and an About that says *Working toward* passes whatever edition was audited. Both
  were checked by hand in 5.0.0.

#### Editions and Pauta Next

- **Pauta Next, at `next/`.** While changes wait under *Unreleased*, the site serves them at
  `https://pauta-project.dev/next/`, built from `master` on every deploy: the pages, the agent files, the Markdown
  download and the PDF, with the waiting changes under *What's new* on its overview. It is not an edition: it has no
  number or date, is never tagged or archived, is kept out of search engines, and links the apps' code at their default
  branches where an edition links pinned commits. The edition switcher and `versions.json` list `next` while it exists;
  with nothing waiting, every address under `next/` redirects to `latest/`.
- **Every file of `next/` says what it is.** Each page opens with a notice, written into the page's own HTML so an agent
  that fetches the page reads it: never cite a rule from Pauta Next or audit an app against it. `llms.txt`,
  `llms-full.txt`, each `<page>.md`, `changelog.md`, the audit skill, both schemas, the Markdown download and the PDF's
  cover carry the same notice, and `rules.json` has it in a `next` field. In `next/` a rule new or changed since the
  last edition has `"changed": "next"`.

#### Same on every OS

- **OS-04 · MUST.** No behavior or layout of an app differs by OS: what a command, a key or a click does, where a
  control sits and how a window is drawn are the same on Windows, macOS and Linux, except where a row of the table
  *Where the OS's way wins* gives the difference. OS-01 covers only whether a command, setting or window exists, and its
  default. A place that gives an OS something other than what its row gives is judged by the rule that row links, where
  that rule covers it: nux's Windows notification, a tray balloon and not a toast, fails TRAY-09 and not this rule. No
  app has been read through for it. Found so far: Mirada closes its window on Escape on Linux only, follows the OS's
  accent color on macOS and Windows only, puts its title on the left on Windows only and has a menu bar on macOS only;
  Editora deletes a file for good on Windows, keeps the user's key bindings apart by OS and registers its WSL targets on
  Windows only; Termina believes the folder a shell reports for itself on Windows only, and its Settings Sync keeps the
  user's key bindings in one file for macOS and another for Windows and Linux.

#### Conformance

- **PAUTA-18 · MUST.** `pauta.json` may hold a `checked` list, the record of the rules a person checked by hand in the
  running app and found met: each entry has the `rule`, the `edition` it was checked against and the `date`, and may
  have the app's `version`. The rule governs only the entries an app records, so an app with no list, or an empty one,
  meets it. An entry names a rule whose check is by hand, never one that has an exception, and is stale when its
  `edition` is older than the rule's `changed` in `rules.json`: the app's test (PAUTA-10) fails it until it is removed
  and the rule checked again. No app records a by-hand check yet, so each meets the rule.

#### Repository documents

- **REPO-11 · SHOULD.** Every script in `scripts/` is a Java source file the JDK runs as it is (`java
  scripts/Name.java`) or an `sh` or bash script, so building and releasing an app needs no second toolchain. Data files
  beside the scripts are not scripts. Editora meets it; Mirada, Modula and Torrenta each have Python scripts.

#### Performance

- **PERF-23 · MUST.** Split out of PERF-06: work driven by text the user types waits for typing to pause when it leaves
  the FX thread or cannot finish within a frame, such as a search of files, a request to a server or a re-highlight.
  Filtering a list already in memory, as a command palette does, is exempt and runs on every keystroke, where PERF-06's
  Check sent every listener on text through a debounce. Editora's searches and its editor meet it; its debugger's
  completion (`ui/DebugCompletion.java`) and `ui/FileFinder.java` do not yet.

#### Keyboard first

- **KBD-22 · SHOULD.** The focus ring is 2 px wide at the default zoom and sits just outside the control with a 1 px
  gap, as a border with negative insets, so focusing a control never moves the layout. A text field and a control flush
  with the window's edge draw it inside, at the same 2 px. Editora, Termina and Mirada already draw it this way; the app
  template sets the ring's color only, so its ring is the theme's 1 px border.

#### Window shell

- **WIN-12 · MUST.** The app has a UI zoom: one setting scales the whole chrome (menus, toolbar, tabs, status bar),
  applies at once and is kept across launches, and three commands, with ids of the app's own, zoom it in, out and back
  to the default. In an app with content to zoom, `Ctrl+=`, `Ctrl+-` and `Ctrl+0` (`Cmd` on macOS) stay with the content
  zoom and the UI zoom's commands have no fixed chord; in an app without, those chords are the UI zoom's. This was the
  UI half of WIN-09, a SHOULD; no app has a UI zoom yet.
- **WIN-13 · MUST.** Every quit entry point an app has runs one quit method: the Quit row, the `app.quit` command and
  the system's own Quit, which on macOS is the application menu's and the Dock's; the method asks what CONF-01 requires,
  closes open dialogs and runs the save that closing the window runs. TRAY-04 asked this of tray apps only, and keeps
  the tray's Quit. The app template and Mirada meet it; macOS's Quit does not reach the quit method of Editora,
  Torrenta, Modula or nux, and Termina, with several windows, has no quit method.
- **WIN-14 · MUST.** Every app has a Quit on every OS: the `app.quit` command, listed in the Command Palette, and, where
  the app has a File menu or a main menu (a menu button that holds the app's commands as a menu bar would, such as
  Mirada's ☰), a Quit row in that menu that runs the command. An app with neither menu meets the rule with the command
  alone, and closing the last window is never the only way out. The app template, Editora and nux meet it; Torrenta has
  the row but registers the command as `quit`, Termina and Mirada have no Quit, and Modula quits only from its tray and
  its window's close button. The six rules that lean on a Help submenu of the app's main menu (DIAG-10, DOCS-06 to
  DOCS-08, ABOUT-01, PWIN-01) link WIN-14 for what a main menu is.
- **WIN-15 · SHOULD.** On macOS, Settings is in the application menu and runs the same command as the Settings row on
  Windows and Linux. Its title carries the chord the active keymap binds to that command, and the item gets no key
  equivalent of its own. No app meets it yet: Mirada has the item, with a fixed `Cmd+,` key equivalent, Termina adds
  About only, and the other apps add nothing to that menu.

#### Toolbars and tooltips

- **TBAR-14 · SHOULD.** Every tooltip shows after the same 400 ms delay, set in one place: the factory that makes the
  app's tooltips, or the stylesheet's `.tooltip` rule. No app meets it yet: Termina is nearest, with one tooltip that
  sets no delay; Editora sets 300, 350 or 400 ms on some and Mirada 250 ms on one; the app template, Torrenta, Modula
  and nux set none.
- **TBAR-15 · SHOULD.** The first of five rules in a new section, *The main toolbar*, for an app whose toolbar is a band
  of its own across the top of the main window: Editora's and Torrenta's `ToolBar`, not Mirada's header buttons or nux's
  bar of labeled buttons. The icon cluster and the pinned tail (Settings and the other controls the user must always
  reach) are separate containers, so a narrow window overflows the cluster's icons and the tail keeps every control.
  Editora meets it; Torrenta keeps Simple mode and Settings inside its `ToolBar`, where they are the first to overflow.
- **TBAR-16 · SHOULD.** In an app with a main toolbar, Settings closes the bar at its right end, with the Simple mode
  toggle just before it where the app has Simple mode, whether the mode is on or off. Editora and Torrenta meet it.
- **TBAR-17 · SHOULD.** A main toolbar button is disabled while its command can't act (Save on a saved file, Undo with
  nothing to undo), and the events that change that state update it; nothing polls. Torrenta binds each button to its
  command's state; Editora refreshes its built-in buttons, and the ones added from its catalog stay enabled.
- **TBAR-18 · SHOULD.** A command hides the main toolbar and shows it again, and the choice is kept across launches.
  Editora (`view.toggleToolbar`) and Torrenta (`toggle-toolbar`) have it.
- **TBAR-19 · SHOULD.** The main toolbar keeps its height when a control in it hides or shows, so the tabs and the
  content under it never move. Editora pins the row's minimum height to its project switcher's.

#### Menus

- **MENU-18 · SHOULD.** The menu row's metrics, which 5.0.0 kept in a table: at the default zoom a row is 34 px
  high, its icon column 22 px wide with 8 px to the title, and its chord starts at least 18 px after the title; the
  popup's card has a radius of 8 and a shadow of radius 16 whose offset is at least its radius. Only Editora draws
  that card. Termina, Torrenta and the template have the row's padding and keep their themes' popup (radius 4, a
  shadow at offset 2), the template with an 18 px icon column and a 16 px chord margin; Mirada and nux take their
  AtlantaFX theme's popup, and Modula draws its own (rows of 4 × 8, a shadow of radius 20 at offset 6).

#### Settings

- **SET-22 · MUST.** A config file is written whole or not at all: to a temporary file beside it, then moved into place.
  A config file is any file the app writes as a whole and reads back as its state (the settings, the session state, a
  store of bookmarks or presets, what a sync engine keeps beside its clone). Three kinds of file are not one: a file the
  app only appends to, a file in a sync clone's working tree, and a file the app writes for one run and deletes at exit,
  such as one that tells another process where this run listens (Editora's `mcp-endpoint.json`). Every app's settings
  store already does it. The template writes its configuration import and its `sync/base.json` in place.

#### Diagnostics and support

- **DIAG-11 · MUST.** The problem report is redacted before it is shown: home paths, user names, e-mail addresses,
  credentials and tokens are replaced. Split out of DIAG-06. The five apps with a report (Editora, Termina,
  Torrenta, Mirada and the template) all do it, each with a test.
- **DIAG-12 · MUST.** The Report a Problem window shows the report in a field the user can edit, and its submit action
  copies the report as edited to the clipboard and opens a GitHub issue prefilled from `bug_report.yml`; nothing is
  uploaded. Split out of DIAG-06. The same five apps do it. They differ in one thing the rule does not ask: only Termina
  sends its environment block as the user left it, and the other four fill the form's environment field from the block
  as the app built it.
- **DIAG-13 · MUST.** When the prefilled issue link would be longer than 7,500 characters, the report stays out of
  it and the form's report field asks the user to paste from the clipboard. Split out of DIAG-06, which said "about
  7,500". Editora, Torrenta, Mirada and the template do it at that limit. Termina has the limit but leaves the
  form's field empty, with the hint only in its own window.

#### Command line and launch

- **CLI-12 · MUST.** An option the app does not know, with one dash or two, stops the launch: the app names it on
  standard error, says how to get help and exits with status 2 before the GUI starts. In an app that opens files
  named on its command line, a lone `-` and everything after `--` are files. The JVM options a launcher can leave
  among the arguments (`--add-exports`, `--add-opens`, `-p`) are skipped with their values, in the `=` form too.
  No app does all of it: the template, Termina and Torrenta refuse the launcher's options with the rest, Torrenta
  refuses `-` and `--` as well, Mirada takes a single-dash option for a file, Editora skips every unknown option
  without a word, nux ignores all arguments but two, and Modula reads none.
- **CLI-13 · SHOULD.** The short flags are the same in every app: `-h` for `--help`, and both `-v` and `-V` for
  `--version`. Termina and Torrenta take all three. Editora lacks `-v`, the template lacks `-V`, Mirada has no
  short flags, and Modula and nux take neither flag in any form.

#### Internationalization

- **INTL-14 · MUST.** The app starts in the language the user chose in its settings, else in the system's language when
  it ships a catalog for it, else in English. The locale that formats dates and numbers keeps the system's region (the
  bare language only when the chosen language is not the system's own). That locale is the JVM's default once the app
  has started: the app sets it wherever it is not the locale the JVM started with, and the message catalog formats its
  values with it. Termina meets it, with a test, and so does Modula, which offers no language choice and leaves the
  JVM's locale as the system set it. Torrenta's and Mirada's catalogs format with the bare language, Editora and Mirada
  set the bare language as the default, nux sets bare English when it has no catalog for the system's language, and the
  template never sets the default and formats its messages with the bare language.

#### Confirm dialog

- **CONF-13 · MUST.** In an app that asks before a destructive action, every such question has one default button, and
  it is never the red one: Cancel where the only action is destructive, Save where saving is an option. The dialog opens
  with keyboard focus on it, so Enter in a question that has just opened destroys nothing, on every OS. The Check asks
  that Cancel, or Save, is made the default button and the destructive action's default is unset, both before the dialog
  is shown: JavaFX gives the opening focus to the one default button. Termina's close-running-program question and nux's
  risky-command question meet it, as do about twenty of Editora's, each set by hand. Editora's Git confirmations and
  Local History purges, Torrenta's `RemoveConfirm`, Mirada's `Confirm`, the app template's `Confirm` and Termina's
  removals and its Import configuration leave the red action as the default; Torrenta's four Settings questions leave OK
  as the default, and so do the questions of Editora's that keep the stock OK, its delete to the trash, Revert and Save
  As overwrite among them; and Editora's unsaved-changes and Quit questions have no default button.
- **CONF-14 · MUST.** Every dialog with two or more buttons words each button from the message catalog, never with
  JavaFX's stock OK, Yes, No, Cancel, Apply or Close, which are worded in the JVM's locale. That is every JavaFX
  `Dialog` the app shows: a question, before a destructive action or not, a text prompt, a pick from a list, a form.
  Only a message with one button is outside. 5.0.0 said it of a confirmation, in the Confirm dialog's Spec table only;
  CONF-03 keeps the verb in red. A button whose text is set from the catalog before the dialog is shown passes, and so
  does a dialog whose stock buttons are swapped for catalog-worded ones. Torrenta meets it, its text prompts and picks
  included, and Modula, whose one dialog is a message with one button, has nothing to judge. Termina, Mirada and the
  template meet it in their questions and not in their text prompts: Termina's Rename Tab keeps the stock Cancel, and
  the prompt of its setting commands and Create on GitHub the stock OK and Cancel; Mirada's Rename prompt keeps the
  stock pair; so do the template's prompts, and its Report a Problem form keeps a stock Cancel. Editora does not: 26 of
  its 64 `CONFIRMATION` alerts keep the stock OK and Cancel, 22 more, the helper of its Git confirmations among them,
  name the action beside a stock Cancel, its warnings that ask do the same (its four trust questions, and the question
  before its MCP server is enabled), and so do its prompts and forms. Nor does nux, in any of its four dialogs of two
  buttons: the question before a risky command names Run beside a stock Cancel, and the question before a harmless
  command, the credentials form and the Save Profile prompt keep the stock OK and Cancel.

#### Find bar

- **FIND-16 · MUST.** A control of a find bar or of a filter box leaves the Tab order only when the keyboard does its
  work another way: a registered command, or a key the bar's own field handles. So Next, Previous and Close may leave it
  (Enter, Shift+Enter and Escape in the field do the same), and so may a field's clear button. An option's toggle (match
  case, whole word, regular expression) stays in it unless a command toggles the option, in a terminal's bar as in any
  other. An app with no find bar and no filter box has no such control and passes. Termina's regex toggle, out of the
  Tab order with no command, does not meet it yet, and fails KBD-15 with it.

#### Packaging, signing and release

- **REL-30 · MUST.** A release is cut only from a commit whose tests passed: the release workflow runs the suite before
  it builds the installers, or a preflight job reads CI's result for the tagged commit and stops when it is not green.
  All seven release workflows meet it: Editora's and Torrenta's read CI, and the template's, Termina's, Mirada's,
  Modula's and nux's run the suite.
- **REL-31 · MUST.** Every workflow that runs on pull requests has a `concurrency` group that cancels a superseded
  pull-request run, and never a run on the default branch, whatever starts it: a push, a schedule, or a run started by
  hand. The requirement was half of REL-26 in 5.0.0, whose Check passed a workflow with no group; REL-26 keeps the
  timeouts. The template, Termina and Mirada meet it, and so do Editora's `ci.yml` and `full-tests.yml`. Editora's third
  pull-request workflow, `terminal-image.yml`, does not: its `cancel-in-progress` is plain true and it can be started by
  hand, so a second run started on `master` cancels the first. Modula's `build.yml` and nux's `ci.yml` have no group,
  and Torrenta's `ci.yml` cancels its pushes to `master` too.

### Changed

#### Reading a rule

- **Which names in a statement are required as spelled.** A command id, a catalog key, a chord, a command-line flag, an
  environment variable, a property in `pom.xml` or `pauta.json`, and a file the repository must carry: a document at its
  root, or a resource or tool configuration the rule names (`AGENTS.md`, `emacs.json`, `messages_<code>.properties`,
  `jreleaser.yml`). A user, the docs or another tool finds the thing by that name, so the same thing under another name
  fails the rule. A platform API a statement names (`javafx.stage.Popup`, `SystemTray`, `Future.get()`) is the
  requirement itself. Every other name is Editora's spelling, and an app's equivalent meets the rule: a class, method or
  constant of the app's own code, a CSS file or style class, a branch or workflow file, a file the app writes as it runs
  (its config files), and any name that only a Check or a Reference gives. 5.0.0's list was "a command id, catalog key,
  file, property or style class": a style class, a stylesheet's name, a config file's name and the default branch's name
  are no longer required as spelled, and chords, flags and environment variables are on the list by name. The Coding
  agents page, `llms.txt` and the audit skill state the same list.
- **A rule about a feature covers the apps that have it.** 83 rules sit under an *Applies to* line, 25 in 5.0.0: the
  sections on the menu bar, right-click menus, tabs, tool panels, tool window stripes, the toolbar, the main toolbar,
  the QuickOpen picker and Settings Sync now open with one, and most say what counts as the feature (a right-click menu,
  tabs, a tool panel, a toolbar, a picker). Other rules name the apps they cover in their own words ("An app that stores
  a secret…"). An app outside a rule's scope gets `limited` and owes no exception; a `pauta.json` entry for such a rule
  is a problem to remove (PAUTA-05). 28 of the app template's 44 `not-applicable` entries are for rules that gained an
  *Applies to* line. A scope is written in the statement, in an *Applies to* line or in the rule it details, and nowhere
  else: an audit never infers one from what the app lacks.
- **A test is required only where the statement asks for one.** 13 rules have a `Check (test)`, 87 in 5.0.0. Five end "A
  test holds it." (ACC-01, ICON-09 to ICON-12) and eight name the test in their own words (OS-03, PAUTA-10, QUAL-04,
  QUAL-11, QUAL-13, QUAL-15, PERF-21, ICON-23). 72 rules whose Check was a named test are now checked by reading the
  code: the Check describes the behavior to find and may end "A test that asserts it is the surest evidence", and an app
  without that test still meets the rule. An app that met 5.0.0 does nothing; an app that failed one of these rules only
  for the missing test now meets it.
- **Each statement reads alone.** An agent gets one rule from `rules.json` with no page around it, so a statement opens
  with its subject ("The Pauta window reads…", never "It reads…"), the seven rules that depend on a Help menu say "where
  the app has a Help menu", and no statement, Why, Check or Reference points at "the table above": it says what it means
  or links the section. Where a statement or a Check links a section of its own page, as OS-01 and OS-04 link the table
  of allowed differences, the audit skill reads that section before it judges the rule. A statement reworded for this
  alone asks nothing new.

#### Auditing an app

- **A by-hand rule can fail on the source.** The source cannot confirm a rule checked by hand, so an audit never passes
  one, but it can refute one: where the feature isn't there at all, or the code plainly does otherwise (a Settings
  window built as a `TabPane` with no search field has no sidebar of pages), the rule is `fail`, with the `file:line`. A
  by-hand rule the app's `pauta.json` lists as an exception gets that kind, not `manual`. Only what the source leaves
  open is `manual`. 39 rules are checked by hand, 43 in 5.0.0.
- **Each rule is judged on its own words.** One defect that breaks two rules fails both, each with its evidence: a
  button that no command reaches and that is also out of the Tab order fails KBD-01 and KBD-15.
- **What a rule gets when the app has nothing of its subject.** The rule's own Check comes first: where it says what an
  app without the thing gets ("fails with FIND-01", "is outside the rule"), that is the answer. Otherwise the skill
  takes the first of these that fits. The rule is limited and the app is outside it: `limited`. The rule says how a part
  behaves that another rule requires (the Debug Log's find bar, the Pauta window, the keymap files, About's edition
  link): it fails with the rule that requires the part, and its evidence names that rule, so one missing part reads as
  one cause. A rule worded as a limit on every item of a kind belongs here whenever some rule requires the app to have
  one: KBD-21 fails with KBD-09, ABOUT-06 with ABOUT-05. The rule constrains things no rule requires an app to have
  ("every `deviation` entry names a SHOULD"): with none of them it passes, which 5.0.0 did not say. Anything else is
  `fail`, and the fix is a `not-applicable` entry. An app with no `pauta.json` at all fails PAUTA-01 and PAUTA-09, and
  passes the rules about entries it does not have.
- **A search inside a Check is not a Command.** A `grep` written in a Check's own sentence, as in PERF-01 and OS-04,
  lists candidate lines for the auditor to judge one by one, and its exit code is no verdict; only a `*Command:*`
  settles a rule by its exit code. Where the candidates are too many to read, the evidence says how far the audit read,
  and the rule fails only on a violation found and cited.
- **Twelve Commands, as in 5.0.0.** A `*Command:*` is one POSIX `sh -c` command, run from the app's repository root,
  that exits 0 when the whole Check passes and prints what it found when it fails; the auditor still reads the rule and
  cites the `file:line`. REPO-11, a new rule, has one, KBD-09 lost its, and seven of the other eleven were rewritten
  (OS-02, PLAT-01, PLAT-09, PLAT-10, PLAT-13, KBD-10, REL-22).
- **The report and its schemas.** The Markdown report has a `not-checked` column and a *Not checked* section, its
  *Manual checks* give each rule's recorded edition and date or "not recorded", and it closes by offering to settle the
  `not-checked` rules that a checked-out website or `gh` would reach. In `audit.schema.json` a result's status may be
  `not-checked`, a `manual` result may carry `checked` (`edition`, `date`, optional `version`), and `problem` covers a
  stale `checked` entry and one for a rule that also has an exception. In `rules.schema.json` every rule requires
  `changed`.
- **The skill is the edition's own.** Audit with the copy of the skill the app's edition serves, and replace an app's
  own copy (`.claude/skills/pauta-audit/`) when the app moves to a newer edition (PAUTA-11). That copy decides how to
  audit and how to write the report, `rules.json` supplies the rules, and where an edition's `llms.txt` says it
  differently the skill wins. For an app on 5.0.0 the skill judges names by 5.0.0's list.

#### Editions and Pauta Next

- **The current edition while a batch waits.** Every push to `master` now deploys. With changes waiting, `latest/` and
  `<version>/` are built from the last commit before the batch began (the release commit, or a later one that changed
  only the site) with the current build scripts, and `master` goes to `next/`. A fix to how the PDF or the Markdown
  download is made reaches the current edition at once. Its pages and agent files stay as released: a fix to them made
  once a batch waits shows in `next/` at once and in an edition at the next release. In 5.0.0 a push made while a batch
  waited deployed nothing, unless the current edition was not live yet.
- **The Markdown download reads as the pages' Markdown does.** Each mockup in `adl-desktop-apps-guidelines.md` is a
  sentence saying what it shows, its numbered parts a list, as in `<page>.md`. It was the mockup's HTML.
- **PDFs of the two newest editions.** The site serves the PDF of the two newest editions; an older edition's overview
  links its PDF on the `versions` branch on GitHub.

#### The family pages and the checklist

- **New app checklist.** 143 lines, 118 in 5.0.0, 26 of them marked SHOULD. Every new MUST and every new SHOULD has a
  line, the lines follow the four level changes (PLAT-02 and QUAL-05 on lines marked SHOULD, ICON-09 on a MUST line with
  ICON-14 on a SHOULD line of its own, REL-20 unmarked), the retired IDs are gone, and a line about a feature says which
  apps it covers ("In an app with a menu bar…").
- **Coding agents and LLMs.** The page states the names list, shows a rule with `changed`, has the `not-checked` status
  and the `checked` list in its table, sample report and reading notes, and gives the move to a newer edition as four
  steps: replace `pauta-rules.json` and the app's copy of the skill, remove the `checked` entries the new edition makes
  stale, meet or record each new MUST and audit again, then change `pauta.version`, `AGENTS.md` and the README together.
- **Principles.** Principle 5, the UI never waits, names the two exceptions PERF-01 allows: at start-up, before the
  first window is shown, the wait for the config read and the reading of the bundled resources that window is built from
  (its fonts, the message catalog, the keymap, its icons); and the last save as the app quits.

#### Same on every OS

- **OS-02 · MUST.** 5.0.0 asked for one class named `Os`, with `isWindows()`, `isMac()` and `isLinux()`, as the only
  reader of `os.name`. The names are now the app's own, and the statement adds that a class which only shows the OS's
  name, in About or a problem report, asks that one class for it. The Command also fails a class that tells the OS apart
  by comparing `File.separatorChar` or `File.pathSeparatorChar` with a character, as eleven of Editora's classes do. No
  app meets the rule yet; OS-03 follows the wording.
- **The table *Where the OS's way wins*.** Its rows are the only exceptions OS-01 and OS-04 allow, and eight were added
  since 5.0.0: a click with the primary modifier, Enter on a focused button that is not the default, the macOS
  application menu, files opened from the OS, file associations, the Trash, the shells and profiles a terminal offers,
  and high contrast. The "Primary modifier" row is now "Keymap chords": on macOS, the `.mac.json` variant of each keymap
  that has one, as KBD-21 allows, not `Cmd` for `Ctrl` alone. The Quit row cites WIN-14 and WIN-13 beside TRAY-04, and
  the Menu bar row no longer says "in a decorated window". A difference that a new row gives no longer breaks OS-01 or
  OS-04.

#### Conformance

- **PAUTA-02 · MUST.** The conformance is still computed from the exceptions by one pure helper; the statement adds that
  nothing else enters it: the `checked` list (PAUTA-18) is a record, and a by-hand rule with no entry there leaves the
  result as it is. The Check reads the helper and no longer asks for its unit test. The test that holds the README's
  badge and line to the computed conformance is still required. Nothing to do for an app that met 5.0.0.
- **PAUTA-03 · MUST.** 5.0.0 said "a new app's first release is at Core or Complete". The statement now says which app
  that is: one that has made no release yet, with no numbered section in its `CHANGELOG.md` and no version tag. An app
  with a release behind it is outside the rule: it may be at Partial, and says so.
- **PAUTA-04 · MUST.** 5.0.0 asked that a person check every by-hand rule in the running app before the conformance was
  claimed. Now a by-hand rule counts once a person has checked it: found unmet it gets an exception, found met a
  `checked` entry (PAUTA-18), and until then it has neither, which is not a failed audit. The audit reports it as
  `manual`, not recorded, and a `not-checked` result fails nothing either. The Check is the audit itself, which judges
  this rule last from its other results; nothing to do for an app that met 5.0.0.
- **PAUTA-05 · MUST.** The three things that limit a rule to apps with a feature are unchanged: its own text, an
  **Applies to** line, or a limited rule it details. The statement adds that nothing else limits one, so a scope is
  never inferred from what the app lacks. An app that left out an entry on that ground alone records `not-applicable`.
- **PAUTA-09 · MUST.** `pauta.json` is now the one source of the record of by-hand checks as well as of the exceptions,
  and the statement names its place, among the app's bundled resources (`src/main/resources/com/<app>/pauta.json`). The
  `checked` list is the app's to keep or not, and what an entry of it holds is PAUTA-18's alone. A file with no
  `checked` list passes, so an app that met 5.0.0 has nothing to do.
- **PAUTA-10 · MUST.** The test gains the failures of a `checked` entry: one that names a rule not checked by hand, a
  rule listed twice, a rule that has an exception, an edition newer than `pauta.version`, or an edition older than the
  rule's `changed`, which makes it stale. The Check asks for a case for each failure the rule lists, so an app that met
  5.0.0 adds those cases. The repository the test compares a `pending` link with is the one the app's own code names;
  `AppInfo.GITHUB_REPO` is the template's name. The template's test reads the `exceptions` list only so far.
- **PAUTA-11 · SHOULD.** Moving to a newer edition gains two steps: replace the app's copy of the audit skill where it
  keeps one (the template's is `.claude/skills/pauta-audit/SKILL.md`), and remove the `checked` entries the new
  `rules.json` makes stale, then check those rules again. Nothing fails a skill copy left behind, which then audits the
  new rules by the old procedure.
- **PAUTA-13 · MUST.** 5.0.0 ended with "The Pauta window links to it". That link is PWIN-07's alone, a SHOULD, and
  PAUTA-13 keeps the *Pauta conformance* page on the website. Its Check starts in the app's checkout: an app whose
  repository and About name no website for its user docs has nowhere to carry the page, and fails. The rest reads the
  website's repository (`<app>-website`): the page gives the edition, the conformance and every exception under its
  kind, each with its rule ID, reason and link. An audit run from the app's checkout alone reports that part as
  `not-checked` and says what would settle it.
- **PAUTA-16 · MUST.** The rule now says whom it leaves out: an app that was not made from a template inherits nothing,
  and the rule asks nothing of it; an audit reports it as `limited`. For a template and the app made from one it asks
  what 5.0.0 did. Nothing builds it yet: the template's `pauta.json` has no `template` field, its script sets none, and
  its test accepts a `pending` link to the template's own repository.
- **PAUTA-17 · MUST.** 5.0.0 required a `## Pauta` section in `AGENTS.md`. The heading is now the app's own: a section
  on Pauta that names the edition `pauta.version` names and links that edition's `llms.txt` and `llms-full.txt` at its
  numbered address, never `latest/`. The Check reads the file for both links, where it had asked a test for the first
  alone, and no longer requires a test. The template, Termina and Mirada have the section (5.0.0's Reference left Mirada
  out); Editora's and nux's `AGENTS.md` have none, and Torrenta and Modula have no `AGENTS.md`.

#### Platform baseline

- **PLAT-01 · MUST.** 5.0.0 said CI builds and bundles JDK 25, and its Check demanded an enforcer rule with the range
  `[25,)`. Now no enforcer rule is required, but none may refuse a newer JDK, in the main build or in any profile that
  turns itself on: one with an `<activation>` by JDK version, OS, property or file, or one that is `activeByDefault`. A
  profile turned on only by name with `-P` is not counted. Every workflow step that sets up a JDK sets up release 25,
  and a native-image leg sets up a GraalVM 25.x release. The Command reads the workflows and those profiles too, leaves
  XML comments out and judges every version key of a set-up step. A floor of 26 no longer passes it, and any range with
  no upper bound that starts at 25 or below does, such as `[21,)` or a bare `25`. Modula and nux, with no enforcer rule,
  now pass and Torrenta's `[25,26)` still fails; Editora, which passed, now fails for its `formatter-needs-jdk25`
  profile, which activates on JDK 26 or newer and holds an enforcer rule with the range `[25,26)`. No app's profile that
  activates by OS, property or file holds an enforcer rule, and no app has an `activeByDefault` profile.
- **PLAT-02 · SHOULD.** A MUST in 5.0.0: a jlinked runtime in every installer is now expected, not required. Mirada
  ships a GraalVM native image on every target but Intel macOS, with no Java runtime in it, and its users still install
  nothing. The Check adds that the jlinked image is what the release ships.
- **PLAT-04 · MUST.** 5.0.0 required the module name `com.<app>`. The name is now the app's to choose (the template's is
  `com.example.app`): the rule asks for one named module, not an `open module`, whose `module-info.java` opens only what
  reflection, FXML and Jackson need. Nothing to do for an app that met 5.0.0.
- **PLAT-10 · MUST.** 5.0.0 asked that CI fail an unformatted change, and its Check accepted Spotless's `check` goal
  bound to a phase a workflow runs. Now the check runs in a Format job of its own, in a workflow that runs on pull
  requests: a job that runs `spotless:check` and neither builds nor tests, so a failed job says which of the two is
  wrong. Torrenta and Modula, whose `test` job runs `./mvnw verify` and which passed, have the job to add. Editora, the
  template, Termina and Mirada have it; nux has no Spotless.
- **PLAT-11 · MUST.** 5.0.0 required TestFX. Now FX tests run on JUnit over the Headless glass platform and TestFX MAY
  drive them; an app without it starts the toolkit with `Platform.startup` and runs its steps on the FX thread. Termina,
  Torrenta, Modula and nux, which have no TestFX dependency, no longer fail the rule for that.
- **PLAT-12 · MUST.** The build-wide floors of 0.90 lines and 0.90 methods are unchanged; the statement adds that no
  profile that activates by OS or by JDK version lowers a floor or skips the check. The Check asks for an execution of
  JaCoCo's `check` goal, whatever its id. The rule is about the pom's profiles: a workflow that runs the tests on some
  of its runners with JaCoCo skipped (`-Djacoco.skip`), as Editora's `full-tests.yml` does, is the workflow's choice and
  passes. Termina, which met 5.0.0, has its `os-windows` profile to redo: it lowers the two floors to 0.45 and 0.47 on
  Windows.

#### Repository documents

- **REPO-01 · MUST.** The README's length has a ceiling: at most 250 lines, where 5.0.0 said "about 200 lines". The
  parts it holds are the same, and the detail still lives on the website, which the README links. Editora's (221 lines),
  the template's (148), Termina's (152) and Mirada's (172) are within it; Torrenta's runs to 433 lines, Modula's to 364
  and nux's to 313.
- **REPO-09 · MUST.** 5.0.0 required the field ids `environment` and `report` in the issue form. The ids are now the
  app's to choose (those are Editora's), and what is required is that the form and the app agree: the link Report a
  Problem opens names the form's file and carries the environment and the report as query parameters named by the ids of
  the form's two fields. Editora, the template, Termina, Torrenta and Mirada have the same form, ids and link and have
  nothing to do; Modula and nux have no issue form.

#### Documentation

- **DOCS-02 · MUST.** The frontmatter keys `category` and `order` were required as spelled and are now
  editora-website's: a docs page gives its category and its place in it. Nothing to do there. A page kept in the app's
  `docs/` fails the rule when any section of it tells the app's user how to install or use something, even if the rest
  of the page is for contributors and whether or not the website has it too, where 5.0.0 said the repository never
  carries a second copy: such a section moves to the website. Editora's `docs/plugins.md`, a page for plugin authors
  with a section on installing plugins and one on troubleshooting them, is one; so are Termina's
  `docs/reference/installing.md`, which tells the person installing it which download to take and how to check its
  signature, and Torrenta's three guides. The Check fails all three from the app's checkout, and with them an app whose
  repository and About name no website for its user docs.
- **DOCS-03 · SHOULD.** 5.0.0 said "Deep links from the app". The statement now covers every link from the app into its
  user docs, the address `help.documentation` opens as much as a link to one page: each opens the running version's
  docs, `/docs/v-<version>/`. `src/lib/version.ts`, the one file a version bump regenerates, is editora-website's name
  and no longer required. Editora and the app template build that address. Termina and Mirada open their site's
  unversioned `/docs/` and have it to change; Torrenta, Modula and nux open no docs address, so they have no link to
  judge and nothing to fail here: the missing address is DOCS-06's.
- **DOCS-04 · SHOULD.** 5.0.0 generated the Roadmap from `TODO.md` in every app; now only where the app keeps one
  (REPO-08). The Check adds what the statement always asked, that the docs check fails the site: the site's build or its
  deploy workflow runs it. editora-website has the check (`npm run check:docs`) and nothing runs it. The Reference names
  `WindowCommandRegistrar`, not `MainController`, as the class that holds most of Editora's `Command.of` calls.
- **DOCS-05 · MUST.** 5.0.0 asked for a bold summary on each `CHANGELOG.md` entry, which is REPO-02's alone now, and for
  a Welcome page's *What's New* to open the build's release. The rule is now about the notes of the GitHub release,
  which that link shows: they are written for the person using the app and are not a list of commits or pull requests,
  so JReleaser's `changelog` is not a `format` of commit hashes and titles and no release step sets
  `generate_release_notes`. Editora, whose notes are built from the commits, and Modula and nux, which have GitHub
  generate them, have this to redo. The template, Termina, Torrenta and Mirada take the notes from the version's
  `CHANGELOG.md` section.
- **DOCS-06 · MUST.** 5.0.0 asked every app for Help → Documentation. Now every app has the `help.documentation`
  command, in the palette and bindable, and the Documentation row is asked where the app has a Help menu: the Help menu
  of a menu bar, or a Help submenu of the app's main menu. A row beside a Help submenu is not in it, which is where
  Mirada's main menu has it; its macOS Help menu has the row. Modula and nux have no documentation command.
- **DOCS-07 · SHOULD.** The Help menu's order gains two rows after Documentation, the keyboard reference (DOCS-08) and
  Welcome Page, and Simple mode's Help menu keeps Welcome Page too. The rule covers an app with a Help menu, in a menu
  bar or as a submenu of its main menu, and an app with both is judged on both. Termina's menu and Mirada's macOS menu
  bar have the keyboard reference in its place. Editora has neither new row (its Welcome Page row is still in the View
  menu), and the Help submenu of Mirada's main menu does not follow the order.
- **DOCS-08 · SHOULD.** 5.0.0 asked that Help have a keyboard reference, and counted Editora's keybinding editor as one.
  Now, where the app has a Help menu, a row of it opens the reference: a searchable window of every key, or the
  keybinding editor. Termina has the row; Mirada has it in its macOS Help menu, and beside the Help submenu in its main
  menu. Editora has a row to add: its keybinding editor is a page of Settings that no row of its Help menu opens.
- **DOCS-10 · MAY.** 5.0.0 described per-command help in the palette (`C-h`, or the first free of `F1` and `Shift+F1`)
  and asked Search Everywhere to share the URL builder. The palette's help chord is PAL-08's alone. DOCS-10 keeps the
  other half: an app with a Search Everywhere picker opens the highlighted command's page from it with the palette's
  chord and the palette's URL builder.
- **DOCS-14 · MUST.** No longer says `AGENTS.md` is "kept short", which had no measure: what the file holds is
  REPO-05's. The three files' three jobs are unchanged. Nothing to do. The Check asks the link into `docs/` of
  `CONTRIBUTING.md` only, as the statement does, and says what exhaustive history is: a record of past work, or a
  catalog that sets out to list every part of a subsystem or every command. An app that keeps none needs no
  `docs/reference/`.
- **DOCS-16 · MUST.** 5.0.0 asked for `CHANGELOG.md`, `TODO.md`, the contributor guides and the website's user docs in
  the same pull request. The website's docs now change in a pull request on the website's repository opened with the
  code's, since that is where they live, and `TODO.md` is asked only where the app keeps one. The Check is by hand: a
  person reads the app's last merged feature pull requests, and a recent one that changed behavior and touched none of
  those files fails. An audit reports the rule as `manual`. That `docs/conventions.md`, `CONTRIBUTING.md` and
  `AGENTS.md` state the rule shows it is asked, not that it is kept.
- **DOCS-17 · MUST.** The statement now says what its Check always asked: `AGENTS.md` and `docs/README.md` say that the
  code wins when documentation and code disagree. Nothing to do for an app that passed the Check.
- **DOCS-18 · SHOULD.** 5.0.0 named the capture hook alone. The screenshots may now come from the app's capture hook or
  from its headless fixture, whichever QUAL-09 has it keep, still rendered from the real window at 2×. Nothing to do for
  an app that met 5.0.0. No app renders at 2× yet: Termina's and Torrenta's `DevCapture.java` and nux's
  `ui/Screenshot.java` write the scene at its own size, and Editora, which 5.0.0's Reference credited with a capture
  hook and which has none, writes a screenshot from three FX tests only, when `-Deditora.test.shots=<dir>` is set, at
  the scene's own size too.

#### Code quality gates

- **QUAL-05 · SHOULD.** A MUST in 5.0.0. Keeping a decision in a pure helper with unit tests is now expected, not
  required, and the statement names the decisions: what decides whether a control is enabled or shown, or where a key or
  a click leads. 5.0.0 said "prefer a pure decision helper" and named none.
- **QUAL-06 · MUST.** 5.0.0 required `@Tag("fx")`. Now every test class that boots the JavaFX toolkit carries one JUnit
  tag, the same for all of them and named as the app likes (Editora's is `fx`), so the pure suite runs alone by
  excluding it; the Check counts a class that calls `Platform.startup` too. Termina holds it by a test. Editora has 33
  untagged `*FxTest` classes, where 5.0.0 said about twenty, and in Torrenta 26 test classes start the toolkit and no
  test carries a tag.

#### Performance

- **PERF-01 · MUST.** 5.0.0 allowed no blocking call on the FX thread at all. Two exceptions are named. At start-up,
  before the first window is shown, `start()` may wait once for the config read PERF-16 began before the toolkit, and
  may read the bundled resources that window is built from: its fonts, registered there or by a thread `start()` waits
  for once (ICON-02 requires them before any CSS), the message catalog, the keymap and its icons. And as the app quits,
  the quit method (WIN-13) or `Application.stop()` may make the last save on it, and nothing else that blocks. Nothing
  else is excepted: at start-up a log file opened, a file or a store of the user's read (presets, profiles, schedules,
  themes the user added), a ledger read, a socket bound or a lock taken still fails, and so does a font registered after
  the first frame. An app whose `start()` loads its settings itself, whether or not `main` read the file earlier, or
  waits for a read begun after the toolkit, has PERF-16's gap and none here. Nothing is asked that 5.0.0 did not ask, so
  an app that met it has nothing to do. The Check lists its candidates with a grep; no app has been read through. Found
  so far: Editora's `start()` opens the Debug Log's file, takes the lock on a file in its config folder and reads a
  ledger, a stale endpoint file and the user themes' folders, and some of its handlers touch the disk; the template's
  and Torrenta's `start()` open the Debug Log's file, and the template binds its instance socket there and registers its
  remaining font on the FX thread after the first frame; Torrenta's main window reads six of the user's stores as it is
  built, and its `start()` reads `profiles.json` again; Termina binds its instance socket in `start()` and registers its
  remaining fonts after the first frame; Modula reads its presets and its schedules as its pane is built; Mirada, on
  macOS, compares two paths there when the OS hands it its first file; nux waits for its tray icon's removal in
  Settings' Save and writes its `--screenshot` file from an animation's callback; Torrenta and Modula write their
  settings from handlers. Mirada's two waits in `start()`, for its settings and for its font thread, are the ones the
  exception allows.
- **PERF-06 · MUST.** 5.0.0 held two requirements here, and the debounce of text-driven work is now PERF-23. PERF-06
  keeps the redraw: at most one per pulse, with a flag that a request is already queued, named as the app likes. The
  statement says what a redraw is: the painting of what the app draws itself (a canvas, a chart, a grid of cells), and
  in an app that paints nothing itself, the refresh of its list or view. A handler that paints straight from its event
  has no such flag and fails; setting a control's own property is not a redraw. The Reference no longer names Editora's
  `FxThrottle`, a throttle with no such flag, and names the `editStateRefreshPending` flag of its
  `ui/WindowToolbar.java`.
- **PERF-07 · MUST.** 5.0.0 covered every app. The rule now covers an app that shows a stream as it arrives (the output
  of a process, log records, progress or readings from another thread): it hands the stream to the FX thread in batches
  at least 16 ms apart, which a drain once a pulse meets. A stream is what arrives at its source's pace, the results of
  a scan handed over as each is found among them; a poll the app paces itself, with a timer of 16 ms or more, needs no
  buffer. An app whose FX thread is sent no stream is outside it, as Mirada is, whose Debug Log window reads the log
  when it opens and on Refresh. Torrenta does not meet it yet for its event log, which hands each warning over in a
  `runLater` of its own, nor nux for its network scan, which hands over each server it finds the same way; nux's poll,
  one reading every five seconds, is paced already.
- **PERF-08 · MUST.** Two changes to the statement. What must be shown in a virtualized control is a list the user or
  the data can grow without a limit the app sets, where 5.0.0 said "anything that can grow": a list the app caps at a
  number it names is outside. And the statement gains PERF-23's exemption: filtering a list already in memory, as a
  command palette does, runs on every keystroke and is not O(list) work the rule forbids. Nothing to do for an app that
  met 5.0.0. The Check lists its candidates with two greps; no app has been read through for the rule. Found so far,
  each a loop that makes a node for every item of a list nothing caps: Modula's preset bar (a chip for every preset the
  user saves), nux's dashboard (a card for every saved profile it watches and every UPS), Torrenta's rule and tags
  dialogs (a check box for every feed and every tag), and Editora's crontab preview and pull-request checks card (a node
  for every job and every check run). The Reference no longer cites Editora's `MinimapRows.java`, which reads every
  line.
- **PERF-11 · MUST.** 5.0.0 asked that a bounded store keep the newest "with a note of what was cut". The note is
  dropped: the newest is kept and the oldest goes. The Check reads each store for a named cap and no longer asks for a
  test that fills it.
- **PERF-12 · MUST.** 5.0.0 asked every app for three tiers: expensive features off past one threshold, read-only or
  capped past another, and a refusal of what will not fit the free heap. The rule now covers an app that opens files or
  data the user picks, and asks that an input's size be checked before its content is read, or the read capped, so that
  what will not fit is never read in: the app refuses it with a message or opens the part that fits. The tiers are asked
  only where an input can open without features the app runs over its content, as a file in an editor can open without
  highlighting or a minimap; an input the app can only read in or refuse (an imported theme, a `.torrent` file) has
  nothing to step down to. Termina's theme import meets it with a cap and a refusal; Torrenta reads a picked `.torrent`
  file whole without looking at its size.
- **PERF-14 · MUST.** 5.0.0 named tool windows, panels and pages as what builds on first open. The statement now names
  everything the first window does not show: a closed panel's content, the Settings pages, the dialogs and the other
  windows. The Check reads the code that builds the first window and no longer asks for a test. Torrenta does not meet
  it: its main window's constructor makes the Log, Statistics and Settings windows. Editora builds its shared Output
  console with the window.
- **PERF-16 · SHOULD.** 5.0.0 said "Config is read off the FX thread, before the toolkit needs it". Now the read starts
  on a thread of its own before the toolkit does, from an entry point that is not the `Application` subclass, and
  `start()` takes its result: the wait PERF-01 allows for it. An app whose `start()` loads its settings itself does not
  meet it, whether or not `main` read the file earlier: that is the template, Torrenta, Modula and nux, of which
  Torrenta and nux also read the file once in `main`. Termina reads its settings in `Application.init()`, off the FX
  thread but after the toolkit has started. Editora meets it, and Mirada in its native image only.
- **PERF-17 · SHOULD.** 5.0.0 asked for precompiled stylesheets and an AOT cache trained on a real session. The AOT
  cache is REL-10's alone; PERF-17 keeps the `.bss` stylesheets, which the build converts from the app's `.css` files
  and the packaged app carries. Only Editora converts its own stylesheets.

#### Keyboard first

- **KBD-03 · MUST.** The palette description is now "one-line": the word comes from DOCS-09, which is retired into this
  rule. Nothing to do for an app that met both. The Check reads the registry and the catalogs and no longer asks for a
  parity test; the app template's and Mirada's tests walk the registered commands, where Editora's `MessagesTest`, which
  5.0.0 named, walks the catalog and misses a registered command with neither key.
- **KBD-05 · MUST.** 5.0.0 gave the palette's chord per bundled keymap and said nothing of an app without keymap files.
  An app with one key table and no Emacs keymap (a terminal app's own keymap, or the built-in table of an app that ships
  no keymap files) now binds `Ctrl+Shift+P`, `Cmd+Shift+P` on macOS. An app that ships no keymap files owes the chord
  and fails KBD-09 all the same, and one whose chord opens the palette from a handler, with no palette command, passes
  this rule and fails PAL-01. Nothing to do for an app with bundled keymaps. Termina and nux meet it; Torrenta opens the
  palette with `Alt+X` alone, and Modula tests for `Ctrl` on macOS too.
- **KBD-06 · SHOULD.** 5.0.0 had the palette match over the title, the id and the description. It now matches over the
  title and over the words of the id or the command's keywords, and shows the description without matching it; a query
  that names a command's title still outranks a fuzzy hit. An app that matched the description stops; Editora never did.
- **KBD-07 · MUST.** The statement now names every picker beside the palette: each is an in-scene overlay in the
  window's root `StackPane`, never a `javafx.stage.Popup`. 5.0.0's statement named the palette alone while its Check
  already tested the pickers, so nothing to do for an app that passed.
- **KBD-09 · MUST.** The statement names the files it requires (`emacs.json`, `cua.json` and `cua.mac.json`), and adds
  for a terminal app that neither `keymap.json` nor `keymap.mac.json` binds a plain `Ctrl` or `Alt` (`Option` on macOS)
  with a letter: `Ctrl+Shift+T` or `Cmd+T`, never `Ctrl+T`. Nothing to do for an app that is not a terminal and names
  its files so; Termina's two files meet it, with a test for the `Ctrl` half off macOS only. The rule has no Command
  now: the old one passed either set of files without knowing which the app owed.
- **KBD-10 · SHOULD.** A terminal app, which ships one keymap of its own (KBD-09), no longer owes the IntelliJ, VS Code
  and Sublime keymaps, and the Command passes it; Termina failed in 5.0.0. For every other app the statement now names
  the files: `intellij.json`, `vscode.json` and `sublime.json`, each with its `.mac.json` variant. Only Editora ships
  them: the app template and Mirada ship Emacs and CUA alone, and Torrenta, Modula and nux ship no keymap file.
- **KBD-15 · MUST.** 5.0.0 let a button leave the Tab order when the keyboard reached its command another way, and named
  toolbar buttons and the find bar's buttons. Now any control may leave it when the keyboard does all that the control
  does another way: the buttons of a toolbar as TBAR-02 defines one, which a bar of labeled buttons such as nux's is
  not, so its buttons are held to this rule; and of a find bar's or a filter's controls only those FIND-16 names, so a
  control that fails FIND-16 fails here too. The Check starts in the source: every control taken out of the Tab order,
  and every label or pane that acts on a click, needs its other way. An app that met 5.0.0 checks its find-bar controls
  against FIND-16; the app template meets the rule, Editora has three buttons only the mouse can work (the Message Log's
  Clear, the build console's Previous Run and Save Output), Modula's preset Rename and Remove are in a right-click menu
  alone, and Termina's regex toggle is out of the Tab order with no command and no key.
- **KBD-16 · MUST.** The ring's rules are in "the app stylesheet", which need not be named `app.css`: Mirada's is
  `mirada.css`. The Check reads the stylesheet and no longer asks for a test that tabs to each control, so Termina and
  Mirada, which have the layer and no such test, meet it. The statement names the kinds of control it covers, the ones
  its Check lists (buttons, toggles, menu buttons, links, combo boxes, check boxes, radio buttons and text fields),
  where 5.0.0 said every control. Nothing to do for an app that met 5.0.0.

#### Accessibility

- **ACC-01 · MUST.** The statement ends "A test holds it": the test 5.0.0's Check asked for is part of the requirement.
  That test now covers every control a person can focus or click, in the Tab order or out of it, where it covered
  focus-traversable nodes only. No app has it yet; Termina's `IconOnlyButtonsFxTest`, which fails an icon-only button
  with no name and no other kind of control, comes nearest.
- **ACC-06 · SHOULD.** Scoped to an app whose window has more than one region, the content and at least one panel beside
  it. An app with one region owes no next-region and previous-region commands; nothing changes for the others.
- **ACC-07 · SHOULD.** 5.0.0 made the screen-reader pass part of REL-29's smoke test, which is a CI step with nobody
  there to listen. It is now a step of its own in `docs/release.md`, naming Narrator and VoiceOver, that a person makes
  before a release and records as a `checked` entry with the app's version (PAUTA-18). With no such step in the file the
  rule is unmet. No app has it, and Modula and nux have no `docs/release.md`.

#### Window shell

- **WIN-01 · MUST.** "A status bar is always present (it can be toggled)" now reads: the main window has a status bar,
  shown by default, and the user may hide it. Nothing to do for an app whose bar starts shown. Termina's is a setting
  that starts off, so it does not meet the rule.
- **WIN-03 · MUST.** Scoped to an app with a menu bar, so Modula and nux are outside it. On macOS the window may be
  extended as well as decorated, provided its header holds no menus, as Mirada's is. Nothing to do for an app that met
  5.0.0. The Reference no longer cites Mirada for the title-bar setting: it has none, and its header holds a file name
  and buttons, not a menu bar.
- **WIN-04 · SHOULD.** The dialog helper attaches the app stylesheet only; 5.0.0 asked it for the UI font too, which
  reaches every scene by ICON-01. Nothing to do: Editora's helper never attached the font.
- **WIN-08 · SHOULD.** The open items are restored only in an app that opens documents or sessions; the main window's
  size, position and maximized state are restored in every app. Nothing to do for an app that met 5.0.0. The Reference
  named a test that does not touch the window's geometry: Editora's `WindowManagerLaunchFxTest` restores it from a saved
  file, and no Editora test saves it and reads it back.
- **WIN-09 · SHOULD.** Now the content zoom alone, in an app with content to zoom (text, an image, a terminal):
  `Ctrl+=`, `Ctrl+-` and `Ctrl+0`, with `Cmd` on macOS, bound in every keymap and kept across launches. The UI zoom it
  also asked for is WIN-12, a MUST. An app with nothing to zoom is outside it; Editora and Termina meet it.
- **WIN-11 · MUST.** Cancel is to the left of every action, and three answers read Cancel, Save, Discard (CONF-05).
  5.0.0 said "the action" while CONF-05 drew Save, Discard, Cancel, so an app that drew that order redoes it. The Check
  asks for one order string in which `C` comes before the letter of every action: `BUTTON_ORDER_WINDOWS` on every OS,
  which passed as "one constant", fails. No app sets an order yet.

#### Icons and color

- **ICON-01** and **ICON-02.** Both now cover Modula, which 5.0.0's page called the stated exception: its readings may
  stay monospace as content, and Inter on its menus, settings and dialogs is owed. ICON-01's Check also passes an app
  with no listener on `Window.getWindows()` when every window and dialog it builds adds the font sheet itself
  (`ui-font.css` is Editora's name for it); a popup or a tooltip needs no call of its own, since JavaFX gives it the
  scene stylesheets of the window it is shown from. Torrenta passes that way; Termina does not, since four of its
  dialogs get no sheet.
- **ICON-08 · MUST.** 5.0.0 said no component rule carries a fixed hex. Now none carries a fixed color, whatever its
  spelling: a hex, an `rgb()`, `rgba()` or `hsb()` value, or a named color such as `white`; `transparent` is not a
  color. A fixed color may stand only in a token's definition, on `.root` or in a scoped block that sets `-color-*`
  tokens, and only where the theme has no role to build on: the color of a scrim or of a shadow, a plain `rgba()` if
  the app likes, as Termina and Mirada have it, each with a test, a color drawn over an image or a canvas, or a color
  inside a `ladder()` of the ground. The ground, ink or accent of the app's own windows given there as a fixed color
  fails; a state color given so is ICON-07's failure and is
  not counted here again. The Check also tests the statement's first clause, that a component rule's colors are AtlantaFX roles or tokens,
  and fails a fixed color in a component rule inside a `ladder()` as well as outside one. nux and the app template,
  which have no hex in a component rule, newly fail: each writes its palette's scrim and a shadow as `rgba()`, and nux
  sets `-fx-text-fill: white` on `.status-pill` and `.update-badge`. Editora, Torrenta and Modula, which already failed,
  have more to redo: an `rgba()` scrim and shadows in all three, the diff and merge tints and a fixed `white` in
  Editora. Torrenta's `.speed-graph-up` and `.speed-graph-legend-up` fail for the two hexes of their ladder, and
  Editora's fixed hexes are the ones 5.0.0 listed. The Spec rows that give a scrim's or a shadow's `rgba()` (the
  palette's Scrim, the menus' Card) say the value is a token's, defined on `.root`.
- **ICON-09 · MUST.** Was a SHOULD. Readable text in `-color-fg-muted` or stronger is now required, and "A test holds
  it": a contrast test that walks every rule of the stylesheets and fails a text fill in `-color-fg-subtle` unless its
  selector is on a named list of disabled and decorative selectors. A test that checks a list of readable selectors does
  not pass, and no app has the other kind: Editora's checks six selectors and the app template's fifteen, Mirada has no
  test for this rule, and Termina, Torrenta, Modula and nux have no contrast test of their stylesheets. The statement
  names the themes the measure is held in: both flagship themes, Editora Light and Editora Dark, or, in an app whose
  default light and dark themes are another pair, that pair.
- **ICON-10**, **ICON-11** and **ICON-12.** Each statement ends "A test holds it": the contrast test their Checks asked
  for in 5.0.0 stays part of the requirement. ICON-10 names its roles (accent, success, warning, danger) and its grounds
  (the role's subtle fill and the default and subtle grounds). ICON-11 gives its measure, 4.5:1 or more on the emphasis
  fill of the four roles, which 5.0.0's statement left to the Accessibility page. ICON-12 says "the app stylesheet" and
  marks `-focus-ring` as Editora's name, so neither name is required, and names its surfaces: the default, subtle, inset
  and overlay grounds. All three hold in both flagship themes, Editora Light and Editora Dark, or, in an app whose
  default light and dark themes are another pair, in that pair, as Mirada's test holds ICON-10 and ICON-11 on Cupertino
  Light and Dark. Nothing to do for an app that met 5.0.0.
- **ICON-14 · SHOULD.** 5.0.0 asked for a pure test that reads the stylesheets and does the WCAG arithmetic. Now every
  test that computes a contrast ratio is pure: none starts the toolkit, so all run with the unit tests on every OS. The
  app template's, Mirada's and Termina's contrast tests are pure. Editora does not meet it: beside its pure
  `StyleContrastTest`, FX tests compute contrast on rendered nodes.
- **ICON-16 · MUST.** The statement says the theme setting offers "follow the system", and the Check that the place
  where the user picks a theme lists it; 5.0.0 described the choice without saying where it is offered. Nothing to do
  for an app that offers it. Termina and the app template do, though 5.0.0 said Termina did not; Editora, Torrenta and
  Modula don't yet.
- **ICON-18 · SHOULD.** Amber has two more meanings beside "not durable yet": a warning, as WIN-01 requires a warning in
  the echo area in amber, and an update available in About, as ABOUT-10 asks for it there. Red still means "broken" and
  green "verified" in every theme, and nothing is colored amber, red or green for any other reason. Nothing to do.
- **ICON-19 · MUST.** Scoped to an app whose icons come in two families, one colored by its stroke and one by its fill;
  `icon-line` and `toolbar-icon` are Editora's names for them. An app with one family (Termina, Mirada, Modula), or with
  no icons in its window (nux), has nothing to mix and is outside the rule. Nothing to do for the others.
- **ICON-23 · SHOULD.** Scoped to an app that shows files with an icon each: a project tree, file tabs, a list of files.
  An app that shows none owes no icon function.

#### Toolbars and tooltips

- **TBAR-01 · MUST.** The statement says what icon-only means, a glyph or a symbol such as "?" or "···" and no word, and
  that the one string behind the tooltip and the accessible text includes the chord where the tooltip carries one. An
  app whose accessible text is the title alone, beside a tooltip with the chord, sets both from the whole string.
  Termina meets it. Five apps don't: Editora (tooltip only on its main toolbar and its floating buttons, no chord in its
  stripe buttons' accessible text), Torrenta (the detail pane's "···"), Mirada (the chord in the tooltip only), nux (the
  "?" button's tooltip written again with its key) and Modula (no accessible text on its transport, Settings and Record
  buttons).
- **TBAR-02**, **TBAR-04**, **TBAR-05**, **TBAR-07** and **TBAR-09.** Each now applies to an app with a toolbar, which
  the page defines under *The toolbar*: a bar of icon-only buttons in a window's chrome (the title bar, a band of its
  own, a panel's header), each a shortcut to a command, tool window stripes included. A bar of labeled buttons (nux's),
  controls that belong to the content (Modula's transport, Mirada's over the image), the buttons at the end of a tab
  strip (Termina's) and a find bar's buttons are not toolbars. Content also takes in a row of preset chips with its add
  button (Modula's), the buttons inside a panel's rows (Mirada's info panel) and an image, PDF or Diff viewer's own bar
  in the content area (Editora's). Editora, Torrenta and Mirada have a toolbar; Termina, Modula, nux and the app
  template have none and record nothing for these rules. TBAR-04 says whose groups it means, a toolbar's groups of
  buttons, and asks for the transparent line only where a toolbar holds `Separator` nodes, so Mirada's header buttons
  pass; the separators of Editora's Debug panel toolbar and of Torrenta's main toolbar still draw their line. TBAR-07
  also takes any pseudo-class for the on state: `:open` is Editora's. Torrenta's Simple mode button carries one and its
  palette button none.
- **TBAR-03 · MUST.** Covers the tooltip of a button that runs a command, and says what "names the command" means: the
  name is the command's title, whole or without its category prefix ("Save" for "File: Save"), and the chord is that
  command's own. A tooltip with any other name is redone: eight on Editora's main toolbar are, such as "Find / Replace"
  for `find.show`, whose title is "Find: Incremental Search", and its Stop button shows no chord. Termina's find arrows
  don't meet it: they are named from strings of their own, and each shows the chord of the command that steps the other
  way. Modula's and nux's tooltips are written in the code. Mirada reads the chord from the keymap, where 5.0.0's
  Reference said it was typed into the string. A control's own fixed key, such as the Enter of a find field, may be
  written in a tooltip (KBD-13).
- **TBAR-06 · SHOULD.** Covers whichever bars an app stacks at the top of its main window (menu bar, toolbar, tab strip)
  and at the bottom (breadcrumb, bottom stripe, status bar), where 5.0.0 listed them as if every app had all of them. An
  app with one bar at an edge has nothing to join there. Nothing to do for an app that met 5.0.0.
- **TBAR-08 · MUST.** Scoped to an app with a toolbar, as TBAR-02 is, and within it widened from Editora's customizable
  cluster to every icon on every toolbar: each button runs a registered command that a menu also lists, the menu bar or
  the app's main menu, and a button that only opens a menu is exempt. Mirada meets it. Torrenta does not: eleven of its
  twelve toolbar buttons run a command a menu row runs too, and the twelfth, the palette button, opens the palette from
  a handler of its own (PAL-01). Nor does Editora: `tool.todo`, `tool.bookmarks` and `view.toggleZen` are on its toolbar
  and in no menu.
- **TBAR-12** and **TBAR-13.** Each now applies to an app with tool window stripes, which only Editora has. TBAR-12
  keeps what a stripe adds: the tooltip's name is the tool window's title, with the chord of the command that toggles
  the window, and follows the title when it changes; the right-click menu has *Open in Split* and *Hide*. It no longer
  asks for "accessible text bound to the window's title": a stripe is a toolbar, so its accessible text is the tooltip's
  string, chord included (TBAR-01). Editora redoes both: its tooltip does not follow a title change, and its accessible
  text lacks the chord.

#### Tabs and tool panels

- **TABS-01** to **TABS-09** and **TABS-12.** 5.0.0 gave the Tabs rules no scope. They now apply to an app whose main
  window holds documents or sessions in tabs the user opens and closes, as Editora's files and Termina's terminals are.
  The pages of a Settings window, the fixed sections of a detail pane and a strip that switches the window between views
  are not such tabs, so nux, Torrenta and every other app without them record nothing here. The rules cover every tab of
  the main window's strip, whatever it shows, and not tabs inside a tool window, such as those of Editora's Terminal and
  Build Output panels. So Editora's image, hex and PDF viewer tabs are held to them as its editor tabs are, and lack
  three things: the tab's right-click menu (TABS-01), a tooltip with the file's path (TABS-02) and a place in Reopen
  Closed Tab, which remembers an editor's file alone (TABS-06).
- **TABS-01** and **TABS-04.** A terminal app has no close unmodified, since its tabs are never unsaved, and needs
  no close all, since closing its window closes them. Every other tab operation is a command there too, and its
  three bulk closes skip pinned tabs. An app whose tabs hold files has nothing to change. Termina meets both;
  Editora still has no previous-tab command.
- **TABS-02 · MUST.** The title sits in a label of its own in the graphic header; `tab-title` is Editora's style class
  for it and no longer required. A terminal app's tab has no file-type glyph, its title names the tab (the user's name
  for it, the title the shell set, the running program or the working folder), and its tooltip is the working folder's
  full path. A full path may write the home folder as `~`, as Termina's does. Nothing to do for an app that met 5.0.0;
  Termina meets the terminal's part.
- **TABS-03 · MUST.** A terminal app's tab is never unsaved or read-only, so its header says what the tab is doing
  instead: the running program's name as the title, unless the user or the shell named the tab, and a mark beside the
  title for a notification, a bell or output after a quiet spell, cleared when the tab is selected. A pinned terminal
  tab is drawn as any other pinned tab, with a pin and a bold title. Nothing changes for file tabs; Termina meets the
  terminal's part.
- **TABS-08 · SHOULD.** Asks for the Git status tint only in an app whose tabs hold files; a terminal app is outside it.
  And it asks for something new: the tab's tooltip names the file's Git status, so color is not the status's only sign
  (ACC-05). No app does that yet: Editora's tab tooltip is the file's full path, so its tabs show the status by color
  alone.
- **TABS-09 · SHOULD.** 5.0.0 wrote the switcher's keys as Emacs chords (`C-x C-b`, `C-n`, `C-p`, `C-g`, `C-d`).
  Now a command opens it, the arrows or the active keymap's line chords move, Esc or the keymap's cancel chord
  cancels, and Backspace, Delete or the keymap's delete-character chord closes the highlighted file; releasing the
  Control key activates, on macOS too. The rule covers an app whose tabs hold files, not a terminal app. Editora
  already reads these keys from the keymap.
- **TABS-10 · SHOULD.** Says what an app with no files or projects puts in the window title: what the window shows
  in their place (a terminal, the working folder or the title its program set), or the app's name alone. The rule
  sits outside the Tabs section and still covers every app. Termina, the template, Modula and nux meet it.
- **TABS-13 · MUST.** Covers every tool panel, on a stripe or not, where 5.0.0 read as a rule for panels with a stripe
  button: a tool panel is a panel docked at an edge of the main window that the user shows and hides as a whole, such as
  a sidebar, a detail pane, an info panel or a thumbnail strip; a bar of the window's chrome that a command hides (a
  toolbar, a status bar, a tab strip) is not one. Each has a command with the id `tool.<id>`, a stripe button, where the
  app has stripes, runs that command, and the Emacs keymap binds the commands to `M-1` through `M-9` and then `M-0`, one
  chord to a panel; an app with one key table and no Emacs keymap owes no chord. Torrenta (`toggle-sidebar`,
  `toggle-detail`) and Mirada (`view.properties` and `view.thumbnails`, on `i` and `t`) have ids and chords to change,
  and Editora's stripe buttons call the manager's toggle, not the command. Some of Editora's commands only open their
  panel and never hide it: `tool.gitLog`, and the `tool.<id>` commands of its build tools.
- **TABS-15** and **TABS-19.** Both cover the same tool panels as TABS-13, where 5.0.0 wrote them for Editora's
  tool windows and its editor. TABS-15 restores which panels are open, where each sits and every divider position
  from the session-state file of SET-08 (`workspace-state.json` is Editora's name for it); sides, order, hidden
  stripe buttons and floating windows are asked only of an app with stripes. TABS-19 returns focus to where it was
  in the content, whatever the content is.
- **TABS-21 · SHOULD.** 5.0.0 said a bottom window that is unusable at the default height asks for more on its first
  open. Now a tool window whose content needs more room than the default share of its side can ask for more on its first
  open, on any side, and the user's own size wins afterwards, as before. Editora's Debug window asks for 42 %.
- **TABS-16** to **TABS-18** and **TABS-20** to **TABS-23.** The rules for docking, dragging to another stripe,
  floating and maximizing, a hidden stripe button, the first-open height, the busy badge and following the active
  document now apply to an app with tool window stripes, and say "tool windows" where they said "panels". Only
  Editora has stripes; every other app records nothing for them.

#### Menus

- **MENU-01** to **MENU-04** and **MENU-17.** The menu bar's rules apply to an app with a menu bar, so Modula and
  nux, which have none, record nothing for them. MENU-04 covers only an app with a Simple mode.
- **MENU-01 · MUST.** A menu-bar row may show its command's title without the category prefix ("Save As…" for "File:
  Save As…"), and never carries a title of its own. Nothing to do for an app that met 5.0.0. The Check says that
  separators and submenus are not rows, and that a row built by hand, with a title and a handler of its own, fails. Rows
  of Torrenta's View menu are built that way, and Termina's bar holds rows that are no command id: its New Tab With
  Profile submenu, whose rows open the tab from a handler of their own, and, off macOS, its zoom row.
- **MENU-05** to **MENU-13.** The right-click menus' rules apply to an app with a right-click menu: one the app
  builds and opens on a right-click, the Menu key or `Shift+F10`. The stock Cut, Copy and Paste menu of a text
  field and a tray icon's menu do not count, so nux is outside these rules.
- **MENU-05 · MUST.** Every action in any right-click menu the app builds is a command; 5.0.0 asked it of the menus of
  list rows, tree rows, tabs, editors and consoles. What must have a menu is said too: the lists, trees, tabs, editors
  and read-only consoles in the app's windows. A log shown as text, the Debug Log among them, is a read-only console and
  has its menu; a list that only navigates (a Settings sidebar, a list of pages) has no actions of its own and is
  outside, as are the overlay list of a picker or a palette and a plain text area in a dialog. The reference is the
  template's `CommandMenu`, which builds each menu from command ids. Five apps don't meet it, in these places among
  others. Editora's menus are built by hand and call the window's methods, so nothing holds that each row has a command,
  and its Hierarchy, References and Undo History panels have no menu. The Message Log's list has none in Termina or in
  Mirada, and the Debug Log's text has none in Editora, Torrenta, Termina or Mirada; the template's has one. Rows of
  Torrenta's files and peers menus run handlers no command reaches, and in Modula the Rename… and Remove rows of a
  preset chip's menu run none.
- **MENU-09 · MUST.** Adds two things: in a view with no rows (an editor, a terminal, an image) the Menu key and
  `Shift+F10` open the focused view's menu, and on macOS the chord is `Shift+F10` too, with no `Cmd` form.
  Editora's IntelliJ keymap also binds `S-f10` to `run.rerun`, a clash its test does not cover.
- **MENU-12 · SHOULD.** A destructive row has its text in `-color-danger-fg`; `danger` is Editora's style class for it
  and no longer required. The rule asks for that style alone: what the action does before it destroys anything is the
  Confirm dialog's (CONF-01, CONF-03), where 5.0.0 pointed at the window shell. Nothing to do for an app that met 5.0.0.
- **MENU-15 · MUST.** Covers every menu the app draws itself: right-click menus, drop-downs and the toolbar's overflow
  as the in-window menu bar. The menus a platform draws are outside it: the macOS system menu bar, whose rows carry the
  chord in their title (MENU-02), and a tray icon's menu. The chord is drawn in the app's keyboard color, the one color
  it keeps for chords and key chips (ICON-06), at the size MENU-16 gives; `-state-key` is Editora's token for that color
  and no longer required as spelled. The Check accepts, outside the menu bar, the item's accelerator text filled from
  the keymap, and passes an app whose menu rows run only commands that have no chord, as nux's drop-downs do. The
  template and Termina's menu bar draw the chord in `-color-fg-muted` and fail on the color; Editora's right-click menus
  still show no chords.
- **MENU-16 · MUST.** Covers every menu the app draws itself (the in-window menu bar, right-click menus, the drop-down
  of a menu button or a split button, the toolbar's overflow), not the macOS system menu bar or a tray icon's menu,
  which are the platform's. Menu fonts scale with the UI zoom of WIN-12, which every app must now have; 5.0.0 pointed at
  WIN-09, where the UI zoom was a SHOULD. The 14 px and 11 px come from one value that the zoom rewrites, in pixels and
  never in `em`. Editora writes them as fixed pixels and has no UI zoom yet.
- **MENU-17 · SHOULD.** Covers the in-window menu bar an app shows on Windows and Linux: a keymap that binds `F10`
  to something else binds a command that focuses the bar, and so does a terminal app, where a plain `F10` goes to
  the program it runs. The macOS system menu bar asks nothing of the app, and 5.0.0's `Ctrl+F10` there is dropped.
  No app has the command yet.

#### Tray and background

- **TRAY-01 · MUST.** The tray is a StatusNotifierItem on Linux with no AWT fallback, and AWT's `SystemTray` on
  Windows and macOS, created on a background thread no sooner than the code that shows the main window. 5.0.0 asked
  for "the shared `tray/` package", which was three diverged copies, and for creation after the first frame.
  Torrenta meets it. Modula and nux fall back to `AwtTray` on Linux and have the fallback to remove.
- **TRAY-02 · MUST.** When no icon comes up, the main window's status line says why and that closing the window
  quits the app; 5.0.0 said "where the person will look". Torrenta does, Modula's status says that closing will
  quit, and nux shows the window and says nothing.
- **TRAY-04 · MUST.** Keeps the tray's part of the quit rule: the tray's Quit runs the app's one quit method, and a
  quit ends the program whether the window is showing or hidden, never hiding it as a close would. That every quit
  entry point runs the one method, which closes open dialogs first, is now WIN-13's, for every app. Nothing to do
  for an app that met 5.0.0. No tray app catches macOS's Quit yet, and Modula's and nux's quit does not close open
  dialogs first.
- **TRAY-05 · SHOULD.** With the tray setting off, `--minimized` starts the window minimized. 5.0.0 wrote two
  behaviors into the rule, Torrenta's minimized window and nux's ignoring the flag; nux now has Torrenta's to
  adopt. With the setting on nothing changes: the window waits for the tray attempt and is shown if no icon
  comes. Modula has no `--minimized`.
- **TRAY-09 · MUST.** The text reaches the notifier's program as data, an argument or an environment variable that a
  fixed script reads, where 5.0.0 allowed arguments only. The call times out after ten seconds or less, where 5.0.0 said
  "a few seconds": Editora, Termina and nux kill the program after five seconds and Torrenta after ten, so all four are
  within it. A `gdbus` fallback on Linux is allowed and not asked for, and the class need not be named `Notifier`. The
  Check reads the code and also tests the timeout and that a failure is logged: an exception, a program that is not
  there to run, the timeout, and an exit code that is not zero. No app logs them all: Termina logs an exception only,
  Editora drops a failure unlogged, Torrenta reports only the first of a session, and nux logs none, builds an
  AppleScript string on macOS and shows AWT's balloon on Windows in place of a PowerShell toast.
- **TRAY-10 · MUST.** Says outright that nothing is posted for an event whose window, or tab, is the one in front,
  and asks that most switches start off only where the app notifies of several kinds of event. Editora and Termina,
  with one kind and one switch, meet it. Torrenta posts while its window has focus, and nux posts while in front
  and has one switch for all its power events.
- **TRAY-12 · MAY.** Written for any app's dock badge, where 5.0.0 described Torrenta's: a figure of the app's own on
  the macOS dock icon and on a Linux launcher that honors Unity's `LauncherEntry` signal, nothing on Windows, cleared
  when there is nothing to show, with a switch of its own.
- **TRAY-14 · SHOULD.** Keeps only the tray's part: a tray makes AWT headful on Windows and macOS and never on
  Linux, and a tray turned on after start-up tells the user to restart. The list of uses that may make AWT
  headful, and that `main` decides once, is CLI-09's. Nothing to do for an app that met 5.0.0; Modula and nux
  never set `java.awt.headless`.

#### Settings

- **SET-01 · MUST.** An app with one key table and no CUA keymap (a terminal app's keymap, or the built-in table of
  an app that ships no keymap files) binds `Ctrl+,` (`Cmd+,` on macOS) in that table; 5.0.0 named the CUA keymap
  alone. Termina, Torrenta and nux bind it; Modula's Settings command has no chord.
- **SET-04 · MUST.** Adds that a setting which cannot apply until a restart says so on its own row. Editora's
  interface language row and Torrenta's tray icon row do. nux's Settings window still has Save and Cancel buttons,
  which 5.0.0 did not allow either.
- **SET-06 · MUST.** Covers every setting the Settings window shows, where 5.0.0 said every setting: a key that SET-16
  keeps out of the UI has no row and takes no command. Nothing to do for an app that met 5.0.0.
- **SET-07 · MUST.** Says that the default `~/.<app>` is in the user's home on Windows, macOS and Linux alike, and
  which source wins: `--config-dir`, then `--dev`, then `<APP>_CONFIG_DIR`. No app has all of it. In Editora,
  Termina and the template the variable beats `--dev`; in Mirada the flag typed last wins and the default folder
  depends on the OS; Torrenta has no `--dev`; Modula and nux read a fixed folder, with no flag and no variable.
- **SET-08 · SHOULD.** Asks for preferences in one file, session state in another and every other store in a file
  of its own; `settings.json` and `workspace-state.json` are Editora's names and no longer required. The Check
  fails a preferences file that holds window geometry or a list of open items: Torrenta, Mirada and the template
  keep the window's bounds in theirs.
- **SET-09 · MUST.** Every config file the app writes and reads back (SET-22 says which files those are) carries a
  schema version, with a migration step for each version; 5.0.0 said "every versioned file", which an app with none
  could pass. A plain list with one item to a line is exempt, and `SCHEMA_VERSION` is Editora's name. Torrenta's and
  Modula's files carry no version, nux writes one it never reads, the template's `sync/base.json` has none, and nor have
  the color schemes Termina imports, each a file it writes whole and reads back at start.
- **SET-10 · MUST.** A config file whose schema version is higher than the build's is kept as a backup beside it and
  defaults load; `<name>.v<n>.bak` is Editora's name for the backup and no longer required. Torrenta, Modula and nux
  read no version, so they cannot tell a newer file until they meet SET-09, and nor can Termina for an imported color
  scheme.
- **SET-13 · MUST.** Covers an app that stores a secret the user gave it (a password, a token, a key): each goes to the
  OS keychain and none to a config file, where 5.0.0 named API keys and tokens. It says what happens when no keychain
  answers: the secret is kept in memory for the session, never written to a file, and its Settings row says so, as a
  line on standard error does in a run with no window. A key or token the app generates itself is not such a secret: it
  may live in a file only the owner can read, outside the settings files, as Torrenta's `keys/<name>.key` and the token
  in Editora's `mcp-endpoint.json` do. Whether a credential is kept from one session to the next is the app's to decide:
  one it keeps is this rule's, and one it only holds for the session is SET-14's. Editora's fallback writes its AI keys
  to the settings, and Torrenta keeps its proxy, certificate-file and remote-profile passwords and its Torznab keys in
  plain text. Termina, Mirada and Modula store no secret and are outside the rule.
- **SET-14 · MUST.** Covers a credential the app asks for and does not keep from one session to the next, where 5.0.0
  said "a credential the app can ask for again": it is held in memory for the session and never written. Whether to keep
  a credential is the app's to decide, and one it keeps is SET-13's alone, as Torrenta's proxy and remote-profile
  passwords are. nux's UPS login and the SSH passwords and key passphrases Editora asks for are what the rule covers
  today, and both apps meet it. An app that asks for no credential, or keeps every one it asks for, is outside it, as
  Termina, Mirada and Modula are. Nothing to do for an app that met 5.0.0.
- **SET-15** and **SET-18** to **SET-21.** These apply to an app with Settings Sync, SET-15 by its own words and the
  others by their section's scope. An app without Settings Sync records nothing for them. SET-15 says what the refusal
  tells the user to use instead, a Git credential helper or an SSH URL, where 5.0.0 said "with the fix".
- **SET-16 · MUST.** Says what weakens security: an option that switches off a check or a question the app otherwise
  makes to protect the user. A feature, such as remote access or a proxy, is not such an option. Nothing to do for an
  app that met 5.0.0.

#### Diagnostics and support

- **DIAG-01 · MUST.** Leaves the click on the echo area that opens the Message Log to WIN-01, which requires it.
  Nothing to do for an app that met 5.0.0.
- **DIAG-02 · MUST.** The Debug Log is mirrored to a session file in the config folder, and the previous session's
  file is kept; `<app>-session.log` and `<app>-session.prev.log` are Editora's names and no longer required.
- **DIAG-05 · MUST.** The automatic update check starts at least three seconds after the first frame, where 5.0.0 said
  "a few seconds". Once a session and at most once a day are limits on the automatic check alone: a check the user asks
  for (DIAG-10) runs when asked. The Check reads the code that starts it and no longer asks for a test. Editora, Mirada
  and the template wait five seconds after the first frame and Termina three, so all four pass; Torrenta starts its
  check when its engine is ready and Modula and nux inside `start()`, and fail.
- **DIAG-06 · MUST.** Keeps the report's contents alone: Report a Problem is a command, listed in the Help menu
  where the app has one, that builds a report with the app's version, the OS, the runtime, a summary of the
  settings and the recent Debug Log. The redaction is DIAG-11's, the window DIAG-12's and the link's length
  DIAG-13's. Editora's and Torrenta's reports carry no settings summary yet, which 5.0.0's Reference did not say;
  Modula and nux have no problem report.
- **DIAG-10 · MUST.** Asks for Check for Updates in the Help menu only where the app has one: the Help menu of a
  menu bar, or a Help submenu of the app's main menu. The palette command and the off switch in Settings are asked
  of every app, as before. nux, with no menu bar, meets it with the command; Mirada lists it in its Help submenu.

#### Command line and launch

- **CLI-02 · MUST.** Says that the folder `--dev` uses, `~/.<app>-dev`, is in the user's home on Windows, macOS and
  Linux alike. Nothing to do for an app whose `--dev` folder is already there.
- **CLI-04 · SHOULD.** Covers an app that reopens what was open in its last session (documents, tabs, folders);
  5.0.0 asked every app for `--no-session`. Mirada reopens nothing and is outside it.
- **CLI-05 · MUST.** `--report` writes the redacted report to a file in the current folder, or in the temp folder
  when that one can't be written, and prints the file's path; 5.0.0 did not say where. Editora and Torrenta do.
  The template and Mirada write theirs beside the settings and Termina only prints it, so the three have this to
  redo.
- **CLI-06 · SHOULD.** Covers an app that opens files or folders; Termina, Modula and nux open none and are
  outside it.
- **CLI-07 · MUST.** Names its exception, a launch with `--new-instance` (CLI-03); says a second launch hands over its
  arguments when it has any; and asks for the macOS `openFiles` hand-off only in an app that opens files. Nothing to do
  for an app that met 5.0.0. nux does not meet it: its second launch asks the running app to show its window and hands
  over none of its arguments, and a setting, not `--new-instance`, lets a second instance run.
- **CLI-09 · SHOULD.** Holds the whole list of uses that may make AWT headful, for an app with a tray or without
  one: the tray on Windows and macOS, and on macOS the dock badge, the open-file handlers and Move to Trash. 5.0.0
  allowed the tray alone. `main` decides once which of them the settings ask for on this OS. Mirada, headful on
  macOS only, for Move to Trash, is within it; Modula and nux never set the property.
- **CLI-10 · SHOULD.** Covers an app that starts external tools, and asks for the login shell's `PATH` on macOS and
  Linux only; on Windows the inherited `PATH` is used. An app that starts no tool is outside it.
- **CLI-11 · MUST.** The message that refuses an unknown option (CLI-12) prints in the Windows console too, and
  the console launcher need not be named `<app>-cli`: any `win-console` launcher on the same entry point passes.
  Torrenta meets the rule with `torrenta-nox`, where 5.0.0's Reference counted no app. No other app has such a
  launcher or calls `AttachConsole`, and no Windows run has confirmed that Mirada's native image prints in the
  console.

#### Internationalization

- **INTL-07 · SHOULD.** Every string comes from the catalog, by its key, through one lookup in one class;
  `tr("some.key")` and `Messages` are Editora's names and no longer required. The Check fails a string literal in
  a text position, which Torrenta's and nux's tests hold; the test 5.0.0 named, Editora's, only checks that every
  key a `tr` call names is in the base catalog.
- **INTL-09 · SHOULD.** Adds the apostrophe rule for a `{0,choice,…}` limb: written four times in a limb that
  holds a placeholder, doubled in a limb that holds none. Torrenta has the test for it; Editora's has no such case.

#### Command Palette

- **PAL-01 · MUST.** One palette in each main window, where 5.0.0 said one per window: a Settings, About or log window
  needs none of its own. Nothing to do for an app that met 5.0.0.
- **PAL-04 · SHOULD.** Asks only that every open start with an empty query: the palette does not keep the last one.
  5.0.0 also said that `palette.show` opens the palette and that the empty query lists every command, which PAL-01 and
  PAL-02 hold. Nothing to do.
- **PAL-06**, **PAL-07.** The selection moves on the active keymap's line and page chords and the palette cancels on its
  cancel chord, beside ↑ ↓, Page Up/Down, Esc and a click on the scrim, which always work. 5.0.0 named `C-n`, `C-p` and
  `C-g`, which are only what the Emacs keymap binds. An app that fixed those keys reads them from the keymap instead,
  and only Editora does: the template, Termina and Mirada fix `Ctrl+N`, `Ctrl+P` and `Ctrl+G`, Torrenta fixes `Ctrl+N`
  and `Ctrl+P` and has no page keys, and Modula and nux have the arrows alone. For PAL-07 an app with one key table owes
  the chord that table binds to a cancel command, and nothing where it binds none: Torrenta, Modula and nux, with no
  keymap and no cancel command, cancel on Esc and a press on the backdrop, which is all PAL-07 asks of them.
- **PAL-08 · SHOULD.** The help chord is the first of `Ctrl+H`, `F1` and `Shift+F1` that the active keymap leaves free,
  the same on macOS, where `Ctrl+H` is the Control key and has no `Cmd` form. 5.0.0 read "`C-h`, or the first of" the
  three. Nothing to do for a palette that already took the first free chord; only Editora's has a help chord.
- **PAL-10 · SHOULD.** The prompt is asked for by its words, "Run command…", read from the catalog: the key
  `palette.prompt` is Editora's and no longer required. The sizes are the same, at the default zoom of WIN-12. Mirada
  meets the rule, with the three sizes and the words under a key of its own, where the Reference said it typed its
  prompt in; Modula (420 px, a literal "Type a command…") and nux (540 px, the same words) do not.

#### QuickOpen picker

- **QOPEN-02** to **QOPEN-12.** Apply to an app with a picker: a card, opened by a command, for choosing one thing from
  a list by typing. A Command Palette that lists only commands is not one, and nor is a menu, a combo box or a field's
  completion list. In 5.0.0 they applied to every app; Termina, Torrenta, Modula and nux, which have no picker, now
  record nothing for them. QOPEN-02 leaves "never a `javafx.stage.Popup`" to KBD-07.
- **QOPEN-06**, **QOPEN-07.** A picker moves on the active keymap's line and page chords and cancels on its cancel
  chord, beside the fixed keys. QOPEN-06 already asked for it: the ids it named, `nav.lineDown` and `nav.pageUp`, are
  Editora's and not required, and its Check now tests the key handler, where it tested only the accept path. QOPEN-07
  named `C-g`, the Emacs keymap's cancel chord. Only Editora's picker asks the keymap: the template's and Mirada's move
  and cancel on fixed keys, and the template's has no `Ctrl+Home` or `Ctrl+End`.

#### Welcome page

- **WELC-01 · SHOULD.** Covers an app that opens files or projects in tabs; 5.0.0 said "files or projects". An app whose
  window is its content comes under WELC-02.
- **WELC-02 · SHOULD.** Covers an app whose window is its content and can start with nothing in it: a list with no
  items, a viewer with nothing open. An app that always opens into content, such as a terminal, a radio or a monitor,
  has no empty state to judge. Torrenta and Mirada have one; the page said Mirada had none.
- **WELC-03 · SHOULD.** Help → Welcome Page is asked where the app has a Help menu, in the place DOCS-07 gives the row,
  and the Check now looks for the row. The startup that suppresses the page is any that goes straight to one view, as
  Editora's standalone diff does. Editora's row is still in its View menu.
- **WELC-04 · SHOULD.** The hint in the empty content area lists the app's own ways in, each with its chord; Open File,
  Open Folder, Command Palette and Welcome Page are Editora's. Nothing to do.
- **WELC-09 · SHOULD.** Covers an app with saved remote sites; 5.0.0 said "saved SFTP sites", of every app.
- **WELC-10 · SHOULD.** The Customize links run the app's own commands that pick the keymap and the app theme:
  `keymap.select` and `theme.setAppTheme` are Editora's ids and no longer required. Nothing to do.

#### About window

- **ABOUT-01 · MUST.** Asks for the `help.about` command in every app, for Help → About where the app has a Help menu (a
  menu bar's, or a Help submenu of the app's main menu), and on macOS for an About item the app itself adds to the
  application menu, which JavaFX builds without one. 5.0.0 asked for the Help row of every app, and Modula and nux have
  no Help menu. No app meets all of it: Editora, the template, Torrenta, Modula and nux add no macOS item; Termina and
  Mirada do, but Termina's command is `about` and Mirada's About row sits beside its Help submenu, not in it.
- **ABOUT-02 · MUST.** Names the links: About links the app's home page, its source code and its releases, where 5.0.0
  said "links". The home page is the app's website, or its repository's page where About links no website; one link
  meets two of the three when its page is both, as Editora's "Source code and releases" does; a link to the running
  build's release notes, or one shown only when an update is available, is not the link to the releases. An app whose
  About lacks one of the three adds it. Termina's links its website and neither its source code nor its releases;
  Mirada's, Modula's and nux's link the repository and not the releases. The Check also tests everything else the
  statement lists, the runtime's versions and the license with the version, the build and the update check's last answer
  whatever it was. Modula's About fails that too (no Java version, and the update check shown only when an update is
  available), and so does nux's (the update check shown only when there is a newer version).
- **ABOUT-08 · MUST.** Asks only for the edition's one source: `pauta.version` in `pom.xml`, which the build filters
  into a resource the app reads. `build-info.properties` and `AppInfo` are the template's names and not required, and
  the README's badge and "Built to" line are PAUTA-15's. Nothing to do. The template, Termina and Mirada meet it.
- **ABOUT-09 · MUST.** Says itself that the conformance link runs the `help.pauta` command, which PWIN-01 said in 5.0.0,
  and that the conformance line is in the environment block. Nothing to do. Termina's and Mirada's About show the
  edition but not the conformance.
- **ABOUT-10 · SHOULD.** The colors are asked for in words: "Update available" bold in amber, the links in the accent,
  "up to date" green and a failed check red. The `-state-*` tokens are Editora's and not required. The app template
  meets it, where the Reference said no app did; no released app does, and Editora's line is still in the links' color.

#### Pauta window

- **PWIN-01 · MUST.** The `help.pauta` command opens the window in every app, and the *Pauta Conformance* row is asked
  in the Help menu where the app has one. 5.0.0 asked for the row of every app and put it just above About: its place is
  now DOCS-07's, and About's link is ABOUT-09's. Only the app template has a Pauta window; no released app does.

#### Confirm dialog

- **CONF-02** to **CONF-04.** Open with "In an app that asks before a destructive action": before it removes, deletes,
  discards or overwrites something, ends a running program, or runs a command that cannot be taken back. A question that
  warns before something is run or pasted and destroys nothing (Termina's before a multi-line paste) and a question
  before a harmless command (nux's) are not such questions, and CONF-13 passes them by too. CONF-14 reaches them: it
  covers every dialog with two or more buttons. When an app must ask is still CONF-01's, and CONF-02 says that its list
  is wider than what CONF-01 requires a question or an undo for, which is only what the user made. Nothing to do.
- **CONF-03 · MUST.** Still the action's own verb on the confirming button, never OK or Yes, in red, by whatever style
  class: `danger` is Editora's and no longer required. Where the buttons' words come from is the new CONF-14. Nothing to
  do for an app that met 5.0.0. Termina, Mirada, the template and Torrenta's `RemoveConfirm` meet it. Four questions in
  Torrenta's Settings (disconnecting sync, Reset to Defaults, Reset All Shortcuts and taking a shortcut back from
  another command) say OK and are not red, and its question before connecting sync, which destroys nothing, is not one
  of them; nux's risky-command question names Run with no red; and Editora meets it in its Git, unsaved-changes, Quit
  and Local History questions and not, among others, where the answer is OK (deleting a file in the Project panel, a
  project, a note or a macro, Replace in Files, Revert) or the named action is not red (deleting a remote site or a TODO
  pattern, resetting the settings, discarding recovery records, removing a plugin).
- **CONF-05 · SHOULD.** The unsaved-changes question draws its three answers Cancel, Save, Discard. 5.0.0 had Save,
  Discard, Cancel, against WIN-11, which puts Cancel to the left of the actions in every dialog. An app that drew the
  old order redraws it; Editora still draws it. Save is green and Discard red, by whatever style class.
- **CONF-06 · SHOULD.** Keeps the Close button, in red, and leaves Cancel as the default button to CONF-13. Nothing to
  do.

#### Find bar

- **FIND-01 · MUST.** Names the text it covers: an editor, a read-only console, a terminal's scrollback and a log shown
  as text, such as the Debug Log every app has (DIAG-03). So a Debug Log shown as text needs a find bar, in every app; a
  log shown as a list is FIND-03's. Only the app template's Debug Log has one, and Editora's Run, External Tools and
  Debug consoles have none. An app with no Debug Log window fails the rule with DIAG-03, and a view with no find bar
  where this rule asks for one fails FIND-02, FIND-06 and FIND-07 with it, as an app with no find bar and no Debug Log
  window does.
- **FIND-03 · MUST.** Covers two things where 5.0.0 covered one. In an app whose main content is a list, a filter box
  over that list takes the find bar's place, as before, and the statement says which app that is: one whose main content
  is a list or a table of items that grows without bound and that the user finds things in, Torrenta alone today; and in
  every app, each log shown as a list or a table of entries (a Message Log, an event log) has a filter field that
  narrows it as it is typed, which check boxes that narrow by level are not. An event log and a log tab that lists one
  item's events count as such logs; a table of readings or of history does not. The Message Logs of Editora, Torrenta,
  Mirada and the template have the field; Torrenta's log window and the Log tab of its detail pane, Termina's Message
  Log and nux's event log do not.
- **FIND-04 · SHOULD.** A command opens every find bar and, run while its bar is open, finds the next match; 5.0.0 also
  allowed putting the caret back in the field, as Termina does. `find.show` and its keymap chords belong to the main
  window's own text, and any other bar has a command with an id of its own. Only Editora's editor bar does both:
  Termina's find command, Editora's `terminal.find` and the template's `debugLog.find` put the caret back, and Editora's
  console bar has no command.
- **FIND-05 · SHOULD.** Applies to every find bar: every match highlighted, the active one distinctly, and the search
  started from the caret as it was when the bar opened. It adds a terminal's order (the newest match at or above the
  bottom of the view) and lets a view that can draw one selection only show the active match alone. Editora's console
  bar and the template's Debug Log bar search from the current selection, and Editora's console paints the active match
  only.
- **FIND-06 · MUST.** Says which way the keys go over a terminal: Enter steps up to older output, Shift+Enter down.
  Termina's bar and Editora's terminal bar already do.
- **FIND-07 · MUST.** Gains what FIND-08, a SHOULD, held: in a find bar over a terminal, the Escape that closes the bar
  does not reach the shell. The rest is as in 5.0.0, with the log added to the texts focus returns to. Termina's
  `SearchBar` and Editora's `TerminalFindBar` consume the key, so no app has anything to do.
- **FIND-08 · SHOULD.** Keeps what is left of it: a terminal with a find bar keeps its own key and mouse filters off the
  bar, so every event aimed at the bar stays there. The Escape clause is FIND-07's now. Nothing to do; Termina's
  `TerminalView.fromSearchBar` is the reference, and a bar that sits outside the node the terminal's filters are on
  meets the rule too.
- **FIND-11**, **FIND-12.** Open with "In a find bar that replaces", which is an editor's; an app with no replace
  records nothing. FIND-12 asks that Replace and Replace All run under a time budget, as the search does, and that a
  replacement that outruns it stop and say so in the status line. 5.0.0 said "too slow" and gave no measure: the
  budget's length is the app's own, and the words "Replace stopped: the pattern is too slow" are Editora's.
- **FIND-13** to **FIND-15.** Open with "In an app whose main content is a list", where they said "a list app" or named
  no app; FIND-03 says which apps those are. FIND-13 asks for a registered command that puts the focus in the filter
  box, bound to `Ctrl+K` (`Cmd+K` on macOS), and for the badge to be read from that command's chord; Torrenta's `filter`
  is one. FIND-15 gives its chords' macOS forms and marks undo and `Ctrl+Alt+1…9` as Torrenta's.

#### Message Log

- **MLOG-03 · SHOULD.** The log closes on the active keymap's cancel chord, as on Esc and a click outside; 5.0.0 named
  `C-g`. An app that fixed `Ctrl+G` reads the chord from the keymap instead: the template, Termina and Mirada fix it,
  and Editora's popup still closes on `Ctrl+G` and `Alt+G` whatever the keymap. An app with one key table owes the chord
  that table binds to a cancel command, and nothing where it binds none: Torrenta, with no keymap and no cancel command,
  closes on Esc and a press outside, which is all the rule asks of it.
- **MLOG-04 · SHOULD.** The Message Log copies the selected entries on the platform's copy chord, `Ctrl+C` (`Cmd+C` on
  macOS), in every keymap, and on the active keymap's copy chord too; 5.0.0 named `Ctrl+C` alone. The second half is
  new, and no app does it yet: the Message Logs of Editora, Torrenta, Termina, Mirada and the template each copy on a
  fixed shortcut-down C and read no keymap. Under Editora's Emacs keymap on Windows and Linux even that chord does not
  reach the log, since `C-c` is a prefix its key dispatcher consumes first.

#### Packaging, signing and release

- **REL-01 · MUST.** The Maven profile that packages the app may have any name: `dist` is Editora's, and the template
  and the five other apps use it too. The runner images in the Targets table are Editora's as well, and another image of
  the same OS and architecture meets the rule. Nothing to do.
- **REL-03 · MUST.** JReleaser still builds nothing and creates the GitHub release with every file and the checksums.
  The rule no longer says it "only" does that: it also runs the Homebrew and winget packagers (REL-12, REL-13) where the
  app has them. Nothing to do.
- **REL-06 · SHOULD.** Says "the default branch" where it said `master`. Nothing to do.
- **REL-11 · MUST.** Asks for every download of every target, with checksums, and points at the Targets table for which
  target gets which type; "every download on every platform" asked every target for types it does not build. The Check
  reads the files the release attaches, however it publishes.
- **REL-14 · SHOULD.** The two packagers read one repository secret, a classic token with `repo` scope; the name
  `PACKAGES_TOKEN` is not required. Nothing to do.
- **REL-16 · MUST.** The Linux downloads are signed in a job of their own, apart from the build legs: the name
  `sign-linux` is Editora's and not required. The Check now tests the signatures, the `.asc` beside every file and that
  the release attaches the public key. Mirada signs its Linux downloads in full, where the Reference said "partly"; nux
  has no signing job and no committed key.
- **REL-19 · MUST.** Asks for two checks on every push to the default branch and every pull request: PLAT-10's format
  check and the build with its tests (`./mvnw verify`, coverage gate included), on the JDK PLAT-01 names; `ci.yml`,
  Format, Build & Test and `master` are Editora's names and not required. That the default branch requires both checks
  is a repository setting no file shows, so an audit of a checkout whose workflow has the triggers and both checks
  reports `not-checked`. Nothing to do for an app that met 5.0.0; Torrenta, Modula and nux have no format check of
  their own (Torrenta's and Modula's one job runs `verify` with the check bound to it), and nux runs `test`, not
  `verify`.
- **REL-20 · MUST.** Was a SHOULD. The pure suite runs on Linux, macOS and Windows and the FX suite on Linux and one
  more, every day or on every pull request, and a release waits for those runs on its own commit. How the runs are split
  is the app's own: `full-tests.yml`, the `full-ci` label and the list of flaky tests in the job summary are Editora's
  way and no longer asked. Termina, Torrenta, Mirada, Modula and nux, which run the whole suite on the three OSes on
  every pull request, meet it, as do Editora and the template with their split.
- **REL-24 · MUST.** A workflow may start from less than `permissions: contents: read`, such as `permissions: {}`, which
  Modula's `notify-catalog.yml` has. Nothing to do.
- **REL-25 · SHOULD.** Asks only for `cache: maven` on every `actions/setup-java` step: JDK 25 is PLAT-01's alone.
  Mirada, Modula and nux have it on every step; Editora, the template, Termina and Torrenta each have a step without it.
- **REL-26 · MUST.** Keeps the timeouts alone: `timeout-minutes` on every job that runs steps, where 5.0.0 said every
  job; a job that calls a reusable workflow cannot take one. The `concurrency` group is the new REL-31. Nothing to do
  for an app that met 5.0.0. Editora, the template, Termina and Mirada meet it; no job of Modula's three workflows or
  nux's two sets a timeout, nor do the jobs of Torrenta's `ci.yml` and `engine-soak.yml`.

### Removed

#### Conformance

- **PAUTA-12.** It asked that About name the edition and the conformance, and that the Pauta window, opened from About,
  the Help menu and the Command Palette, list every exception. ABOUT-05 and ABOUT-09 hold About's part, PWIN-01 the
  window and the ways into it, and PWIN-02 its list.

#### Documentation

- **DOCS-09.** It asked that every command have a one-line description (`command.<id>.desc`), shown under its title in
  the palette. KBD-03 holds it, and now says "one-line".

#### Toolbars and tooltips

- **TBAR-10.** It asked that the toolbar's right-click menu be one menu, reused across right-clicks, that closes on a
  press anywhere, the toolbar included. MENU-06 (one right-click menu at a time) and MENU-07 (a press anywhere outside
  closes it) hold that for every right-click menu.

#### Tabs and tool panels

- **TABS-11.** Asked that tabs sit in the title bar through JavaFX 27's `HeaderBar`. No rule holds that now.

#### Tray and background

- **TRAY-08.** Asked that every start-at-login call run off the FX thread. PERF-01, a MUST, holds that for all I/O.

### Fixed

#### Auditing an app

- **A Command can only read.** `npm run check` now reads each Command as the shell does and passes it only when every
  command it runs is on a short list of readers (`grep`, `test`, `head`, `tail`, `wc`, `cut`, `tr`, `cat`, `ls`, `echo`,
  `printf` and the like, with `sed -n`, `sort`, `uniq`, `find` and `xargs` in the forms that cannot write or run another
  program) and it sends output nowhere but `/dev/null` and its own streams. 5.0.0 refused a list of programs, which
  `/bin/rm`, `env rm`, `xargs -0 rm`, `sort -o`, `printf -v PATH`, a redirect from `/dev/tcp` and a command named
  through a variable got past. No Command of 5.0.0 did any of that, and all twelve pass the new lint.
- **`llms.txt` and the Coding agents page follow the skill.** They find the app's edition where the skill does, in
  `pauta.version` and failing that the README, and no longer name the About window; they say an unmet MAY is `fail` with
  no consequence, and that a `manual` or `not-checked` MUST blocks no release. `rules.json` words its `test` and `by
  hand` checks and its `manual` and `not-checked` statuses the same way: a by-hand check needs a person, in the running
  app or where the Check sends them.

#### Editions and Pauta Next

- **The PDF and the Markdown download.** The PDF's matrices carry "Yes", "Partly" and "No" as text under their dots,
  where a search or a screen reader found empty cells, and the Shared features matrix fits the page: three apps' columns
  were cut off. Both downloads show the block to copy into an app's `AGENTS.md` with `## Pauta`, as the page does; they
  had `### Pauta`.
- **The checklist's ticks are kept per edition.** Ticking a line in one edition ticked it in every other. `latest/`
  starts a new edition from the ticks it held before, and `next/` keeps its own.
- **Dates in the American order.** The site writes "November 9, 2026", as the rest of the guide does.

#### The family pages and the checklist

- **Gaps per app.** Every row was read against an audit of each app's MUSTs at the head of its default branch, and
  Editora's against the rules that cite it. Each phrase that named no rule now ends with the rules it stands for, the
  gaps the audits found and the page lacked are in (Editora's row links 67 rules where it linked 19, Torrenta's 101 for
  34, Termina's 57 for 17, Modula's 113 for 32, Mirada's 36 for 14, nux's 110 for 29), and the clauses the code
  contradicts are corrected: Torrenta's confirmations are worded from the catalog and lack the verb and the red, its
  torrent list's menu shows chords and lacks their color, and Editora's main toolbar has eight tooltips that are not
  their commands' titles. A part an app lacks is listed once, under the rule that requires it, with the rules about how
  that part behaves as links on the same clause, and the page names the five rules no app has been read through for,
  where a row with no clause is not a pass. PAUTA-18 is no longer open in every app, so six MUSTs are open across the
  family.
- **Feature matrix.** Seventeen rows are corrected from the apps' code, among them keymap presets, configuration export,
  `--config-dir`, accessible names on icon-only buttons, the extended title bar, the tray's Linux fallback, Dependabot
  and Keep a Changelog.
- **Shared features.** Fourteen rows name the apps that have each feature as their code shows. Config files written
  through a temporary file gained a row under SET-22; it and Settings in the macOS application menu (WIN-15) left *Not
  rules yet*.
- **The Overview and the README.** Both say nearly every rule names code to copy, and the Overview that a Reference may
  say no app does yet: 24 open that way.

#### Same on every OS

- **OS-01.** The Check failed every menu row or default set inside an OS check, though the statement excepted the rows
  of *Where the OS's way wins*. It now passes a difference a row gives, such as the rows of the macOS application menu
  and a default chord in its macOS form, and a gate that holds on all three OSes alike is not an OS check. The Reference
  adds two places that do not meet the rule: Editora's `file.saveAsAdmin` is not disabled on Windows, where it can do
  nothing, and Termina removes its `hideMenuBar` command on macOS.
- The page's list of differences found in the apps has sixteen entries, where 5.0.0 had four, each with the rule it
  breaks. Two of the four are corrected: Editora's delete on Windows removes the file for good (OS-04), where the page
  said its move to the Trash did nothing, and "no app's flags print on Windows" left out Torrenta's console launcher,
  `torrenta-nox` (CLI-11).
- Reworded, the requirement unchanged: OS-03.

#### Conformance

- **PAUTA-07** and **PAUTA-14.** Their Checks say what the app's checkout cannot show, and an audit that cannot see it
  reports `not-checked`, not a failure. For PAUTA-07 the source settles that each `pending` link is an issue in the
  app's own repository, and that an app with no `pending` entry meets the rule; that the issue is open and names the
  rule and the edition is read on GitHub. PAUTA-14's generator is in the website's repository, and an app that names no
  website fails it with PAUTA-13.
- The page's examples say `x.y.z` and `<edition>` where they said 4.2.0. The worked `pauta.json` uses DIAG-07 and
  KBD-12, rules that cover every app, where it had TABS-06 and WELC-01, and shows a `checked` entry; `not-applicable` is
  described as the kind for a rule that nothing limits and whose subject has no use in the app.
- Checked by reading the code, not by a named test: PAUTA-15, PAUTA-17.
- Checks and References brought in step with the apps: PAUTA-02, PAUTA-08, PAUTA-18.

#### Platform baseline

- The page's everyday commands say which repositories have each: only Editora and the template have a `fatjar` profile,
  and `-Pdist package` builds the installer in Editora and Modula and the app image alone in the template, Termina,
  Torrenta, Mirada and nux.
- Checks and References brought in step with the apps: PLAT-09, PLAT-10, PLAT-13.

#### Repository documents

- **REPO-02.** The Check reads what the statement asks: `## [Unreleased]` first, the other sections headed by a number
  and a date, the entries under Keep a Changelog's headings, and each entry opening in bold. It no longer asks that the
  file name Keep a Changelog and SemVer. The Reference named Editora's `CHANGELOG.md`, where 369 of 2,173 entries, the
  older ones, do not open in bold and some sections have headings of Editora's own, as some of Modula's and nux's do; it
  names Termina's and Mirada's, where every entry opens in bold. Torrenta's sections are headed without the brackets.
- The page's README section says what is a rule and what is not: REPO-01 asks for badges and PAUTA-15 for the Pauta
  badge among them; the other seven badges and their order are the template's convention, and the `<picture>` hero and
  the statement about AI coding tools are Editora's practice.
- Reworded, the requirement unchanged: REPO-07.
- Checked by reading the code, not by a named test: REPO-04.

#### Documentation

- **DOCS-01.** Its Check starts in the app's checkout: an app whose repository and About name no website for its user
  docs fails the rule there, and fails DOCS-02 with it. The rest reads the website's repository, which the app's
  checkout does not hold: an audit run from the app's checkout alone reports that part as `not-checked` and says what
  would settle it. The same holds for the website's half of DOCS-02, DOCS-03 and DOCS-04; a user guide in the app's
  `docs/` (DOCS-02) or another docs address in the app (DOCS-03) still fails from the app's checkout. The Check also
  looks at the pages' screenshots, and the paths it names in the website are marked as editora-website's.
- **DOCS-03.** Its Why no longer says the SHOULD "becomes a must the day the app links to a specific page": a rule's
  level is the one on its page, and nothing else raises it.
- Reworded, the requirement unchanged: DOCS-11, DOCS-12.
- Checked by reading the code, not by a named test: DOCS-15.

#### Code quality gates

- Reworded, the requirement unchanged: QUAL-07, QUAL-09.
- Checked by reading the code, not by a named test: QUAL-08.

#### Performance

- The page no longer says "each app names its hot paths", which read as a requirement: it says what a hot path is and
  lists Editora's.
- **PERF-03.** The Reference says what was found, with no app read through for the rule: nux applies each Refresh of its
  Events window, and each load of the Energy and Outages tabs of its History window, with no mark, beside a Charts tab
  that numbers its loads.
- Checked by reading the code, not by a named test: PERF-11, PERF-13, PERF-14, PERF-15.
- Checks and References brought in step with the apps: PERF-02, PERF-04, PERF-05, PERF-20.

#### Keyboard first

- **KBD-01.** The Check passes a control that calls what its command's runnable calls, as well as one that runs the
  command's id through the registry. The Reference says Editora does not hold the rule everywhere: the Message Log's
  Clear and the build console's Previous Run and Save Output have no command behind them. Nor does Termina: Clear in its
  Message Log, Refresh, Copy, Export and Clear in its Debug Log, and Import theme in Settings, run no command.
- **KBD-02.** The Check accepts an id of two or more names joined by dots with the area first, such as
  `git.log.checkout`; the pattern `<area>.<camelCaseName>` failed 38 of Editora's ids.
- **KBD-21.** The Check compares the commands each keymap file and its `.mac.json` variant bind, and no longer asks for
  a test that does. Mirada, whose `cua.json` and `cua.mac.json` bind the same commands with no such test, passes. An app
  that ships no keymap files has no pair to compare and fails the rule with KBD-09.
- Reworded, the requirement unchanged: KBD-18.
- Checked by reading the code, not by a named test: KBD-03, KBD-06, KBD-16.

#### Accessibility

- **ACC-02.** The role's actions are `FIRE`, `EXPAND` and `COLLAPSE`: JavaFX has no `TOGGLE` action, which the statement
  listed. Editora's `SettingSwitch` handles `FIRE` only, where the Reference said `TOGGLE` and `FIRE`.
- Checked by reading the code, not by a named test: ACC-03, ACC-08.
- Checks and References brought in step with the apps: ACC-05.

#### Window shell

- Reworded, the requirement unchanged: WIN-10.
- Checked by reading the code, not by a named test: WIN-08.

#### Icons and color

- **ICON-05.** Termina's and the app template's copies of both theme files match Editora's. Only Torrenta's
  `editora-light.css` still has the earlier `-color-accent-fg`, `-color-warning-fg` and `-color-success-fg`; the
  Reference said Termina's did too.
- **ICON-07.** The Check tests the statement's last clause: a component rule that colors a state uses the state token,
  and none names the role behind it or writes the ladder out again. Editora fails it, with 78 declarations that name
  `-color-danger-fg`, `-color-warning-fg` or `-color-success-fg`. Torrenta does with two rules that repeat a ladder and
  29 declarations that name the roles behind its own tokens, Mirada and nux have no token for a state (Mirada's one
  `-state-*` token is the keyboard's), and Modula's tokens are fixed hexes chained to no role; the app template holds it
  with a test, and Termina's stylesheet meets it. The token's name is the app's own: `-state-*` is Editora's.
- **ICON-20**, **ICON-24.** Each Check says what an app with nothing of its subject gets: one that draws no glyph
  anywhere has nothing to compare and passes ICON-20, one that ships no glyph set and no font has nothing to credit
  under ICON-24, and the missing icons are MENU-14's.
- Reworded, the requirement unchanged: ICON-15.
- Checked by reading the code, not by a named test: ICON-06, ICON-13, ICON-19, ICON-20.

#### Toolbars and tooltips

- Checked by reading the code, not by a named test: TBAR-09, TBAR-13.

#### Tabs and tool panels

- **TABS-12.** The Check tests the statement: a command hides the tab bar with any number of tabs open, where a command
  that "toggles the tab header" passed. The Reference says what Termina, which the rule covers, lacks: it has no command
  that hides its tab strip, only a setting, toggled by a command, that hides the strip while a window has one tab.
- **TABS-18.** The Check no longer asks the Emacs keymap to bind maximize, close and resize, which the statement
  never did, and now tests that maximizing one tool window first restores the one that was maximized.
- Checked by reading the code, not by a named test: TABS-06, TABS-08, TABS-20, TABS-21, TABS-22.
- Checks and References brought in step with the apps: TABS-02, TABS-05.

#### Menus

- **MENU-02.** The Check tests the whole statement: beside the absence of `setAccelerator`, that an in-window row
  is a `CustomMenuItem` laying out icon, title, spacer and chord, and that a row of the macOS system menu bar has
  the chord in its text and no graphic.
- **MENU-06.** The Check reads the code that opens a menu and no longer asks for a test. Menus that each row or
  cell owns, with nothing to close the one shown last, fail: Modula's pane hides its own menu before showing it
  again, but a preset chip's menu opens beside it.
- **MENU-07.** The Check asks for a mouse-press filter that hides the menu and says the stock auto-hide alone
  fails, since JavaFX ignores a press on the owner. Mirada, which closes its three menus from a press filter on
  each window's scene, passes; Termina's tab menus, Modula's preset chips and every right-click menu in Torrenta
  fail.
- **MENU-14.** The Check reads the glyph in a menu-bar row's icon column, since a `CustomMenuItem`'s `getGraphic()`
  is always null and 5.0.0's test would have failed every such row. Editora still fails: about half its menu-bar
  rows have no glyph.
- Reworded, the requirement unchanged: MENU-08.
- Checked by reading the code, not by a named test: MENU-03, MENU-06, MENU-07, MENU-09, MENU-13, MENU-14, MENU-15,
  MENU-16.
- Checks and References brought in step with the apps: MENU-10, MENU-11.

#### Tray and background

- **TRAY-06.** nux's login entry is an earlier version of Torrenta's, without `X-KDE-autostart-after` and without
  reading `StartupApproved`; 5.0.0's Reference named "nux's design" beside Torrenta's code.
- Reworded, the requirement unchanged: TRAY-03, TRAY-07, TRAY-13.
- Checked by reading the code, not by a named test: TRAY-06, TRAY-09, TRAY-12, TRAY-14.

#### Settings

- **SET-11.** Mirada keeps a file it cannot decode as `<name>.corrupt.bak`; 5.0.0's Reference said it kept no
  backup. Torrenta, Modula and nux still keep none.
- **SET-12.** The Check no longer asks that an import replace only the ticked parts, which is Editora's way and
  not in the statement.
- **SET-19.** The Check tests what the statement says, that a sync starts by itself and on demand and sends no
  machine-local key, and no longer asks for one pure class that decides what travels.
- Reworded, the requirement unchanged: SET-02, SET-21.
- Checked by reading the code, not by a named test: SET-03, SET-05, SET-10, SET-11, SET-12, SET-18, SET-20.
- Checks and References brought in step with the apps: SET-16.

#### Diagnostics and support

- **DIAG-03.** The Check tests the five actions, not only that the window is modeless, so Torrenta's Debug Log,
  which has no Export, fails. The statement also points at FIND-01 for the window's find bar.
- **DIAG-04.** The Check tests that the handler posts an error to the echo area. Termina, Mirada and the template
  post it, where 5.0.0's Reference said Termina did not; Editora and Torrenta only log the exception.
- Reworded, the requirement unchanged: DIAG-09.
- Checked by reading the code, not by a named test: DIAG-01, DIAG-02, DIAG-05, DIAG-06, DIAG-08.

#### Command line and launch

- Checked by reading the code, not by a named test: CLI-05, CLI-07, CLI-08.

#### Internationalization

- **INTL-12.** The Check fails a value with a placeholder and "(s)", not every "(s)". No app has that test, and
  Editora's base catalog has 22 such values.
- **INTL-13.** The statement says it is a chord's modifiers that are never translated, and the Check reads the
  catalogs too. Editora writes chords untranslated, but its catalogs say "Strg+D", "Mayús+Tab" and "Maj+Entrée",
  so it fails where it passed.
- Checked by reading the code, not by a named test: INTL-07, INTL-08, INTL-09, INTL-10, INTL-12.
- Checks and References brought in step with the apps: INTL-04, INTL-11.

#### Command Palette

- **PAL-02.** The Check tests the whole statement: that the rows come from the whole registry, that each shows its
  command's title, and that the palette shows the description of the command under the cursor. Three palettes don't meet
  it. Torrenta's keeps only what the engine can run and Simple mode offers, and shows no description. Modula's leaves
  out `stereo` while its control is disabled, and its rows are a title and a shortcut. nux's lists every command, each
  row a title and the command's id, with no description.
- The Spec's Ranking row says what Editora matches: the title, then the id's namespace word, then the names other IDEs
  give the command, with the description shown and not matched. It said title, id and description.
- Reworded, the requirement unchanged: PAL-09.
- Checked by reading the code, not by a named test: PAL-05.

#### QuickOpen picker

- Reworded, the requirement unchanged: QOPEN-03, QOPEN-04, QOPEN-05, QOPEN-11, QOPEN-12.
- Checked by reading the code, not by a named test: QOPEN-07, QOPEN-08, QOPEN-09.

#### Welcome page

- Checked by reading the code, not by a named test: WELC-04.

#### About window

- **ABOUT-03.** The Check also tests that the button copies the environment block and changes its label; it tested only
  where the button sits.
- **ABOUT-05**, **ABOUT-06.** ABOUT-05's Check asks for the words *Built to Pauta* and the edition, not for the catalog
  key `about.pauta`, so Mirada, whose key is `about.pautaLink`, passes. Both References name Mirada beside the template
  and Termina: its About names its edition and links to it. ABOUT-06's Check says an About with no edition link fails it
  with ABOUT-05.
- **ABOUT-07.** An audit now judges it, where it was checked by hand: *Working toward* meets the rule, an About that
  names no edition passes (the missing edition is ABOUT-05's), and *Built to* is judged from the audit's other results
  against the edition the app names; an audit run against another edition reports it as `not-checked`. The Reference
  said no app met it. The app template does, at Partial; Termina ("Built to Pauta 2.0.2") and Mirada ("Built to Pauta
  4.0.1") do not, since each names an edition with MUSTs it does not meet.
- The mockup and the examples write the edition as x.y.z, where they said 4.2.0.
- Reworded, the requirement unchanged: ABOUT-04.

#### Pauta window

- **PWIN-05.** Checked by reading the sort, not by a named test. The Reference says what the template's sort covers:
  three kinds, pending, deviation and not-applicable, and no `app-only` yet.
- **PWIN-06.** The Check also tests that the button copies the edition, the conformance and the list as Markdown and
  changes its label; it tested only where the button sits.
- The mockup and the examples write the edition as x.y.z, where they said 4.2.0.
- Reworded, the requirement unchanged: PWIN-02, PWIN-03, PWIN-04, PWIN-08.

#### Confirm dialog

- **CONF-01.** The Reference names the two apps that do not ask: the Remove row of a Modula preset's menu and nux's
  Profiles → Delete remove at once, with no question and no undo. The page said Modula's preset chips removed on one
  click, and did not name nux.
- The mockups draw what the rules ask: Cancel, Save, Discard in the unsaved-changes question (CONF-05), Close in red in
  the close-running-program question (CONF-06), and Cancel as the default button where the only action is destructive
  (CONF-13). The Spec's Default button row states CONF-13, where it listed what each app did.
- Reworded, the requirement unchanged: CONF-08.
- Checked by reading the code, not by a named test: CONF-12.

#### Find bar

- **FIND-02.** The Check no longer asks that the search be debounced, which the statement never did: Editora's console
  bar searches straight from its field's listener.
- **FIND-09.** The Reference cited Termina's `TextInputKeys` for its find field: it is installed on Termina's palette
  only. Editora installs its text keymap on the editor bar's fields, and not on its console and terminal bars. The
  statement says which keymap each chord is from and gives the macOS forms.
- The Spec says which values are Editora's and which Termina's (the count's style, the 150 ms and 120 ms debounce, "No
  matches"), and its Focus row follows FIND-16, where it said the bar and its buttons were out of the Tab order.
- Reworded, the requirement unchanged: FIND-02.
- Checked by reading the code, not by a named test: FIND-11, FIND-12.

#### Message Log

- Reworded, the requirement unchanged: MLOG-02, MLOG-06.
- Checked by reading the code, not by a named test: MLOG-05, MLOG-07.

#### Settings Sync

- **SYNC-01**, **SYNC-02.** The page's *Applies to*, which sent SYNC-01 to itself for its own scope, is gone: SYNC-01
  says which apps offer sync, and lists the data it means, what a person builds up in the app by hand and would set up
  again on another computer (snippets, templates, shortcuts, profiles, presets, bookmarks, saved views), and SYNC-02
  opens with "In an app with Settings Sync". Nothing changes for any app.
- The mockup shows a page that is not connected: Connect beside a "Not connected" status, with Sync Now disabled. It
  showed Connect beside "Connected · synced 3 min ago", a state Editora never shows.

#### Packaging, signing and release

- **REL-04**, **REL-07**, **REL-29.** The Checks say "the step that publishes" where they named JReleaser, so a release
  published another way, as Modula's and nux's are, is judged on what it does. REL-29's also says "on each OS", as its
  statement does, where it said "on every target".
- **REL-08.** The Check asks for the fully qualified name of the app's own `Application` class, where it asked for
  `com.<app>.App`: Modula's `com.modula.ModulaApp` passes.
- **REL-15.** The Reference said all six apps were done. Torrenta is not: it launches the signed app before it is
  notarized, and its notarizing step ends at `spctl`.
- **REL-18.** The Check asks for the attestation step, with every file the release attaches among its subjects, and no
  longer for a test that keeps the two lists the same: that test is QUAL-15's, a SHOULD. The Reference adds the app
  template to Editora, Termina and Mirada.
- **REL-21.** The Check accepts either way of publishing nothing on a dispatched run: JReleaser's `--dry-run`, or a
  publishing job that runs only for a tag. Modula and nux, which have no JReleaser and do the second, failed it.
- **REL-22.** The Check and the Command also read composite actions under `.github/actions`, and want a version in the
  comment after the SHA (`# v6.1.0`, `# 2.5.0`, `# v2`), never a branch such as `# main`, which the Check allowed. Every
  pin in the apps already carries a version.
- **REL-27.** The Check also asks for the step that uploads the JaCoCo report, as the statement always did.
- Checks and References brought in step with the apps: REL-10, REL-28.

#### Tooling

- **`npm run check` holds more.** It fails on a relative link that leads to no page, section, rule or screenshot, a link
  whose label names another rule than it leads to, a page missing from `pages.json`, a Reference that points at "the
  table above", an *Applies to* line written any other way than the one rules are read by, and a `retired-rules.json`
  that lost or invented an entry.
- **Releases are checked harder.** The run that publishes asks the site what is live up to four times and publishes
  nothing new when it cannot tell; it tags the commit that released the edition; `pins.json` and `rule-changes.json` are
  checked whole; a rule added, retired or re-leveled needs an entry under *Unreleased* whatever a commit's trailer says;
  and a pull request rehearses the build of the released edition.
- **This repository has Dependabot** for its GitHub Actions and npm packages, as REL-23 asks of the apps, and its
  scripts run from a path with a space.

## [5.0.0] - 2026-11-09

Coding agents get commands for code checks, pinned References and one account of how to audit, and the rest of the
4.5.0 review lands: twelve new rules, four of them MUSTs (PAUTA-17, CLI-11, and DIAG-09 and DIAG-10 split out of
DIAG-05); WIN-03 and KBD-16 raised to MUSTs; PLAT-06 and TABS-14 retired into the rules that already held them. A
major because one change asks an app to redo work: MENU-16's menu fonts now scale with the UI zoom instead of being
pinned in absolute pixels. A command id or key that a rule's statement names is now required as written.

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
- **ACC-08 · SHOULD.** In an overlay list that keeps focus in its field (the Command Palette, QuickOpen), the row the
  arrows select is announced to a screen reader, with whether it can run.
- **ACC-09 · SHOULD.** In Windows' high-contrast mode the app switches to a high-contrast theme. JavaFX's own
  high-contrast stylesheet applies only over Modena, which AtlantaFX replaces.
- **MENU-17 · SHOULD.** The in-window menu bar is reachable from the keyboard in every keymap: JavaFX's `F10`, or a
  command where a keymap gives `F10` to something else (Editora's CUA, VS Code and Sublime keymaps give it to Step
  Over).
- **CLI-11 · MUST.** On Windows, `--help`, `--version` and `--report` print in the console: the installer carries a
  console launcher, or `main` attaches to the parent's console. Today they print nothing there in every app.
- *Same on every OS* lists more of the places the OSes differ: how a chord is written, Quit on macOS, notification
  attribution, the dock badge, the command line, middle-click paste, and the installers' gaps (unsigned MSIs,
  winget on x64 only, Homebrew on Apple Silicon only). It also names the differences in the apps that no row allows,
  each with the rule it breaks.
- **DIAG-09 · MUST** and **DIAG-10 · MUST** take two parts of DIAG-05: a newer version is announced in the status
  bar, and Check for Updates runs the check by hand with an off switch in Settings. DIAG-05 keeps when the check
  runs and that it never installs by itself. Nothing an app must do changes.
- **PAL-10 · SHOULD** and **MLOG-08 · SHOULD** turn the spec values that keep the apps alike into rules. The palette
  is 620 px wide with 36 px rows, 8 visible, and the catalog's "Run command…" prompt. The Message Log is an in-scene
  card above the echo area, 773 × 336, holding 200 messages. Modula, nux and Mirada differ on the palette, and
  Torrenta and Termina on the log.
- **ABOUT-10 · SHOULD.** In About, "Update available" is bold amber (`-state-amber`), a color no link or label there
  uses, so the one line that asks for action stands out; it was the accent every link wears.
- **INTL-12 · SHOULD.** A message with a count words it for the count with a `{0,choice,…}` pattern, never "(s)".
  Editora still has a few.
- **INTL-13 · SHOULD.** A chord reads the same in every language: modifier names and the macOS glyphs are never
  translated.

### Changed

- **KBD-09** lets a terminal ship one keymap of its own (`keymap.json` and `keymap.mac.json`) instead of Emacs and
  CUA: in a terminal those chords belong to the shell. Termina could only have recorded the MUST as pending forever.
  Its command passes either set.
- **CONF-06**'s Close button is red, in the `danger` style like every confirming button, as Termina's is.
- **A name in a rule's statement is required.** A command id, catalog key, file, property or style class a rule's
  statement names (`help.about`, `palette.show`, `help.documentation`) is spelled that way in every app, so keymaps,
  docs and agents find it under one name; a name only its Check or Reference gives is Editora's spelling, and an
  app's equivalent meets it. Torrenta, Termina, Modula and nux use other ids for these commands today. The audit
  skill, `llms.txt`, the Coding agents page and AGENTS.md say so, KBD-02's ids read as examples, and *Gaps per app*
  lists what each app spells otherwise.
- **The audit skill decides how to audit** and how to write the report; an edition supplies only its rules. The
  skill lists which `rules.json` fields each edition has, so an app on 2.0.x or 4.2.0 can be audited into a report
  that validates. `llms.txt`, the Coding agents page and the skill give one answer for an app that names no edition:
  ask, offering the newest, and with no one to ask, use the newest and say so. The sample audit prompt names the
  edition instead of `latest/`, and a Partial app's `AGENTS.md` says "working toward".
- **TRAY-09, TRAY-10 and TRAY-11** apply to every app that sends desktop notifications, with a tray or without one:
  they move to a *Notifications* section of their own, which also covers Editora and Termina. The page said no rule
  on it applied to those apps, while TRAY-09 cited Termina.
- **REPO-03** takes the year the app started in, from 2026 on, so an app started later can pass it.
- **PLAT-01** says CI builds and bundles JDK 25, the current LTS, as REL-25 sets up, and that the family moves to the
  next LTS together. It asked for "a current JDK".

- **WIN-03 is a MUST, and the title-bar menu is on by default**: on Windows and Linux the menu bar sits in the title
  bar (`HeaderBar`) unless the user turns it off; on macOS it stays in the system menu bar. Editora, Torrenta and
  Termina start it off today; the template and Mirada start it on.
- **MENU-16 follows the UI zoom**: menus are 14 px and 11 px at the default zoom and scale with it, instead of being
  pinned in absolute pixels. A menu at the default zoom is unchanged. WIN-09 says the UI zoom scales the whole
  chrome.
- **Editions come out in batches.** Changes to the guidance now collect under *Unreleased* and are published together
  as one edition when a batch is ready, instead of each change being an edition of its own. The Changelog page says
  so, and the largest change in the batch sets the number.
- **KBD-16 is a MUST**: every control shows the focus ring when the keyboard focuses it, so drawing the ring is as
  required as its color (ICON-12).
- **ACC-02** asks a control the app builds to handle its role's actions (`FIRE`, `TOGGLE`, `EXPAND`) too, so a
  screen reader can press it, not only find it.
- An OS difference that no row of *Same on every OS* allows is recorded as `pending`, not as a deviation: OS-01 is a
  MUST.
- **One rule per requirement.** Two IDs that stated the same requirement are retired, each pointing at the rule that
  holds it: **PLAT-06** (colors from tokens, never a fixed hex) into **ICON-08**, and **TABS-14** (a panel built on
  first use) into **PERF-14**. Rules that restated another's requirement now link to it instead: PLAT-05 (themes,
  ICON-15), DOCS-12 (the code wins, DOCS-17), DOCS-14 (what `AGENTS.md` holds, REPO-05), SET-15 (report redaction,
  DIAG-06), ICON-13 (Brace, ICON-06), PAL-02 and MENU-01 (titles, KBD-03), ABOUT-02 (the edition, ABOUT-05),
  INTL-11 (`--help` and `--version`, CLI-01) and KBD-13 (tooltips and menus, TBAR-03 and MENU-15).
- **No MUST holds a SHOULD's requirement.** DOCS-05 leaves the website's What's new to DOCS-04, DOCS-06 leaves the
  Help menu's order to DOCS-07, REL-21 leaves the tag check, the asset check and the snapshot bump to REL-05,
  REL-07 and REL-06, PLAT-12 leaves the branch and package floors to QUAL-03, and DOCS-18 leaves the capture hook to
  QUAL-09. DOCS-05 and DOCS-06 ask for the Welcome page's part only of an app that has one.

### Fixed

- **PWIN-06 and PWIN-07** reference the app template's Pauta window and `help.pautaDocs`, not Editora, which has
  neither. The Pauta window's Copy table matches the template's catalog, with `pauta.link` added and the template's
  wording for the two command descriptions.
- **Shared features** says which rule now holds each feature it listed, and lists the few that aren't rules yet
  (a window moved back on screen, atomic config writes, Settings in the macOS application menu, `SECURITY.md`).
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
- **TRAY-04**'s Check says how macOS's Quit arrives (as a close request on every window, unless the app catches it),
  and its Reference says Torrenta doesn't catch it yet.
- **ACC-01**'s Check covers list cells and menu rows, and says how JavaFX names a `CustomMenuItem` row.
- **ACC-04** names Editora's Project Map flash and checks `AnimationTimer` too.
- MENU-09 and MENU-13 write their keys in backticks, not `<kbd>` tags, which reached the agent files as raw HTML.
- **The family pages** catch up with Termina and Mirada, read again on 2026-11-09: both now have `CONTRIBUTING.md`,
  `docs/README.md`, Help → Documentation, the issue form, Dependabot, Report a Problem and a single instance, and
  Mirada has most of the rest. *Gaps per app* lists only MUSTs under that heading, with Windows signing and Settings
  Sync among the SHOULDs below it, and adds open MUSTs it left out: Inter, a status bar and attestations where they
  are missing, and Torrenta's coverage floor. The matrix's Inter row is no longer labeled a SHOULD (ICON-01 and
  ICON-02 are MUSTs), and the confirm-dialog page records Mirada's and nux's dialogs. The pages are still kept by
  hand until the apps ship `pauta.json`.
- **Rules that leaned on their page** say what they mean or link the section, since agents read them alone: OS-01
  (the table), PAUTA-01 (Complete, Core and Partial), PAUTA-09 (the file), INTL-01 (the six languages), REL-01 (the
  five targets) and TABS-07. `npm run check` fails a rule that points at "the table above".
- **Agent files:** the Changelog page is served as `changelog.md` too, `llms.txt` names `rules.json`'s `url` field
  (it said `address`), and an audit result's `evidence` can't be empty.
- **References and Checks that didn't match the code:** KBD-12 named a method that doesn't exist; TABS-18's Check
  wanted a binding Editora's float command doesn't have, so it now asks for a command; TRAY-09 cited nux, which
  still writes the message into an AppleScript string on macOS; REL-15's Check now accepts a script `release.yml`
  runs, which is how Mirada signs; PERF-19 adds Termina's start-up script.
- **CLI-09** allows the AWT tray TRAY-14 describes, which it contradicted.
- **INTL-05**'s *Why* gives the real reason: JavaFX falls back to whatever font the OS has, so the text differs
  between OSes.
- **Principles** no longer say all of them come from what the apps already do, and principle 4 no longer cites
  "fast first" in Termina, which doesn't say it.
- The checklist's About line reads *Built to Pauta x.y.z*, not an old edition.

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
