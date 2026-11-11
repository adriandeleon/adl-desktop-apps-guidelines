---
title: "Command Palette"
description: "The family's command palette: a 620 px in-scene card that finds and runs any command from the keyboard."
---

One palette per main window lists every registered command, so a command that exists is a command people can find. The
pure parts (`FuzzyMatch`, `MatchText`, the key helper, `PickerKeys` in Editora and `PaletteKeys` in the copies, and the
caret-key helper, `TextInputKeymap` in Editora and `TextInputKeys` in the copies) are shared with Termina and Mirada.
Torrenta shares [`MatchText`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MatchText.java) and ranks with its own [`CommandMatcher`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/CommandMatcher.java).

## Rules

- **PAL-01 · MUST.** Every app has a Command Palette, one in each main window, opened by the `palette.show` command.
  A Settings, About or log window needs none of its own. Its chords, `M-x` in the Emacs keymap and `Ctrl+Shift+P`
  (`Cmd+Shift+P` on macOS) in the others (`Ctrl+Shift+A` allowed in the IntelliJ keymap), are
  [KBD-05](../../keyboard/#kbd-05).
  - *Check (code):* each main window builds one palette, and the command registered as `palette.show` opens it (in
    Editora the window controller builds one `CommandPalette`). A window that is not a main window (Settings,
    About, a log, a history or events window) is not judged.
  - *Reference:* Editora [`ui/CommandPalette.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java), built once in [`MainController`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java).
- **PAL-02 · MUST.** The palette lists every registered command, with its title and description
  ([KBD-03](../../keyboard/#kbd-03)).
  - *Check (code):* the palette's rows come from the whole registry, filtered only by the query; a command that
    cannot run stays listed, grayed; each row shows its command's title; and the palette shows the description of
    the command under the cursor, in the row or in a line of the card. A palette that shows no description fails
    this rule; that every command has one is [KBD-03](../../keyboard/#kbd-03)'s.
  - *Reference:* Editora [`CommandPalette.filter`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java) (`registry.all()`), [`MessagesTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/i18n/MessagesTest.java); the page's [Spec](#spec).
    Torrenta's, Modula's and nux's palettes don't yet. Torrenta's lists only the commands that can run now: `show` in
    [`ui/CommandPalette.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/CommandPalette.java) drops every disabled command, after `offeredCommands` in [`ui/MainWindow.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java) has
    dropped what the engine cannot run and what Simple mode hides; and it shows no description, since its
    [`Command`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Command.java) has none. Modula's leaves out one (`stereo`, while its
    control is disabled, in [`ui/RadioPane.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/RadioPane.java)), and its rows show a title and a shortcut, with no description
    ([`ui/CommandPalette.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/CommandPalette.java)). nux's lists its whole registry, and each row shows the title and the
    command's id, with no description: its commands have none ([`ui/CommandPalette.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/CommandPalette.java), `CommandCell`;
    [`command/CommandRegistry.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/command/CommandRegistry.java)).

- **PAL-10 · SHOULD.** The palette is 620 px wide, its rows 36 px high with 8 visible before the list scrolls, at
  the default zoom ([WIN-12](../../window-shell/#win-12)), and its field's prompt reads "Run command…", in words
  from the catalog (Editora's key for them is `palette.prompt`).
  - *Why:* the palette is the one window every app shares; a different width or prompt is the first thing a person
    moving between apps notices.
  - *Check (code):* the palette's width, row height and visible rows come from constants of these values, and its
    prompt is read from the catalog, where the English is "Run command…". The rule asks for the words, not for a
    catalog key.
  - *Reference:* Editora [`ui/CommandPalette.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java) (`ROW_HEIGHT`, `VISIBLE_ROWS`), Torrenta,
    Termina and the app template's [`ui/Picker.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Picker.java). Mirada's [`ui/CommandPalette.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/CommandPalette.java) matches the three
    sizes and reads the same words from the catalog under another key, `palette.runCommandPrompt`. Modula's is
    420 px with a literal "Type a command…", and nux's 540 px with a `palette.prompt` that reads "Type a command…".

The palette is an in-scene overlay in the window's root `StackPane`, over a faint scrim, never a
`javafx.stage.Popup`: [KBD-07](../../keyboard/#kbd-07).

## Anatomy

<div class="mock-stage scrim">
<div class="m-card m-palette" role="img" aria-label="Mockup of the command palette with the query git">
<div class="input-row"><span class="pin">1</span><span class="m-chip">M-x</span><span class="m-grow">git<span class="m-caret"></span></span><span class="pin">2</span></div>
<div class="list">
<div class="cmd sel"><span class="pin out" style="left:-26px">4</span><span class="m-grow"><b>Git</b>: Pull</span><span class="m-chip">C-x v S-=</span><span class="pin">5</span></div>
<div class="cmd"><span class="m-grow"><b>Git</b>: Push</span><span class="m-chip">C-x v S-p</span></div>
<div class="cmd"><span class="m-grow"><b>Git</b>: Fetch</span></div>
<div class="cmd"><span class="pin out" style="left:-26px">3</span><span class="m-grow"><b>Git</b>: Commit…</span><span class="m-chip">C-x g</span></div>
<div class="cmd"><span class="m-grow"><b>Git</b>: Pull (Rebase)</span></div>
<div class="cmd off"><span class="pin out" style="left:-26px">6</span><span class="m-grow"><b>Git</b>: Continue Merge / Rebase / Cherry-Pick</span><div class="m-tip">Unavailable — no merge, rebase, cherry-pick or revert is in progress.</div></div>
<div class="cmd"><span class="m-grow"><b>Git</b>: Stage All Changes</span></div>
<div class="cmd"><span class="m-grow"><b>Git</b>: Switch Branch…</span></div>
</div>
<div class="desc"><span class="pin">7</span> Pull and merge changes from the remote.</div>
<div class="hint"><span class="pin">8</span> ↑↓ / C-n C-p move · ↵ run · C-h docs · Esc / C-g cancel</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Opener chip.</strong> The chord that opened the palette, read from the active keymap. No chip when the user has unbound it, never a wrong one.</span></li>
<li><span class="pin">2</span><span><strong>Query field.</strong> The first row is the input; there is no title. Prompt "Run command…". Emacs caret keys work inside it.</span></li>
<li><span class="pin">3</span><span><strong>Match highlight.</strong> The characters the fuzzy matcher scored, bold in the accent color. The highlight and the ranking come from the same call, so they never disagree.</span></li>
<li><span class="pin">4</span><span><strong>Selected row.</strong> Tinted background plus a 2 px accent bar on its inside edge. The bar is what makes the selection readable in a long list.</span></li>
<li><span class="pin">5</span><span><strong>Key chip.</strong> The command's binding in the active keymap, in the keyboard color (brace periwinkle). Absent when unbound.</span></li>
<li><span class="pin">6</span><span><strong>Unavailable command.</strong> Listed, grayed, never selected and inert to clicks. Its tooltip says why and what to do ("Unavailable — no merge, rebase, cherry-pick or revert is in progress.").</span></li>
<li><span class="pin">7</span><span><strong>Description.</strong> The selected command's <code>command.&lt;id&gt;.desc</code>, one line with an ellipsis, always one line tall so the card never jumps.</span></li>
<li><span class="pin">8</span><span><strong>Key legend.</strong> The palette's own keys, rendered from the active keymap. The mockup shows the Emacs keymap's: <code>C-n</code>, <code>C-p</code> and <code>C-g</code> are its line and cancel chords (<a href="#pal-06">PAL-06</a>, <a href="#pal-07">PAL-07</a>).</span></li>
</ol>

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | In-scene overlay in the window's root `StackPane`, over a faint scrim. **Not** a `javafx.stage.Popup`: on Windows a popup does not reliably take keyboard focus. | `OverlayHost` |
| Width | 620 px ([PAL-10](#pal-10)) | `content.setPrefWidth(620)` |
| Rows | 36 px high, 8 visible before the list scrolls ([PAL-10](#pal-10)) | `ROW_HEIGHT`, `VISIBLE_ROWS` |
| Card | `-color-bg-overlay`, 1 px `-color-border-default`, radius 12, padding 6, one wide drop shadow | `.command-palette` in `app.css` |
| Row text | 12.5 px; padding 7 × 16 | `.command-palette .list-cell` |
| Scrim | `rgba(0,0,0,0.18)`, the value of a token defined on `.root` ([ICON-08](../../icons-and-color/#icon-08)); a click on it closes the palette | `.overlay-backdrop` |
| Content | Every registered command: title from `command.<id>`, description from `command.<id>.desc` | `CommandRegistry`, `MessagesTest` |
| Ranking | Editora scores the title; when the title does not match, the id's namespace word (`markdown` for `markdown.tableAddRow`, "Table: Add Row"), then the names other IDEs give the command. The description is shown, not matched. A query that names a title outranks a fuzzy hit. The app template scores the title and the description | `FuzzyMatch`, `Command.keywords`, `OtherIdeNames`, `titlePhraseScore`; the template's [`ui/Picker.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Picker.java) |

