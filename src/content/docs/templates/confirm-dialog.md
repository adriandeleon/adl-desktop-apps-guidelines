---
title: "Confirm dialog"
description: "The family's question before a destructive action: it names the thing, the button names the action in red, and Escape cancels."
---

One question before anything the user made is removed, deleted, discarded or overwritten, asked the same way
everywhere: the text names the thing and what happens to it, the confirming button is the action's own verb in red,
and Cancel is the way out and the default button. An action that can be taken back needs no question
([CONF-01](#conf-01), [CONF-07](#conf-07)).

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
  OK or Yes, in the `danger` style. The question's buttons are `ButtonType`s named from the catalog, never JavaFX's
  stock OK, Yes or Cancel, which are worded in the JVM's locale.
  - *Why:* a stock button is labeled from JavaFX's own resources, in the JVM's locale, so under menus in the language
    chosen in Settings a question can still say "Cancel" in another.
  - *Check (code):* the action's `ButtonType` is named from the catalog and its button gets the `danger` style class;
    no confirmation passes `ButtonType.OK`, `ButtonType.YES` or `ButtonType.CANCEL`, or keeps the buttons an `Alert`
    of type `CONFIRMATION` comes with, which are those.
  - *Reference:* Torrenta [`RemoveConfirm.ask`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java) meets it: the action is named from the catalog and styled `danger`,
    and Cancel comes from its [`StockButtons`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/StockButtons.java) (`cancel()`, the catalog's word on the `CANCEL_CLOSE` role). Termina's
    [`ui/Confirm.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Confirm.java), Mirada's [`ui/Confirm.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Confirm.java) and the app template's [`ui/Confirm.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Confirm.java) name both buttons from
    the catalog too. Editora does not meet it yet: [`GitCoordinator.confirmDestructive`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitCoordinator.java),
    [`MainController.styleUnsavedChangesButtons`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java) and `styleQuitButtonAsDanger` name and style the action, but more than twenty of its
    confirmations still offer the stock OK and Cancel, and others name the action beside a stock `ButtonType.CANCEL`,
    its Git confirmations ([`ui/GitCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitCoordinator.java)) among them. nux's risky-command question names Run beside a stock
    `ButtonType.CANCEL` ([`ui/CommandConfirmation.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/CommandConfirmation.java)).
- **CONF-04 · MUST.** Cancel is the way out: Escape and the window's close button both answer Cancel, and nothing is
  lost on a dismissal.
  - *Check (code):* Cancel has the `CANCEL_CLOSE` role, and the result defaults to Cancel when the dialog closes any
    other way (`showAndWait().orElse(cancel)`).
  - *Reference:* Editora [`GitCoordinator.confirmDestructive`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitCoordinator.java), [`CloseCoordinator.unsavedAlert`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CloseCoordinator.java); Torrenta
    [`RemoveConfirm.ask`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java).
- **CONF-13 · MUST.** Every question has one default button, and it is never a `danger` button: Cancel where the only
  action is destructive, Save where saving is an option ([CONF-05](#conf-05)). The dialog opens with keyboard focus
  on it, so Enter keeps what the user has, on every OS, and the red action runs only from its own button.
  - *Why:* Enter is the key a hurried hand presses, and Escape already cancels ([CONF-04](#conf-04)): with Cancel as
    the default, no single key destroys anything. JavaFX makes a button with the `OK_DONE` role the default by
    itself, so a named action is the default unless the dialog says otherwise. It also presses a focused button on
    Enter on Windows and Linux but not on macOS, so a question with no default button answers Enter differently on
    each OS.
  - *Check (code):* the confirmation helper calls `setDefaultButton(false)` on the action and
    `setDefaultButton(true)` on Cancel, or on Save in the unsaved-changes question; no dialog leaves a `danger`
    button, or no button at all, as the default.
  - *Reference:* Termina [`ui/Confirm.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Confirm.java) (`Options.cancelIsDefault`, which its close-running-program question sets) and nux
    [`ui/CommandConfirmation.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/CommandConfirmation.java) (a risky UPS command). Editora's Git confirmations, Torrenta's `RemoveConfirm`,
    Mirada's `Confirm`, the app template's `Confirm` and Termina's removals leave the red action as the default, so
    Enter runs it; Editora's unsaved-changes and Quit questions have no default button.

## Anatomy

<div class="mock-stage">
<div class="m-card m-cf" role="img" aria-label="Mockup of the Remove and delete files question">
<div class="titlebar">Remove and delete files <span class="pin">1</span></div>
<div class="m-cf-header">Remove and delete files <span class="pin">2</span></div>
<div class="m-cf-text">Remove these 3 torrents and delete the downloaded files? This cannot be undone. <span class="pin">3</span></div>
<div class="m-cf-buttons"><span class="pin">5</span><span class="m-btn primary">Cancel</span><span class="m-btn danger">Delete files</span><span class="pin">4</span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Window title</strong>: a short name for the question ("Remove feed", "Unsaved changes"). Torrenta's header repeats it; Editora's unsaved-changes question has the question itself as its header ("Save changes to Main.java before closing?"). A plain confirmation, no icon in the title and no app name.</span></li>
<li><span class="pin">2</span><span><strong>Header</strong>, when the question is long enough to need one. Editora's Git confirmations set none and put the whole message in the content; Torrenta's header names the action and the content asks the question.</span></li>
<li><span class="pin">3</span><span><strong>The question names the thing and the consequence.</strong> How many ("these 3 torrents", a <code>{0,choice,…}</code> plural), which one ("the feed “Linux ISOs” and its articles"), what stays ("The downloaded files stay on disk."), and "This cannot be undone." only when it is true. Termina's multi-line paste shows the text itself in an expandable area, so the decision is made on what will be sent.</span></li>
<li><span class="pin">4</span><span><strong>The action button</strong> carries the action's verb (Delete files, Remove, Discard, Quit, Close), never OK or Yes, and the <code>danger</code> style: red, not the accent. It sits to the right of Cancel on every OS, and it is never the default button.</span></li>
<li><span class="pin">5</span><span><strong>Cancel</strong>, in the catalog's word, with the <code>CANCEL_CLOSE</code> role: Escape and the window's close button both answer Cancel. It is the default button, so it wears the accent, holds the focus when the dialog opens, and Enter answers it too.</span></li>
</ol>

## States

<div class="mock-stage">
<div class="m-states">
<div class="m-state m-cf-state"><div class="cap">Unsaved changes</div><div class="q">Save changes to Main.java before closing?</div><div class="row"><span class="m-btn">Cancel</span><span class="m-btn success">Save</span><span class="m-btn danger">Discard</span></div></div>
<div class="m-state m-cf-state"><div class="cap">Remove, files kept</div><div class="q">Remove this torrent? The downloaded files stay on disk.</div><div class="row"><span class="m-btn primary">Cancel</span><span class="m-btn danger">Remove</span></div></div>
<div class="m-state m-cf-state"><div class="cap">A program is running</div><div class="q">Close this tab? <span class="m-muted">bash (top) is still running. Closing will end it.</span></div><div class="row"><span class="m-btn primary">Cancel</span><span class="m-btn danger">Close</span></div></div>
<div class="m-state m-cf-state"><div class="cap">Undo instead of a question</div><div class="m-statusbar" style="border:1px solid var(--m-border);border-radius:6px"><span class="echo">Undo  Removed Ubuntu ISO</span><span class="m-chip">C-z</span></div></div>
</div>
</div>

- **CONF-05 · SHOULD.** When saving is an option the question has three answers, drawn in this order: Cancel, Save
  (the `success` style, green) and Discard (`danger`), with Cancel to the left of the actions as in every dialog
  ([WIN-11](../../window-shell/#win-11)). A Save that fails leaves the tab open.
  - *Check (code):* the unsaved-changes alert draws Cancel, Save and Discard in that order, on the `ButtonBar`'s one
    fixed order and not the order its `ButtonType`s were added in, and styles Save and Discard.
  - *Reference:* Editora [`CloseCoordinator.unsavedAlert`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CloseCoordinator.java), [`MainController.styleUnsavedChangesButtons`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java), for
    the three answers and their styles; it still draws them Save, Discard, Cancel.
- **CONF-06 · SHOULD.** A question about ending a running program, which is not the user's data, words the button
  Close, in the `danger` style like every confirming button ([CONF-03](#conf-03)). Cancel is its default button, as
  in every question with a red action ([CONF-13](#conf-13)), so dismissing the dialog by any route keeps the program
  alive.
  - *Check (code):* the close-running-program alert names its action Close and gives it the `danger` style class.
  - *Reference:* Termina [`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java) (`dialog.closeAnyway`), through [`ui/Confirm.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Confirm.java).
- **CONF-07 · SHOULD.** Where the action can be taken back, the app asks nothing and offers Undo instead.
  - *Check (by hand):* close a clean tab and reopen it with Reopen Closed Tab; in Mirada, trash an image and undo.
  - *Reference:* Mirada moves an image to the trash at once and offers Undo; Torrenta asks before removing a torrent
    but also keeps the removal on its undo stack for ten minutes ([`UndoStack.KEEP_MS`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/UndoStack.java)); Editora [`ClosedTabs`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ClosedTabs.java).

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | `Alert(CONFIRMATION)` owned by the window (`initOwner`), shown with `showAndWait`; the answer defaults to Cancel when the dialog is closed any other way | `GitCoordinator.confirmDestructive`, `RemoveConfirm.ask` |
| Buttons | A `ButtonType` with the action's name and the `OK_DONE` role, and Cancel with `CANCEL_CLOSE`, both named from the catalog ([CONF-03](#conf-03)). Drawn in one fixed order on every OS, Cancel first ([WIN-11](../../window-shell/#win-11)) | `RemoveConfirm.ask`, Torrenta's [`StockButtons`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/StockButtons.java) |
| Action button | `danger` style class: the theme's `.button.danger` fills it `-color-danger-emphasis` with emphasis text. Save in the unsaved question: `success` | `MainController.styleUnsavedChangesButtons`, `styleQuitButtonAsDanger` |
| Default button | Cancel, or Save in the unsaved-changes question ([CONF-13](#conf-13)): `setDefaultButton(true)` on it and `setDefaultButton(false)` on the action, because JavaFX makes an `OK_DONE` button the default by itself. Termina's close-running-program question and nux's risky-command question do it. In Editora's Git confirmations, Torrenta's Remove and Mirada's `Confirm` the red action is still the default and Enter runs it; Editora's unsaved-changes and Quit questions give their buttons no role, so they have no default | Termina [`Confirm`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Confirm.java), nux [`CommandConfirmation`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/CommandConfirmation.java) |
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
History purges through `Alert` with named buttons. Not all of its questions do yet: more than twenty other confirmations still offer
JavaFX's stock OK and Cancel, among them the Project panel's file delete ([`ui/ProjectPanel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ProjectPanel.java), `confirmDelete`)
and Replace in Files ([`ui/SearchCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SearchCoordinator.java)), which [CONF-03](#conf-03) does not allow, and 19 more, the Git
confirmations among them, name the action but keep JavaFX's stock Cancel. Torrenta's [`RemoveConfirm`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RemoveConfirm.java) serves the
torrent list, feeds, rules, watched folders, search providers, engine profiles, categories, tags and saved views with
one shape. Termina asks before closing a tab with a running program and before a multi-line paste. Mirada's
[`Confirm`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Confirm.java) asks before removing a bookmark or discarding an edit, with a named red button; its trash is undoable. nux
asks before a risky UPS command with a named Run button and Cancel as the default, though not in red, and its Cancel
is JavaFX's stock one. Modula asks nothing: its preset chips remove on one click, which this template says they should
not.
