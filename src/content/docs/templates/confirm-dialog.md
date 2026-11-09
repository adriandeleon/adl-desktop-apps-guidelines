---
title: "Confirm dialog"
description: "The family's question before a destructive action: it names the thing, the button names the action in red, and Escape cancels."
---

One question before anything the user made is removed, deleted, discarded or overwritten, asked the same way
everywhere: the text names the thing and what happens to it, the confirming button is the action's own verb in red,
and Cancel is the way out. An action that can be taken back needs no question (see
[Window shell](../../window-shell/)).

## Rules

- **CONF-01 · MUST.** Before anything the user made is removed, deleted, discarded or overwritten, the app asks first,
  unless the action can be taken back instead.
  - *Check (code):* each destructive action calls a confirmation before it changes anything, or records an undo.
  - *Reference:* Editora [`ui/CloseCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CloseCoordinator.java) (unsaved changes, Quit) and [`GitCoordinator.confirmDestructive`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitCoordinator.java);
    Torrenta [`ui/RemoveConfirm.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java), which asks it for the torrent list, the RSS tab and every list in Settings.
- **CONF-02 · MUST.** The question names the thing and what happens to it.
  - *Check (code):* every confirmation string names the thing, by an argument for its name or count or in its own
    words ("Quit Editora?"), and says what happens to it.
  - *Reference:* Editora `dialog.unsaved.header`, `dialog.discard.tracked`; Torrenta [`RemoveConfirm.question`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java),
    [`Actions.removeQuestion`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Actions.java).
- **CONF-03 · MUST.** The confirming button carries the action's own verb (Delete files, Remove, Discard, Quit), never
  OK or Yes, in the `danger` style.
  - *Check (code):* the action's `ButtonType` is named from the catalog and its button gets the `danger` style class.
  - *Reference:* Editora [`GitCoordinator.confirmDestructive`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitCoordinator.java), [`MainController.styleUnsavedChangesButtons`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java),
    `styleQuitButtonAsDanger`; Torrenta [`RemoveConfirm.ask`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java).
- **CONF-04 · MUST.** Cancel is the way out: Escape and the window's close button both answer Cancel, and nothing is
  lost on a dismissal.
  - *Check (code):* Cancel has the `CANCEL_CLOSE` role, and the result defaults to Cancel when the dialog closes any
    other way (`showAndWait().orElse(cancel)`).
  - *Reference:* Editora [`GitCoordinator.confirmDestructive`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitCoordinator.java), [`CloseCoordinator.unsavedAlert`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CloseCoordinator.java); Torrenta
    [`RemoveConfirm.ask`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java).

## Anatomy

<div class="mock-stage">
<div class="m-card m-cf" role="img" aria-label="Mockup of the Remove and delete files question">
<div class="titlebar">Remove and delete files <span class="pin">1</span></div>
<div class="m-cf-header">Remove and delete files <span class="pin">2</span></div>
<div class="m-cf-text">Remove these 3 torrents and delete the downloaded files? This cannot be undone. <span class="pin">3</span></div>
<div class="m-cf-buttons"><span class="pin">5</span><span class="m-btn">Cancel</span><span class="m-btn danger">Delete files</span><span class="pin">4</span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Window title</strong>: the header's words again ("Remove feed", "Unsaved changes"). A plain confirmation, no icon in the title and no app name.</span></li>
<li><span class="pin">2</span><span><strong>Header</strong>, when the question is long enough to need one. Editora's Git confirmations set none and put the whole message in the content; Torrenta's header names the action and the content asks the question.</span></li>
<li><span class="pin">3</span><span><strong>The question names the thing and the consequence.</strong> How many ("these 3 torrents", a <code>{0,choice,…}</code> plural), which one ("the feed “Linux ISOs” and its articles"), what stays ("The downloaded files stay on disk."), and "This cannot be undone." only when it is true. Termina's multi-line paste shows the text itself in an expandable area, so the decision is made on what will be sent.</span></li>
<li><span class="pin">4</span><span><strong>The action button</strong> carries the action's verb (Delete files, Remove, Discard, Quit, Close), never OK or Yes, and the <code>danger</code> style: red, not the accent. It is the dialog's one colored button.</span></li>
<li><span class="pin">5</span><span><strong>Cancel</strong>, in the catalog's word, with the <code>CANCEL_CLOSE</code> role: Escape and the window's close button both answer Cancel.</span></li>
</ol>

