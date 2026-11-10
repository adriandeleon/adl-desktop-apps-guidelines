---
title: "Window shell"
description: "Status bar, themes, title bar, dialogs, Welcome, About, window state, zoom and quit."
---

![Editora's Welcome tab](../../assets/shots/editora-welcome.png "Editora's Welcome page: Start actions with their chords, Recent Projects, Recent Files and Customize.")

- **WIN-01 · MUST.** A status bar is always present (it can be toggled). Its left side is the *echo area*: one line
  of feedback for the last action, errors in red and warnings in amber. Clicking it opens the Message Log.
  - *Check (code):* the echo label switches between an error and a warning style class, and its click handler runs
    the Message Log command.
  - *Reference:* Editora [`ui/StatusBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusBar.java) (`status-echo-error`, `status-echo-warn`; a click runs
    `view.messageLog`) and the [Message Log template](../templates/message-log/).
- **WIN-03 · MUST.** In an app with a menu bar, the menu bar sits in the title bar by default on Windows and Linux:
  JavaFX 27's `HeaderBar` with `StageStyle.EXTENDED` carries the menu, and a setting that starts on lets the user
  fall back to a decorated window. On macOS the menus are in the system menu bar (`useSystemMenuBar`), and the window
  is decorated, or extended with a header that holds no menus.
  - *Why:* the family looks the same on every OS only if every app starts with the same title bar; an app that
    ships it off looks like another family.
  - *Check (code):* on Windows and Linux the main stage is created `StageStyle.EXTENDED` with a `HeaderBar` that
    holds the menu bar, and the setting that falls back to a decorated window defaults to on (in the title bar); on
    macOS the menu bar sets `useSystemMenuBar`, and a header, where the window has one, holds no menus.
  - *Reference:* the app template ([`config/Settings.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/Settings.java), `titleBarMenus = true`, read by
    [`Chrome.usesHeaderBar`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Chrome.java)). Editora ([`ui/ExtendedWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ExtendedWindow.java), [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java)), Torrenta
    and Termina have the setting but start it off. Mirada has no setting: its [`ui/TitleBar.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/TitleBar.java) is a `HeaderBar` on a
    `StageStyle.EXTENDED` stage wherever JavaFX supports one, on macOS too. Its header holds the file name and
    buttons, the main menu's among them, and no menu bar; on macOS [`ui/MacMenus.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/MacMenus.java) puts the menus in the system
    menu bar. Modula and nux have no menu bar.
- **WIN-04 · SHOULD.** Native dialogs go through one helper that attaches the app stylesheet and the UI font.
  - *Why:* a dialog is its own scene and inherits neither.
  - *Check (code):* every `Alert` and `Dialog` the app builds passes through the helper.
  - *Reference:* Editora [`ui/Dialogs.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Dialogs.java) ([`Dialogs.styled`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Dialogs.java)).
- **WIN-11 · MUST.** A dialog's buttons are in the same order on every OS, with Cancel to the left of every action, as
  the [Confirm dialog](../templates/confirm-dialog/) draws them (Cancel, Save and Discard where there are three:
  [CONF-05](../templates/confirm-dialog/#conf-05)): the dialog's `ButtonBar` gets one fixed order, never JavaFX's
  default for the OS. See [Same on every OS](../same-on-every-os/).
  - *Why:* JavaFX orders a `ButtonBar` by the OS it runs on (`BUTTON_ORDER_WINDOWS`, `_MAC_OS`, `_LINUX`), so the
    same confirmation puts its action on the left on Windows and on the right on macOS and Linux.
  - *Check (code):* the dialog helper ([WIN-04](#win-04)), or each dialog, calls `setButtonOrder` on the dialog
    pane's `ButtonBar` with one order string, the same on every OS, in which `C` (`CANCEL_CLOSE`) comes before the
    letter of every action button the dialogs use (`O` for `OK_DONE`, `Y`, `N`, `A`, `U` for `OTHER`).
    `BUTTON_ORDER_WINDOWS` on every OS fails: it puts `Y`, `N` and `O` before `C`.
  - *Reference:* no app yet. Editora's Git confirmations give their buttons the `OK_DONE` and `CANCEL_CLOSE` roles
    and leave the order to JavaFX.
- **WIN-08 · SHOULD.** Window size, position, maximized state and open items are restored on the next launch.
  `--no-session` skipping the restore is [CLI-04](../command-line/#cli-04).
  - *Check (test):* a round-trip test of the saved workspace state.
  - *Reference:* Editora [`config/WorkspaceState.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/WorkspaceState.java) (`windowX` … `windowMaximized`),
    [`ui/WindowSessionCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowSessionCoordinator.java), [`App.noSessionFlag`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java); tests [`AppArgsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/AppArgsTest.java),
    [`NoSessionStartupFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/NoSessionStartupFxTest.java) and, for the window's geometry, [`WindowManagerLaunchFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/WindowManagerLaunchFxTest.java)
    (`aWindowComesBackAtTheSizeAndPlaceItsSessionRecorded`, `aWindowThatWasMaximizedComesBackMaximized`), which
    restore a window from a saved `workspace-state.json`. No Editora test saves the geometry and reads it back.
- **WIN-09 · SHOULD.** Content zooms from the keyboard (`Ctrl/Cmd +`, `-`, `0`), kept across launches. The UI zoom
  is [WIN-12](#win-12).
  - *Check (code):* the content's zoom in, out and reset are commands bound in every keymap, and the zoom level is a
    saved setting.
  - *Reference:* Editora `view.textZoomIn`, `view.textZoomOut` and `view.textZoomReset`, kept in
    [`Settings.fontZoom`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/Settings.java); Termina's `font.zoom`
    ([`config/Settings.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/Settings.java)).
- **WIN-12 · MUST.** The app has a UI zoom: one setting scales the whole chrome, the menus
  ([MENU-16](../menus/#menu-16)), toolbar, tabs and status bar included. It applies at once, is kept across
  launches, and commands zoom it in, out and back to the default. In an app with content of its own to zoom (an
  editor's text, a terminal's grid, an image) `Ctrl/Cmd +`, `-` and `0` stay with the content zoom
  ([WIN-09](#win-09)) and the UI zoom's commands carry no fixed chord; in an app without, those chords are the UI
  zoom.
  - *Why:* a person who needs larger text gets it everywhere, and the menus can only follow a zoom that exists.
  - *Check (code):* the chrome's font sizes come from one root size the setting changes, and its fixed sizes are
    multiplied by the zoom, not written as absolute pixels; three commands zoom it in, out and back to the default.
  - *Reference:* no app yet. Editora, Termina and Mirada zoom their content only (`view.textZoomIn`, `font.zoom`,
    `view.zoomIn`), and Editora writes its menu font as absolute pixels ([`MainMenuBar.UI_FONT_SIZE`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java), `.context-menu`
    in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css)). Torrenta, Modula, nux and the app template have no zoom command.
- **WIN-13 · MUST.** Every quit entry point runs one quit method: File → Quit, the quit command, and the system's own
  Quit, which on macOS is the application menu's and the Dock's. That method asks what the
  [Confirm dialog](../templates/confirm-dialog/) rules require ([CONF-01](../templates/confirm-dialog/#conf-01)),
  closes open dialogs and saves the window state ([WIN-08](#win-08)). A tray's Quit runs it too
  ([TRAY-04](../tray-and-background/#tray-04)).
  - *Why:* a second way out skips what the first one does: the question about unsaved work, the saved window, or,
    in a tray app, the quit itself. Quitting from inside a dialog's nested event loop has aborted the JVM.
  - *Check (code):* one quit method; the File → Quit row and the quit command run it, and on macOS the system's Quit
    reaches it. JavaFX turns the application menu's and the Dock's Quit into a close request on every window
    (`GlassStage.requestClosingAllWindows`) unless the app catches Glass's quit action (`handleQuitAction`), so the
    quit handler calls the quit method, or, in an app with one window, that window's close request does.
  - *Reference:* the app template's [`MainWindow.quit`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/MainWindow.java): the `app.quit` command, which File → Quit runs, and the
    window's close request both call it, so macOS's Quit reaches it as a close request; it hides the other windows
    and dialogs, saves the window state and waits for the last settings write. Editora's File → Quit and `app.quit`
    run [`MainController.onQuit`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java), which asks about the quit once and then about each window's unsaved files; macOS's Quit doesn't reach it yet:
    [`MacOpenFiles`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/MacOpenFiles.java) wraps Glass's handler and passes `handleQuitAction` on to JavaFX's own, so each window gets a close
    request and asks for itself. Torrenta ([`MainWindow.quit`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java)), Modula ([`ModulaApp.quit`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ModulaApp.java)) and nux (`Platform.exit`, from
    `app.quit` and from the tray, in [`App`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java)) don't catch macOS's Quit either. Termina and Mirada have no quit command:
    the last window to close ends the app, and macOS's Quit arrives at each window as a close request, which asks
    ([`TerminalWindow.close`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java), [`ViewerWindow.mayClose`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/ViewerWindow.java)).
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
![Termina window with a menu bar, a tab strip under it and a tab context menu](../../assets/shots/termina-tabs.png "Termina's tab strip is the row under the menu bar; its HeaderBar holds the menu bar and the window title, not the tabs.")
![Editora's View menu open with toggle commands and their chords](../../assets/shots/editora-menu-bar.png "Every menu item is a command and shows its chord.")
