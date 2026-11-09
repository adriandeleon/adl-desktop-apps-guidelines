# Menus

> The menu bar and right-click menus: an icon and the chord on every row, one font, one menu at a time, and a press anywhere else closes it.

Pauta 5.0.0 (2026-11-09). The page with its screenshots and mockups: https://pauta-project.dev/5.0.0/menus/.
Every rule of the edition: https://pauta-project.dev/5.0.0/llms-full.txt.

Two surfaces show the same rows: the **menu bar**, a browsable map of every command, and **right-click menus**, what
can be done with the thing under the pointer. Both are built from the [command registry](https://pauta-project.dev/5.0.0/keyboard/), so a row's
title, icon, chord and enabled state come from the command and never drift from the palette or the toolbar.
Reference: Editora's [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MainMenuBar.java) (menu bar), [`ui/ContextMenuDismissal.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/ContextMenuDismissal.java), [`ui/LazyContextMenu.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/LazyContextMenu.java),
[`ui/RowContextMenu.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/RowContextMenu.java) and [`ui/TabContextMenu.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/TabContextMenu.java) (right-click menus), and the `.menu-item` and `.context-menu`
rules in [`app.css`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/resources/com/editora/styles/app.css).

## Look and feel

Both surfaces draw their rows the same way. Absolute pixels are deliberate: a popup inherits the font of the node it
was opened from, and `em` would resolve against a file tree's or an 18 px toolbar's size (Editora's toolbar menu once
rendered a third larger than every other menu in the app).

| Property | Value | Reference |
|---|---|---|
| Font | Inter 14 px, regular, in every row and label | `.context-menu`, `.context-menu .menu-item .label` in `app.css`; `MainMenuBar.UI_FONT_SIZE` |
| Row | 34 px high: padding 8 × 12, the same in every theme | `.menu-item { -fx-padding: 8px 12px }` |
| Icon column | 22 px, filled on every row: a command row's glyph, or a check row's tick; 8 px to the title | `MainMenuBar.ICON_COLUMN`, `rowContent` |
| Icon | The command's glyph, the same one as on the toolbar and in the palette (Save is the same floppy everywhere), filled `-color-fg-muted` | `Icons`, `MenuBarIcons`, `.toolbar-icon` |
| Title | Inter 14 px, `-color-fg-default` | `.menu-item-title` |
| Chord | Right-aligned in its own column, Inter 11 px, in the keyboard color (`-state-key`, brace periwinkle); at least 18 px from the title column; in every menu, right-click menus included | `.menu-item-chord`, `alignChordColumns` |
| Submenu row | Laid out like a command row, with an invisible chord as wide as the menu's widest, so the arrow lands at the right edge | `nestedMenu`, `.menu-submenu` |
| Card | Radius 8; shadow `rgba(27,30,42,0.28)`, radius 16, **offset Y 16** | `.context-menu` |
| Danger item | Text in `-color-danger-fg` | `.menu-item.danger` |
| Disabled item | The theme's dimmed label, and the icon dimmed with it | Termina's `.menu-item:disabled .menu-icon` |
| Separators | Never two in a row and none at either end: when items hide, their orphaned separators hide too | `LazyContextMenu.collapseSeparators`, Torrenta's [`MenuSeparators`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/MenuSeparators.java) |

The shadow's offset is not cosmetic. A menu is a native window sized to its root *including the effect*, so a shadow
that reaches above the menu is invisible window over the bar the menu hangs from, and the pointer lands on it instead
of the next menu button. The offset must be at least the radius; Editora pins it with [`MenuPopupBoundsFxTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/ui/MenuPopupBoundsFxTest.java).

The three rules below hold for every menu the app draws itself: the menu bar, right-click menus, the drop-down of a menu
button or a split button, and the toolbar's overflow. The menus a platform draws (the macOS system menu bar, a
tray icon's menu) show text only; there the chord is appended to the title ([MENU-02](https://pauta-project.dev/5.0.0/menus/#menu-02)) and the
[tray](https://pauta-project.dev/5.0.0/tray-and-background/) shows neither.

- **MENU-14 · MUST.** Every row of every menu the app draws carries an icon that depicts it. A command row wears its
  command's glyph; a row that names a thing rather than an action (a recent file, a branch, a project) wears that
  thing's icon; a submenu wears its family's. Only a check or radio row goes without, because its mark fills the
  icon column. Where the icon set has no glyph that depicts a command, the app adds one (a Material 24 dp path, or a
  line glyph in the kit's style) instead of leaving the row blank or borrowing another command's.
  - *Why:* a menu is scanned before it is read, and the glyph is what the eye finds first; the same glyph on the
    toolbar, in the palette and in the menu ([ICON-20](https://pauta-project.dev/5.0.0/icons-and-color/#icon-20)) is learned once. A blank
    cell breaks the column, and a borrowed glyph says something else.
  - *Check (test):* an FX test opens the menu bar's menus and the right-click menus of a tab, an editor, a list row
    and the toolbar, and fails on any visible row that is not a check or radio item and has no graphic.
  - *Reference:* Editora [`ui/MenuBarIcons.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MenuBarIcons.java), [`editor/MenuIcons.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/editor/MenuIcons.java), [`ui/TabContextMenu.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/TabContextMenu.java); Termina's tab
    menu has an icon on every row. Editora doesn't yet pass: about half its menu-bar rows have no glyph, and
    [`MenuBarIconsTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/ui/MenuBarIconsTest.java) holds that a command without a fitting glyph gets none, which this rule reverses; many
    right-click and drop-down rows have none either (Run All Requests in a `.http` file, the CSV grid's menu, the
    Markdown preview's).
- **MENU-15 · MUST.** Every menu row whose command has a chord in the active keymap shows it, in right-click menus
  and drop-downs as in the menu bar: right-aligned in the menu's chord column, Inter 11 px in `-state-key`. An
  unbound command leaves the cell empty, never a wrong chord, and a keymap switch rewrites every cell.
  - *Why:* the menu is where a user learns the keys. A right-click menu that hides them teaches the mouse, while the
    palette and the toolbar's tooltips already show the same chord.
  - *Check (test):* an FX test binds a command, opens a right-click menu that lists it and finds its chord in a
    `menu-item-chord` label; after a keymap switch it finds the new chord.
  - *Reference:* Editora [`MainMenuBar.rowContent`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MainMenuBar.java) and `alignChordColumns`, `.menu-item-chord` in [`app.css`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/resources/com/editora/styles/app.css). Editora's
    right-click menus show no chords yet: a row there is a plain `MenuItem`, not the menu bar's row.
- **MENU-16 · MUST.** Every menu draws its titles in Inter 14 px regular and its chords in Inter 11 px at the
  default zoom, scaled by the UI zoom ([WIN-09](https://pauta-project.dev/5.0.0/window-shell/#win-09)), whatever node it was opened from: the
  size is pinned on `.context-menu` and its rows' labels from one value the zoom sets, never inherited from the
  node.
  - *Why:* a popup inherits the font of the node it was shown from, and `em` resolves against it: Editora's toolbar
    menu once rendered at the bar's 18 px, a third larger than every other menu, and a file tree's or a monospace
    editor's font leaks the same way.
  - *Check (test):* an FX test opens a menu from the toolbar, an editor and a tree row and reads Inter 14 px from
    each row's title, and 14 px times the zoom after the UI zoom changes. Editora pins 14 px and has no UI zoom yet.
  - *Reference:* Editora `.context-menu` and `.menu-item-chord` in [`app.css`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/resources/com/editora/styles/app.css), [`MainMenuBar.UI_FONT_SIZE`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MainMenuBar.java),
    [`ToolbarMenuFontFxTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/ui/ToolbarMenuFontFxTest.java).

## The menu bar

*Mockup of the File menu open under the menu bar. Drawn on the page; the numbers below mark its parts.*

1. **Menu button.** Padding 3 × 10 on a bar with 4 px side insets; the bar and the toolbar share one `-color-bg-subtle` band with no rule under it.
2. **Icon column**, 22 px. Every row has a glyph that depicts its command; where the icon set has none that fits, the app adds one rather than leave the cell blank.
3. **Title**, 14 px Inter, the command's title with the menu's own name dropped ("Save", not "File: Save") unless two rows would then read the same.
4. **Chord column.** Inter 11 px, periwinkle, right-aligned into one column per menu (not app-wide), read from the active keymap. Drawn by the app, not a JavaFX accelerator: Emacs chords are multi-key, which a `KeyCombination` cannot express, and on macOS an accelerator would bypass the key dispatcher.
5. **Unbound command.** An empty chord cell, never a wrong chord. A live keymap switch rewrites every cell.
6. **Submenu row.** Icon, title and an invisible chord as wide as the menu's widest, so its arrow sits at the right edge instead of halfway across.
7. **Card.** Radius 8; the shadow falls below the menu (offset ≥ radius), so nothing invisible covers the bar.

- **MENU-01 · MUST.** Every menu-bar item is a command from the registry, with its title
  ([KBD-03](https://pauta-project.dev/5.0.0/keyboard/#kbd-03)), its chord from the active keymap and its enabled state from the command's gate. The bar assembles and refreshes; it
  holds no behavior of its own.
  - *Check (code):* the bar's model lists command ids only, and every row runs its id through the registry.
  - *Reference:* Editora [`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MenuBarModel.java) over [`command/CommandRegistry.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/command/CommandRegistry.java), [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MainMenuBar.java).
- **MENU-02 · MUST.** Menu-bar rows use no `KeyCombination` accelerators. In the in-window bar each row is a
  `CustomMenuItem` laying out icon, title, spacer and chord. On the macOS system menu bar (`useSystemMenuBar`) the
  chord is appended to the title and rows carry no icon.
  - *Why:* Emacs chords are multi-key, which a `KeyCombination` cannot express, and on macOS an accelerator would
    bypass the key dispatcher. The native macOS menu draws text only and no graphics, which is also the platform's
    convention.
  - *Check (code):* no `setAccelerator` in the menu-bar classes.
  - *Reference:* Editora [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MainMenuBar.java) (`rowContent`, `refresh`).
- **MENU-03 · SHOULD.** Enablement is re-read every time a menu opens, and titles and chords on a keymap or locale
  change.
  - *Why:* a menu built before Git finished detecting a repository must not stay grayed out.
  - *Check (test):* an FX test detects a repository after the window is built and finds the menu enabled.
  - *Reference:* Editora [`MainMenuBar.refreshEnablement`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MainMenuBar.java), [`MenuBarEnablementFxTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/ui/MenuBarEnablementFxTest.java).
- **MENU-04 · SHOULD.** Simple mode shows a shorter menu, rebuilt only when the mode actually changes.
  - *Check (code):* the bar rebuilds only when the simple flag differs from the current one.
  - *Reference:* Editora [`MainMenuBar.setSimple`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MainMenuBar.java), [`MenuBarModel.menus(simple)`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MenuBarModel.java).

*Screenshot: Editora's View menu in an earlier build: chords in one periwinkle column, but half the rows have no icon and every title repeats the menu's name.*

## Right-click menus

- **MENU-05 · MUST.** Every list row, tree row, tab, editor and read-only console has a right-click menu with the
  actions for *that* thing, each one a command.
  - *Check (by hand):* right-click each kind of thing; every row's action is also in the palette.
  - *Reference:* Editora [`ui/TabContextMenu.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/TabContextMenu.java), [`ui/RowContextMenu.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/RowContextMenu.java), [`ui/ConsoleContextMenu.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/ConsoleContextMenu.java).

The mockup is an editor tab's menu, shortened; Editora's has twenty-five rows.

*Mockup of a tab's right-click menu. Drawn on the page; the numbers below mark its parts.*

1. **Anchored at the pointer.** The menu's top-left corner is the click. From the keyboard (Menu key or `Shift+F10`) it opens under the selected row, a quarter of the way in and never off a narrow one, or just below the caret in an editor; never in the middle of the control.
2. **Every row has an icon**, the command's own, and its chord when it has one, in the same periwinkle column as the menu bar's. The one row without an icon is a `CheckMenuItem`, whose tick lives in the graphic column.
3. **Grayed, not hidden.** An action that does not apply right now (Save on an unchanged file, Reveal on an unsaved one) stays in place, dimmed. Only a row that cannot apply to this thing at all is hidden (the Git submenu on an untitled buffer).
4. **Separators** group the rows; one that hiding has left alone hides too.
5. **Submenu** for a family of actions (Git: stage, unstage, revert, compare, history), with its own icon.
6. **Labels follow state.** Encrypt… becomes Lock File on an encrypted buffer, Pin Tab becomes Unpin Tab. Decided on every showing, not when the menu was built.

### Behavior

- **MENU-06 · MUST.** One right-click menu at a time: a right-click while a menu is open replaces it, and the first
  one closes before the second shows.
  - *Why:* JavaFX stacks a second menu beside the first when each row owns its own `ContextMenu`, and the stale one
    is then no longer dismissible.
  - *Check (test):* an FX test right-clicks another row with a menu open and finds one menu showing.
  - *Reference:* Editora [`ui/ContextMenuDismissal.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/ContextMenuDismissal.java) closes every open right-click menu on the press that opens
    the next ([`ContextMenuDismissalFxTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/ui/ContextMenuDismissalFxTest.java)); Modula's [`RadioPane`](https://github.com/adriandeleon/Modula/blob/518300a4c2114909315fbd3a73acc999fb4c16b5/src/main/java/com/modula/ui/RadioPane.java) hides the previous menu before showing a new one;
    Termina keeps one menu per view and shows it again.
- **MENU-07 · MUST.** A press anywhere outside a right-click menu closes it, including inside the control the menu
  was opened on. The press is not consumed: a click in a list still selects the row, and a right-click on another
  row opens that row's menu straight away. Drop-downs opened by a plain click (menu buttons, choice boxes, the menu
  bar) keep the stock behavior, and a menu that turned auto-hide off is left alone.
  - *Why:* JavaFX's auto-hide deliberately ignores a press on the menu's *owner node*, so a stock menu on a tree or
    a text area stays open when the user clicks another row or the text.
  - *Check (test):* an FX test clicks inside the owner control and in another window, and the menu closes.
  - *Reference:* Editora [`ContextMenuDismissal.install()`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/ContextMenuDismissal.java), called once in [`App`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/App.java) at startup for every current and
    future window; [`ContextMenuDismissalFxTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/ui/ContextMenuDismissalFxTest.java).
- **MENU-08 · MUST.** Escape closes a right-click menu and focus goes back where it was. In a terminal the Escape
  does not reach the shell.
  - *Check (by hand):* open a menu, press Escape, and type: the keys reach the control that had focus.
  - *Reference:* the stock `ContextMenu` hide-on-Escape (Spec below); Termina's `onKeyPressed` filter hides the menu
    and consumes the key ([`TerminalView`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/TerminalView.java)).
- **MENU-09 · MUST.** The Menu key and `Shift+F10` open the selected row's menu, scrolled into view first,
  so every row action a mouse can reach the keyboard can too.
  - *Why:* those keys arrive at the focused control, not at a row's cell, so a menu installed on cells never saw
    them.
  - *Check (test):* an FX test sends a keyboard request to a tree and a list and finds the selected row's menu,
    anchored to that row.
  - *Reference:* Editora [`RowContextMenu.install(tree)`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/RowContextMenu.java), [`RowContextMenuFxTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/ui/RowContextMenuFxTest.java).
- **MENU-17 · SHOULD.** The in-window menu bar is reachable from the keyboard in every keymap. JavaFX opens its first
  menu on `F10` (`Ctrl+F10` on macOS) and on a lone `Alt`; a keymap that binds that key to something else binds a
  command that focuses the menu bar instead.
  - *Why:* the menus are a keyboard user's map of the app; a chord that never reaches them hides it.
  - *Check (by hand):* in each keymap, reach the first menu with the keyboard alone and walk the bar with the arrows.
  - *Reference:* no app yet. Editora's CUA, VS Code and Sublime keymaps bind `F10` to `debug.stepOver`
    ([`keymaps/cua.json`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/resources/com/editora/keymaps/cua.json)), and no command focuses the bar.
- **MENU-10 · SHOULD.** A right-click selects first. In an editor, a right-click outside every selection moves the
  caret to the click (so Paste lands there); inside a selection it keeps carets and selections (so Cut and Copy act
  on what was clicked). From the keyboard the target is the caret. In a list, the menu is the clicked row's.
  - *Check (by hand):* select a word, right-click elsewhere and paste; then right-click inside a selection and copy.
  - *Reference:* Editora [`editor/ContextMenuTarget.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/editor/ContextMenuTarget.java).
- **MENU-11 · SHOULD.** A menu attached to something that exists once per open file is built when first shown, and
  set up for each showing: an `onShowing` handler sets the labels, enablement and visibility for *this* showing,
  then collapses the separators.
  - *Why:* such a menu is built for every file and opened for almost none.
  - *Check (code):* per-file menus are created through `LazyContextMenu.of(build)`.
  - *Reference:* Editora [`ui/LazyContextMenu.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/LazyContextMenu.java), [`LazyContextMenuFxTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/ui/LazyContextMenuFxTest.java). A read-only console's menu is just
    Select All and Copy, both disabled while it is empty ([`ConsoleContextMenu`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/ConsoleContextMenu.java)).
- **MENU-12 · SHOULD.** A destructive row carries the `danger` class. The action follows the
  [window shell](https://pauta-project.dev/5.0.0/window-shell/) rule: it asks first with a button that names it, or is undoable.
  - *Check (code):* rows that delete, discard or reset add `danger` to their style classes.
  - *Reference:* Editora `.menu-item.danger` in [`app.css`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/resources/com/editora/styles/app.css), [`ui/BranchPopup.java`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/BranchPopup.java).
- **MENU-13 · MAY.** In a terminal view, a program that grabbed the mouse owns the right-click;
  `Shift`+right-click always opens the menu, and the keyboard request is never contested.
  - *Check (test):* a pure test of when the menu shows, per mouse mode, Shift and trigger.
  - *Reference:* Termina's [`TerminalView.shouldShowMenu`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/TerminalView.java), [`ContextMenuContentionTest`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/test/java/com/termina/ui/ContextMenuContentionTest.java).

### Spec

| Property | Value | Reference |
|---|---|---|
| Kind | `javafx.scene.control.ContextMenu`, auto-hide on, hide on Escape on: a popup window, unlike the palette | `TabContextMenu`, `ConsoleContextMenu` |
| Opens at | The pointer; from the keyboard, the selected row's bottom edge at min(width ÷ 4, 48) px in, or under the caret | `RowContextMenu.anchorX`, `ContextMenuTarget` |
| Font | Inter 14 px, pinned on `.context-menu`, whatever the owner's font | `app.css` |
| Rows | 34 px (padding 8 × 12); icon column 22 px; glyph scaled 0.8 from a 24 dp Material path, or a 16-unit line glyph | `Icons.ICON_SCALE`, `Icons.line` |
| Card | Radius 8, shadow radius 16 at offset Y 16 | `.context-menu` |
| Dismissal | Any press outside the menu, in any window; the next right-click; Escape | `ContextMenuDismissal`, `ContextMenuDismissalFxTest` |
| Marker | A showing menu opened by a right-click or the Menu key carries the window property `editora.rightClickMenu` | `ContextMenuDismissal.RIGHT_CLICK_MENU` |

## In the apps

*Screenshot: Termina's tab menu: an icon on every row, following Editora's convention.*
*Screenshot: Editora's in-window menu bar with the chord column, in an earlier build whose rows still lack icons and repeat the menu's name.*
