---
title: "QuickOpen picker"
description: "The family's list picker: the palette card with a title and a prompt, for choosing one thing from a list by typing."
---

The picker for every "choose one from a list" moment: recent files, themes, keymaps, a setting's values, a branch to
compare with. It is the [Command Palette](../command-palette/) card with a title over the field and a prompt in it, so
a list choice is made the way a command is run: type a few letters, Enter. The [keyboard page](../../keyboard/)
states the rule; this page is the shape.

## Rules

- **QOPEN-01 · SHOULD.** One picker serves every list choice: recent files, themes, keymaps, a setting's values, a
  branch to compare with.
  - *Check (code):* those choices are instances of one generic picker class; there is no second list-picker class or
    `ChoiceDialog` for them.
  - *Reference:* Editora [`ui/QuickOpen.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java) (one generic class, instantiated more than seventy times), driven by
    [`PickerKeys`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/PickerKeys.java).
- **QOPEN-02 · SHOULD.** The picker is the palette's card in the shared in-scene overlay host, with a title naming the
  command over the field and a prompt in the field; never a `javafx.stage.Popup`.
  - *Check (code):* the picker shows its card through the overlay host and sets a title and a prompt text.
  - *Reference:* Editora [`QuickOpen.setOverlayHost`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java), [`ui/OverlayHost.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/OverlayHost.java); the Spec table below.

## Anatomy

<div class="mock-stage scrim">
<div class="m-card m-palette m-qo" role="img" aria-label="Mockup of the Jump to Recent File picker with the query mai">
<div class="m-qo-title"><span class="pin">1</span> Jump to Recent File</div>
<div class="m-field focus m-qo-field"><span class="m-grow">mai<span class="m-caret"></span></span><span class="pin">2</span></div>
<div class="m-qo-list">
<div class="m-qo-row sel"><span class="pin out" style="left:-26px">4</span><span class="m-icon"></span><span class="t"><b>Mai</b>nController.java</span><span class="d">~/src/Editora/src/main/java/com/editora/ui</span><span class="pin">5</span></div>
<div class="m-qo-row"><span class="pin out" style="left:-26px">6</span><span class="m-icon"></span><span class="t"><b>Mai</b>nMenuBar.java</span><span class="d">~/src/Editora/src/main/java/com/editora/ui</span></div>
<div class="m-qo-row"><span class="m-icon"></span><span class="t"><b>m</b>ess<b>a</b>ges_<b>i</b>t.properties</span><span class="d">~/src/Editora/src/main/resources/com/editora/i18n</span><span class="pin">3</span></div>
<div class="m-qo-row"><span class="m-icon"></span><span class="t">Do<b>mai</b>n.java</span><span class="d">~/src/Editora/src/main/java/com/editora/lsp</span></div>
<div class="m-qo-row"><span class="m-icon"></span><span class="t"><b>m</b>irad<b>a</b>.css <span class="m-pill amber" style="padding:0 6px">unsaved</span></span><span class="d">~/src/Mirada/src/main/resources/com/mirada/styles</span></div>
</div>
<div class="hint"><span class="pin">7</span> ↵ select</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Title.</strong> The command that opened the picker ("Jump to Recent File", "Set App Theme"), bold 12 px in the muted color. This is what tells the picker apart from the palette, which has no title.</span></li>
<li><span class="pin">2</span><span><strong>Query field</strong> with a prompt per picker: "Type to filter recent files…", "Type to filter themes…". The Emacs caret keys work in it (<code>TextInputKeymap.installShared</code>).</span></li>
<li><span class="pin">3</span><span><strong>Match highlight.</strong> The characters the fuzzy matcher scored, bold in the accent color; the same <code>MatchText.runs</code> as the palette, so the highlight and the rank never disagree.</span></li>
<li><span class="pin">4</span><span><strong>Selected row.</strong> The first match, or with nothing typed the value in force when the picker knows it (<code>setCurrentItem</code>), so a settings picker opens on the current value.</span></li>
<li><span class="pin">5</span><span><strong>Detail</strong>, right-aligned and muted: the file's folder, a branch's upstream, "current". It gives way with an ellipsis; the title keeps its width and never wraps.</span></li>
<li><span class="pin">6</span><span><strong>Icon</strong> (optional, <code>setItemIcon</code>): a file-type glyph from <code>FileIcons</code>. A per-row class marks state (an unsaved buffer in amber).</span></li>
<li><span class="pin">7</span><span><strong>Key legend.</strong> "↵ select" plus any row action's key, rebuilt from the active keymap on every showing.</span></li>
</ol>

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | The palette's card in the shared in-scene `OverlayHost`, over the same scrim; never a `javafx.stage.Popup` | `QuickOpen.setOverlayHost`, `OverlayHost` |
| Width | 620 px; a picker may ask for its own width and a minimum number of rows (a registry browser with one entry still gets a roomy box) | `DEFAULT_WIDTH`, `setPreferredSize` |
| Rows | 26 px fixed cells; the list hugs its match count, at least 1 row, 12 before it scrolls | `CELL_HEIGHT`, `MAX_VISIBLE`, `resizeList` |
| Title | Bold 12 px, `-color-fg-muted`, over the field | `.command-palette .palette-title` |
| Row | Title as matched runs, an optional icon before it, the detail in the palette's muted right-detail style | `ItemCell`, `.keybinding` |
| Legend | 11 px muted under the list | `.command-palette .palette-hint` |
| Card | `-color-bg-overlay`, radius 12, 1 px `-color-border-default`, padding 6: the palette's | `.command-palette` |
| Ranking | `FuzzyMatch` over the search key (the label unless the picker names another, a note's body for instance); equal scores keep the supplier's order | `filter` |

## Behavior

- **QOPEN-03 · SHOULD.** The items are read fresh on every showing and snapshotted, so typing filters a stable list. A
  source that answers late (an outline the language server has not returned yet) calls `reload()`.
  - *Check (code):* `show` calls the items supplier; `reload` re-reads it and keeps the query.
  - *Reference:* Editora [`QuickOpen.show`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java), [`QuickOpen.reload`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java).
- **QOPEN-04 · SHOULD.** With nothing typed the list keeps the supplier's own order (recency for recent files, document
  order for symbols), with the current value pre-selected when there is one.
  - *Check (code):* the empty query passes the items through unsorted and selects the `setCurrentItem` value.
  - *Reference:* Editora [`QuickOpen.filter`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java), `setCurrentItem`.