## States

<div class="mock-stage">
<div class="m-states">
<div class="m-state m-cf-state"><div class="cap">Unsaved changes</div><div class="q">Save changes to Main.java before closing?</div><div class="row"><span class="m-btn success">Save</span><span class="m-btn danger">Discard</span><span class="m-btn">Cancel</span></div></div>
<div class="m-state m-cf-state"><div class="cap">Remove, files kept</div><div class="q">Remove this torrent? The downloaded files stay on disk.</div><div class="row"><span class="m-btn">Cancel</span><span class="m-btn danger">Remove</span></div></div>
<div class="m-state m-cf-state"><div class="cap">A program is running</div><div class="q">Close this tab? <span class="m-muted">bash (top) is still running. Closing will end it.</span></div><div class="row"><span class="m-btn primary">Cancel</span><span class="m-btn">Close</span></div></div>
<div class="m-state m-cf-state"><div class="cap">Undo instead of a question</div><div class="m-statusbar" style="border:1px solid var(--m-border);border-radius:6px"><span class="echo">Undo  Removed Ubuntu ISO</span><span class="m-chip">C-z</span></div></div>
</div>
</div>

- **CONF-05 · SHOULD.** When saving is an option the question has three answers, in this order: Save (the `success`
  style, green), Discard (`danger`) and Cancel. A Save that fails leaves the tab open.
  - *Check (code):* the unsaved-changes alert sets Save, Discard and Cancel in that order and styles the first two.
  - *Reference:* Editora [`CloseCoordinator.unsavedAlert`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CloseCoordinator.java), [`MainController.styleUnsavedChangesButtons`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java).
