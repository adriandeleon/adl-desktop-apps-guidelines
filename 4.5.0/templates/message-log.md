# Message Log

> The family's Message Log: the session's status-bar messages, newest first, opened from the status bar.

Pauta 4.5.0 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.5.0/templates/message-log/.
Every rule of the edition: https://pauta-project.dev/4.5.0/llms-full.txt.

The status bar's echo line shows one message and replaces it with the next; the Message Log keeps them, so nothing
the app said is lost because it scrolled past.

Every app keeps one, session-only and bounded, newest first, with Esc to close and Clear to empty it:
[DIAG-01](https://pauta-project.dev/4.5.0/diagnostics/#diag-01). A click on the status bar's echo area opens it:
[WIN-01](https://pauta-project.dev/4.5.0/window-shell/#win-01). This page is what the log looks like and how it behaves beyond that.

## Anatomy

*Mockup of the Message Log open above the status bar. Drawn on the page; the numbers below mark its parts.*

1. **Title** "Messages", 14 px bold.
2. **Filter**, focused on open. Filters as you type; ↓ or Enter moves into the results without leaving the field.
3. **Entry.** The time as `HH:mm:ss` (11 px, monospace, muted) and the message as it appeared in the echo line. Newest first.
4. **Severity** colors the message, not the row: errors red, warnings amber, information in the default color. The time stays muted.
5. **Actions:** Copy (the visible entries as text), Clear (empties the session log and its unread count), and Open Doctor: messages carry no actions of their own, and a missing tool or a server that would not start is where Doctor helps.
6. **Key hint**, muted, 11 px.
7. **Echo line.** The status bar's latest message; a click opens the log.
8. **Unread errors.** A red count beside the echo line while errors have arrived since the log was last opened; a click opens the log.

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

*Screenshot: Editora.*
