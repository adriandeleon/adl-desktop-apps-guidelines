---
title: "New app checklist"
description: "Everything a new app needs before its first release, grouped by area."
---

Each group links to the page with the rules and the Editora code to copy. Everything here is a MUST unless it says
SHOULD.

**Start from the template.** [adl-desktop-app-template](https://github.com/adriandeleon/adl-desktop-app-template) is a GitHub template repository: a
small runnable app with its tests, CI and release workflows and every repository document, built to the edition its
README names. Click **Use this template**, run `scripts/rename.sh <AppName> <package>`, then add any rule on this list
from a later edition.

## Conformance

[Conformance](../conformance/) · [Pauta window](../templates/pauta-window/)

- [ ] `pauta.version` in `pom.xml` names the edition; About shows it and its conformance, *Built to Pauta 4.2.0* and *Pauta conformance: Core*
- [ ] Every rule the app does not meet is an exception in `pauta.json`: not applicable, a deviation (SHOULDs only) with a decision record, or pending with an issue in the app's own repository
- [ ] The conformance (Complete, Core or Partial) is computed from the exceptions by one tested helper, never stored
- [ ] `PautaConformanceTest` checks `pauta.json` and the README against the edition's `rules.json`
- [ ] A Pauta window, `help.pauta`, in the palette, the Help menu and About's link, listing every exception
- [ ] A *Pauta conformance* page in the user docs with the same list, generated from `pauta.json` (generated: SHOULD)

## Platform

[Platform baseline](../platform/)

- [ ] JDK 25 or newer (`release` 25 is the floor) and JavaFX 27 or newer
- [ ] One JPMS module, `com.<app>`
- [ ] Maven Wrapper committed (`mvnw`, `mvnw.cmd`, `.mvn/wrapper/`)
- [ ] AtlantaFX light and dark themes, following the system by default
- [ ] Inter bundled and attached to every scene and dialog (SHOULD)

## Code quality

[Code quality gates](../quality/)

- [ ] The version comes only from `pom.xml` (filtered `build-info.properties`); lists that repeat a fact have a drift test
- [ ] Rules live in pure, unit-tested helpers; UI classes stay thin
- [ ] A capture hook or headless screenshot drives the real window for UI checks
- [ ] Every package `@NullMarked`; NullAway on Error Prone fails the build
- [ ] Spotless with Palantir Java Format
- [ ] JUnit 5 and headless FX tests (`-Dglass.platform=Headless`), FX tests tagged `fx`
- [ ] JaCoCo check at 0.90 lines and 0.90 methods

## Performance

[Performance](../performance/)

- [ ] No I/O, process, parsing or waiting on the JavaFX application thread; results return through `Platform.runLater`
- [ ] Background results applied under a generation guard; named daemon threads
- [ ] Redraws coalesced to one per pulse; streams delivered in batches
- [ ] Logs, histories and caches bounded; large inputs guarded
- [ ] Only the first frame built before it paints; update check and extras deferred

## Keyboard and commands

[Keyboard first](../keyboard/)

- [ ] One `CommandRegistry`: every action is a command with an id
- [ ] Command Palette as an in-scene overlay, not a `Popup`
- [ ] Emacs and CUA keymaps at least, with user overrides on top
- [ ] One QuickOpen-style picker for every list choice (themes, keymaps, recent items, a setting's values), in the overlay host (SHOULD)
- [ ] A find bar in the scene wherever there is text to search: searches as you type with a count, Enter and Shift+Enter step, Escape closes it and returns focus (`FindReplaceBar`, Termina's [`SearchBar`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SearchBar.java))

## Window shell

[Window shell](../window-shell/) · [Welcome page](../templates/welcome/) · [Confirm dialog](../templates/confirm-dialog/)

- [ ] A Welcome page when there is nothing to restore, or an empty state that names the ways in with their chords (SHOULD)
- [ ] Every destructive action asks first through one helper: the question names the thing, the button names the action in the `danger` style, Escape cancels; or the action is undoable instead

## Icons and color

[Icons and color](../icons-and-color/)

- [ ] Inter attached to every scene by a scene stylesheet; state colors named once on `.root` from the theme's roles, no fixed hex in a component rule
- [ ] Readable text in `-color-fg-muted` or stronger, `-color-fg-emphasis` on an emphasis fill; a pure contrast test over the stylesheets (SHOULD)
- [ ] Icons as themed SVG paths in one `Icons` class, one style class per family, the same glyph for an action everywhere it is reached

## Toolbars and tooltips

[Toolbars and tooltips](../toolbars-and-tooltips/)

- [ ] Icon-only buttons built by one helper that sets the tooltip and the accessible name (`Icons.button`, `Icons.name`)
- [ ] Toolbar buttons out of the Tab order; every tooltip names the command and its chord from the active keymap
- [ ] Groups separated by spacing on one chrome band, no hairlines; a toggle wears `:open` while it is on (SHOULD)

## Tabs and panels

[Tabs and tool panels](../tabs-and-panels/)

- [ ] One tab header carries the states: `•` and amber italic for unsaved, a pin and bold for pinned, muted italic for read-only (`TabHeaders`)
- [ ] Bulk close skips pinned tabs, and Reopen Closed Tab brings the last one back with its caret (`ClosedTabs`)
- [ ] Panels toggled by commands, with side, order and divider positions restored on the next launch (`ToolWindowManager`) (SHOULD)

## Menus

[Menus](../menus/)

- [ ] Menu rows are commands: icon, title and chord from the registry and the active keymap, no `KeyCombination` accelerators
- [ ] Every row of every menu, right-click menus and drop-downs included, has an icon that depicts it and its chord when bound, in the 11 px periwinkle column
- [ ] Menus draw in Inter 14 px whatever they were opened from (`.context-menu` pins the font in pixels)
- [ ] Right-click menus close on a press anywhere outside them and never stack (`ContextMenuDismissal` installed at startup)
- [ ] Right-click menus open from the Menu key and Shift+F10 at the selected row (`RowContextMenu`)

## Tray and background

[Tray and background](../tray-and-background/) (for an app that keeps working without its window)

- [ ] The shared `tray/` package: StatusNotifierItem on Linux, AWT elsewhere, created off the FX thread, and the app fully usable without one
- [ ] Closing the window hides it only while an icon is up and the setting says so; Quit is explicit and one path
- [ ] Start at login writes the OS entry (XDG autostart, LaunchAgent, `HKCU` Run) with no setting beside it, `--minimized` behind the icon (SHOULD)
- [ ] Desktop notifications through one `Notifier`, off the FX thread, one switch per event

## Settings

[Settings](../settings/)

- [ ] Settings window with a page sidebar, search and live apply
- [ ] A palette command for every setting
- [ ] Versioned config in `~/.<app>`, with migrations and downgrade backups
- [ ] Export and import of the config folder
- [ ] Config read with suspicion: values clamped on load, an unreadable file kept as a backup and defaults loaded
- [ ] No secret in a config file: keys and tokens in the OS keychain, a credential the app can ask for again in memory only
- [ ] A secret in the wrong place refused (a sync URL with a password, an unredacted problem report), and an option that weakens security only a config key
- [ ] Settings sync through a Git/GitHub repository (SHOULD)

## Diagnostics

[Diagnostics and support](../diagnostics/)

- [ ] Status-bar echo and Message Log
- [ ] Debug Log with a session file, and an uncaught exception handler
- [ ] Daily update check with an off switch; About shows versions, the Pauta edition and conformance, and update status
- [ ] Report a Problem (redacted, prefilled GitHub issue) and `--report`

## Command line and languages

[Command line](../command-line/) · [Internationalization](../i18n/)

- [ ] `--help`, `--version`, `--config-dir`, `--dev`
- [ ] Single instance per config folder
- [ ] At least six message catalogs, with a parity test

## Repository

[Repository documents](../repository/)

- [ ] `README.md` with the badge row and a light/dark hero screenshot
- [ ] `CHANGELOG.md` in Keep a Changelog format
- [ ] MIT `LICENSE`, and `NOTICE` with every third-party license
- [ ] `AGENTS.md`, with a one-line `CLAUDE.md` pointing to it
- [ ] `CONTRIBUTING.md`, `docs/` and `branding/`
- [ ] `.github/ISSUE_TEMPLATE/bug_report.yml`

## Documentation

[Documentation](../documentation/)

- [ ] User docs on the app's website under `/docs/`: Getting started, a page per feature area, the keyboard reference, Settings and an FAQ
- [ ] Help → Documentation as a command (`help.documentation`), first in the Help menu after the Command Palette, and on the Welcome page
- [ ] A one-line `command.<id>.desc` for every command, held by the parity test
- [ ] `docs/README.md` indexes the contributor guides; `AGENTS.md` and `CONTRIBUTING.md` point into it
- [ ] Docs change in the same PR as the code; when they disagree with the code, the code wins and the docs are fixed
- [ ] Deep links from the app open the running version's docs, `/docs/v-<version>/` (SHOULD)
- [ ] Command and keybinding references generated from the source, with a check that quoted ids and chords exist (SHOULD)

## Packaging and signing

[Packaging, signing and release](../release/)

- [ ] jpackage installers through JReleaser: Linux x64 and arm64, macOS arm64 and x64, Windows x64
- [ ] macOS `.dmg` signed with Developer ID, notarized and stapled
- [ ] Linux downloads with `.asc` signatures from the shared release key
- [ ] Build provenance attestations for every download
- [ ] Windows `.msi` Authenticode, once the certificate is chosen (SHOULD)
- [ ] Homebrew cask in `adriandeleon/homebrew-tap` and a winget package `AdrianDeLeon.<App>` (SHOULD)

## CI/CD (GitHub Actions)

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
