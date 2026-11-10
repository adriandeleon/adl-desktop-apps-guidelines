# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and editions are numbered as the [Changelog page](https://pauta-project.dev/latest/changelog/) says: a patch asks
nothing of an app, a minor asks it to add, a major asks it to undo or redo.

## [Unreleased]

### Added

- **CONF-13 · MUST.** Every question has one default button, and it is never the red one: Cancel where the only
  action is destructive, Save where saving is an option. The dialog opens with focus on it, so Enter destroys
  nothing, on every OS. The apps did three different things: Enter runs the red action in Editora's Git
  confirmations, Torrenta's Remove, Mirada's `Confirm` and Termina's removals, answers Cancel in Termina's
  close-running-program question and nux's risky command, and has no default button to press in Editora's
  unsaved-changes and Quit questions. The checklist has the line and *Gaps per app* the four apps.
- **WIN-12 · MUST.** The app has a UI zoom: one setting scales the whole chrome, menus included, applies at once and
  is kept across launches, with commands to zoom in, out and back. Where the app has content of its own to zoom,
  `Ctrl/Cmd +`, `-` and `0` stay with the content zoom and the UI zoom's commands carry no fixed chord; elsewhere
  those chords are the UI zoom. No app has one yet. **WIN-09** keeps the content zoom, still a SHOULD, and
  **MENU-16** follows WIN-12, which it could not do while the zoom it scales with was optional and nowhere built.
  The lines that still called menu fonts "pinned in absolute pixels" say 14 px at the default zoom.
- **WIN-13 · MUST.** Every quit entry point runs one quit method: File → Quit, the quit command and the system's own
  Quit, which on macOS is the application menu's and the Dock's. The rule was TRAY-04's and reached tray apps only;
  **TRAY-04** keeps the tray's part. Only the app template meets it: Editora's macOS Quit still goes to each window.
- **SET-22 · MUST.** A config file is written whole or not at all: to a temporary file beside it, then moved into
  place. Every app's settings store already does it.
- **REL-30 · MUST.** A release is cut only from a commit whose tests passed: the release workflow runs the suite, or
  a preflight reads CI's result for the tagged commit. Every app's release already does one or the other.
- **MENU-18 · SHOULD.** The menu row's metrics, which lived in a table: 34 px rows, a 22 px icon column, the chord
  at least 18 px after the title, and a popup shadow whose offset is at least its radius. The template and Modula
  differ.
- *Same on every OS* gains the rows its "whole list" lacked: the macOS application menu, files opened from the OS,
  file associations, the Trash and high contrast. "Primary modifier" is "Keymap chords", for what KBD-21 allows.
- **REPO-11** (SHOULD): every script in `scripts/` is a Java source file the JDK runs as it is or an `sh` or bash
  script, as in Editora, so building and releasing an app needs no second toolchain. Mirada, Modula and Torrenta
  each have Python scripts that don't meet it yet.

### Changed

- **CONF-05** draws the unsaved-changes question's answers Cancel, Save, Discard, not Save, Discard, Cancel.
  **WIN-11**, a MUST, already put Cancel to the left of the action on every OS, and the two disagreed; WIN-11 wins
  and names the three-answer order too. Editora still draws the old order.
- **CONF-06** leaves the default button of the close-running-program question to CONF-13, and keeps the red Close.
- **PLAT-02 is a SHOULD**: a jlinked runtime in every installer is expected, not required. Mirada ships a GraalVM
  native image on four of its five targets, with no Java runtime at all, and users still install nothing.
- **DOCS-07**'s Help menu has a Welcome Page row, after Documentation, and Simple mode keeps it: **WELC-03** already
  put the page under Help → Welcome Page, and the Help order had no such row. Editora's row is still in its View
  menu.
- **REL-26** asks for `timeout-minutes` on every job that runs steps: GitHub accepts none on a job that calls a
  reusable workflow, so the rule could not be met. Its Check follows the statement, "never a run on the default branch".
- **PLAT-10 requires a Format job of its own**, as REL-19 always did: Spotless's check bound to a build phase is no
  longer enough, and the Command looks for `spotless:check` in a workflow that runs on pull requests. Torrenta and
  Modula, which passed PLAT-10 while failing REL-19, now fail both.
- **Which names in a statement are required.** A command id, a catalog key, a chord, a command-line flag, an
  environment variable, a property in `pom.xml` or `pauta.json`, and a file the repository must carry are required
  as spelled, because a user, the docs or another tool finds the thing by that name. Every other name is Editora's
  spelling and an app's equivalent meets the rule: a Java class, method or constant, a CSS file or style class, a
  branch or workflow file, a config file's name. 5.0.0 listed a style class and any file as required, and its
  statements named `master`, `app.css` and `icon-line` as if they were. The statements are reworded to match:
  "the default branch" in REL-06, REL-19 and REL-26, "the app stylesheet" in KBD-16 and ICON-12, and Editora's
  names marked as Editora's in ICON-19, TABS-02, MENU-12, SET-09, PERF-06, QUAL-07, INTL-07, QOPEN-03, ABOUT-08,
  PWIN-03 and PAUTA-10. The Coding agents page, `llms.txt` and the audit skill state the list.
