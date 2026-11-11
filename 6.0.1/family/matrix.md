# Feature matrix

> Which of the six apps has which platform piece, release step and feature.

Pauta 6.0.1 (2026-11-11). The page with its screenshots and mockups: https://pauta-project.dev/6.0.1/family/matrix/.
Every rule of the edition: https://pauta-project.dev/6.0.1/llms-full.txt.

Surveyed on 2026-11-05 from each repository's default branch (the rows added in editions 1.2.0, 1.3.0, 1.4.0 and 2.0.0 on
2026-11-06; Termina's and Mirada's columns read again on 2026-11-09, at `6de43a1` and `a3a84ec`, and the cells a review of
edition 5.0.0 found wrong in any column corrected that day, from the commits that edition pins). ● has it, ◐ partly or
differently, — not found.

**What the apps are.**

| App | What it is | Homepage | Source |
|---|---|---|---|
| Editora | Programmer's text editor (the reference) | [editora-project.dev](https://editora-project.dev/) | [adriandeleon/Editora](https://github.com/adriandeleon/Editora) |
| Torrenta | BitTorrent client | [torrenta-project.dev](https://torrenta-project.dev/) | [adriandeleon/torrenta](https://github.com/adriandeleon/torrenta) |
| Termina | Terminal emulator | [termina-project.dev](https://termina-project.dev/) | [adriandeleon/Termina](https://github.com/adriandeleon/Termina) |
| Modula | Software-defined-radio receiver | — | [adriandeleon/Modula](https://github.com/adriandeleon/Modula) |
| Mirada | Fast image viewer (GraalVM native image) | [mirada-project.dev](https://mirada-project.dev/) | [adriandeleon/Mirada](https://github.com/adriandeleon/Mirada) |
| nux | UPS monitor for Network UPS Tools, in the tray | — | [adriandeleon/nux](https://github.com/adriandeleon/nux) |

## Platform and repository

| | Editora | Torrenta | Termina | Modula | Mirada | nux |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| JDK 25+ and JavaFX 27+, JPMS module, `mvnw` | ● | ● | ● | ● | ● | ● |
| AtlantaFX 3 | ● | ● | ● | ● Primer | ● Cupertino | ● Primer |
| Inter UI font | ● | ● | ◐ not on three dialogs | — Plex Mono | ● | — |
| NullAway + every package `@NullMarked` | ● | ● | ● | ● | ● | — |
| Spotless (Palantir) | ● | ● | ● | ● | ● | — |
| JaCoCo gate | ● 0.90 L/M | ◐ 0.90 L only | ◐ 0.90 L/M, 0.73 B | — | ● 0.90 L/M, 0.79 B | — |
| Headless FX tests | ● | ● | ● | — | ● | ● |
| Six or more message catalogs | ● | ● | ● | — | ● | ● |
| README badges + screenshot | ● | ● | ● | ● | ● | ● |
| Keep a Changelog format | ◐ older entries not in bold | ◐ | ● | ◐ some entries not in bold | ● | ◐ few entries in bold |
| MIT `LICENSE` + `NOTICE` | ● | ● | ● | ● | ● | ● |
| `AGENTS.md` canonical, `CLAUDE.md` a pointer | ● | ◐ `CLAUDE.md` only | ● | ◐ `CLAUDE.md` only | ● | ◐ copy |
| `CONTRIBUTING.md` | ● | — | ● | — | ● | — |
| `docs/` and `branding/` | ● | ● | ● | ● | ● | ● |
| `docs/README.md` indexing the guides | ● | — | ● | — | ● | — |
| User docs on the website (`/docs/`) | ● 43 pages, versioned | ● 19 pages | ● 16 pages | — README only | ● 11 pages | — README only |
| Help → Documentation command | ● | — | ● | — | ● | — |
| `bug_report.yml` issue form | ● | ● | ● | — | ● | — |
| Dependabot | ● | ◐ actions only | ● | ◐ actions monthly | ● | ● |

## Release and signing

| | Editora | Torrenta | Termina | Modula | Mirada | nux |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| JReleaser | ● | ● | ● | — | ● | — |
| Five-target matrix (Linux x64/arm64, macOS arm64/x64, Windows x64) | ● | ◐ | ● | ◐ no Linux arm64 | ● | ● |
| macOS signed + notarized `.dmg` | ● | ● | ● | ● | ● | ● |
| Linux OpenPGP `.asc` signatures | ● | ● | ● | ● | ● | — |
| Windows `.msi` Authenticode | — | — | — | — | — | — |
| Build provenance attestations | ● | — | ● | — | ● | — |
| Homebrew cask / winget manifests | — | ● | ● | — | ◐ winget | — |
| `.desktop` file + AppStream metainfo | ● | ● | ● | ● | ◐ no metainfo | ◐ no metainfo |
| AOT start-up training | ● | — | ● | — | ● | — |

## User-facing features

| | Editora | Torrenta | Termina | Modula | Mirada | nux |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Command registry + Command Palette (in-scene overlay) | ● | ● | ● | ● | ● | ● |
| QuickOpen-style pickers for lists | ● | — palette only | — palette only | — palette only | ● `Choices` | — palette only |
| Find bar: in-scene, incremental, count, Esc returns focus | ● find and replace | ◐ filter box | ● floating card | — | — picker | — |
| Keymap presets | ● 5 | — | — | — | ● 2 | — |
| Keybinding editor / shortcuts reference | ● | ● | ● | — | ◐ | — |
| An icon on every menu row | ◐ about half the menu bar | ◐ not the RSS menus | ◐ about half the menu bar | — | ● | — |
| Chord beside each menu row, right-click menus included | ◐ menu bar only | ◐ menu bar and torrent menu | ◐ menu bar only | ● right-click menu | ● every menu | — |
| Menu font set on `.context-menu` (Inter 14 px at the default zoom) | ● | — | ◐ root font only | ◐ size only | ● | — |
| Right-click menu: one at a time, any outside press closes it | ● every window | ◐ stock auto-hide | ◐ terminal view, not the tab menus | ◐ radio pane, not the preset chips | ● viewer and bookmarks windows | — no right-click menu |
| Icon-only buttons carry an accessible name | ◐ not the main toolbar | ● | ● `IconNames.name` | — tooltip only | ● `Icons.name` | ● by hand |
| Toolbar tooltips show the command's chord | ● | ● | — no toolbar | — | ● | — |
| Tab strip: unsaved and pinned states, drag to reorder, reopen closed | ● | — | ● pin, reorder, reopen | — | — | — |
| Panels toggled by commands, placement remembered | ● stripes, dock, float | ● sidebar and detail pane | ◐ panes in a tab | — | ◐ info panel and strip | — |
| Settings window | ● | ● | ● | ● | ● | ● |
| Settings search | ● | ● | ● | — | ● | — |
| Settings sync (Git / GitHub via `gh`) | ● | ● | ● | — | — | — |
| Message Log (status-bar history) | ● | ● | ◐ separate window, 500 entries | — | ● | — |
| Debug Log + uncaught exception handler | ● | ● | ● | — | ● | — |
| Update notification (GitHub releases) | ● | ● | ● | ● | ● | ● |
| Report a Problem → GitHub issue (+ `--report`) | ● | ● | ● | — | ● | — |
| About window with runtime versions | ● | ● | ● | ● | ● | ● |
| About names the Pauta edition it implements | — | — | ● link and environment line | — | ● link and environment line | — |
| Pauta window and `pauta.json` exceptions | — | — | — | — | — | — |
| Welcome page, or an empty state that names the ways in | ● page | ● empty state | — | — | ● empty state | — |
| Confirm dialog: named red action button, Escape cancels, or undo instead | ◐ the Project panel's delete asks with a stock OK | ◐ `RemoveConfirm` + undo; the reset questions in Settings answer with a stock OK | ● `Confirm`: named red button; Cancel is the default when closing a running program only | — a preset is removed from its right-click menu without asking | ● `Confirm`: named red button, Escape cancels; trash undoable | ◐ risky commands: named Run, Cancel default, not red |
| Doctor / diagnosis | ● | ◐ per torrent | — | ◐ native libs | — | — |
| Single instance (hand off to running app) | ● | ● | ● | — | ● | ● |
| `--config-dir` and other CLI flags | ● | ◐ no `--dev`, `--new-instance`, `--no-session` | ● | — | ● | ◐ |
| Light / dark / follow system, live switch | ◐ live, no system choice | ◐ live, no system choice | ● | ◐ live day/night, no system choice | ● | ● |
| Caret & Ink theme pair (Editora Light / Dark) | ● authored | ● vendored | ● vendored | — | — Cupertino | — Primer |
| Icons as themed SVG paths, one style class per family | ● two families | ● two families | ● filled, menus | ◐ transport glyphs | ● hand-drawn stroked | — tray bitmap |
| State colors from theme roles, contrast-tested | ● `StyleContrastTest` | ◐ roles, no test | ◐ roles; terminal schemes tested | — fixed hexes | ● `StyleContrastTest` | ◐ roles, no test |
| Extended title bar (`HeaderBar`, `StageStyle.EXTENDED`) | ◐ opt-in | ◐ opt-in | ◐ opt-in | — | ● | — |
| Desktop notifications | ● | ● | ● | — | — | ● |
| Tray icon (SNI over D-Bus on Linux, AWT on Windows and macOS) | — | ● | — | ◐ AWT fallback on Linux | — | ◐ AWT fallback on Linux |
| Close to tray, only while an icon is up | — | ● | — | ● | — | ● |
| Start at login (XDG, LaunchAgent, `HKCU` Run) and `--minimized` | — | ● | — | — | — | ● |
| Window geometry restore | ● | ● | ● | — | ● | — |
| Config export / import | ● | — | ● | — | ● | — |
| Plugins | ● | — | — | — | — | — |
