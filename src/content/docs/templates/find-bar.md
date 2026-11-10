---
title: "Find bar"
description: "The family's find bar: in-scene, incremental, with a count; Enter and Shift+Enter step, Escape gives the keyboard back."
---

The bar for searching text: in an editor, a read-only console, a terminal's scrollback, a log window. It is part of
the window and searches as you type. The page reaches every app, not only the ones with an editor or a terminal:
every app has a Debug Log ([DIAG-03](../../diagnostics/#diag-03)), which is text to search, so
[FIND-01](#find-01) asks for a find bar there. Mirada has no other text to search: its *Find Image…* is a picker,
see the [QuickOpen template](../quick-open/).

## Rules

- **FIND-01 · MUST.** Wherever there is text to search (an editor, a read-only console, a terminal's scrollback, a
  log window such as the Debug Log), the app has a find bar that is part of the window, never a popup.
  - *Why:* every app has a Debug Log ([DIAG-03](../../diagnostics/#diag-03)), and a log is read by searching it.
  - *Check (code):* each view of searchable text, the Debug Log window among them, has a find bar that is a node in
    its window's scene graph (docked or floating); no `Popup` or `Stage` is created for it.
  - *Reference:* Editora [`ui/FindReplaceBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FindReplaceBar.java) (the editor's find and replace), with [`ui/ConsoleFindBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ConsoleFindBar.java)
    and [`ui/TerminalFindBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TerminalFindBar.java) as the same shape over a console and a terminal; Termina [`ui/SearchBar.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SearchBar.java).
    Over a log window, the app template's [`ui/DebugLogFindBar.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/DebugLogFindBar.java), a row in its Debug Log window. No released
    app's Debug Log has a find bar yet.
- **FIND-02 · MUST.** The bar searches as you type and shows a match count.
  - *Check (code):* the query field's text listener runs the search (debounced) and updates the count label.
  - *Reference:* Editora [`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FindReplaceBar.java) (`debounce`, `find.count`); Termina [`SearchBar`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SearchBar.java) (`search.count`); the
    app template's [`ui/DebugLogFindBar.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/DebugLogFindBar.java) (`searching`, `find.count`).
- **FIND-03 · MUST.** In an app whose main content is a list, a filter box over the list takes the place of a find
  bar there, with the same field and the same Escape.
  - *Check (code):* the list's filter field filters as it is typed, and Escape in it empties it or gives focus back
    to the list.
  - *Reference:* Torrenta [`Omnibox`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Omnibox.java), [`FilterQuery`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/FilterQuery.java), [`MainWindow.onOmniboxKey`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java).

## Anatomy

<div class="mock-stage">
<div class="m-fb-win" role="img" aria-label="Mockup of the find and replace bar docked above an editor, with matches highlighted in the text">
<div class="m-fb-bar">
<div class="m-fb-row">
<span class="m-fb-label">Find:</span>
<span class="m-field focus m-fb-field"><span>status</span><span class="m-caret"></span><span class="m-grow"></span><span class="m-fb-clear">×</span></span><span class="pin">1</span>
<span class="m-fb-count">3 of 12</span><span class="pin">2</span>
<span class="m-fb-icon">‹</span><span class="m-fb-icon">›</span><span class="pin">3</span>
<span class="m-fb-label" style="margin-left:14px">Replace:</span>
<span class="m-field m-fb-field"><span class="ph">Replace</span></span>
<span class="m-btn">Replace</span><span class="m-btn">All</span><span class="pin">5</span>
<span class="m-grow"></span>
<span class="m-fb-icon">×</span><span class="pin">6</span>
</div>
<div class="m-fb-row">
<span class="m-fb-toggle on">Aa</span><span class="m-fb-toggle">.*</span><span class="m-fb-toggle">W</span><span class="m-fb-toggle">AB</span><span class="m-fb-toggle">Sel</span><span class="pin">4</span>
</div>
</div>
<div class="m-fb-code">
<div><span class="ln">41</span>    private final Label <mark class="hit">status</mark>Label = new Label();</div>
<div><span class="ln">42</span>    void setStatus(String text) { <mark class="hit">status</mark>Label.setText(text); }</div>
<div><span class="ln">43</span>    String <mark class="hit cur">status</mark>() { return <mark class="hit">status</mark>Label.getText(); }<span class="pin" style="margin-left:10px">7</span></div>
<div><span class="ln">44</span>    void clearStatus() { setStatus(""); }</div>
</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Query field</strong>, focused on open with its text selected, so typing replaces the last query. A single-line selection in the editor is the first query; a multi-line one becomes the scope instead and switches <em>Sel</em> on. A clear button appears while the field has text.</span></li>
<li><span class="pin">2</span><span><strong>Count</strong> "3 of 12". Empty when there is no query. When nothing matches, Termina's card and Editora's console and terminal bars say "No matches"; Editora's editor bar empties the count and says "Not found: x" in the status line. Termina draws it 11 px muted and at least 64 px wide, so the buttons beside it do not shuffle as the digits grow; Editora's label has no style of its own.</span></li>
<li><span class="pin">3</span><span><strong>Previous and next</strong>, 28 px flat icon buttons, the same as Shift+Enter and Enter.</span></li>
<li><span class="pin">4</span><span><strong>Options</strong> as compact toggles with a two-letter caption (match case, regular expression, whole word, preserve case, in selection); the tooltip and the accessible name carry the full meaning. Disabled while the query is empty, except <em>Sel</em>, which is a scope.</span></li>
<li><span class="pin">5</span><span><strong>Replace</strong> replaces the active match and steps to the next; <em>All</em> replaces every match and reports "Replaced 12 occurrence(s)" in the status line (Editora's string, which does not meet <a href="../../i18n/#intl-12">INTL-12</a> yet). A console or a terminal has no replace row.</span></li>
<li><span class="pin">6</span><span><strong>Close</strong>, top right whatever the bar wraps to. Escape does the same.</span></li>
<li><span class="pin">7</span><span><strong>Matches</strong> are all highlighted while the bar is open, the active one distinctly, and the highlights follow the text as it is edited. They go when the bar closes.</span></li>
</ol>

The same bar over a terminal floats at the top right of the pane it searches, in the palette's materials, so the two
read as one family: a lens, the field as the card's own text, the count, a regex switch, and up, down and close.

<div class="mock-stage">
<div class="m-fb-term" role="img" aria-label="Mockup of Termina's find bar floating at the top right of a terminal">
<div class="m-fb-shell"><div>$ ./mvnw -q verify</div><div>[<span class="err">ERROR</span>] Tests run: 48, Failures: 1</div><div>[<span class="err">ERROR</span>]   ShelfTest.rejectsEmptyName:31 expected: &lt;true&gt; but was: &lt;false&gt;</div><div>[INFO] BUILD FAILURE</div><div>$ <span class="m-caret"></span></div></div>
<div class="m-card m-fb-float"><span class="m-fb-lens">⌕</span><span class="q">ERROR<span class="m-caret"></span></span><span class="m-fb-count">2 of 2</span><span class="m-fb-toggle">.*</span><span class="m-fb-icon">↑</span><span class="m-fb-icon">↓</span><span class="m-fb-icon">×</span></div>
<span class="pin out" style="right:-10px;top:-10px">8</span>
</div>
</div>

<ol class="anatomy" start="8">
<li><span class="pin">8</span><span><strong>Floating card</strong>, 380 px wide, radius 8, over the output being read. Enter steps <em>up</em> to older output and Shift+Enter down: a terminal is searched for something recent, so the search starts at the bottom (iTerm2's convention). The arrow keys do the same.</span></li>
</ol>

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | In-scene, never a popup. Editora docks the bar above the editor area; Termina floats it inside the [`TerminalView`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalView.java), so each pane of a split has its own and a search never wonders which terminal it is about | `MainController` (`topBox`), [`SearchBar`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SearchBar.java) |
| Docked bar | `-color-bg-subtle`, padding 4 8, spacing 6; icon buttons 28 × 28, flat; the groups (find, replace, options) wrap onto a second line in a narrow window instead of shrinking the fields | `.find-bar`, `.find-bar-icon`, `WrapRow` |
| Floating card | `-color-bg-overlay`, 1 px `-color-border-default`, radius 8, 380 px wide, padding 3 4 3 8, shadow 18 at offset 6; the field is the card's own text at 12.5 px | `.search-bar`, `.search-field` |
| Options | Toggles with a short caption; tooltip and accessible name carry the meaning; selected: `-color-accent-subtle` with `-color-accent-fg` | `OptionToggle`, `.search-toggle:selected` |
| Count | `{0} of {1}`. Termina: 11 px `-color-fg-muted`, right-aligned, minimum width 64 px, "No matches" when there are none. Editora's label has no style of its own, and its editor bar empties it when nothing matches | `find.count`, `search.count`, `search.none`, `COUNT_MIN_WIDTH`, `.search-count` |
| Debounce | The search runs 150 ms after the last keystroke in Editora and 120 ms in Termina. In Editora an edit to the text re-highlights after the same 150 ms without moving the caret | `debounce`, `editDebounce`, `TYPING_SETTLE`; Termina's `searchTyping` in [`TerminalView`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalView.java) |
| Threading | A document up to 512 K characters is searched where the request is made; larger ones on one shared daemon thread, latest query only, the result applied on the FX thread. A scrollback is always scanned off the FX thread | `SYNC_SEARCH_CHARS`, `SEARCH_POOL`, `LatestOnly`, `TerminalView.searchAsync` |
| Bounds | A page of matches around the active one, not every match of a query that matches millions of times; a regular expression has a time budget. Termina keeps the newest 1,000 matches | `SearchMatcher.DEFAULT_PAGE`, `find.tooComplex`, [`ScrollbackSearch.MAX_MATCHES`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/ScrollbackSearch.java) |
| Bad regex | Said in place, never by a dialog: the status line ("Bad regex: …") or, in Termina, the field in `-state-red` and the count "Invalid" | `find.badRegex`, `.search-field:invalid` |
| Focus | The buttons may leave the Tab order where a command reaches each; the fields and the option toggles stay in it ([FIND-16](#find-16)). In a terminal the whole bar is out: Tab belongs to the shell | `setFocusTraversable(false)` |

## Behavior

- **FIND-04 · SHOULD.** The find command (`find.show`) opens the bar: `C-s` in the Emacs keymap and `Ctrl/Cmd+F` in
  CUA, Sublime, VS Code and IntelliJ, with `F3` as well in CUA and Sublime (`Cmd+G` in place of `F3` in CUA on
  macOS). A terminal uses `Ctrl+Shift+F`, `Cmd+F` on macOS, since a plain `Ctrl+letter` belongs to the shell. The
  command while the bar is already open finds the next match (Editora) or puts the caret back in the field
  (Termina).
  - *Check (code):* each bundled keymap binds that chord to the find command; the command steps when the bar is
    shown.
  - *Reference:* Editora `keymaps/*.json`, [`MainController.findShowOrNext`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java); Termina [`TerminalWindow`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java) (`menu.find`,
    [`MenuAction.appChord`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/MenuAction.java)).
- **FIND-05 · SHOULD.** Typing highlights every match and selects and scrolls to the first one at or after the caret.
  The anchor is the caret at open time, so refining the query does not run away down the document.
  - *Check (code):* the search starts from an anchor saved when the bar opens, not from the current selection.
  - *Reference:* Editora [`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FindReplaceBar.java) (`searchAnchor`, `recompute`).
- **FIND-06 · MUST.** Enter steps to the next match and Shift+Enter to the previous one, wrapping around at the ends. In
  a terminal the directions are up and down the scrollback: Enter steps up to older output, Shift+Enter down.
  - *Check (code):* the query field's key handler steps forward on Enter and backward on Shift+Enter.
  - *Reference:* Editora [`ConsoleFindBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ConsoleFindBar.java), [`TerminalFindBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TerminalFindBar.java); Termina [`SearchBar`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SearchBar.java). Editora's editor bar
    ([`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FindReplaceBar.java)) does not yet: its field steps forward on Enter, and back only with the previous button,
    `find.showBackward` (`C-r`, `Shift+F3`) or `find.previous`. Alt+Enter there turns every match into a caret. Over
    a log window, the app template's [`ui/DebugLogFindBar.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/DebugLogFindBar.java) steps and wraps the same way.
- **FIND-07 · MUST.** Escape or the close button closes the bar: the highlights go, a search still pending is canceled
  so nothing moves after the bar is gone, and focus returns to the editor, the console, the shell or the log.
  - *Check (code):* the close path stops the debounces, cancels the running search, clears the highlights and focuses
    the text it searched.
  - *Reference:* Editora [`FindReplaceBar.hideBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FindReplaceBar.java); over a log window, the app template's
    [`ui/DebugLogFindBar.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/DebugLogFindBar.java) (`close`).
- **FIND-08 · SHOULD.** In a terminal, Escape is consumed in the field and never reaches the shell, and the terminal's
  own key and mouse filters leave every event aimed at the bar alone.
  - *Check (code):* the field consumes Escape, and the terminal's filters return early for events from the bar.
  - *Reference:* Termina [`SearchBar`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SearchBar.java), [`TerminalView.fromSearchBar`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalView.java).
- **FIND-09 · SHOULD.** The keymap's caret and editing chords (`C-a`, `C-e`, `C-k`, `C-y`, `Ctrl+V/X/C/Z`) act on the
  field, not on the document. Find's own chords stay global, so next, previous, replace and close work while the field
  has focus.
  - *Check (code):* the find fields install the shared text-input keymap.
  - *Reference:* Editora [`TextInputKeymap.installShared`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/command/TextInputKeymap.java), installed on [`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FindReplaceBar.java)'s find and replace fields.
    Termina's find field does not yet: its [`TextInputKeys`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TextInputKeys.java) is installed on the palette only.
- **FIND-10 · SHOULD.** Nothing found is one status-line message ("Not found: x") or the count "No matches". No beep,
  no dialog.
  - *Check (code):* the no-match path sets `find.notFound` or `search.none` and opens nothing.
  - *Reference:* Editora [`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FindReplaceBar.java) (`find.notFound`); Termina [`SearchBar`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SearchBar.java) (`search.none`).
- **FIND-11 · SHOULD.** In a bar that replaces (an editor's), Replace keeps each match's case when *AB* (preserve
  case) is on.
  - *Check (test):* a test replaces with preserve case on and finds each match's casing kept.
  - *Reference:* Editora [`FindReplaceBarFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FindReplaceBarFxTest.java) (`preserveCaseFollowsEachMatchesCasing`).
- **FIND-12 · SHOULD.** In a bar that replaces, a replacement that is too slow stops with "Replace stopped: the
  pattern is too slow" instead of hanging the window.
  - *Check (test):* a catastrophic regex in Replace All aborts.
  - *Reference:* Editora `find.replaceTimeout`, [`FindReplaceBarFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FindReplaceBarFxTest.java)
    (`catastrophicRegexInReplaceAllAbortsInsteadOfHanging`).
- **FIND-13 · SHOULD.** In an app whose main content is a list, the filter box filters the names as plain words are
  typed, turns `key:value` terms into chips and runs a command after `>`. `Ctrl+K` focuses it and is drawn in the box
  as a key badge.
  - *Check (code):* the box's text listener filters, and its badge is read from the filter command's chord.
  - *Reference:* Torrenta [`Omnibox`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Omnibox.java), [`MainWindow.buildFilterBar`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java).
- **FIND-14 · SHOULD.** In an app whose main content is a list, Escape in the filter box peels one layer: a box with
  something in it empties, an empty one gives the list back.
  - *Check (code):* the box's Escape handler clears a non-empty box and otherwise focuses the list.
  - *Reference:* Torrenta [`MainWindow.onOmniboxKey`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java).
- **FIND-15 · SHOULD.** In an app whose main content is a list, the filter box is out of the Tab order, so a fresh
  launch does not land every keystroke in it, and the window's own chords (undo, `Ctrl+Alt+1…9`) do not fire while a
  text field has focus: `Ctrl+Z` there is the field's own undo.
  - *Check (code):* the box is not focus-traversable, and the window's chord handlers return early when the focus
    owner is a `TextInputControl`.
  - *Reference:* Torrenta [`MainWindow.buildFilterBar`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java), [`MainWindow`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java) window chords.
- **FIND-16 · MUST.** A control of the find bar or of a filter box leaves the Tab order only when a command does
  what it does. The Next, Previous and Close buttons may leave it, since Enter, Shift+Enter and Escape do the same from
  the field ([FIND-06](#find-06), [FIND-07](#find-07)). An option's toggle (match case, whole word, regular expression) stays in it unless a
  command toggles that option. A list app's filter box leaves it ([FIND-15](#find-15)) because its command puts the
  focus there ([FIND-13](#find-13)). In a terminal the whole bar is out, since Tab belongs to the shell, so every
  control on it has a command.
  - *Why:* [KBD-15](../../keyboard/#kbd-15) lets a control out of the Tab order only when the keyboard reaches it
    another way. A toggle that is out of it with no command can be changed with the mouse alone.
  - *Check (code):* every control of a find bar or filter box that is set not focus-traversable runs a registered
    command, or has one that does the same.
  - *Reference:* the app template's [`DebugLogFindBar.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/DebugLogFindBar.java), whose Previous, Next and Close buttons are out of the Tab order and run
    `debugLog.findPrevious` and `debugLog.findNext`, with the Match Case box left in it; Torrenta's filter box,
    reached by its `filter` command; Mirada's [`BookmarksWindow.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/BookmarksWindow.java), whose three kind toggles are out of it and
    have a command each. Editora's [`FindReplaceBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FindReplaceBar.java) keeps every button and box in the Tab order. Termina's
    regex toggle doesn't meet it yet: it is out of the Tab order and no command reaches it ([`SearchBar.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SearchBar.java)).

## Copy

| Key | English |
|---|---|
| `find.prompt` | Find |
| `find.replacePrompt` | Replace |
| `find.count` | {0} of {1} |
| `find.notFound` | Not found: {0} |
| `find.badRegex` | Bad regex: {0} |
| `find.tooComplex` | Search stopped early: the pattern is too complex for this text |
| `find.replaced` | Replaced {0} occurrence(s) *(does not meet [INTL-12](../../i18n/#intl-12) yet)* |
| `search.caseTip` · `search.regexTip` · `find.wholeWord` | Match case · Regular expression · Whole word |
| `search.older` · `search.newer` · `search.close` (Termina) | Previous match, up (Enter) · Next match, down (Shift+Enter) · Close (Escape) |
| `search.none` (Termina, and Editora's console and terminal bars) · `search.invalid` (Termina) | No matches · Invalid |
| `window.filter.prompt` (Torrenta) | Filter · > runs a command · paste a magnet |

## In the apps

- **Editora:** find and replace over the editor ([`FindReplaceBar`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FindReplaceBar.java)), with *Find in Files* (`search.inFiles`) as a
  separate results window; the console and terminal tool windows carry the same bar without the replace row.
- **Termina:** the floating card over each pane, with the regex switch; matches are found across soft-wrapped
  lines, so a word that reached the right edge and carried on is still found.
- **Torrenta:** the omnibox above the transfers, which filters, runs commands and adds what is pasted.
- **Mirada:** no text of its own to search; it finds an image through a picker.
- **Modula, nux:** no text to search, and no Debug Log yet ([DIAG-03](../../diagnostics/#diag-03)).
- **The Debug Log:** the app template's has a find bar ([`ui/DebugLogFindBar.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/DebugLogFindBar.java), opened by its
  `debugLog.find` command or `Ctrl/Cmd+F` in that window). Editora's, Termina's, Torrenta's and Mirada's is a
  read-only text area with no find bar (`ui/DebugLogWindow.java` in each), which [FIND-01](#find-01) asks for.
