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
- **WIN-02 · MUST.** Light and dark AtlantaFX themes and a "follow the system" choice, switchable at run time
  without a restart. Semantic colors: amber is not durable yet (unsaved, read-only), red is broken, green is verified
  or added. See [Icons and color](../icons-and-color/).
  - *Check (code):* one place applies the app theme to every open window, and the theme list has a system choice
    that follows the OS color scheme as it changes.
  - *Reference:* Editora [`ui/Themes.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Themes.java) (`applyAppTheme`) switches at run time and [`ui/WindowColorScheme.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowColorScheme.java) tells
    every window's frame which scheme it is in; Mirada [`ui/Theme.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Theme.java) (`ThemeChoice.SYSTEM`) and nux
    [`ui/Theme.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/Theme.java) (`THEME_SYSTEM`, the default) follow the system. Editora, Torrenta, Termina and Modula switch
    live but have no system choice yet.
- **WIN-03 · SHOULD.** The title bar uses JavaFX 27's `HeaderBar` with `StageStyle.EXTENDED` to carry the menu or
  tabs, with a decorated-window fallback, and `useSystemMenuBar` on macOS.
  - *Check (code):* the main stage is created `StageStyle.EXTENDED` with a `HeaderBar`, a setting falls back to a
    decorated window, and the menu bar sets `useSystemMenuBar` on macOS.
  - *Reference:* Editora [`ui/ExtendedWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ExtendedWindow.java), [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java).
- **WIN-04 · SHOULD.** Native dialogs go through one helper that attaches the app stylesheet and the UI font.
  - *Why:* a dialog is its own scene and inherits neither.
  - *Check (code):* every `Alert` and `Dialog` the app builds passes through the helper.
  - *Reference:* Editora [`ui/Dialogs.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Dialogs.java) ([`Dialogs.styled`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Dialogs.java)).
- **WIN-05 · MUST.** A destructive action asks first, and says what it does. Removing, deleting, discarding or
  overwriting something the user made goes through one confirm helper: the question names the thing ("Remove 3
  torrents?"), the confirm button names the action (Remove, Discard, Overwrite), never OK or Yes, and Escape cancels.
  Where the action can be undone instead, the undo is better than the question. See the
  [Confirm dialog template](../templates/confirm-dialog/).
  - *Check (code):* each destructive action calls the one confirm helper before it changes anything, or records an
    undo.
  - *Reference:* Torrenta [`RemoveConfirm`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java) and [`UndoStack`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/UndoStack.java); Editora's save decisions ([`ui/CloseCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CloseCoordinator.java));
    Termina's and Editora's reopen-closed-tab.
- **WIN-06 · SHOULD.** A Welcome page when there is nothing to restore: Start actions (which run commands), Recent
  items, a Customize block (keymap and theme) and Help links. See the [Welcome template](../templates/welcome/).
  - *Check (by hand):* start the app with no session to restore.
  - *Reference:* Editora [`ui/WelcomePane.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WelcomePane.java).
- **WIN-07 · MUST.** About shows the version, the build, the Pauta edition the app implements and its
  conformance, the runtime (Java and JavaFX versions), the license, links, and the result of the last update check. See the
  [About template](../templates/about/).
  - *Check (code):* the About window reads the version, build and edition from `AppInfo`, the conformance from
    the conformance helper ([Conformance](../conformance/)), and shows the update checker's last answer.
  - *Reference:* Editora [`ui/AboutDialog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/AboutDialog.java). No app names its Pauta edition yet.
- **WIN-08 · SHOULD.** Window size, position, maximized state and open items are restored on the next launch;
  `--no-session` skips the restore.
  - *Check (test):* a round-trip test of the saved workspace state, and a test that `--no-session` is honored.
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

![Mirada with its file name and folder in a HeaderBar title bar, an info panel and a thumbnail strip](../../assets/shots/mirada-main.png "Mirada's HeaderBar title bar carries the file name and folder; the info panel and thumbnails are commands too.")
![Termina window with tabs in the title bar and a tab context menu](../../assets/shots/termina-tabs.png "Termina puts its tabs in the title bar with JavaFX 27's HeaderBar.")
![Editora's View menu open with toggle commands and their chords](../../assets/shots/editora-menu-bar.png "Every menu item is a command and shows its chord.")
