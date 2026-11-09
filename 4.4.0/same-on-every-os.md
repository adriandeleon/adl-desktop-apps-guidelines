# Same on every OS

> The one list of places where Windows, macOS and Linux may differ, and the rules that keep everything else the same.

Pauta 4.4.0 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.4.0/same-on-every-os/.
Every rule of the edition: https://pauta-project.dev/4.4.0/llms-full.txt.

The family exists so that one app can be used the same way on Windows, macOS and Linux ([principle
1](https://pauta-project.dev/4.4.0/principles/)). This page says where an app may follow the OS's own way and where it may not, and its rules
keep other differences out. Each difference is easy to add on its own: an `if (isMac)` that hides a menu row, a
JavaFX default that orders buttons one way on Windows and another on macOS.

## Where the OS's way wins

Inside the window, Pauta's design wins: the same commands, keymaps, look, dialogs and files on every OS. The OS's
own way wins only where the app hands work to the OS or sits in the OS's own interface, because there the user would
be fighting the OS rather than learning the app. The table is the whole list. Any other difference between OSes is a
bug, or a deviation recorded in `pauta.json` ([Conformance](https://pauta-project.dev/4.4.0/conformance/)).

| What | Windows | macOS | Linux | Rules |
|------|---------|-------|-------|-------|
| Primary modifier | `Ctrl` | `Cmd`, from each keymap's `.mac.json` variant | `Ctrl` | [KBD-09](https://pauta-project.dev/4.4.0/keyboard/#kbd-09), [KBD-10](https://pauta-project.dev/4.4.0/keyboard/#kbd-10), [KBD-21](https://pauta-project.dev/4.4.0/keyboard/#kbd-21) |
| Menu bar | In the title bar | The system menu bar, in a decorated window | In the title bar | [WIN-03](https://pauta-project.dev/4.4.0/window-shell/#win-03) |
| Open and save dialogs | The OS's own (`FileChooser`) | The OS's own | The OS's own | |
| Opening a file or link, showing it in the file manager | Explorer | Finder (`open`) | `xdg-open` | |
| Tray icon | AWT `SystemTray` | AWT `SystemTray` | StatusNotifierItem | [TRAY-01](https://pauta-project.dev/4.4.0/tray-and-background/#tray-01) |
| Notifications | A PowerShell toast | `osascript` | `notify-send` | [TRAY-09](https://pauta-project.dev/4.4.0/tray-and-background/#tray-09) |
| Start at login | The `HKCU` `Run` value | A LaunchAgent | An XDG autostart entry | [TRAY-06](https://pauta-project.dev/4.4.0/tray-and-background/#tray-06) |
| Saved secrets | Credential Manager | Keychain | The Secret Service | [SET-13](https://pauta-project.dev/4.4.0/settings/#set-13) |
| Installers | `.msi`, winget | `.dmg`, Homebrew | `.deb`, `.rpm`, `.AppImage`, `.tar.gz` | [REL-11](https://pauta-project.dev/4.4.0/release/#rel-11), [REL-12](https://pauta-project.dev/4.4.0/release/#rel-12), [REL-13](https://pauta-project.dev/4.4.0/release/#rel-13) |

## The same everywhere

Everything else, and in particular:

- **Commands, settings and windows**, with the same defaults: [OS-01](https://pauta-project.dev/4.4.0/same-on-every-os/#os-01). A keymap's macOS variant binds the
  same commands: [KBD-21](https://pauta-project.dev/4.4.0/keyboard/#kbd-21).
- **The look.** Inter on every window ([ICON-01](https://pauta-project.dev/4.4.0/icons-and-color/#icon-01)), not the OS's UI font; the same
  AtlantaFX themes ([PLAT-05](https://pauta-project.dev/4.4.0/platform/#plat-05)); the same icons on every menu row the app draws
  ([MENU-14](https://pauta-project.dev/4.4.0/menus/#menu-14)).
- **Dialogs.** The same buttons in the same order: [WIN-11](https://pauta-project.dev/4.4.0/window-shell/#win-11).
- **Files.** The config folder is `~/.<app>` on every OS ([SET-07](https://pauta-project.dev/4.4.0/settings/#set-07)), not `%APPDATA%` or
  `~/Library/Application Support`, so the folder a user backs up, syncs or reads about in the docs is the same one.
- **The command line** ([Command line](https://pauta-project.dev/4.4.0/command-line/)) and the user docs: one set for all three, which names a
  difference only where this page lists it.

## Rules

- **OS-01 · MUST.** Every command, setting and window exists on Windows, macOS and Linux, with the same default. Where
  the OS can't do what one asks, it stays where it is, disabled, and says why; it is never hidden. The table above is
  the only exception.
  - *Why:* a user who moves to another OS looks for a feature where they left it. A missing row looks like a
    different app; a disabled one with a reason explains itself.
  - *Check (code):* no command, menu row or settings row is registered or added inside an OS check, and no default
    in the settings model depends on the OS. A row the OS can't serve calls `setDisable` and carries its reason
    ([KBD-04](https://pauta-project.dev/4.4.0/keyboard/#kbd-04) for a command).
  - *Reference:* Editora [`ui/SettingsWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java) (the extended-window row, disabled on macOS
    "rather than hidden, so its note still explains why").
- **OS-02 · MUST.** One class answers which OS the app runs on (`Os`, with `isWindows()`, `isMac()` and
  `isLinux()`), and no other class reads the `os.name` property.
  - *Why:* checks scattered through the code are how apps drift apart on one OS without anyone choosing it. In one
    class, every difference can be found with one search, and a test can run the app as any OS
    ([OS-03](https://pauta-project.dev/4.4.0/same-on-every-os/#os-03)).
  - *Check (code):* `grep -rln '"os.name"' src/main/java` lists one file.
  - *Reference:* no app yet. Every app reads `os.name` in several classes, Editora in about fifty; Editora's
    [`process/DesktopActions.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/process/DesktopActions.java) has the `Os` enum to start from.
- **OS-03 · SHOULD.** Tests can run as any OS: the `Os` class takes an override, and one test asserts that the
  command ids, the menu bar's rows and the settings pages are the same for Windows, macOS and Linux.
  - *Why:* CI runs the FX tests on one or two OSes ([REL-20](https://pauta-project.dev/4.4.0/release/#rel-20)); with the override, the
    comparison runs on every pull request on Linux alone.
  - *Check (test):* a test sets each OS in turn through the override and compares the three lists.
  - *Reference:* no app yet. Editora's [`KeymapsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/command/KeymapsTest.java)
    (`guiKeymapsBindSameCommandSetOnBothPlatforms`) does it for the keymaps.
