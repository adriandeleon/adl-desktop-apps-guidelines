# Menus

> The menu bar and right-click menus: the chord on every row, an icon where one fits, one font, one menu at a time, and a press anywhere else closes it.

Pauta 6.1.0 (2026-11-14). The page with its screenshots and mockups: https://pauta-project.dev/6.1.0/menus/.
Every rule of the edition: https://pauta-project.dev/6.1.0/llms-full.txt.

Two surfaces show the same rows: the **menu bar**, a browsable map of every command, and **right-click menus**, what
can be done with the thing under the pointer. A row built from the [command registry](https://pauta-project.dev/6.1.0/keyboard/) takes its title,
icon, chord and enabled state from the command, so it never drifts from the palette or the toolbar. Editora builds
its menu bar that way ([`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MenuBarModel.java)); its right-click menus are still built by hand, each row with its own
title, glyph and action ([`LazyContextMenu.item`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/LazyContextMenu.java)). The app template's [`ui/CommandMenu.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/CommandMenu.java) builds a right-click
menu from registered command ids.
Reference: Editora's [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MainMenuBar.java) (menu bar), [`ui/ContextMenuDismissal.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/ContextMenuDismissal.java), [`ui/LazyContextMenu.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/LazyContextMenu.java),
[`ui/RowContextMenu.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/RowContextMenu.java) and [`ui/TabContextMenu.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/TabContextMenu.java) (right-click menus), and the `.menu-item` and `.context-menu`
rules in [`app.css`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/resources/com/editora/styles/app.css).

## Look and feel

Both surfaces draw their rows the same way, and the sizes in the table are the ones at the default zoom. A menu sets
its own font size on `.context-menu`, 14 px at the default zoom, from the one value the UI zoom sets
([WIN-12](https://pauta-project.dev/6.1.0/window-shell/#win-12)), so it never inherits its owner's: a popup takes the font of the node it was
opened from, and `em` would resolve against a file tree's or an 18 px toolbar's size (Editora's toolbar menu once
rendered a third larger than every other menu in the app).

| Property | Value | Reference |
|---|---|---|
| Font | Inter 14 px at the default zoom, regular, in every row and label; set on `.context-menu` from the value the UI zoom sets, never inherited from the owner | `.context-menu`, `.context-menu .menu-item .label` in `app.css`; `MainMenuBar.UI_FONT_SIZE` |
| Row | 34 px high: padding 8 × 12, the same in every theme | `.menu-item { -fx-padding: 8px 12px }` |
| Icon column | 22 px on every row, so the titles line up: a row's glyph, a check row's tick, or empty; 8 px to the title | `MainMenuBar.ICON_COLUMN`, `rowContent` |
| Icon | Optional; where a row has one, the command's glyph, the same one as on the toolbar and in the palette (Save is the same floppy everywhere), filled `-color-fg-muted` | `Icons`, `MenuBarIcons`, `.toolbar-icon` |
| Title | Inter 14 px, `-color-fg-default` | `.menu-item-title` |
| Chord | Right-aligned in its own column, Inter 11 px, in the keyboard color (`-state-key`, brace periwinkle); at least 18 px from the title column; in every menu, right-click menus included | `.menu-item-chord`, `alignChordColumns` |
| Submenu row | Laid out like a command row, with an invisible chord as wide as the menu's widest, so the arrow lands at the right edge | `nestedMenu`, `.menu-submenu` |
| Card | Radius 8; shadow `rgba(27,30,42,0.28)`, the value of a token defined on `.root` ([ICON-08](https://pauta-project.dev/6.1.0/icons-and-color/#icon-08)), radius 16, **offset Y 16** | `.context-menu` |
| Danger item | Text in `-color-danger-fg` | `.menu-item.danger` |
| Disabled item | The theme's dimmed label, and the icon dimmed with it | Termina's `.menu-item:disabled .menu-icon` |
| Separators | Never two in a row and none at either end: when items hide, their orphaned separators hide too | `LazyContextMenu.collapseSeparators`, Torrenta's [`MenuSeparators`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/MenuSeparators.java) |

The shadow's offset is not cosmetic. A menu is a native window sized to its root *including the effect*, so a shadow
that reaches above the menu is invisible window over the bar the menu hangs from, and the pointer lands on it instead
of the next menu button. [MENU-18](https://pauta-project.dev/6.1.0/menus/#menu-18) asks for an offset of at least the radius; Editora pins it with [`MenuPopupBoundsFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/MenuPopupBoundsFxTest.java).

The rules of this section hold for every menu the app draws itself: the menu bar, right-click menus, the drop-down of
a menu button or a split button, and the toolbar's overflow. The menus a platform draws (the macOS system menu bar, a
tray icon's menu) show text only; there the chord is appended to the title ([MENU-02](https://pauta-project.dev/6.1.0/menus/#menu-02)) and the
[tray](https://pauta-project.dev/6.1.0/tray-and-background/) shows neither.

- **MENU-14 · MAY.** A row of a menu the app draws may carry an icon, where a glyph depicts what the row does or
  names: a command row its command's glyph, a row that names a thing rather than an action (a recent file, a branch,
  a project) that thing's icon, a submenu its family's. A row with no fitting glyph goes without one rather than
  borrow another command's, and a check or radio row carries none, because its mark fills the icon column.
  - *Why:* a glyph the eye already knows from the toolbar and the palette ([ICON-20](https://pauta-project.dev/6.1.0/icons-and-color/#icon-20))
    finds a row before its title is read, but only when it depicts the row: an icon forced onto every row ends up
    saying something else, and an empty cell says nothing wrong.
  - *Check (code):* where a row the app builds carries a glyph, it comes from the lookup the toolbar and the palette
    use, keyed by the row's command, and no row wears another command's glyph. A row without one is not judged.
  - *Reference:* Editora [`ui/MenuBarIcons.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MenuBarIcons.java), [`editor/MenuIcons.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/editor/MenuIcons.java), [`ui/TabContextMenu.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/TabContextMenu.java): about
    half its menu-bar rows wear a glyph, and
    [`MenuBarIconsTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/MenuBarIconsTest.java) holds that a command without a fitting glyph gets none. Termina's tab menu has an
    icon on every row. The app template gives every row of its menus the command's glyph (`inWindowRow` in
    [`ui/AppMenus.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/AppMenus.java), from `BY_COMMAND` in [`ui/Icons.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/Icons.java)), and so does Mirada
    ([`MenusFxTest`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/test/java/com/mirada/ui/MenusFxTest.java), `everyRowOfEveryMenuHasAGlyph`).
- **MENU-15 · MUST.** In every menu the app draws itself, a row whose command has a chord in the active keymap shows
  that chord, in right-click menus, drop-downs and the toolbar's overflow as in the in-window menu bar: right-aligned
  in the menu's chord column, in the keyboard color, the one color the app keeps for chords and key chips (Editora's
  token for it is `-state-key`; [ICON-06](https://pauta-project.dev/6.1.0/icons-and-color/#icon-06) says how the color is made), at the size
  [MENU-16](https://pauta-project.dev/6.1.0/menus/#menu-16) gives. An unbound command leaves the cell empty, never a wrong chord, and a keymap switch
  rewrites every cell. The menus a platform draws are outside this rule: the macOS system menu bar, whose rows append
  the chord to the title ([MENU-02](https://pauta-project.dev/6.1.0/menus/#menu-02)), and a tray icon's menu, which shows none.
  - *Why:* the menu is where a user learns the keys. A right-click menu that hides them teaches the mouse, while the
    palette and the toolbar's tooltips already show the same chord.
  - *Check (code):* in the in-window menu bar, in every right-click menu and in every drop-down, a row that runs a
    command has a chord cell, right-aligned in one column of the menu, that the code fills with the active keymap's
    display chord for the command's id and leaves empty for an unbound command: a label of the row's own (Editora's
    `menu-item-chord`) or, outside the menu bar, the item's accelerator text, never a chord typed into a string. The
    cell is filled again on each showing or when the keymap changes, and the stylesheet draws it in the app's keyboard
    color at [MENU-16](https://pauta-project.dev/6.1.0/menus/#menu-16)'s size. An app whose menu rows run only commands that have no chord (nux's
    drop-downs: its one key table binds none of their commands) has nothing to show, and passes. A row of the macOS
    system menu bar is not judged here, since [MENU-02](https://pauta-project.dev/6.1.0/menus/#menu-02) has its chord appended to its title, and neither is
    a tray icon's menu. A test that binds a command, opens a right-click menu that lists it, finds its chord, and
    finds the new chord after a keymap switch is the surest evidence.
  - *Reference:* Editora [`MainMenuBar.rowContent`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MainMenuBar.java) and `alignChordColumns`, `.menu-item-chord` in [`app.css`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/resources/com/editora/styles/app.css), for
    the menu bar. Its editor, editor tab, preview and output-console right-click menus show them too: a row tagged
    with the command it does ([`editor/MenuChords.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/editor/MenuChords.java), `tag`) carries that command's chord as an
    accelerator that only displays, re-read from the active keymap each time a right-click menu opens (`refresh`),
    and `.accelerator-text` in its `app.css` draws it in `-state-key` at 11 px ([`MenuChordsTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/editor/MenuChordsTest.java),
    [`ContextMenuFontFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/ContextMenuFontFxTest.java)). Editora doesn't meet the rule yet: its other right-click menus and its drop-downs
    tag no row, so the Copy, Select All, Add Bookmark and Add Note of a Project Map card's menu show no chord
    ([`ui/ProjectMapPreview.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/ProjectMapPreview.java)). The app template's right-click menus show them: [`ui/CommandMenu.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/CommandMenu.java) draws each row as the menu
    bar's ([`AppMenus.inWindowRow`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/AppMenus.java)) and re-reads its chord on every showing (`refresh`), in `-state-key` at
    11 px (`.menu-item-chord` in its [`app.css`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/resources/com/example/app/styles/app.css)); its [`MenuLookFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/ui/MenuLookFxTest.java)
    (`aRightClickMenuShowsEachChordInTheKeyColorAndFollowsTheKeymap`) opens a right-click menu, reads the chord
    and reads the new one after a keymap switch. Termina's menu bar colors its chords `-color-fg-muted`, not a
    keyboard color ([`app.css`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/resources/com/termina/styles/app.css)).
- **MENU-16 · MUST.** Every menu the app draws itself (the in-window menu bar, right-click menus, the drop-down of a
  menu button or a split button, the toolbar's overflow) draws its titles in Inter 14 px regular and its chords in
  Inter 11 px at the default zoom, scaled by the UI zoom ([WIN-12](https://pauta-project.dev/6.1.0/window-shell/#win-12)), whatever node it was
  opened from: the size is set on `.context-menu` and its rows' labels from one value the zoom sets, never inherited
  from the node. The macOS system menu bar and a tray icon's menu are the platform's, drawn in the platform's font,
  and outside this rule.
  - *Why:* a popup inherits the font of the node it was shown from, and `em` resolves against it: Editora's toolbar
    menu once rendered at the bar's 18 px, a third larger than every other menu, and a file tree's or a monospace
    editor's font leaks the same way.
  - *Check (code):* the stylesheet sets the font family and the size on `.context-menu` and on its rows' title and
    chord labels from one value, in pixels and never in `em`, so the font of the node a menu was opened from
    cannot reach it; and the code that applies the UI zoom rewrites that value, so the 14 px and the 11 px scale
    with the zoom. A test that opens a menu from the toolbar, an editor and a tree row and reads Inter 14 px from
    each row's title, and 14 px times the zoom after the UI zoom changes, is the surest evidence.
  - *Reference:* Editora `.context-menu` and `.menu-item-chord` in [`app.css`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/resources/com/editora/styles/app.css), [`MainMenuBar.UI_FONT_SIZE`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MainMenuBar.java),
    [`ToolbarMenuFontFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/ToolbarMenuFontFxTest.java) and [`ContextMenuFontFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/ContextMenuFontFxTest.java). Editora writes 14 px and 11 px as absolute pixels and has no UI
    zoom yet ([WIN-12](https://pauta-project.dev/6.1.0/window-shell/#win-12)), so its menus keep their size whatever opens them but don't scale.
    The app template meets it: `.context-menu` and its rows' labels in its [`app.css`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/resources/com/example/app/styles/app.css) are pinned to Inter 14 px and
    the chord to 11 px, in pixels, which its UI zoom multiplies ([`ui/UiZoom.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/UiZoom.java)), and its
    [`MenuLookFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/ui/MenuLookFxTest.java) (`everyMenuDrawsInInterFourteenWhateverOpenedIt`, `theUiZoomScalesEveryMenu`) holds both.
- **MENU-18 · SHOULD.** At the default zoom a menu row is 34 px high (padding 8 × 12), its icon column is 22 px wide
  with 8 px to the title, and its chord starts at least 18 px after the title column. The popup's card has a radius
  of 8 and a shadow of radius 16 at offset Y 16: the offset is at least the radius.
  - *Why:* one row in every app is what makes the menus one family's. And a menu is a native window sized to its
    root with the effect included, so a shadow that reaches above the menu is invisible window over the bar the
    menu hangs from, and the pointer lands on it instead of the next menu button.
  - *Check (code):* the stylesheet sets the row's padding and the popup's radius and shadow, with the shadow's
    offset no smaller than its radius; the row's layout sets the icon column's width and the chord's margin.
  - *Reference:* Editora `.menu-item` and `.context-menu` in [`app.css`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/resources/com/editora/styles/app.css), and [`MainMenuBar.ICON_COLUMN`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MainMenuBar.java) and
    `rowContent`; [`MenuPopupBoundsFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/MenuPopupBoundsFxTest.java) holds the shadow below the popup. The app
    template draws the same card and row: `.context-menu` in its [`app.css`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/resources/com/example/app/styles/app.css) (radius 8, a shadow of radius 16 at
    offset Y 16, rows padded 8 × 12) and `inWindowRow` in its [`ui/AppMenus.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/AppMenus.java) (a 22 px icon column, `ICON_SLOT`, 8 px
    to the title and an 18 px chord margin). Termina and Torrenta get the row's padding from the Editora themes
    they ship, and keep those themes' popup: a radius of 4 and a shadow of radius 6 (8 in the dark theme) at offset
    Y 2 (`.menu-item` and `.context-menu` in each one's `editora-light.css` and `editora-dark.css`). Termina's [`ui/MenuRows.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/MenuRows.java) has
    the same 22 px column and 18 px chord margin. Mirada and nux write no radius or shadow for `.context-menu` and take
    their AtlantaFX theme's popup (Cupertino, Primer). Modula's [`modula.css`](https://github.com/adriandeleon/Modula/blob/518300a4c2114909315fbd3a73acc999fb4c16b5/src/main/resources/com/modula/modula.css) gives `.context-menu` a radius of 8 and
    a shadow of radius 20 at offset Y 6, and its rows a padding of 4 × 8.

## The menu bar

**Applies to:** an app with a menu bar.

*Mockup of the File menu open under the menu bar. Drawn on the page; the numbers below mark its parts.*

1. **Menu button.** Padding 3 × 10 on a bar with 4 px side insets; the bar and the toolbar share one `-color-bg-subtle` band with no rule under it.
2. **Icon column**, 22 px. A row may wear the glyph that depicts its command; where none fits, the cell stays empty and the titles still line up.
3. **Title**, 14 px Inter, the command's title with its category prefix dropped ("Save", not "File: Save") unless two rows would then read the same. Editora drops the prefix only where two words or more are left ("File: Save As…" reads "Save As…"), so its File menu still reads "File: Save" ([`editor/MenuTitles.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/editor/MenuTitles.java)).
4. **Chord column.** Inter 11 px, periwinkle, right-aligned into one column per menu (not app-wide), read from the active keymap. Drawn by the app, not a JavaFX accelerator: Emacs chords are multi-key, which a `KeyCombination` cannot express, and on macOS an accelerator would bypass the key dispatcher.
5. **Unbound command.** An empty chord cell, never a wrong chord. A live keymap switch rewrites every cell.
6. **Submenu row.** Icon, title and an invisible chord as wide as the menu's widest, so its arrow sits at the right edge instead of halfway across.
7. **Card.** Radius 8; the shadow falls below the menu (offset ≥ radius), so nothing invisible covers the bar.

- **MENU-01 · MUST.** Every menu-bar item is a command from the registry, with the command's title
  ([KBD-03](https://pauta-project.dev/6.1.0/keyboard/#kbd-03)), its chord from the active keymap and its enabled state from the command's gate.
  A row may show the title without its category prefix ("Save As…" for "File: Save As…"); it never carries a title
  of its own. The bar assembles and refreshes; it holds no behavior of its own.
  - *Check (code):* the bar's model lists command ids only, beside the separators and the submenus that group them,
    and every row runs its id through the registry. A row that is no command id fails: one built by hand, with a title
    and a handler of its own.
  - *Reference:* Editora [`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MenuBarModel.java) over [`command/CommandRegistry.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/command/CommandRegistry.java), [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MainMenuBar.java): the
    model's entries are command ids, separators and the titles of its submenus. Torrenta and Termina don't meet the
    rule yet. Rows of Torrenta's View menu, the Command Palette, Toolbar, Sidebar and Simple Mode rows among them, are
    built by hand with `menu.*` titles and handlers of their own ([`ui/MainWindow.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/MainWindow.java)). Termina's model
    ([`ui/MenuBarModel.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/MenuBarModel.java)) holds rows that are no command id: the New Tab With Profile submenu, whose rows
    carry each profile's name and open the tab from a handler of their own (`profileBarRows` in
    [`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/TerminalWindow.java)), and, off macOS, the zoom row, one row of buttons for its four zoom commands.
- **MENU-02 · MUST.** Menu-bar rows use no `KeyCombination` accelerators. In the in-window bar each row is a
  `CustomMenuItem` laying out icon, title, spacer and chord. On the macOS system menu bar (`useSystemMenuBar`) the
  chord is appended to the title and rows carry no icon.
  - *Why:* Emacs chords are multi-key, which a `KeyCombination` cannot express, and on macOS an accelerator would
    bypass the key dispatcher. The native macOS menu draws text only and no graphics, which is also the platform's
    convention.
  - *Check (code):* no menu-bar row calls `setAccelerator`; each row of the in-window bar is a `CustomMenuItem`
    whose content lays out the icon, the title, a spacer and the chord; and where the bar is the macOS system menu
    bar, a row's text is the title with the chord appended and the row has no graphic.
  - *Reference:* Editora [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MainMenuBar.java) (`rowContent`, `refresh`).
- **MENU-03 · SHOULD.** Enablement is re-read every time a menu opens, and titles and chords on a keymap or locale
  change.
  - *Why:* a menu built before Git finished detecting a repository must not stay grayed out.
  - *Check (code):* each menu's on-showing handler reads every row's enabled state from its command again, and
    the code that switches the keymap or the locale rewrites every row's title and chord. A test that changes a
    command's state after the window is built (a repository detected late) and finds the row enabled is the surest
    evidence.
  - *Reference:* Editora [`MainMenuBar.refreshEnablement`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MainMenuBar.java), [`MenuBarEnablementFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/MenuBarEnablementFxTest.java).
- **MENU-04 · SHOULD.** An app with a Simple mode shows a shorter menu in it, rebuilt only when the mode actually
  changes.
  - *Check (code):* the bar rebuilds only when the simple flag differs from the current one.
  - *Reference:* Editora [`MainMenuBar.setSimple`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MainMenuBar.java), [`MenuBarModel.menus(simple)`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MenuBarModel.java).
- **MENU-17 · SHOULD.** The in-window menu bar, the one an app shows on Windows and Linux
  ([WIN-03](https://pauta-project.dev/6.1.0/window-shell/#win-03)), is reachable from the keyboard in every keymap. JavaFX opens the bar's first
  menu on `F10` and on a lone `Alt`; a keymap that binds `F10` to something else binds a command that focuses the
  menu bar instead. So does a terminal app, where a plain `F10` goes to the program it runs. The macOS system menu
  bar is reached with the OS's own keys and asks nothing of the app.
  - *Why:* the menus are a keyboard user's map of the app; a chord that never reaches them hides it.
  - *Check (by hand):* on Windows or Linux, in each keymap, reach the first menu with the keyboard alone and walk
    the bar with the arrows.
  - *Reference:* no app yet. Editora's CUA, VS Code and Sublime keymaps bind `F10` to `debug.stepOver`
    ([`keymaps/cua.json`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/resources/com/editora/keymaps/cua.json)), and no command focuses the bar. Termina leaves a plain `F10` to the program in the
    terminal ([`ui/ViewKeys.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/ViewKeys.java)) and has no such command either.

*Screenshot: Editora's View menu in an earlier build: chords in one periwinkle column, but every title repeats the menu's name.*

## Right-click menus

**Applies to:** an app with a right-click menu: a menu the app builds and opens on a right-click, the Menu key or
`Shift+F10`, over something in one of its windows. The stock Cut, Copy and Paste menu that JavaFX gives a text
field does not make an app one, and neither does a tray icon's menu, which the platform draws: nux has both and
no right-click menu.

- **MENU-05 · MUST.** In an app with a right-click menu, every list row, tree row, tab, editor and read-only
  console has one, with the actions for *that* thing, and every action in a right-click menu is a command
  ([KBD-01](https://pauta-project.dev/6.1.0/keyboard/#kbd-01)). The rule covers the lists, trees, tabs, editors and read-only consoles in the
  app's windows. A log shown as text, the Debug Log among them, is a read-only console and has its right-click
  menu. A list that only navigates, switching what its window shows (a Settings sidebar, a list of pages), has no
  actions of its own and is outside the rule, as are the overlay list of a picker or a palette and a plain text
  area in a dialog.
  - *Check (code):* list the lists, trees, tab strips, editors and read-only consoles in the app's windows, the
    text of the Debug Log window and of any other log shown as text among the consoles, and find the right-click
    menu each one installs; then read every row of every right-click menu the app builds: its action is one a
    registered command runs too, by the command's id through the registry or by calling what the command calls, so
    the palette reaches it. A row whose action no command runs fails, as does a list, tree, tab strip, editor or
    console with no menu; the stock Cut, Copy and Paste menu that JavaFX gives a text area is not one. A list
    that only switches what its window shows (a Settings sidebar, a list of pages), the overlay list of a picker
    or a palette and a plain text area in a dialog are not judged.
  - *Reference:* the app template's [`ui/CommandMenu.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/CommandMenu.java), which builds each menu from registered command ids and
    runs a row through the registry (`onRow` for a list row, `onConsole` for a text area): the tabs and the editor
    ([`ui/DocumentTabs.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/DocumentTabs.java)), the Output console ([`ui/MainWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/MainWindow.java)), the Debug Log
    ([`ui/DebugLogWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/DebugLogWindow.java)), the Documents list, the Message Log's rows and Settings' pages and key bindings
    ([`RightClickMenusFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/ui/RightClickMenusFxTest.java)). Editora's [`ui/TabContextMenu.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/TabContextMenu.java) and [`ui/ConsoleContextMenu.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/ConsoleContextMenu.java) are menus this
    rule describes ([`ui/RowContextMenu.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/RowContextMenu.java) builds none: it sends the keyboard's request to the selected row's own
    menu), but their rows are built by hand and call the window's methods, not a command id, so nothing holds that
    each row has a command. Editora, Termina, Mirada, Torrenta and Modula don't meet the rule yet, in these places
    among others. In Editora the trees and the list of the Hierarchy, References and Undo History panels have no
    right-click menu ([`ui/HierarchyPanel.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/HierarchyPanel.java), [`ui/ReferencesPanel.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/ReferencesPanel.java), [`ui/UndoHistoryPanel.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/UndoHistoryPanel.java)), and the
    Customize Toolbar… row of the toolbar's menu turns on a mode that no command does (`showContextMenu` in
    [`ui/ToolbarCoordinator.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/ToolbarCoordinator.java)). In Termina the list of the Message Log has no menu
    ([`ui/MessageLogWindow.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/MessageLogWindow.java)), and neither has Mirada's ([`ui/MessageLogView.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/MessageLogView.java)). The Debug Log
    windows of Editora, Torrenta, Termina and Mirada show the log in a read-only `TextArea` and give it no menu
    (Editora's [`ui/DebugLogWindow.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/DebugLogWindow.java), Torrenta's [`ui/DebugLogWindow.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/DebugLogWindow.java), Termina's
    [`ui/DebugLogWindow.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/DebugLogWindow.java) and Mirada's [`ui/DebugLogWindow.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/DebugLogWindow.java)). In Torrenta the rows of the
    files and peers menus, Ban Peer among them, run handlers that no command reaches ([`ui/DetailPane.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/DetailPane.java)). In
    Modula the Rename… and Remove rows of a preset chip's menu ([`ui/PresetBar.java`](https://github.com/adriandeleon/Modula/blob/518300a4c2114909315fbd3a73acc999fb4c16b5/src/main/java/com/modula/ui/PresetBar.java)) run no command, and its command
    list has neither ([`ui/RadioPane.java`](https://github.com/adriandeleon/Modula/blob/518300a4c2114909315fbd3a73acc999fb4c16b5/src/main/java/com/modula/ui/RadioPane.java), `commands`).

The mockup is an editor tab's menu, shortened; Editora's has twenty-one rows.

*Mockup of a tab's right-click menu. Drawn on the page; the numbers below mark its parts.*

1. **Anchored at the pointer.** The menu's top-left corner is the click. From the keyboard (Menu key or `Shift+F10`) it opens under the selected row, a quarter of the way in and never off a narrow one, or just below the caret in an editor; never in the middle of the control.
2. **Icon and chord.** A row wears its command's own icon where one fits, and its chord when it has one, in the same periwinkle column as the menu bar's. A `CheckMenuItem` has no icon: its tick lives in the graphic column.
3. **Grayed, not hidden.** An action that does not apply right now (Save on an unchanged file, Reveal on an unsaved one) stays in place, dimmed. Only a row that cannot apply to this thing at all is hidden (the Git submenu on an untitled buffer).
4. **Separators** group the rows; one that hiding has left alone hides too.
5. **Submenu** for a family of actions (Git: stage, unstage, revert, compare, history), with its own icon.
6. **Labels follow state.** Encrypt… becomes Lock File on an encrypted buffer, Pin Tab becomes Unpin Tab. Decided on every showing, not when the menu was built.

### Behavior

- **MENU-06 · MUST.** One right-click menu at a time: a right-click while a menu is open replaces it, and the first
  one closes before the second shows.
  - *Why:* JavaFX stacks a second menu beside the first when each row owns its own `ContextMenu`, and the stale one
    is then no longer dismissible.
  - *Check (code):* the code that opens a right-click menu closes the one already showing before the next
    appears, in every window: the app keeps one menu and shows it again at the new place, or hides the showing
    menu in the handler of the press or the request that opens the next. Menus that each row or cell owns, with
    nothing to close the one shown last, fail. A test that right-clicks another row with a menu open and finds one
    menu showing is the surest evidence.
  - *Reference:* Editora [`ui/ContextMenuDismissal.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/ContextMenuDismissal.java) closes every open right-click menu on the press that opens
    the next ([`ContextMenuDismissalFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/ContextMenuDismissalFxTest.java)), and its toolbar keeps one menu and shows it again, so a second
    right-click on the bar moves it ([`ToolbarCoordinator`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/ToolbarCoordinator.java), [`ToolbarContextMenuDismissFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/ToolbarContextMenuDismissFxTest.java)); Termina's [`ui/OneMenu.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/OneMenu.java)
    closes every other menu as one starts to show ([`OneMenuTest`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/test/java/com/termina/ui/OneMenuTest.java)), and the app template's [`RightClickMenusFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/ui/RightClickMenusFxTest.java)
    (`aRightClickOnAnotherRowLeavesOneMenu`) holds it for a list's rows. Modula's [`RadioPane`](https://github.com/adriandeleon/Modula/blob/518300a4c2114909315fbd3a73acc999fb4c16b5/src/main/java/com/modula/ui/RadioPane.java) hides its own
    previous menu before it shows a new one, but Modula doesn't meet the rule yet: each preset chip owns a menu
    ([`ui/PresetBar.java`](https://github.com/adriandeleon/Modula/blob/518300a4c2114909315fbd3a73acc999fb4c16b5/src/main/java/com/modula/ui/PresetBar.java)), and no code closes the pane's menu when a chip's opens: the pane's press filter skips
    the right button, and the chip answers the menu request before the pane's handler can.
- **MENU-07 · MUST.** A press anywhere outside a right-click menu closes it, including inside the control the menu
  was opened on. The press is not consumed: a click in a list still selects the row, and a right-click on another
  row opens that row's menu straight away. Drop-downs opened by a plain click (menu buttons, choice boxes, the menu
  bar) keep the stock behavior, and a menu that turned auto-hide off is left alone.
  - *Why:* JavaFX's auto-hide deliberately ignores a press on the menu's *owner node*, so a stock menu on a tree or
    a text area stays open when the user clicks another row or the text.
  - *Check (code):* the app installs a mouse-press filter, on every window or on the scene of each window that
    has a right-click menu, that hides a showing right-click menu on a press outside the menu, a press inside its
    owner control included, and does not consume the press; a press in another window of the app closes the menu
    too, by the same filter or by the stock auto-hide. A right-click menu left with the stock auto-hide alone
    fails, since JavaFX ignores a press on the owner node. A test that presses inside the owner control and in
    another window and finds the menu closed is the surest evidence.
  - *Reference:* Editora [`ContextMenuDismissal.install()`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/ContextMenuDismissal.java), called once in [`App`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/App.java) at startup for every current and
    future window; [`ContextMenuDismissalFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/ContextMenuDismissalFxTest.java), and for the toolbar's menu, whose owner is the whole bar,
    [`ToolbarContextMenuDismissFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/ToolbarContextMenuDismissFxTest.java). The app template installs the same class at
    start-up. Mirada turns auto-hide off on its three menus and closes them from a press filter on the scene of
    each window that has one ([`ui/Popups.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/Popups.java), `closeOnPressOutside`). Termina's terminal view hides its menu from its own
    press filter, but its tab menus have the stock auto-hide alone ([`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/TerminalWindow.java)); so have Modula's preset chips
    ([`ui/PresetBar.java`](https://github.com/adriandeleon/Modula/blob/518300a4c2114909315fbd3a73acc999fb4c16b5/src/main/java/com/modula/ui/PresetBar.java)), beside a pane menu that its own filter closes, and every right-click menu in Torrenta. nux has no
    right-click menu.
- **MENU-08 · MUST.** Escape closes a right-click menu and focus goes back where it was. In a terminal app the
  Escape that closes the menu does not reach the shell.
  - *Check (by hand):* open a menu, press Escape, and type: the keys reach the control that had focus.
  - *Reference:* the stock `ContextMenu` hide-on-Escape (the right-click menus' [Spec](https://pauta-project.dev/6.1.0/menus/#spec)); Termina's `onKeyPressed` filter hides the menu
    and consumes the key ([`TerminalView`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/TerminalView.java)).
- **MENU-09 · MUST.** The Menu key and `Shift+F10` open the right-click menu of the selected row, scrolled into
  view first, so every row action a mouse can reach the keyboard can too. In a view with no rows (an editor, a
  terminal, an image) they open the focused view's menu. The chord is the same on macOS, where keyboards have no
  Menu key: `Shift+F10`, with no `Cmd` form.
  - *Why:* those keys arrive at the focused control, not at a row's cell, so a menu installed on cells never saw
    them.
  - *Check (code):* each list, tree or table whose rows have a right-click menu answers the keyboard's request
    (JavaFX's `ContextMenuEvent` with `isKeyboardTrigger()`, which it raises for both keys, or a key handler of
    the app's own for the Menu key and `Shift+F10`) by scrolling the selected row into view and showing that row's
    menu anchored to the row; a view with no rows shows its own menu for the same keys; and no branch gives macOS
    another chord. A test that sends the request to a tree and a list and finds the selected row's menu, anchored
    to that row, is the surest evidence.
  - *Reference:* Editora [`RowContextMenu.install(tree)`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/RowContextMenu.java), [`RowContextMenuFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/RowContextMenuFxTest.java): it answers the request
    JavaFX raises for those keys (`ContextMenuEvent.isKeyboardTrigger`). Termina's [`ui/ViewKeys.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/ViewKeys.java) and Mirada's
    [`Popups.isMenuKey`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/Popups.java) read the key press themselves, the same on every OS. One of Editora's keymaps gives the chord to a
    command as well: IntelliJ's binds `S-f10` to `run.rerun` ([`keymaps/intellij.json`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/resources/com/editora/keymaps/intellij.json)), a clash
    [`RowContextMenuFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/RowContextMenuFxTest.java) does not cover: it raises the request itself and presses no key. The app
    template's [`ui/RowContextMenu.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/RowContextMenu.java) answers the same request for a list's rows ([`RightClickMenusFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/ui/RightClickMenusFxTest.java),
    `theMenuKeyOpensTheSelectedRowsMenuAtThatRow`).
- **MENU-10 · SHOULD.** A right-click selects first. In an editor, a right-click outside every selection moves the
  caret to the click (so Paste lands there); inside a selection it keeps carets and selections (so Cut and Copy act
  on what was clicked). From the keyboard the target is the caret. In a list, the menu is the clicked row's.
  - *Check (by hand):* in an editor, select a word, right-click elsewhere and paste: the text lands at the click;
    then right-click inside a selection and copy: the selection is what was copied. In a list, select one row and
    right-click another: the menu that opens is the clicked row's, and its actions act on that row. An app with no
    editor is judged on its lists alone.
  - *Reference:* Editora [`editor/ContextMenuTarget.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/editor/ContextMenuTarget.java).
- **MENU-11 · SHOULD.** A menu attached to something that exists once per open file is built when first shown, and
  set up for each showing: an `onShowing` handler sets the labels, enablement and visibility for *this* showing,
  then collapses the separators.
  - *Why:* such a menu is built for every file and opened for almost none.
  - *Check (code):* a menu that exists once per open file is not built with the file: its items are created in
    the handler of its first request, and an on-showing handler sets their labels, enablement and visibility and
    then collapses the separators (Editora's `LazyContextMenu.of(build)`).
  - *Reference:* Editora [`ui/LazyContextMenu.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/LazyContextMenu.java), [`LazyContextMenuFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/LazyContextMenuFxTest.java). A read-only console's menu is just
    Select All and Copy, both disabled while it is empty ([`ConsoleContextMenu`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/ConsoleContextMenu.java)).
- **MENU-12 · SHOULD.** A destructive row is styled as dangerous, its text in `-color-danger-fg` (Editora's style
  class for it is `danger`). What the action does before it destroys anything is not this rule's: the
  [Confirm dialog](https://pauta-project.dev/6.1.0/templates/confirm-dialog/) rules hold it ([CONF-01](https://pauta-project.dev/6.1.0/templates/confirm-dialog/#conf-01),
  [CONF-03](https://pauta-project.dev/6.1.0/templates/confirm-dialog/#conf-03): it asks first with a button that names it, or is undoable).
  - *Check (code):* rows that delete, discard or reset carry the style class that colors their text `-color-danger-fg`
    (Editora's `danger`). Whether the action asks first is judged under CONF-01 and CONF-03, not here.
  - *Reference:* Editora `.menu-item.danger` in [`app.css`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/resources/com/editora/styles/app.css), [`ui/BranchPopup.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/BranchPopup.java); the app template's [`ui/AppMenus.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/AppMenus.java) (`DESTRUCTIVE`: the rows
    that clear a log, reset a binding or import a configuration take `danger`), held by [`RightClickMenusFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/ui/RightClickMenusFxTest.java)
    (`destructiveRowsAreStyledAsDangerous`).
- **MENU-13 · MAY.** In a terminal view, a program that grabbed the mouse owns the right-click;
  `Shift`+right-click always opens the menu, and the keyboard request is never contested.
  - *Check (code):* the terminal view decides whether to show its menu from the mouse mode, Shift and the
    trigger: a right-click while a program has the mouse goes to the program unless Shift is held, and a request
    from the keyboard always shows the menu. A test of that decision is the surest evidence.
  - *Reference:* Termina's [`TerminalView.shouldShowMenu`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/TerminalView.java), [`ContextMenuContentionTest`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/test/java/com/termina/ui/ContextMenuContentionTest.java).

### Spec

| Property | Value | Reference |
|---|---|---|
| Kind | `javafx.scene.control.ContextMenu`, auto-hide on, hide on Escape on: a popup window, unlike the palette | `TabContextMenu`, `ConsoleContextMenu` |
| Opens at | The pointer; from the keyboard, the selected row's bottom edge at min(width ÷ 4, 48) px in, or under the caret | `RowContextMenu.anchorX`, `ContextMenuTarget` |
| Font | Inter 14 px at the default zoom, set on `.context-menu` from one value the UI zoom sets, so it never inherits the owner's font | `app.css` |
| Rows | 34 px (padding 8 × 12); icon column 22 px; glyph scaled 0.8 from a 24 dp Material path, or a 16-unit line glyph | `Icons.ICON_SCALE`, `Icons.line` |
| Card | Radius 8, shadow radius 16 at offset Y 16 | `.context-menu` |
| Dismissal | Any press outside the menu, in any window; the next right-click; Escape | `ContextMenuDismissal`, `ContextMenuDismissalFxTest` |
| Marker | A showing menu opened by a right-click or the Menu key carries the window property `editora.rightClickMenu` | `ContextMenuDismissal.RIGHT_CLICK_MENU` |

## In the apps

*Screenshot: Termina's tab menu: an icon on every row, following Editora's convention.*
*Screenshot: Editora's in-window menu bar with the chord column, in an earlier build whose titles repeat the menu's name.*