- **Rules for a feature apply to the apps that have it.** Tabs (an app with a tab strip), tool panels, the toolbar,
  tool window stripes and Settings Sync's rules on the Settings page each open with an *Applies to*, so an app
  without one records nothing, where the template recorded 44 `not-applicable` entries. TABS-10, the window title,
  moves out from under Tabs and still covers every app; SET-15 and MENU-04 say in their own words which apps they
  cover, as do the find bar's filter rules (FIND-03, FIND-13 to FIND-15) and replace rules (FIND-11, FIND-12).
- **FIND-01 names the Debug Log**: a log window is text to search, so every app's Debug Log has a find bar. Only the
  template's does.
- **WIN-03 is for an app with a menu bar**, and on macOS allows an extended window whose header holds no menus, as
  Mirada's is. Modula and nux, with no menu bar, are outside it.
- **ICON-01 and ICON-02 cover Modula**: the page called it "the stated exception" while *Gaps per app* listed the
  gap. Its readings may stay monospace as content; Inter on its menus, settings and dialogs is the gap.
- **One rule per requirement.** Four IDs are retired: **TABS-11** (tabs in the title bar: no app does it, and it
  cannot hold on macOS; nothing replaces it), **DOCS-09** into **KBD-03**, which now says "one-line", **PAUTA-12**
  into **PWIN-01** with ABOUT-09 and PWIN-02, and **TBAR-10** into **MENU-06** with MENU-07. **DOCS-05** leaves the
  bold one-line summary to REPO-02, and **PERF-17** leaves the AOT cache to REL-10 and keeps the `.bss` stylesheets.
- **TRAY-01** asks for a StatusNotifierItem on Linux with no AWT fallback, in place of "the shared `tray/`
  package", which was three diverged copies; Modula's and nux's fall back. **TRAY-09** asks that the text reach the
  notifier as data, an argument or an environment variable a fixed script reads, never as part of a script, so
  Editora and Termina meet it.
- **TRAY-14** and **CLI-09** name AWT's other allowed uses on macOS beside the tray: the dock badge, open-file
  handlers and Move to Trash.
- **CLI-11** no longer names the console launcher `<app>-cli`: any console launcher that runs the same entry point
  passes, and Torrenta's `torrenta-nox` does.
- **CONF-03** adds that a question's buttons are named from the catalog, never JavaFX's stock OK, Yes or Cancel,
  which are worded in the JVM's locale. It was a line in the spec table. Editora still has more than twenty.
- **KBD-06** matches over the title and the id's words or keywords; the description is shown, not matched, which is
  what the apps do.
- **PAL-06**, **PAL-07** and **QOPEN-07** take the active keymap's line, page and cancel chords, as QOPEN-06 does;
  `C-n`, `C-p` and `C-g` are what the Emacs keymap gives, and other things in CUA.
- **SET-08** and **TABS-15** require preferences and session state in separate files; `settings.json` and
  `workspace-state.json` are Editora's names. **SET-04** adds that a setting which waits for a restart says so on
  its row.
- **PERF-11** drops "with a note of what was cut", which no app did where it kept the newest. **REL-03** says
  JReleaser also runs the Homebrew and winget packagers. **DOCS-16** asks for the website's docs in a pull request
  opened with the code's, since they live in another repository, and for `TODO.md` only where the app keeps one.
