---
title: "QuickOpen picker"
description: "The family's list picker: the palette card with a title and a prompt, for choosing one thing from a list by typing."
---

<span class="lvl lvl-should">SHOULD</span> serve every "choose one from a list" moment: recent files, themes, keymaps,
a setting's values, a branch to compare with. It is the [Command Palette](../command-palette/) card with a title over
the field and a prompt in it, so a list choice is made the way a command is run: type a few letters, Enter. Reference:
Editora's `ui/QuickOpen.java` (one generic class, instantiated about sixty times), driven by `PickerKeys` and shown
by `OverlayHost`. The [keyboard page](../../keyboard/) states the rule; this page is the shape.

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
<li><span class="pin">1</span><span><strong>Title.</strong> The command that opened the picker ("Jump to Recent File", "Set App Theme"), bold 12 px in the muted colour. This is what tells the picker apart from the palette, which has no title.</span></li>
<li><span class="pin">2</span><span><strong>Query field</strong> with a prompt per picker: "Type to filter recent files…", "Type to filter themes…". The Emacs caret keys work in it (<code>TextInputKeymap.installShared</code>).</span></li>
<li><span class="pin">3</span><span><strong>Match highlight.</strong> The characters the fuzzy matcher scored, bold in the accent colour; the same <code>MatchText.runs</code> as the palette, so the highlight and the rank never disagree.</span></li>
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

## Behaviour

- **Open** from a command. The items are read fresh on every showing and snapshotted, so typing filters a stable
  list; a source that answers late (an outline the language server has not returned yet) calls `reload()`.
- **Nothing typed:** the supplier's own order, which is the meaningful one (recency for recent files, document
  order for symbols), with the current value pre-selected when there is one. **Typing** ranks by fuzzy score; ties keep
  their order so rows do not shuffle under the cursor between keystrokes.
- **Move:** the active keymap's line and page chords (`nav.lineDown`, `nav.pageUp`, …) plus ↑ ↓, Page Up/Down, Home and End,
  which always work. **Choose:** Enter, or a click on a row. The card hides first, then the choice runs, so focus is
  already back where it belongs.
- **Cancel:** Esc, `C-g`, or a click on the scrim. The host restores focus. A picker that previewed something
  undoes it.
- **Preview (MAY).** `setPreview(onPreview, onCancelled)` previews the highlighted row as the selection moves and
  undoes it on cancel: Recent Locations shows each place and returns to the origin on Esc. A preview without an undo
  is worse than none. Nothing is previewed for the row the picker opens on, only for one the user moved to. The theme
  and keymap pickers do not preview; they apply on Enter.
- **Row actions (MAY).** `addRowAction(key, legend, action)` acts on the highlighted row and keeps the picker open
  (the breakpoints picker enables or removes one), re-reading the list afterwards and keeping the cursor in place.
- **Empty list:** a placeholder sentence in the list (`setPlaceholder`), never a blank card.
- **One card at a time.** The host shows one card; opening a picker replaces whatever card was up.
- **Relatives.** The Open Files `Switcher` lists tabs in tab order, opens on the current one and closes a file with
  `C-d` or Backspace. `FileFinder` is the Emacs `find-file` field with Tab completion. `MultiSelectPicker` ticks
  several rows with Space where exactly one would be wrong. `BranchPopup` and `GitStashPopup` are sectioned pickers
  with their own actions. All of them use `PickerKeys`, so they move, accept and cancel alike.

## Uses

| App | Picked with it | Reference |
|---|---|---|
| Editora | Recent files (with file icons), recent locations (previewed), bookmarks, the structure outline, tool windows, open files, projects, keymap, app and editor theme, spell language, a setting's values (opened on the current value), branches, tags and commits to compare with, remotes, commit message history, the kill ring, Occur lines, external tools, macros, the debug main class, breakpoints, agent models | `NavigationCoordinator`, `EditorSettingsCoordinator`, `DiffCoordinator`, `DebugCoordinator`, `BreakpointsPicker` |
| Mirada | Go to bookmark…, Open recent folder…: the palette shown over a list of names with a detail per row and an "open" legend | `CommandPalette.Choices`, `ViewerWindow` |
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
