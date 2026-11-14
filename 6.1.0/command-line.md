# Command line and launch

> The flags every app accepts and the single-instance hand-off.

Pauta 6.1.0 (2026-11-14). The page with its screenshots and mockups: https://pauta-project.dev/6.1.0/command-line/.
Every rule of the edition: https://pauta-project.dev/6.1.0/llms-full.txt.

Every app takes the same command-line flags, and they mean the same thing in each: print the help or the version,
use another config folder, start without the last session, write a problem report, open the files named. They work
the same on every OS, Windows' console included, and refuse an option they don't know. A second launch doesn't start
a second app: it hands its arguments to the one already running for that config folder and exits. Scripts and
habits depend on these names, so a flag a rule names is required as written.

## Flags

- **CLI-01 · MUST.** `--help` and `--version` print before the GUI starts, in plain English, not translated.
  - *Check (code):* `main` handles both and exits before `launch`, printing fixed English text rather than
    catalog messages.
  - *Reference:* Editora [`App.main`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/App.java), [`App.helpText`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/App.java); [`AppArgsTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/AppArgsTest.java).
- **CLI-02 · MUST.** `--config-dir <dir>` uses another config folder, and `--dev` uses `~/.<app>-dev`, a folder in
  the user's home on Windows, macOS and Linux alike.
  - *Check (code):* the config folder is resolved from both flags before anything reads `~/.<app>`, and what
    `--dev` resolves to is `<user.home>/.<app>-dev` on Windows, macOS and Linux alike, with no branch on the OS.
  - *Reference:* Editora [`App.main`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/App.java) ([`ConfigManager.configDirFor`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/config/ConfigManager.java), [`App.devFlag`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/App.java)).
- **CLI-03 · SHOULD.** `--new-instance` starts a second process instead of handing off to the running one.
  - *Check (code):* the flag skips the single-instance hand-off.
  - *Reference:* Editora [`App.newInstanceFlag`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/App.java).
- **CLI-04 · SHOULD.** An app that reopens what was open in its last session (documents, tabs, folders) takes
  `--no-session`, which starts it without them.
  - *Check (by hand):* launch with `--no-session` and find only the items given on the command line.
  - *Reference:* Editora [`App.helpText`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/App.java). Mirada reopens nothing from its last session, so the rule does not cover
    it; it takes the flag and does nothing with it ([`Launch.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/Launch.java)).
- **CLI-05 · MUST.** `--report` writes a redacted problem report to a file in the current folder, prints the file's
  path and opens the GitHub issue, without starting the GUI. Where the current folder can't be written, the file
  goes to the temp folder.
  - *Why:* the person who ran the command is looking at that folder, and has to attach the file. A report in the
    config folder is hidden from them, and one printed to the terminal is cut by its scrollback.
  - *Check (code):* `main` handles `--report` before `launch`: it writes the redacted report to a file in the
    current folder, or in the temp folder when that one can't be written, prints the file's path and opens the
    new-issue page. A test that runs the report command in a folder and finds the redacted report there, with its
    path printed, is the surest evidence.
  - *Reference:* Editora [`report/ReportCommand.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/report/ReportCommand.java) ([`ReportCommandTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/report/ReportCommandTest.java)); Torrenta's
    [`ReportCommand.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/report/ReportCommand.java) does the same, and so does the app template's [`report/ReportCommand.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/report/ReportCommand.java)
    ([`ReportTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/report/ReportTest.java), `theReportGoesInTheCurrentFolderAndItsPathIsPrinted` and
    `aCurrentFolderThatCantBeWrittenSendsTheReportToTheTempFolder`). Mirada writes its report beside the settings, and Termina
    prints its report without writing a file ([`ReportCommand.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/report/ReportCommand.java)).
