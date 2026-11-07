# Pauta: the adl desktop apps guidelines

UI, UX and platform rules for adl's JavaFX desktop apps: **Editora**, **Torrenta**, **Termina**, **Modula**,
**Mirada** and **nux**. Editora is the reference implementation.

**MUST** is a release blocker for a new app. **SHOULD** is expected unless the app has a stated reason.
**MAY** is a pattern worth copying when the app grows into it.

**Version 1.4.1 · 2026-11-06** · Web version: <https://pauta-project.dev/>

## Principles

![Editora's keymap picker listing Emacs, CUA, Sublime Text, Visual Studio Code and IntelliJ IDEA over a Java file](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-keymaps.png "Editora's keymap picker: five keymaps bind keys to the same commands.")

These come from what the six apps already do. The first is the reason the family and this guide exist: one
app that is the same on Windows, macOS and Linux. The other twelve are how the apps get there and stay there.
Editora is the reference; each principle names where else it is written down.

### For the people using the apps

1. **Same app on every OS.** A user who moves between Windows, macOS and Linux finds the same features, the
   same commands and keymaps, the same look and the same installer quality, and never relearns the app. Platform
   differences live behind one class, never scattered `if (isMac)` checks. Every other principle serves this one.
2. **Keyboard first.** Every action works without a mouse. The mouse is a shortcut to commands, not the
   other way round.
3. **Every feature is a command.** One registry of commands with ids. Menus, toolbar buttons, the command
   palette and key bindings all run commands by id. Nothing is wired straight to logic.
4. **Speed comes first.** Start-up and the app's core action (typing in Editora, stepping to the next image in
   Mirada, a keystroke reaching the shell in Termina) are the product. When a feature pulls against them, the
   feature loses or waits until it can be made cheap. *(Mirada's "Priorities"; "fast first" in Termina and
   Mirada.)*
5. **The UI never waits.** The JavaFX application thread only touches the scene graph. Disk, network,
   processes, parsing and searching run on other threads and hand their result back; a keystroke, a scroll or a
   window opening never waits for them. See [Performance](../performance/).
6. **Changes apply as they are made.** Settings have no Save button. A change reaches every open window.
7. **Nothing fails silently.** Every failure reaches the status bar, the Message Log or the Debug Log, and
   the user can turn any of it into a GitHub issue.
