# Find bar

> The family's find bar: in-scene, incremental, with a count; Enter and Shift+Enter step, Escape gives the keyboard back.

Pauta 5.0.0 (2026-11-09). The page with its screenshots and mockups: https://pauta-project.dev/5.0.0/templates/find-bar/.
Every rule of the edition: https://pauta-project.dev/5.0.0/llms-full.txt.

The bar for searching text: in an editor, a read-only console, a terminal's scrollback. It is part of the window and
searches as you type. Mirada has no text to search: its *Find Image…* is a picker, see the
[QuickOpen template](https://pauta-project.dev/5.0.0/templates/quick-open/).

## Rules

- **FIND-01 · MUST.** Wherever there is text to search, the app has a find bar that is part of the window, never a
  popup.
  - *Check (code):* the bar is a node in the window's scene graph (docked or floating); no `Popup` or `Stage` is
    created for it.
  - *Reference:* Editora [`ui/FindReplaceBar.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/FindReplaceBar.java) (the editor's find and replace), with [`ui/ConsoleFindBar.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/ConsoleFindBar.java) and
    [`ui/TerminalFindBar.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/TerminalFindBar.java) as the same shape over a console and a terminal; Termina [`ui/SearchBar.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/SearchBar.java).
- **FIND-02 · MUST.** The bar searches as you type and shows a match count.
  - *Check (code):* the query field's text listener runs the search (debounced) and updates the count label.
  - *Reference:* Editora [`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/FindReplaceBar.java) (`debounce`, `find.count`); Termina [`SearchBar`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/SearchBar.java) (`search.count`).
- **FIND-03 · MUST.** A list app filters instead of finding, with the same field and the same Escape.
  - *Check (code):* the list's filter field filters as it is typed, and Escape in it empties it or gives focus back
    to the list.
  - *Reference:* Torrenta [`Omnibox`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/Omnibox.java), [`FilterQuery`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/FilterQuery.java), [`MainWindow.onOmniboxKey`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/MainWindow.java).

## Anatomy

*Mockup of the find and replace bar docked above an editor, with matches highlighted in the text. Drawn on the page; the numbers below mark its parts.*

1. **Query field**, focused on open with its text selected, so typing replaces the last query. A single-line selection in the editor is the first query; a multi-line one becomes the scope instead and switches *Sel* on. A clear button appears while the field has text.
2. **Count** "3 of 12", 11 px muted. Empty when there is no query, "No matches" when there are none. Wide enough that the buttons beside it do not shuffle as the digits grow.
3. **Previous and next**, 28 px flat icon buttons, the same as Shift+Enter and Enter.
4. **Options** as compact toggles with a two-letter caption (match case, regular expression, whole word, preserve case, in selection); the tooltip and the accessible name carry the full meaning. Disabled while the query is empty, except *Sel*, which is a scope.
5. **Replace** replaces the active match and steps to the next; *All* replaces every match and reports "Replaced 12 occurrence(s)" in the status line. A console or a terminal has no replace row.
6. **Close**, top right whatever the bar wraps to. Escape does the same.
7. **Matches** are all highlighted while the bar is open, the active one distinctly, and the highlights follow the text as it is edited. They go when the bar closes.

The same bar over a terminal floats at the top right of the pane it searches, in the palette's materials, so the two
read as one family: a lens, the field as the card's own text, the count, a regex switch, and up, down and close.

*Mockup of Termina's find bar floating at the top right of a terminal. Drawn on the page; the numbers below mark its parts.*

8. **Floating card**, 380 px wide, radius 8, over the output being read. Enter steps *up* to older output and Shift+Enter down: a terminal is searched for something recent, so the search starts at the bottom (iTerm2's convention). The arrow keys do the same.

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | In-scene, never a popup. Editora docks the bar above the editor area; Termina floats it inside the [`TerminalView`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/TerminalView.java), so each pane of a split has its own and a search never wonders which terminal it is about | `MainController` (`topBox`), [`SearchBar`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/SearchBar.java) |
| Docked bar | `-color-bg-subtle`, padding 4 8, spacing 6; icon buttons 28 × 28, flat; the groups (find, replace, options) wrap onto a second line in a narrow window instead of shrinking the fields | `.find-bar`, `.find-bar-icon`, `WrapRow` |
| Floating card | `-color-bg-overlay`, 1 px `-color-border-default`, radius 8, 380 px wide, padding 3 4 3 8, shadow 18 at offset 6; the field is the card's own text at 12.5 px | `.search-bar`, `.search-field` |
| Options | Toggles with a short caption; tooltip and accessible name carry the meaning; selected: `-color-accent-subtle` with `-color-accent-fg` | `OptionToggle`, `.search-toggle:selected` |
| Count | `{0} of {1}`, 11 px `-color-fg-muted`, right-aligned; minimum width 64 px | `find.count`, `search.count`, `COUNT_MIN_WIDTH` |
| Debounce | The search runs 150 ms after the last keystroke, and an edit to the text re-highlights after the same 150 ms without moving the caret | `debounce`, `editDebounce`, `TYPING_SETTLE`, `searchTyping` |
| Threading | A document up to 512 K characters is searched where the request is made; larger ones on one shared daemon thread, latest query only, the result applied on the FX thread. A scrollback is always scanned off the FX thread | `SYNC_SEARCH_CHARS`, `SEARCH_POOL`, `LatestOnly`, `TerminalView.searchAsync` |
| Bounds | A page of matches around the active one, not every match of a query that matches millions of times; a regular expression has a time budget. Termina keeps the newest 1,000 matches | `SearchMatcher.DEFAULT_PAGE`, `find.tooComplex`, [`ScrollbackSearch.MAX_MATCHES`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/ScrollbackSearch.java) |
| Bad regex | Said in place, never by a dialog: the status line ("Bad regex: …") or, in Termina, the field in `-color-danger-fg` and the count "Invalid" | `find.badRegex`, `.search-field:invalid` |
| Focus | The bar and its buttons are out of the Tab order; in a terminal Tab belongs to the shell | `setFocusTraversable(false)` |

## Behavior

- **FIND-04 · SHOULD.** The find command (`find.show`) opens the bar: `C-s` in the Emacs keymap and `Ctrl/Cmd+F` in
  CUA, Sublime, VS Code and IntelliJ, with `F3` as well in CUA and Sublime. A terminal uses `Ctrl+Shift+F`, `Cmd+F` on
  macOS, since a plain `Ctrl+letter` belongs to the shell. The command while the bar is already open finds the next
  match (Editora) or puts the caret back in the field (Termina).
  - *Check (code):* each bundled keymap binds that chord to the find command; the command steps when the bar is
    shown.
  - *Reference:* Editora `keymaps/*.json`, [`MainController.findShowOrNext`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MainController.java); Termina [`TerminalWindow`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/TerminalWindow.java) (`menu.find`,
    [`MenuAction.appChord`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/MenuAction.java)).
- **FIND-05 · SHOULD.** Typing highlights every match and selects and scrolls to the first one at or after the caret.
  The anchor is the caret at open time, so refining the query does not run away down the document.
  - *Check (code):* the search starts from an anchor saved when the bar opens, not from the current selection.
  - *Reference:* Editora [`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/FindReplaceBar.java) (`searchAnchor`, `recompute`).
- **FIND-06 · MUST.** Enter steps to the next match and Shift+Enter to the previous one, wrapping around at the ends. In
  a terminal the directions are up and down the scrollback.
  - *Check (code):* the query field's key handler steps forward on Enter and backward on Shift+Enter.
  - *Reference:* Editora [`ConsoleFindBar`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/ConsoleFindBar.java), [`TerminalFindBar`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/TerminalFindBar.java); Termina [`SearchBar`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/SearchBar.java). Editora's editor bar
    ([`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/FindReplaceBar.java)) does not yet: its field steps forward on Enter, and back only with the previous button,
    `find.showBackward` (`C-r`, `Shift+F3`) or `find.previous`. Alt+Enter there turns every match into a caret.
- **FIND-07 · MUST.** Escape or the close button closes the bar: the highlights go, a search still pending is canceled
  so nothing moves after the bar is gone, and focus returns to the editor, the console or the shell.
  - *Check (code):* the close path stops the debounces, cancels the running search, clears the highlights and focuses
    the text it searched.
  - *Reference:* Editora [`FindReplaceBar.hideBar`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/FindReplaceBar.java).
- **FIND-08 · SHOULD.** In a terminal, Escape is consumed in the field and never reaches the shell, and the terminal's
  own key and mouse filters leave every event aimed at the bar alone.
  - *Check (code):* the field consumes Escape, and the terminal's filters return early for events from the bar.
  - *Reference:* Termina [`SearchBar`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/SearchBar.java), [`TerminalView.fromSearchBar`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/TerminalView.java).
- **FIND-09 · SHOULD.** The keymap's caret and editing chords (`C-a`, `C-e`, `C-k`, `C-y`, `Ctrl+V/X/C/Z`) act on the
  field, not on the document. Find's own chords stay global, so next, previous, replace and close work while the field
  has focus.
  - *Check (code):* the find fields install the shared text-input keymap.
  - *Reference:* Editora [`TextInputKeymap.installShared`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/command/TextInputKeymap.java); Termina's and Mirada's [`TextInputKeys`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/TextInputKeys.java).
- **FIND-10 · SHOULD.** Nothing found is one status-line message ("Not found: x") or the count "No matches". No beep,
  no dialog.
  - *Check (code):* the no-match path sets `find.notFound` or `search.none` and opens nothing.
  - *Reference:* Editora [`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/FindReplaceBar.java) (`find.notFound`); Termina [`SearchBar`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/SearchBar.java) (`search.none`).
- **FIND-11 · SHOULD.** Replace keeps each match's case when *AB* (preserve case) is on.
  - *Check (test):* a test replaces with preserve case on and finds each match's casing kept.
  - *Reference:* Editora [`FindReplaceBarFxTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/ui/FindReplaceBarFxTest.java) (`preserveCaseFollowsEachMatchesCasing`).
- **FIND-12 · SHOULD.** A replacement that is too slow stops with "Replace stopped: the pattern is too slow" instead of
  hanging the window.
  - *Check (test):* a catastrophic regex in Replace All aborts.
  - *Reference:* Editora `find.replaceTimeout`, [`FindReplaceBarFxTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/ui/FindReplaceBarFxTest.java)
    (`catastrophicRegexInReplaceAllAbortsInsteadOfHanging`).
- **FIND-13 · SHOULD.** A list app's filter box filters the names as plain words are typed, turns `key:value` terms into
  chips and runs a command after `>`. `Ctrl+K` focuses it and is drawn in the box as a key badge.
  - *Check (code):* the box's text listener filters, and its badge is read from the filter command's chord.
  - *Reference:* Torrenta [`Omnibox`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/Omnibox.java), [`MainWindow.buildFilterBar`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/MainWindow.java).
- **FIND-14 · SHOULD.** Escape in a filter box peels one layer: a box with something in it empties, an empty one gives
  the list back.
  - *Check (code):* the box's Escape handler clears a non-empty box and otherwise focuses the list.
  - *Reference:* Torrenta [`MainWindow.onOmniboxKey`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/MainWindow.java).
- **FIND-15 · SHOULD.** The filter box is out of the Tab order, so a fresh launch does not land every keystroke in it,
  and the window's own chords (undo, `Ctrl+Alt+1…9`) do not fire while a text field has focus: `Ctrl+Z` there is the
  field's own undo.
  - *Check (code):* the box is not focus-traversable, and the window's chord handlers return early when the focus
    owner is a `TextInputControl`.
  - *Reference:* Torrenta [`MainWindow.buildFilterBar`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/MainWindow.java), [`MainWindow`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/MainWindow.java) window chords.

## Copy

| Key | English |
|---|---|
| `find.prompt` | Find |
| `find.replacePrompt` | Replace |
| `find.count` | {0} of {1} |
| `find.notFound` | Not found: {0} |
| `find.badRegex` | Bad regex: {0} |
| `find.tooComplex` | Search stopped early: the pattern is too complex for this text |
| `find.replaced` | Replaced {0} occurrence(s) |
| `search.caseTip` · `search.regexTip` · `find.wholeWord` | Match case · Regular expression · Whole word |
| `search.older` · `search.newer` · `search.close` (Termina) | Previous match, up (Enter) · Next match, down (Shift+Enter) · Close (Escape) |
| `search.none` · `search.invalid` (Termina) | No matches · Invalid |
| `window.filter.prompt` (Torrenta) | Filter · > runs a command · paste a magnet |

## In the apps

- **Editora:** find and replace over the editor ([`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/FindReplaceBar.java)), with *Find in Files* (`search.inFiles`) as a
  separate results window; the console and terminal tool windows carry the same bar without the replace row.
- **Termina:** the floating card over each pane, with the regex switch; matches are found across soft-wrapped
  lines, so a word that reached the right edge and carried on is still found.
- **Torrenta:** the omnibox above the transfers, which filters, runs commands and adds what is pasted.
- **Mirada, Modula, nux:** no free text to search; Mirada finds an image through a picker.
