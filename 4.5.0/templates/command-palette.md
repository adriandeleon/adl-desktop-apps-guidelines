# Command Palette

> The family's command palette: a 620 px in-scene card that finds and runs any command from the keyboard.

Pauta 4.5.0 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.5.0/templates/command-palette/.
Every rule of the edition: https://pauta-project.dev/4.5.0/llms-full.txt.

One palette per window lists every registered command, so a command that exists is a command people can find. The
pure parts (`FuzzyMatch`, `MatchText`, the key helper, `PickerKeys` in Editora and `PaletteKeys` in the copies, and the
caret-key helper, `TextInputKeymap` in Editora and `TextInputKeys` in the copies) are shared with Termina and Mirada.
Torrenta shares [`MatchText`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MatchText.java) and ranks with its own [`CommandMatcher`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/CommandMatcher.java).

## Rules

- **PAL-01 · MUST.** Every app has one Command Palette per window, opened by the `palette.show` command. Its chords,
  `M-x` in the Emacs keymap and `Ctrl+Shift+P` (`Cmd+Shift+P` on macOS) in the others (`Ctrl+Shift+A` allowed in the
  IntelliJ keymap), are
  [KBD-05](https://pauta-project.dev/4.5.0/keyboard/#kbd-05).
  - *Check (code):* the window builds one `CommandPalette`, and `palette.show` opens it.
  - *Reference:* Editora [`ui/CommandPalette.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java), built once in [`MainController`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java).
- **PAL-02 · MUST.** The palette lists every registered command, with its title from `command.<id>` and its
  description from `command.<id>.desc`.
  - *Check (code):* the palette's rows come from the whole registry, filtered only by the query; a command that
    cannot run stays listed, grayed. A catalog parity test fails on a command title with no `.desc`.
  - *Reference:* Editora [`CommandPalette.filter`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java) (`registry.all()`), [`MessagesTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/i18n/MessagesTest.java); the Spec table below.

The palette is an in-scene overlay in the window's root `StackPane`, over a faint scrim, never a
`javafx.stage.Popup`: [KBD-07](https://pauta-project.dev/4.5.0/keyboard/#kbd-07).

## Anatomy

*Mockup of the command palette with the query git. Drawn on the page; the numbers below mark its parts.*

1. **Opener chip.** The chord that opened the palette, read from the active keymap. No chip when the user has unbound it, never a wrong one.
2. **Query field.** The first row is the input; there is no title. Prompt "Run command…". Emacs caret keys work inside it.
3. **Match highlight.** The characters the fuzzy matcher scored, bold in the accent color. The highlight and the ranking come from the same call, so they never disagree.
4. **Selected row.** Tinted background plus a 2 px accent bar on its inside edge. The bar is what makes the selection readable in a long list.
5. **Key chip.** The command's binding in the active keymap, in the keyboard color (brace periwinkle). Absent when unbound.
6. **Unavailable command.** Listed, grayed, never selected and inert to clicks. Its tooltip says why and what to do ("Unavailable — no merge, rebase, cherry-pick or revert is in progress.").
7. **Description.** The selected command's `command.<id>.desc`, one line with an ellipsis, always one line tall so the card never jumps.
8. **Key legend.** The palette's own keys, rendered from the active keymap.

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | In-scene overlay in the window's root `StackPane`, over a faint scrim. **Not** a `javafx.stage.Popup`: on Windows a popup does not reliably take keyboard focus. | `OverlayHost` |
| Width | 620 px | `content.setPrefWidth(620)` |
| Rows | 36 px high, 8 visible before the list scrolls | `ROW_HEIGHT`, `VISIBLE_ROWS` |
| Card | `-color-bg-overlay`, 1 px `-color-border-default`, radius 12, padding 6, one wide drop shadow | `.command-palette` in `app.css` |
| Row text | 12.5 px; padding 7 × 16 | `.command-palette .list-cell` |
| Scrim | `rgba(0,0,0,0.18)`; a click on it closes the palette | `.overlay-backdrop` |
| Content | Every registered command: title from `command.<id>`, description from `command.<id>.desc` | `CommandRegistry`, `MessagesTest` |
| Ranking | Fuzzy score over title, id and description; a query that names a title outranks a fuzzy hit | `FuzzyMatch`, `titlePhraseScore` |

## Behavior

- **PAL-04 · SHOULD.** The palette opens from the `palette.show` command, by its chord or a menu item, with an empty
  query that lists every command.
  - *Check (code):* `show` clears the field and filters on the empty query before the card appears.
  - *Reference:* Editora [`CommandPalette.show`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java).
- **PAL-05 · SHOULD.** Typing filters the list, and the first *enabled* match is selected.
  - *Check (test):* a test with a disabled command at the top finds the cursor on the first enabled row.
  - *Reference:* Editora [`CommandPalette.selectFirstEnabled`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java), [`CommandPaletteDisabledFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/CommandPaletteDisabledFxTest.java).
- **PAL-06 · SHOULD.** ↑ ↓, `C-n` `C-p` and Page Up/Down move the selection; Enter, or a click on an enabled row, runs
  the command. The palette closes first, then the command runs.
  - *Check (code):* the run path hides the card before it calls the registry, and does nothing on a disabled row.
  - *Reference:* Editora [`CommandPalette.runSelected`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java), [`PickerKeys`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/PickerKeys.java).
- **PAL-07 · SHOULD.** Esc, `C-g` or a click on the scrim cancels, and focus returns to where it was.
  - *Check (code):* the cancel key and a press on the backdrop both hide the overlay, and hiding focuses the node that
    had focus before it opened.
  - *Reference:* Editora [`PickerKeys`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/PickerKeys.java) (`CANCEL`), [`OverlayHost`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/OverlayHost.java) (`previousFocus`).
- **PAL-08 · SHOULD.** `C-h`, or the first of `C-h`, `F1`, `Shift+F1` the active keymap leaves free, opens the selected
  command's page on the website, for the running version.
  - *Check (code):* the docs chord is the first free one of the three, and the URL is built from the app's versioned
    docs address.
  - *Reference:* Editora [`CommandPalette`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java) ([`PickerKeys.freeChord`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/PickerKeys.java), `docsUrl`), [`AppInfo.docsUrl`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/AppInfo.java).
- **PAL-09 · SHOULD.** A live keymap switch re-renders the key chips, the opener chip and the key legend.
  - *Check (code):* applying a new keymap calls the palette's rebind method, which rebuilds the opener, the legend and
    the rows.
  - *Reference:* Editora [`CommandPalette.refreshBindings`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java), called from [`SettingsReapply`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsReapply.java).

## Copy

| Key | English |
|---|---|
| `palette.prompt` | Run command… |
| `palette.disabled.<reason>` | Unavailable — *what is missing*. *What to do first.* |

## In the apps

*Screenshot: Editora.*
*Screenshot: Torrenta.*
*Screenshot: Termina.*
