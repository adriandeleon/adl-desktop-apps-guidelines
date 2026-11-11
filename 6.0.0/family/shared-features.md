# Shared features

> Features two or more apps share: the rules that now hold them, and the few that aren't rules yet.

Pauta 6.0.0 (2026-11-10). The page with its screenshots and mockups: https://pauta-project.dev/6.0.0/family/shared-features/.
Every rule of the edition: https://pauta-project.dev/6.0.0/llms-full.txt.

This page began as the list of features two or more apps already shared, beyond the list this guide started from.
Most of them are rules now; the table says which. The apps named are those that had each feature when the list was
made, on 2026-11-05, corrected on 2026-11-09 where the apps' code said otherwise; [Gaps per app](https://pauta-project.dev/6.0.0/family/gaps/) says who
misses a rule today.

## Now rules

| Feature | Apps that had it | Rules |
|---|---|---|
| Version and build time from a Maven-filtered `build-info.properties`, read through `AppInfo` | all six; the commit too in Mirada's file | [ABOUT-02](https://pauta-project.dev/6.0.0/templates/about/#about-02) (that About shows them from `AppInfo`; the file is [principle 11](https://pauta-project.dev/6.0.0/principles/#for-the-people-building-them), not a rule) |
| The update check (`UpdateCheck`, `UpdateService`, `ReleaseInfo`) | all six | [DIAG-05](https://pauta-project.dev/6.0.0/diagnostics/#diag-05), [DIAG-09](https://pauta-project.dev/6.0.0/diagnostics/#diag-09), [DIAG-10](https://pauta-project.dev/6.0.0/diagnostics/#diag-10) |
| Fuzzy matching in the palette (`FuzzyMatch`, `MatchText`) | Editora, Termina, Mirada; Torrenta's `MatchText` | [KBD-06](https://pauta-project.dev/6.0.0/keyboard/#kbd-06) |
| A keyboard reference window, opened from Help | Termina, with a search; Mirada, without one | [DOCS-08](https://pauta-project.dev/6.0.0/documentation/#docs-08) |
| The title-bar menu (`HeaderBar`, `StageStyle.EXTENDED`) | opt-in in Editora, Torrenta and Termina; Mirada's header bar holds no menus | [WIN-03](https://pauta-project.dev/6.0.0/window-shell/#win-03) |
| macOS `openFiles` reaching the running app; About in the application menu | Editora, Mirada, Torrenta; Mirada, Termina | [CLI-07](https://pauta-project.dev/6.0.0/command-line/#cli-07), [ABOUT-01](https://pauta-project.dev/6.0.0/templates/about/#about-01) |
| The tray package, start at login and `--minimized` | Torrenta, nux; Modula the tray package only | [TRAY-01](https://pauta-project.dev/6.0.0/tray-and-background/#tray-01), [TRAY-05](https://pauta-project.dev/6.0.0/tray-and-background/#tray-05), [TRAY-06](https://pauta-project.dev/6.0.0/tray-and-background/#tray-06) |
| Desktop notifications through one `Notifier` | Torrenta, Termina, nux, Editora | [TRAY-09](https://pauta-project.dev/6.0.0/tray-and-background/#tray-09) |
| Window size and position restored | Editora, Torrenta, Termina, Mirada | [WIN-08](https://pauta-project.dev/6.0.0/window-shell/#win-08) |
| A `.desktop` file and AppStream metainfo | all six the `.desktop` file; Editora, Torrenta, Termina and Modula the metainfo | [REL-08](https://pauta-project.dev/6.0.0/release/#rel-08), [REL-09](https://pauta-project.dev/6.0.0/release/#rel-09) (what each holds, not whether) |
| Homebrew cask and winget manifests from JReleaser | Torrenta, Termina; Mirada writes winget manifests with a script of its own | [REL-12](https://pauta-project.dev/6.0.0/release/#rel-12), [REL-13](https://pauta-project.dev/6.0.0/release/#rel-13) |
| Config values clamped when read | Termina, Mirada; nux some of them | [SET-11](https://pauta-project.dev/6.0.0/settings/#set-11) |
| A config file written to a temporary file, then moved into place | all six; Termina under a file lock too | [SET-22](https://pauta-project.dev/6.0.0/settings/#set-22) |
| A capture mode that renders the real UI for screenshots | Torrenta, Termina, nux | [QUAL-09](https://pauta-project.dev/6.0.0/quality/#qual-09), [DOCS-18](https://pauta-project.dev/6.0.0/documentation/#docs-18) |
| The packaged app launched in CI before a release | Torrenta, Termina and Mirada on every target; Editora, Modula and nux the notarized macOS app only | [REL-29](https://pauta-project.dev/6.0.0/release/#rel-29) |
| A release dry run from `workflow_dispatch` | all six | [REL-21](https://pauta-project.dev/6.0.0/release/#rel-21), [REL-28](https://pauta-project.dev/6.0.0/release/#rel-28) |
| Simple mode: a shorter menu and fewer buttons | Editora, Torrenta | [MENU-04](https://pauta-project.dev/6.0.0/menus/#menu-04), [TBAR-05](https://pauta-project.dev/6.0.0/toolbars-and-tooltips/#tbar-05) (how, not whether) |
| Content zoom from the keyboard | Editora, Termina; Mirada its image | [WIN-09](https://pauta-project.dev/6.0.0/window-shell/#win-09) (a UI zoom, which no app has, is [WIN-12](https://pauta-project.dev/6.0.0/window-shell/#win-12)) |
| Undo instead of asking, and Reopen Closed Tab | Torrenta, Termina, Editora; Mirada's Undo Move to Trash | [CONF-07](https://pauta-project.dev/6.0.0/templates/confirm-dialog/#conf-07), [TABS-06](https://pauta-project.dev/6.0.0/tabs-and-panels/#tabs-06) |

## Not rules yet

- **Shared code.** The update package and the palette's matching core are copied between apps; the rules ask for
  what they do, not for the same classes.
- **A window moved back on screen** when the monitor it was on is gone (`WindowGeometry`, `WindowPlacement`), beyond
  restoring its size and position. *(Editora, Torrenta, Termina, Mirada)*
- **`SECURITY.md`**, saying how to report a vulnerability privately. *(Modula)*
- **Simple mode itself**: whether an app has one. The rules above only say how it behaves where it exists.
