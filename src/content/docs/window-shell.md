---
title: "Window shell"
description: "Status bar, themes, title bar, dialogs, Welcome, About, window state and zoom."
---

![Editora's Welcome tab](../../assets/shots/editora-welcome.png "Editora's Welcome page: Start actions with their chords, Recent Projects, Recent Files and Customize.")

- **WIN-01 · MUST.** A status bar is always present (it can be toggled). Its left side is the *echo area*: one line
  of feedback for the last action, errors in red and warnings in amber. Clicking it opens the Message Log.
  - *Check (code):* the echo label switches between an error and a warning style class, and its click handler runs
    the Message Log command.
  - *Reference:* Editora [`ui/StatusBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusBar.java) (`status-echo-error`, `status-echo-warn`; a click runs
    `view.messageLog`) and the [Message Log template](../templates/message-log/).
- **WIN-03 · SHOULD.** The title bar uses JavaFX 27's `HeaderBar` with `StageStyle.EXTENDED` to carry the menu or
  tabs, with a decorated-window fallback, and `useSystemMenuBar` on macOS.
  - *Check (code):* the main stage is created `StageStyle.EXTENDED` with a `HeaderBar`, a setting falls back to a
    decorated window, and the menu bar sets `useSystemMenuBar` on macOS.
  - *Reference:* Editora [`ui/ExtendedWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ExtendedWindow.java), [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java).
- **WIN-04 · SHOULD.** Native dialogs go through one helper that attaches the app stylesheet and the UI font.
  - *Why:* a dialog is its own scene and inherits neither.
  - *Check (code):* every `Alert` and `Dialog` the app builds passes through the helper.
  - *Reference:* Editora [`ui/Dialogs.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Dialogs.java) ([`Dialogs.styled`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Dialogs.java)).
- **WIN-08 · SHOULD.** Window size, position, maximized state and open items are restored on the next launch.
  `--no-session` skipping the restore is [CLI-04](../command-line/#cli-04).
  - *Check (test):* a round-trip test of the saved workspace state.
  - *Reference:* Editora [`config/WorkspaceState.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/WorkspaceState.java) (`windowX` … `windowMaximized`),
    [`ui/WindowSessionCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowSessionCoordinator.java), [`App.noSessionFlag`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java); tests [`WorkspaceStateV29Test`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/WorkspaceStateV29Test.java), [`AppArgsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/AppArgsTest.java),
    [`NoSessionStartupFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/NoSessionStartupFxTest.java).
- **WIN-09 · SHOULD.** UI and content zoom from the keyboard (`Ctrl/Cmd +`, `-`, `0`), kept across launches.
  - *Check (code):* zoom in, out and reset are commands bound in every keymap, and the zoom level is a saved
    setting.
  - *Reference:* Editora zooms content only: `view.textZoomIn`, `view.textZoomOut` and `view.textZoomReset`, kept in
    [`Settings.fontZoom`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/Settings.java).
- **WIN-10 · MAY.** Modes: Zen (no chrome), Simple (fewer menus for new users), Expert.
  - *Check (code):* each mode is a command, and one truth table decides which chrome each mode shows.
  - *Reference:* Editora [`ui/WindowChromeCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowChromeCoordinator.java) (`toggleZen`, `applySimpleMode`) over the truth table in
    [`ui/Chrome.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Chrome.java).

The rest of the window has its own pages. Light and dark themes switched at run time, the "follow the system" choice
and what the state colors mean are [ICON-15](../icons-and-color/#icon-15), [ICON-16](../icons-and-color/#icon-16) and
[ICON-18](../icons-and-color/#icon-18). A destructive action asks first through the
[Confirm dialog](../templates/confirm-dialog/) ([CONF-01](../templates/confirm-dialog/#conf-01) to
[CONF-04](../templates/confirm-dialog/#conf-04)). The [Welcome page](../templates/welcome/) is
[WELC-01](../templates/welcome/#welc-01), and the [About window](../templates/about/) is
[ABOUT-02](../templates/about/#about-02) and [ABOUT-09](../templates/about/#about-09).

![Mirada with its file name and folder in a HeaderBar title bar, an info panel and a thumbnail strip](../../assets/shots/mirada-main.png "Mirada's HeaderBar title bar carries the file name and folder; the info panel and thumbnails are commands too.")
![Termina window with tabs in the title bar and a tab context menu](../../assets/shots/termina-tabs.png "Termina puts its tabs in the title bar with JavaFX 27's HeaderBar.")
![Editora's View menu open with toggle commands and their chords](../../assets/shots/editora-menu-bar.png "Every menu item is a command and shows its chord.")
