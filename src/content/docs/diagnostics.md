---
title: "Diagnostics and support"
description: "Message Log, Debug Log, update notification, Report a Problem, Doctor and crash recovery."
---

- **DIAG-01 · MUST.** The **Message Log** is a session-only, bounded history of every echo-area message with
  `HH:mm:ss` times, newest first. Esc closes it; Clear empties it. A click on the echo area opens it
  ([WIN-01](../window-shell/#win-01)); the [Message Log template](../templates/message-log/) has the rest.
  - *Check (test):* a test records messages newest first, evicts the oldest past the cap, and clears.
  - *Reference:* Editora [`ui/MessageLog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLog.java) ([`MessageLogTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MessageLogTest.java)), [`ui/MessageLogPopup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLogPopup.java).
- **DIAG-02 · MUST.** The **Debug Log** captures all `java.util.logging` records and uncaught exceptions in memory
  (bounded) **and** mirrors them to a session file in the config folder, keeping the previous session's file so a
  crash is still visible next launch. Editora names the two `<app>-session.log` and `<app>-session.prev.log`.
  - *Check (test):* tests bound the buffer and find the session file written and the previous one kept.
  - *Reference:* Editora [`ui/DebugLog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DebugLog.java) ([`DebugLogTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/DebugLogTest.java), [`DebugLogSessionFileTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/DebugLogSessionFileTest.java)).
- **DIAG-03 · MUST.** The Debug Log opens in a modeless window with Refresh, Copy, Clear, Export and Report a
  Problem. The window's find bar is [FIND-01](../templates/find-bar/#find-01).
  - *Why:* it is the only way to see logs in a packaged build.
  - *Check (by hand):* open the Debug Log and keep working in the main window while it is open.
  - *Reference:* Editora [`ui/DebugLogWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DebugLogWindow.java).
- **DIAG-04 · MUST.** An **uncaught exception handler** is installed at the start of `main`, before the toolkit
  starts, and routes to the Debug Log and an echo message. Never a stack trace dialog.
  - *Check (code):* `main` calls the install method before any argument handling or `launch`, and the handler
    posts an error to the echo area, and opens no dialog.
  - *Reference:* Editora [`DebugLog.install()`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DebugLog.java) for the install and the log. The echo message is posted by Termina
    ([`ui/WindowManager.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/WindowManager.java), through `DebugLog.onUncaught`), the app template ([`ui/Startup.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Startup.java)) and Mirada
    ([`App.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/App.java), `uncaught`). Editora's handler and Torrenta's ([`ui/DebugLog.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/DebugLog.java)) log the exception
    but do not yet post one.
- **DIAG-05 · MUST.** The **update check** reads GitHub `/releases/latest` once per app session (not per window), at
  most once a day, a few seconds after the first frame ([PERF-15](../performance/#perf-15)). It never downloads or
  installs anything by itself.
  - *Check (test):* a test waits for the first paint and the delay, then checks once a session and not when off or
    not due.
  - *Reference:* Editora [`update/UpdateCheck.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/update/UpdateCheck.java), [`ui/UpdateCheckScheduler.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/UpdateCheckScheduler.java) ([`UpdateCheckSchedulerTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/UpdateCheckSchedulerTest.java)),
    [`ui/UpdateCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/UpdateCoordinator.java).
- **DIAG-09 · MUST.** When the check finds a newer version, the status bar says so, naming the version and linking
  its release. About's line for the last check is [ABOUT-02](../templates/about/#about-02).
  - *Check (code):* the update coordinator posts a status-bar message with the newer version and its release link.
  - *Reference:* Editora [`ui/UpdateCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/UpdateCoordinator.java).
- **DIAG-10 · MUST.** **Check for Updates** runs the check by hand, as a command in the palette and in the Help menu,
  where the app has one, and Settings has an off switch for the automatic check.
  - *Check (code):* the command (`help.checkForUpdates` in Editora) is registered and, in an app with a Help menu,
    listed there, and the scheduler skips the automatic check while the setting is off.
  - *Reference:* Editora [`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarModel.java) (`help.checkForUpdates`),
    [`ui/SettingsWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java) (`settings.checkForUpdates`), [`ui/UpdateCheckScheduler.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/UpdateCheckScheduler.java).
    nux, which has no menu bar, registers the command for its palette (`app.checkUpdates` in [`App.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java)).