- **CLI-12 · MUST.** An option the app does not know stops the launch: it names the option on standard error, says
  how to get help, and exits with status 2 before the GUI starts. That holds for an option with one dash as for one
  with two: it is never ignored and never taken for a file. Two kinds of argument are not unknown options. In an app
  that opens files named on its command line, a lone `-`, and every argument after `--`, is one of those files,
  whatever it starts with; that sentence does not cover an app that opens none. And the JVM options a launcher can
  leave among the program's arguments, `--add-exports`, `--add-opens` and `-p`, are skipped by name, each with its
  value, whether the value is the next argument or follows `=` in the same one (`--add-exports=…`): never refused,
  and the value never opened as a file. On Windows the message prints in the console, which is
  [CLI-11](https://pauta-project.dev/6.1.0/command-line/#cli-11).
  - *Why:* a mistyped `--config-dir` that is ignored starts the app on the real settings, which is the one thing
    the flag was typed to avoid. Status 2 is what a script tests for a usage error. `--` is how a file whose name
    starts with a dash is opened at all. A launcher's own option is not the user's mistake, so it must not stop the
    app; it is skipped by name because a parser that skips whatever it does not know is the one that ignores a typo.
  - *Check (code):* the parser `main` runs before the GUI refuses an option the app does not define, with two
    dashes or with one, and `main` then prints the option and how to get help on standard error and exits with
    status 2 before `launch`. In an app that opens files named on its command line, the parser takes a lone `-`,
    and a name that starts with a dash after `--`, for files; in an app that opens none, this part has nothing to
    find. And the parser skips `--add-exports`, `--add-opens` and `-p` with their values, in both forms a launcher
    writes (`--add-exports <value>` and `--add-exports=<value>`), with no error and no file. A test that hands the
    parser each of these arguments is the surest evidence.
  - *Reference:* the app template's [`cli/CommandLine.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/cli/CommandLine.java) does all of it: it refuses an
    unknown option with one dash or two ([`Main.run`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/Main.java) prints the message and returns 2) and takes `-` and whatever
    follows `--` for files, and skips `--add-exports`, `--add-opens` and `-p` with their values in both forms
    ([`CommandLineTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/cli/CommandLineTest.java), `reportsMistakes`, `acceptsTheEqualsFormAndDoubleDash` and
    `skipsTheLaunchersJvmOptionsAndTakesCapitalVForVersion`). No other app does all of it yet. Termina's [`cli/CommandLine.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/cli/CommandLine.java) and Torrenta's [`cli/CommandLine.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/cli/CommandLine.java)
    refuse both kinds of unknown option with status 2, and the launcher's options with them. Torrenta, which opens
    the `.torrent` files and magnet links named on its command line, also refuses `-` and `--`: anything that
    starts with a dash and is not a magnet link. Termina opens no files from its command line, so that part of the
    rule does not cover it (it refuses `-` as an unexpected argument and `--` as an unknown option); the launcher's
    options are all it misses. Mirada's [`Launch.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/Launch.java) exits 2 on an unknown
    option with two dashes, `--add-exports` and `--add-opens` among them, and takes `-` and whatever follows `--`
    for files, but it takes a single-dash option, `-p` included, for a file too. Editora skips every option it does
    not know without a word, a lone `-` included, and has no `--`
    ([`App.fileTargets`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/App.java)); that is how it gets past a leaked `--add-exports`, `--add-opens` or `-p`, whose value it opens
    only when a file of that name exists ([`AppArgsTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/AppArgsTest.java)). nux reads `--minimized` and `--screenshot=` and ignores
    every other argument ([`App.java`](https://github.com/adriandeleon/nux/blob/d374ec4ee3f2eff0f7d378797884e6b81520ce20/src/main/java/com/nux/App.java)), and Modula reads none ([`ModulaApp.java`](https://github.com/adriandeleon/Modula/blob/518300a4c2114909315fbd3a73acc999fb4c16b5/src/main/java/com/modula/ModulaApp.java)); neither opens files, so
    what they miss is the refusal.
- **CLI-13 · SHOULD.** The short flags are the same in every app: `-h` for `--help`, and both `-v` and `-V` for
  `--version`.
  - *Check (code):* the command-line parser takes `-h` for `--help`, and `-v` and `-V` for `--version`.
  - *Reference:* Termina's [`cli/CommandLine.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/cli/CommandLine.java) and Torrenta's [`cli/CommandLine.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/cli/CommandLine.java); the `--help` text of both
    lists `-h` and `-v` and leaves `-V` out. The app template's [`cli/CommandLine.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/cli/CommandLine.java) takes all three, and its
    `--help` text lists them. Editora takes `-h` and `-V` but not `-v`, Mirada has no short flags, and Modula and nux take neither flag in any form.
- **CLI-11 · MUST.** On Windows, `--help`, `--version` and `--report` print in the console they were typed in, and
  so does the message that refuses an unknown option ([CLI-12](https://pauta-project.dev/6.1.0/command-line/#cli-12)). A GUI launcher has no console, so the
  installer also carries a console launcher (jpackage's `win-console`) that runs the same entry point, or `main`
  attaches to the parent's console before it prints.
  - *Why:* without it, the three flags and a mistyped option print nothing from cmd or PowerShell, and the command
    line differs on one OS.
  - *Check (code):* the Windows jpackage configuration adds a launcher with `win-console=true` that runs the app's
    own main class and lets the three flags and an unknown option reach it, or `main` calls `AttachConsole` before
    printing.
  - *Reference:* Torrenta meets it with its second launcher, `torrenta-nox`:
    [`src/jpackage/torrenta-nox-windows.properties`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/jpackage/torrenta-nox-windows.properties) sets `win-console=true`, and its [`pom.xml`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/pom.xml) adds that launcher
    to the image on Windows (the `os-windows` profile picks the file), beside the main launcher and on the same
    module and main class. The launcher's own `arguments=--headless` applies only when the person gives none (its
    [`CLAUDE.md`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/CLAUDE.md) says so), so `torrenta-nox --help`, `--version`, `--report` and an option it does not know reach
    `main` as typed, and `main` refuses the unknown option and answers the three flags before it looks for
    `--headless` ([`App.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/App.java)). The app template does it the same way: its `os-windows` profile in
    [`pom.xml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/pom.xml) adds a second launcher, `exampleapp-cli`, whose [`packaging/windows/exampleapp-cli.properties`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/packaging/windows/exampleapp-cli.properties)
    sets `win-console=true` and nothing else, so it runs the same main class with the arguments as typed. No other
    app has a `win-console` launcher or calls `AttachConsole`. Mirada's
    one Windows executable is its native image, copied over jpackage's launcher ([`native-app-image.sh`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/scripts/native-app-image.sh)); whether it prints in
    the console depends on how that image is linked, which Mirada's files do not say, and no Windows run has
    confirmed it.
- **CLI-06 · SHOULD.** An app that opens files or folders (documents, images, a `.torrent`) opens the ones named
  as arguments on its command line, which its `--help` lists as `[files…]`.
  - *Check (by hand):* launch with two files and find both open, and run `--help` and find `[files…]` in its
    usage line.
  - *Reference:* Editora [`App.fileTargets`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/App.java). Termina, Modula and nux open no files, so the rule does not cover
    them.

## Launch

- **CLI-07 · MUST.** One instance runs per config folder, unless a launch asks for another with `--new-instance`
  ([CLI-03](https://pauta-project.dev/6.1.0/command-line/#cli-03)). Any other second launch hands its arguments, when it has any, to the running app over a
  local endpoint and exits. In an app that opens files, the `openFiles` Apple Events of macOS reach the running app
  too.
  - *Check (code):* the first launch on a config folder becomes the primary and listens on a local endpoint; a
    second launch without `--new-instance` sends it its arguments and exits; and, in an app that opens files, a
    handler for the macOS open-files event passes them to the running app (Editora's `MacOpenFiles`). A test that
    makes the first launch primary and delivers a second launch's arguments to it is the surest evidence.
  - *Reference:* Editora [`ipc/SingleInstance.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ipc/SingleInstance.java) ([`SingleInstanceTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ipc/SingleInstanceTest.java)), [`MacOpenFiles.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/MacOpenFiles.java).
    nux doesn't yet: its second launch asks the running app to show its window and exits, handing over none of its
    arguments ([`instance/SingleInstance.java`](https://github.com/adriandeleon/nux/blob/d374ec4ee3f2eff0f7d378797884e6b81520ce20/src/main/java/com/nux/instance/SingleInstance.java), `NUX-SHOW`), and what lets a second instance run on the folder is a
    setting (`singleInstance`, read in `main` of [`App.java`](https://github.com/adriandeleon/nux/blob/d374ec4ee3f2eff0f7d378797884e6b81520ce20/src/main/java/com/nux/App.java)), not `--new-instance`.
- **CLI-08 · SHOULD.** An advisory lock tells two processes on one config folder about each other.
  - *Check (code):* each process takes an advisory file lock in its config folder, and can tell that another
    process already holds one there. A test that takes the lock from two processes is the surest evidence.
  - *Reference:* Editora [`config/InstanceLock.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/config/InstanceLock.java) ([`InstanceLockTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/config/InstanceLockTest.java)).
- **CLI-09 · SHOULD.** `main` sets `java.awt.headless=true` before any AWT class loads. Only these uses make AWT
  headful, in an app that has them: the tray on Windows and macOS, and on macOS the dock badge, the open-file
  handlers and Move to Trash. Linux never needs it. `main` decides once, before that point, which of them the
  settings ask for on this OS. What a tray app says when its tray is turned on after that is
  [TRAY-14](https://pauta-project.dev/6.1.0/tray-and-background/#tray-14).
  - *Why:* on macOS, AWT's native toolkit and JavaFX contend for the one AppKit run loop and can hang; headless
    Java2D still draws to images.
  - *Check (code):* `main` calls `System.setProperty("java.awt.headless", …)` before `launch` and before anything
    that loads an AWT class, and the value is `"true"` unless one of the listed uses is wanted on this OS: always
    on Linux, on Windows unless the tray is on, and on macOS unless the tray, the dock badge, an open-file handler
    or, in an app that trashes through AWT, Move to Trash is.
  - *Reference:* Editora [`App.main`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/App.java), always headless, as Termina ([`App.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/App.java)) and the app template
    ([`Main.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/Main.java)) are. Torrenta [`os/AwtUse.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/os/AwtUse.java) (`headful`, which its `App.main` asks
    once: never on Linux, for the tray on Windows, and for the tray, the dock badge or the open-file handlers on
    macOS). Mirada [`App.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/App.java) (headless except on macOS, for Move to Trash: [`os/Trash.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/os/Trash.java), `headless`).
    Modula and nux never set the property, so AWT is headful on every OS, Linux included.
- **CLI-10 · SHOULD.** An app that starts external tools (`git`, a compiler, `ffmpeg`) resolves them through the
  login shell's `PATH` on macOS and Linux. Windows has no login shell's `PATH` to ask for, and the one the app
  inherits is used there.
  - *Why:* a `.app` launched from Finder inherits a stripped `PATH`.
  - *Check (code):* on macOS and Linux, every process the app starts gets a `PATH` that includes the login
    shell's. An app that starts no external tool is outside the rule.
  - *Reference:* Editora [`process/ProcessRunner.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/process/ProcessRunner.java) (`augmentedPath`; on Windows its login-shell probe returns
    nothing and the inherited `PATH` is used). The app template's [`sync/ShellPath.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/sync/ShellPath.java) does the same for the `git` and `gh` it
    starts: the login shell's `PATH` before the inherited one on macOS and Linux, the inherited one on Windows
    ([`ShellPathTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/sync/ShellPathTest.java)).
