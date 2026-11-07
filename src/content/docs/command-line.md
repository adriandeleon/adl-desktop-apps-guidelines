---
title: "Command line and launch"
description: "The flags every app accepts and the single-instance hand-off."
---

## Flags

- **CLI-01 · MUST.** `--help` and `--version` print before the GUI starts, in plain English, not translated.
  - *Check (code):* `main` handles both and exits before `launch`, printing fixed English text rather than
    catalog messages.
  - *Reference:* Editora `App.main`, `App.helpText`; `AppArgsTest`.
- **CLI-02 · MUST.** `--config-dir <dir>` uses another config folder, and `--dev` uses `~/.<app>-dev`.
  - *Check (code):* the config folder is resolved from both flags before anything reads `~/.<app>`.
  - *Reference:* Editora `App.main` (`ConfigManager.configDirFor`, `App.devFlag`).
- **CLI-03 · SHOULD.** `--new-instance` starts a second process instead of handing off to the running one.
  - *Check (code):* the flag skips the single-instance hand-off.
  - *Reference:* Editora `App.newInstanceFlag`.
- **CLI-04 · SHOULD.** `--no-session` does not restore the last session.
  - *Check (by hand):* launch with `--no-session` and find only the items given on the command line.
  - *Reference:* Editora `App.helpText`.
- **CLI-05 · MUST.** `--report` writes a redacted problem report and opens the GitHub issue, without starting the
  GUI.
  - *Check (test):* a test runs the report command and finds the redacted report written.
  - *Reference:* Editora `report/ReportCommand.java` (`ReportCommandTest`).
- **CLI-06 · SHOULD.** `[files…]` opens these items.
  - *Check (by hand):* launch with two files and find both open.
  - *Reference:* Editora `App.fileTargets`.

## Launch

- **CLI-07 · MUST.** One instance runs per config folder. A second launch hands its arguments to the running app
  over a local endpoint and exits; on macOS, `openFiles` Apple Events reach the running app.
  - *Check (test):* a test makes the first launch primary and delivers a second launch's arguments to it.
  - *Reference:* Editora `ipc/SingleInstance.java` (`SingleInstanceTest`), `MacOpenFiles.java`.
- **CLI-08 · SHOULD.** An advisory lock tells two processes on one config folder about each other.
  - *Check (test):* a test takes the lock from two processes.
  - *Reference:* Editora `config/InstanceLock.java` (`InstanceLockTest`).
- **CLI-09 · SHOULD.** `main` sets `java.awt.headless=true` before any AWT class loads.
  - *Why:* on macOS, AWT's native toolkit and JavaFX contend for the one AppKit run loop and can hang; headless
    Java2D still draws to images.
  - *Check (code):* `System.setProperty("java.awt.headless", "true")` is among the first statements of `main`.
  - *Reference:* Editora `App.main`.
- **CLI-10 · SHOULD.** External tools are resolved through the login shell's `PATH`.
  - *Why:* a `.app` launched from Finder inherits a stripped `PATH`.
  - *Check (code):* every process the app starts gets a `PATH` that includes the login shell's.
  - *Reference:* Editora `process/ProcessRunner.java` (`augmentedPath`).
