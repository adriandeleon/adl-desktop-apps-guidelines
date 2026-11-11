---
title: "Message Log"
description: "The family's Message Log: the session's status-bar messages, newest first, opened from the status bar."
---

The status bar's echo line shows one message and replaces it with the next; the Message Log keeps them, so nothing
the app said is lost because it scrolled past.

Every app keeps one, session-only and bounded, newest first, with Esc to close and Clear to empty it:
[DIAG-01](../../diagnostics/#diag-01). A click on the status bar's echo area opens it:
[WIN-01](../../window-shell/#win-01). This page is what the log looks like and how it behaves beyond that.

## Anatomy

<div class="mock-stage">
<div class="m-logwin" role="img" aria-label="Mockup of the Message Log open above the status bar">
<div class="m-card m-log">
<div class="m-row"><span class="header">Messages</span><span class="pin">1</span></div>
<div class="m-row"><div class="m-field focus m-grow"><span class="ph">Filter messages…</span></div><span class="pin">2</span></div>
<div class="entries">
<div class="entry sel"><span class="time" style="font-family:inherit">14:32:07</span><span class="m-grow">Saved Shelf.java</span><span class="pin">3</span></div>
<div class="entry"><span class="time" style="font-family:inherit">14:31:52</span><span class="m-grow error">Language server for Java failed to start: jdtls was not found</span><span class="pin">4</span></div>
<div class="entry"><span class="time" style="font-family:inherit">14:30:18</span><span class="m-grow warn">Settings sync: not connected, retrying</span></div>
<div class="entry"><span class="time" style="font-family:inherit">14:29:40</span><span class="m-grow">Line numbers: on</span></div>
<div class="entry"><span class="time" style="font-family:inherit">14:29:05</span><span class="m-grow">Opened ~/workspace/shelf/src/main/java/com/example/shelf/Shelf.java</span></div>
</div>
<div class="footer"><span class="m-btn flat">Copy</span><span class="m-btn flat">Clear</span><span class="m-btn flat">Open Doctor</span><span class="pin">5</span><span class="m-grow"></span><span class="m-subtle" style="font-size:11px">Esc to close</span><span class="pin">6</span></div>
</div>
<div class="m-statusbar"><span class="pin">7</span><span class="echo">Saved Shelf.java</span><span class="m-badge">1</span><span class="pin">8</span><span class="m-grow"></span><span>master</span><span>Ln 30, Col 1</span><span>UTF-8</span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Title</strong> "Messages", 14 px bold.</span></li>
<li><span class="pin">2</span><span><strong>Filter</strong>, focused on open. Filters as you type; ↓ or Enter moves into the results without leaving the field.</span></li>
<li><span class="pin">3</span><span><strong>Entry.</strong> The time as <code>HH:mm:ss</code> (11 px, muted, in the UI font like the rest of the card, not monospace) and the message as it appeared in the echo line. Newest first.</span></li>
<li><span class="pin">4</span><span><strong>Severity</strong> colors the message, not the row: errors red, warnings amber, information in the default color. The time stays muted.</span></li>
<li><span class="pin">5</span><span><strong>Actions:</strong> Copy (the selected entries as text, or every listed entry when none is selected), Clear (empties the session log and its unread count), and Open Doctor: messages carry no actions of their own, and a missing tool or a server that would not start is where Doctor helps.</span></li>
<li><span class="pin">6</span><span><strong>Key hint</strong>, muted, 11 px.</span></li>
<li><span class="pin">7</span><span><strong>Echo line.</strong> The status bar's latest message; a click opens the log.</span></li>
<li><span class="pin">8</span><span><strong>Unread errors.</strong> A red count beside the echo line while errors have arrived since the log was last opened; a click opens the log.</span></li>
</ol>

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A card in the shared in-scene overlay host, anchored just above the status bar's echo area, over the window | `MessageLogPopup.show`, `OverlayHost` |
| Size | 773 px wide; the list 336 px high, scrolling past that | `WIDTH`, `LIST_HEIGHT` |
| Card | `-color-bg-overlay`, radius 12, like the palette | `.message-log` |
| Rows | Padding 2 4, radius 5; selected row `-state-sel` | `.message-log-list .list-cell` |
| Capacity | The newest 200 messages; older ones drop off | `MessageLog.MAX_ENTRIES` |
| Repeats | A message repeated within 2 s moves to the top as one entry, unread once | `REPEAT_MILLIS` |
| Lifetime | This session only, in memory. Not written to disk: the Debug Log is the persistent record | `MessageLog` |
| Blank messages | Not recorded (a blank message only clears the echo line) | `MessageLog.add` |

- **MLOG-08 · SHOULD.** The Message Log is a card in the window's in-scene overlay host, anchored just above the status
  bar's echo area, never a separate window: 773 px wide, its list 336 px high, at the default zoom, holding the
  newest 200 messages of the session (the cap [DIAG-01](../../diagnostics/#diag-01) asks for).
  - *Why:* the log answers "what just happened?" next to the line that said it; a separate window, or another size
    and cap, makes the same log look and behave differently from app to app.
  - *Check (code):* the log adds its node to the overlay host (no `Stage`), with width 773, list height 336 and a
    cap of 200.
  - *Reference:* Editora [`ui/MessageLogPopup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLogPopup.java) (`WIDTH`, `LIST_HEIGHT`) and
    [`ui/MessageLog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLog.java) (`MAX_ENTRIES`); the app template's [`ui/MessageLogView.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/MessageLogView.java).
    Torrenta's card is 640 × 300, and Termina's log is a separate window that keeps 500 messages.

## Behavior

- **MLOG-02 · SHOULD.** A click on the status bar's unread-error count opens the Message Log, as a click on the
  echo area does ([WIN-01](../../window-shell/#win-01)), and so does the `view.messageLog` command.
  - *Check (code):* the unread-error count runs `view.messageLog` on a click, and the command is registered.
  - *Reference:* Editora [`StatusBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusBar.java) (`echo`, `unreadErrors`), [`StatusBar.showMessageLog`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusBar.java).
- **MLOG-03 · SHOULD.** The active keymap's cancel chord or a click outside closes the Message Log, as Esc does.
  - *Check (code):* the Message Log closes on the chord the active keymap binds to its cancel command, not on a fixed
    `Ctrl+G`, and a press outside the log closes it: on the backdrop, where the log is the in-scene card
    [MLOG-08](#mlog-08) asks for. In an app with one key table (a terminal app's keymap, or the built-in table of
    an app that ships no keymap files), the chord is the one that table binds to a cancel command; where it binds
    none, Esc and the press outside are all there is to test.
  - *Reference:* Editora [`OverlayHost`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/OverlayHost.java), which hides the card on a press on its backdrop and on [`PickerKeys.isCancel`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/PickerKeys.java): Esc,
    or the chord the keymap binds to `edit.cancel` (Editora's id; `C-g` in its Emacs keymap). Its [`MessageLogPopup`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLogPopup.java)
    also closes on `Ctrl+G` whatever the keymap, though the CUA keymap binds `C-g` to `nav.goToLine`; its handler
    reads `Alt+G` too, which the Emacs keymap's `M-g` prefix takes first. The app template's Message Log
    ([`ui/MessageLogView.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/MessageLogView.java)) is shown through its [`ui/OverlayHost.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/OverlayHost.java), which closes it the same way, on the
    keymap's `edit.cancel` chord (`cancelOn`). Elsewhere the chord is fixed: `Ctrl+G` in Termina
    ([`ui/MessageLogWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/MessageLogWindow.java)) and Mirada ([`ui/MessageLogView.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/MessageLogView.java)). Torrenta's
    ([`ui/MessageLogPopup.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MessageLogPopup.java)) closes on Esc and on a press on its backdrop: Torrenta has no keymap and no cancel
    command, so the chord asks nothing more of it.
- **MLOG-04 · SHOULD.** The Message Log copies the selected entries on the platform's copy chord, `Ctrl+C`
  (`Cmd+C` on macOS), in every keymap, and on the active keymap's copy chord too.
  - *Check (code):* the Message Log's key handling copies the selected entries on C with the platform's shortcut
    modifier down (`isShortcutDown`), whatever the active keymap binds to copy, and also on the chord the active
    keymap binds to its copy command (`M-w` in an Emacs keymap), read from the keymap and not written into the
    handler.
  - *Reference:* for the platform's chord, Editora [`MessageLogPopup.copySelection`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLogPopup.java), on a fixed shortcut-down C, and
    the Message Logs of Torrenta ([`ui/MessageLogPopup.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MessageLogPopup.java)), Termina ([`ui/MessageLogWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/MessageLogWindow.java)), Mirada
    ([`ui/MessageLogView.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/MessageLogView.java)) and the app template ([`ui/MessageLogView.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/MessageLogView.java)), each the same way. For the
    keymap's chord, no app yet: none of the five reads the keymap's copy binding in its log, and Editora's Emacs
    keymap binds copy to `M-w`, which its log does not read. The app template meets the rule all the same: none of its
    keymaps binds a copy command, so there is no second chord to read, and its key dispatcher steps aside while the
    log, an overlay, is open (`KeyDispatcher`), so `Ctrl+C` reaches it under the Emacs keymap's `C-c` prefix too. Editora doesn't hold the first half under that keymap
    on Windows and Linux either: the keymap starts longer chords with `C-c`, a prefix the window's key dispatcher
    ([`command/KeyDispatcher.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/command/KeyDispatcher.java)) consumes in a scene filter, ahead of the log's own.
- **MLOG-05 · SHOULD.** A message's severity comes from its key: a `status.*` key whose last segment contains `fail`
  or `error` is an error, one containing `cannot` or `invalid` a warning. Name new keys accordingly, or post the
  message as an error directly (Editora's status bar has an error channel for that).
  - *Check (code):* one function gives a message's severity from its key by those rules (Editora's
    `StatusSeverity.ofKey`). A test that asserts it is the surest evidence.
  - *Reference:* Editora [`ui/StatusSeverity.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusSeverity.java) (`ofKey`), [`StatusSeverityTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StatusSeverityTest.java).
- **MLOG-06 · SHOULD.** Opening the Message Log, or clearing it, resets the unread-error count.
  - *Check (code):* opening the Message Log marks it read, and clearing it zeroes the count (Editora's `markRead`
    and `clear`).
  - *Reference:* Editora [`MessageLog.markRead`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLog.java), [`MessageLog.clear`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLog.java), [`StatusBar.showMessageLog`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusBar.java).
- **MLOG-07 · SHOULD.** An unread error is never evicted from the Message Log silently: the unread-error count
  keeps it even when the entry drops off the end.
  - *Check (code):* the Message Log counts unread errors apart from the entries it holds, so dropping an unread
    error at the cap leaves the count as it was. A test that asserts it is the surest evidence.
  - *Reference:* Editora [`MessageLogSeverityTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MessageLogSeverityTest.java) (`anEvictedErrorStillCounts`).

## Copy

| Key | English |
|---|---|
| `messagelog.title` | Messages |
| `messagelog.filter` | Filter messages… |
| `messagelog.empty` | No messages yet |
| `messagelog.copy` / `messagelog.clear` | Copy / Clear |
| `messagelog.doctor` | Open Doctor |
| `messagelog.hint` | Esc to close |

## In the apps

![Editora's Message Log popup above the status bar](../../../assets/shots/editora-message-log.png "Editora.")
