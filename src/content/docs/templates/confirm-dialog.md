---
title: "Confirm dialog"
description: "The family's question before a destructive action: it names the thing, the button names the action in red, and Escape cancels."
---

<span class="lvl lvl-must">MUST</span> before anything the user made is removed, deleted, discarded or overwritten,
unless the action can be taken back instead (see [Window shell](../../window-shell/)). One question, asked the same
way everywhere: the text names the thing and what happens to it, the confirming button is the action's own verb in
red, and Cancel is the way out. Reference: Editora's `ui/CloseCoordinator.java` (unsaved changes, Quit) and
`GitCoordinator.confirmDestructive`; Torrenta's `ui/RemoveConfirm.java` asks it for the torrent list, the RSS tab and
every list in Settings.

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
<li><span class="pin">4</span><span><strong>The action button</strong> carries the action's verb (Delete files, Remove, Discard, Quit, Close), never OK or Yes, and the <code>danger</code> style: red, not the accent. It is the dialog's one coloured button.</span></li>
<li><span class="pin">5</span><span><strong>Cancel</strong>, in the catalogue's word, with the <code>CANCEL_CLOSE</code> role: Escape and the window's close button both answer Cancel.</span></li>
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

- **Three answers** when saving is an option: Save (the `success` style, green), Discard (`danger`) and Cancel, in
  that order. Save that fails leaves the tab open.
- **A running program** is not the user's data, so Termina words the button Close and makes Cancel the default
  button: dismissing the dialog by any route keeps the program alive.
- **No question at all** where the action can be taken back. Mirada moves an image to the trash at once and offers
  Undo; Torrenta asks before removing a torrent but also keeps the removal on its undo stack for ten minutes; closing a
  clean tab asks nothing and Reopen Closed Tab brings it back.

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | `Alert(CONFIRMATION)` owned by the window (`initOwner`), shown with `showAndWait`; the answer defaults to Cancel when the dialog is closed any other way | `GitCoordinator.confirmDestructive`, `RemoveConfirm.ask` |
| Buttons | A `ButtonType` with the action's name and the `OK_DONE` role, and Cancel with `CANCEL_CLOSE` from the catalogue, never JavaFX's stock OK and Cancel, which are worded in the JVM's locale | `RemoveConfirm.ask`, Torrenta's `StockButtons` |
| Action button | `danger` style class: the theme's `.button.danger` fills it `-color-danger-emphasis` with emphasis text. Save in the unsaved question: `success` | `MainController.styleUnsavedChangesButtons`, `styleQuitButtonAsDanger` |
| Default button | The action, where it has the `OK_DONE` role (Editora's Git confirmations, Torrenta's Remove): Enter runs it, and red is what says so. Editora's unsaved-changes and Quit questions give their buttons no role, so Enter does nothing. Termina's close-running-program question makes Cancel the default | `confirmDestructive`, `CloseCoordinator.unsavedAlert`, Termina `TerminalWindow` |
| Font | The UI font sheet attached to the dialog pane, because a dialog is its own scene and inherits nothing from the window | Torrenta `Fonts.installUiFont(DialogPane)`, Editora `App.installUiFont` (every window) |
| Stylesheet | `Dialogs.styled` adds `app.css` to a dialog that needs the app's own rules (About); the `-color-*` tokens and `.button.danger` resolve from the theme either way | `Dialogs` |
| Text | The question in the content; a header only when the question needs a name over it. Counts as plurals, names in quotes, the consequence spelled out | `Actions.removeQuestion`, `confirm.remove.<kind>` |
| Strings | One key per kind, header and question both, tested to exist for every kind | `RemoveConfirm.Kind`, `RemoveConfirmTest` |

## Behaviour

- **Ask before, not after.** The question comes before anything changes; the removal runs only on the action button
  (`RemoveConfirm.ask` returns true on that button alone).
- **Ask once per gesture.** An action on many things asks one question with the count ("Remove these 3 torrents?",
  Torrenta's "Apply to many torrents" for a bulk command). Closing every tab asks per unsaved buffer, selecting each
  tab first so the user sees what the question is about, and remembers a Discard answer for exactly the state that was
  shown (`CloseCoordinator.confirmSweep`).
- **Escape cancels**, as does closing the dialog. Nothing is lost on a dismissal.
- **Say what it costs.** A delete that cannot be undone says so; one that leaves the files says that instead. A
  dangerous alternative (Force with Lease, Delete Anyway) is offered beside the safe one (Pull, then Push), red, and
  only when the safe one has already failed.
- **Testable without a screen.** The question's words come from pure code (`RemoveConfirm.header`, `question`) and
  the capture hook answers the dialog through `answerForCapture`, so a UI test never has to press a native button.

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
History purges, all through `Alert` with named buttons. Torrenta's `RemoveConfirm` serves the torrent list, feeds,
rules, watched folders, search providers, engine profiles, categories, tags and saved views with one shape. Termina asks
before closing a tab with a running program and before a multi-line paste. Mirada and Modula ask nothing: Mirada's
trash is undoable, and Modula's preset chips remove on one click, which this template says they should not.