- **QOPEN-05 · SHOULD.** Typing ranks by fuzzy score, and ties keep the supplier's order, so rows do not shuffle under
  the cursor between keystrokes.
  - *Check (code):* the sort's last tiebreak is the supplier's index.
  - *Reference:* Editora [`QuickOpen.filter`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java).
- **QOPEN-06 · SHOULD.** The active keymap's line and page chords (`nav.lineDown`, `nav.pageUp`, …) move the selection,
  as do ↑ ↓, Page Up/Down and `Ctrl+Home`/`Ctrl+End` (`Cmd` on macOS), which always work; plain Home and End stay
  with the field's caret. Enter or a click on a row chooses; the card hides first, then the choice runs, so focus is
  already back where it belongs.
  - *Check (code):* the accept path hides the card before it calls the choice handler.
  - *Reference:* Editora [`QuickOpen`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java) (`hide()` then `onChoose`), [`PickerKeys.resolve`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/PickerKeys.java).
- **QOPEN-07 · SHOULD.** Esc, `C-g` or a click on the scrim cancels, and the host restores focus. A picker that
  previewed something undoes it.
  - *Check (test):* a test previews a row, dismisses the picker and finds the preview undone.
  - *Reference:* Editora [`OverlayHost`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/OverlayHost.java) (`previousFocus`), [`QuickOpenPreviewFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/QuickOpenPreviewFxTest.java)
    (`dismissingRestoresWhatWasPreviewed`).
- **QOPEN-08 · MAY.** A picker previews the highlighted row as the selection moves and undoes the preview on cancel
  (Recent Locations shows each place and returns to the origin on Esc). A preview without an undo is worse than none,
  and nothing is previewed for the row the picker opens on, only for one the user moved to. The theme and keymap
  pickers do not preview; they apply on Enter.
  - *Check (test):* opening previews nothing, moving previews, choosing does not restore.
  - *Reference:* Editora [`QuickOpen.setPreview(onPreview, onCancelled)`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java), [`QuickOpenPreviewFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/QuickOpenPreviewFxTest.java).
