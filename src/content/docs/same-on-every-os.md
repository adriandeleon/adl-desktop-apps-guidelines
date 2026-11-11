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
bug ([OS-04](#os-04); [OS-01](#os-01) where a command, setting or window is missing): an app records it in
`pauta.json` as `pending`, with an issue, until it is fixed ([Conformance](../conformance/)).

| What | Windows | macOS | Linux | Rules |
|------|---------|-------|-------|-------|
| Keymap chords | The keymap as written, with `Ctrl` | The `.mac.json` variant of each keymap that has one (Emacs has none and keeps `Ctrl`): `Cmd` where the other has `Ctrl`, the macOS keymap of the editor it copies, and another chord where macOS keeps one for itself | The keymap as written, with `Ctrl` | [KBD-09](../keyboard/#kbd-09), [KBD-10](../keyboard/#kbd-10), [KBD-21](../keyboard/#kbd-21) |
| How a chord is written | `Ctrl+Shift+P` | `⇧⌘P`, in Apple's modifier order | `Ctrl+Shift+P` | |
| A click with the primary modifier (open a link, go to a definition) | `Ctrl`+click | `Cmd`+click, as the keymaps put `Cmd` where the others have `Ctrl` | `Ctrl`+click | |
| Enter on a focused button that is not the default (JavaFX's own behavior on each OS) | Presses the focused button | Presses the default button | Presses the focused button | [CONF-13](../templates/confirm-dialog/#conf-13) |
| Quit | File → Quit, the tray's Quit | The same, plus the app menu's and the Dock's Quit, caught as the app's own | File → Quit, the tray's Quit | [WIN-14](../window-shell/#win-14), [WIN-13](../window-shell/#win-13), [TRAY-04](../tray-and-background/#tray-04) |
| Application menu | None | About, Settings and Quit, in the menu macOS names after the app | None | [ABOUT-01](../templates/about/#about-01), [WIN-15](../window-shell/#win-15), [WIN-13](../window-shell/#win-13) |
| Menu bar | In the title bar, by default | The system menu bar | In the title bar, by default | [WIN-03](../window-shell/#win-03) |
| Open and save dialogs | The OS's own (`FileChooser`) | The OS's own | The OS's own | |
| Opening a file or link, showing it in the file manager | Explorer | Finder (`open`) | `xdg-open` | |
| Files opened from the OS | Arguments, handed to the running instance | `openFiles` Apple Events, sent to the running app | Arguments, handed to the running instance | [CLI-07](../command-line/#cli-07) |
| File associations | The `.msi` registers the app's file types; a URL scheme goes under `HKCU\Software\Classes` | The bundle's `Info.plist` declares its document types and URL schemes; the user picks the default in Finder | The desktop entry's `MimeType`; `xdg-mime` or the package sets the default | No rule yet |
| Trash | The Recycle Bin | The Trash, the one Finder empties | The freedesktop.org trash | No rule yet |
| Tray icon | AWT `SystemTray` | AWT `SystemTray` | StatusNotifierItem | [TRAY-01](../tray-and-background/#tray-01) |
| Notifications | A PowerShell toast, shown as Windows PowerShell's | `osascript`, shown as Script Editor's | `notify-send`, shown as the app's | [TRAY-09](../tray-and-background/#tray-09) |
| Dock or taskbar badge | None | The dock icon | A launcher that honors `LauncherEntry` | [TRAY-12](../tray-and-background/#tray-12) |
| Command line | A console launcher, beside the GUI one | The app's own launcher | The app's own launcher | [CLI-11](../command-line/#cli-11) |
| Middle-click paste | None | None | The X11 primary selection, in a terminal | |
| The shells and profiles a terminal offers | The OS's own: Command Prompt, PowerShell, Git Bash and each WSL distribution | The OS's own: the shells installed, from `/etc/shells` and the `PATH` | The OS's own: the shells installed, from `/etc/shells` and the `PATH` | |
| Start at login | The `HKCU` `Run` value | A LaunchAgent | An XDG autostart entry | [TRAY-06](../tray-and-background/#tray-06) |
| Saved secrets | Credential Manager | Keychain | The Secret Service | [SET-13](../settings/#set-13) |
| Screen reader | Narrator (UI Automation) | VoiceOver | None: JavaFX has no bridge to the Linux accessibility bus | [Accessibility](../accessibility/) |
| High contrast | A high-contrast theme while Windows' high-contrast mode is on | None yet | None yet | [ACC-09](../accessibility/#acc-09) |
| Installers | `.msi` (unsigned until [REL-17](../release/#rel-17) is met), winget on x64 | `.dmg`, Homebrew on Apple Silicon | `.deb`, `.rpm`, `.AppImage`, `.tar.gz`; on arm64, `.tar.gz` (and `.deb` where the tooling allows) | [REL-11](../release/#rel-11), [REL-12](../release/#rel-12), [REL-13](../release/#rel-13) |

Some differences in the apps today are on no row, or miss what a row says, so each breaks a rule until it is
fixed:

- Mirada keeps its settings in `~/Library/Application Support` and `%APPDATA%`, not `~/.mirada`
  ([SET-07](../settings/#set-07)).
- Torrenta hides its "on metered connections" row on macOS instead of disabling it ([OS-01](#os-01)).
- Editora deletes a file for good on Windows, where it reaches no Recycle Bin; Mirada and Torrenta use it
  ([OS-04](#os-04)).
- Editora's "Save as administrator" row is not disabled on Windows, where it does nothing ([OS-01](#os-01)).
- Termina removes its `hideMenuBar` command on macOS instead of disabling it ([OS-01](#os-01)).
- Termina believes the folder a shell reports for itself on Windows only, so a tab's folder and where a new tab
  starts can differ by OS for the same shell ([OS-04](#os-04)).
- Mirada closes the window on Escape on Linux only, follows the OS's accent color on macOS and Windows only, and
  puts the title on the left on Windows only ([OS-04](#os-04)).
- Editora keeps the user's own key bindings apart by OS, `keybindings` for Windows and Linux and `keybindingsMac`
  for macOS, so a chord rebound on one is not rebound on the other ([OS-04](#os-04)).
- Termina's Settings Sync keeps the user's key bindings in one file for macOS and another for Windows and Linux,
  so a chord rebound on a Mac is not rebound on a Linux or Windows computer that syncs with it
  ([OS-04](#os-04)).
- Editora runs a folder's tools inside its WSL distribution on Windows only: it registers the WSL targets inside
  an OS check ([OS-04](#os-04)).
- No app fixes the order of a dialog's buttons, so Editora, Torrenta, Termina, Mirada and nux draw them in JavaFX's
  order for the OS ([WIN-11](../window-shell/#win-11)).
- nux raises its Windows notifications as the tray icon's balloon, not a toast, so none shows without the tray
  ([TRAY-09](../tray-and-background/#tray-09)).
- Editora, Torrenta, Modula and nux don't run their quit method from macOS's own Quit: the application menu's and
  the Dock's Quit ask each window to close, which in Torrenta, Modula and nux, closing to the tray, hides the window
  ([WIN-13](../window-shell/#win-13)).
- Only Mirada puts Settings in the macOS application menu, with a fixed `Cmd+,` where the keymap's chord belongs
  ([WIN-15](../window-shell/#win-15)); only Termina and Mirada add About there
  ([ABOUT-01](../templates/about/#about-01)).
- Mirada has a menu bar on macOS only: on Windows and Linux its menus are one ☰ button ([OS-04](#os-04)).
- Editora, Termina, Modula and nux ship no console launcher on Windows, and none attaches to the parent's console;
  Torrenta's `torrenta-nox` is one ([CLI-11](../command-line/#cli-11)).

## The same everywhere

Everything else, and in particular:

- **Commands, settings and windows**, with the same defaults: [OS-01](#os-01). What they do and where they sit:
  [OS-04](#os-04). A keymap's macOS variant binds the same commands: [KBD-21](../keyboard/#kbd-21).
- **The look.** Inter on every window ([ICON-01](../icons-and-color/#icon-01)), not the OS's UI font; the same
  AtlantaFX themes ([PLAT-05](../platform/#plat-05)); the same icons on every menu row the app draws
  ([MENU-14](../menus/#menu-14)).
- **Dialogs.** The same buttons in the same order ([WIN-11](../window-shell/#win-11)), with the same default
  button ([CONF-13](../templates/confirm-dialog/#conf-13)). Space presses the focused button everywhere. What Enter
  does on a focused button that is not the default follows the OS, a row of
  [Where the OS's way wins](#where-the-oss-way-wins): it presses that button on Windows and Linux and the default
  on macOS, which is JavaFX's own behavior and the reason CONF-13 never leaves the default on a red button.
- **Files.** The config folder is `~/.<app>` on every OS ([SET-07](../settings/#set-07)), not `%APPDATA%` or
  `~/Library/Application Support`, so the folder a user backs up, syncs or reads about in the docs is the same one.
- **The command line** ([Command line](../command-line/)) and the user docs: one set for all three, which names a
  difference only where this page lists it.

## Rules

- **OS-01 · MUST.** Every command, setting and window exists on Windows, macOS and Linux, with the same default. Where
  the OS can't do what one asks, it stays where it is, disabled, and says why; it is never hidden. The only
  exceptions are the rows of the table under [Where the OS's way wins](#where-the-oss-way-wins), on the page Same on
  every OS: the places where the app hands work to the OS or sits in the OS's own interface, such as the macOS
  application menu and the macOS form of a keymap's chords.
  - *Why:* a user who moves to another OS looks for a feature where they left it. A missing row looks like a
    different app; a disabled one with a reason explains itself.
  - *Check (code):* no command, menu row or settings row is registered or added inside an OS check, and no default
    in the settings model depends on the OS, unless a row of the table under
    [Where the OS's way wins](#where-the-oss-way-wins) gives that difference: the rows of the macOS application
    menu, a default chord in its macOS form. An OS check is a test whose answer can differ among Windows, macOS
    and Linux; a gate that holds on all three alike (a command registered only when the app finds its own
    launcher, whatever the OS) is not one. A row the OS can't serve calls `setDisable` and carries its reason
    ([KBD-04](../keyboard/#kbd-04) for a command).
  - *Reference:* Editora [`ui/SettingsWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java) (the extended-window row, disabled on macOS
    "rather than hidden, so its note still explains why"). Editora doesn't hold the rule everywhere yet: its
    `file.saveAsAdmin` command ([`ui/WindowCommandRegistrar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowCommandRegistrar.java)) is registered with nothing that disables it on
    Windows, where it can do nothing. Termina removes its `hideMenuBar` command on macOS ([`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java)).
- **OS-02 · MUST.** In an app's code, one class answers which OS the app runs on (this guide calls it `Os`, with
  `isWindows()`, `isMac()` and `isLinux()`; the names are the app's own), and no other class reads the `os.name`
  property. A class that only shows the OS's name, in About or a problem report, asks that one class for it.
  - *Why:* checks scattered through the code are how apps drift apart on one OS without anyone choosing it. In one
    class, every difference can be found with one search, and a test can run the app as any OS
    ([OS-03](#os-03)).
  - *Check (code):* `grep -rl '"os.name"' src/main/java` lists one file, the `Os` class, and no other file works out
    the OS for itself. The Command also lists the files that compare `File.separatorChar` or `File.pathSeparatorChar`
    with a character (`File.separatorChar == '\\'` for "is this Windows"), the other way Editora does it. A class that
    only prints the name, in About or a problem report, reads the property too, so it is listed. A grep finds only
    the spellings it is given: when the Command passes, still read for a test that stands in for the OS some other
    way, such as a separator compared as a string or an environment variable only one OS sets.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; n=$(grep -rl '"os.name"' src/main/java | wc -l); s=$(grep -rlE "eparatorChar *[!=]= *'" src/main/java | wc -l); u=$(grep -rlE "\"os[.]name\"|eparatorChar *[!=]= *'" src/main/java | wc -l); [ "$n" -eq 1 ] && [ "$u" -eq 1 ] || { echo "$n files read os.name (one Os class should):"; grep -rl '"os.name"' src/main/java; echo "$s files compare a file or path separator with a character (only that class may):"; grep -rlE "eparatorChar *[!=]= *'" src/main/java; false; }`
  - *Reference:* the app template's [`Os.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/Os.java), the one class that reads `os.name` (`current`, `isWindows`, `isMac`,
    `isLinux`, and `description` for About and a problem report); the Command passes on it. Each of the six apps
    reads `os.name` in several classes, Editora in about fifty, and eleven of
    Editora's classes tell Windows apart by a separator, eight of them without reading `os.name`
    ([`lsp/JavaRuntimes.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/lsp/JavaRuntimes.java),
    [`dap/DapManager.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/dap/DapManager.java),
    [`dap/InstalledAdapter.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/dap/InstalledAdapter.java)). Editora's
    [`process/DesktopActions.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/process/DesktopActions.java) has the `Os` enum to start from.
- **OS-03 · SHOULD.** An app's tests can run as any OS: the one class that answers which OS the app runs on
  ([OS-02](#os-02); this guide calls it `Os`) takes an override, and one test asserts that the command ids, the menu
  bar's rows and the settings pages are the same for Windows, macOS and Linux.
  - *Why:* CI runs the FX tests on one or two OSes ([REL-20](../release/#rel-20)); with the override, the
    comparison runs on every pull request on Linux alone.
  - *Check (test):* a test sets each OS in turn through the override and compares the three lists.
  - *Reference:* the app template's [`Os.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/Os.java) (`override`, and the `exampleapp.os` property) and
    [`SameOnEveryOsFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/SameOnEveryOsFxTest.java) (`theCommandsTheMenusAndSettingsAreTheSameOnEveryOs`), which starts the app as each OS and compares
    the command ids, the menu bar's rows and every Settings page's rows. Editora's [`KeymapsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/command/KeymapsTest.java)
    (`guiKeymapsBindSameCommandSetOnBothPlatforms`) does it for the keymaps.
- **OS-04 · MUST.** No behavior or layout of an app differs by OS: what a command, a key or a click does, where a
  control sits and how a window is drawn are the same on Windows, macOS and Linux. The only exceptions are the rows
  of the table under [Where the OS's way wins](#where-the-oss-way-wins), on the page Same on every OS: the places
  where the app hands work to the OS or sits in the OS's own interface, such as the macOS form of a keymap's chords,
  the system menu bar, the OS's file dialogs, trash, tray and notifications, and the shells a terminal offers.
  Whether a command, setting or window exists, and its default, is [OS-01](#os-01).
  - *Why:* a feature can be on every OS and still act or sit differently on one: Escape that closes the window on
    Linux only, a title on the left on Windows only. Each is something to relearn on the next machine, which is
    what the family exists to spare its users.
  - *Check (code):* list every place the code tests the OS. They are the callers of the methods of the class
    [OS-02](#os-02) asks for and, in an app that has no such class yet, every file OS-02's Command prints (the files
    that read `os.name`, and the files that compare `File.separatorChar` or `File.pathSeparatorChar` with a
    character), together with the callers of whatever those files offer other classes to ask the OS by: a method
    (Editora's `KeymapManager.isMac()`, which ten files call and eight of them read no `os.name` themselves) or a
    constant. `grep -rnE 'isMac|isWindows|isLinux' src/main/java` lists the usual names; read the printed files for
    the app's own. Read each place. It passes when what it changes is what a row of the table under
    [Where the OS's way wins](#where-the-oss-way-wins) gives that OS, or is nothing a user can see or do (the path
    of a binary, a process's arguments, a line ending). It fails when it changes anything else a user can see or
    do: what a command, a key or a click does, where something sits, how it is drawn or what it says. A place
    that gives an OS something other than what its row gives is judged by the rule that row links, where that
    rule covers it: a Windows notification raised as the tray's balloon and not a toast fails
    [TRAY-09](../tray-and-background/#tray-09), not this rule. It fails this rule when the row links no rule, or
    the rule it links does not cover the difference (a menu bar on one OS and a menu button on the others).
  - *Reference:* the app template, read through: every place it tests the OS calls its [`Os.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/Os.java), and each is
    on a row or changes nothing a user sees: the macOS form of the keymap's chords (`Keymap`, `KeyDispatcher`,
    `AppServices`, and the pickers' keys that `MainWindow` hands `PickerKeys`), the system menu bar and its
    application menu (`MainWindow`, `Chrome`, `MacAppMenu`), and a program's path, arguments and `PATH`
    (`Executables`, `Browser`, `ShellPath`). No other app has been read through for it yet. The
    differences found so far, each on no row or short of its row: Mirada
    closes its window on Escape on Linux only ([`Command.escapeCloses`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Command.java)), follows the OS's accent color on macOS and
    Windows only ([`Theme.followsAccent`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Theme.java)), puts its title on the left on Windows only ([`TitleBar.Layout`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/TitleBar.java)) and has a
    menu bar on macOS only ([`ui/MacMenus.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/MacMenus.java)); Editora deletes a file for good on Windows ([`io/Trash.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/io/Trash.java)),
    keeps the user's key bindings apart by OS (`keybindings` and `keybindingsMac` in [`config/Settings.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/Settings.java)) and
    registers its WSL targets on Windows only ([`App`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java)); Termina believes the folder a shell reports for itself on
    Windows only ([`ProcessCwd.reportedDirectoryWins`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/pty/ProcessCwd.java)), and its Settings Sync keeps the user's key bindings in one
    file for macOS and another for Windows and Linux ([`sync/KeybindingsFile.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/sync/KeybindingsFile.java)). On a row, and passing: a click that takes `Cmd` on macOS
    and `Ctrl` elsewhere (Editora's [`editor/EditorBuffer.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/EditorBuffer.java), Termina's [`link/LinkGesture.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/link/LinkGesture.java)), and the
    profiles Termina lists on Windows only, Command Prompt, PowerShell, Git Bash and the WSL distributions
    ([`shell/ShellDiscovery.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/shell/ShellDiscovery.java)).
