---
title: "Same on every OS"
description: "The one list of places where Windows, macOS and Linux may differ, and the rules that keep everything else the same."
---

The family exists so that one app can be used the same way on Windows, macOS and Linux ([principle
1](../principles/)). This page says where an app may follow the OS's own way and where it may not, and its rules
keep other differences out. Each difference is easy to add on its own: an `if (isMac)` that hides a menu row, a
JavaFX default that orders buttons one way on Windows and another on macOS.

## Where the OS's way wins

Inside the window, Pauta's design wins: the same commands, keymaps, look, dialogs and files on every OS. The OS's
own way wins only where the app hands work to the OS or sits in the OS's own interface, because there the user would
be fighting the OS rather than learning the app. The table is the whole list. Any other difference between OSes is a
bug: an app records it in `pauta.json` as `pending`, with an issue, until it is fixed ([Conformance](../conformance/)).

| What | Windows | macOS | Linux | Rules |
|------|---------|-------|-------|-------|
| Primary modifier | `Ctrl` | `Cmd`, from each keymap's `.mac.json` variant | `Ctrl` | [KBD-09](../keyboard/#kbd-09), [KBD-10](../keyboard/#kbd-10), [KBD-21](../keyboard/#kbd-21) |
| How a chord is written | `Ctrl+Shift+P` | `⇧⌘P`, in Apple's modifier order | `Ctrl+Shift+P` | |
| Quit | File → Quit, the tray's Quit | The same, plus the app menu's and the Dock's Quit, caught as the app's own | File → Quit, the tray's Quit | [TRAY-04](../tray-and-background/#tray-04) |
| Menu bar | In the title bar | The system menu bar, in a decorated window | In the title bar | [WIN-03](../window-shell/#win-03) |
| Open and save dialogs | The OS's own (`FileChooser`) | The OS's own | The OS's own | |
| Opening a file or link, showing it in the file manager | Explorer | Finder (`open`) | `xdg-open` | |
| Tray icon | AWT `SystemTray` | AWT `SystemTray` | StatusNotifierItem | [TRAY-01](../tray-and-background/#tray-01) |
| Notifications | A PowerShell toast, shown as Windows PowerShell's | `osascript`, shown as Script Editor's | `notify-send`, shown as the app's | [TRAY-09](../tray-and-background/#tray-09) |
| Dock or taskbar badge | None | The dock icon | A launcher that honors `LauncherEntry` | [TRAY-12](../tray-and-background/#tray-12) |
| Command line | A console launcher, beside the GUI one | The app's own launcher | The app's own launcher | [CLI-11](../command-line/#cli-11) |
| Middle-click paste | None | None | The X11 primary selection, in a terminal | |
| Start at login | The `HKCU` `Run` value | A LaunchAgent | An XDG autostart entry | [TRAY-06](../tray-and-background/#tray-06) |
| Saved secrets | Credential Manager | Keychain | The Secret Service | [SET-13](../settings/#set-13) |
| Screen reader | Narrator (UI Automation) | VoiceOver | None: JavaFX has no bridge to the Linux accessibility bus | [Accessibility](../accessibility/) |
| Installers | `.msi` (unsigned until [REL-17](../release/#rel-17) is met), winget on x64 | `.dmg`, Homebrew on Apple Silicon | `.deb`, `.rpm`, `.AppImage`, `.tar.gz`; on arm64, `.tar.gz` (and `.deb` where the tooling allows) | [REL-11](../release/#rel-11), [REL-12](../release/#rel-12), [REL-13](../release/#rel-13) |

Some differences in the apps today are on no row, so each breaks a rule until it is fixed:

- Mirada keeps its settings in `~/Library/Application Support` and `%APPDATA%`, not `~/.mirada`
  ([SET-07](../settings/#set-07)).
- Torrenta hides its "on metered connections" row on macOS instead of disabling it ([OS-01](#os-01)).
- Editora's move to the Trash does nothing on Windows, where Mirada and Torrenta use the Recycle Bin ([OS-01](#os-01)).
- No app's macOS Quit reaches a tray app's quit yet ([TRAY-04](../tray-and-background/#tray-04)), and no app's
  flags print on Windows ([CLI-11](../command-line/#cli-11)).

## The same everywhere

Everything else, and in particular:

- **Commands, settings and windows**, with the same defaults: [OS-01](#os-01). A keymap's macOS variant binds the
  same commands: [KBD-21](../keyboard/#kbd-21).
- **The look.** Inter on every window ([ICON-01](../icons-and-color/#icon-01)), not the OS's UI font; the same
  AtlantaFX themes ([PLAT-05](../platform/#plat-05)); the same icons on every menu row the app draws
  ([MENU-14](../menus/#menu-14)).
- **Dialogs.** The same buttons in the same order: [WIN-11](../window-shell/#win-11).
- **Files.** The config folder is `~/.<app>` on every OS ([SET-07](../settings/#set-07)), not `%APPDATA%` or
  `~/Library/Application Support`, so the folder a user backs up, syncs or reads about in the docs is the same one.
- **The command line** ([Command line](../command-line/)) and the user docs: one set for all three, which names a
  difference only where this page lists it.

## Rules

- **OS-01 · MUST.** Every command, setting and window exists on Windows, macOS and Linux, with the same default. Where
  the OS can't do what one asks, it stays where it is, disabled, and says why; it is never hidden. The table above is
  the only exception.
  - *Why:* a user who moves to another OS looks for a feature where they left it. A missing row looks like a
    different app; a disabled one with a reason explains itself.
  - *Check (code):* no command, menu row or settings row is registered or added inside an OS check, and no default
    in the settings model depends on the OS. A row the OS can't serve calls `setDisable` and carries its reason
    ([KBD-04](../keyboard/#kbd-04) for a command).
  - *Reference:* Editora [`ui/SettingsWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java) (the extended-window row, disabled on macOS
    "rather than hidden, so its note still explains why").
- **OS-02 · MUST.** One class answers which OS the app runs on (`Os`, with `isWindows()`, `isMac()` and
  `isLinux()`), and no other class reads the `os.name` property.
  - *Why:* checks scattered through the code are how apps drift apart on one OS without anyone choosing it. In one
    class, every difference can be found with one search, and a test can run the app as any OS
    ([OS-03](#os-03)).
  - *Check (code):* `grep -rln '"os.name"' src/main/java` lists one file.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; n=$(grep -rl '"os.name"' src/main/java | wc -l); [ "$n" -eq 1 ] || { echo "$n files read os.name (one Os class should):"; grep -rl '"os.name"' src/main/java; false; }`
  - *Reference:* no app yet. Every app reads `os.name` in several classes, Editora in about fifty; Editora's
    [`process/DesktopActions.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/process/DesktopActions.java) has the `Os` enum to start from.
- **OS-03 · SHOULD.** Tests can run as any OS: the `Os` class takes an override, and one test asserts that the
  command ids, the menu bar's rows and the settings pages are the same for Windows, macOS and Linux.
  - *Why:* CI runs the FX tests on one or two OSes ([REL-20](../release/#rel-20)); with the override, the
    comparison runs on every pull request on Linux alone.
  - *Check (test):* a test sets each OS in turn through the override and compares the three lists.
  - *Reference:* no app yet. Editora's [`KeymapsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/command/KeymapsTest.java)
    (`guiKeymapsBindSameCommandSetOnBothPlatforms`) does it for the keymaps.