- **QOPEN-09 · MAY.** A row action acts on the highlighted row and keeps the picker open (the breakpoints picker
  enables or removes one), re-reading the list afterwards and keeping the cursor in place.
  - *Check (test):* a row action runs on the highlighted row and the picker stays up.
  - *Reference:* Editora [`QuickOpen.addRowAction(key, legend, action)`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java), [`QuickOpenPreviewFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/QuickOpenPreviewFxTest.java)
    (`aRowActionActsOnTheHighlightedRowAndKeepsThePickerOpen`).
- **QOPEN-10 · SHOULD.** A picker that can open on an empty list shows a placeholder sentence in it, never a blank
  card. A picker with nothing to offer may instead say so in the status line and not open.
  - *Check (code):* each picker whose source can be empty either calls `setPlaceholder` or returns before `show` with
    a status message.
  - *Reference:* Editora [`QuickOpen.setPlaceholder`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java) ([`BreakpointsPicker`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/BreakpointsPicker.java)); [`NavigationCoordinator`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/NavigationCoordinator.java)
    (`status.nav.noRecentLocations`).
- **QOPEN-11 · SHOULD.** The host shows one card at a time; opening a picker replaces whatever card was up.
  - *Check (code):* the host's `show` removes the previous card before it adds the new one, and keeps the original
    focus owner.
  - *Reference:* Editora [`OverlayHost.show`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/OverlayHost.java).
- **QOPEN-12 · SHOULD.** The picker's relatives move, accept and cancel with the same keys as the picker.
  - *Check (code):* each relative maps its keys through `PickerKeys`.
  - *Reference:* Editora [`Switcher`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Switcher.java), [`FileFinder`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FileFinder.java), [`MultiSelectPicker`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MultiSelectPicker.java), [`BranchPopup`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/BranchPopup.java), [`GitStashPopup`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitStashPopup.java).

The relatives: the Open Files `Switcher` lists tabs in tab order, opens on the current one and closes a file with
`C-d` or Backspace. `FileFinder` is the Emacs `find-file` field with Tab completion. `MultiSelectPicker` ticks several
rows with Space where exactly one would be wrong. `BranchPopup` and `GitStashPopup` are sectioned pickers with their
own actions.

## Uses

| App | Picked with it | Reference |
|---|---|---|
| Editora | Recent files (with file icons), recent locations (previewed), bookmarks, the structure outline, tool windows, open files, projects, keymap, app and editor theme, spell language, a setting's values (opened on the current value), branches, tags and commits to compare with, remotes, commit message history, the kill ring, Occur lines, external tools, macros, the debug main class, breakpoints, agent models | [`NavigationCoordinator`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/NavigationCoordinator.java), [`EditorSettingsCoordinator`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/EditorSettingsCoordinator.java), [`DiffCoordinator`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DiffCoordinator.java), [`DebugCoordinator`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DebugCoordinator.java), [`BreakpointsPicker`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/BreakpointsPicker.java) |
| Mirada | Go to bookmark…, Open recent folder…: the palette shown over a list of names with a detail per row and an "open" legend | [`CommandPalette.Choices`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/CommandPalette.java), [`ViewerWindow`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/ViewerWindow.java) |
| Termina, Torrenta, Modula, nux | Commands only; profiles and other lists are menus or combo boxes today | `CommandPalette` in each |

## Copy

| Key | English |
|---|---|
| `nav.recentFiles.title` / `.prompt` | Jump to Recent File / Type to filter recent files… |
| `palette.theme.appTitle`, `palette.theme.editorTitle` / `palette.theme.prompt` | Set App Theme, Set Editor Theme / Type to filter themes… |
| `command.keymap.select` / `palette.keymap.prompt` | Keymap: Select… / Type to filter keymaps… |
| `palette.setting.pick` | Type to filter… |
| `pickerKeys.select`, `pickerKeys.open`, `pickerKeys.cancel` | {0} select, {0} open, {0} cancel |
| `switcher.header` | Open Files |

A title names the command; a prompt starts with "Type to filter" and ends with an ellipsis. A placeholder says what is
missing and what to do ("No breakpoints set. Click a line number to add one.").

## In the apps

![Editora's keymap picker](../../../assets/shots/editora-keymaps.png "Editora: Keymap: Select… over the editor, the title above the field.")
![Editora's palette filtered to kill commands with Emacs chords](../../../assets/shots/editora-emacs.png "The palette the picker is built from.")
