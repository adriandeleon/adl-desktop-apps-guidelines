# Message Log

> The family's Message Log: the session's status-bar messages, newest first, opened from the status bar.

Pauta 6.0.0 (2026-11-10). The page with its screenshots and mockups: https://pauta-project.dev/6.0.0/templates/message-log/.
Every rule of the edition: https://pauta-project.dev/6.0.0/llms-full.txt.

The status bar's echo line shows one message and replaces it with the next; the Message Log keeps them, so nothing
the app said is lost because it scrolled past.

Every app keeps one, session-only and bounded, newest first, with Esc to close and Clear to empty it:
[DIAG-01](https://pauta-project.dev/6.0.0/diagnostics/#diag-01). A click on the status bar's echo area opens it:
[WIN-01](https://pauta-project.dev/6.0.0/window-shell/#win-01). This page is what the log looks like and how it behaves beyond that.

## Anatomy

*Mockup of the Message Log open above the status bar. Drawn on the page; the numbers below mark its parts.*

1. **Title** "Messages", 14 px bold.
2. **Filter**, focused on open. Filters as you type; ↓ or Enter moves into the results without leaving the field.
3. **Entry.** The time as `HH:mm:ss` (11 px, muted, in the UI font like the rest of the card, not monospace) and the message as it appeared in the echo line. Newest first.
4. **Severity** colors the message, not the row: errors red, warnings amber, information in the default color. The time stays muted.
5. **Actions:** Copy (the selected entries as text, or every listed entry when none is selected), Clear (empties the session log and its unread count), and Open Doctor: messages carry no actions of their own, and a missing tool or a server that would not start is where Doctor helps.
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

- **MLOG-08 · SHOULD.** The Message Log is a card in the window's in-scene overlay host, anchored just above the status
  bar's echo area, never a separate window: 773 px wide, its list 336 px high, at the default zoom, holding the
  newest 200 messages of the session (the cap [DIAG-01](https://pauta-project.dev/6.0.0/diagnostics/#diag-01) asks for).
  - *Why:* the log answers "what just happened?" next to the line that said it; a separate window, or another size
    and cap, makes the same log look and behave differently from app to app.
  - *Check (code):* the log adds its node to the overlay host (no `Stage`), with width 773, list height 336 and a
    cap of 200.
  - *Reference:* Editora [`ui/MessageLogPopup.java`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/MessageLogPopup.java) (`WIDTH`, `LIST_HEIGHT`) and
    [`ui/MessageLog.java`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/MessageLog.java) (`MAX_ENTRIES`); the app template's [`ui/MessageLogView.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/ui/MessageLogView.java).
    Torrenta's card is 640 × 300, and Termina's log is a separate window that keeps 500 messages.

## Behavior

- **MLOG-02 · SHOULD.** A click on the status bar's unread-error count opens the Message Log, as a click on the
  echo area does ([WIN-01](https://pauta-project.dev/6.0.0/window-shell/#win-01)), and so does the `view.messageLog` command.
  - *Check (code):* the unread-error count runs `view.messageLog` on a click, and the command is registered.
  - *Reference:* Editora [`StatusBar`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/StatusBar.java) (`echo`, `unreadErrors`), [`StatusBar.showMessageLog`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/StatusBar.java).
- **MLOG-03 · SHOULD.** The active keymap's cancel chord or a click outside closes the Message Log, as Esc does.
  - *Check (code):* the Message Log closes on the chord the active keymap binds to its cancel command, not on a fixed
    `Ctrl+G`, and a press outside the log closes it: on the backdrop, where the log is the in-scene card
    [MLOG-08](https://pauta-project.dev/6.0.0/templates/message-log/#mlog-08) asks for. In an app with one key table (a terminal app's keymap, or the built-in table of
    an app that ships no keymap files), the chord is the one that table binds to a cancel command; where it binds
    none, Esc and the press outside are all there is to test.
  - *Reference:* Editora [`OverlayHost`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/OverlayHost.java), which hides the card on a press on its backdrop and on [`PickerKeys.isCancel`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/PickerKeys.java): Esc,
    or the chord the keymap binds to `edit.cancel` (Editora's id; `C-g` in its Emacs keymap). Its [`MessageLogPopup`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/MessageLogPopup.java)
    also closes on `Ctrl+G` whatever the keymap, though the CUA keymap binds `C-g` to `nav.goToLine`; its handler
    reads `Alt+G` too, which the Emacs keymap's `M-g` prefix takes first.
    Elsewhere the chord is fixed: `Ctrl+G` in the app template ([`ui/OverlayHost.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/ui/OverlayHost.java)), Termina
    ([`ui/MessageLogWindow.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/MessageLogWindow.java)) and Mirada ([`ui/MessageLogView.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/MessageLogView.java)). Torrenta's
    ([`ui/MessageLogPopup.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/MessageLogPopup.java)) closes on Esc and on a press on its backdrop: Torrenta has no keymap and no cancel
    command, so the chord asks nothing more of it.
- **MLOG-04 · SHOULD.** The Message Log copies the selected entries on the platform's copy chord, `Ctrl+C`
  (`Cmd+C` on macOS), in every keymap, and on the active keymap's copy chord too.
  - *Check (code):* the Message Log's key handling copies the selected entries on C with the platform's shortcut
    modifier down (`isShortcutDown`), whatever the active keymap binds to copy, and also on the chord the active
    keymap binds to its copy command (`M-w` in an Emacs keymap), read from the keymap and not written into the
    handler.
  - *Reference:* for the platform's chord, Editora [`MessageLogPopup.copySelection`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/MessageLogPopup.java), on a fixed shortcut-down C, and
    the Message Logs of Torrenta ([`ui/MessageLogPopup.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/MessageLogPopup.java)), Termina ([`ui/MessageLogWindow.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/MessageLogWindow.java)), Mirada
    ([`ui/MessageLogView.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/MessageLogView.java)) and the app template ([`ui/MessageLogView.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/ui/MessageLogView.java)), each the same way. For the
    keymap's chord, no app yet: none of the five reads the keymap's copy binding in its log, and Editora's Emacs
    keymap binds copy to `M-w`, which its log does not read. Editora doesn't hold the first half under that keymap
    on Windows and Linux either: the keymap starts longer chords with `C-c`, a prefix the window's key dispatcher
    ([`command/KeyDispatcher.java`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/command/KeyDispatcher.java)) consumes in a scene filter, ahead of the log's own.
- **MLOG-05 · SHOULD.** A message's severity comes from its key: a `status.*` key whose last segment contains `fail`
  or `error` is an error, one containing `cannot` or `invalid` a warning. Name new keys accordingly, or post the
  message as an error directly (Editora's status bar has an error channel for that).
  - *Check (code):* one function gives a message's severity from its key by those rules (Editora's
    `StatusSeverity.ofKey`). A test that asserts it is the surest evidence.
  - *Reference:* Editora [`ui/StatusSeverity.java`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/StatusSeverity.java) (`ofKey`), [`StatusSeverityTest`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/test/java/com/editora/ui/StatusSeverityTest.java).
- **MLOG-06 · SHOULD.** Opening the Message Log, or clearing it, resets the unread-error count.
  - *Check (code):* opening the Message Log marks it read, and clearing it zeroes the count (Editora's `markRead`
    and `clear`).
  - *Reference:* Editora [`MessageLog.markRead`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/MessageLog.java), [`MessageLog.clear`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/MessageLog.java), [`StatusBar.showMessageLog`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/StatusBar.java).
- **MLOG-07 · SHOULD.** An unread error is never evicted from the Message Log silently: the unread-error count
  keeps it even when the entry drops off the end.
  - *Check (code):* the Message Log counts unread errors apart from the entries it holds, so dropping an unread
    error at the cap leaves the count as it was. A test that asserts it is the surest evidence.
  - *Reference:* Editora [`MessageLogSeverityTest`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/test/java/com/editora/ui/MessageLogSeverityTest.java) (`anEvictedErrorStillCounts`).

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