- **DIAG-06 · MUST.** **Report a Problem** is a command, listed in the Help menu where the app has one, that builds a
  report: the app's version, the OS, the runtime, a summary of the settings and the recent Debug Log. Its redaction
  is [DIAG-11](#diag-11), its window [DIAG-12](#diag-12) and the limit on the issue link's length
  [DIAG-13](#diag-13). The same report from the command line, for when the app cannot start, is
  [CLI-05](../command-line/#cli-05).
  - *Check (code):* the command (`help.reportProblem` in Editora) is registered and, in an app with a Help menu,
    listed there, and the text it builds carries the app's version, the OS, the Java and JavaFX versions, a summary
    of the settings and the end of the Debug Log.
  - *Reference:* Termina [`report/ProblemReport.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/report/ProblemReport.java) ([`ProblemReportTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/report/ProblemReportTest.java),
    `itCarriesTheEnvironmentTheUsefulSettingsAndTheEndOfTheLog`), the app template's
    [`report/ProblemReport.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/report/ProblemReport.java) and Mirada's [`report/ProblemReport.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/report/ProblemReport.java). Editora's
    ([`report/ProblemReport.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/report/ProblemReport.java), `help.reportProblem` in [`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarModel.java)) and Torrenta's
    ([`report/ProblemReport.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/report/ProblemReport.java)) carry the system details and the last two session logs, and no settings
    summary yet. Modula and nux have no problem report.
- **DIAG-11 · MUST.** An app's problem report ([DIAG-06](#diag-06)) is **redacted** before it is shown: home paths,
  user names, e-mail addresses, credentials and tokens are replaced.
  - *Check (test):* redaction tests cover home paths, user names, e-mail addresses, credentials in URLs and
    tokens, and the text the Report a Problem window shows has been through the redactor.
  - *Reference:* Editora [`report/Redactor.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/report/Redactor.java) ([`RedactorTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/report/RedactorTest.java)), applied in
    [`ProblemReport.assemble`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/report/ProblemReport.java) before the window gets the text. The other four apps with a report do it too:
    Termina ([`RedactorTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/report/RedactorTest.java)), Torrenta ([`RedactorTest`](https://github.com/adriandeleon/torrenta/blob/master/src/test/java/com/torrenta/report/RedactorTest.java)), Mirada ([`RedactorTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/report/RedactorTest.java)) and the app
    template ([`ReportTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/report/ReportTest.java), `redactsPrivateDetails`).
- **DIAG-12 · MUST.** The Report a Problem window shows the report in a field the user can edit. Its submit action
  copies the report, as edited, to the clipboard and opens a GitHub issue prefilled from the repository's
  `bug_report.yml` form. Nothing is uploaded: the user submits the issue.
  - *Check (code):* the window's report field is editable; its submit action puts the field's text on the clipboard
    and opens a new-issue link that names `bug_report.yml` as its template and carries the report in the form's
    fields; and the report's code opens that link in the browser and makes no network request of its own.
  - *Reference:* Editora [`ui/ReportProblemWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ReportProblemWindow.java) ([`ReportProblemWindowFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ReportProblemWindowFxTest.java),
    `theEditedReportIsCopiedAndFilledIntoTheIssue`), [`ProblemReport.issueUrl`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/report/ProblemReport.java). Termina's
    [`ui/ReportProblemWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/ReportProblemWindow.java), Torrenta's [`ui/ReportProblemWindow.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/ReportProblemWindow.java), Mirada's
    [`ui/ReportProblemWindow.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/ReportProblemWindow.java) and the app template's [`ui/ReportProblemWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/ReportProblemWindow.java) do the same. Two
    of them leave the environment block (version, runtime, OS) out of the editable field while still sending it:
    Mirada shows it as a label, and the app template does not show it.
- **DIAG-13 · MUST.** When the prefilled link would be longer than about 7,500 characters, the report stays out of
  it: the form's report field asks the user to paste the report from the clipboard, where
  [DIAG-12](#diag-12) has put it.
  - *Check (test):* a report test puts a short report in the link and leaves the paste hint for a long one.
  - *Reference:* Editora [`ProblemReport.issueUrl`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/report/ProblemReport.java) (`MAX_URL_LENGTH`, 7500; [`ProblemReportTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/report/ProblemReportTest.java),
    `aShortReportGoesIntoTheIssueLinkItself` and `aLongReportLeavesThePasteHintInstead`). Termina
    ([`ProblemReportTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/report/ProblemReportTest.java), `aLongReportFallsBackToTheClipboard`), Torrenta ([`ProblemReportTest`](https://github.com/adriandeleon/torrenta/blob/master/src/test/java/com/torrenta/report/ProblemReportTest.java),
    `aShortReportGoesInTheLinkAndALongOneLeavesTheHint`), Mirada ([`ProblemReportTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/report/ProblemReportTest.java),
    `aLongReportAsksForAPaste`) and the app template ([`ReportTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/report/ReportTest.java),
    `issueLinkFillsTheFormOrFallsBackToTheClipboard`) use the same limit.
- **DIAG-07 · SHOULD.** A **Doctor** page checks the environment (external tools, versions, permissions, paths),
  with a status per row and a fix or link for each failure.
  - *Check (by hand):* open the Doctor with a tool missing and find its row failed, with what to install.
  - *Reference:* Editora `doctor/*`, [`ui/DoctorPane.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DoctorPane.java).
- **DIAG-08 · SHOULD.** An app with user documents snapshots unsaved work off the FX thread and offers it back after
  a crash.
  - *Check (test):* a test finds an abandoned session's snapshots and offers them to the first window only.
  - *Reference:* Editora [`recovery/RecoveryService.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/recovery/RecoveryService.java) ([`RecoveryServiceTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/recovery/RecoveryServiceTest.java), [`CrashRecoveryFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/CrashRecoveryFxTest.java)).

![Editora's Message Log popup above the status bar](../../assets/shots/editora-message-log.png "Clicking the status message opens the Message Log: this session's messages, newest first.")
![Editora's Report a Problem window](../../assets/shots/editora-report-problem.png "Report a Problem: a redacted, editable report that opens as a prefilled GitHub issue.")

![Editora's About window](../../assets/shots/editora-about.png "About: version, runtime, license, links and the update status.")
![Editora's Doctor page](../../assets/shots/editora-doctor.png "Doctor: each external tool with its version, or what to install.")

Secrets never reach a log, a report or a config file: see [Secrets stay out of files](../settings/#secrets-stay-out-of-files).
