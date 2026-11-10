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
<div class="entry sel"><span class="time">14:32:07</span><span class="m-grow">Saved Shelf.java</span><span class="pin">3</span></div>
<div class="entry"><span class="time">14:31:52</span><span class="m-grow error">Language server for Java failed to start: jdtls was not found</span><span class="pin">4</span></div>
<div class="entry"><span class="time">14:30:18</span><span class="m-grow warn">Settings sync: not connected, retrying</span></div>
<div class="entry"><span class="time">14:29:40</span><span class="m-grow">Line numbers: on</span></div>
<div class="entry"><span class="time">14:29:05</span><span class="m-grow">Opened ~/workspace/shelf/src/main/java/com/example/shelf/Shelf.java</span></div>
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

- **MLOG-02 · SHOULD.** A click on the unread-error count opens the log too, and so does the `view.messageLog`
  command.
  - *Check (code):* the unread-error count runs `view.messageLog` on a click, and the command is registered.
  - *Reference:* Editora [`StatusBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusBar.java) (`echo`, `unreadErrors`), [`StatusBar.showMessageLog`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusBar.java).
- **MLOG-03 · SHOULD.** `C-g` or a click outside closes the log too, as Esc does.
  - *Check (code):* the card's key handler hides it on `C-g`; the overlay's backdrop hides it on a press.
  - *Reference:* Editora [`MessageLogPopup`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLogPopup.java), [`OverlayHost`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/OverlayHost.java).
- **MLOG-04 · SHOULD.** `Ctrl+C` (`Cmd+C` on macOS) copies the selected entries.
  - *Check (code):* the card's key handler copies the selection on the shortcut-down C.
  - *Reference:* Editora [`MessageLogPopup.copySelection`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLogPopup.java).
- **MLOG-05 · SHOULD.** A message's severity comes from its key: a `status.*` key whose last segment contains `fail`
  or `error` is an error, one containing `cannot` or `invalid` a warning. Name new keys accordingly, or report through
  the error channel directly.
  - *Check (test):* a severity test classifies keys by those rules.
  - *Reference:* Editora [`ui/StatusSeverity.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusSeverity.java) (`ofKey`), [`StatusSeverityTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StatusSeverityTest.java).
- **MLOG-06 · SHOULD.** Opening the log, or clearing it, resets the unread-error count.
  - *Check (code):* opening the log marks it read, and `clear` zeroes the count.
  - *Reference:* Editora [`MessageLog.markRead`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLog.java), [`MessageLog.clear`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLog.java), [`StatusBar.showMessageLog`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusBar.java).
- **MLOG-07 · SHOULD.** An unread error is never evicted silently: the count keeps it even when the entry drops off
  the end.
  - *Check (test):* an error pushed past the capacity still counts as unread.
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
