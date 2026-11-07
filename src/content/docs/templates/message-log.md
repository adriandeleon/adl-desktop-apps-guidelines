---
title: "Message Log"
description: "The family's Message Log: the session's status-bar messages, newest first, opened from the status bar."
---

<span class="lvl lvl-must">MUST</span> in every app with a status bar. The status bar's echo line shows one message
and replaces it with the next; the Message Log keeps them, so nothing the app said is lost because it scrolled past.
Reference: Editora's `ui/MessageLog.java` (the model, no JavaFX) and `ui/MessageLogPopup.java` (the view); Torrenta
carries the same pair.

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
<li><span class="pin">3</span><span><strong>Entry.</strong> The time as <code>HH:mm:ss</code> (11 px, monospace, muted) and the message as it appeared in the echo line. Newest first.</span></li>
<li><span class="pin">4</span><span><strong>Severity</strong> colors the message, not the row: errors red, warnings amber, information in the default color. The time stays muted.</span></li>
<li><span class="pin">5</span><span><strong>Actions:</strong> Copy (the visible entries as text), Clear (empties the session log and its unread count), and Open Doctor: messages carry no actions of their own, and a missing tool or a server that would not start is where Doctor helps.</span></li>
<li><span class="pin">6</span><span><strong>Key hint</strong>, muted, 11 px.</span></li>
<li><span class="pin">7</span><span><strong>Echo line.</strong> The status bar's latest message; a click opens the log.</span></li>
<li><span class="pin">8</span><span><strong>Unread errors.</strong> A red count beside the echo line while errors have arrived since the log was last opened; a click opens the log.</span></li>
</ol>

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A popup anchored just above the status bar's echo area, over the window | `MessageLogPopup.show` |
| Size | 773 px wide; the list 336 px high, scrolling past that | `WIDTH`, `LIST_HEIGHT` |
| Card | `-color-bg-overlay`, radius 12, like the palette | `.message-log` |
| Rows | Padding 2 4, radius 5; selected row `-state-sel` | `.message-log-list .list-cell` |
| Capacity | The newest 200 messages; older ones drop off | `MessageLog.MAX_ENTRIES` |
| Repeats | A message repeated within 2 s moves to the top as one entry, unread once | `REPEAT_MILLIS` |
| Lifetime | This session only, in memory. Not written to disk: the Debug Log is the persistent record | `MessageLog` |
| Blank messages | Not recorded (a blank message only clears the echo line) | `MessageLog.add` |

## Behavior

- **Open:** click the echo line or the unread-error count, or run `view.messageLog`.
- **Close:** Esc, `C-g`, or a click outside. **Copy:** `Ctrl/Cmd+C` copies the selected entries.
- **Severity comes from the message key** (`StatusSeverity`): a key ending in `Failed` or `Error` is an error, one
  with `cannot` or `invalid` a warning. Name new keys accordingly, or report through the error channel directly.
- Opening the log, or clearing it, resets the unread-error count. An unread error is never evicted silently: the
  count keeps it even when the entry drops off the end.

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