- **CONF-06 · SHOULD.** A question about ending a running program, which is not the user's data, words the button
  Close and makes Cancel the default button, so dismissing the dialog by any route keeps the program alive.
  - *Check (code):* the close-running-program alert calls `setDefaultButton(true)` on Cancel.
  - *Reference:* Termina [`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java) (`dialog.closeAnyway`).
- **CONF-07 · SHOULD.** Where the action can be taken back, the app asks nothing and offers Undo instead.
  - *Check (by hand):* close a clean tab and reopen it with Reopen Closed Tab; in Mirada, trash an image and undo.
  - *Reference:* Mirada moves an image to the trash at once and offers Undo; Torrenta asks before removing a torrent
    but also keeps the removal on its undo stack for ten minutes ([`UndoStack.KEEP_MS`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/UndoStack.java)); Editora [`ClosedTabs`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ClosedTabs.java).

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | `Alert(CONFIRMATION)` owned by the window (`initOwner`), shown with `showAndWait`; the answer defaults to Cancel when the dialog is closed any other way | `GitCoordinator.confirmDestructive`, `RemoveConfirm.ask` |
| Buttons | A `ButtonType` with the action's name and the `OK_DONE` role, and Cancel with `CANCEL_CLOSE` from the catalog, never JavaFX's stock OK and Cancel, which are worded in the JVM's locale | `RemoveConfirm.ask`, Torrenta's [`StockButtons`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/StockButtons.java) |
| Action button | `danger` style class: the theme's `.button.danger` fills it `-color-danger-emphasis` with emphasis text. Save in the unsaved question: `success` | `MainController.styleUnsavedChangesButtons`, `styleQuitButtonAsDanger` |
| Default button | The action, where it has the `OK_DONE` role (Editora's Git confirmations, Torrenta's Remove): Enter runs it, and red is what says so. Editora's unsaved-changes and Quit questions give their buttons no role, so Enter does nothing. Termina's close-running-program question makes Cancel the default | `confirmDestructive`, `CloseCoordinator.unsavedAlert`, Termina [`TerminalWindow`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java) |
| Font | The UI font sheet attached to the dialog pane, because a dialog is its own scene and inherits nothing from the window | Torrenta [`Fonts.installUiFont(DialogPane)`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Fonts.java), Editora [`App.installUiFont`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java) (every window) |
| Stylesheet | `Dialogs.styled` adds `app.css` to a dialog that needs the app's own rules (About); the `-color-*` tokens and `.button.danger` resolve from the theme either way | `Dialogs` |
| Text | The question in the content; a header only when the question needs a name over it. Counts as plurals, names in quotes, the consequence spelled out | `Actions.removeQuestion`, `confirm.remove.<kind>` |
| Strings | One key per kind, header and question both, tested to exist for every kind | `RemoveConfirm.Kind`, `RemoveConfirmTest` |

## Behavior

- **CONF-08 · SHOULD.** The question comes before anything changes, and the action runs only on the action button.
  - *Check (code):* the helper returns true on the action button alone, and the caller acts only on true.
  - *Reference:* Torrenta [`RemoveConfirm.ask`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java); Editora [`GitCoordinator.confirmDestructive`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitCoordinator.java).
- **CONF-09 · SHOULD.** One gesture asks one question. An action on many things asks once with the count ("Remove these
  3 torrents?", Torrenta's "Apply to many torrents" for a bulk command). Closing every tab asks per unsaved buffer,
  selecting each tab first so the user sees what the question is about, and remembers a Discard answer for exactly
  the state that was shown.
  - *Check (code):* a bulk command builds one question with a plural count; the close-all sweep selects each tab
    before it asks.
  - *Reference:* Torrenta [`Actions.removeQuestion`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Actions.java); Editora [`CloseCoordinator.confirmSweep`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CloseCoordinator.java).
- **CONF-10 · SHOULD.** A delete that cannot be undone says so; one that leaves the files says that instead.
  - *Check (code):* "This cannot be undone." appears only in the strings of actions that cannot be undone.
  - *Reference:* Editora `dialog.discard.tracked`; Torrenta `actions.removeQuestion.delete`.
- **CONF-11 · SHOULD.** A dangerous alternative (Force with Lease, Delete Anyway) is offered beside the safe one (Pull,
  then Push), in red, and only once the safe one has failed.
  - *Check (code):* the force path is reached only from the safe command's failure result.
  - *Reference:* Editora [`GitBranchCoordinator.offerAfterRejection`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitBranchCoordinator.java) (Force with Lease after a rejected push),
    `confirmForceDelete` (Delete Anyway after `NOT_FULLY_MERGED`).
- **CONF-12 · SHOULD.** The question can be tested without a screen: its words come from pure code, and a capture hook
  answers the dialog, so a UI test never presses a native button.
  - *Check (test):* a unit test covers the header and question for every kind, and UI tests set the capture answer.
  - *Reference:* Torrenta [`RemoveConfirm.header`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java), `question`, `answerForCapture`; [`RemoveConfirmTest`](https://github.com/adriandeleon/torrenta/blob/master/src/test/java/com/torrenta/ui/RemoveConfirmTest.java).

## Copy

| Key | English |
|---|---|
| `dialog.unsaved.title` / `dialog.unsaved.header` | Unsaved changes / Save changes to {0} before closing? |
| `dialog.save` / `dialog.discard` / `dialog.cancel` | Save / Discard / Cancel |
| `dialog.quit.header` / `dialog.quit.button` | Quit Editora? / Quit |
| `dialog.discard.tracked` | Discard all changes to "{0}"? This cannot be undone. |
| `dialog.discardAll.action` | Discard All |
| `dialog.deleteBranch.force` | Delete Anyway |
| `confirm.remove.feed.header` / `confirm.remove.feed` | Remove feed / Remove the feed “{0}” and its articles? The torrents already added stay. |
| `actions.removeQuestion.delete` | Remove this torrent and delete the downloaded files? This cannot be undone. |
| `window.remove.button.delete` / `common.remove` / `common.cancel` | Delete files / Remove / Cancel |
| `dialog.closeRunning` / `dialog.closeAnyway` (Termina) | Close this tab? / Close |

## In the apps

Editora asks for unsaved changes, Quit with busy terminals, pinned tabs, Git discards and branch deletions, and Local
History purges, all through `Alert` with named buttons. Torrenta's [`RemoveConfirm`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java) serves the torrent list, feeds,
rules, watched folders, search providers, engine profiles, categories, tags and saved views with one shape. Termina asks
before closing a tab with a running program and before a multi-line paste. Mirada's [`Confirm`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Confirm.java) asks before
removing a bookmark or discarding an edit, with a named red button; its trash is undoable. nux asks before a risky UPS
command with a named Run button and Cancel as the default, though not in red. Modula asks nothing: its preset chips
remove on one click, which this template says they should not.
