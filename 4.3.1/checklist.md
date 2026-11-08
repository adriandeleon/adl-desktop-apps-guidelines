# New app checklist

> Every MUST a new app meets before its first release, and the SHOULDs worth doing first, grouped by area.

Pauta 4.3.1 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.3.1/checklist/.
Every rule of the edition: https://pauta-project.dev/4.3.1/llms-full.txt.

Each group links to the page with the rules and the Editora code to copy, and each line names its rules. Every MUST of
this edition is on a line; a line marked SHOULD holds only SHOULDs. A rule's level is the one on its own page, and
`npm run check` fails when a line here disagrees with it.

**Start from the template.** [adl-desktop-app-template](https://github.com/adriandeleon/adl-desktop-app-template) is a GitHub template repository: a
small runnable app with its tests, CI and release workflows and every repository document, made toward the edition its
README names; its Pauta window lists what is left. Click **Use this template**, run `scripts/rename.sh <AppName>
<package>`, then add any rule on this list from a later edition.

## Conformance

[Conformance](https://pauta-project.dev/4.3.1/conformance/) · [Pauta window](https://pauta-project.dev/4.3.1/templates/pauta-window/) · [About window](https://pauta-project.dev/4.3.1/templates/about/)

- [ ] The app implements one edition, named by `pauta.version` in `pom.xml`, and states its conformance: Complete, Core or Partial · [PAUTA-01](https://pauta-project.dev/4.3.1/conformance/#pauta-01)
- [ ] The first release is at Core or Complete · [PAUTA-03](https://pauta-project.dev/4.3.1/conformance/#pauta-03)
- [ ] Every MUST and SHOULD the app does not meet is an exception in `pauta.json`: not applicable, a deviation (SHOULDs only) with a decision record, or pending with an issue in the app's own repository, each with a one-sentence reason · [PAUTA-04](https://pauta-project.dev/4.3.1/conformance/#pauta-04), [PAUTA-05](https://pauta-project.dev/4.3.1/conformance/#pauta-05), [PAUTA-06](https://pauta-project.dev/4.3.1/conformance/#pauta-06), [PAUTA-07](https://pauta-project.dev/4.3.1/conformance/#pauta-07), [PAUTA-08](https://pauta-project.dev/4.3.1/conformance/#pauta-08), [PAUTA-09](https://pauta-project.dev/4.3.1/conformance/#pauta-09)
- [ ] A template repository says so in its `pauta.json` and records the rules only an app made from it can meet as `app-only` · [PAUTA-16](https://pauta-project.dev/4.3.1/conformance/#pauta-16)
- [ ] The conformance is computed from the exceptions by one tested helper, never stored · [PAUTA-02](https://pauta-project.dev/4.3.1/conformance/#pauta-02)
- [ ] `PautaConformanceTest` checks `pauta.json` and the README against the edition's `rules.json` · [PAUTA-10](https://pauta-project.dev/4.3.1/conformance/#pauta-10), [PAUTA-15](https://pauta-project.dev/4.3.1/conformance/#pauta-15)
- [ ] About links the edition, *Built to Pauta 4.3.0*, read from `pauta.version`, and shows the conformance · [ABOUT-05](https://pauta-project.dev/4.3.1/templates/about/#about-05), [ABOUT-06](https://pauta-project.dev/4.3.1/templates/about/#about-06), [ABOUT-07](https://pauta-project.dev/4.3.1/templates/about/#about-07), [ABOUT-08](https://pauta-project.dev/4.3.1/templates/about/#about-08), [ABOUT-09](https://pauta-project.dev/4.3.1/templates/about/#about-09)
- [ ] A Pauta window, `help.pauta`, in the palette, the Help menu and About's link, listing every exception with fixed links · [PAUTA-12](https://pauta-project.dev/4.3.1/conformance/#pauta-12), [PWIN-01](https://pauta-project.dev/4.3.1/templates/pauta-window/#pwin-01), [PWIN-02](https://pauta-project.dev/4.3.1/templates/pauta-window/#pwin-02), [PWIN-03](https://pauta-project.dev/4.3.1/templates/pauta-window/#pwin-03), [PWIN-04](https://pauta-project.dev/4.3.1/templates/pauta-window/#pwin-04)
- [ ] A *Pauta conformance* page in the user docs with the same list · [PAUTA-13](https://pauta-project.dev/4.3.1/conformance/#pauta-13)
- [ ] That page generated from `pauta.json` (SHOULD) · [PAUTA-14](https://pauta-project.dev/4.3.1/conformance/#pauta-14)

## Platform

[Platform baseline](https://pauta-project.dev/4.3.1/platform/)

- [ ] JDK 25 or newer (`release` 25 is the floor) and JavaFX 27 or newer, with a jlinked runtime in every installer · [PLAT-01](https://pauta-project.dev/4.3.1/platform/#plat-01), [PLAT-02](https://pauta-project.dev/4.3.1/platform/#plat-02), [PLAT-03](https://pauta-project.dev/4.3.1/platform/#plat-03)
- [ ] One JPMS module, `com.<app>` · [PLAT-04](https://pauta-project.dev/4.3.1/platform/#plat-04)
- [ ] Maven Wrapper committed (`mvnw`, `mvnw.cmd`, `.mvn/wrapper/`) · [PLAT-08](https://pauta-project.dev/4.3.1/platform/#plat-08)
- [ ] AtlantaFX 3 controls, and app stylesheets that take their colors from its `-color-*` tokens · [PLAT-05](https://pauta-project.dev/4.3.1/platform/#plat-05), [PLAT-06](https://pauta-project.dev/4.3.1/platform/#plat-06)

## Code quality

[Code quality gates](https://pauta-project.dev/4.3.1/quality/)

- [ ] Every package `@NullMarked`; NullAway on Error Prone fails the build · [PLAT-09](https://pauta-project.dev/4.3.1/platform/#plat-09)
- [ ] Spotless with Palantir Java Format, checked in CI · [PLAT-10](https://pauta-project.dev/4.3.1/platform/#plat-10)
- [ ] JUnit 5 and headless FX tests (`-Dglass.platform=Headless`), FX tests tagged `fx` · [PLAT-11](https://pauta-project.dev/4.3.1/platform/#plat-11), [QUAL-06](https://pauta-project.dev/4.3.1/quality/#qual-06)
- [ ] JaCoCo check at 0.90 lines and 0.90 methods · [PLAT-12](https://pauta-project.dev/4.3.1/platform/#plat-12)
- [ ] Rules live in pure, unit-tested helpers; UI classes stay thin · [QUAL-05](https://pauta-project.dev/4.3.1/quality/#qual-05)
- [ ] A capture hook or headless screenshot drives the real window for UI checks · [QUAL-09](https://pauta-project.dev/4.3.1/quality/#qual-09)

## Performance

[Performance](https://pauta-project.dev/4.3.1/performance/)

- [ ] No I/O, process, parsing or waiting on the JavaFX application thread; results return through `Platform.runLater` · [PERF-01](https://pauta-project.dev/4.3.1/performance/#perf-01), [PERF-02](https://pauta-project.dev/4.3.1/performance/#perf-02)
- [ ] Background results applied under a generation guard; blocking work kept off the common pool · [PERF-03](https://pauta-project.dev/4.3.1/performance/#perf-03), [PERF-05](https://pauta-project.dev/4.3.1/performance/#perf-05)
- [ ] Redraws coalesced to one per pulse; streams delivered in batches; work only on what is visible and changed · [PERF-06](https://pauta-project.dev/4.3.1/performance/#perf-06), [PERF-07](https://pauta-project.dev/4.3.1/performance/#perf-07), [PERF-08](https://pauta-project.dev/4.3.1/performance/#perf-08)
- [ ] Logs, histories and caches bounded; large inputs guarded; a closed window releases what it held · [PERF-11](https://pauta-project.dev/4.3.1/performance/#perf-11), [PERF-12](https://pauta-project.dev/4.3.1/performance/#perf-12), [PERF-13](https://pauta-project.dev/4.3.1/performance/#perf-13)
- [ ] Only the first frame built before it paints; update check and extras deferred · [PERF-14](https://pauta-project.dev/4.3.1/performance/#perf-14), [PERF-15](https://pauta-project.dev/4.3.1/performance/#perf-15)
- [ ] Every thread named and a daemon (SHOULD) · [PERF-04](https://pauta-project.dev/4.3.1/performance/#perf-04)

## Keyboard and commands

[Keyboard first](https://pauta-project.dev/4.3.1/keyboard/) · [Command Palette](https://pauta-project.dev/4.3.1/templates/command-palette/) · [Find bar](https://pauta-project.dev/4.3.1/templates/find-bar/)

- [ ] One `CommandRegistry`: every action is a command with an id, its title and description from the message catalogs · [KBD-01](https://pauta-project.dev/4.3.1/keyboard/#kbd-01), [KBD-03](https://pauta-project.dev/4.3.1/keyboard/#kbd-03)
- [ ] One Command Palette per window, `M-x` or `Ctrl+Shift+P`, an in-scene overlay (not a `Popup`) that lists every command · [KBD-05](https://pauta-project.dev/4.3.1/keyboard/#kbd-05), [KBD-07](https://pauta-project.dev/4.3.1/keyboard/#kbd-07), [PAL-01](https://pauta-project.dev/4.3.1/templates/command-palette/#pal-01), [PAL-02](https://pauta-project.dev/4.3.1/templates/command-palette/#pal-02)
- [ ] Emacs and CUA keymaps at least, with user overrides on top · [KBD-09](https://pauta-project.dev/4.3.1/keyboard/#kbd-09), [KBD-11](https://pauta-project.dev/4.3.1/keyboard/#kbd-11)
- [ ] A find bar in the scene wherever there is text to search: searches as you type with a count, Enter and Shift+Enter step, Escape closes it; a list app filters instead · [FIND-01](https://pauta-project.dev/4.3.1/templates/find-bar/#find-01), [FIND-02](https://pauta-project.dev/4.3.1/templates/find-bar/#find-02), [FIND-03](https://pauta-project.dev/4.3.1/templates/find-bar/#find-03), [FIND-06](https://pauta-project.dev/4.3.1/templates/find-bar/#find-06), [FIND-07](https://pauta-project.dev/4.3.1/templates/find-bar/#find-07)
- [ ] One QuickOpen-style picker for every list choice (themes, keymaps, recent items, a setting's values), in the overlay host (SHOULD) · [QOPEN-01](https://pauta-project.dev/4.3.1/templates/quick-open/#qopen-01), [QOPEN-02](https://pauta-project.dev/4.3.1/templates/quick-open/#qopen-02)

## Window shell

[Window shell](https://pauta-project.dev/4.3.1/window-shell/) · [Welcome page](https://pauta-project.dev/4.3.1/templates/welcome/) · [Confirm dialog](https://pauta-project.dev/4.3.1/templates/confirm-dialog/) · [About window](https://pauta-project.dev/4.3.1/templates/about/)

- [ ] A status bar whose echo area shows the last action's feedback, errors in red and warnings in amber, and opens the Message Log on a click · [WIN-01](https://pauta-project.dev/4.3.1/window-shell/#win-01)
- [ ] Every destructive action asks first: the question names the thing, the button names the action in the `danger` style, Escape cancels; or the action can be taken back instead · [CONF-01](https://pauta-project.dev/4.3.1/templates/confirm-dialog/#conf-01), [CONF-02](https://pauta-project.dev/4.3.1/templates/confirm-dialog/#conf-02), [CONF-03](https://pauta-project.dev/4.3.1/templates/confirm-dialog/#conf-03), [CONF-04](https://pauta-project.dev/4.3.1/templates/confirm-dialog/#conf-04)
- [ ] About from Help, `help.about` and the macOS application menu: version and build, runtime, license, links and the last update check · [ABOUT-01](https://pauta-project.dev/4.3.1/templates/about/#about-01), [ABOUT-02](https://pauta-project.dev/4.3.1/templates/about/#about-02)
- [ ] A Welcome page when there is nothing to restore, or an empty state that names the ways in with their chords (SHOULD) · [WELC-01](https://pauta-project.dev/4.3.1/templates/welcome/#welc-01), [WELC-02](https://pauta-project.dev/4.3.1/templates/welcome/#welc-02)

## Icons and color

[Icons and color](https://pauta-project.dev/4.3.1/icons-and-color/)

- [ ] Inter's four faces bundled, registered before any CSS, and attached by a scene stylesheet to every scene, dialogs and popups included · [ICON-01](https://pauta-project.dev/4.3.1/icons-and-color/#icon-01), [ICON-02](https://pauta-project.dev/4.3.1/icons-and-color/#icon-02)
- [ ] Light and dark themes switched at run time, a "follow the system" choice, and an unknown theme falling back to the default · [ICON-15](https://pauta-project.dev/4.3.1/icons-and-color/#icon-15), [ICON-16](https://pauta-project.dev/4.3.1/icons-and-color/#icon-16), [ICON-17](https://pauta-project.dev/4.3.1/icons-and-color/#icon-17)
- [ ] State colors named once on `.root` from the theme's roles, no fixed hex in a component rule · [ICON-07](https://pauta-project.dev/4.3.1/icons-and-color/#icon-07), [ICON-08](https://pauta-project.dev/4.3.1/icons-and-color/#icon-08)
- [ ] Tinted text at 4.5:1 on its fill and on both grounds; `-color-fg-emphasis` on an emphasis fill; one focus ring · [ICON-10](https://pauta-project.dev/4.3.1/icons-and-color/#icon-10), [ICON-11](https://pauta-project.dev/4.3.1/icons-and-color/#icon-11), [ICON-12](https://pauta-project.dev/4.3.1/icons-and-color/#icon-12)
- [ ] Icons in one family's style class each, the same glyph for an action everywhere it is reached, every glyph set credited in `NOTICE` · [ICON-19](https://pauta-project.dev/4.3.1/icons-and-color/#icon-19), [ICON-20](https://pauta-project.dev/4.3.1/icons-and-color/#icon-20), [ICON-24](https://pauta-project.dev/4.3.1/icons-and-color/#icon-24)
- [ ] Readable text in `-color-fg-muted` or stronger, held by a pure contrast test over the stylesheets (SHOULD) · [ICON-09](https://pauta-project.dev/4.3.1/icons-and-color/#icon-09), [ICON-14](https://pauta-project.dev/4.3.1/icons-and-color/#icon-14)

## Toolbars and tooltips

[Toolbars and tooltips](https://pauta-project.dev/4.3.1/toolbars-and-tooltips/)

- [ ] Icon-only buttons built by one helper that sets the tooltip and the accessible name (`Icons.button`, `Icons.name`) · [TBAR-01](https://pauta-project.dev/4.3.1/toolbars-and-tooltips/#tbar-01)
- [ ] Toolbar buttons out of the Tab order; every tooltip names the command and its chord from the active keymap · [TBAR-02](https://pauta-project.dev/4.3.1/toolbars-and-tooltips/#tbar-02), [TBAR-03](https://pauta-project.dev/4.3.1/toolbars-and-tooltips/#tbar-03)
- [ ] The toolbar never holds the only way to an action, and its right-click menu is one reused menu · [TBAR-08](https://pauta-project.dev/4.3.1/toolbars-and-tooltips/#tbar-08), [TBAR-10](https://pauta-project.dev/4.3.1/toolbars-and-tooltips/#tbar-10)
- [ ] Groups separated by spacing on one chrome band, no hairlines; a toggle wears `:open` while it is on (SHOULD) · [TBAR-04](https://pauta-project.dev/4.3.1/toolbars-and-tooltips/#tbar-04), [TBAR-06](https://pauta-project.dev/4.3.1/toolbars-and-tooltips/#tbar-06), [TBAR-07](https://pauta-project.dev/4.3.1/toolbars-and-tooltips/#tbar-07)

## Tabs and panels

[Tabs and tool panels](https://pauta-project.dev/4.3.1/tabs-and-panels/)

- [ ] Every tab operation is a command · [TABS-01](https://pauta-project.dev/4.3.1/tabs-and-panels/#tabs-01)
- [ ] One tab header carries the title and the states: `•` and amber italic for unsaved, a pin and bold for pinned, muted italic for read-only (`TabHeaders`) · [TABS-02](https://pauta-project.dev/4.3.1/tabs-and-panels/#tabs-02), [TABS-03](https://pauta-project.dev/4.3.1/tabs-and-panels/#tabs-03)
- [ ] Bulk close skips pinned tabs, pinning moves a tab to the end of the pinned group, and Reopen Closed Tab brings the last one back (`ClosedTabs`) · [TABS-04](https://pauta-project.dev/4.3.1/tabs-and-panels/#tabs-04), [TABS-05](https://pauta-project.dev/4.3.1/tabs-and-panels/#tabs-05), [TABS-06](https://pauta-project.dev/4.3.1/tabs-and-panels/#tabs-06)
- [ ] A command toggles each panel, and a panel's content is built on first use (`ToolWindowManager`) · [TABS-13](https://pauta-project.dev/4.3.1/tabs-and-panels/#tabs-13), [TABS-14](https://pauta-project.dev/4.3.1/tabs-and-panels/#tabs-14)
- [ ] Panel side, order and divider positions restored on the next launch (SHOULD) · [TABS-15](https://pauta-project.dev/4.3.1/tabs-and-panels/#tabs-15)

## Menus

[Menus](https://pauta-project.dev/4.3.1/menus/)

- [ ] Menu rows are commands: icon, title and chord from the registry and the active keymap, no `KeyCombination` accelerators · [MENU-01](https://pauta-project.dev/4.3.1/menus/#menu-01), [MENU-02](https://pauta-project.dev/4.3.1/menus/#menu-02)
- [ ] Every row of every menu, right-click menus and drop-downs included, has an icon that depicts it and its chord when bound · [MENU-14](https://pauta-project.dev/4.3.1/menus/#menu-14), [MENU-15](https://pauta-project.dev/4.3.1/menus/#menu-15)
- [ ] Menus draw in Inter 14 px whatever they were opened from (`.context-menu` pins the font in pixels) · [MENU-16](https://pauta-project.dev/4.3.1/menus/#menu-16)
- [ ] Every row, tab and editor has a right-click menu with its own actions · [MENU-05](https://pauta-project.dev/4.3.1/menus/#menu-05)
- [ ] One right-click menu at a time; a press anywhere outside closes it, and so does Escape, returning focus (`ContextMenuDismissal`) · [MENU-06](https://pauta-project.dev/4.3.1/menus/#menu-06), [MENU-07](https://pauta-project.dev/4.3.1/menus/#menu-07), [MENU-08](https://pauta-project.dev/4.3.1/menus/#menu-08)
- [ ] Right-click menus open from the Menu key and Shift+F10 at the selected row (`RowContextMenu`) · [MENU-09](https://pauta-project.dev/4.3.1/menus/#menu-09)

## Tray and background

[Tray and background](https://pauta-project.dev/4.3.1/tray-and-background/) (for an app that keeps working without its window)

- [ ] The shared `tray/` package: StatusNotifierItem on Linux, AWT elsewhere, and the app fully usable without an icon · [TRAY-01](https://pauta-project.dev/4.3.1/tray-and-background/#tray-01), [TRAY-02](https://pauta-project.dev/4.3.1/tray-and-background/#tray-02)
- [ ] Closing the window hides it only while an icon is up and the setting says so; Quit is explicit and one path · [TRAY-03](https://pauta-project.dev/4.3.1/tray-and-background/#tray-03), [TRAY-04](https://pauta-project.dev/4.3.1/tray-and-background/#tray-04)
- [ ] Desktop notifications through one `Notifier`, for what happened while the window was away, one switch per event · [TRAY-09](https://pauta-project.dev/4.3.1/tray-and-background/#tray-09), [TRAY-10](https://pauta-project.dev/4.3.1/tray-and-background/#tray-10)
- [ ] Start at login writes the OS's own entry (XDG autostart, LaunchAgent, `HKCU` Run), and `--minimized` comes up behind the icon (SHOULD) · [TRAY-05](https://pauta-project.dev/4.3.1/tray-and-background/#tray-05), [TRAY-06](https://pauta-project.dev/4.3.1/tray-and-background/#tray-06)

## Settings

[Settings](https://pauta-project.dev/4.3.1/settings/) · [Settings Sync](https://pauta-project.dev/4.3.1/templates/settings-sync/)

- [ ] Settings window from a palette command (`Ctrl+,`), with a page sidebar and search · [SET-01](https://pauta-project.dev/4.3.1/settings/#set-01), [SET-02](https://pauta-project.dev/4.3.1/settings/#set-02), [SET-03](https://pauta-project.dev/4.3.1/settings/#set-03)
- [ ] Live apply with no Save button, and a palette command for every setting · [SET-04](https://pauta-project.dev/4.3.1/settings/#set-04), [SET-06](https://pauta-project.dev/4.3.1/settings/#set-06)
- [ ] Config in `~/.<app>`, versioned with migrations, a file newer than the build backed up and defaults loaded · [SET-07](https://pauta-project.dev/4.3.1/settings/#set-07), [SET-09](https://pauta-project.dev/4.3.1/settings/#set-09), [SET-10](https://pauta-project.dev/4.3.1/settings/#set-10)
- [ ] Config read with suspicion: values clamped on load, an unreadable file kept as a backup and defaults loaded · [SET-11](https://pauta-project.dev/4.3.1/settings/#set-11)
- [ ] Export and import of the config folder · [SET-12](https://pauta-project.dev/4.3.1/settings/#set-12)
- [ ] No secret in a config file: keys and tokens in the OS keychain, a credential the app can ask for again in memory only · [SET-13](https://pauta-project.dev/4.3.1/settings/#set-13), [SET-14](https://pauta-project.dev/4.3.1/settings/#set-14)
- [ ] A secret in the wrong place refused (a sync URL with a password, an unredacted problem report), and an option that weakens security only a config key · [SET-15](https://pauta-project.dev/4.3.1/settings/#set-15), [SET-16](https://pauta-project.dev/4.3.1/settings/#set-16)
- [ ] Settings sync through a Git repository the user owns (SHOULD) · [SYNC-01](https://pauta-project.dev/4.3.1/templates/settings-sync/#sync-01), [SYNC-02](https://pauta-project.dev/4.3.1/templates/settings-sync/#sync-02)

## Diagnostics

[Diagnostics and support](https://pauta-project.dev/4.3.1/diagnostics/) · [Message Log](https://pauta-project.dev/4.3.1/templates/message-log/)

- [ ] Message Log of the session's echo-area messages · [DIAG-01](https://pauta-project.dev/4.3.1/diagnostics/#diag-01)
- [ ] Debug Log with a session file in its own window, and an uncaught exception handler installed at the start of `main` · [DIAG-02](https://pauta-project.dev/4.3.1/diagnostics/#diag-02), [DIAG-03](https://pauta-project.dev/4.3.1/diagnostics/#diag-03), [DIAG-04](https://pauta-project.dev/4.3.1/diagnostics/#diag-04)
- [ ] Daily update check with an off switch · [DIAG-05](https://pauta-project.dev/4.3.1/diagnostics/#diag-05)
- [ ] Report a Problem: a redacted, prefilled GitHub issue · [DIAG-06](https://pauta-project.dev/4.3.1/diagnostics/#diag-06)

## Command line and languages

[Command line](https://pauta-project.dev/4.3.1/command-line/) · [Internationalization](https://pauta-project.dev/4.3.1/i18n/)

- [ ] `--help`, `--version`, `--config-dir`, `--dev` and `--report` · [CLI-01](https://pauta-project.dev/4.3.1/command-line/#cli-01), [CLI-02](https://pauta-project.dev/4.3.1/command-line/#cli-02), [CLI-05](https://pauta-project.dev/4.3.1/command-line/#cli-05)
- [ ] Single instance per config folder · [CLI-07](https://pauta-project.dev/4.3.1/command-line/#cli-07)
- [ ] Six message catalogs, each with every key, held by a parity test · [INTL-01](https://pauta-project.dev/4.3.1/i18n/#intl-01), [INTL-08](https://pauta-project.dev/4.3.1/i18n/#intl-08)

## Repository

[Repository documents](https://pauta-project.dev/4.3.1/repository/)

- [ ] `README.md` as a landing page of about 200 lines, with the badge row and the hero screenshot · [REPO-01](https://pauta-project.dev/4.3.1/repository/#repo-01)
- [ ] `CHANGELOG.md` in Keep a Changelog format · [REPO-02](https://pauta-project.dev/4.3.1/repository/#repo-02)
- [ ] MIT `LICENSE`, and `NOTICE` with every third-party license · [REPO-03](https://pauta-project.dev/4.3.1/repository/#repo-03), [REPO-04](https://pauta-project.dev/4.3.1/repository/#repo-04)
- [ ] `AGENTS.md`, with a one-line `CLAUDE.md` pointing to it · [REPO-05](https://pauta-project.dev/4.3.1/repository/#repo-05), [DOCS-14](https://pauta-project.dev/4.3.1/documentation/#docs-14)
- [ ] `CONTRIBUTING.md`, `docs/` and `branding/` · [REPO-06](https://pauta-project.dev/4.3.1/repository/#repo-06), [REPO-07](https://pauta-project.dev/4.3.1/repository/#repo-07), [REPO-10](https://pauta-project.dev/4.3.1/repository/#repo-10)
- [ ] `.github/ISSUE_TEMPLATE/bug_report.yml` · [REPO-09](https://pauta-project.dev/4.3.1/repository/#repo-09)

## Documentation

[Documentation](https://pauta-project.dev/4.3.1/documentation/)

- [ ] User docs on the app's website under `/docs/`: Getting started, a page per feature area, the keyboard reference, Settings and an FAQ · [DOCS-01](https://pauta-project.dev/4.3.1/documentation/#docs-01), [DOCS-02](https://pauta-project.dev/4.3.1/documentation/#docs-02)
- [ ] Help → Documentation as a command (`help.documentation`) · [DOCS-06](https://pauta-project.dev/4.3.1/documentation/#docs-06)
- [ ] A one-line `command.<id>.desc` for every command, held by the parity test · [DOCS-09](https://pauta-project.dev/4.3.1/documentation/#docs-09)
- [ ] Release notes written for users, and the Welcome page's *What's New* opens this build's release · [DOCS-05](https://pauta-project.dev/4.3.1/documentation/#docs-05)
- [ ] `docs/README.md` indexes the contributor guides · [DOCS-12](https://pauta-project.dev/4.3.1/documentation/#docs-12)
- [ ] Docs change in the same PR as the code; when they disagree with the code, the code wins and the docs are fixed · [DOCS-16](https://pauta-project.dev/4.3.1/documentation/#docs-16), [DOCS-17](https://pauta-project.dev/4.3.1/documentation/#docs-17)
- [ ] The Help menu in the family's order, Documentation first after the Command Palette (SHOULD) · [DOCS-07](https://pauta-project.dev/4.3.1/documentation/#docs-07)
- [ ] Deep links from the app open the running version's docs, `/docs/v-<version>/` (SHOULD) · [DOCS-03](https://pauta-project.dev/4.3.1/documentation/#docs-03)
- [ ] Command and keybinding references generated from the source, with a check that quoted ids and chords exist (SHOULD) · [DOCS-04](https://pauta-project.dev/4.3.1/documentation/#docs-04)

## Packaging and signing

[Packaging, signing and release](https://pauta-project.dev/4.3.1/release/)

- [ ] jpackage installers for Linux x64 and arm64, macOS arm64 and x64 and Windows x64; JReleaser creates the GitHub release with every download · [REL-01](https://pauta-project.dev/4.3.1/release/#rel-01), [REL-03](https://pauta-project.dev/4.3.1/release/#rel-03), [REL-11](https://pauta-project.dev/4.3.1/release/#rel-11)
- [ ] The version in `pom.xml` is the one source: a `vX.Y.Z` tag releases it · [REL-05](https://pauta-project.dev/4.3.1/release/#rel-05)
- [ ] macOS `.dmg` signed with Developer ID, notarized and stapled · [REL-15](https://pauta-project.dev/4.3.1/release/#rel-15)
- [ ] Linux downloads with `.asc` signatures from the shared release key · [REL-16](https://pauta-project.dev/4.3.1/release/#rel-16)
- [ ] Build provenance attestations for every download · [REL-18](https://pauta-project.dev/4.3.1/release/#rel-18)
- [ ] Windows `.msi` Authenticode, once the certificate is chosen (SHOULD) · [REL-17](https://pauta-project.dev/4.3.1/release/#rel-17)
- [ ] Homebrew cask in `adriandeleon/homebrew-tap` and a winget package `AdrianDeLeon.<App>` (SHOULD) · [REL-12](https://pauta-project.dev/4.3.1/release/#rel-12), [REL-13](https://pauta-project.dev/4.3.1/release/#rel-13)

## CI/CD (GitHub Actions)

[CI/CD](https://pauta-project.dev/4.3.1/release/#cicd-github-actions)

- [ ] `ci.yml` on every push and pull request: Format and Build & Test, both required checks for `master` · [REL-19](https://pauta-project.dev/4.3.1/release/#rel-19)
- [ ] `release.yml` on a version tag that matches the pom, with a `workflow_dispatch` dry run · [REL-21](https://pauta-project.dev/4.3.1/release/#rel-21)
- [ ] Every third-party action pinned to a commit SHA · [REL-22](https://pauta-project.dev/4.3.1/release/#rel-22)
- [ ] Dependabot for `github-actions` and `maven` · [REL-23](https://pauta-project.dev/4.3.1/release/#rel-23)
- [ ] `permissions: contents: read` by default; write only in publishing jobs · [REL-24](https://pauta-project.dev/4.3.1/release/#rel-24)
- [ ] `timeout-minutes` on every job; superseded pull-request runs canceled · [REL-26](https://pauta-project.dev/4.3.1/release/#rel-26)
- [ ] Test and coverage reports uploaded; coverage totals in the job summary · [REL-27](https://pauta-project.dev/4.3.1/release/#rel-27)
- [ ] Signing skipped without secrets, but a tag without them fails · [REL-28](https://pauta-project.dev/4.3.1/release/#rel-28)
- [ ] A smoke launch of the packaged app on each OS before release · [REL-29](https://pauta-project.dev/4.3.1/release/#rel-29)
- [ ] `full-tests.yml` daily, on a `full-ci` label and before every release (SHOULD) · [REL-20](https://pauta-project.dev/4.3.1/release/#rel-20)
