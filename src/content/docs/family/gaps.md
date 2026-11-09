---
title: "Gaps per app"
description: "What each app still misses against this guide."
---

The MUSTs each app still misses, then the SHOULDs open in several apps. Termina's and Mirada's rows were read again
on 2026-11-09, and every app's command ids then too; the rest is from the [feature matrix](../matrix/)'s survey. A
command id a rule's statement names is required as written ([Coding agents](../../coding-agents/#what-a-rule-looks-like)).

## Missing MUSTs

| App | Missing MUSTs |
|---|---|
| **Editora** | The Pauta edition and conformance in About, `pauta.json` and the Pauta window; a follow-the-system theme; AI keys only in the keychain, written off the FX thread; plugin signature checking off the Settings UI; no fixed hexes in component rules; `@Tag("fx")` on every FX test; no waiting on the common pool (`DapManager`); accessible names on the main toolbar's buttons, and those buttons out of the Tab order; Shift+Enter in the editor's find bar; a previous-tab command; a palette command for every setting; an echo message for an uncaught error; an icon on every menu row, and chords in right-click menus and drop-downs. |
| **Torrenta** | the command ids the rules name, `help.about` and `palette.show` (it registers `about` and `palette`), and a `command.<id>.desc` description for each command; Help → Documentation; `docs/README.md`; Keep-a-Changelog format; `AGENTS.md` (only `CLAUDE.md` is committed); `CONTRIBUTING.md`; attestations; a methods floor in the coverage gate (it checks lines only); the Pauta edition and conformance in About, `pauta.json` and the Pauta window; a follow-the-system theme; a config file that can't be read kept as a backup, never stopping startup; proxy, Torznab and remote-profile secrets in the keychain; an echo message for an uncaught error; an icon on every menu row (the RSS, priority and Set Category menus), chords in right-click menus, and the menu font pinned. |
| **Termina** | the command ids the rules name, `help.about`, `palette.show` and `help.documentation` (it registers `about`, `commandPalette` and `documentation`), with titles and descriptions under `command.<id>` and `command.<id>.desc` (it uses `menu.<id>`); The coverage floors on Windows too (its `os-windows` profile lowers them to 0.45); the conformance in About, `pauta.json` and the Pauta window; an echo message for an uncaught error; icons on the menu bar's rows, chords in right-click menus, and the menu font pinned. |
| **Modula** | the command ids the rules name, `help.about` (it registers `about`) and a `palette.show` command (a key filter opens the palette); User docs on a website; Help → Documentation; `docs/README.md`; JaCoCo; headless FX tests; i18n; Inter, bundled and on every scene; a status bar; Settings search; Message/Debug Log; Report a Problem; `AGENTS.md`; `CONTRIBUTING.md`; `bug_report.yml`; JReleaser; attestations; Linux arm64; the Pauta edition and conformance in About, `pauta.json` and the Pauta window; a follow-the-system theme; a config file that can't be read kept as a backup, with a test; icons on its menu rows, and the menu font pinned. |
| **Mirada** | Its settings in `~/.mirada` on every OS: on macOS and Windows it uses the OS's own folder ([SET-07](../../settings/#set-07)); the conformance in About, `pauta.json` and the Pauta window; a config file that can't be read kept as a backup, with a test. |
| **nux** | the command ids the rules name, `help.about` (it registers `app.about`) and a `palette.show` command (a shortcut opens the palette), and a `command.<id>.desc` description for each command; User docs on a website; Help → Documentation; `docs/README.md`; NullAway; Spotless; JaCoCo; Inter, bundled and on every scene; a status bar; Settings search; Message/Debug Log; Report a Problem; `CONTRIBUTING.md`; `bug_report.yml`; Linux signatures; JReleaser; attestations; the Pauta edition and conformance in About, `pauta.json` and the Pauta window; a config file that can't be read kept as a backup, never stopping startup, and every value clamped on load; icons on its menu buttons' rows, and the menu font pinned. |

## SHOULDs open in several apps

- **Windows `.msi` signing** ([REL-17](../../release/#rel-17)): no app signs its MSI yet; the certificate isn't
  chosen.
- **Settings Sync** ([SYNC-01](../../templates/settings-sync/#sync-01)): Modula, Mirada and nux don't have it.
- **The Message Log as an in-scene card** ([MLOG-08](../../templates/message-log/#mlog-08)): Termina's is a separate
  window keeping 500 entries.