## Behavior

- **PAL-04 · SHOULD.** Every open starts with an empty query: the palette does not keep the last one, so it opens
  on the whole list ([PAL-02](#pal-02)).
  - *Check (code):* `show` clears the field and filters on the empty query before the card appears.
  - *Reference:* Editora [`CommandPalette.show`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java).
- **PAL-05 · SHOULD.** Typing in the palette filters its list, and the first *enabled* match is selected.
  - *Check (code):* after each filter the palette selects the first row whose command can run, stepping over
    disabled rows at the top (Editora's `selectFirstEnabled`). A test that asserts it, with a disabled command at
    the top, is the surest evidence.
  - *Reference:* Editora [`CommandPalette.selectFirstEnabled`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java), [`CommandPaletteDisabledFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/CommandPaletteDisabledFxTest.java).
- **PAL-06 · SHOULD.** The active keymap's line and page chords move the selection, as do ↑ ↓ and Page Up/Down,
  which always work. In Editora they are the chords of its `nav.lineDown`, `nav.lineUp`, `nav.pageDown` and
  `nav.pageUp` commands, `C-n` and `C-p` among them in the Emacs keymap. Enter, or a click on an enabled row, runs
  the command. The palette closes first, then the command runs.
  - *Check (code):* the palette's key handler looks a press up in the active keymap and moves on the commands it
    binds for a line and a page up and down, not on fixed letters, and on ↑ ↓ and Page Up/Down whatever the keymap;
    the run path hides the card before it calls the registry, and does nothing on a disabled row.
  - *Reference:* Editora [`CommandPalette.runSelected`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java), [`PickerKeys.resolve`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/PickerKeys.java), the only palette that asks the
    keymap. The others move on fixed keys: the app template's [`ui/Picker.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Picker.java) on the arrows, the page keys and
    `Ctrl+N` and `Ctrl+P` whatever the keymap; Termina's [`ui/PaletteKeys.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/PaletteKeys.java) and Mirada's [`ui/PaletteKeys.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/PaletteKeys.java) on a
    fixed table of Emacs chords beside them (`EMACS`: `C-n`, `C-p`, `C-v`, `M-v`); Torrenta's
    [`ui/CommandPalette.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/CommandPalette.java) (`onKey`) on the arrows and `Ctrl+N` and `Ctrl+P`, with no page keys; Modula's
    [`ui/CommandPalette.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/CommandPalette.java) and nux's [`ui/CommandPalette.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/CommandPalette.java) on the arrows alone.
- **PAL-07 · SHOULD.** The active keymap's cancel chord, Esc or a click on the scrim cancels the palette, and focus
  returns to where it was. In Editora the chord is that of its `edit.cancel` command, `C-g` in the Emacs keymap.
  - *Check (code):* Esc, the chord the active keymap binds to the cancel command, and a press on the backdrop all
    hide the overlay, and hiding focuses the node that had focus before it opened. In an app with one key table (a
    terminal app's keymap, or the built-in table of an app that ships no keymap files), the chord is the one that
    table binds to a cancel command; where it binds none, Esc and the backdrop are all there is to test.
  - *Reference:* Editora [`PickerKeys`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/PickerKeys.java) (`isCancel`), [`OverlayHost`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/OverlayHost.java) (`previousFocus`), and the app template's [`ui/OverlayHost.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/OverlayHost.java) (`cancelOn`, which
    [`ui/MainWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/MainWindow.java) hands the keymap's `edit.cancel` chord, `C-g` in its Emacs keymap, and `hide`, which gives the
    focus back): the two that ask the keymap for the chord. `Ctrl+G` is fixed in the `EMACS` table
    of Termina's [`ui/PaletteKeys.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/PaletteKeys.java) and Mirada's [`ui/PaletteKeys.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/PaletteKeys.java). Torrenta's, Modula's and nux's
    palettes cancel on Esc and on a press on the backdrop: none of the three apps has a keymap or a cancel command, so the
    chord asks nothing more of them.
- **PAL-08 · SHOULD.** In the palette, a help chord opens the selected command's page in the docs on the website,
  for the running version. The chord is the first of `Ctrl+H`, `F1` and `Shift+F1` that the active keymap leaves
  free. It is the same on macOS, where `Ctrl+H` is the Control key and has no `Cmd` form (`C-h` in Emacs notation).
  - *Check (code):* the palette's help chord is the first of the three that the active keymap neither binds nor
    starts a longer chord with, and the URL it opens is built from the app's versioned docs address and the
    selected command's id.
  - *Reference:* Editora [`CommandPalette`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java) ([`PickerKeys.freeChord`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/PickerKeys.java) over `C-h`, `f1` and `S-f1`; `docsUrl`), [`AppInfo.docsUrl`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/AppInfo.java).
    No other app's palette has a help chord yet.
- **PAL-09 · SHOULD.** A live keymap switch re-renders the palette's key chips, its opener chip and its key legend.
  - *Check (code):* applying a new keymap calls the palette's rebind method, which rebuilds the opener, the legend and
    the rows.
  - *Reference:* Editora [`CommandPalette.refreshBindings`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java), called from [`SettingsReapply`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsReapply.java).

## Copy

| Key | English |
|---|---|
| `palette.prompt` | Run command… |
| `palette.disabled.<reason>` | Unavailable — *what is missing*. *What to do first.* |

## In the apps

![Editora's command palette filtered to Git commands](../../../assets/shots/editora-palette.png "Editora.")
![Torrenta's command palette listing torrent actions with shortcuts](../../../assets/shots/torrenta-palette.png "Torrenta.")
![Termina's command palette over a terminal listing tab commands](../../../assets/shots/termina-palette.png "Termina.")
