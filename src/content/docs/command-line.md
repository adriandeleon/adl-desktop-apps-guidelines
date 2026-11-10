---
title: "Command line and launch"
description: "The flags every app accepts and the single-instance hand-off."
---

## Flags

- **CLI-01 · MUST.** `--help` and `--version` print before the GUI starts, in plain English, not translated.
  - *Check (code):* `main` handles both and exits before `launch`, printing fixed English text rather than
    catalog messages.
  - *Reference:* Editora [`App.main`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java), [`App.helpText`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java); [`AppArgsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/AppArgsTest.java).
- **CLI-02 · MUST.** `--config-dir <dir>` uses another config folder, and `--dev` uses `~/.<app>-dev`.
  - *Check (code):* the config folder is resolved from both flags before anything reads `~/.<app>`.
  - *Reference:* Editora [`App.main`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java) ([`ConfigManager.configDirFor`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigManager.java), [`App.devFlag`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java)).
- **CLI-03 · SHOULD.** `--new-instance` starts a second process instead of handing off to the running one.
  - *Check (code):* the flag skips the single-instance hand-off.
  - *Reference:* Editora [`App.newInstanceFlag`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java).
- **CLI-04 · SHOULD.** `--no-session` does not restore the last session.
  - *Check (by hand):* launch with `--no-session` and find only the items given on the command line.
  - *Reference:* Editora [`App.helpText`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java).
- **CLI-05 · MUST.** `--report` writes a redacted problem report to a file in the current folder, prints the file's
  path and opens the GitHub issue, without starting the GUI. Where the current folder can't be written, the file
  goes to the temp folder.
  - *Why:* the person who ran the command is looking at that folder, and has to attach the file. A report in the
    config folder is hidden from them, and one printed to the terminal is cut by its scrollback.
  - *Check (test):* a test runs the report command in a folder and finds the redacted report there, with its path
    printed.
  - *Reference:* Editora [`report/ReportCommand.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/report/ReportCommand.java) ([`ReportCommandTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/report/ReportCommandTest.java)); Torrenta's
    [`ReportCommand.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/report/ReportCommand.java) does the same. The app template and Mirada write theirs beside the settings, and Termina
    prints its report without writing a file ([`ReportCommand.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/report/ReportCommand.java)).
- **CLI-12 · MUST.** An option the app does not know stops the launch: it names the option on standard error, says
  how to get help, and exits with status 2 before the GUI starts. That holds for an option with one dash as for one
  with two: it is never ignored and never taken for a file. Two kinds of argument are not unknown options. A lone
  `-`, and every argument after `--`, is a file ([CLI-06](#cli-06)), whatever it starts with. And the JVM options a
  launcher can leave among the program's arguments, `--add-exports`, `--add-opens` and `-p`, are skipped by name,
  each with the value that follows it: never refused, and the value never opened as a file. On Windows the message
  prints in the console, which is [CLI-11](#cli-11).
  - *Why:* a mistyped `--config-dir` that is ignored starts the app on the real settings, which is the one thing
    the flag was typed to avoid. Status 2 is what a script tests for a usage error. `--` is how a file whose name
    starts with a dash is opened at all. A launcher's own option is not the user's mistake, so it must not stop the
    app; it is skipped by name because a parser that skips whatever it does not know is the one that ignores a typo.
  - *Check (test):* a test hands the parser `main` runs before the GUI an unknown option with two dashes and one
    with a single dash, and finds the message and exit status 2 for each; hands it `-`, and `--` followed by a file
    whose name starts with a dash, and finds both among the files; and hands it `--add-exports` with a value and
    finds no error and no file.
  - *Reference:* no app does all of it yet. The app template's [`cli/CommandLine.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/cli/CommandLine.java) comes nearest: it refuses an
    unknown option with one dash or two ([`Main.run`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/Main.java) prints the message and returns 2) and takes `-` and whatever
    follows `--` for files ([`CommandLineTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/cli/CommandLineTest.java)), but it refuses `--add-exports` as it does any other, and its
    tests hand it no unknown option with a single dash. Termina's [`cli/CommandLine.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/cli/CommandLine.java) and Torrenta's [`cli/CommandLine.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/cli/CommandLine.java)
    refuse both kinds of unknown option with status 2, and the launcher's options with them. Torrenta also refuses
    `-` and `--`: anything that starts with a dash and is not a magnet link. Termina takes no file arguments, and
    refuses `-` as an unexpected argument and `--` as an unknown option. Mirada's [`Launch.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/Launch.java) exits 2 on an unknown
    option with two dashes and takes `-` and whatever follows `--` for files, but it takes a single-dash option for
    a file too. Editora skips every option it does not know without a word, a lone `-` included, and has no `--`
    ([`App.fileTargets`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java)); that is how it gets past a leaked `--add-exports`, `--add-opens` or `-p`, whose value it opens
    only when a file of that name exists ([`AppArgsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/AppArgsTest.java)). nux reads `--minimized` and `--screenshot=` and ignores
    every other argument ([`App.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java)), and Modula reads none ([`ModulaApp.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ModulaApp.java)).
- **CLI-13 · SHOULD.** The short flags are the same in every app: `-h` for `--help`, and both `-v` and `-V` for
  `--version`.
  - *Check (code):* the command-line parser takes `-h` for `--help`, and `-v` and `-V` for `--version`.
  - *Reference:* Termina's [`cli/CommandLine.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/cli/CommandLine.java) and Torrenta's [`cli/CommandLine.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/cli/CommandLine.java); the `--help` text of both
    lists `-h` and `-v` and leaves `-V` out. Editora takes `-h` and `-V` but not `-v`, the app template `-h` and
    `-v` but not `-V`, Mirada has no short flags, and Modula and nux take neither flag in any form.
- **CLI-11 · MUST.** On Windows, `--help`, `--version` and `--report` print in the console they were typed in, and
  so does the message that refuses an unknown option ([CLI-12](#cli-12)). A GUI launcher has no console, so the
  installer also carries a console launcher (jpackage's `win-console`) that runs the same entry point, or `main`
  attaches to the parent's console before it prints.
  - *Why:* without it, the three flags and a mistyped option print nothing from cmd or PowerShell, and the command
    line differs on one OS.
  - *Check (code):* the Windows jpackage configuration adds a launcher with `win-console=true` that runs the app's
    own main class and lets the three flags and an unknown option reach it, or `main` calls `AttachConsole` before
    printing.
  - *Reference:* Torrenta meets it with its second launcher, `torrenta-nox`:
    [`src/jpackage/torrenta-nox-windows.properties`](https://github.com/adriandeleon/torrenta/blob/master/src/jpackage/torrenta-nox-windows.properties) sets `win-console=true`, and its [`pom.xml`](https://github.com/adriandeleon/torrenta/blob/master/pom.xml) adds that launcher
    to the image on Windows (the `os-windows` profile picks the file), beside the main launcher and on the same
    module and main class. The launcher's own `arguments=--headless` applies only when the person gives none (its
    [`CLAUDE.md`](https://github.com/adriandeleon/torrenta/blob/master/CLAUDE.md) says so), so `torrenta-nox --help`, `--version`, `--report` and an option it does not know reach
    `main` as typed, and `main` refuses the unknown option and answers the three flags before it looks for
    `--headless` ([`App.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/App.java)). No other app has a `win-console` launcher or calls `AttachConsole`.
- **CLI-06 · SHOULD.** `[files…]` opens these items.
  - *Check (by hand):* launch with two files and find both open.
  - *Reference:* Editora [`App.fileTargets`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java).

## Launch

- **CLI-07 · MUST.** One instance runs per config folder, unless a launch asks for another with `--new-instance`
  ([CLI-03](#cli-03)). Any other second launch hands its arguments to the running app over a local endpoint and
  exits; on macOS, `openFiles` Apple Events reach the running app.
  - *Check (test):* a test makes the first launch primary and delivers a second launch's arguments to it.
  - *Reference:* Editora [`ipc/SingleInstance.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ipc/SingleInstance.java) ([`SingleInstanceTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ipc/SingleInstanceTest.java)), [`MacOpenFiles.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/MacOpenFiles.java).
- **CLI-08 · SHOULD.** An advisory lock tells two processes on one config folder about each other.
  - *Check (test):* a test takes the lock from two processes.
  - *Reference:* Editora [`config/InstanceLock.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/InstanceLock.java) ([`InstanceLockTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/InstanceLockTest.java)).
- **CLI-09 · SHOULD.** `main` sets `java.awt.headless=true` before any AWT class loads. The exceptions are the uses
  [TRAY-14](../tray-and-background/#tray-14) allows, which `main` decides once, before that point: the tray on
  Windows and macOS, and on macOS the dock badge, open-file handlers and the trash.
  - *Why:* on macOS, AWT's native toolkit and JavaFX contend for the one AppKit run loop and can hang; headless
    Java2D still draws to images.
  - *Check (code):* `main` calls `System.setProperty("java.awt.headless", …)` before `launch` and before anything
    that loads an AWT class, and the value is `"true"` unless one of those uses needs AWT on this OS.
  - *Reference:* Editora [`App.main`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java), always headless. Torrenta [`os/AwtUse.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/os/AwtUse.java) (`headful`, which its `App.main` asks
    once: never on Linux, for the tray on Windows, and for the tray, the dock badge or the open-file handlers on
    macOS). Mirada [`App.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/App.java) (headless except on macOS, for Move to Trash: [`os/Trash.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/os/Trash.java), `headless`).
- **CLI-10 · SHOULD.** External tools are resolved through the login shell's `PATH`.
  - *Why:* a `.app` launched from Finder inherits a stripped `PATH`.
  - *Check (code):* every process the app starts gets a `PATH` that includes the login shell's.
  - *Reference:* Editora [`process/ProcessRunner.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/process/ProcessRunner.java) (`augmentedPath`).
