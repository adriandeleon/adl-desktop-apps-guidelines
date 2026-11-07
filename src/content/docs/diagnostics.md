---
title: "Diagnostics and support"
description: "Message Log, Debug Log, update notification, Report a Problem, Doctor and crash recovery."
---

- **DIAG-01 · MUST.** The **Message Log** is a session-only, bounded history of every echo-area message with
  `HH:mm:ss` times, newest first. Clicking the status message opens it; Esc closes it; Clear empties it.
  - *Check (test):* a test records messages newest first, evicts the oldest past the cap, and clears.
  - *Reference:* Editora `ui/MessageLog.java` (`MessageLogTest`), `ui/MessageLogPopup.java`.
- **DIAG-02 · MUST.** The **Debug Log** captures all `java.util.logging` records and uncaught exceptions in memory
  (bounded) **and** mirrors them to `<app>-session.log` in the config folder, keeping the previous one as
  `<app>-session.prev.log` so a crash is still visible next launch.
  - *Check (test):* tests bound the buffer and find the session file written and the previous one kept.
  - *Reference:* Editora `ui/DebugLog.java` (`DebugLogTest`, `DebugLogSessionFileTest`).
- **DIAG-03 · MUST.** The Debug Log opens in a modeless window with Refresh, Copy, Clear, Export and Report a
  Problem.
  - *Why:* it is the only way to see logs in a packaged build.
  - *Check (by hand):* open the Debug Log and keep working in the main window while it is open.
  - *Reference:* Editora `ui/DebugLogWindow.java`.
- **DIAG-04 · MUST.** An **uncaught exception handler** is installed at the start of `main`, before the toolkit
  starts, and routes to the Debug Log and an echo message. Never a stack trace dialog.
  - *Check (code):* `main` calls the install method before any argument handling or `launch`, and the handler
    shows no dialog.
  - *Reference:* Editora `DebugLog.install()`. Editora, Torrenta and Termina log the exception but do not yet post
    an echo message.
- **DIAG-05 · MUST.** The **update notification** reads GitHub `/releases/latest` once per app session (not per
  window), at most once a day, a few seconds after the first frame. A newer version shows a status-bar notice and a
  line in About; "Check for Updates" runs it by hand; Settings has an off switch. It never downloads or installs
  by itself.
  - *Check (test):* a test waits for the first paint and the delay, then checks once a session and not when off or
    not due.
  - *Reference:* Editora `update/UpdateCheck.java`, `ui/UpdateCheckScheduler.java` (`UpdateCheckSchedulerTest`),
    `ui/UpdateCoordinator.java`.
- **DIAG-06 · MUST.** Help → **Report a Problem** builds a report (version, OS, runtime, settings summary, recent
  Debug Log), **redacts** it (home paths, user names, e-mail addresses, credentials, tokens), shows it editable,
  copies it to the clipboard and opens a prefilled GitHub issue from `bug_report.yml`. Over about 7,500 characters
  the link falls back to "paste from the clipboard". `<app> --report` does the same from the command line for when
  the app cannot start. Nothing is uploaded.
  - *Check (test):* redaction tests cover home paths, user names, e-mail addresses, credentials in URLs and
    tokens; a report test puts a short report in the link and leaves the paste hint for a long one.
  - *Reference:* Editora `report/ProblemReport.java`, `report/Redactor.java`, `report/ReportCommand.java`,
    `ui/ReportProblemWindow.java` (`RedactorTest`, `ProblemReportTest`).
- **DIAG-07 · SHOULD.** A **Doctor** page checks the environment (external tools, versions, permissions, paths),
  with a status per row and a fix or link for each failure.
  - *Check (by hand):* open the Doctor with a tool missing and find its row failed, with what to install.
  - *Reference:* Editora `doctor/*`, `ui/DoctorPane.java`.
- **DIAG-08 · SHOULD.** An app with user documents snapshots unsaved work off the FX thread and offers it back after
  a crash.
  - *Check (test):* a test finds an abandoned session's snapshots and offers them to the first window only.
  - *Reference:* Editora `recovery/RecoveryService.java` (`RecoveryServiceTest`, `CrashRecoveryFxTest`).

![Editora's Message Log popup above the status bar](../../assets/shots/editora-message-log.png "Clicking the status message opens the Message Log: this session's messages, newest first.")
![Editora's Report a Problem window](../../assets/shots/editora-report-problem.png "Report a Problem: a redacted, editable report that opens as a prefilled GitHub issue.")

![Editora's About window](../../assets/shots/editora-about.png "About: version, runtime, license, links and the update status.")
![Editora's Doctor page](../../assets/shots/editora-doctor.png "Doctor: each external tool with its version, or what to install.")

Secrets never reach a log, a report or a config file: see [Secrets stay out of files](../settings/#secrets-stay-out-of-files).