- **PLAT-11** no longer requires TestFX: FX tests run on JUnit over the Headless glass platform, and TestFX MAY
  drive them. Torrenta, Termina, Modula and nux test that way without it, and failed the MUST only for the
  dependency ([#19](https://github.com/adriandeleon/adl-desktop-apps-guidelines/issues/19)).
- **KBD-09**'s terminal keymap binds no app command to a plain `Ctrl` or `Alt` with a letter off macOS, since those
  belong to the shell, and **KBD-10**'s extra keymaps don't apply to a terminal
  ([#18](https://github.com/adriandeleon/adl-desktop-apps-guidelines/issues/18)).

### Fixed

- **The Confirm dialog's mockups** draw what the rules ask: Close in red in the close-running-program question
  (CONF-06 made it red in 5.0.0 and the drawing stayed plain), and Cancel as the default button of each question.
  The spec's Default button row states the rule instead of listing what each app does.
- **Checks that test what their rules already ask.**
  - **PLAT-01**'s Check and Command no longer demand an enforcer rule the statement never asked for, so Modula and
    nux pass; where the build has one, its range is the open-ended `[25,)`, so Torrenta's `[25,26)` still fails and
    a floor of 26 no longer passes.
  - **PLAT-09** and **PLAT-13**'s Commands fail in a folder with a `pom.xml` and no sources, where they passed.
  - **SET-07**'s Check tests the default folder on each OS, not only the resolver's order, which Mirada has while
    keeping its settings in the OS's own folder.
  - **DIAG-04**'s Check tests the echo message. Termina, Mirada and the template post it; Editora and Torrenta
    don't yet, and the Reference said Termina didn't.
  - **INTL-07**'s Check fails a string literal handed to a control, as Torrenta's `UiStringSweepTest` does; the test
    it named only checks that keys exist.
  - **INTL-12**'s Check fails a value with a placeholder and "(s)", not every "(s)". No app has the test, and
    Editora has 22 such values, not a few.
  - **INTL-13**'s Check covers the catalogs too: Editora writes chords untranslated and still says "Strg" and
    "Mayús" in translated text.
  - **MENU-14**'s Check reads the glyph in a menu-bar row's icon column, since a `CustomMenuItem`'s `getGraphic()`
    is always null.
  - **WIN-11**'s Check asks for an order string with Cancel before every action; "one constant" passed
    `BUTTON_ORDER_WINDOWS`, which puts the action on the left.
  - **DOCS-04**'s Check asks that the site's build or deploy runs the docs check. Nothing in editora-website runs
    `check:docs`, so it never failed the site.
  - **REL-29**'s Check says "on each OS", as its statement does.
- **ACC-02** lists `FIRE`, `EXPAND` and `COLLAPSE`: JavaFX has no `TOGGLE` action.
- **References the code contradicted:**
  - **CLI-11**: Torrenta ships a console launcher on Windows, `torrenta-nox`; "no app prints" was not true.
  - **ABOUT-01**: Editora has no About item in the macOS application menu; Termina and Mirada do.
  - **ABOUT-10**: the app template implements it; it said "no app yet".
  - **ABOUT-05**, **ABOUT-06**, **ABOUT-08** and **PAUTA-17**: Mirada names its edition and has the `## Pauta`
    section too.
  - **ICON-16**: Termina follows the system. **ICON-05**: only Torrenta's `editora-light.css` is stale.
  - **KBD-06** and the palette's spec: Editora scores the title, the id's namespace word and other IDEs' names,
    and shows the description without matching it.
  - **TBAR-01** and **TBAR-03**: Mirada and Termina have naming helpers and read the chord from the keymap.
  - Termina's tabs are not in its title bar: its `HeaderBar` holds the menu bar and the title, and four captions
    said otherwise.
  - **SET-11**: Mirada keeps the backup of a file it cannot decode.
  - **TRAY-01** and the tray page: Modula's and nux's tray code are earlier copies that fall back to AWT on Linux.
  - **TRAY-09**: Editora and Termina pass the text to PowerShell in environment variables, and nux has no toast.
  - **MENU-05** and **MENU-15**: Editora's right-click menus are built by hand; the template's come from the
    registry.
  - **REL-15**: Torrenta launches the app before notarizing it, not after. **REL-16**: Mirada signs its Linux
    downloads in full. **REL-22**: the `v2` in the example is a branch.
  - **PERF-06**: `FxThrottle` is a throttle with no `pending` flag. **DOCS-04**: `WindowCommandRegistrar` holds the
    `Command.of` calls. **WIN-08**: the test named does not touch window geometry.
  - **DIAG-06**: Editora's and Torrenta's reports have no settings summary. **PAL-10**: Mirada matches the sizes
    and reads its prompt from the catalog. **PWIN-05**: the template sorts three kinds and has no `app-only` yet.
  - **FIND-06** says which key goes which way in a terminal, and the find bar's spec says which values are
    Editora's and which Termina's.
- **References that leaned on their page** link the section instead of "the table below": PERF-04, TABS-03,
  MENU-08, TRAY-01, PAL-02, QOPEN-02, WELC-02, ABOUT-04 and SYNC-02.
- **The family pages**, from the code at the commits 5.0.0 pins:
  - **The matrix**: nineteen cells, most in Termina's and Mirada's columns (keymaps, configuration export,
    `--config-dir`, accessible names, AtlantaFX, Keep a Changelog), with Editora's keymap count, its
    confirmations that still say OK, and Modula's notifications.
  - **Gaps per app** adds the open MUSTs it left out: OS-02 and WIN-11 for the whole family, WIN-03, CLI-11 and
    ABOUT-01 where they are missing, and each app's own. It drops two that were not gaps: Mirada's config backup
    and Termina's uncaught-error message.
  - **Shared features**: eleven per-app claims and three rows that pointed at rules that don't hold the feature.
  - **Same on every OS** lists six more differences found in the apps, each with the rule it breaks.
- The platform page's everyday commands say which repos have each: the fat jar is Editora's and the template's,
  and `-Pdist package` builds the app image alone in five repos.
- The overview says nearly every rule names code to copy; eighteen say no app does yet.
- The Markdown download and the PDF show the block to copy into an app's `AGENTS.md` with `## Pauta`, as the page
  and PAUTA-17 do; they had `### Pauta`.

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

[Unreleased]: https://github.com/adriandeleon/adl-desktop-apps-guidelines/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/adriandeleon/adl-desktop-apps-guidelines/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/adriandeleon/adl-desktop-apps-guidelines/releases/tag/v1.0.0