8. **Never claim what is not true.** No link that looks like a link and does nothing, no "up to date" before
   an update check has answered, no setting that seems to apply when it cannot: a setting that waits for a
   restart says so on its own row. *(Modula's About, Editora's update status, Termina's settings rows.)*
9. **Local first, nothing sent without asking.** No telemetry. The only automatic network call is a
   once-a-day release check the user can turn off. Problem reports are built locally and submitted by the
   user.
10. **Users' data outlives versions.** Config files carry a schema version and migrate forward. An older
    build never overwrites a newer config.

### For the people building them

11. **One source of truth for each fact.** The version lives in `pom.xml` and reaches About, `--version`, the
    update check and problem reports through a filtered `build-info.properties`. A key binding is declared once,
    so the menu and the accelerator cannot disagree. A list that repeats a fact (About's dependencies, the
    coverage table in the docs) has a test that fails when the two drift, in both directions.
    *(Modula's `DependenciesTest`, nux and Torrenta's `AppInfo`, Editora's `BuildHygieneTest`.)*
12. **Separate the decision from the UI, then test it.** Anything with a rule in it (which key does what, sort
    order, when a bar shows, whether a color is legible) is a small pure method or class with its own unit
    tests. UI classes stay thin and only wire decisions to controls. *(Termina, Torrenta, Mirada and nux
    "Conventions"; Editora's pure decision helpers.)* See [Code quality gates](../quality/).
13. **Verify by driving the real app.** UI bugs are visual and none of them throw. Before calling a UI change
    done, run the real window, press the real keys and look at the result, through a capture hook or a
    headless screenshot; reasoning about event order is not evidence. *(Termina and Torrenta's `DevCapture`,
    nux's `--screenshot`, the headless harness behind Editora's website screenshots.)*

## New app checklist

Each group links to the page with the rules and the Editora code to copy. Everything here is a MUST unless it says
SHOULD.

**Start from the template.** [adl-desktop-app-template](https://github.com/adriandeleon/adl-desktop-app-template) is a GitHub template repository that already
ticks every MUST on this list: a small runnable app with its tests, CI and release workflows and every repository
document. Click **Use this template**, then run `scripts/rename.sh <AppName> <package>`.

### Platform

[Platform baseline](../platform/)

- [ ] JDK 25 or newer (`release` 25 is the floor) and JavaFX 27 or newer
- [ ] One JPMS module, `com.<app>`
- [ ] Maven Wrapper committed (`mvnw`, `mvnw.cmd`, `.mvn/wrapper/`)
- [ ] AtlantaFX light and dark themes, following the system by default
- [ ] Inter bundled and attached to every scene and dialog (SHOULD)

### Code quality

[Code quality gates](../quality/)

- [ ] The version comes only from `pom.xml` (filtered `build-info.properties`); lists that repeat a fact have a drift test
- [ ] Rules live in pure, unit-tested helpers; UI classes stay thin
- [ ] A capture hook or headless screenshot drives the real window for UI checks
- [ ] Every package `@NullMarked`; NullAway on Error Prone fails the build
- [ ] Spotless with Palantir Java Format
- [ ] JUnit 5 and headless FX tests (`-Dglass.platform=Headless`), FX tests tagged `fx`
- [ ] JaCoCo check at 0.90 lines and 0.90 methods

### Performance

[Performance](../performance/)

- [ ] No I/O, process, parsing or waiting on the JavaFX application thread; results return through `Platform.runLater`
- [ ] Background results applied under a generation guard; named daemon threads
- [ ] Redraws coalesced to one per pulse; streams delivered in batches
- [ ] Logs, histories and caches bounded; large inputs guarded
- [ ] Only the first frame built before it paints; update check and extras deferred

### Keyboard and commands

[Keyboard first](../keyboard/)

- [ ] One `CommandRegistry`: every action is a command with an id
- [ ] Command Palette as an in-scene overlay, not a `Popup`
- [ ] Emacs and CUA keymaps at least, with user overrides on top
- [ ] One QuickOpen-style picker for every list choice (themes, keymaps, recent items, a setting's values), in the overlay host (SHOULD)
- [ ] A find bar in the scene wherever there is text to search: searches as you type with a count, Enter and Shift+Enter step, Escape closes it and returns focus (`FindReplaceBar`, Termina's `SearchBar`)

### Window shell

[Window shell](../window-shell/) · [Welcome page](../templates/welcome/) · [Confirm dialog](../templates/confirm-dialog/)

- [ ] A Welcome page when there is nothing to restore, or an empty state that names the ways in with their chords (SHOULD)
- [ ] Every destructive action asks first through one helper: the question names the thing, the button names the action in the `danger` style, Escape cancels; or the action is undoable instead

### Icons and color

[Icons and color](../icons-and-color/)

- [ ] Inter attached to every scene by a scene stylesheet; state colors named once on `.root` from the theme's roles, no fixed hex in a component rule
- [ ] Readable text in `-color-fg-muted` or stronger, `-color-fg-emphasis` on an emphasis fill; a pure contrast test over the stylesheets (SHOULD)
- [ ] Icons as themed SVG paths in one `Icons` class, one style class per family, the same glyph for an action everywhere it is reached

### Toolbars and tooltips

[Toolbars and tooltips](../toolbars-and-tooltips/)

- [ ] Icon-only buttons built by one helper that sets the tooltip and the accessible name (`Icons.button`, `Icons.name`)
- [ ] Toolbar buttons out of the Tab order; every tooltip names the command and its chord from the active keymap
- [ ] Groups separated by spacing on one chrome band, no hairlines; a toggle wears `:open` while it is on (SHOULD)

### Tabs and panels

[Tabs and tool panels](../tabs-and-panels/)

- [ ] One tab header carries the states: `•` and amber italic for unsaved, a pin and bold for pinned, muted italic for read-only (`TabHeaders`)
- [ ] Bulk close skips pinned tabs, and Reopen Closed Tab brings the last one back with its caret (`ClosedTabs`)
- [ ] Panels toggled by commands, with side, order and divider positions restored on the next launch (`ToolWindowManager`) (SHOULD)

### Menus

[Menus](../menus/)

- [ ] Menu rows are commands: icon, title and chord from the registry and the active keymap, no `KeyCombination` accelerators
- [ ] Right-click menus close on a press anywhere outside them and never stack (`ContextMenuDismissal` installed at startup)
- [ ] Right-click menus open from the Menu key and Shift+F10 at the selected row (`RowContextMenu`)

### Tray and background

[Tray and background](../tray-and-background/) (for an app that keeps working without its window)

- [ ] The shared `tray/` package: StatusNotifierItem on Linux, AWT elsewhere, created off the FX thread, and the app fully usable without one
- [ ] Closing the window hides it only while an icon is up and the setting says so; Quit is explicit and one path
- [ ] Start at login writes the OS entry (XDG autostart, LaunchAgent, `HKCU` Run) with no setting beside it, `--minimized` behind the icon (SHOULD)
- [ ] Desktop notifications through one `Notifier`, off the FX thread, one switch per event

### Settings

[Settings](../settings/)

- [ ] Settings window with a page sidebar, search and live apply
- [ ] A palette command for every setting
- [ ] Versioned config in `~/.<app>`, with migrations and downgrade backups
- [ ] Export and import of the config folder
- [ ] Settings sync through a Git/GitHub repository (SHOULD)

### Diagnostics

[Diagnostics and support](../diagnostics/)

- [ ] Status-bar echo and Message Log
- [ ] Debug Log with a session file, and an uncaught exception handler
- [ ] Daily update check with an off switch; About shows versions and update status
- [ ] Report a Problem (redacted, prefilled GitHub issue) and `--report`

### Command line and languages

[Command line](../command-line/) · [Internationalization](../i18n/)

- [ ] `--help`, `--version`, `--config-dir`, `--dev`
- [ ] Single instance per config folder
- [ ] At least six message catalogs, with a parity test

### Repository

[Repository documents](../repository/)

- [ ] `README.md` with the badge row and a light/dark hero screenshot
- [ ] `CHANGELOG.md` in Keep a Changelog format
- [ ] MIT `LICENSE`, and `NOTICE` with every third-party license
- [ ] `AGENTS.md`, with a one-line `CLAUDE.md` pointing to it
- [ ] `CONTRIBUTING.md`, `docs/` and `branding/`
- [ ] `.github/ISSUE_TEMPLATE/bug_report.yml`

### Documentation

[Documentation](../documentation/)

- [ ] User docs on the app's website under `/docs/`: Getting started, a page per feature area, the keyboard reference, Settings and an FAQ
- [ ] Help → Documentation as a command (`help.documentation`), first in the Help menu after the Command Palette, and on the Welcome page
- [ ] A one-line `command.<id>.desc` for every command, held by the parity test
- [ ] `docs/README.md` indexes the contributor guides; `AGENTS.md` and `CONTRIBUTING.md` point into it
- [ ] Docs change in the same PR as the code; when they disagree with the code, the code wins and the docs are fixed
- [ ] Deep links from the app open the running version's docs, `/docs/v-<version>/` (SHOULD)
- [ ] Command and keybinding references generated from the source, with a check that quoted ids and chords exist (SHOULD)

### Packaging and signing

[Packaging, signing and release](../release/)

- [ ] jpackage installers through JReleaser: Linux x64 and arm64, macOS arm64 and x64, Windows x64
- [ ] macOS `.dmg` signed with Developer ID, notarized and stapled
- [ ] Linux downloads with `.asc` signatures from the shared release key
- [ ] Build provenance attestations for every download
- [ ] Windows `.msi` Authenticode, once the certificate is chosen (SHOULD)
- [ ] Homebrew cask in `adriandeleon/homebrew-tap` and a winget package `AdrianDeLeon.<App>` (SHOULD)

### CI/CD (GitHub Actions)

[CI/CD](../release/#cicd-github-actions)

- [ ] `ci.yml` on every push and pull request: Format and Build & Test, both required checks for `master`
- [ ] `full-tests.yml` on Linux, macOS and Windows: daily, on a `full-ci` label, before every release (SHOULD)
- [ ] `release.yml` on a `v*` tag that matches the pom, with a `workflow_dispatch` dry run
- [ ] Every third-party action pinned to a commit SHA
- [ ] Dependabot for `github-actions` and `maven`
- [ ] `permissions: contents: read` by default; write only in publishing jobs
- [ ] `timeout-minutes` on every job; superseded pull-request runs canceled
- [ ] Test and coverage reports uploaded; coverage totals in the job summary
- [ ] Signing skipped without secrets, but a tag without them fails
- [ ] A smoke launch of the packaged app on each OS before release

## Platform baseline

| Area | Rule | Level | Editora reference |
|---|---|---|---|
| JDK | **JDK 25 or newer.** `maven.compiler.release` 25 is the floor, not the ceiling: build and bundle a current JDK (the enforcer range is `[25,)`, open-ended). The bundled runtime is jlinked; users never install Java | MUST | `pom.xml` |
| JavaFX | **JavaFX 27 or newer** (`javafx.version` 27 is the floor) | MUST | `pom.xml` |
| Modules | One named JPMS module (`com.<app>`); `module-info.java` opens only what reflection, FXML and Jackson need | SHOULD | `src/main/java/module-info.java` |
| Theme toolkit | **AtlantaFX 3.x** (`atlantafx-base`) for controls; light and dark themes; app CSS uses AtlantaFX `-color-*` tokens, never hex literals | MUST | `ui/Themes.java`, `app.css` |
| UI font | Bundle **Inter** (Regular, Bold, Italic, BoldItalic + `OFL.txt`); register with `Font.loadFont` before any stylesheet; attach `ui-font.css` to every scene and dialog pane. Gives the family one look on every OS | SHOULD | `ui/Fonts.java` |
| Build | **Maven** with the **Maven Wrapper** (`mvnw`, `mvnw.cmd`) committed, so `./mvnw` works on a clean machine | MUST | `mvnw`, `.mvn/wrapper/` |
| Null safety | **JSpecify** annotations, checked by **NullAway** on **Error Prone** at compile time. Every package is `@NullMarked` in its own `package-info.java` | MUST | `docs/conventions.md#null-annotations-jspecify-checked-by-nullaway` |
| Formatting | **Spotless** with Palantir Java Format; CI fails an unformatted change | MUST | `pom.xml` (spotless plugin) |
| Tests | **JUnit 5** + **TestFX** over JavaFX's built-in **Headless** glass platform (`-Dglass.platform=Headless`), so FX tests need no display, no xvfb and no Monocle | MUST | `docs/testing.md`, `FxTestSupport` |
| Coverage | **JaCoCo** `check` at `mvn verify`: **≥ 0.90 lines, ≥ 0.90 methods**, ≥ 0.79 branches, plus per-package floors | MUST | `pom.xml` `jacoco-check` |
| Logging | `java.util.logging`, captured in-app by the Debug Log | SHOULD | `ui/DebugLog.java` |
| JSON config | Jackson POJOs with a `SCHEMA_VERSION` each | SHOULD | `config/Settings`, `config/migration/ConfigSchema.java` |

![Editora's Appearance settings page with font, theme and editor theme choices and a code preview](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-themes-fonts.png "Settings → Appearance in Editora: language, fonts, app theme and editor theme, with a live preview.")

### Everyday commands (identical in every repo)

```bash
./mvnw javafx:run                 # run the app
./mvnw test                       # unit + headless FX tests, writes the JaCoCo report
./mvnw spotless:apply             # format
./mvnw verify                     # full gate: tests, coverage check, NullAway
./mvnw -Pfatjar package           # runnable fat jar for this OS
./mvnw clean -Pdist package       # native installer for this OS (clean is mandatory)
```

The `clean` in every `-Pdist` build is mandatory: incremental compilation can leave synthetic enum-switch
classes out of `target/classes`, and jlink then ships an app whose keyboard fails on the first keypress.

## Repository documents

**Start from the template.** [adl-desktop-app-template](https://github.com/adriandeleon/adl-desktop-app-template) carries an example of every file on this page,
filled in for a placeholder app, `ExampleApp`. `scripts/rename.sh <AppName> <package>` renames it to yours.

| File | What it holds | Level |
|---|---|---|
| `README.md` | A landing page, about 200 lines: logo, badges, one-paragraph pitch, hero screenshot, highlights, install, build, command line, config folder, license. Detail lives on the website. | MUST |
| `CHANGELOG.md` | [Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/) + SemVer. An `## [Unreleased]` section with Added / Changed / Fixed / Removed; each entry opens with a bold one-line summary written for users. | MUST |
| `LICENSE` | MIT, "Copyright (c) 2026 Adrián Arturo De León Saldivar". | MUST |
| `NOTICE` | App name, copyright, "licensed under the MIT License", then every bundled third-party component with its license (Inter is OFL, AtlantaFX is MIT, OpenJFX is GPLv2+CPE…). Ship it inside the installers too. | MUST |
| `AGENTS.md` (+ a one-line `CLAUDE.md` pointing to it) | Operational rules for coding agents: essential commands, worktree-per-task, change checklist. Not a changelog. | MUST |
| `CONTRIBUTING.md` | How to build, test, format, and open a PR. | MUST |
| `docs/` | `architecture.md`, `conventions.md`, `testing.md`, `gotchas.md`, `release.md`, `building-and-packaging.md`, `decisions/` (ADRs). | MUST |
| `TODO.md` | The open list, kept in the same PR as the change. | MAY |
| `.github/ISSUE_TEMPLATE/bug_report.yml` | Issue form whose field ids (`environment`, `report`) the in-app Report a Problem fills. | MUST |
| `branding/` | Source SVG of the icon; generated PNG/ICNS/ICO live in `packaging/`. | MUST |

![Editora's repository root on GitHub: branding, docs, AGENTS.md, CHANGELOG.md, CLAUDE.md, CONTRIBUTING.md, LICENSE, NOTICE, README.md and TODO.md, with the About sidebar](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-github-root.png "Editora's repository root: every file on this page, with the homepage, Readme, MIT license and Contributing links GitHub derives from them.")

### README badges (in this order)

```markdown
[![CI](https://github.com/adriandeleon/<App>/actions/workflows/ci.yml/badge.svg)](…/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/adriandeleon/<App>)](…/releases/latest)
[![License: MIT](https://img.shields.io/github/license/adriandeleon/<App>)](LICENSE)
![Java](https://img.shields.io/badge/Java-25%2B-orange?logo=openjdk&logoColor=white)
![JavaFX](https://img.shields.io/badge/JavaFX-27%2B-1e90ff)
![Platforms](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)
[![Stars](https://img.shields.io/github/stars/adriandeleon/<App>?style=flat)](…/stargazers)
```

![The top of Editora's README on GitHub: logo, title, the badge row, the one-paragraph pitch, the website links and the hero screenshot](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-github-readme.png "The top of Editora's README: logo, badges in this order, a two-sentence pitch, links to the website, then the hero screenshot.")

The hero screenshot is a `<picture>` with a dark `srcset` under `prefers-color-scheme: dark`, so GitHub
shows the screenshot that matches the reader's theme. Screenshots are taken at 2× by a headless harness so
they can be retaken after any UI change. The README states that the app is built with the help of AI
coding tools.

## Documentation

An app ships with its documentation. There are three readers and three places: the person using the app reads the
**website's docs**; the person changing the app reads **`docs/`**; a coding agent reads **`AGENTS.md`**. The README is
the landing page that points to each. None of it is optional, and none of it is written after the fact: a change
that affects what a reader would learn updates the documentation in the same pull request.

Reference: Editora's `AppInfo.docsUrl()`, `WindowCommandRegistrar` (`help.documentation`), `MenuBarModel` (the Help
menu), `WelcomePane` (the Help row), `CommandPalette.docsUrl` and `SettingsFrameBits.helpUrl` (deep links); the
repository's `docs/README.md`, `docs/conventions.md#docs-in-the-same-pr` and `CONTRIBUTING.md`; and the
[editora-website](https://github.com/adriandeleon/editora-website) repository's `src/content/docs/` and `scripts/`.

### User documentation

| Rule | Level | Reference |
|---|---|---|
| **Every app has user documentation.** A *Getting started* page (install, first launch, the first thing to do), one page per feature area, the keyboard reference, the Settings, and an FAQ. Written for the person using the app, in their words, with screenshots from the real window. The README's 200 lines are not it. | MUST | editora-website `src/content/docs/` (43 pages in nine categories, from *Getting started* to *Help*); torrenta-website (19), termina-website (16), mirada-website (11) |
| **It lives on the app's website**, under `/docs/`, in the app's `<app>-website` repository, beside the feature pages, the screenshots, the news posts and the blog. Each docs page is a Markdown file whose frontmatter gives its `category` and `order`; the sidebar, the sitemap and the RSS feed follow. The app's repository never carries a second copy. | MUST | editora-website `README.md` (*Content*); Editora's `AGENTS.md`: "User-facing feature documentation goes to the separate website repository" |
| **Deep links from the app open the running version's docs.** Pages live under `/docs/v-<version>/…`; bare `/docs` and every unversioned slug redirect to the current version, so a link in a page never carries a version and a bump just regenerates `src/lib/version.ts`. The app builds the base from its own version with `-SNAPSHOT` dropped, so a development build points at the release it is working toward instead of a path that would always 404. A release that pointed at another release's docs would claim what is not true ([*Never claim what is not true*](../principles/#for-the-people-using-the-apps)), so this becomes a MUST the day the app links to a specific page. | SHOULD | `AppInfo.docsUrl()`, `releaseVersion()`; editora-website `astro.config.mjs`, `README.md` (*Versioned docs*). The other three sites carry a comment to port these routes when their app first deep-links |
| **Generated where the app is the source.** The Commands and Keybindings pages are generated from the app's `MainController`, `messages.properties` and keymaps; the Roadmap and What's new from `TODO.md` and `CHANGELOG.md`; the version from `pom.xml`. The output is committed, so the site builds without the app checked out. A check fails the site when a docs page quotes a command id that does not exist or a chord that is bound to a different command. One fact, one source ([*One source of truth for each fact*](../principles/#for-the-people-building-them)). | SHOULD | `scripts/GenCommands.java`, `GenRoadmap.java`, `GenFeatures.java`; `scripts/check-doc-commands.mjs` (`npm run check:docs`) |
| **Release notes a user can read.** Each `CHANGELOG.md` entry opens with a bold one-line summary written for users ([Repository documents](../repository/)); the GitHub release carries the section, the Welcome page's *What's New* opens this build's release, and the website's What's new is generated from the same file. | MUST | `AppInfo.releaseNotesUrl()`, `WelcomePane` (`welcome.whatsNew`); editora-website `GenRoadmap.java` |

### Reachable from the app

The documentation is one command away, so nobody has to know the website's address.

| Rule | Level | Reference |
|---|---|---|
| **Help → Documentation** opens the user docs in the browser. It is a command (`help.documentation`), so it is in the palette, bindable and in the menu through the registry like every other row; it is the first row of the Help menu after the Command Palette, and the Welcome page's Help row repeats it. | MUST | `WindowCommandRegistrar` (`help.documentation` → `MainController.openDocumentation()`), `MenuBarModel` (`menubar.help`), `WelcomePane` (`welcome.documentation`) |
| **The Help menu, in this order**: Command Palette · Documentation · Check for Updates · Message Log · Debug Log · Report a Problem · About. Simple mode keeps Command Palette, Documentation and About. An app without a feature drops its row; nothing moves. | SHOULD | `MenuBarModel`, both `MenuSpec("menubar.help", …)` |
| **A keyboard reference in Help**: a searchable window of every key, grouped as the menus are, or the keybinding editor. | SHOULD | Termina's and Mirada's `ShortcutsWindow`; Editora's keybinding editor ([Keyboard first](../keyboard/)) |
| **A one-line description for every command** (`command.<id>.desc`), shown under the title in the palette. It is the in-app documentation of the command and the parity test holds every command to it. | MUST | `messages.properties`, `MessagesTest` ([Code quality gates](../quality/)) |
| **Per-command help from the palette.** With a command highlighted, `C-h` opens its page, `/docs/v-<version>/commands/<id>`; Search Everywhere shares the URL builder so the two pickers can never disagree. | MAY | `CommandPalette.docsUrl`, `setDocsOpener` |
| **Help from a Settings page.** Each page of the Settings window has a *Help for &lt;page&gt;* link to its docs page, from one map of page to slug. | MAY | `SettingsWindow`, `SettingsFrameBits.helpUrl`, `settings.help` |

#### Strings

| Key | English |
|---|---|
| `command.help.documentation` | Documentation |
| `command.help.documentation.desc` | Open the &lt;App&gt; documentation site for this version in your browser. |
| `welcome.documentation` / `welcome.whatsNew` | Documentation / What's New |
| `settings.help` | Help for {0} |

### Developer documentation

| Rule | Level | Reference |
|---|---|---|
| **`docs/` with an index.** `docs/README.md` says who the folder is for (contributors; user docs live on the website), states that the code wins when the two disagree, and lists every guide with one line. The set is the one [Repository documents](../repository/) names: `architecture.md`, `conventions.md`, `testing.md`, `gotchas.md`, `release.md`, `building-and-packaging.md` and `decisions/`. | MUST | Editora's `docs/README.md`; the template's `docs/` |
| **A decision record for every choice a newcomer would question**: a fork, a rejected dependency, a storage format, an escape hatch. One numbered Markdown file, `docs/decisions/NNNN-slug.md`, with the context, the decision and what it costs. | SHOULD | Editora's `docs/decisions/` (18 records, from `0001-richtextfx-fork.md`) |
| **Three files, three jobs.** `AGENTS.md` is the operational guide, kept short (commands, worktree-per-task, the change checklist). `CONTRIBUTING.md` is the short version for a person, pointing into `docs/`. `docs/` holds the durable explanations. Exhaustive history goes to `docs/reference/`, not into any of the three. | MUST | Editora's `AGENTS.md` (*Documentation map*), `CONTRIBUTING.md`, `docs/reference/README.md` |
| **Javadoc sits on its member.** A doc comment above another doc comment documents nothing; a test fails the build on one. Comments say why, not what. | SHOULD | `StackedJavadocTest` |

### Kept in step

| Rule | Level | Reference |
|---|---|---|
| **Docs in the same PR.** A change that affects behavior updates `CHANGELOG.md`, `TODO.md`, the contributor guides it touches and the website's user docs in the same change, never as a follow-up. A reviewer treats a feature PR with no docs change as incomplete. | MUST | `docs/conventions.md#docs-in-the-same-pr`, `CONTRIBUTING.md` (step 4), `AGENTS.md` |
| **When documentation and code disagree, the code wins**, and the documentation is fixed in the same change. The same rule this guide applies to itself. | MUST | Editora's `AGENTS.md`, `docs/README.md` |
| **Screenshots are retaken, not described.** The capture hook renders the real window at 2× after any UI change, for the README (its hero in light and dark), the website and bug reports; a stale screenshot claims what is not true. | SHOULD | `DevCapture` ([Shared features](../family/shared-features/)); Editora's headless harness |
| **The README defers.** About 200 lines: pitch, hero, highlights, install, build, command line, config folder, license, and links into the website's docs. It carries no feature catalog, so it changes only when those facts do. | MUST | [Repository documents](../repository/); `docs/conventions.md#docs-in-the-same-pr` |

## Code quality gates

- **NullAway is an error, not a warning.** Put `@Nullable` on what may be null and fix the report; do not
  suppress it. A new package starts with its own `package-info.java` carrying `@NullMarked`.
- **Coverage floors are a regression net, not a target.** The build-wide floor is 0.90 lines and methods.
  Each package of 300+ lines gets its own floor about three points below its measured level; when a
  package's coverage rises, ratchet its floor up. A test (`BuildHygieneTest`) fails when the documented
  floor table and the pom disagree.
- **Extract the decision, then test it** ([principle 12](../principles/#for-the-people-building-them)). **Prefer a pure decision helper plus unit tests.** Use the headless FX harness only when controller or
  toolkit behavior is the point.
- **Tag FX tests `@Tag("fx")`**, so the pure suite runs alone with `-DexcludedGroups=fx`.
- **Guard tests that pay for themselves across the family:**
  - *Command sweep* runs every registered command in a real headless window (`CommandSweepFxTest`).
  - *Message parity*: every locale has every key; every `command.<id>` has a `.desc` (`MessagesTest`).
  - *Settings round trip*: every switch, number and choice survives a restart (`SettingsRoundTripFxTest`).
  - *Contrast*: text tokens keep their ratios in every theme (`StyleContrastTest`).
  - *Release supply chain*: signing and attestation steps stay where they are (`ReleaseSupplyChainTest`).
- **No sleeps in tests.** Own workers and FX callbacks with a scope (`AsyncTestScope`) and use latches.
- **A test window writes only inside its temp folders**, never in the real home directory. The command sweep
  checks it after running every command (`CommandSweepFxTest.leftInTheHomeDirectory`).
- **Verify UI work in the running app** ([principle 13](../principles/#for-the-people-building-them)): a capture
  hook or headless screenshot of the real window, with real key and mouse events, before a UI change is called
  done.
- **A guard that cannot fail is decoration.** When you add a drift or parity test, break the thing it guards
  once and watch it fail. *(Modula's `DependenciesTest`.)*

## Performance

A desktop app is judged by how it feels under the hand: a key that lags or a window that hangs while it reads a
file is a defect, not a slow feature. These rules come from Editora's
[`docs/performance.md`](https://github.com/adriandeleon/Editora/blob/master/docs/performance.md), the contract
every change on a hot path there must honor.

### The UI thread

| Rule | Level | Editora reference |
|---|---|---|
| **Never block the JavaFX application thread.** No file or network I/O, no process start or wait, no parsing, searching, hashing or JSON of any size on it. No `Thread.sleep`, `Future.get()`, `join()` or `Process.waitFor()` there. | MUST | `docs/performance.md` §1 |
| **Touch the scene graph only on the FX thread.** Background work hands its result back with `Platform.runLater`; nothing else creates, changes or reads live nodes. | MUST | every service |
| **Drop stale results.** A background result is applied under a generation guard, so an answer to an old request never overwrites a newer one. | MUST | `GitService`, `SearchService`, `LatestOnly` |
| **Name your threads and make them daemons**, so a thread dump says what is running and a stray worker never keeps the app alive after its last window closes. | SHOULD | `daemon("my-feature")` |
| **Leave the common ForkJoinPool alone for blocking work.** It has one worker fewer than the machine has cores; a few blocked waits (`CompletableFuture.supplyAsync` of a `waitFor`) starve every other user of it. A `Process` subclass overrides `onExit()`. | MUST | `ExitWatch`, `docs/gotchas.md` |

The canonical shape, used by every Editora service:

```java
private final ExecutorService exec = Executors.newSingleThreadExecutor(daemon("my-feature"));
private final AtomicLong gen = new AtomicLong();

void request(String input, Consumer<Result> onResult) {
    long mine = gen.incrementAndGet();
    exec.submit(() -> {
        Result r = computeOffThread(input);        // heavy work, off the FX thread
        if (mine == gen.get()) {                   // superseded? drop it
            Platform.runLater(() -> {
                if (mine == gen.get()) onResult.accept(r);
            });
        }
    });
}
```

For one-off blocking calls (reading a file, stat-ing a path, starting a process), a virtual thread
(`Thread.ofVirtual().start(…)`) is enough; the result still comes back through `Platform.runLater`.

### Hot paths

Each app names its hot paths: what runs on every keystroke, scroll pulse or progress tick. In Editora they are
typing, scrolling, highlighting, the overlays and the gutter. In Torrenta they are the transfer table's refresh,
in Termina the terminal grid, in Mirada stepping between images.

| Rule | Level | Editora reference |
|---|---|---|
| **Debounce and coalesce.** At most one redraw per pulse, with a `pending` flag; text-driven work waits for typing to pause. Streams (process output, logs, progress) are delivered in batches, at least 16 ms apart, never one `runLater` per line. | MUST | `FxThrottle`, `OutputPump`, `ConsoleAppender` |
| **Work only on what is visible, and only on what changed.** No O(document) or O(list) work per keystroke, scroll or tick; re-process the edited range or the visible rows. Use virtualized controls (`ListView`, `TableView`, a fixed cell size) for anything that can grow. | MUST | `HighlightPass`, `MinimapRows` |
| **Allocate little on a hot path.** Reuse buffers and arrays; cache data a repaint only reads. | SHOULD | minimap stripes |
| **Keep CSS cheap.** No `applyCss()` on a large subtree, stable style classes, and spans of the same style merged before they are applied. | SHOULD | `SpanMerger`, `docs/gotchas.md` |

### Memory and size

| Rule | Level | Editora reference |
|---|---|---|
| **Bound everything that grows**: logs, histories, consoles, caches, undo. Keep the newest, keep a note of what was cut. | MUST | `MessageLog` (200), `DebugLog`, `OutputCap` |
| **Guard large inputs.** Decide by size and shape before loading: turn off expensive features past a threshold, open read-only or capped past another, refuse what will not fit the free heap. | MUST | 5 MB / 50 MB guards, `LoadHeapGuard` |
| **Release what a closed window held**: listeners, timers, executors, file watchers, native resources. A test opens and closes windows and checks nothing is left. | MUST | `FxWindowFixture.dispose`, `ClosedLspManagers` |

### Start-up

| Rule | Level | Editora reference |
|---|---|---|
| **The first frame first.** Build only what the first window shows; tool windows, panels and pages build on first open. | MUST | lazy `ToolWindow` suppliers, `LazyToolWindowsFxTest` |
| **Defer what nobody waits for**: the update check, extra fonts, indexes and caches start after the first frame has painted. | MUST | `UpdateCheckScheduler`, `Fonts.loadRemainingAfterNextPaint` |
| **Read config off the FX thread**, before the toolkit needs it. | SHOULD | the `config-prefetch` thread |
| **Ship precompiled stylesheets (`.bss`) and an AOT cache** trained on a real session. | SHOULD | `css2bss`, `aot_build.java`; Termina's and Mirada's `aot-train.sh` |

### Measure, don't guess

- **Every change on a hot path says what it costs** in its pull request: added FX-thread work, allocation per
  keystroke or scroll, extra layout passes, memory. "Negligible" is an answer; no answer is not.
- **Measure start-up** with a script that takes the median of several cold launches
  (`scripts/measure-startup.sh` in Editora and Mirada) and phase marks in the app (`perf/Startup`).
- **Sample the FX thread** when something stalls (`EDITORA_PERF_SAMPLE=1`), and keep a headless test for each
  hot path that once regressed.
- A suspected regression gets a number before and after, from temporary `System.nanoTime` instrumentation if
  nothing better exists.

## Keyboard first

### Commands

- Every user-facing action is a `Command` (id, title, runnable) registered in one `CommandRegistry`.
- Command ids are dotted and grouped by area: `file.open`, `view.toggleStatusBar`, `help.reportProblem`.
- Titles come from `command.<id>` and palette descriptions from `command.<id>.desc` in the message
  catalogs, so a registered command is localized and discoverable without extra work.
- A command that cannot run in the current context is shown grayed with a tooltip that says why, not
  hidden (`ui/Chrome.java`: `paletteEnabled` and `disabledReason`).

### Command Palette

- **MUST.** Opened by `M-x` in Emacs keymaps and `Ctrl/Cmd+Shift+P` in the others.
- Fuzzy matching over title, id and description; a query that names a command's title outranks a fuzzy
  hit. Each row shows the active key binding. See the [Command Palette template](../templates/command-palette/).
- It is an **in-scene overlay** in the window's root `StackPane`, not a `javafx.stage.Popup`. On Windows a
  Popup does not reliably take OS keyboard focus and the whole app can stop receiving keystrokes.
- The same picker (`QuickOpen`) serves every other list choice: recent files, themes, keymaps, settings
  values.

![Editora's command palette filtered to Git commands](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-palette.png "Editora: M-x over the editor; typing git lists every Git command.")
![Torrenta's command palette listing Rename, Remove and Force Resume with shortcuts](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/torrenta-palette.png "Torrenta: the same palette, filtered to torrent actions with their shortcuts.")
![Termina's command palette over a terminal listing tab commands](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/termina-palette.png "Termina: the palette over a shell session, filtered to tab commands.")

### Keymaps

- Ship presets as JSON resources: Emacs, CUA, IntelliJ, VS Code and Sublime, with `.mac.json` variants
  where Cmd replaces Ctrl.
- Layer order: base keymap → user overrides → plugin keymaps → the user's own bindings again, so the user
  always has the last word (`KeymapLayers`).
- A keymap editor in Settings lists every command with its chord, searchable, with conflict warnings
  (`ui/SettingsKeymapsPage.java`; conflicts from `KeybindingEdits.takenDefaults`).
- Never bake a chord into translated text. Derive the label from the active keymap (`command/ChordFormat.java`,
  the one place a binding is rendered).
- Multi-key prefixes (`C-x …`) show a which-key style hint listing the possible next keys. Editora echoes only the
  pending prefix (`C-x -`) in the status bar (`KeyDispatcher`); no app lists the next keys yet.

![Editora's keymap picker](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-keymaps.png "Keymap: Select… offers Emacs, CUA, Sublime Text, Visual Studio Code and IntelliJ IDEA.")
![Editora's palette filtered to kill commands with Emacs chords](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-emacs.png "M-x kill: each command shows its chord from the active keymap.")
![Termina's keyboard shortcuts window](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/termina-shortcuts.png "Termina's shortcuts reference: every key, grouped by menu.")

### Focus and accessibility

- Every interactive control is reachable with Tab and operable with Space/Enter. Checked in the running app;
  `FocusRingFxTest` holds that every control family draws the focus ring when Tab reaches it.
- Keyboard focus is drawn by one `:focus-visible` block at the end of `app.css`.
- Icon-only buttons are built by a helper (`Icons.button`) that sets both the tooltip and the accessible
  text.
- On/off rows use a keyboard-operable switch (`SettingSwitch`, `TOGGLE_BUTTON` role). A bare AtlantaFX
  `ToggleSwitch` is mouse-only.
- Readable text uses `-color-fg-muted` or stronger; `-color-fg-subtle` (about 3:1) is for disabled or
  decorative text only.
- Rows wrap instead of truncating to "…". Check German at 1024 px wide, by eye: no test catches a cut row.

## Window shell

![Editora's Welcome tab](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-welcome.png "Editora's Welcome page: Start actions with their chords, Recent Projects, Recent Files and Customize.")

- **Status bar**, always present (toggleable). Its left side is the *echo area*: one line of feedback for
  the last action. Errors are red, warnings amber. Clicking it opens the Message Log. Editora's
  `ui/StatusBar.java` (`status-echo-error`, `status-echo-warn`; a click runs `view.messageLog`) and the
  [Message Log template](../templates/message-log/).
- **Themes**: light and dark AtlantaFX themes plus a "follow the system" choice, switchable at run time
  without a restart. Semantic colors: amber = not durable yet (unsaved, read-only), red = broken,
  green = verified or added. Editora's `ui/Themes.java` (`applyAppTheme`) switches at run time and
  `ui/WindowColorScheme.java` tells every window's frame which scheme it is in; Mirada's `ui/Theme.java`
  (`ThemeChoice.SYSTEM`) follows the system's color scheme as it changes.
- **Title bar**: SHOULD use JavaFX 27's `HeaderBar` with `StageStyle.EXTENDED` to put the menu or tabs in
  the title bar, with a decorated-window fallback, and `useSystemMenuBar` on macOS. Editora's
  `ui/ExtendedWindow.java`.
- **Native dialogs** go through one helper (`Dialogs.styled`) because a dialog is its own scene and does
  not inherit the app stylesheet or the UI font.
- **A destructive action asks first, and says what it does.** Removing, deleting, discarding or overwriting
  something the user made goes through one confirm helper (Torrenta's `RemoveConfirm`, Editora's save
  decisions). The question names the thing ("Remove 3 torrents?"), the confirm button names the action
  (Remove, Discard, Overwrite), never OK or Yes, and Escape cancels. Where the action can be undone instead
  (Torrenta's `UndoStack`, Termina's and Editora's reopen-closed-tab), prefer the undo over the question.
- **Welcome page** when there is nothing to restore: Start actions (which run commands), Recent items, a
  Customize block (keymap and theme), Help links. Editora's `ui/WelcomePane.java`; see the
  [Welcome template](../templates/welcome/).
- **About** shows version, build, runtime (Java and JavaFX versions), license, links, and the result of the
  last update check. Editora's `ui/AboutDialog.java`; see the [About template](../templates/about/).
- **Window state**: size, position, maximized state and open items are restored on the next launch; a
  `--no-session` flag skips the restore. Editora's `config/WorkspaceState.java` (`windowX` … `windowMaximized`),
  `ui/WindowSessionCoordinator.java`, and `App.noSessionFlag`.
- **Zoom**: UI and content zoom from the keyboard (`Ctrl/Cmd +`, `-`, `0`), persisted. Editora zooms content:
  `view.textZoomIn`, `view.textZoomOut` and `view.textZoomReset`, kept in `Settings.fontZoom`.
- **Modes** (MAY): Zen (no chrome), Simple (fewer menus for new users), Expert. Editora's
  `ui/WindowChromeCoordinator.java` (`toggleZen`, `applySimpleMode`) over the truth table in `ui/Chrome.java`.

![Mirada with its file name and folder in a HeaderBar title bar, an info panel and a thumbnail strip](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/mirada-main.png "Mirada's HeaderBar title bar carries the file name and folder; the info panel and thumbnails are commands too.")
![Termina window with tabs in the title bar and a tab context menu](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/termina-tabs.png "Termina puts its tabs in the title bar with JavaFX 27's HeaderBar.")
![Editora's View menu open with toggle commands and their chords](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-menu-bar.png "Every menu item is a command and shows its chord.")

## Icons and color

One typeface pair, one palette, one color vocabulary and one way of drawing icons, so a tab, a status segment, a
tree row and a Settings row say the same thing in the same way in every app. Reference: Editora's
`styles/ui-font.css` and `ui/Fonts.java` (type), `styles/atlantafx-themes/editora-light.css` and `editora-dark.css`
(the Caret & Ink palette, which Torrenta and Termina vendor verbatim), the `.root` block at the top of
`styles/app.css` (the state vocabulary), `ui/Themes.java` and `ui/EditorThemes.java` (themes), `ui/Icons.java`,
`ui/FileIcons.java`, `ui/MenuBarIcons.java` and `editor/MenuIcons.java` (icons), and `StyleContrastTest`, which
pins the color rules.

### Type

**Inter speaks, JetBrains Mono works.** Inter is the chrome: menus, buttons, settings, pickers, status bar. The
monospace face is for text that is code or output: the editor, a terminal, the environment block in About, log
timestamps.

| Property | Value | Reference |
|---|---|---|
| UI family | Inter, in four faces, bundled in the app's resources and registered before any CSS is applied | `Fonts.UI`, `Fonts.load()`, `resources/com/editora/fonts/inter/` |
| Root size | 14 px, the AtlantaFX theme's root size; popups pin absolute pixels where an owner's font would leak (see [Menus](../menus/)) | `MainMenuBar.UI_FONT_SIZE` |
| How it is attached | A scene stylesheet (`ui-font.css`, one rule: `.root { -fx-font-family: "Inter" }`) on every window's scene, dialogs and popups included | `App.installUiFont` |
| Monospace | JetBrains Mono by default; Cascadia Code, Fira Code, IBM Plex Mono and Source Code Pro are bundled as editor choices | `Fonts.DEFAULT`, `Fonts.FAMILIES` |

- **MUST.** Attach Inter with a *scene* stylesheet, not a rule in the app stylesheet. Dialogs, the Settings window,
  the palette, context menus and tooltips each live in a scene of their own that does not share `app.css`, and a
  scene sheet is re-applied cleanly when the theme switches at run time (`setUserAgentStylesheet`). AtlantaFX
  neither bundles nor names Inter, and JavaFX does not fall through a font-family list, so without the sheet the
  whole interface renders in the platform's "System" face.
- **MUST.** Bundle the font. Do not map the platform's own UI font (an earlier macOS-only sheet used San Francisco,
  which JavaFX faux-bolds; Inter has a real bold on every platform). Editora's four faces are in
  `src/main/resources/com/editora/fonts/inter/`.
- Termina and Torrenta carry the same sheet and the same four Inter faces. Modula is the stated exception: IBM Plex
  Mono everywhere, because every reading on a radio is a number (see *Before adding a setting* in
  [Settings](../settings/)).
- A line of UI text is `-color-fg-default`; secondary text `-color-fg-muted`. `-color-fg-subtle` is about 3:1 and
  is for disabled or decorative text only (`StyleContrastTest.textThatMustBeReadUsesTheMutedRoleNotSubtle`).

### The palette: Caret & Ink

The flagship theme pair, "Editora Light" and "Editora Dark", is authored (not vendored) and derived from Editora's
icon: a **caret** teal accent, **ink** navy as the text in light and the surface in dark, **porcelain** and **abyss**
grounds, and **brace** periwinkle reserved for the keyboard. Amber, red and green are semantic and never decorate.

<div class="mock-stage">
<div class="m-ic-palette" role="img" aria-label="The Caret and Ink palette: each token's light and dark value">
<div class="m-ic-head"><span></span><span>Light</span><span>Dark</span><span>Token</span></div>
<div class="m-ic-row"><span class="n">Ground</span><span class="m-ic-chip" style="--c:#ffffff"><i>#ffffff</i></span><span class="m-ic-chip" style="--c:#1b1e2a"><i>#1b1e2a</i></span><span class="t">-color-bg-default</span></div>
<div class="m-ic-row"><span class="n">Porcelain / Abyss</span><span class="m-ic-chip" style="--c:#f4f5f9"><i>#f4f5f9</i></span><span class="m-ic-chip" style="--c:#12141d"><i>#12141d</i></span><span class="t">-color-bg-subtle / -color-dark</span></div>
<div class="m-ic-row"><span class="n">Ink</span><span class="m-ic-chip" style="--c:#1b1e2a"><i>#1b1e2a</i></span><span class="m-ic-chip" style="--c:#e8eaf3"><i>#e8eaf3</i></span><span class="t">-color-fg-default</span></div>
<div class="m-ic-row"><span class="n">Muted ink</span><span class="m-ic-chip" style="--c:#575d6e"><i>#575d6e</i></span><span class="m-ic-chip" style="--c:#9ba1b5"><i>#9ba1b5</i></span><span class="t">-color-fg-muted</span></div>
<div class="m-ic-row"><span class="n">Subtle ink</span><span class="m-ic-chip" style="--c:#8b91a3"><i>#8b91a3</i></span><span class="m-ic-chip" style="--c:#6c7288"><i>#6c7288</i></span><span class="t">-color-fg-subtle</span></div>
<div class="m-ic-row"><span class="n">Caret</span><span class="m-ic-chip" style="--c:#0e8577"><i>#0e8577</i></span><span class="m-ic-chip" style="--c:#43dec5"><i>#43dec5</i></span><span class="t">-color-accent-emphasis</span></div>
<div class="m-ic-row"><span class="n">Caret, as text</span><span class="m-ic-chip" style="--c:#0d786b"><i>#0d786b</i></span><span class="m-ic-chip" style="--c:#43dec5"><i>#43dec5</i></span><span class="t">-color-accent-fg</span></div>
<div class="m-ic-row"><span class="n">Amber</span><span class="m-ic-chip" style="--c:#8d6309"><i>#8d6309</i></span><span class="m-ic-chip" style="--c:#e3a93c"><i>#e3a93c</i></span><span class="t">-color-warning-fg</span></div>
<div class="m-ic-row"><span class="n">Red</span><span class="m-ic-chip" style="--c:#c03434"><i>#c03434</i></span><span class="m-ic-chip" style="--c:#ee7a6e"><i>#ee7a6e</i></span><span class="t">-color-danger-fg</span></div>
<div class="m-ic-row"><span class="n">Green</span><span class="m-ic-chip" style="--c:#2c784c"><i>#2c784c</i></span><span class="m-ic-chip" style="--c:#5bc98a"><i>#5bc98a</i></span><span class="t">-color-success-fg</span></div>
<div class="m-ic-row"><span class="n">Brace</span><span class="m-ic-chip" style="--c:#3c4380"><i>#3c4380</i></span><span class="m-ic-chip" style="--c:#b8bee5"><i>#b8bee5</i></span><span class="t">-state-key (a ladder of the ground)</span></div>
</div>
</div>

- The theme files follow the vendored AtlantaFX community themes: a `.root` block of `-color-*` tokens, then
  component rules that reference only those tokens.
- **SHOULD.** A new app ships the pair as its default theme. Torrenta and Termina copy
  `editora-light.css` and `editora-dark.css` unchanged into their own `styles/`; the palette is the family's, not
  the editor's.
- Brace has no AtlantaFX role, so it is a literal: a `ladder()` over `-color-bg-default` that picks a deep ink on a
  light ground and a lighter periwinkle the darker the ground gets, and reads at 4.5:1 or more on every bundled
  theme's default and subtle surfaces (`StyleContrastTest.theKeyboardPeriwinkleReadsOnEveryBundledAppTheme`).

### State colors

A color is a meaning, named once on `.root` and referenced everywhere. The same state wears the same color in a
tab, a status segment, a tree row, a picker and a Settings row.

| Token | Chains to | Meaning | Where it appears |
|---|---|---|---|
| `-state-amber` | `-color-warning-fg` | Not durable yet | An unsaved tab, a read-only file, a narrowed view, a snapshot build |
| `-state-red` | `-color-danger-fg` | Broken | Errors in the echo area and the Message Log, breakpoints, a recording |
| `-state-green` | `-color-success-fg` | Verified | Found, added, passing, running |
| `-state-accent` | `-color-accent-fg` | The app is offering something | An update, a link, the current branch, a selected row's bar |
| `-state-olive`, `-state-violet` | A ladder of the ground | Git only: untracked, renamed | The Project tree and tabs, the Map's structure columns |
| `-state-key` | A ladder of the ground | The keyboard, and nothing else | Chord chips, the menu chord column, brace matching |
| `-state-sel` | `-color-accent-subtle` | The selected overlay row | The palette, pickers, the Message Log (about a 13 % accent wash) |

Each of the first four also has a `-bg` (the role's `-subtle`) and a `-hover` (the role's `-muted`) variant, so a
pill, a row tint and a hover state come from the same place. `.state-pill` is the shape (bold, radius 999, padding
1 × 8); the color variant beside it carries the meaning.

- **MUST.** No fixed hex in a component rule. A hex suits one theme; the roles track every theme for free. A
  severity or debug color that is not a state token fails `StyleContrastTest.severityAndDebugColoursComeFromTheStateTokens`.
- **MUST.** Readable text uses `-color-fg-muted` or stronger, which is 4.5:1 on the default, subtle and overlay
  grounds in both flagship themes. Tinted text (`-color-<role>-fg`) reaches 4.5:1 on its own subtle fill and on
  both grounds.
- **MUST.** Ink on an emphasis fill is `-color-fg-emphasis`, never white: white on the dark accent is 1.68:1.
- **MUST.** One focus ring, `-focus-ring: -color-accent-emphasis`, drawn by the `:focus-visible` block at the end
  of `app.css`, at 3:1 or better on every surface (see [Keyboard first](../keyboard/)).
- A brand hue the theme has no role for (periwinkle, olive, violet) is a `ladder()` of `-color-bg-default`, never a
  fixed pair: the old fixed light hexes read at 3.2:1 on Editora Dark.
- **SHOULD.** A pure test reads the stylesheets and does the WCAG arithmetic, as `StyleContrastTest` does; a
  contrast regression is invisible in a code diff. Mirada's `AccentTest` checks that the accent reads as text on
  both grounds; Termina's `ThemeTest` keeps every chromatic color of its terminal schemes legible.

### Themes

- **MUST.** Light and dark, a "follow the system" choice, and a live switch without a restart (see
  [Window shell](../window-shell/)). The first-run default is **Editora Light** (`Themes.DEFAULT`), which is also
  the fallback for a theme name the app does not know.
- Editora lists 28 app themes: the Caret & Ink pair, AtlantaFX's Primer, Nord, Cupertino and Dracula, and 21
  community themes (Army, Autumn, Blacky, Blue, Browny, Fall, Navy, News, Spring, Summer, Winter, Yacht, with
  light and dark variants) vendored unmodified from the MIT-licensed dlsc `atlantafx-themes` collection. User
  themes under `<config>/themes/` join the list (`Themes.names()`).
- **Editor themes are separate** (`EditorThemes`). The flagship pair carries its own editor stylesheet; every
  community theme is served by one `adaptive` editor theme whose syntax palette is expressed in the theme's own
  `-color-*` tokens, so it follows whatever ground the theme has.
- Semantic colors never decorate: a theme may change the teal, the ground and the ink, but amber still means
  "not durable yet".

![Editora's Settings page for themes and fonts](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-themes-fonts.png "Settings: the theme picker with the Caret & Ink pair first, and the UI and editor fonts.")

### Icons

Every icon is an SVG path drawn in code, colored by the stylesheet so it follows the theme, and returned as a
fresh node per call (a JavaFX node has one parent). There are two families, mid-migration to the UI Kit, and they
are not interchangeable.

<div class="mock-stage">
<div class="m-ic-families" role="img" aria-label="A line glyph and a filled glyph side by side at the toolbar size">
<div class="m-ic-fam"><svg class="line" viewBox="0 0 16 16"><path d="M4.5 2.5h4.6l2.9 2.9v8.1h-7.5zM9.1 2.5v2.9h2.9M8.25 8.2v3.2M6.65 9.8h3.2"/></svg><span class="cap">Line</span><span class="sub">16-unit outline, stroke 1.3, round caps</span><span class="sub"><code>icon-line</code> · <code>-fx-stroke</code></span></div>
<div class="m-ic-fam"><svg class="fill" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg><span class="cap">Filled</span><span class="sub">Material 24 dp, one path, filled</span><span class="sub"><code>toolbar-icon</code> · <code>-fx-fill</code></span></div>
</div>
</div>

| Property | Line family | Filled family | Reference |
|---|---|---|---|
| Source | The UI Kit's 16-unit outline glyphs, drawn for the kit | Material Design 24 dp single-path glyphs (Apache-2.0), plus Simple Icons brand marks (CC0) | `Icons.line`, `Icons.of`, `NOTICE` |
| Style class | `icon-line` | `toolbar-icon` | `app.css` |
| Color | `-fx-stroke: -color-fg-muted`, stroke width 1.3, round caps and joins, fill transparent | `-fx-fill: -color-fg-muted` | `.icon-line`, `.toolbar-icon` |
| Hover, disabled | `-color-fg-default` on hover, `-color-fg-subtle` disabled; every context mirrors the matching rule of the other family | The same | `.button:hover .icon-line`, `.button:hover .toolbar-icon` |
| Drawn size | 16 × 1.2 = 19.2 px (`LINE_SCALE` = `ICON_SCALE` × 24 ÷ 16) | 24 × 0.8 = 19.2 px (`ICON_SCALE`) | `Icons` |
| Used for | The chrome the kit draws: toolbar, tool stripe, tabs, and every action that has a kit glyph | Everything the kit specifies no glyph for: file types, context-menu rows, build-tool and browser brand marks | `Icons`, `FileIcons` |

- **MUST.** One class per family on a node, never both. A line glyph is colored by its stroke, and any
  `X .toolbar-icon` fill rule (there are dozens) would paint its outline solid. A glyph that moves family moves its
  CSS with it.
- **MUST.** The same action wears the same glyph wherever it is reached: Save is one floppy on the toolbar, in the
  File menu and in a tab's menu. `MenuBarIcons` reuses `Icons`; `editor/MenuIcons` (the editor package may not
  depend on `ui`) copies each twin's family and path data verbatim.
- **MUST.** An icon-only control has a name: build it through `Icons.button` or `Icons.toolbarButton`, which set
  the tooltip and the accessible text together (see [Keyboard first](../keyboard/)).
- **SHOULD.** No invented glyph. A row gets an icon only where an existing glyph genuinely depicts it; a picture
  that does not mean the thing beside it has to be read and then discounted. The column stays reserved so a menu
  with a mix stays aligned (see [Menus](../menus/)).
- **File icons** (`FileIcons`): a pure `iconKeyFor(name)` resolves a file name to a key (unit-tested without the
  toolkit), `forFileName` turns the key into a node. Brand logos from Simple Icons, category glyphs (image,
  archive, PDF, table, lock, JSON, settings) from Material, and the generic document glyph for anything unknown, so
  a new type never regresses the look.
- **Licenses.** Every glyph set and font is credited in `NOTICE`: Material Design Icons (Apache-2.0), Simple Icons
  (CC0; the logos stay their owners' trademarks), Octicons and Seti UI (MIT), Inter and the monospace faces (OFL).

#### In the apps

| App | Icons | Size |
|---|---|---|
| Editora | Both families, `ui/Icons`, `FileIcons`, `MenuBarIcons`, `editor/MenuIcons` | 19.2 px on the toolbar and in menus |
| Torrenta | Both families, copied from Editora as `Icons.Glyph`, which knows its box and resizes with `at(px)`; the toolbar is all line glyphs (stroke 1.5, `-torrenta-icon`) | 17 px toolbar, 16 px menu and tab (`MENU_SIZE`), 13 px sidebar |
| Termina | Material filled, `ui/MenuIcons`, colored by `.menu-icon` (`-color-fg-muted`; `-color-fg-default` focused; subtle and half opacity disabled) | 24 × 0.7 = 16.8 px, menus only |
| Mirada | Hand-drawn stroked paths on a 24-unit grid, two-unit strokes, round caps, in GNOME's symbolic style, so nothing carries a license; `.icon` strokes `-color-fg-default` | 16 px, centered in a 16 px box |
| Modula | `Glyphs`: the transport symbols (tune, seek, star) as shapes, because the characters are missing from most faces and render differently on every platform | 11 px |
| nux | No in-window icons; the tray icon is rendered as a bitmap by severity (`TrayIconRenderer`) | Tray only |

## Toolbars and tooltips

A toolbar is the fast path to commands that are also in the [menus](../menus/) and the
[Command Palette](../templates/command-palette/): nothing lives only on it. Every button is a command, so its icon,
title and chord come from the registry and the active keymap. Reference: Editora's `ui/Icons.java` (`button`,
`toolbarButton`, `name`), `ui/ToolbarCoordinator.java` (the customizable bar), `ui/WindowChromeCoordinator.java`
(`collapseToolbarSeparators`), `ui/ToolWindowManager.java` (the tool window stripes) and the `.tool-bar`,
`.toolbar-button`, `.tool-stripe-button` and `.tooltip` rules in `app.css`.

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="tb-new" viewBox="0 0 24 24"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/></symbol>
<symbol id="tb-open" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></symbol>
<symbol id="tb-save" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></symbol>
<symbol id="tb-undo" viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></symbol>
<symbol id="tb-redo" viewBox="0 0 24 24"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></symbol>
<symbol id="tb-find" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></symbol>
<symbol id="tb-palette" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zM7.5 17l-1.41-1.41L8.67 13l-2.59-2.59L7.5 9l4 4-4 4z"/></symbol>
<symbol id="tb-settings" viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></symbol>
</defs></svg>

### Anatomy

<div class="mock-stage">
<div class="m-tb-stage" role="img" aria-label="Mockup of a toolbar: grouped icon buttons, a tooltip under Save, the Find toggle lit, and the pinned tail">
<div class="m-tb-bar">
<span class="m-tb-btn"><svg><use href="#tb-new"/></svg></span>
<span class="m-tb-btn"><svg><use href="#tb-open"/></svg></span>
<span class="m-tb-btn hover"><svg><use href="#tb-save"/></svg><span class="pin out" style="left:5px;top:-24px">1</span></span>
<span class="m-tb-gap"><span class="pin out" style="left:-2px;top:-24px">2</span></span>
<span class="m-tb-btn"><svg><use href="#tb-undo"/></svg></span>
<span class="m-tb-btn"><svg><use href="#tb-redo"/></svg></span>
<span class="m-tb-gap"></span>
<span class="m-tb-btn open"><svg><use href="#tb-find"/></svg><span class="pin out" style="left:5px;top:-24px">4</span></span>
<span class="m-tb-btn"><svg><use href="#tb-palette"/></svg></span>
<span class="m-tb-tail"><span class="m-tb-combo">Project: Editora ▾</span><span class="m-tb-btn"><svg><use href="#tb-settings"/></svg></span><span class="pin out" style="right:-26px;top:5px">6</span></span>
</div>
<div class="m-tb-tabs"><span class="tab on">Main.java</span><span class="tab">pom.xml</span><span class="pin out" style="left:-26px;top:5px">5</span></div>
<div class="m-tb-tip">Save (C-x C-s)<span class="pin out" style="right:-26px;top:3px">3</span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Icon button</strong>, 28 px: padding 3 × 5, radius 4, no border, the glyph in <code>-color-fg-muted</code> and <code>-color-fg-default</code> under the pointer. It has a name even though it shows none: the same string is its tooltip and its accessible text.</span></li>
<li><span class="pin">2</span><span><strong>Group gap.</strong> A vertical <code>Separator</code> node whose line is transparent: its padding is what separates the groups. No drawn rule.</span></li>
<li><span class="pin">3</span><span><strong>Tooltip.</strong> The command's title and its chord in the active keymap, "Save (C-x C-s)". A popup window with the menus' radius 8.</span></li>
<li><span class="pin">4</span><span><strong>Open toggle.</strong> A button whose overlay is showing (Find, the palette, a split) wears <code>:open</code>: an accent-subtle fill and the glyph in the accent color. Simple mode's own button does the same while the mode is on.</span></li>
<li><span class="pin">5</span><span><strong>One band.</strong> The menu bar, the toolbar and the tab strip sit on <code>-color-bg-subtle</code> with no hairline between them; spacing does the grouping.</span></li>
<li><span class="pin">6</span><span><strong>Pinned tail.</strong> The project picker, About and Quit live in their own container beside the <code>ToolBar</code>, so a narrow window overflows the icons (which are all in the menus too) and never the tail.</span></li>
</ol>

### Spec

| Property | Value | Reference |
|---|---|---|
| Button | 28 px high: padding 3 × 5, radius 4, style classes `button-icon flat toolbar-button`; every control on the bar is pinned to 28 px, combos and menu buttons included | `.toolbar-button`, `.tool-bar .combo-box-base` |
| Bar | Padding 5 1 2 6 (asymmetric: the tab strip below adds its own inset); 18 px font for the bar's own labels, controls inside it at 14 px; `-color-bg-subtle`, no rule above or below | `.tool-bar`, `.menu-bar, .tool-bar` |
| Icon | The command's glyph, 17 px drawn (Torrenta) or a kit glyph at the toolbar scale (Editora); `-color-fg-muted`, `-color-fg-default` on hover, `-color-accent-fg` while `:open` | `Icons`, `.toolbar-icon`, `.icon-line`, `.button:open` |
| Group gap | A vertical `Separator` with its line transparent; its 0.75 em padding is the gap | `.tool-bar .separator:vertical > .line` |
| Tail | Its own container (`.toolbar-tail`), same insets and font as the bar, never overflowed | `ToolbarOverflowFxTest` |
| Tooltip | `<title> (<chord>)`, the chord from `KeymapManager.displayChord`; only the title when unbound; radius 8 like the menus | `ToolbarCoordinator.buildExtraButton`, `ToolWindowManager.tooltipFor`, `.tooltip` |
| Stripe button | A toolbar button on the tool window rail: min 24 px, padding 9 × 5, radius 6, 8 px apart on a 30 px rail; the same muted, hover and `:open` colors; the bottom stripe adds a 14 px label | `.tool-stripe-button`, `ToolWindowManager.register` |
| Customize mode | The bar tinted `-color-accent-subtle`, a move cursor, the dragged button at 0.4 opacity, a 2 px accent insertion line on the drop target's edge | `.tool-bar.toolbar-customizing`, `.toolbar-drop-before` |

### Rules

- **MUST. Every icon-only button has a name.** Build it through one helper that sets the tooltip and the accessible
  text from the same string (`Icons.button`, `Icons.name`; Torrenta's copy of both). A hand-rolled button gets the
  tooltip and forgets the name, which is how Editora once had seven copies of the helper drifting apart, and how a
  screen reader comes to announce "button". nux sets both by hand on its "?" button for the same reason.
- **MUST. Toolbar buttons stay out of the Tab order.** `Icons.toolbarButton` sets `focusTraversable` to false: the
  command, the palette and the menus reach the action, and Tab is for the content. Termina's search bar buttons do the
  same. The [keyboard page](../keyboard/#focus-and-accessibility) has the general focus rules.
- **MUST. The tooltip names the command and its chord**, read from the active keymap, never typed into a string:
  "Save (C-x C-s)". Editora's catalog buttons (`ToolbarCoordinator`), its stripe buttons (`ToolWindowManager`),
  Torrenta's `toolbar.withChord` and Mirada's header buttons all format it the same way.
- **SHOULD. Groups by spacing, not rules.** Keep the `Separator` nodes (their padding is the gap) and make the line
  transparent. Hiding a button group (Simple mode, a build tool that is not detected) runs
  `collapseToolbarSeparators`, which hides leading, trailing and doubled separators so no gap is left standing on its
  own, and shows them all again when nothing is hidden.
- **SHOULD. One chrome band.** The menu bar, the toolbar and the tab strip share `-color-bg-subtle` and draw no
  hairline between them; the breadcrumb, the bottom stripe and the status bar do the same at the bottom. Three rules
  within forty pixels read as clutter, not structure.
- **MUST. A toggle looks on while it is on.** A button that opens an overlay (Find, the palette, a split) and the
  Simple mode button carry the `:open` pseudo-class while their state holds, so the way back out does not look like
  the way in. Torrenta uses `:on` for Simple mode and `:active` for the alternative speed limit.
- **MUST. The toolbar never holds the only way to an action.** Every icon in the customizable cluster is also in the
  menus and the palette; that is what makes it safe to hide icons in a narrow window and to let the user remove them.
  Editora's `toolbar/ToolbarCatalog.java` names each item by the id of the command it runs.
- **MAY. A customizable toolbar.** Editora's cluster is a list of catalog ids in Settings (`toolbarLayout`),
  sanitized on read and shared by every window. The bar's right-click menu offers *Customize Toolbar…* (or *Done*),
  *Configure…* (the Settings page) and *Restore Default*. In customize mode the bar tints, buttons drag to reorder with
  an accent insertion line and drag off the bar to remove; Escape leaves the mode. Pinned by
  `ToolbarCustomizeModeFxTest` and `ToolbarCustomizationFxTest`.
- **The bar's right-click menu is one menu**, reused across right-clicks, so showing it again moves it, and
  `ContextMenuDismissal` closes it on a press anywhere, the toolbar included (`ToolbarContextMenuDismissFxTest`). The
  bar runs at 18 px, and a popup inherits the font of the node it was shown from; the `.context-menu` rule that pins
  menus to 14 px is what keeps this menu the size of every other (`ToolbarMenuFontFxTest`). See [Menus](../menus/).
- **Tool window stripes are toolbars.** A stripe button is built like a toolbar button: tooltip with the chord,
  accessible text bound to the window's title, a right-click menu with *Open in Split* and *Hide*. The right stripe's
  first icon lines up with the editor's first line of text, not with the tab strip
  (`ToolWindowStripeAlignmentFxTest`).

### In the apps

- **Editora**: the customizable cluster, the pinned tail, the stripes.
- **Torrenta**: the same `Icons.toolbarButton` and `Icons.name`, 32 px buttons, Simple mode as `:on`; its separators
  still draw a line.
- **Mirada**: a `HeaderBar` title bar with flat icon buttons around the file name, stroked symbolic icons in the text
  color, tooltips of the form "label (chord)"; no accessible names on the buttons.
- **Termina**: no main toolbar (its tabs are in the title bar); the search bar's buttons are 24 × 22 flat icons with
  tooltips, out of the Tab order.

![Editora editing a Java file with the project tree and status bar](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-hero.png "Editora's toolbar: grouped icons on the chrome band, the project picker and Quit pinned at the right.")
![Mirada with its file name and folder in a HeaderBar title bar, an info panel and a thumbnail strip](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/mirada-main.png "Mirada's HeaderBar: flat icon buttons around the file name.")

## Tabs and tool panels

A window shows its documents in a **tab strip** and its tools in **panels** docked beside or under them. Both are
driven by commands, both remember their state, and both draw their chrome as one band with the toolbar, not as boxes
inside boxes. Reference: Editora's `ui/TabHeaders.java` (the tab header), `ui/ClosedTabs.java`, `ui/Switcher.java`,
`ui/ToolWindowManager.java`, `ui/ToolWindowPanel.java` and the `.tab-pane`, `.tool-stripe` and `.tool-window`
rules in `app.css`.

<div class="mock-stage">
<div class="m-tp-window" role="img" aria-label="Mockup of a tab strip with pinned, active, unsaved, read-only and dragged tabs over a tool panel beside the editor">
<div class="m-tp-tabs">
<span class="m-tp-tab pinned"><svg class="pinicon" viewBox="0 0 24 24"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg><span class="ic"></span>pom.xml<span class="pin out" style="left:-8px;top:-10px">3</span></span>
<span class="m-tp-tab on"><span class="ic on"></span>Main.java<span class="x">×</span><span class="pin out" style="right:-8px;top:-10px">1</span></span>
<span class="m-tp-tab dirty"><span class="ic"></span>• notes.md<span class="pin out" style="right:-8px;top:-10px">2</span></span>
<span class="m-tp-tab readonly"><span class="ic"></span>LICENSE<span class="pin out" style="right:-8px;top:-10px">4</span></span>
<span class="m-tp-tab dragging"><span class="ic"></span>Util.java</span>
<span class="m-tp-tab dropbefore"><span class="ic"></span>README.md<span class="pin out" style="right:-8px;top:-10px">5</span></span>
</div>
<div class="m-tp-body">
<div class="m-tp-stripe"><span class="sb open"><svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg></span><span class="sb"><svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg></span><span class="sb"><svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg></span><span class="pin out" style="left:-12px;bottom:-4px">6</span></div>
<div class="m-tp-panel">
<div class="hdr"><svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg><span class="title">Project</span><span class="m-grow"></span><span class="btn">▭</span><span class="btn">⤢</span><span class="btn">×</span><span class="pin out" style="right:-10px;top:-10px">7</span></div>
<div class="body"><div class="row">▾ <b>editora</b></div><div class="row l1">▾ src</div><div class="row l2 sel">Main.java</div><div class="row l2">Util.java</div><div class="row l1">▸ docs</div><div class="row l1">pom.xml</div><div class="row l1">README.md</div></div>
</div>
<div class="m-tp-divider"><span class="pin out" style="left:-6px;top:118px">8</span></div>
<div class="m-tp-editor"><div class="ln">1</div><div class="code"><span class="kw">package</span> com.editora;</div><div class="ln">2</div><div class="code"></div><div class="ln">3</div><div class="code"><span class="kw">public final class</span> Main {</div><div class="ln">4</div><div class="code">    <span class="kw">static void</span> main() {</div><div class="ln">5</div><div class="code">        IO.println(<span class="str">"ready"</span>);</div><div class="ln">6</div><div class="code">    }</div><div class="ln">7</div><div class="code">}</div></div>
</div>
<div class="m-tp-bottom"><span class="bb open"><span class="dot"></span>Terminal</span><span class="bb"><span class="dot"></span>Problems</span><span class="bb"><span class="dot"></span>Run</span><span class="bb"><span class="dot"></span>Git</span><span class="pin out" style="right:-10px;top:3px">9</span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Active tab.</strong> Its fill is the editor's own surface (<code>-editor-surface</code>) with a border on three sides and none at the bottom, so the tab opens into the editor instead of sitting on it. Title bold in <code>-color-fg-default</code>; the file-type glyph tints accent.</span></li>
<li><span class="pin">2</span><span><strong>Unsaved tab.</strong> A <code>•</code> before the name, amber (<code>-state-amber</code>, "not durable yet") and italic. Amber outranks the Git-status color: "you have not saved this" matters more than "this differs from HEAD".</span></li>
<li><span class="pin">3</span><span><strong>Pinned tab.</strong> A pin glyph and a bold title, kept at the front of the strip in pin order. Every bulk close (Others, All, Unmodified, Left, Right) skips it.</span></li>
<li><span class="pin">4</span><span><strong>Read-only tab.</strong> Muted and italic, echoing the status bar's Read-Only segment.</span></li>
<li><span class="pin">5</span><span><strong>Drag to reorder.</strong> The header is the drag handle and a snapshot of the whole tab follows the pointer; the dragged tab dims to 40 % and a 2 px accent line marks the edge it would land on (left half of a tab: before it; right half: after).</span></li>
<li><span class="pin">6</span><span><strong>Tool stripe.</strong> A 30 px rail of icon buttons, one per tool window, 8 px apart, on the subtle ground with no drawn edge. The open window's button is tinted; the one holding keyboard focus is tinted stronger. The first icon lines up with the editor's first line of text, not with the tab strip.</span></li>
<li><span class="pin">7</span><span><strong>Panel header.</strong> The window's glyph and title (14 px bold, muted) with float, maximize and close; the same size and glyph as its stripe button, so the two name the same thing. On the subtle ground, with no rule under it; when the panel holds focus the band tints accent-subtle and the title turns accent.</span></li>
<li><span class="pin">8</span><span><strong>The divider is the edge.</strong> The panel draws no frame: the SplitPane divider between it and the editor is the real, grabbable edge, and a hairline beside it would only double it. Its position is remembered.</span></li>
<li><span class="pin">9</span><span><strong>Bottom stripe.</strong> Its buttons carry a 14 px label beside the glyph, side by side; the open one is accent and bold.</span></li>
</ol>

### Tabs

- **MUST.** Every tab operation is a command, so it has a chord, a palette entry and a menu row: close, close others,
  close all, close unmodified, close to the left and right, pin, reopen closed, next and previous. The tab's
  [right-click menu](../menus/) lists them (`TabContextMenu`).
- **MUST. The header is the title.** The Tab's own text stays empty; a graphic header carries the file-type glyph,
  the markers and the title in a `.tab-title` label, which is what makes it a drag handle and lets each state set
  its own color (`TabHeaders`). The tooltip is the full path.
- **MUST. Bulk close skips pinned tabs.** `closeOtherTabs`, `closeAllTabs`, `closeUnmodifiedTabs` and
  `eligibleToLeft` / `eligibleToRight` all filter on the pinned set; a pinned tab cannot be closed by accident. Pinning
  moves the tab to the end of the pinned group, unpinning to just after it (`togglePin`, `moveToPinBoundary`).
- **MUST. Reopen Closed Tab.** `ClosedTabs` keeps the files whose tabs this window closed, newest first, bounded to
  twenty, a file listed once; reopening restores the caret. Termina brings back the *tab* (its shells, their
  directories, the pane arrangement, the names the user gave them, its place in the strip) and not the scrollback,
  because the process is gone and pretending otherwise would be worse than saying so. `C-S-t` in the CUA keymap;
  Termina `Ctrl+Shift+Z`, `Cmd+Z` on macOS.
- **Drag to reorder** with the feedback above (`TabHeaders.enableTabDrag`; Termina `installTabDrag` and the pure
  `TabReorder.insertIndex`). In Termina a double-click on a tab renames it, and a pane dragged onto a tab joins it
  (the whole header outlined, `tab-drop-into`).
- **Git status on the tab** in the Project tree's colors: modified accent, added green, untracked olive, renamed
  violet, deleted muted, conflict red (`TabGitStatus`). A read-only tab still shows it; an unsaved one shows amber.
- **Switcher.** `C-x C-b` (Emacs) opens an IntelliJ-style list of the open files in tab order: `C-n` / `C-p` or the
  arrows move, Enter or releasing Ctrl activates, `C-g` or Esc cancels, `C-d` or Backspace closes the highlighted
  file. Its width is fixed to the longest path on each open so it never resizes while you move (`Switcher`).
- **The window title** names the file, the project and the app, with a `•` prefix for an unsaved file.
- **Tabs in the title bar** (SHOULD) through JavaFX 27's `HeaderBar`; see [Window shell](../window-shell/). The tab
  bar can be hidden by a command (`view.toggleTabBar`, `.tab-pane.no-tab-header`).

![Termina window with tabs in the title bar and a tab context menu](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/termina-tabs.png "Termina's tabs in the title bar, with a tab's right-click menu.")

### Tool panels

- **MUST. A command toggles each panel** (`tool.<id>`: `M-1` … `M-0` in the Emacs keymap for ten of them),
  and the stripe button is the same command with a glyph. The panel's content is built on first use.
- **MUST. State is restored.** Which windows are open, on which side, in what order, hidden or shown, floating, and
  every divider position go to `workspace-state.json` and come back on the next launch (`ToolWindowManager`).
- **Three sides, two windows each.** Left, right and bottom stripes (`ToolWindow.Side`); a side holds at most two
  windows stacked (Project over Structure, two consoles along the bottom), because "past that a side stops being a
  dock and becomes a list of slivers" (`MAX_PER_SIDE`).
- **Re-dock by dragging the stripe button** to another stripe, with the same dim-and-accent-line feedback as a tab;
  an empty stripe appears as a dashed accent drop zone for the duration of the drag (`ToolWindowDock`).
- **Float, maximize, resize and close from the keyboard**: `view.maximizeToolWindow` (`C-x f`),
  `view.closeFocusedToolWindow` (`C-x 0`), the resize commands (`C-x S-.`, `C-x S-,`, `C-x S-6`). At most one
  window is maximized at a time.
- **Focus comes back.** Closing the panel that holds keyboard focus returns it to where it was in the editor
  (`focusEditor`, a weak reference to the last editor focus owner).
- **Hidden is not unavailable.** The user's show/hide choice for a stripe button is kept apart from a context-driven
  hide (the Commit window outside a Git repository), so the second never clobbers the first (`ToolWindowVisibility`).
- **A bottom window that is unusable at the default height asks for more on its first open**
  (`setFirstOpenShare`); the user's own size wins afterwards. A stripe button badges a spinner while its window has
  something under way (`busy`).
- **Panels follow the active document where they should**: the Git UI follows the active tab's repository
  (`GitPathScope`), the status bar's environment segment the active `.http` file, Local History the file whose tab
  menu opened it.

The other apps dock their panels the same way without a stripe. Torrenta's filter **sidebar** sits down the left or
the right of the list or nowhere, kept as two settings keys so hiding it keeps its side (`SidebarPlace`); its inner
edge drags to resize within readable bounds and a double-click resets it (`SidebarWidth`); the **detail pane** docks
under the list in two columns or beside it in one, from the View menu (`DetailPane`). Mirada's info panel opens on
the right and its thumbnail strip along the bottom or down the left side, each closed until its command asks for it
(`ThumbnailStrip.place`). Termina splits a tab into **panes** instead: a pane is picked up with a drag while
`Ctrl+Alt+Shift` (`Cmd+Option+Shift` on macOS) is held, since every smaller chord is spoken for (`PaneDrag`), and a
maximized pane wears a "Pane 2 of 3" badge so the others are known to still be there.

![Editora editing a Java file with the project tree and status bar](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-hero.png "Editora: the Project tool window docked left of the editor, its stripe on the window's edge.")
![Mirada with its file name and folder in a HeaderBar title bar, an info panel and a thumbnail strip](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/mirada-main.png "Mirada: the info panel on the right and the thumbnail strip along the bottom, both commands.")
![Torrenta's transfer list with a details pane and speed graph](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/torrenta-main.png "Torrenta: the filter sidebar beside the list and the detail pane under it.")

### Spec

| Property | Value | Reference |
|---|---|---|
| Tab strip | `-color-bg-subtle`, padding 3 10 0 10, tabs bottom-aligned so the active one touches the editor; no bottom rule | `.tab-pane > .tab-header-area` |
| Tab | Transparent, square corners, padding 2 11 3 11; hover `-color-bg-inset` | `.headers-region > .tab` |
| Active tab | Two background layers: `-color-border-default` outside, `-editor-surface` inset 1 1 0 1; title bold `-color-fg-default`; glyph `-color-accent-fg` | `.tab:selected` |
| Title | Inter 14 px, `-color-fg-muted`, in a graphic label; the full path as tooltip | `.tab .tab-title`, `TabHeaders.tooltip` |
| Unsaved | `• ` prefix, `-state-amber`, italic | `.tab-header.dirty .tab-title` |
| Pinned | `Icons.pin()` in the header, bold; first in the strip | `.tab-header.pinned`, `togglePin` |
| Read-only | `-color-fg-muted`, italic | `.tab-header.read-only` |
| Drag | Dragged header at 0.4 opacity; 2 px `-color-accent-emphasis` on the landing edge | `.tab-dragging`, `.tab-drop-before`, `.tab-drop-after` |
| Closed tabs | Twenty, newest first, one entry per file, with the caret | `ClosedTabs.DEFAULT_CAPACITY` |
| Switcher | 26 px rows, 12 visible, width fixed per open | `Switcher.CELL_HEIGHT`, `MAX_VISIBLE` |
| Tool stripe | 30 px wide, `-color-bg-subtle`, 8 px spacing, no edge; buttons min 24, padding 9 5, radius 6 | `.tool-stripe`, `.tool-stripe-button` |
| Stripe states | Open: `-color-accent-subtle` fill, accent glyph. Focused window: `-state-accent-hover` | `:open`, `:tw-active` |
| Bottom stripe | Label 14 px beside the glyph, padding 3 8; open = accent, bold | `.tool-stripe-horizontal .tool-stripe-button` |
| Panel | `-color-bg-subtle` ground, radius 0 0 8 8, no border | `.tool-window` |
| Panel header | Padding 6 6 6 12, radius 7 7 0 0, no rule under it; title 14 px bold muted with the window's glyph; active: `-color-accent-subtle` band, accent title | `.tool-window-header`, `.tool-window:active` |
| Panel content | `-color-bg-default`, padding 8; its tree or list draws no frame of its own | `.tool-window-content` |
| Per side | Two windows at most, stacked in an inner SplitPane | `MAX_PER_SIDE` |
| Persisted | Open state, sides, order, visibility, floating windows, divider positions | `WorkspaceState` in `workspace-state.json` |

## Menus

Two surfaces show the same rows: the **menu bar**, a browsable map of every command, and **right-click menus**, what
can be done with the thing under the pointer. Both are built from the [command registry](../keyboard/), so a row's
title, icon, chord and enabled state come from the command and never drift from the palette or the toolbar.
Reference: Editora's `ui/MainMenuBar.java` (menu bar), `ui/ContextMenuDismissal.java`, `ui/LazyContextMenu.java`,
`ui/RowContextMenu.java` and `ui/TabContextMenu.java` (right-click menus), and the `.menu-item` and `.context-menu`
rules in `app.css`.

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-open" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></symbol>
<symbol id="i-save" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></symbol>
<symbol id="i-saveas" viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8v-2H5V5h10v4h4v2h2V7l-4-4zm-5 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm7 2v2h-2v2h2v2h2v-2h2v-2h-2v-2h-2z"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></symbol>
<symbol id="i-print" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></symbol>
<symbol id="i-recent" viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></symbol>
<symbol id="i-quit" viewBox="0 0 24 24"><path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></symbol>
<symbol id="i-lock" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></symbol>
<symbol id="i-closeall" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></symbol>
<symbol id="i-git" viewBox="0 0 24 24"><path d="M6 2a3 3 0 0 0-1 5.83v8.34A3 3 0 1 0 7 16.17V12.4c.6.37 1.3.6 2 .6h4a3 3 0 0 0 3-3v-.17A3 3 0 1 0 14 9.83V10a1 1 0 0 1-1 1H9a2 2 0 0 1-2-2V7.83A3 3 0 0 0 6 2z"/></symbol>
<symbol id="i-terminal" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zM7.5 17l-1.41-1.41L8.67 13l-2.59-2.59L7.5 9l4 4-4 4z"/></symbol>
<symbol id="i-copy" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></symbol>
<symbol id="i-rename" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></symbol>
</defs></svg>

### Look and feel

Both surfaces draw their rows the same way. Absolute pixels are deliberate: a popup inherits the font of the node it
was opened from, and `em` would resolve against a file tree's or an 18 px toolbar's size (Editora's toolbar menu once
rendered a third larger than every other menu in the app).

| Property | Value | Reference |
|---|---|---|
| Font | Inter 14 px, regular, in every row and label | `.context-menu`, `.context-menu .menu-item .label` in `app.css`; `MainMenuBar.UI_FONT_SIZE` |
| Row | 34 px high: padding 8 × 12, the same in every theme | `.menu-item { -fx-padding: 8px 12px }` |
| Icon column | 22 px, reserved even when the row has no glyph, so a menu with a mix stays aligned; 8 px to the title | `MainMenuBar.ICON_COLUMN`, `rowContent` |
| Icon | The command's glyph, the same one as on the toolbar and in the palette (Save is the same floppy everywhere), filled `-color-fg-muted` | `Icons`, `MenuBarIcons`, `.toolbar-icon` |
| Title | `-color-fg-default` | `.menu-item-title` |
| Chord | Right-aligned in its own column, 11 px, in the keyboard color (`-state-key`, brace periwinkle); at least 18 px from the title column | `.menu-item-chord`, `alignChordColumns` |
| Submenu row | Laid out like a command row, with an invisible chord as wide as the menu's widest, so the arrow lands at the right edge | `nestedMenu`, `.menu-submenu` |
| Card | Radius 8; shadow `rgba(27,30,42,0.28)`, radius 16, **offset Y 16** | `.context-menu` |
| Danger item | Text in `-color-danger-fg` | `.menu-item.danger` |
| Disabled item | The theme's dimmed label, and the icon dimmed with it | Termina's `.menu-item:disabled .menu-icon` |
| Separators | Never two in a row and none at either end: when items hide, their orphaned separators hide too | `LazyContextMenu.collapseSeparators`, Torrenta's `MenuSeparators` |

The shadow's offset is not cosmetic. A menu is a native window sized to its root *including the effect*, so a shadow
that reaches above the menu is invisible window over the bar the menu hangs from, and the pointer lands on it instead
of the next menu button. The offset must be at least the radius; Editora pins it with `MenuPopupBoundsFxTest`.

### The menu bar

<div class="mock-stage">
<div class="m-menubar-stage" role="img" aria-label="Mockup of the File menu open under the menu bar">
<div class="m-menubar"><span class="mb on">File<span class="pin out" style="left:-26px;top:3px">1</span></span><span class="mb">Edit</span><span class="mb">View</span><span class="mb">Find</span><span class="mb">Go</span><span class="mb">Run</span><span class="mb">Git</span><span class="mb">Tools</span><span class="mb">Window</span><span class="mb">Help</span></div>
<div class="m-card m-menu">
<div class="mi"><span class="ic"><svg><use href="#i-open"/></svg></span><span class="t">Open…</span><span class="k">C-x C-f</span><span class="pin out" style="left:-26px">2</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-save"/></svg></span><span class="t">Save <span class="pin" style="margin-left:6px">3</span></span><span class="k">C-x C-s</span><span class="pin out" style="right:-26px">4</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-saveas"/></svg></span><span class="t">Save As…</span><span class="k">C-x C-w</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-close"/></svg></span><span class="t">Close</span><span class="k">C-x k</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-print"/></svg></span><span class="t">Print…</span><span class="k"></span><span class="pin out" style="right:-26px">5</span></div>
<div class="sep"></div>
<div class="mi sub"><span class="ic"><svg><use href="#i-recent"/></svg></span><span class="t">Recent Files</span><span class="k ghost">C-x C-w</span><span class="arrow">›</span><span class="pin out" style="right:-26px">6</span></div>
<div class="sep"></div>
<div class="mi"><span class="ic"><svg><use href="#i-quit"/></svg></span><span class="t">Quit</span><span class="k">C-x C-c</span></div>
<span class="pin out" style="left:-26px;bottom:-4px">7</span>
</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Menu button.</strong> Padding 3 × 10 on a bar with 4 px side insets; the bar and the toolbar share one <code>-color-bg-subtle</code> band with no rule under it.</span></li>
<li><span class="pin">2</span><span><strong>Icon column</strong>, 22 px. A glyph only where an existing icon genuinely depicts the command; about half of Editora's rows have one. An invented glyph is worse than none, so the rest keep an empty column of the same width.</span></li>
<li><span class="pin">3</span><span><strong>Title</strong>, 14 px Inter, the command's title with the menu's own name dropped ("Save", not "File: Save") unless two rows would then read the same.</span></li>
<li><span class="pin">4</span><span><strong>Chord column.</strong> 11 px, periwinkle, right-aligned into one column per menu (not app-wide), read from the active keymap. Drawn by the app, not a JavaFX accelerator: Emacs chords are multi-key, which a <code>KeyCombination</code> cannot express, and on macOS an accelerator would bypass the key dispatcher.</span></li>
<li><span class="pin">5</span><span><strong>Unbound command.</strong> An empty chord cell, never a wrong chord. A live keymap switch rewrites every cell.</span></li>
<li><span class="pin">6</span><span><strong>Submenu row.</strong> Icon, title and an invisible chord as wide as the menu's widest, so its arrow sits at the right edge instead of halfway across.</span></li>
<li><span class="pin">7</span><span><strong>Card.</strong> Radius 8; the shadow falls below the menu (offset ≥ radius), so nothing invisible covers the bar.</span></li>
</ol>

- **MUST.** Every item is a command from the registry, with its title from `command.<id>`, its chord from the
  active keymap and its enabled state from the command's gate. The bar assembles and refreshes; it holds no
  behavior of its own (`MenuBarModel` over `CommandRegistry`).
- **MUST.** No `KeyCombination` accelerators. In the in-window bar each row is a `CustomMenuItem` laying out
  icon, title, spacer and chord. On the **macOS system menu bar** (`useSystemMenuBar`) the native menu draws text
  only and no graphics, so there the chord is appended to the title and rows carry no icon, which is also the
  platform's convention.
- **Enablement is re-read on every open** (`refreshEnablement`), titles and chords on a keymap or locale change.
  A menu built before Git finished detecting a repository must not stay grayed out.
- **Simple mode** shows a shorter menu, rebuilt only when the mode actually changes (`MainMenuBar.setSimple`,
  `MenuBarModel.menus(simple)`).

![Editora's View menu open with toggle commands and their chords](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-menu-bar.png "Editora's View menu: icons where a glyph fits, chords in one periwinkle column. An earlier build: rows now drop the menu's own name from their titles.")

### Right-click menus

<span class="lvl lvl-must">MUST</span> on every list row, tree row, tab, editor and read-only console: the actions for
*that* thing, each one a command. The mockup is an editor tab's menu, shortened; Editora's has twenty-five rows.

<div class="mock-stage">
<div class="m-ctx-stage" role="img" aria-label="Mockup of a tab's right-click menu">
<div class="m-tabs"><span class="tab on">Main.java<span class="x">×</span></span><span class="tab">pom.xml</span><span class="tab dirty">README.md</span></div>
<div class="m-card m-menu ctx">
<span class="pin out" style="left:-10px;top:-10px">1</span>
<div class="mi off"><span class="ic"><svg><use href="#i-save"/></svg></span><span class="t">Save</span><span class="pin out" style="right:-26px">3</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-saveas"/></svg></span><span class="t">Save As…</span><span class="pin out" style="left:-26px">2</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-lock"/></svg></span><span class="t">Encrypt…</span><span class="pin out" style="right:-26px">6</span></div>
<div class="sep"></div>
<div class="mi"><span class="ic"><svg><use href="#i-close"/></svg></span><span class="t">Close</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-closeall"/></svg></span><span class="t">Close Others</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-closeall"/></svg></span><span class="t">Close All</span></div>
<div class="sep"><span class="pin out" style="right:-26px;top:-9px">4</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-recent"/></svg></span><span class="t">Local History</span></div>
<div class="mi sub"><span class="ic"><svg><use href="#i-git"/></svg></span><span class="t">Git</span><span class="arrow">›</span><span class="pin out" style="right:-26px">5</span></div>
<div class="sep"></div>
<div class="mi"><span class="ic"><svg><use href="#i-terminal"/></svg></span><span class="t">Open Terminal Here</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-copy"/></svg></span><span class="t">Copy Path</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-pin"/></svg></span><span class="t">Pin Tab</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-rename"/></svg></span><span class="t">Rename…</span></div>
</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Anchored at the pointer.</strong> The menu's top-left corner is the click. From the keyboard (Menu key or <kbd>Shift+F10</kbd>) it opens under the selected row, a quarter of the way in and never off a narrow one, or just below the caret in an editor; never in the middle of the control.</span></li>
<li><span class="pin">2</span><span><strong>Every row has an icon</strong>, the command's own. The one exception is a <code>CheckMenuItem</code>, whose tick lives in the graphic column.</span></li>
<li><span class="pin">3</span><span><strong>Grayed, not hidden.</strong> An action that does not apply right now (Save on an unchanged file, Reveal on an unsaved one) stays in place, dimmed. Only a row that cannot apply to this thing at all is hidden (the Git submenu on an untitled buffer).</span></li>
<li><span class="pin">4</span><span><strong>Separators</strong> group the rows; one that hiding has left alone hides too.</span></li>
<li><span class="pin">5</span><span><strong>Submenu</strong> for a family of actions (Git: stage, unstage, revert, compare, history), with its own icon.</span></li>
<li><span class="pin">6</span><span><strong>Labels follow state.</strong> Encrypt… becomes Lock File on an encrypted buffer, Pin Tab becomes Unpin Tab. Decided on every showing, not when the menu was built.</span></li>
</ol>

#### Behavior

- **MUST. One menu at a time.** A right-click while a menu is open replaces it; the first one closes before the
  second shows. JavaFX stacks a second menu beside the first when each row owns its own `ContextMenu`, and the
  stale one is then no longer dismissible. Editora's `ContextMenuDismissal` closes every open right-click menu
  on the press that opens the next; Modula's `RadioPane` hides the previous menu before showing a new one;
  Termina keeps one menu per view and shows it again.
- **MUST. A press anywhere outside the menu closes it**, including inside the control the menu was opened on.
  JavaFX's auto-hide deliberately ignores a press on the menu's *owner node*, so a stock menu on a tree or a
  text area stays open when the user clicks another row or the text. The press is not consumed: a click in a
  list still selects the row, and a right-click on another row opens that row's menu straight away. Install the
  fix once, at startup, for every current and future window (`ContextMenuDismissal.install()` in `App`); drop-downs
  opened by a plain click (menu buttons, choice boxes, the menu bar) keep the stock behavior, and a menu that turned
  auto-hide off is left alone. Pinned by `ContextMenuDismissalFxTest`.
- **MUST. Escape closes it** and focus goes back where it was. In a terminal the Escape must not reach the shell
  (Termina's `onKeyPressed` filter hides the menu and consumes the key).
- **MUST. Reachable from the keyboard.** The Menu key and <kbd>Shift+F10</kbd> arrive at the focused control, not at
  a row's cell, so a menu installed on cells never saw them. `RowContextMenu.install(tree)` re-fires the request at
  the selected row's cell, scrolled into view first, so every row action a mouse can reach the keyboard can too.
- **Right-click selects first.** In an editor, a right-click outside every selection moves the caret to the click
  (so Paste lands there); inside a selection it keeps carets and selections (so Cut and Copy act on what was
  clicked). From the keyboard the target is the caret (`ContextMenuTarget`). In a list, the menu is the clicked
  row's.
- **Built when asked for.** A menu attached to something that exists once per open file is built for every file
  and opened for almost none, so `LazyContextMenu.of(build)` builds the items on the first showing, and an
  `onShowing` handler sets the labels, enablement and visibility for *this* showing, then collapses the
  separators. A read-only console's menu is just Select All and Copy, both disabled while it is empty
  (`ConsoleContextMenu`).
- **Destructive rows** carry the `danger` class and follow the [window shell](../window-shell/) rule: the action
  asks first with a button that names it, or is undoable.
- **Terminal views (MAY).** A program that grabbed the mouse owns the right-click; <kbd>Shift</kbd>+right-click always
  opens the menu, and the keyboard request is never contested (Termina's `shouldShowMenu`, with
  `ContextMenuContentionTest`).

#### Spec

| Property | Value | Reference |
|---|---|---|
| Kind | `javafx.scene.control.ContextMenu`, auto-hide on, hide on Escape on: a popup window, unlike the palette | `TabContextMenu`, `ConsoleContextMenu` |
| Opens at | The pointer; from the keyboard, the selected row's bottom edge at min(width ÷ 4, 48) px in, or under the caret | `RowContextMenu.anchorX`, `ContextMenuTarget` |
| Font | Inter 14 px, pinned on `.context-menu`, whatever the owner's font | `app.css` |
| Rows | 34 px (padding 8 × 12); icon column 22 px; glyph scaled 0.8 from a 24 dp Material path, or a 16-unit line glyph | `Icons.ICON_SCALE`, `Icons.line` |
| Card | Radius 8, shadow radius 16 at offset Y 16 | `.context-menu` |
| Dismissal | Any press outside the menu, in any window; the next right-click; Escape | `ContextMenuDismissal`, `ContextMenuDismissalFxTest` |
| Marker | A showing menu opened by a right-click or the Menu key carries the window property `editora.rightClickMenu` | `ContextMenuDismissal.RIGHT_CLICK_MENU` |

### In the apps

![Termina window with tabs in the title bar and a tab context menu](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/termina-tabs.png "Termina's tab menu: an icon on every row, following Editora's convention.")
![Editora's View menu open with toggle commands and their chords](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-menu-bar.png "Editora's in-window menu bar with the chord column (an earlier build, before the titles lost their menu prefix).")

## Tray and background

An app whose work goes on without its window (Torrenta's transfers, Modula's radio, nux's monitoring) lives behind a
tray icon. For such an app everything here is a MUST; for the others (Editora, Termina, Mirada) a tray is MAY, and none
has one. Reference: Torrenta's `tray/` package (`Trays`, `TorrentaTray`, `SniTray`, `AwtTray`, `TrayIconRenderer`,
`SniMenuModel`), `os/Autostart` with `os/AutostartSpec`, and `automation/Notifiers`. Modula's and nux's `tray/` packages
are the same code with their own menus; nux's `TrayController` holds the close policy.

### The icon and its menu

<div class="mock-stage">
<div class="m-tr-stage" role="img" aria-label="Mockup of a tray icon in a desktop panel with its menu open">
<div class="m-tr-panel"><span class="m-icon"></span><span class="m-icon"></span><span class="m-tr-glyph"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.2"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14"/></svg><span class="pin out" style="left:-2px;top:-24px">1</span></span><span class="m-tr-clock">12:48</span></div>
<div class="m-card m-menu m-tr-menu">
<div class="mi off"><span class="t">Listening · 101.5 MHz</span><span class="pin out" style="right:-26px">2</span></div>
<div class="sep"></div>
<div class="mi"><span class="t">Stop</span><span class="pin out" style="right:-26px">3</span></div>
<div class="mi"><span class="t">Record</span></div>
<div class="mi"><span class="t">Show Modula</span><span class="pin out" style="right:-26px">4</span></div>
<div class="sep"></div>
<div class="mi"><span class="t">Quit</span><span class="pin out" style="right:-26px">5</span></div>
</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>The icon</strong> is the app's own mark, recolored by state, not a badge and never the number it stands for ("101.5" at 22 px is unreadable and lies by rounding). Torrenta's arrow is teal while something downloads, muted when nothing does, red on an error; Modula's broadcast glyph amber while listening, ink when stopped, coral on a fault; nux shows the charge number colored by severity, gray when disconnected.</span></li>
<li><span class="pin">2</span><span><strong>Status line</strong>, disabled, first. It is also the tooltip, because GNOME's AppIndicator extension renders a StatusNotifierItem's menu but not its tooltip, so the menu is the one place the live figures are sure to appear.</span></li>
<li><span class="pin">3</span><span><strong>The main actions</strong> the window would offer, so the common jobs need no window: Listen becomes Stop, Record is grayed (not hidden) until the receiver runs; Torrenta's menu has none; nux offers Connect, Switch UPS and the instant commands, which still go through the app's confirmation.</span></li>
<li><span class="pin">4</span><span><strong>Show <em>App</em></strong> brings the window back, as a left click on the icon does.</span></li>
<li><span class="pin">5</span><span><strong>Quit</strong>, after a separator. The only way to end the program apart from File → Quit and the system's Quit.</span></li>
</ol>

Tray menus are text only: AWT's `PopupMenu` and dbusmenu show no item icons, so the [menu rules](../menus/) about
icons and chords do not apply here. The order does.

#### Spec

| Property | Value | Reference |
|---|---|---|
| Linux backend | A StatusNotifierItem on the session bus, found through `org.kde.StatusNotifierWatcher`: KDE natively, GNOME with the AppIndicator extension, X11 and Wayland alike. No AWT fallback: the XEmbed tray GNOME dropped in 3.26 and Wayland never had | `SniTray`, `StatusNotifierWatcher`, `Trays.create` |
| Windows and macOS | AWT `SystemTray`, every mutation on the EDT, a multi-resolution image so a HiDPI tray picks a crisp variant | `AwtTray` |
| Created | Off the FX thread, after the first frame (D-Bus and AWT can block); the outcome is a tray or the one-line reason there is none | `Trays.Attempt`, `MainWindow.installTray` |
| Icon | Pure Java2D from the branding SVG's geometry, at each size the backend asks for, so the panel entry and the dock entry are one mark | `TrayIconRenderer`, `TrayDisplay` |
| Attention | A state that needs a person sets the SNI status `NeedsAttention`; otherwise `Active` | `SniTray.update` |
| Left click | Shows the window: SNI `Activate` and `SecondaryActivate`, a single primary click on the AWT icon | `SniTray.Item`, `AwtTray` |
| Right click | The menu; the host pulls it from the item's `Menu` property | `SniMenu`, `SniMenuModel` |
| Updates | Only when the value-equal snapshot changed: a repaint crosses a process boundary on Linux. Torrenta polls once a second, Modula nine times | `TrayDisplay`, `MainWindow.pushTray` |
| Package | Free of JavaFX: it takes callbacks, and the window marshals them onto the FX thread | `TorrentaTray` |

### Behavior

- **MUST. Fully usable without a tray.** No icon is a normal outcome (stock GNOME has no StatusNotifier host), not an
  error. The reason is said where the person will look, because the bug they actually hit is silence: the box says
  close to tray, and closing quits. Torrenta's status bar says "No tray icon (…); closing the window quits Torrenta";
  Modula's says closing the window will quit it (`RadioPane.reportNoTray`).
- **MUST. Closing the window hides it only while an icon is actually up and the setting says so.** Both are read at
  close time, not at startup: the checkbox can change while the window is open, and hiding a window that leaves no icon
  behind is how a program becomes unreachable. Otherwise a close quits. `Platform.setImplicitExit(false)` is set only
  once a tray exists, and turning the tray off brings a hidden window back (`MainWindow.setOnCloseRequest`, Modula's
  `installCloseBehaviour`, nux's `TrayController.closeHidesWindow` and `updateImplicitExit`).
- **MUST. Quit is explicit** and one path: the tray's Quit, File → Quit and the system's Quit all run the same method,
  which closes open dialogs first (quitting from inside a nested event loop aborted the JVM) and saves the window
  geometry (`MainWindow.quit`).
- **`--minimized` comes up behind the icon.** The window is never shown until the tray attempt has answered; if no icon
  comes, the window is shown after all, so a start at login can never leave a program with no way back. With the tray
  setting off, Torrenta starts minimized instead and nux ignores the flag (`MainWindow.show`, nux's `App`).
- **Start at login writes the OS's own entry, and nothing else.** An XDG autostart entry in `~/.config/autostart`
  (quoted `Exec`, `StartupWMClass` matching the installed launcher, `X-KDE-autostart-after=panel` so a tray host is up
  first), a LaunchAgent in `~/Library/LaunchAgents`, the `HKCU\…\Run` value on Windows (read together with
  `StartupApproved`, where Task Manager keeps the person's "off"). The entry is the one truth: turned off in GNOME
  Tweaks, KDE's Autostart page or Task Manager, the box shows unticked. The installers never do it, since they run for
  every account. Only an installed package has anything to start (`jpackage.app-path`); a run from source says so. The
  one setting beside it is *start behind the tray icon*, written into the entry as `--minimized`. Every call may block
  on the file system or `reg.exe`: never on the FX thread. The exact bytes are a pure, tested spec (`Autostart`,
  `AutostartSpec`; nux's design).
- **Desktop notifications go through one `Notifier`**: `notify-send` on Linux (nux and Termina fall back to `gdbus`
  against the freedesktop service), `osascript` with `display notification` on macOS, a PowerShell toast on Windows
  (Torrenta ships `toast.ps1`; nux raises it through the tray icon, which the `Notifier` keeps as the last resort on
  every platform). Each is a short program run with the title and message as arguments, never as part of a script, so
  text from a torrent name or a remote shell cannot run anything. Off the FX thread, bounded to a few seconds; a
  failure is logged and never breaks the app (`Notifiers`, `ProcessNotifier`, nux's `service/Notifier`, Termina's
  `DesktopNotifier`).
- **Notify for what happened while the window was away**, one switch per event, few on by default: Torrenta notifies
  on added, finished, seeding done, error and updated, with only *finished* on at first, and a Test button in Settings
  shows one now; nux notifies on power events with a rule per UPS; Termina and Editora relay a program's own OSC 9 and
  OSC 777 notifications. The in-app status already shows the state, so a notification is never the only place it is
  said.
- **A dock badge (MAY).** Torrenta puts the download rate on the macOS dock icon through AWT's `Taskbar` and a count
  on a Linux launcher that honors Unity's `LauncherEntry` signal (KDE, Dash to Dock); nothing on Windows, whose
  taskbar badges only AWT's own windows. Cleared when nothing downloads; its own switch (`os/Badges`, `BadgeState`).
- **A second launch brings the hidden window forward.** The [single-instance hand-off](../command-line/) shows a
  window hidden to the tray before it opens what it was given (`MainWindow.showFromTray`).
- **AWT stays headless unless the tray needs it.** Linux never needs it; Windows and macOS lift the guard only when the
  tray setting is on, decided in `main` (`Trays.usesAwt`, `os.AwtUse`). A tray turned on later says "restart to show
  the tray icon" rather than "unsupported".

### Settings copy

| Key | English |
|---|---|
| `ui.tray` | A tray (menu-bar) icon with the rates and a menu; on by default |
| `ui.closeToTray` | Closing the window keeps Torrenta in the tray. *The torrents go on; the tray icon's Show Torrenta brings the window back, its Quit ends the program, as does Quit in the File menu. Without a tray, closing quits.* On by default; nux grays it while the tray is off |
| (the OS entry) | Start Torrenta when you log in. *Adds Torrenta to your login items: an entry in ~/.config/autostart on Linux, a LaunchAgent on macOS, the Run key on Windows. Turned off in the system's own settings, it shows unticked here. Only for an installed Torrenta, not a run from source.* |
| `os.autostartInTray` | Start behind the tray icon. *At login Torrenta comes up behind its tray icon instead of as a window, and minimized where there is no tray. `torrenta --minimized` does the same by hand.* |
| `notify.<event>` | One switch per event; `notify.finished` on by default |
| `status.noTray` | No tray icon ({reason}); closing the window quits {app} |

### In the apps

![nux dashboard showing battery charge, load and runtime gauges for a UPS](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/nux-main.png "nux lives in the tray: its icon carries the charge number, and this dashboard is one left click away.")

## Settings

### The Settings window

- **MUST.** Opened by `Ctrl/Cmd+,` and a palette command. A sidebar of pages with icons on the left, the
  page on the right, and a **search field on top**.
- **Search** finds a row by its title, description, visible text, its card or section heading, its page
  name and English keywords. Title hits rank above description hits; whole words above word starts. The
  page with the best match opens, and every non-matching row, heading and card is hidden
  (`SettingsSearch`).
- **Live apply.** No Save button. Text fields commit on Enter or focus loss (`SettingsWindow.commitOnEnterOrBlur`);
  invalid values are marked and never committed (`SettingsSyncPage`'s branch field).
- A change made in one window reaches every other open window: every window holds the same `SharedConfig`, which
  announces each change (`onSettingsChanged`).

![Editora's Settings window searching for sync, with the Sync page open](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-settings-search.png "Typing sync in Settings: pages without a match gray out and the best page opens.")

### Before adding a setting

A setting is a question the user has to answer. When the question has one right answer, choose it, make it the
behavior, and say why in the code and the docs; do not ship a knob for it. Modula's test: *would a car radio have
it?* A preset button, yes; a "decimation stages" spinner, no. So Modula has no gain, bandwidth or squelch control:
each has one right value for a listener, and the app supplies it. Add a setting when people really differ (a
keymap, a theme, a language), not when the developer could not decide.

### Adding a setting touches five places

1. **Model** field, default and accessors, with a schema bump and migration.
2. **Control**, built once, writing the field and applying it.
3. **Row** on its page with search keywords.
4. **Load** line that sets the control from the model, safe to run at any time.
5. **Palette command** that flips or prompts the same field, plus strings in every catalog.

### Config folder and schema

- Config lives in `~/.<app>` (`~/.<app>-dev` for `--dev`, any folder via `--config-dir` or
  `<APP>_CONFIG_DIR`).
- `settings.json` for preferences, `workspace-state.json` for session state, other stores in their own
  JSON files.
- Every versioned file has a `SCHEMA_VERSION` and a `v → v+1` migration step. A purely additive field uses
  an identity step.
- A file newer than the running build is backed up to `<name>.v<n>.bak` and defaults load: an older build
  never clobbers a newer config.
- **Never trust a config file.** Config is plain JSON (or properties) and people edit it by hand. Clamp every
  value to its valid range when it is **read**, not only when it is written: a hand-edited two-million-line
  scrollback must not exhaust memory at the next launch (Termina). An unknown value falls back to its default; a
  file that cannot be decoded is kept as `<name>.corrupt.bak` and defaults load. A bad file never stops the app
  from starting.
- **Export configuration** writes a timestamped `.zip` of the config folder (`ConfigExporter`). Import
  restores from one.

### Secrets stay out of files

- **No secret in a config file.** API keys and tokens go to the operating system's keychain: macOS Keychain,
  Windows Credential Manager, the Secret Service on Linux (Editora's `secrets/SecretStore`). Calls may block on a
  prompt, so they run off the FX thread.
- **Or keep it for the session only.** A credential the app can ask for again (nux's UPS login) lives in memory and
  is never written. Work that needs it waits until the user has signed in this session; do not "fix" that by
  storing the password.
- **Refuse a secret in the wrong place.** A repository URL with a password or token in it is refused, with the fix
  ([Settings Sync](../templates/settings-sync/)); a problem report redacts tokens, hosts and home paths before
  anyone sees it ([Diagnostics](../diagnostics/)).
- **No UI for a dangerous escape hatch.** An option that weakens security, such as nux's trust-all TLS
  (`tlsTrustAll`), exists only as a key in the config file, so nobody turns it on by clicking.

### Settings Sync (Git / GitHub)

- **SHOULD.** Optional sync of settings, keybindings and user data through a Git repository the user owns.
- Setup by pasting a repo URL, or **Create on GitHub** through the `gh` CLI. The account that can read the
  repo is pinned per clone, so machines with two GitHub accounts work.
- Automatic (on change and at start) and manual triggers. Machine-local keys (window size, paths) never
  sync.
- Conflict rule: on a same-entry conflict *this machine wins*. A backup is taken before any sync that
  replaces local files.
- Status shows as a pill in Settings and as echo messages; failures go to the Message Log.
- Reference: `sync/SyncEngine`, `sync/SyncMerge`, `sync/SyncAccount`, `ui/SettingsSync`,
  `docs/subsystems/settings-sync.md`.

![Editora's Sync settings page](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-settings-sync.png "Editora's Sync page: repository, branch, Create on GitHub… and what to sync.")
![Torrenta's Sync settings page](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/torrenta-settings-sync.png "Torrenta's Sync page.")
![Termina's Sync settings page](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/termina-settings-sync.png "Termina's Sync page.")

## Diagnostics and support

| Feature | Behavior | Level | Editora reference |
|---|---|---|---|
| **Message Log** | Session-only history of every echo-area message with `HH:mm:ss` times, newest first, bounded. Opened by clicking the status message; Esc closes; Clear empties it. | MUST | `ui/MessageLog`, `ui/MessageLogPopup` |
| **Debug Log** | Captures all `java.util.logging` records and uncaught exceptions in memory (bounded) **and** mirrors them to `<app>-session.log` in the config folder, keeping the previous one as `<app>-session.prev.log` so a crash is still visible next launch. A modeless window with Refresh, Copy, Clear, Export and Report a Problem. The only way to see logs in a packaged build. | MUST | `ui/DebugLog`, `ui/DebugLogWindow` |
| **Uncaught exception handler** | Installed first thing in `main`; routes to the Debug Log and an echo message. Never a stack trace dialog. | MUST | `DebugLog.install()` |
| **Update notification** | Reads GitHub `/releases/latest`. Once per app session (not per window), at most once a day, a few seconds after the first frame. A newer version shows a status-bar notice and a line in About; "Check for Updates" runs it by hand. Off switch in Settings. Never downloads or installs by itself. | MUST | `update/UpdateCheck`, `ui/UpdateCheckScheduler`, `ui/UpdateCoordinator` |
| **Report a Problem** | Help → Report a Problem builds a report (version, OS, runtime, settings summary, recent Debug Log), **redacts** it (home paths, user names, tokens, hosts), shows it editable, copies it to the clipboard and opens a prefilled GitHub issue from `bug_report.yml`. Over about 7,500 characters the link falls back to "paste from the clipboard". `<app> --report` does the same from the command line for when the app cannot start. Nothing is uploaded. | MUST | `report/ProblemReport`, `report/Redactor`, `report/ReportCommand`, `ui/ReportProblemWindow` |
| **Doctor** | A page that checks the environment (external tools, versions, permissions, paths) with a status per row and a fix or link for each failure. | SHOULD | `doctor/*`, `ui/DoctorPane` |
| **Crash recovery** | Unsaved user work is snapshotted off the FX thread and offered back after a crash. | SHOULD (apps with user documents) | `recovery/RecoveryService` |

![Editora's Message Log popup above the status bar](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-message-log.png "Clicking the status message opens the Message Log: this session's messages, newest first.")
![Editora's Report a Problem window](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-report-problem.png "Report a Problem: a redacted, editable report that opens as a prefilled GitHub issue.")

![Editora's About window](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-about.png "About: version, runtime, license, links and the update status.")
![Editora's Doctor page](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-doctor.png "Doctor: each external tool with its version, or what to install.")

Secrets never reach a log, a report or a config file: see [Secrets stay out of files](../settings/#secrets-stay-out-of-files).

## Command line and launch

Every app accepts at least:

| Flag | Meaning |
|---|---|
| `--help`, `--version` | Printed before the GUI starts; plain English, not translated. |
| `--config-dir <dir>`, `--dev` | Use another config folder (`~/.<app>-dev` for `--dev`). |
| `--new-instance` | Start a second process instead of handing off to the running one. |
| `--no-session` | Do not restore the last session. |
| `--report` | Write a redacted problem report and open the GitHub issue. |
| `[files…]` | Open these items. |

- **Single instance per config folder.** A second launch hands its arguments to the running app over a
  local endpoint and exits (`ipc/SingleInstance`). On macOS, `openFiles` Apple Events reach the running
  app (`MacOpenFiles`). An advisory lock tells two processes on one folder about each other
  (`config/InstanceLock`).
- The headless-AWT guard (`java.awt.headless=true`) is set at the top of `main`, before any AWT class loads
  (`App.main`).
- A `.app` launched from Finder inherits a stripped `PATH`: resolve external tools through the login shell's
  `PATH` (`process/ProcessRunner.augmentedPath`).

## Internationalization

Reference: Editora's `i18n/Messages.java` (`tr`, and `available()` behind the Settings language picker), the
catalogs in `src/main/resources/com/editora/i18n/`, and `i18n/MessagesTest.java`, which holds them in step.

### Languages

Every app ships **at least these six**. They are a floor, not the set: an app SHOULD add languages as people ask
for them, and a new app can start with more.

| Language | Catalog |
|---|---|
| English (base) | `messages.properties` |
| Spanish | `messages_es.properties` |
| Portuguese | `messages_pt.properties` |
| French | `messages_fr.properties` |
| Italian | `messages_it.properties` |
| German | `messages_de.properties` |

Adding a language:

- Add `messages_<code>.properties` with every key, and the language to the Settings language picker. The parity
  test (`translationCatalogsHaveExactlyTheBaseKeySet`) then holds it to the same keys as the others.
- Translate for real; do not ship English values in another language's catalog. No test catches an English
  value, so this one is checked in review.
- Check the layout in the new language at 1024 px wide. German is today's longest; rows must wrap, never cut.
  Also checked by eye, in the running app (see [Quality](../quality/)).
- Scripts beyond Latin need more than strings. Chinese, Japanese and Korean need a font fallback, because Inter
  has no CJK glyphs. Arabic and Hebrew need `NodeOrientation.RIGHT_TO_LEFT` on every scene. No app in the
  family ships such a language yet, so there is no code to copy.

### Rules

- Never pass a raw English literal to a control: `tr("some.key")` from one `Messages` class. A test
  (`everyLiteralKeyUsedInTheSourcesExists`) fails when a `tr` key is missing from the base catalog.
- Every language has a real translation of every key. A test fails the build when a key is missing in any
  catalog (`translationCatalogsHaveExactlyTheBaseKeySet`, `translationsAreNonEmptyAndDistinctFromKeys`).
- `MessageFormat` rules: in a value with a placeholder, double literal apostrophes; identifiers such as line
  numbers and ports use `{0,number,#}` so they are not digit-grouped. Held by
  `aValueWithAPlaceholderNeverHasALoneApostrophe`, `aValueWithoutAPlaceholderNeverDoublesAnApostrophe` and
  `identifierArgumentsAreNeverDigitGrouped`.
- Untranslated on purpose: technical identifiers, `--help` and `--version` text (`App.java`'s usage text).

![Editora with a Spanish interface](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-localized.png "Editora in Spanish: menus, tool windows and the status bar all come from the catalogs.")
![Torrenta with a Spanish interface](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/torrenta-languages.png "Torrenta in Spanish.")

## Command Palette

<span class="lvl lvl-must">MUST</span> in every app. One palette per window, opened by `M-x` in the Emacs keymaps and
`Ctrl/Cmd+Shift+P` in the others. It lists every registered command, so a command that exists is a command people
can find. Reference: Editora's `ui/CommandPalette.java`; the pure parts (`FuzzyMatch`, `MatchText`, `PaletteKeys` and the
caret-key helper, `TextInputKeymap` in Editora, `TextInputKeys` in the copies) are shared with Termina and Mirada.
Torrenta shares `MatchText` and ranks with its own `CommandMatcher`.

### Anatomy

<div class="mock-stage scrim">
<div class="m-card m-palette" role="img" aria-label="Mockup of the command palette with the query git">
<div class="input-row"><span class="pin">1</span><span class="m-chip">M-x</span><span class="m-grow">git<span class="m-caret"></span></span><span class="pin">2</span></div>
<div class="list">
<div class="cmd sel"><span class="pin out" style="left:-26px">4</span><span class="m-grow"><b>Git</b>: Pull</span><span class="m-chip">C-x v S-=</span><span class="pin">5</span></div>
<div class="cmd"><span class="m-grow"><b>Git</b>: Push</span><span class="m-chip">C-x v S-p</span></div>
<div class="cmd"><span class="m-grow"><b>Git</b>: Fetch</span></div>
<div class="cmd"><span class="pin out" style="left:-26px">3</span><span class="m-grow"><b>Git</b>: Commit…</span><span class="m-chip">C-x g</span></div>
<div class="cmd"><span class="m-grow"><b>Git</b>: Pull (Rebase)</span></div>
<div class="cmd off"><span class="pin out" style="left:-26px">6</span><span class="m-grow"><b>Git</b>: Continue Merge / Rebase / Cherry-Pick</span><div class="m-tip">Unavailable — no merge, rebase, cherry-pick or revert is in progress.</div></div>
<div class="cmd"><span class="m-grow"><b>Git</b>: Stage All Changes</span></div>
<div class="cmd"><span class="m-grow"><b>Git</b>: Switch Branch…</span></div>
</div>
<div class="desc"><span class="pin">7</span> Pull and merge changes from the remote.</div>
<div class="hint"><span class="pin">8</span> ↑↓ / C-n C-p move · ↵ run · C-h docs · Esc / C-g cancel</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Opener chip.</strong> The chord that opened the palette, read from the active keymap. No chip when the user has unbound it, never a wrong one.</span></li>
<li><span class="pin">2</span><span><strong>Query field.</strong> The first row is the input; there is no title. Prompt "Run command…". Emacs caret keys work inside it.</span></li>
<li><span class="pin">3</span><span><strong>Match highlight.</strong> The characters the fuzzy matcher scored, bold in the accent color. The highlight and the ranking come from the same call, so they never disagree.</span></li>
<li><span class="pin">4</span><span><strong>Selected row.</strong> Tinted background plus a 2 px accent bar on its inside edge. The bar is what makes the selection readable in a long list.</span></li>
<li><span class="pin">5</span><span><strong>Key chip.</strong> The command's binding in the active keymap, in the keyboard color (brace periwinkle). Absent when unbound.</span></li>
<li><span class="pin">6</span><span><strong>Unavailable command.</strong> Listed, grayed, never selected and inert to clicks. Its tooltip says why and what to do ("Unavailable — no merge, rebase, cherry-pick or revert is in progress.").</span></li>
<li><span class="pin">7</span><span><strong>Description.</strong> The selected command's <code>command.&lt;id&gt;.desc</code>, one line with an ellipsis, always one line tall so the card never jumps.</span></li>
<li><span class="pin">8</span><span><strong>Key legend.</strong> The palette's own keys, rendered from the active keymap.</span></li>
</ol>

### Spec

| Property | Value | Reference |
|---|---|---|
| Kind | In-scene overlay in the window's root `StackPane`, over a faint scrim. **Not** a `javafx.stage.Popup`: on Windows a popup does not reliably take keyboard focus. | `OverlayHost` |
| Width | 620 px | `content.setPrefWidth(620)` |
| Rows | 36 px high, 8 visible before the list scrolls | `ROW_HEIGHT`, `VISIBLE_ROWS` |
| Card | `-color-bg-overlay`, 1 px `-color-border-default`, radius 12, padding 6, one wide drop shadow | `.command-palette` in `app.css` |
| Row text | 12.5 px; padding 7 × 16 | `.command-palette .list-cell` |
| Scrim | `rgba(0,0,0,0.18)`; a click on it closes the palette | `.overlay-backdrop` |
| Content | Every registered command: title from `command.<id>`, description from `command.<id>.desc` | `CommandRegistry`, `MessagesTest` |
| Ranking | Fuzzy score over title, id and description; a query that names a title outranks a fuzzy hit | `FuzzyMatch`, `titlePhraseScore` |

### Behavior

- **Open:** the `palette.show` command, from its chord or a menu item. The query starts empty and lists every command.
- **Type** to filter; the first *enabled* match is selected.
- **Move:** ↑ ↓, `C-n` `C-p`, Page Up/Down. **Run:** Enter, or a click on an enabled row. The palette closes first,
  then the command runs.
- **Cancel:** Esc, `C-g`, or a click on the scrim. Focus returns to where it was.
- **Docs:** `C-h` (or the first free chord of `C-h`, `F1`, `Shift+F1` in the active keymap) opens the selected
  command's page on the website, for the running version.
- A live keymap switch re-renders the chips, the opener and the legend.

### Copy

| Key | English |
|---|---|
| `palette.prompt` | Run command… |
| `palette.disabled.<reason>` | Unavailable — *what is missing*. *What to do first.* |

### In the apps

![Editora's command palette filtered to Git commands](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-palette.png "Editora.")
![Torrenta's command palette listing torrent actions with shortcuts](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/torrenta-palette.png "Torrenta.")
![Termina's command palette over a terminal listing tab commands](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/termina-palette.png "Termina.")

## QuickOpen picker

<span class="lvl lvl-should">SHOULD</span> serve every "choose one from a list" moment: recent files, themes, keymaps,
a setting's values, a branch to compare with. It is the [Command Palette](../command-palette/) card with a title over
the field and a prompt in it, so a list choice is made the way a command is run: type a few letters, Enter. Reference:
Editora's `ui/QuickOpen.java` (one generic class, instantiated about sixty times), driven by `PickerKeys` and shown
by `OverlayHost`. The [keyboard page](../../keyboard/) states the rule; this page is the shape.

### Anatomy

<div class="mock-stage scrim">
<div class="m-card m-palette m-qo" role="img" aria-label="Mockup of the Jump to Recent File picker with the query mai">
<div class="m-qo-title"><span class="pin">1</span> Jump to Recent File</div>
<div class="m-field focus m-qo-field"><span class="m-grow">mai<span class="m-caret"></span></span><span class="pin">2</span></div>
<div class="m-qo-list">
<div class="m-qo-row sel"><span class="pin out" style="left:-26px">4</span><span class="m-icon"></span><span class="t"><b>Mai</b>nController.java</span><span class="d">~/src/Editora/src/main/java/com/editora/ui</span><span class="pin">5</span></div>
<div class="m-qo-row"><span class="pin out" style="left:-26px">6</span><span class="m-icon"></span><span class="t"><b>Mai</b>nMenuBar.java</span><span class="d">~/src/Editora/src/main/java/com/editora/ui</span></div>
<div class="m-qo-row"><span class="m-icon"></span><span class="t"><b>m</b>ess<b>a</b>ges_<b>i</b>t.properties</span><span class="d">~/src/Editora/src/main/resources/com/editora/i18n</span><span class="pin">3</span></div>
<div class="m-qo-row"><span class="m-icon"></span><span class="t">Do<b>mai</b>n.java</span><span class="d">~/src/Editora/src/main/java/com/editora/lsp</span></div>
<div class="m-qo-row"><span class="m-icon"></span><span class="t"><b>m</b>irad<b>a</b>.css <span class="m-pill amber" style="padding:0 6px">unsaved</span></span><span class="d">~/src/Mirada/src/main/resources/com/mirada/styles</span></div>
</div>
<div class="hint"><span class="pin">7</span> ↵ select</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Title.</strong> The command that opened the picker ("Jump to Recent File", "Set App Theme"), bold 12 px in the muted color. This is what tells the picker apart from the palette, which has no title.</span></li>
<li><span class="pin">2</span><span><strong>Query field</strong> with a prompt per picker: "Type to filter recent files…", "Type to filter themes…". The Emacs caret keys work in it (<code>TextInputKeymap.installShared</code>).</span></li>
<li><span class="pin">3</span><span><strong>Match highlight.</strong> The characters the fuzzy matcher scored, bold in the accent color; the same <code>MatchText.runs</code> as the palette, so the highlight and the rank never disagree.</span></li>
<li><span class="pin">4</span><span><strong>Selected row.</strong> The first match, or with nothing typed the value in force when the picker knows it (<code>setCurrentItem</code>), so a settings picker opens on the current value.</span></li>
<li><span class="pin">5</span><span><strong>Detail</strong>, right-aligned and muted: the file's folder, a branch's upstream, "current". It gives way with an ellipsis; the title keeps its width and never wraps.</span></li>
<li><span class="pin">6</span><span><strong>Icon</strong> (optional, <code>setItemIcon</code>): a file-type glyph from <code>FileIcons</code>. A per-row class marks state (an unsaved buffer in amber).</span></li>
<li><span class="pin">7</span><span><strong>Key legend.</strong> "↵ select" plus any row action's key, rebuilt from the active keymap on every showing.</span></li>
</ol>

### Spec

| Property | Value | Reference |
|---|---|---|
| Kind | The palette's card in the shared in-scene `OverlayHost`, over the same scrim; never a `javafx.stage.Popup` | `QuickOpen.setOverlayHost`, `OverlayHost` |
| Width | 620 px; a picker may ask for its own width and a minimum number of rows (a registry browser with one entry still gets a roomy box) | `DEFAULT_WIDTH`, `setPreferredSize` |
| Rows | 26 px fixed cells; the list hugs its match count, at least 1 row, 12 before it scrolls | `CELL_HEIGHT`, `MAX_VISIBLE`, `resizeList` |
| Title | Bold 12 px, `-color-fg-muted`, over the field | `.command-palette .palette-title` |
| Row | Title as matched runs, an optional icon before it, the detail in the palette's muted right-detail style | `ItemCell`, `.keybinding` |
| Legend | 11 px muted under the list | `.command-palette .palette-hint` |
| Card | `-color-bg-overlay`, radius 12, 1 px `-color-border-default`, padding 6: the palette's | `.command-palette` |
| Ranking | `FuzzyMatch` over the search key (the label unless the picker names another, a note's body for instance); equal scores keep the supplier's order | `filter` |

### Behavior

- **Open** from a command. The items are read fresh on every showing and snapshotted, so typing filters a stable
  list; a source that answers late (an outline the language server has not returned yet) calls `reload()`.
- **Nothing typed:** the supplier's own order, which is the meaningful one (recency for recent files, document
  order for symbols), with the current value pre-selected when there is one. **Typing** ranks by fuzzy score; ties keep
  their order so rows do not shuffle under the cursor between keystrokes.
- **Move:** the active keymap's line and page chords (`nav.lineDown`, `nav.pageUp`, …) plus ↑ ↓, Page Up/Down, Home and End,
  which always work. **Choose:** Enter, or a click on a row. The card hides first, then the choice runs, so focus is
  already back where it belongs.
- **Cancel:** Esc, `C-g`, or a click on the scrim. The host restores focus. A picker that previewed something
  undoes it.
- **Preview (MAY).** `setPreview(onPreview, onCancelled)` previews the highlighted row as the selection moves and
  undoes it on cancel: Recent Locations shows each place and returns to the origin on Esc. A preview without an undo
  is worse than none. Nothing is previewed for the row the picker opens on, only for one the user moved to. The theme
  and keymap pickers do not preview; they apply on Enter.
- **Row actions (MAY).** `addRowAction(key, legend, action)` acts on the highlighted row and keeps the picker open
  (the breakpoints picker enables or removes one), re-reading the list afterwards and keeping the cursor in place.
- **Empty list:** a placeholder sentence in the list (`setPlaceholder`), never a blank card.
- **One card at a time.** The host shows one card; opening a picker replaces whatever card was up.
- **Relatives.** The Open Files `Switcher` lists tabs in tab order, opens on the current one and closes a file with
  `C-d` or Backspace. `FileFinder` is the Emacs `find-file` field with Tab completion. `MultiSelectPicker` ticks
  several rows with Space where exactly one would be wrong. `BranchPopup` and `GitStashPopup` are sectioned pickers
  with their own actions. All of them use `PickerKeys`, so they move, accept and cancel alike.

### Uses

| App | Picked with it | Reference |
|---|---|---|
| Editora | Recent files (with file icons), recent locations (previewed), bookmarks, the structure outline, tool windows, open files, projects, keymap, app and editor theme, spell language, a setting's values (opened on the current value), branches, tags and commits to compare with, remotes, commit message history, the kill ring, Occur lines, external tools, macros, the debug main class, breakpoints, agent models | `NavigationCoordinator`, `EditorSettingsCoordinator`, `DiffCoordinator`, `DebugCoordinator`, `BreakpointsPicker` |
| Mirada | Go to bookmark…, Open recent folder…: the palette shown over a list of names with a detail per row and an "open" legend | `CommandPalette.Choices`, `ViewerWindow` |
| Termina, Torrenta, Modula, nux | Commands only; profiles and other lists are menus or combo boxes today | `CommandPalette` in each |

### Copy

| Key | English |
|---|---|
| `nav.recentFiles.title` / `.prompt` | Jump to Recent File / Type to filter recent files… |
| `palette.theme.appTitle`, `palette.theme.editorTitle` / `palette.theme.prompt` | Set App Theme, Set Editor Theme / Type to filter themes… |
| `command.keymap.select` / `palette.keymap.prompt` | Keymap: Select… / Type to filter keymaps… |
| `palette.setting.pick` | Type to filter… |
| `pickerKeys.select`, `pickerKeys.open`, `pickerKeys.cancel` | {0} select, {0} open, {0} cancel |
| `switcher.header` | Open Files |

A title names the command; a prompt starts with "Type to filter" and ends with an ellipsis. A placeholder says what is
missing and what to do ("No breakpoints set. Click a line number to add one.").

### In the apps

![Editora's keymap picker](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-keymaps.png "Editora: Keymap: Select… over the editor, the title above the field.")
![Editora's palette filtered to kill commands with Emacs chords](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-emacs.png "The palette the picker is built from.")

## Welcome page

<span class="lvl lvl-should">SHOULD</span> in an app that opens files or projects: the page shown when there is no
session to restore, and the answer to "what do I do now?". An app whose window *is* its content shows its own empty
state instead, with the same ingredients (Torrenta's drop zone, below). Reference: Editora's `ui/WelcomePane.java`,
with the text rules in `ui/WelcomeText.java` and the strings under `welcome.*`.

### Anatomy

<div class="mock-stage">
<div class="m-wl-page" role="img" aria-label="Mockup of the Welcome page">
<div class="m-wl-head"><img src="../../icons/editora.svg" alt="" /><div><div class="m-wl-title">Editora <span class="pin">1</span></div><div class="m-wl-tagline">A keyboard-driven programmer's editor</div></div></div>
<div class="m-wl-section">Start</div>
<div class="m-wl-actions">
<div class="m-wl-action"><span class="ic"><svg viewBox="0 0 16 16"><path d="M4.5 2.5h4.6l2.9 2.9v8.1h-7.5zM9.1 2.5v2.9h2.9M8.25 8.2v3.2M6.65 9.8h3.2"/></svg></span><span class="lnk">New File</span><span class="pin">2</span></div>
<div class="m-wl-action hover"><span class="ic"><svg viewBox="0 0 16 16"><path d="M1.5 3.5h4.2l1.5 2h7.3v7H1.5z"/></svg></span><span class="lnk">Open File…</span><span class="key">C-x C-f</span><span class="pin">3</span></div>
<div class="m-wl-action"><span class="ic"><svg viewBox="0 0 16 16"><path d="M1.5 3.5h4.2l1.5 2h7.3v7H1.5zM8 7.7v3M6.5 9.2h3"/></svg></span><span class="lnk">Open Folder as a Project…</span><span class="key">C-x C-p</span></div>
<div class="m-wl-action"><span class="ic"><svg viewBox="0 0 16 16"><path d="M5.4 8a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0M8 1.5v4M8 10.5v4"/></svg></span><span class="lnk">Clone Git Repository…</span></div>
<div class="m-wl-action"><span class="ic"><svg viewBox="0 0 16 16"><path d="M1.5 4.5h13v7h-13zM4 7h1M7 7h1M10 7h1M5 9.5h6"/></svg></span><span class="lnk">Command Palette</span><span class="key">M-x</span></div>
</div>
<div class="m-wl-section">Recent Projects</div>
<div class="m-wl-recent">
<div class="m-wl-row"><span class="num">1</span><span class="lnk">Editora</span><span class="dir">~/workspace/Editora</span><span class="pin">4</span></div>
</div>
<div class="m-wl-section">Recent Files</div>
<div class="m-wl-recent">
<div class="m-wl-row"><span class="num">2</span><span class="lnk">hello.py</span><span class="m-wl-chip">Editora</span><span class="dir">samples/run</span><span class="pin">5</span></div>
<div class="m-wl-row"><span class="num">3</span><span class="lnk">MainController.java</span><span class="m-wl-chip">Editora</span><span class="dir">…/main/java/com/editora/ui</span></div>
<div class="m-wl-row"><span class="num">4</span><span class="lnk">notes.md</span><span class="dir">~/Documents</span></div>
<div class="m-wl-row"><span class="num">5</span><span class="lnk">pom.xml</span><span class="m-wl-chip">Editora</span><span class="dir"></span></div>
<div class="m-wl-row"><span class="num">6</span><span class="lnk">deploy.sh</span><span class="dir">/srv/tools</span></div>
<div class="m-wl-more">Show 3 more ⌄ <span class="pin">6</span></div>
</div>
<div class="m-wl-section">Customize</div>
<div class="m-wl-recent">
<div class="m-wl-row"><span class="lbl">Keymap</span><span class="lnk">Emacs</span><span class="pin">7</span></div>
<div class="m-wl-row"><span class="lbl">Theme</span><span class="lnk">Editora Light</span></div>
<div class="m-wl-caption">Chords use Emacs notation: C- is Ctrl, M- is Alt, S- is Shift. Pick another keymap above to see your platform's notation.</div>
</div>
<div class="m-wl-section">Help</div>
<div class="m-wl-help"><span class="lnk">Documentation</span><span class="lnk">What's New</span><span class="lnk">Doctor: Check External Tools</span><span class="pin">8</span></div>
<div class="m-wl-footer">Version 0.27.0 · <span class="lnk">editora-project.dev</span><br />MIT License</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Identity.</strong> The app icon at 64 px beside the name (2.4 em, bold) and the README's one-line tagline, muted. One centered column, at most 640 px wide and never narrower than 340; a longer window scrolls.</span></li>
<li><span class="pin">2</span><span><strong>Start actions</strong>, each an existing command: New File, Open File, Open Folder as a Project (only with Projects on), Clone Git Repository (only with Git on), and the Command Palette always last, the gateway to everything else. Accent links with no box; the icon sits in a 26 px column so every label starts at the same x, and the whole row answers a click.</span></li>
<li><span class="pin">3</span><span><strong>Chord</strong>, right-aligned past a 32 px gap, in the keyboard color, from the active keymap. Unbound: no chord. Open File shows find-file's chord in the Emacs keymap, where that is the key to learn. The hovered row tints and the chord becomes a chip.</span></li>
<li><span class="pin">4</span><span><strong>Entry number.</strong> The first nine recent entries, projects first, are numbered in the keyboard color; typing that digit opens the entry. Projects come in the order of their most recent file.</span></li>
<li><span class="pin">5</span><span><strong>Recent file row.</strong> The name keeps its width; a chip names the project (or the host of a remote file); the folder is muted, relative to the project root, with <code>~</code> for home, and elides from its start so the part that differs stays visible. The full path is the row's tooltip; right-click offers Copy Path and Remove from recent files.</span></li>
<li><span class="pin">6</span><span><strong>Disclosure.</strong> Five rows per list; the rest wait behind "Show N more", which becomes "Show fewer".</span></li>
<li><span class="pin">7</span><span><strong>Customize.</strong> The active keymap and app theme by name; each link runs the picker command. Under an Emacs-style keymap a caption explains the notation. On a first run, with nothing recent, this block moves up under Start.</span></li>
<li><span class="pin">8</span><span><strong>Help and footer.</strong> Documentation, What's New (the release notes) and the Doctor. Then the version, the home page and the license; a dev build adds its commit on its own line once the lookup, which runs <code>git</code> off the FX thread, has answered.</span></li>
</ol>

### Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A real tab content in its own closeable "Welcome" tab, so the tab strip handles switching and closing; not an overlay | `WelcomePane implements TabContent`, `MainController.addWelcomeTab` |
| Column | 640 px max, 340 px min, 48 px margin, centered in a scroll pane; below the minimum the page scrolls sideways | `COLUMN_WIDTH`, `MIN_COLUMN_WIDTH`, `MARGIN` |
| Zoom | Every px size is multiplied by the text zoom and the fonts are `em`, so zoom scales the layout, not only the words | `setFontScale`, `.welcome-*` |
| Surface | `-color-bg-default`, the UI surface, not the editor's; its tab takes the same fill | `.welcome-pane`, `.ui-surface-tab` |
| Header | Icon 64 px; title 2.4 em bold; tagline `-color-fg-muted` | `.welcome-title`, `.welcome-caption` |
| Section heading | 1.15 em bold, padding 28 0 8 0 | `.welcome-section` |
| Links | `Hyperlink` in `-color-accent-fg`, no border, underlined only on hover or keyboard focus; visited stays the accent | `.welcome-action`, `.welcome-link` |
| Action row | Icon column 26 px, gap 12 to the label, at least 32 px to the chord; hover fills `-color-bg-subtle` with 6 px radius, insets 8 px past the row | `WelcomePane.action`, `.welcome-action-row` |
| Chord | `-state-key`, 0.9 em; on hover a `-state-key-bg` chip, radius 4 | `.welcome-key` |
| Recent row | Number `-state-key` 0.8 em; folder `-color-fg-muted` 0.9 em with a leading ellipsis; project chip muted on `-color-bg-subtle`, radius 3 | `.welcome-entry-number`, `.welcome-recent-dir`, `.recent-project-name` |
| Lists | 5 rows, then a flat disclosure button | `COLLAPSED_RECENT_LIMIT`, `addCollapsed` |
| Focus | The first recent entry, or New File when there is none, with no focus ring; Enter and Space open it | `requestFocus`, `focusPage` |

### Behavior

- **Shown** at startup when there is no session to restore (so always with `--no-session`), by the `view.welcome`
  command (Help → Welcome Page), and when the tab strip is empty after a project swap (`showWelcomeIfNoTabs`).
  Standalone diff startup suppresses it while its worker reads the files.
- **Closing the last file tab does not bring it back.** The editor area shows its own quiet hint instead: Open File,
  Open Folder, Command Palette and Welcome Page, each with its chord (`EditorEmptyState`), and takes focus so chords
  still reach the window.
- **Rebuilt on every show** (`refresh`), so the recents, the Projects and Git toggles, the keymap and the theme are
  current. A refresh keeps the focus where it was.
- **Recent lists tell the truth.** A file that no longer exists is not offered (`RecentFiles.showable`, the same
  filter as the toolbar's dropdown); remote files are kept unchecked. A project whose root is gone is dropped.
  Remove from recent files asks first, through the caller, then refreshes.
- **Digits 1 to 9** open the numbered entries: typed characters only, with no modifier, so chords and Enter are
  untouched (`onKeyTyped`).
- **Remote Sites** appear as their own section when saved SFTP sites exist; a click opens the connection form
  prefilled.
- **Customize** runs `keymap.select` and `theme.setAppTheme`; a change made there re-renders the page, chords
  included.
- **The Welcome tab is not a document**: its menu is Close only, no Save, Rename or Pin, and the title bar shows
  the app or project name, not a file.

### Copy

| Key | English |
|---|---|
| `welcome.tab` | Welcome |
| `welcome.tagline` | A keyboard-driven programmer's editor |
| `welcome.start` | Start |
| `welcome.newFile` / `welcome.openFile` | New File / Open File… |
| `welcome.openFolder` / `welcome.clone` | Open Folder as a Project… / Clone Git Repository… |
| `welcome.recentProjects` / `welcome.recentFiles` / `welcome.remote` | Recent Projects / Recent Files / Remote Sites |
| `welcome.noRecent` | No recent files yet. Open a file or a folder to start, or run editora FILE in a terminal. |
| `welcome.recent.showMore` / `welcome.recent.showFewer` | Show {0} more / Show fewer |
| `welcome.entryNumber` | Press {0} to open *(accessible help)* |
| `welcome.customize` / `welcome.keymap` / `welcome.theme` | Customize / Keymap / Theme |
| `welcome.notation.emacs` | Chords use Emacs notation: C- is Ctrl, M- is Alt, S- is Shift. Pick another keymap above to see your platform's notation. |
| `welcome.help` / `welcome.documentation` / `welcome.whatsNew` / `welcome.doctor` | Help / Documentation / What's New / Doctor: Check External Tools |
| `welcome.version` | Version {0} |
| `welcome.page` | Welcome Page *(the menu item)* |

### In the apps

![Editora's Welcome tab](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-welcome.png "Editora: Start actions with their chords, Recent Projects and Recent Files numbered 1 and 2, Customize below.")

Torrenta has no documents to come back to, so its welcome is an **empty state over the table** until the first
torrent (`ui/Welcome.java`, bound to the list being empty): a drop zone that says "Drop a .torrent, a magnet or a
link anywhere", the four keys that matter with their chords (open a .torrent file, add what is on the clipboard,
filter or run a command, Settings), the clipboard's magnet or link offered with an *Add it* button when there is
one, and where downloads go with a *change* link. Nothing on it takes focus: the keys are the way in. Termina, Mirada,
Modula and nux open straight into their content and have neither.

## About window

<span class="lvl lvl-must">MUST</span> in every app. Help → About, the `help.about` command, and on macOS the
application menu's About item. It answers "what exactly am I running?" in one place, and its details are what a bug
report needs. Reference: Editora's `ui/AboutDialog.java`; Torrenta (`AboutDialog`), Termina, Modula, Mirada and nux
(`AboutWindow`) follow the same order.

### Anatomy

<div class="mock-stage">
<div class="m-card m-dialog" role="img" aria-label="Mockup of the About window">
<div class="titlebar">About Editora</div>
<div class="m-about-head"><img src="../../icons/editora.svg" alt="" /><div><div class="m-row"><span class="m-about-name">Editora</span><span class="pin">1</span></div><div class="m-about-version">Version 0.27.0 <span class="pin">2</span></div><div class="m-about-tagline">A keyboard-driven, cross-platform programmer's text editor.</div></div></div>
<div><div class="m-row"><span class="m-link" style="font-weight:700">Update available: 0.28.0</span><span class="pin">3</span></div><div class="m-subtle" style="font-size:12px">Last checked 5 minutes ago. <span class="m-link">Check now</span></div></div>
<div class="m-muted">© 2026 Adrián Arturo De León Saldivar <span class="pin">4</span></div>
<div style="display:flex;flex-direction:column;gap:2px"><span class="m-row"><span class="m-link">MIT License</span><span class="pin">5</span></span><span class="m-link">Homepage</span><span class="m-link">Source code and releases</span><span class="m-link">Settings: ~/.editora/settings.json</span></div>
<div class="m-row" style="align-items:flex-start"><div class="m-env">Editora 0.27.0 (Built 2026-11-05 17:02:11 UTC)
Commit 1dab6d8fd
Java: 25.0.4 (Eclipse Adoptium)
JavaFX: 27+30
OS: Linux 6.12.115+deb13.1-amd64 (amd64)
Config: ~/.editora</div><span class="pin">6</span></div>
<div class="m-footer-row"><span class="m-row"><span class="m-btn">Copy details</span><span class="pin">7</span></span><span class="m-row"><span class="pin">8</span><span class="m-btn primary">Close</span></span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Identity.</strong> The app icon at 72 px beside the name (26 px, bold). No alert header band, no info graphic: the panel reads as one block, like a native About panel.</span></li>
<li><span class="pin">2</span><span><strong>Version and tagline.</strong> Version 14 px muted; a snapshot build appends its Git branch, "0.28.0-SNAPSHOT (feat/map)". The tagline is the README's one-line pitch, 13 px muted.</span></li>
<li><span class="pin">3</span><span><strong>Update status.</strong> What the last update check found (see the states below), when it ran, and <em>Check now</em>. Nothing is claimed before a check has answered.</span></li>
<li><span class="pin">4</span><span><strong>Copyright</strong>, muted.</span></li>
<li><span class="pin">5</span><span><strong>Links.</strong> License, homepage, source code and releases, and the settings file, which opens in the app (or in the file manager for apps with no editor).</span></li>
<li><span class="pin">6</span><span><strong>Environment.</strong> Monospace 11.5 px, muted: version and build time, commit, Java and JavaFX versions with vendor, OS with architecture, config folder. Home folders shown as <code>~</code>.</span></li>
<li><span class="pin">7</span><span><strong>Copy details</strong> copies the environment block and stays open; its label becomes "Copied". It sits in the content, not the button bar, so pressing it does not close the panel.</span></li>
<li><span class="pin">8</span><span><strong>Close</strong>, the one button, and the default: Enter and Esc both close.</span></li>
</ol>

### Update status states

<div class="mock-stage">
<div class="m-states">
<div class="m-state"><div class="cap">Newer release</div><span class="m-link" style="font-weight:700">Update available: 0.28.0</span><div class="m-subtle">Last checked 5 minutes ago. <span class="m-link">Check now</span></div></div>
<div class="m-state"><div class="cap">Current</div><span style="color:var(--m-green)">You are up to date.</span><div class="m-subtle">Last checked 2 hours ago. <span class="m-link">Check now</span></div></div>
<div class="m-state"><div class="cap">Never checked</div><span class="m-subtle">Not checked for updates yet.</span> <span class="m-link">Check now</span></div>
<div class="m-state"><div class="cap">Checking</div><span class="m-subtle">Last checked 2 hours ago.</span> <span class="m-subtle">Checking…</span></div>
<div class="m-state"><div class="cap">Failed</div><span style="color:var(--m-red)">Update check failed: connection timed out</span><div class="m-subtle"><span class="m-link">Check now</span></div></div>
</div>
</div>

"Update available" links to that release's page. An update check that is switched off must never read as "up to
date": with no answer, the panel says it has not checked.

### Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A modal dialog owned by the window, styled through `Dialogs.styled` so it gets `app.css` and the UI font | `AboutDialog.show` |
| Layout | One column, 14 px between blocks; content padding 6 8 2 8 | `.about-content` |
| Icon | The app icon PNG at 72 px | `icon-128.png` |
| Name / version / tagline | 26 px bold / 14 px muted / 13 px muted | `.about-name`, `.about-version`, `.about-tagline` |
| Update colors | Available: accent, bold. Up to date: green. Failed: red. Last checked: muted | `.about-update*` |
| Environment | JetBrains Mono 11.5 px, muted | `.about-env` |
| Source of the version | Maven-filtered `build-info.properties`, read by `AppInfo`: the same text as `--version` and a problem report | `AppInfo` |

### Copy

| Key | English |
|---|---|
| `dialog.about.title` | About {0} |
| `about.version` | Version {0} |
| `about.updateAvailable` | Update available: |
| `about.upToDate` | You are up to date. |
| `about.lastChecked` | Last checked {0}. |
| `about.notChecked` | Not checked for updates yet. |
| `about.checkNow` / `about.checking` | Check now / Checking… |
| `about.homepage` / `about.releases` | Homepage / Source code and releases |
| `about.copyDetails` / `about.copied` | Copy details / Copied |

### In the apps

![Editora's About window](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-about.png "Editora.")

## Confirm dialog

<span class="lvl lvl-must">MUST</span> before anything the user made is removed, deleted, discarded or overwritten,
unless the action can be taken back instead (see [Window shell](../../window-shell/)). One question, asked the same
way everywhere: the text names the thing and what happens to it, the confirming button is the action's own verb in
red, and Cancel is the way out. Reference: Editora's `ui/CloseCoordinator.java` (unsaved changes, Quit) and
`GitCoordinator.confirmDestructive`; Torrenta's `ui/RemoveConfirm.java` asks it for the torrent list, the RSS tab and
every list in Settings.

### Anatomy

<div class="mock-stage">
<div class="m-card m-cf" role="img" aria-label="Mockup of the Remove and delete files question">
<div class="titlebar">Remove and delete files <span class="pin">1</span></div>
<div class="m-cf-header">Remove and delete files <span class="pin">2</span></div>
<div class="m-cf-text">Remove these 3 torrents and delete the downloaded files? This cannot be undone. <span class="pin">3</span></div>
<div class="m-cf-buttons"><span class="pin">5</span><span class="m-btn">Cancel</span><span class="m-btn danger">Delete files</span><span class="pin">4</span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Window title</strong>: the header's words again ("Remove feed", "Unsaved changes"). A plain confirmation, no icon in the title and no app name.</span></li>
<li><span class="pin">2</span><span><strong>Header</strong>, when the question is long enough to need one. Editora's Git confirmations set none and put the whole message in the content; Torrenta's header names the action and the content asks the question.</span></li>
<li><span class="pin">3</span><span><strong>The question names the thing and the consequence.</strong> How many ("these 3 torrents", a <code>{0,choice,…}</code> plural), which one ("the feed “Linux ISOs” and its articles"), what stays ("The downloaded files stay on disk."), and "This cannot be undone." only when it is true. Termina's multi-line paste shows the text itself in an expandable area, so the decision is made on what will be sent.</span></li>
<li><span class="pin">4</span><span><strong>The action button</strong> carries the action's verb (Delete files, Remove, Discard, Quit, Close), never OK or Yes, and the <code>danger</code> style: red, not the accent. It is the dialog's one colored button.</span></li>
<li><span class="pin">5</span><span><strong>Cancel</strong>, in the catalog's word, with the <code>CANCEL_CLOSE</code> role: Escape and the window's close button both answer Cancel.</span></li>
</ol>

### States

<div class="mock-stage">
<div class="m-states">
<div class="m-state m-cf-state"><div class="cap">Unsaved changes</div><div class="q">Save changes to Main.java before closing?</div><div class="row"><span class="m-btn success">Save</span><span class="m-btn danger">Discard</span><span class="m-btn">Cancel</span></div></div>
<div class="m-state m-cf-state"><div class="cap">Remove, files kept</div><div class="q">Remove this torrent? The downloaded files stay on disk.</div><div class="row"><span class="m-btn">Cancel</span><span class="m-btn danger">Remove</span></div></div>
<div class="m-state m-cf-state"><div class="cap">A program is running</div><div class="q">Close this tab? <span class="m-muted">bash (top) is still running. Closing will end it.</span></div><div class="row"><span class="m-btn primary">Cancel</span><span class="m-btn">Close</span></div></div>
<div class="m-state m-cf-state"><div class="cap">Undo instead of a question</div><div class="m-statusbar" style="border:1px solid var(--m-border);border-radius:6px"><span class="echo">Undo  Removed Ubuntu ISO</span><span class="m-chip">C-z</span></div></div>
</div>
</div>

- **Three answers** when saving is an option: Save (the `success` style, green), Discard (`danger`) and Cancel, in
  that order. Save that fails leaves the tab open.
- **A running program** is not the user's data, so Termina words the button Close and makes Cancel the default
  button: dismissing the dialog by any route keeps the program alive.
- **No question at all** where the action can be taken back. Mirada moves an image to the trash at once and offers
  Undo; Torrenta asks before removing a torrent but also keeps the removal on its undo stack for ten minutes; closing a
  clean tab asks nothing and Reopen Closed Tab brings it back.

### Spec

| Property | Value | Reference |
|---|---|---|
| Kind | `Alert(CONFIRMATION)` owned by the window (`initOwner`), shown with `showAndWait`; the answer defaults to Cancel when the dialog is closed any other way | `GitCoordinator.confirmDestructive`, `RemoveConfirm.ask` |
| Buttons | A `ButtonType` with the action's name and the `OK_DONE` role, and Cancel with `CANCEL_CLOSE` from the catalog, never JavaFX's stock OK and Cancel, which are worded in the JVM's locale | `RemoveConfirm.ask`, Torrenta's `StockButtons` |
| Action button | `danger` style class: the theme's `.button.danger` fills it `-color-danger-emphasis` with emphasis text. Save in the unsaved question: `success` | `MainController.styleUnsavedChangesButtons`, `styleQuitButtonAsDanger` |
| Default button | The action, where it has the `OK_DONE` role (Editora's Git confirmations, Torrenta's Remove): Enter runs it, and red is what says so. Editora's unsaved-changes and Quit questions give their buttons no role, so Enter does nothing. Termina's close-running-program question makes Cancel the default | `confirmDestructive`, `CloseCoordinator.unsavedAlert`, Termina `TerminalWindow` |
| Font | The UI font sheet attached to the dialog pane, because a dialog is its own scene and inherits nothing from the window | Torrenta `Fonts.installUiFont(DialogPane)`, Editora `App.installUiFont` (every window) |
| Stylesheet | `Dialogs.styled` adds `app.css` to a dialog that needs the app's own rules (About); the `-color-*` tokens and `.button.danger` resolve from the theme either way | `Dialogs` |
| Text | The question in the content; a header only when the question needs a name over it. Counts as plurals, names in quotes, the consequence spelled out | `Actions.removeQuestion`, `confirm.remove.<kind>` |
| Strings | One key per kind, header and question both, tested to exist for every kind | `RemoveConfirm.Kind`, `RemoveConfirmTest` |

### Behavior

- **Ask before, not after.** The question comes before anything changes; the removal runs only on the action button
  (`RemoveConfirm.ask` returns true on that button alone).
- **Ask once per gesture.** An action on many things asks one question with the count ("Remove these 3 torrents?",
  Torrenta's "Apply to many torrents" for a bulk command). Closing every tab asks per unsaved buffer, selecting each
  tab first so the user sees what the question is about, and remembers a Discard answer for exactly the state that was
  shown (`CloseCoordinator.confirmSweep`).
- **Escape cancels**, as does closing the dialog. Nothing is lost on a dismissal.
- **Say what it costs.** A delete that cannot be undone says so; one that leaves the files says that instead. A
  dangerous alternative (Force with Lease, Delete Anyway) is offered beside the safe one (Pull, then Push), red, and
  only when the safe one has already failed.
- **Testable without a screen.** The question's words come from pure code (`RemoveConfirm.header`, `question`) and
  the capture hook answers the dialog through `answerForCapture`, so a UI test never has to press a native button.

### Copy

| Key | English |
|---|---|
| `dialog.unsaved.title` / `dialog.unsaved.header` | Unsaved changes / Save changes to {0} before closing? |
| `dialog.save` / `dialog.discard` / `dialog.cancel` | Save / Discard / Cancel |
| `dialog.quit.header` / `dialog.quit.button` | Quit Editora? / Quit |
| `dialog.discard.tracked` | Discard all changes to "{0}"? This cannot be undone. |
| `dialog.discardAll.action` | Discard All |
| `dialog.deleteBranch.force` | Delete Anyway |
| `confirm.remove.feed.header` / `confirm.remove.feed` | Remove feed / Remove the feed “{0}” and its articles? The torrents already added stay. |
| `actions.removeQuestion.delete` | Remove this torrent and delete the downloaded files? This cannot be undone. |
| `window.remove.button.delete` / `common.remove` / `common.cancel` | Delete files / Remove / Cancel |
| `dialog.closeRunning` / `dialog.closeAnyway` (Termina) | Close this tab? / Close |

### In the apps

Editora asks for unsaved changes, Quit with busy terminals, pinned tabs, Git discards and branch deletions, and Local
History purges, all through `Alert` with named buttons. Torrenta's `RemoveConfirm` serves the torrent list, feeds,
rules, watched folders, search providers, engine profiles, categories, tags and saved views with one shape. Termina asks
before closing a tab with a running program and before a multi-line paste. Mirada and Modula ask nothing: Mirada's
trash is undoable, and Modula's preset chips remove on one click, which this template says they should not.

## Find bar

<span class="lvl lvl-must">MUST</span> wherever there is text to search: an editor, a read-only console, a terminal's
scrollback. The bar is part of the window, never a popup, and it searches as you type. A list app filters instead of
finding (Torrenta's box above the transfers), with the same field and the same Escape. Reference: Editora's
`ui/FindReplaceBar.java` (the editor's find and replace), with `ui/ConsoleFindBar.java` and `ui/TerminalFindBar.java`
as the same shape over a console and a terminal; Termina's `ui/SearchBar.java`; Torrenta's `Omnibox` and
`FilterQuery`. Mirada has no text to search: its *Find Image…* is a picker, see the [QuickOpen template](../quick-open/).

### Anatomy

<div class="mock-stage">
<div class="m-fb-win" role="img" aria-label="Mockup of the find and replace bar docked above an editor, with matches highlighted in the text">
<div class="m-fb-bar">
<div class="m-fb-row">
<span class="m-fb-label">Find:</span>
<span class="m-field focus m-fb-field"><span>status</span><span class="m-caret"></span><span class="m-grow"></span><span class="m-fb-clear">×</span></span><span class="pin">1</span>
<span class="m-fb-count">3 of 12</span><span class="pin">2</span>
<span class="m-fb-icon">‹</span><span class="m-fb-icon">›</span><span class="pin">3</span>
<span class="m-fb-label" style="margin-left:14px">Replace:</span>
<span class="m-field m-fb-field"><span class="ph">Replace</span></span>
<span class="m-btn">Replace</span><span class="m-btn">All</span><span class="pin">5</span>
<span class="m-grow"></span>
<span class="m-fb-icon">×</span><span class="pin">6</span>
</div>
<div class="m-fb-row">
<span class="m-fb-toggle on">Aa</span><span class="m-fb-toggle">.*</span><span class="m-fb-toggle">W</span><span class="m-fb-toggle">AB</span><span class="m-fb-toggle">Sel</span><span class="pin">4</span>
</div>
</div>
<div class="m-fb-code">
<div><span class="ln">41</span>    private final Label <mark class="hit">status</mark>Label = new Label();</div>
<div><span class="ln">42</span>    void setStatus(String text) { <mark class="hit">status</mark>Label.setText(text); }</div>
<div><span class="ln">43</span>    String <mark class="hit cur">status</mark>() { return <mark class="hit">status</mark>Label.getText(); }<span class="pin" style="margin-left:10px">7</span></div>
<div><span class="ln">44</span>    void clearStatus() { setStatus(""); }</div>
</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Query field</strong>, focused on open with its text selected, so typing replaces the last query. A single-line selection in the editor is the first query; a multi-line one becomes the scope instead and switches <em>Sel</em> on. A clear button appears while the field has text.</span></li>
<li><span class="pin">2</span><span><strong>Count</strong> "3 of 12", 11 px muted. Empty when there is no query, "No matches" when there are none. Wide enough that the buttons beside it do not shuffle as the digits grow.</span></li>
<li><span class="pin">3</span><span><strong>Previous and next</strong>, 28 px flat icon buttons, the same as Shift+Enter and Enter.</span></li>
<li><span class="pin">4</span><span><strong>Options</strong> as compact toggles with a two-letter caption (match case, regular expression, whole word, preserve case, in selection); the tooltip and the accessible name carry the full meaning. Disabled while the query is empty, except <em>Sel</em>, which is a scope.</span></li>
<li><span class="pin">5</span><span><strong>Replace</strong> replaces the active match and steps to the next; <em>All</em> replaces every match and reports "Replaced 12 occurrence(s)" in the status line. A console or a terminal has no replace row.</span></li>
<li><span class="pin">6</span><span><strong>Close</strong>, top right whatever the bar wraps to. Escape does the same.</span></li>
<li><span class="pin">7</span><span><strong>Matches</strong> are all highlighted while the bar is open, the active one distinctly, and the highlights follow the text as it is edited. They go when the bar closes.</span></li>
</ol>

The same bar over a terminal floats at the top right of the pane it searches, in the palette's materials, so the two
read as one family: a lens, the field as the card's own text, the count, a regex switch, and up, down and close.

<div class="mock-stage">
<div class="m-fb-term" role="img" aria-label="Mockup of Termina's find bar floating at the top right of a terminal">
<div class="m-fb-shell"><div>$ ./mvnw -q verify</div><div>[<span class="err">ERROR</span>] Tests run: 48, Failures: 1</div><div>[<span class="err">ERROR</span>]   ShelfTest.rejectsEmptyName:31 expected: &lt;true&gt; but was: &lt;false&gt;</div><div>[INFO] BUILD FAILURE</div><div>$ <span class="m-caret"></span></div></div>
<div class="m-card m-fb-float"><span class="m-fb-lens">⌕</span><span class="q">ERROR<span class="m-caret"></span></span><span class="m-fb-count">2 of 2</span><span class="m-fb-toggle">.*</span><span class="m-fb-icon">↑</span><span class="m-fb-icon">↓</span><span class="m-fb-icon">×</span></div>
<span class="pin out" style="right:-10px;top:-10px">8</span>
</div>
</div>

<ol class="anatomy" start="8">
<li><span class="pin">8</span><span><strong>Floating card</strong>, 380 px wide, radius 8, over the output being read. Enter steps <em>up</em> to older output and Shift+Enter down: a terminal is searched for something recent, so the search starts at the bottom (iTerm2's convention). The arrow keys do the same.</span></li>
</ol>

### Spec

| Property | Value | Reference |
|---|---|---|
| Kind | In-scene, never a popup. Editora docks the bar above the editor area; Termina floats it inside the `TerminalView`, so each pane of a split has its own and a search never wonders which terminal it is about | `MainController` (`topBox`), `SearchBar` |
| Docked bar | `-color-bg-subtle`, padding 4 8, spacing 6; icon buttons 28 × 28, flat; the groups (find, replace, options) wrap onto a second line in a narrow window instead of shrinking the fields | `.find-bar`, `.find-bar-icon`, `WrapRow` |
| Floating card | `-color-bg-overlay`, 1 px `-color-border-default`, radius 8, 380 px wide, padding 3 4 3 8, shadow 18 at offset 6; the field is the card's own text at 12.5 px | `.search-bar`, `.search-field` |
| Options | Toggles with a short caption; tooltip and accessible name carry the meaning; selected: `-color-accent-subtle` with `-color-accent-fg` | `OptionToggle`, `.search-toggle:selected` |
| Count | `{0} of {1}`, 11 px `-color-fg-muted`, right-aligned; minimum width 64 px | `find.count`, `search.count`, `COUNT_MIN_WIDTH` |
| Debounce | The search runs 150 ms after the last keystroke, and an edit to the text re-highlights after the same 150 ms without moving the caret | `debounce`, `editDebounce`, `TYPING_SETTLE`, `searchTyping` |
| Threading | A document up to 512 K characters is searched where the request is made; larger ones on one shared daemon thread, latest query only, the result applied on the FX thread. A scrollback is always scanned off the FX thread | `SYNC_SEARCH_CHARS`, `SEARCH_POOL`, `LatestOnly`, `TerminalView.searchAsync` |
| Bounds | A page of matches around the active one, not every match of a query that matches millions of times; a regular expression has a time budget. Termina keeps the newest 1,000 matches | `SearchMatcher.DEFAULT_PAGE`, `find.tooComplex`, `ScrollbackSearch.MAX_MATCHES` |
| Bad regex | Said in place, never by a dialog: the status line ("Bad regex: …") or, in Termina, the field in `-color-danger-fg` and the count "Invalid" | `find.badRegex`, `.search-field:invalid` |
| Focus | The bar and its buttons are out of the Tab order; in a terminal Tab belongs to the shell | `setFocusTraversable(false)` |

### Behavior

- **Open:** the find command, `C-s` in the Emacs keymap and `Ctrl/Cmd+F` in CUA, Sublime, VS Code and IntelliJ
  (`find.show`; `F3` as well in CUA and Sublime). Termina: `Ctrl+Shift+F`, `Cmd+F` on macOS, since a plain
  `Ctrl+letter` belongs to the shell. The command while the bar is already open finds the next match (Editora) or
  puts the caret back in the field (Termina).
- **Type** and the search runs: every match highlighted, the first one at or after the caret selected and scrolled
  to. The anchor is the caret at open time, so refining the query does not run away down the document.
- **Step:** Enter next, Shift+Enter previous, wrapping around at the ends. In a terminal the directions are up and
  down the scrollback. Editora: Alt+Enter turns every match into a caret.
- **Close:** Escape or the close button. The highlights go, a search still pending is canceled so nothing moves
  after the bar is gone, and focus returns to the editor, the console or the shell. In Termina the Escape is
  consumed in the field and never reaches the shell, and the terminal's own key and mouse filters leave every event
  aimed at the bar alone (`fromSearchBar`).
- **Keys in the field.** The keymap's caret and editing chords (`C-a`, `C-e`, `C-k`, `C-y`, `Ctrl+V/X/C/Z`) act on
  the field, not on the document (`TextInputKeymap.installShared`; Termina's and Mirada's `TextInputKeys`). Find's own
  chords stay global, so next, previous, replace and close work while the field has focus.
- **Nothing found** is one status-line message ("Not found: x") or the count "No matches". No beep, no dialog.
- **Replace** keeps case when *AB* is on; a replacement that is too slow stops with "Replace stopped: the pattern is
  too slow" instead of hanging the window.
- **A filter box** (Torrenta's omnibox) is the list app's version: plain words filter the names as they are typed,
  `key:value` terms become chips, `>` runs a command. `Ctrl+K` focuses it and is drawn in the box as a key badge.
  Escape peels one layer: a box with something in it empties, an empty one gives the list back. The box is out of the
  Tab order so a fresh launch does not land every keystroke in it, and the window's own chords (undo,
  `Ctrl+Alt+1…9`) do not fire while a text field has focus: `Ctrl+Z` there is the field's own undo.

### Copy

| Key | English |
|---|---|
| `find.prompt` | Find |
| `find.replacePrompt` | Replace |
| `find.count` | {0} of {1} |
| `find.notFound` | Not found: {0} |
| `find.badRegex` | Bad regex: {0} |
| `find.tooComplex` | Search stopped early: the pattern is too complex for this text |
| `find.replaced` | Replaced {0} occurrence(s) |
| `search.caseTip` · `search.regexTip` · `find.wholeWord` | Match case · Regular expression · Whole word |
| `search.older` · `search.newer` · `search.close` (Termina) | Previous match, up (Enter) · Next match, down (Shift+Enter) · Close (Escape) |
| `search.none` · `search.invalid` (Termina) | No matches · Invalid |
| `window.filter.prompt` (Torrenta) | Filter · > runs a command · paste a magnet |

### In the apps

- **Editora:** find and replace over the editor (`FindReplaceBar`), with *Find in Files* (`search.inFiles`) as a
  separate results window; the console and terminal tool windows carry the same bar without the replace row.
- **Termina:** the floating card over each pane, with the regex switch; matches are found across soft-wrapped
  lines, so a word that reached the right edge and carried on is still found.
- **Torrenta:** the omnibox above the transfers, which filters, runs commands and adds what is pasted.
- **Mirada, Modula, nux:** no free text to search; Mirada finds an image through a picker.

## Message Log

<span class="lvl lvl-must">MUST</span> in every app with a status bar. The status bar's echo line shows one message
and replaces it with the next; the Message Log keeps them, so nothing the app said is lost because it scrolled past.
Reference: Editora's `ui/MessageLog.java` (the model, no JavaFX) and `ui/MessageLogPopup.java` (the view); Torrenta
carries the same pair.

### Anatomy

<div class="mock-stage">
<div class="m-logwin" role="img" aria-label="Mockup of the Message Log open above the status bar">
<div class="m-card m-log">
<div class="m-row"><span class="header">Messages</span><span class="pin">1</span></div>
<div class="m-row"><div class="m-field focus m-grow"><span class="ph">Filter messages…</span></div><span class="pin">2</span></div>
<div class="entries">
<div class="entry sel"><span class="time">14:32:07</span><span class="m-grow">Saved Shelf.java</span><span class="pin">3</span></div>
<div class="entry"><span class="time">14:31:52</span><span class="m-grow error">Language server for Java failed to start: jdtls was not found</span><span class="pin">4</span></div>
<div class="entry"><span class="time">14:30:18</span><span class="m-grow warn">Settings sync: not connected, retrying</span></div>
<div class="entry"><span class="time">14:29:40</span><span class="m-grow">Line numbers: on</span></div>
<div class="entry"><span class="time">14:29:05</span><span class="m-grow">Opened ~/workspace/shelf/src/main/java/com/example/shelf/Shelf.java</span></div>
</div>
<div class="footer"><span class="m-btn flat">Copy</span><span class="m-btn flat">Clear</span><span class="m-btn flat">Open Doctor</span><span class="pin">5</span><span class="m-grow"></span><span class="m-subtle" style="font-size:11px">Esc to close</span><span class="pin">6</span></div>
</div>
<div class="m-statusbar"><span class="pin">7</span><span class="echo">Saved Shelf.java</span><span class="m-badge">1</span><span class="pin">8</span><span class="m-grow"></span><span>master</span><span>Ln 30, Col 1</span><span>UTF-8</span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Title</strong> "Messages", 14 px bold.</span></li>
<li><span class="pin">2</span><span><strong>Filter</strong>, focused on open. Filters as you type; ↓ or Enter moves into the results without leaving the field.</span></li>
<li><span class="pin">3</span><span><strong>Entry.</strong> The time as <code>HH:mm:ss</code> (11 px, monospace, muted) and the message as it appeared in the echo line. Newest first.</span></li>
<li><span class="pin">4</span><span><strong>Severity</strong> colors the message, not the row: errors red, warnings amber, information in the default color. The time stays muted.</span></li>
<li><span class="pin">5</span><span><strong>Actions:</strong> Copy (the visible entries as text), Clear (empties the session log and its unread count), and Open Doctor: messages carry no actions of their own, and a missing tool or a server that would not start is where Doctor helps.</span></li>
<li><span class="pin">6</span><span><strong>Key hint</strong>, muted, 11 px.</span></li>
<li><span class="pin">7</span><span><strong>Echo line.</strong> The status bar's latest message; a click opens the log.</span></li>
<li><span class="pin">8</span><span><strong>Unread errors.</strong> A red count beside the echo line while errors have arrived since the log was last opened; a click opens the log.</span></li>
</ol>

### Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A popup anchored just above the status bar's echo area, over the window | `MessageLogPopup.show` |
| Size | 773 px wide; the list 336 px high, scrolling past that | `WIDTH`, `LIST_HEIGHT` |
| Card | `-color-bg-overlay`, radius 12, like the palette | `.message-log` |
| Rows | Padding 2 4, radius 5; selected row `-state-sel` | `.message-log-list .list-cell` |
| Capacity | The newest 200 messages; older ones drop off | `MessageLog.MAX_ENTRIES` |
| Repeats | A message repeated within 2 s moves to the top as one entry, unread once | `REPEAT_MILLIS` |
| Lifetime | This session only, in memory. Not written to disk: the Debug Log is the persistent record | `MessageLog` |
| Blank messages | Not recorded (a blank message only clears the echo line) | `MessageLog.add` |

### Behavior

- **Open:** click the echo line or the unread-error count, or run `view.messageLog`.
- **Close:** Esc, `C-g`, or a click outside. **Copy:** `Ctrl/Cmd+C` copies the selected entries.
- **Severity comes from the message key** (`StatusSeverity`): a key ending in `Failed` or `Error` is an error, one
  with `cannot` or `invalid` a warning. Name new keys accordingly, or report through the error channel directly.
- Opening the log, or clearing it, resets the unread-error count. An unread error is never evicted silently: the
  count keeps it even when the entry drops off the end.

### Copy

| Key | English |
|---|---|
| `messagelog.title` | Messages |
| `messagelog.filter` | Filter messages… |
| `messagelog.empty` | No messages yet |
| `messagelog.copy` / `messagelog.clear` | Copy / Clear |
| `messagelog.doctor` | Open Doctor |
| `messagelog.hint` | Esc to close |

### In the apps

![Editora's Message Log popup above the status bar](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-message-log.png "Editora.")

## Settings Sync

<span class="lvl lvl-should">SHOULD</span> in every app with user data worth carrying between computers (snippets,
templates, shortcuts, profiles, saved views). A page in the Settings window, found by searching "sync". No server and
no account of ours: the store is a private Git repository the user owns, reached through their own Git credentials.
Reference: Editora's `sync/` package (`SyncEngine`, `SyncMerge`, `SyncAccount`) and `ui/SettingsSync.java`, with
the page in `SettingsWindow`; Torrenta and Termina carry the same package.

### Anatomy

<div class="mock-stage">
<div class="m-card m-settings" role="img" aria-label="Mockup of the Sync page in the Settings window">
<div class="side">
<div class="m-field" style="margin-bottom:6px"><span class="ph">Search settings…</span></div>
<div class="group">Version control</div>
<div class="nav"><span class="m-icon"></span>Git</div>
<div class="nav"><span class="m-icon"></span>GitHub</div>
<div class="group">System</div>
<div class="nav"><span class="m-icon"></span>Keymaps</div>
<div class="nav"><span class="m-icon"></span>Macros</div>
<div class="nav"><span class="m-icon"></span>Plugins</div>
<div class="nav on"><span class="m-icon"></span>Sync <span class="pin" style="margin-left:auto">1</span></div>
<div class="nav"><span class="m-icon"></span>Advanced</div>
</div>
<div class="page">
<div><h4>Sync</h4><div class="m-muted" style="margin-top:3px">Keep your snippets, abbreviations, templates and personal dictionary the same on every computer, through a Git repository you own.</div></div>
<div class="m-card2">
<div class="m-setrow"><div class="m-grow"><div class="label">Repository <span class="pin">2</span></div><div class="note">The URL of a private Git repository, empty or already used by another of your computers.</div><div class="m-field" style="margin-top:6px"><span class="ph">git@github.com:you/editora-sync.git</span></div></div></div>
<div class="m-setrow"><div class="m-grow"><div class="label">Branch</div><div class="note">The branch your synced files are kept on; main unless the repository also holds something else.</div></div><div class="m-field" style="width:90px">main</div><span class="m-btn primary">Connect</span><span class="m-btn">Create on GitHub…</span><span class="pin">3</span></div>
<div class="m-setrow"><div class="m-grow"><div class="label">Status</div></div><span class="pin">4</span><span class="m-pill green">Connected · synced 3 min ago</span><span class="m-btn">Sync Now</span><span class="m-btn">Open Sync Folder</span></div>
</div>
<div class="m-card2">
<div class="m-setrow" style="padding-bottom:4px"><span class="m-subtle" style="font-size:11px;font-weight:600">What to sync</span><span class="pin">5</span></div>
<div class="m-setrow"><span class="m-grow label">Snippets</span><span class="m-switch"></span></div>
<div class="m-setrow"><span class="m-grow label">Abbreviations</span><span class="m-switch"></span></div>
<div class="m-setrow"><span class="m-grow label">Templates</span><span class="m-switch"></span></div>
<div class="m-setrow"><span class="m-grow label">Personal dictionary</span><span class="m-switch off"></span></div>
<div class="m-setrow"><div class="m-grow"><div class="label">Shortcuts</div><div class="note">The shortcuts you change, in every keymap. Which keymap you use stays on each computer.</div></div><span class="m-switch"></span></div>
<div class="m-setrow"><span class="note m-grow">Not synced: your other preferences (settings.json), the keymap in use and macros stay on each computer. <span class="pin">6</span></span></div>
</div>
<div class="m-card2">
<div class="m-setrow"><div class="m-grow"><div class="label">Sync automatically <span class="pin">7</span></div><div class="note">Syncs after startup, shortly after you change something, and at this interval. It never asks for a password; a failure shows in the status bar.</div></div><div class="m-field" style="width:58px">15</div><span class="m-muted">minutes</span><span class="m-switch"></span></div>
<div class="m-setrow"><span class="note m-grow">Use a private repository: snippets and templates can contain private text. When the same entry was changed on two computers, the one you sync from keeps its version and the other version stays in the repository history. <span class="pin">8</span></span></div>
</div>
</div>
<div class="bottom"><span class="m-btn">Reset to Defaults</span><span>Changes apply as you make them. Every setting is also a palette command.</span><span class="m-btn primary">Close</span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Its own page</strong> in the Settings sidebar, under System, found by the Settings search ("sync", "git", "github").</span></li>
<li><span class="pin">2</span><span><strong>Repository URL.</strong> SSH or HTTPS. A URL with a password or token in it is refused, with the reason and the fix (a credential helper such as <code>gh auth setup-git</code>, or an SSH URL).</span></li>
<li><span class="pin">3</span><span><strong>Branch, Connect, Create on GitHub….</strong> Connect clones or adopts the repository. Create on GitHub makes a private repository through the <code>gh</code> CLI and fills the URL in.</span></li>
<li><span class="pin">4</span><span><strong>Status pill</strong> plus Sync Now and Open Sync Folder (see the states below).</span></li>
<li><span class="pin">5</span><span><strong>What to sync:</strong> one switch per kind of data, each with a description when its scope is not obvious.</span></li>
<li><span class="pin">6</span><span><strong>What is not synced</strong>, said plainly: machine-local preferences, the keymap in use, anything with paths.</span></li>
<li><span class="pin">7</span><span><strong>Automatic sync</strong> with its interval in minutes (default 15, at least 1). Automatic runs never prompt.</span></li>
<li><span class="pin">8</span><span><strong>Privacy and conflicts</strong>, in one note: use a private repository; on a same-entry conflict the computer you sync from wins, and the other version stays in the history.</span></li>
</ol>

### Status pill states

<div class="mock-stage">
<div class="m-states">
<div class="m-state"><div class="cap">Never connected</div><span class="m-pill amber">Not connected</span></div>
<div class="m-state"><div class="cap">Connected</div><span class="m-pill green">Connected · synced just now</span></div>
<div class="m-state"><div class="cap">Running</div><span class="m-pill green">Connected · syncing…</span></div>
<div class="m-state"><div class="cap">Network trouble</div><span class="m-pill amber">Not connected · retrying</span></div>
<div class="m-state"><div class="cap">Needs the user</div><span class="m-pill red">Sync failing</span></div>
</div>
</div>

Green, amber and red are the Settings status-pill colors. Amber means "will recover by itself" (offline, the
remote unreachable); red means "the user must act" (Git missing, the repository written by a newer version, a sync
that would remove most of a kind of data and waits for confirmation). The pill's accessible text is
"Sync status: …".

### Spec

| Property | Value | Reference |
|---|---|---|
| Store | A Git repository the user owns, cloned into `<config>/sync/`; one folder per kind of data | `SyncEngine`, `SyncTarget` |
| Sign-in | The user's own Git credentials (credential helper or SSH key); the GitHub account that can read the repository is pinned per clone | `SyncAccount` |
| Automatic runs | After startup, 30 s after a local change, and every *n* minutes (default 15) | `SettingsSync.DIRTY_DELAY_SECONDS`, `syncIntervalMinutes` |
| Conflicts | Per entry; this computer wins; the other version stays in history | `SyncMerge` |
| Safety | Files a sync replaces are copied to the sync folder first; a sync that would remove most of a kind of data stops and asks | `SyncReport` |
| One runner | Sync runs in the first instance only; a second instance says so | `status.sync.secondaryInstance` |
| Failures | To the status bar and the [Message Log](../message-log/), said once per failure, not once per interval | `SettingsSync` |
| Palette | Settings Sync: Set Up…, Sync Now, and Toggle Sync Automatically | `sync.setup`, `sync.now`, `sync.toggleAuto` |

### Copy

| Key | English |
|---|---|
| `settings.sync.subtitle` | Keep your snippets, abbreviations, templates and personal dictionary the same on every computer, through a Git repository you own. |
| `settings.sync.connect` / `settings.sync.createGithub` | Connect / Create on GitHub… |
| `settings.sync.now` / `settings.sync.openFolder` | Sync Now / Open Sync Folder |
| `settings.sync.pill.*` | Connected · Not connected · Sync failing · syncing… · retrying · synced {0} min ago |
| `status.sync.notSetUp` | Settings sync is not connected. Set it up in Settings ▸ Sync. |

### In the apps

![Editora's Sync settings page](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/editora-settings-sync.png "Editora.")
![Torrenta's Sync settings page](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/torrenta-settings-sync.png "Torrenta.")
![Termina's Sync settings page](https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/termina-settings-sync.png "Termina.")

## Packaging, signing and release

### Targets

Each target builds on its own GitHub-hosted runner. jpackage and JavaFX natives are host-specific, so there
is no cross-building.

| Target | Runner | Downloads |
|---|---|---|
| Linux x64 | `ubuntu-latest` | `.deb`, `.rpm`, `.AppImage`, `.tar.gz`, fat jar |
| Linux arm64 | `ubuntu-24.04-arm` | `.tar.gz` (and `.deb` where the app's tooling allows), fat jar |
| macOS arm64 | `macos-15` | `.dmg` |
| macOS x64 | `macos-15-intel` | `.dmg` (the last Intel image, good to about Aug 2027) |
| Windows x64 | `windows-latest` | `.msi`, fat jar |
| Windows arm64 | — | **Not possible yet**: OpenJFX publishes no `win-aarch64` natives (JDK-8314064). ARM users run the x64 MSI under emulation. |

- Downloads are named `<App>-<version>-<target>.<ext>`.
- jpackage builds the installers through the Maven `dist` profile. **JReleaser** (`jreleaser.yml`) only
  creates the GitHub release: it attaches the files, `checksums_sha256.txt` and the changelog section.
- The maven version is the single source of truth: `-SNAPSHOT` on `master`, a tag `vX.Y.Z` releases, a
  post-release job bumps to the next snapshot (Editora's `bump` job in `release.yml` opens that pull request).
- GitHub releases are immutable, so a **release-asset check** fails the run before publishing when an
  expected file is missing (Editora's "Verify the expected release assets" step in `release.yml`).
- **Linux desktop integration**: a `.desktop` file whose `StartupWMClass` is the JavaFX app class, plus
  AppStream metainfo `io.github.adriandeleon.<App>` (Torrenta's `packaging/linux/` holds both; Editora's
  `packaging/linux/Editora.desktop` has the `StartupWMClass`, but its metainfo id predates the rule).
- **AOT cache** (JDK 25 Leyden): a training run during packaging cuts start-up time; Linux legs run it under
  `xvfb` (Editora's `scripts/aot_build.java`).

### Install methods

| Channel | Platform | What the user runs | How it is published | Level |
|---|---|---|---|---|
| GitHub release | All | Download the `.dmg`, `.msi`, `.deb`, `.rpm`, `.AppImage` or `.tar.gz` | JReleaser attaches every file, with checksums | MUST |
| Homebrew cask | macOS (Apple Silicon) | `brew install --cask adriandeleon/tap/<app>` | JReleaser's `brew` packager writes the cask to [`adriandeleon/homebrew-tap`](https://github.com/adriandeleon/homebrew-tap) | SHOULD |
| winget | Windows x64 | `winget install AdrianDeLeon.<App>` | JReleaser's `winget` packager opens a pull request on [`microsoft/winget-pkgs`](https://github.com/microsoft/winget-pkgs) from the `adriandeleon` fork | SHOULD |

- **One tap for the family.** The official homebrew-cask repository has notability rules a new project does not
  meet, so the casks live in a personal tap. A cask takes exactly one artifact: it serves Apple Silicon, and
  Intel Macs use the `macos-x64` DMG.
- **winget is reviewed by Microsoft.** The first submission for a new publisher is checked by a person, not
  merged automatically. The package identifier is `AdrianDeLeon.<App>`, the moniker the app's lower-case name.
- **Both need a `PACKAGES_TOKEN` secret**, a classic personal access token with `repo` scope: the workflow's own
  token cannot write to the tap or open a pull request on the fork. Without it JReleaser skips both packagers and
  the GitHub release still publishes.
- `jreleaser package --basedir .` writes the cask and the winget manifests locally, to check them without
  releasing.
- **Status on 2026-11-06:** the tap exists and holds no casks yet. Torrenta and Termina have both packagers
  configured, waiting for the token. Mirada's first winget submission
  ([microsoft/winget-pkgs#471599](https://github.com/microsoft/winget-pkgs/pull/471599)) is open.

### Signing

| Platform | How | Status in the family |
|---|---|---|
| macOS `.dmg` | Developer ID Application certificate (team 8JKSF797L8), hardened runtime with per-app entitlements, `notarytool` submission, stapled ticket, `spctl` check, then a smoke launch of the notarized app. Secrets per repo: `MACOS_CERT_P12`, `MACOS_CERT_PASSWORD`, `APPLE_API_KEY_P8`, `APPLE_API_KEY_ID`, `APPLE_API_ISSUER`. A tag without the secrets fails. | **Done** in all six |
| Linux `.deb` `.rpm` `.AppImage` `.tar.gz` | One shared OpenPGP release key ("Adrian De Leon (release signing)"). A separate `sign-linux` job: `rpmsign` for `.rpm`, a debsigs origin signature for `.deb`, and an armoured `.asc` beside every file. Public key committed as `packaging/linux/signing-key.asc` and attached to each release. Secrets `LINUX_GPG_KEY`, `LINUX_GPG_PASSPHRASE`. Shared scripts `sign-linux-packages.sh` and `check-linux-signatures.sh`. | Editora, Torrenta, Termina, Modula; Mirada partly; nux not yet |
| Windows `.msi` | Authenticode. **Open decision**: SignPath Foundation (free for OSS), Certum Open Source cert, or Azure Trusted Signing. Until then MSIs are unsigned and SmartScreen warns. | **Not done** in any app |
| All | GitHub **build provenance attestations** (`actions/attest-build-provenance`) for every download; `gh attestation verify` checks them. | Editora, Termina |

- Signing steps skip cleanly when the secrets are absent, so a fork or a dry run still builds.
- The certificate renews before 2027-11-30; the Apple membership before 2027-10-31.

### CI/CD (GitHub Actions)

| Workflow | When | What | Level |
|---|---|---|---|
| `ci.yml` | Every push to `master` and every pull request | **Format** (`spotless:check`) and **Build & Test** (`./mvnw verify`, coverage gate included) on JDK 25. Both are required status checks for `master`. | MUST |
| `full-tests.yml` | Daily (cron), on a pull request labeled `full-ci`, and before every release | The full suite on Linux, macOS and Windows; flaky tests listed in the job summary. | SHOULD |
| `release.yml` | A `v*` tag that matches the pom version; `workflow_dispatch` as a dry run | The five-target matrix, signing jobs, attestations, the release-asset check, JReleaser, then the bump to the next snapshot. A dry run builds and signs and publishes nothing. | MUST |

Every workflow:

- Pins each third-party action to a commit SHA, with its version in a comment
  (`actions/setup-java@b843ebf… # v6.1.0`). Dependabot updates `github-actions` and `maven` weekly.
- Starts from `permissions: contents: read`; only a job that publishes asks for write access, in its own block.
- Sets up Temurin JDK 25 with `actions/setup-java` and `cache: maven`.
- Puts `timeout-minutes` on every job, and uses `concurrency` to cancel a superseded pull-request run, never a run
  on `master`.
- Uploads the surefire reports when tests fail and the JaCoCo report always; writes the coverage totals to the
  job summary (Editora's "Summarise coverage" step in `ci.yml`).
- Skips signing cleanly when the secrets are absent (forks, dry runs); a tag without them fails (Editora's
  "Import signing certificate (macOS)" step checks `MACOS_CERT_P12` first).
- Launches the packaged app once on each OS before a release (a smoke test): Torrenta's "Smoke-test the
  packaged app" step runs the launcher in every target's image. Editora runs only the notarized macOS app
  (`--version`).

## Feature matrix

Surveyed on 2026-11-05 from each repository's default branch (the rows added in editions 1.2.0, 1.3.0 and 1.4.0 on 2026-11-06). ● has it, ◐ partly or differently,
— not found.

**What the apps are.**

| App | What it is | Homepage | Source |
|---|---|---|---|
| Editora | Programmer's text editor (the reference) | [editora-project.dev](https://editora-project.dev/) | [adriandeleon/Editora](https://github.com/adriandeleon/Editora) |
| Torrenta | BitTorrent client | [torrenta-project.dev](https://torrenta-project.dev/) | [adriandeleon/torrenta](https://github.com/adriandeleon/torrenta) |
| Termina | Terminal emulator | [termina-project.dev](https://termina-project.dev/) | [adriandeleon/Termina](https://github.com/adriandeleon/Termina) |
| Modula | Software-defined-radio receiver | — | [adriandeleon/Modula](https://github.com/adriandeleon/Modula) |
| Mirada | Fast image viewer (GraalVM native image) | [mirada-project.dev](https://mirada-project.dev/) | [adriandeleon/Mirada](https://github.com/adriandeleon/Mirada) |
| nux | UPS monitor for Network UPS Tools, in the tray | — | [adriandeleon/nux](https://github.com/adriandeleon/nux) |

### Platform and repository


| | Editora | Torrenta | Termina | Modula | Mirada | nux |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| JDK 25+ and JavaFX 27+, JPMS module, `mvnw` | ● | ● | ● | ● | ● | ● |
| AtlantaFX 3 | ● | ● | ◐ vendored CSS | ● Primer | ● Cupertino | ● Primer |
| Inter UI font (SHOULD) | ● | ● | ● | — Plex Mono | — | — |
| NullAway + every package `@NullMarked` | ● | ● | ● | ● | ● | — |
| Spotless (Palantir) | ● | ● | ● | ● | ● | — |
| JaCoCo gate | ● 0.90 L/M | ● 0.90 L | ◐ per-package | — | — | — |
| Headless FX tests | ● | ● | ● | — | ● | ● |
| Six or more message catalogs | ● | ● | ● | — | — | ● |
| README badges + screenshot | ● | ● | ● | ● | ◐ no shot | ● |
| Keep a Changelog format | ● | ◐ | ◐ | ● | ◐ | ● |
| MIT `LICENSE` + `NOTICE` | ● | ● | ● | ● | ● | ● |
| `AGENTS.md` canonical, `CLAUDE.md` a pointer | ● | ◐ `CLAUDE.md` only | ● | ◐ `CLAUDE.md` only | ● | ◐ copy |
| `CONTRIBUTING.md` | ● | — | — | — | — | — |
| `docs/` and `branding/` | ● | ● | ● | ● | ● | ● |
| `docs/README.md` indexing the guides | ● | — | — | — | — | — |
| User docs on the website (`/docs/`) | ● 43 pages, versioned | ● 19 pages | ● 16 pages | — README only | ● 11 pages | — README only |
| Help → Documentation command | ● | — | — | — | — | — |
| `bug_report.yml` issue form | ● | ● | — | — | — | — |
| Dependabot | ● | ● | — | ● | — | ● |


### Release and signing


| | Editora | Torrenta | Termina | Modula | Mirada | nux |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| JReleaser | ● | ● | ● | — | — | — |
| Five-target matrix (Linux x64/arm64, macOS arm64/x64, Windows x64) | ● | ◐ | ● | ◐ no Linux arm64 | ● | ● |
| macOS signed + notarized `.dmg` | ● | ● | ● | ● | ● | ● |
| Linux OpenPGP `.asc` signatures | ● | ● | ● | ● | ◐ rpm + checksums | — |
| Windows `.msi` Authenticode | — | — | — | — | — | — |
| Build provenance attestations | ● | — | ● | — | — | — |
| Homebrew cask / winget manifests | — | ● | ● | — | ◐ winget | — |
| `.desktop` file + AppStream metainfo | ● | ● | ● | ● | ◐ no metainfo | ◐ no metainfo |
| AOT start-up training | ● | — | ● | — | ● | — |


### User-facing features


| | Editora | Torrenta | Termina | Modula | Mirada | nux |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Command registry + Command Palette (in-scene overlay) | ● | ● | ● | ● | ● | ● |
| QuickOpen-style pickers for lists | ● | — palette only | — palette only | — palette only | ● `Choices` | — palette only |
| Find bar: in-scene, incremental, count, Esc returns focus | ● find and replace | ◐ filter box | ● floating card | — | — picker | — |
| Keymap presets | ● 9 | — | — | — | — | — |
| Keybinding editor / shortcuts reference | ● | ● | ● | — | ◐ | — |
| Menu rows carry the command's icon | ● | ● | ● | — | ● | — tray only |
| Chord shown beside each menu row | ● own column | ◐ native accelerator | — | ● | ● | — |
| Right-click menu: one at a time, any outside press closes it | ● every window | ◐ stock auto-hide | ◐ terminal view | ◐ radio pane | ◐ stock auto-hide | — |
| Icon-only buttons carry an accessible name | ● `Icons.name` | ● | — tooltip only | — tooltip only | ◐ badges only | ● by hand |
| Toolbar tooltips show the command's chord | ● | ● | — no toolbar | — | ● | — |
| Tab strip: unsaved and pinned states, drag to reorder, reopen closed | ● | — | ◐ reorder and reopen, no pin | — | — | — |
| Panels toggled by commands, placement remembered | ● stripes, dock, float | ● sidebar and detail pane | ◐ panes in a tab | — | ◐ info panel and strip | — |
| Settings window | ● | ● | ● | ● | ● | ● |
| Settings search | ● | ● | ● | — | — | — |
| Settings sync (Git / GitHub via `gh`) | ● | ● | ● | — | — | — |
| Message Log (status-bar history) | ● | ● | — | — | — | — |
| Debug Log + uncaught exception handler | ● | ● | ● | — | — | — |
| Update notification (GitHub releases) | ● | ● | ● | ● | — | ● |
| Report a Problem → GitHub issue (+ `--report`) | ● | ● | — | — | — | — |
| About window with runtime versions | ● | ● | ● | ● | ● | ● |
| Welcome page | ● | ● | — | — | — | — |
| Confirm dialog: named red action button, Escape cancels, or undo instead | ● | ● `RemoveConfirm` + undo | ◐ asks, button not red | — presets remove on one click | ◐ trash is undoable, no question | — nothing to confirm |
| Doctor / diagnosis | ● | ◐ per torrent | — | ◐ native libs | — | — |
| Single instance (hand off to running app) | ● | ● | — | — | — | ● |
| `--config-dir` and other CLI flags | ● | ● | ● | — | — | ◐ |
| Light / dark / follow system, live switch | ● | ● | ● | ● | ● | ● |
| Caret & Ink theme pair (Editora Light / Dark) | ● authored | ● vendored | ● vendored | — | — Cupertino | — Primer |
| Icons as themed SVG paths, one style class per family | ● two families | ● two families | ● filled, menus | ◐ transport glyphs | ● hand-drawn stroked | — tray bitmap |
| State colors from theme roles, contrast-tested | ● `StyleContrastTest` | ◐ roles, no test | ◐ roles; terminal schemes tested | — fixed hexes | ◐ accent tested | ◐ roles, no test |
| Extended title bar (`HeaderBar`, `StageStyle.EXTENDED`) | ● | ◐ opt-in | ● | — | ● | — |
| Desktop notifications | ● | ● | ● | ● | — | ● |
| Tray icon (SNI over D-Bus, AWT fallback) | — | ● | — | ● | — | ● |
| Close to tray, only while an icon is up | — | ● | — | ● | — | ● |
| Start at login (XDG, LaunchAgent, `HKCU` Run) and `--minimized` | — | ● | — | — | — | ● |
| Window geometry restore | ● | ● | ● | — | ● | — |
| Config export / import | ● | — | — | — | — | — |
| Plugins | ● | — | — | — | — | — |

## Shared features

Beyond the list this guide started from, these already exist in two or more apps and belong in the
guideline:

1. **`AppInfo` + `build-info.properties`.** Version, build time and commit come from a Maven-filtered
   resource, read by About, `--version`, the update check and problem reports. *(all six)*
2. **Shared `update/` package** (`UpdateCheck` pure parser, `UpdateService`, `ReleaseInfo`). *(5 apps)*
3. **Pure palette core shared**: `FuzzyMatch`, `MatchText`, `KeyChord`, `PaletteKeys` and the caret-key helper
   (`TextInputKeymap` in Editora, `TextInputKeys` in the copies). Emacs-style caret keys work inside the palette's
   query field. *(Editora → Termina → Mirada; Torrenta takes `MatchText` only)*
4. **Shortcuts reference window**: a searchable list of every key, opened from Help. *(Termina, Mirada)*
5. **Extended title bar** with JavaFX 27 `HeaderBar` and `StageStyle.EXTENDED`, falling back to a
   decorated window; the macOS system menu bar via `useSystemMenuBar`. *(Editora, Termina, Mirada,
   Torrenta opt-in)*
6. **macOS app-menu integration**: About and Settings in the application menu, `openFiles` Apple Events
   reaching the running app (`MacOpenFiles` / `MacHandlers`). *(Editora, Mirada, Torrenta)*
7. **Tray package** (`AwtTray`, `SniTray`, `StatusNotifierItem` over dbus-java) plus **autostart** (XDG
   autostart, LaunchAgent, `HKCU\…\Run`) and `--minimized`. *(Torrenta, Modula, nux)*
8. **Desktop notifications** through one `Notifier`: `notify-send`/`gdbus` on Linux, `osascript` on macOS,
   a PowerShell toast on Windows, the tray as fallback. *(Torrenta, Termina, Modula, nux, Editora)*
9. **Window geometry that stays on screen**: `WindowGeometry` / `WindowPlacement` restore size and
   position but move a window back when its monitor is gone. *(Editora, Torrenta, Termina, Mirada)*
10. **Linux desktop integration**: a `.desktop` file whose `StartupWMClass` matches the JavaFX app class
    (`com.<app>.App`), AppStream metainfo `io.github.adriandeleon.<App>`, multi-size PNG icons.
11. **Package-manager channels**: Homebrew cask and winget manifests generated by JReleaser.
    *(Torrenta, Termina, Mirada)*
12. **Atomic config writes** with a file lock, and values clamped to a valid range when read.
    *(Termina, nux, Mirada)*
13. **Dev capture / screenshot mode** (`DevCapture`, nux `--screenshot=`): renders the real UI headless at
    2× for README, website and bug-report images. *(Torrenta, Termina, nux; Editora uses an external headless harness)*
14. **Smoke launch in CI**: the packaged app is started and checked (still running after 20 s, or
    `--version`) on every OS before release. *(all six)*
15. **Release dry run**: `workflow_dispatch` builds and signs with throwaway credentials and publishes
    nothing. *(Editora, Modula, Mirada, nux, Termina)*
16. **`SECURITY.md`** with how to report a vulnerability privately. *(Modula; worth adding everywhere)*
17. **Simple mode / density**: fewer menus and a compact layout for new users. *(Editora, Torrenta)*
18. **Zoom levels** stored per window kind, `Ctrl/Cmd +/-/0`. *(Editora, Termina)*
19. **Undo for destructive list actions** (remove a torrent, close a tab) and **reopen closed tab**.
    *(Torrenta `UndoStack`, Termina and Editora `ClosedTabs`)*

## Gaps per app

| App | Missing MUSTs |
|---|---|
| **Editora** | Windows MSI signing. |
| **Torrenta** | Help → Documentation; `docs/README.md`; Keep-a-Changelog format; `AGENTS.md` (only `CLAUDE.md` is committed); `CONTRIBUTING.md`; Windows signing; attestations. |
| **Termina** | Help → Documentation; `docs/README.md`; Message Log; Report a Problem; single instance; `bug_report.yml`; `CONTRIBUTING.md`; full coverage gate; Windows signing. |
| **Modula** | User docs on a website; Help → Documentation; `docs/README.md`; JaCoCo; headless FX tests; i18n; Settings search and sync; Message/Debug Log; Report a Problem; `AGENTS.md`; `CONTRIBUTING.md`; `bug_report.yml`; JReleaser; Linux arm64. |
| **Mirada** | Help → Documentation; `docs/README.md`; JaCoCo; i18n; Settings search and sync; Message/Debug Log; uncaught handler; update check; Report a Problem; `CONTRIBUTING.md`; `bug_report.yml`; JReleaser. |
| **nux** | User docs on a website; Help → Documentation; `docs/README.md`; NullAway; Spotless; JaCoCo; Settings search and sync; Message/Debug Log; Report a Problem; `CONTRIBUTING.md`; `bug_report.yml`; Linux signatures; JReleaser. |

