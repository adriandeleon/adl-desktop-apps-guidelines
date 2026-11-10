---
title: "Menus"
description: "The menu bar and right-click menus: an icon and the chord on every row, one font, one menu at a time, and a press anywhere else closes it."
---

Two surfaces show the same rows: the **menu bar**, a browsable map of every command, and **right-click menus**, what
can be done with the thing under the pointer. A row built from the [command registry](../keyboard/) takes its title,
icon, chord and enabled state from the command, so it never drifts from the palette or the toolbar. Editora builds
its menu bar that way ([`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarModel.java)); its right-click menus are still built by hand, each row with its own
title, glyph and action ([`LazyContextMenu.item`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/LazyContextMenu.java)). The app template's [`ui/CommandMenu.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/CommandMenu.java) builds a right-click
menu from registered command ids.
Reference: Editora's [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java) (menu bar), [`ui/ContextMenuDismissal.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ContextMenuDismissal.java), [`ui/LazyContextMenu.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/LazyContextMenu.java),
[`ui/RowContextMenu.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/RowContextMenu.java) and [`ui/TabContextMenu.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabContextMenu.java) (right-click menus), and the `.menu-item` and `.context-menu`
rules in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css).

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-open" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></symbol>
<symbol id="i-save" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></symbol>
<symbol id="i-saveas" viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8v-2H5V5h10v4h4v2h2V7l-4-4zm-5 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm7 2v2h-2v2h2v2h2v-2h2v-2h-2v-2h-2z"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></symbol>
<symbol id="i-print" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></symbol>
<symbol id="i-recent" viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></symbol>
<symbol id="i-quit" viewBox="0 0 24 24"><path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></symbol>
<symbol id="i-lock" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></symbol>
<symbol id="i-closeall" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></symbol>
<symbol id="i-git" viewBox="0 0 24 24"><path d="M6 2a3 3 0 0 0-1 5.83v8.34A3 3 0 1 0 7 16.17V12.4c.6.37 1.3.6 2 .6h4a3 3 0 0 0 3-3v-.17A3 3 0 1 0 14 9.83V10a1 1 0 0 1-1 1H9a2 2 0 0 1-2-2V7.83A3 3 0 0 0 6 2z"/></symbol>
<symbol id="i-terminal" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zM7.5 17l-1.41-1.41L8.67 13l-2.59-2.59L7.5 9l4 4-4 4z"/></symbol>
<symbol id="i-copy" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></symbol>
<symbol id="i-rename" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></symbol>
</defs></svg>

## Look and feel

Both surfaces draw their rows the same way, and the sizes in the table are the ones at the default zoom. A menu sets
its own font size on `.context-menu`, 14 px at the default zoom, from the one value the UI zoom sets
([WIN-12](../window-shell/#win-12)), so it never inherits its owner's: a popup takes the font of the node it was
opened from, and `em` would resolve against a file tree's or an 18 px toolbar's size (Editora's toolbar menu once
rendered a third larger than every other menu in the app).

| Property | Value | Reference |
|---|---|---|
| Font | Inter 14 px at the default zoom, regular, in every row and label; set on `.context-menu` from the value the UI zoom sets, never inherited from the owner | `.context-menu`, `.context-menu .menu-item .label` in `app.css`; `MainMenuBar.UI_FONT_SIZE` |
| Row | 34 px high: padding 8 × 12, the same in every theme | `.menu-item { -fx-padding: 8px 12px }` |
| Icon column | 22 px, filled on every row: a command row's glyph, or a check row's tick; 8 px to the title | `MainMenuBar.ICON_COLUMN`, `rowContent` |
| Icon | The command's glyph, the same one as on the toolbar and in the palette (Save is the same floppy everywhere), filled `-color-fg-muted` | `Icons`, `MenuBarIcons`, `.toolbar-icon` |
| Title | Inter 14 px, `-color-fg-default` | `.menu-item-title` |
| Chord | Right-aligned in its own column, Inter 11 px, in the keyboard color (`-state-key`, brace periwinkle); at least 18 px from the title column; in every menu, right-click menus included | `.menu-item-chord`, `alignChordColumns` |
| Submenu row | Laid out like a command row, with an invisible chord as wide as the menu's widest, so the arrow lands at the right edge | `nestedMenu`, `.menu-submenu` |
| Card | Radius 8; shadow `rgba(27,30,42,0.28)`, radius 16, **offset Y 16** | `.context-menu` |
| Danger item | Text in `-color-danger-fg` | `.menu-item.danger` |
| Disabled item | The theme's dimmed label, and the icon dimmed with it | Termina's `.menu-item:disabled .menu-icon` |
| Separators | Never two in a row and none at either end: when items hide, their orphaned separators hide too | `LazyContextMenu.collapseSeparators`, Torrenta's [`MenuSeparators`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MenuSeparators.java) |

The shadow's offset is not cosmetic. A menu is a native window sized to its root *including the effect*, so a shadow
that reaches above the menu is invisible window over the bar the menu hangs from, and the pointer lands on it instead
of the next menu button. [MENU-18](#menu-18) asks for an offset of at least the radius; Editora pins it with [`MenuPopupBoundsFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MenuPopupBoundsFxTest.java).

The rules of this section hold for every menu the app draws itself: the menu bar, right-click menus, the drop-down of
a menu button or a split button, and the toolbar's overflow. The menus a platform draws (the macOS system menu bar, a
tray icon's menu) show text only; there the chord is appended to the title ([MENU-02](#menu-02)) and the
[tray](../tray-and-background/) shows neither.

- **MENU-14 · MUST.** Every row of every menu the app draws carries an icon that depicts it. A command row wears its
  command's glyph; a row that names a thing rather than an action (a recent file, a branch, a project) wears that
  thing's icon; a submenu wears its family's. Only a check or radio row goes without, because its mark fills the
  icon column. Where the icon set has no glyph that depicts a command, the app adds one (a Material 24 dp path, or a
  line glyph in the kit's style) instead of leaving the row blank or borrowing another command's.
  - *Why:* a menu is scanned before it is read, and the glyph is what the eye finds first; the same glyph on the
    toolbar, in the palette and in the menu ([ICON-20](../icons-and-color/#icon-20)) is learned once. A blank
    cell breaks the column, and a borrowed glyph says something else.
  - *Check (code):* every row the app adds to a menu it draws is given a glyph where the row is built, and only
    check and radio rows are built without one. On a plain `MenuItem` the glyph is its graphic. A menu-bar row
    ([MENU-02](#menu-02)) is a `CustomMenuItem` whose `getGraphic()` is null: its glyph is the node inside the icon
    column of its content (Editora's `menu-item-icon`), and an empty column fails. A submenu's graphic is the same
    row layout, read the same way. Where the glyphs come from a table keyed by command id, the table has an entry
    for every command a menu lists, and none is another command's glyph. A test that opens the menu bar's menus
    and the right-click menus of a tab, an editor, a list row and the toolbar, and fails on a visible row with no
    glyph, is the surest evidence.
  - *Reference:* Editora [`ui/MenuBarIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarIcons.java), [`editor/MenuIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/MenuIcons.java), [`ui/TabContextMenu.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabContextMenu.java); Termina's tab
    menu has an icon on every row. Mirada's [`MenusFxTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/MenusFxTest.java) (`everyRowOfEveryMenuHasAGlyph`) opens its header
    menu, its zoom menu and the image's right-click menu and fails on a row with no glyph. Editora doesn't yet
    pass: about half its menu-bar rows have no glyph, and
    [`MenuBarIconsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MenuBarIconsTest.java) holds that a command without a fitting glyph gets none, which this rule reverses; many
    right-click and drop-down rows have none either (Run All Requests in a `.http` file, the CSV grid's menu, the
    Markdown preview's).
- **MENU-15 · MUST.** Every menu row whose command has a chord in the active keymap shows that chord, in
  right-click menus and drop-downs as in the menu bar: right-aligned in the menu's chord column, in the keyboard
  color, the one color the app keeps for chords and key chips (Editora's token for it is `-state-key`;
  [ICON-06](../icons-and-color/#icon-06) says how the color is made), at the size [MENU-16](#menu-16) gives. An
  unbound command leaves the cell empty, never a wrong chord, and a keymap switch rewrites every cell.
  - *Why:* the menu is where a user learns the keys. A right-click menu that hides them teaches the mouse, while the
    palette and the toolbar's tooltips already show the same chord.
  - *Check (code):* in the menu bar, in every right-click menu and in every drop-down, a row that runs a command
    has a chord cell, right-aligned in one column of the menu, that the code fills with the active keymap's
    display chord for the command's id and leaves empty for an unbound command: a label of the row's own
    (Editora's `menu-item-chord`) or, outside the menu bar, the item's accelerator text, never a chord typed into a
    string. The cell is filled again on each showing or when the keymap changes, and the stylesheet draws it in
    the app's keyboard color at [MENU-16](#menu-16)'s size. A test that binds a command, opens a right-click menu
    that lists it, finds its chord, and finds the new chord after a keymap switch is the surest evidence.
  - *Reference:* Editora [`MainMenuBar.rowContent`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java) and `alignChordColumns`, `.menu-item-chord` in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css), for
    the menu bar. Editora's right-click menus show no chords yet: a row there is a plain `MenuItem`, not the menu
    bar's row. The app template's right-click menus show them: [`ui/CommandMenu.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/CommandMenu.java) draws each row as the menu
    bar's ([`AppMenus.inWindowRow`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/AppMenus.java)) and re-reads its chord on every showing (`refresh`). The template doesn't
    meet the rule either: it colors the chord `-color-fg-muted`, not a keyboard color (`.menu-item-chord` in its
    [`app.css`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/resources/com/example/app/styles/app.css)), and so does Termina's menu bar ([`app.css`](https://github.com/adriandeleon/Termina/blob/master/src/main/resources/com/termina/styles/app.css)). No app has a test that opens a right-click menu
    and reads a chord from it.
- **MENU-16 · MUST.** Every menu draws its titles in Inter 14 px regular and its chords in Inter 11 px at the
  default zoom, scaled by the UI zoom ([WIN-12](../window-shell/#win-12)), whatever node it was opened from: the
  size is set on `.context-menu` and its rows' labels from one value the zoom sets, never inherited from the
  node.
  - *Why:* a popup inherits the font of the node it was shown from, and `em` resolves against it: Editora's toolbar
    menu once rendered at the bar's 18 px, a third larger than every other menu, and a file tree's or a monospace
    editor's font leaks the same way.
  - *Check (code):* the stylesheet sets the font family and the size on `.context-menu` and on its rows' title and
    chord labels from one value, in pixels and never in `em`, so the font of the node a menu was opened from
    cannot reach it; and the code that applies the UI zoom rewrites that value, so the 14 px and the 11 px scale
    with the zoom. A test that opens a menu from the toolbar, an editor and a tree row and reads Inter 14 px from
    each row's title, and 14 px times the zoom after the UI zoom changes, is the surest evidence.
  - *Reference:* Editora `.context-menu` and `.menu-item-chord` in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css), [`MainMenuBar.UI_FONT_SIZE`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java),
    [`ToolbarMenuFontFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ToolbarMenuFontFxTest.java) and [`ContextMenuFontFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ContextMenuFontFxTest.java). Editora writes 14 px and 11 px as absolute pixels and has no UI
    zoom yet ([WIN-12](../window-shell/#win-12)), so its menus keep their size whatever opens them but don't scale.
- **MENU-18 · SHOULD.** At the default zoom a menu row is 34 px high (padding 8 × 12), its icon column is 22 px wide
  with 8 px to the title, and its chord starts at least 18 px after the title column. The popup's card has a radius
  of 8 and a shadow of radius 16 at offset Y 16: the offset is at least the radius.
  - *Why:* one row in every app is what makes the menus one family's. And a menu is a native window sized to its
    root with the effect included, so a shadow that reaches above the menu is invisible window over the bar the
    menu hangs from, and the pointer lands on it instead of the next menu button.
  - *Check (code):* the stylesheet sets the row's padding and the popup's radius and shadow, with the shadow's
    offset no smaller than its radius; the row's layout sets the icon column's width and the chord's margin.
  - *Reference:* Editora `.menu-item` and `.context-menu` in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css), and [`MainMenuBar.ICON_COLUMN`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java) and
    `rowContent`; [`MenuPopupBoundsFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MenuPopupBoundsFxTest.java) holds the shadow below the popup. No other
    app draws that card. Termina, Torrenta and the app template get the row's padding from the Editora themes
    they ship, and keep those themes' popup: a radius of 4 and a shadow of radius 6 (8 in the dark theme) at offset
    Y 2 (`.menu-item` and `.context-menu` in each one's `editora-light.css` and `editora-dark.css`). Termina's [`ui/MenuRows.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/MenuRows.java) has
    the same 22 px column and 18 px chord margin; the app template's [`ui/AppMenus.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/AppMenus.java) has an 18 px icon column
    (`ICON_SLOT`) and a 16 px chord margin. Mirada and nux write no radius or shadow for `.context-menu` and take
    their AtlantaFX theme's popup (Cupertino, Primer). Modula's [`modula.css`](https://github.com/adriandeleon/Modula/blob/master/src/main/resources/com/modula/modula.css) gives `.context-menu` a radius of 8 and
    a shadow of radius 20 at offset Y 6, and its rows a padding of 4 × 8.

## The menu bar

**Applies to:** an app with a menu bar.

<div class="mock-stage">
<div class="m-menubar-stage" role="img" aria-label="Mockup of the File menu open under the menu bar">
<div class="m-menubar" style="width:max-content;min-width:100%"><span class="mb on">File<span class="pin out" style="left:-26px;top:3px">1</span></span><span class="mb">Edit</span><span class="mb">Find</span><span class="mb">View</span><span class="mb">Navigate</span><span class="mb">Code</span><span class="mb">Run</span><span class="mb">VCS</span><span class="mb">Tools</span><span class="mb">Window</span><span class="mb">Help</span></div>
<div class="m-card m-menu">
<div class="mi"><span class="ic"><svg><use href="#i-open"/></svg></span><span class="t">Open…</span><span class="k">C-x C-f</span><span class="pin out" style="left:-26px">2</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-save"/></svg></span><span class="t">Save <span class="pin" style="margin-left:6px">3</span></span><span class="k">C-x C-s</span><span class="pin out" style="right:-26px">4</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-saveas"/></svg></span><span class="t">Save As…</span><span class="k">C-x C-w</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-close"/></svg></span><span class="t">Close</span><span class="k">C-x k</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-print"/></svg></span><span class="t">Print…</span><span class="k"></span><span class="pin out" style="right:-26px">5</span></div>
<div class="sep"></div>
<div class="mi sub"><span class="ic"><svg><use href="#i-recent"/></svg></span><span class="t">Recent Files</span><span class="k ghost">C-x C-w</span><span class="arrow">›</span><span class="pin out" style="right:-26px">6</span></div>
<div class="sep"></div>
<div class="mi"><span class="ic"><svg><use href="#i-quit"/></svg></span><span class="t">Quit</span><span class="k">C-x C-c</span></div>
<span class="pin out" style="left:-26px;bottom:-4px">7</span>
</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Menu button.</strong> Padding 3 × 10 on a bar with 4 px side insets; the bar and the toolbar share one <code>-color-bg-subtle</code> band with no rule under it.</span></li>
<li><span class="pin">2</span><span><strong>Icon column</strong>, 22 px. Every row has a glyph that depicts its command; where the icon set has none that fits, the app adds one rather than leave the cell blank.</span></li>
<li><span class="pin">3</span><span><strong>Title</strong>, 14 px Inter, the command's title with its category prefix dropped ("Save", not "File: Save") unless two rows would then read the same. Editora drops the prefix only where two words or more are left ("File: Save As…" reads "Save As…"), so its File menu still reads "File: Save" (<a href="https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/MenuTitles.java"><code>editor/MenuTitles.java</code></a>).</span></li>
<li><span class="pin">4</span><span><strong>Chord column.</strong> Inter 11 px, periwinkle, right-aligned into one column per menu (not app-wide), read from the active keymap. Drawn by the app, not a JavaFX accelerator: Emacs chords are multi-key, which a <code>KeyCombination</code> cannot express, and on macOS an accelerator would bypass the key dispatcher.</span></li>
<li><span class="pin">5</span><span><strong>Unbound command.</strong> An empty chord cell, never a wrong chord. A live keymap switch rewrites every cell.</span></li>
<li><span class="pin">6</span><span><strong>Submenu row.</strong> Icon, title and an invisible chord as wide as the menu's widest, so its arrow sits at the right edge instead of halfway across.</span></li>
<li><span class="pin">7</span><span><strong>Card.</strong> Radius 8; the shadow falls below the menu (offset ≥ radius), so nothing invisible covers the bar.</span></li>
</ol>

- **MENU-01 · MUST.** Every menu-bar item is a command from the registry, with the command's title
  ([KBD-03](../keyboard/#kbd-03)), its chord from the active keymap and its enabled state from the command's gate.
  A row may show the title without its category prefix ("Save As…" for "File: Save As…"); it never carries a title
  of its own. The bar assembles and refreshes; it holds no behavior of its own.
  - *Check (code):* the bar's model lists command ids only, and every row runs its id through the registry.
  - *Reference:* Editora [`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarModel.java) over [`command/CommandRegistry.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/command/CommandRegistry.java), [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java).
- **MENU-02 · MUST.** Menu-bar rows use no `KeyCombination` accelerators. In the in-window bar each row is a
  `CustomMenuItem` laying out icon, title, spacer and chord. On the macOS system menu bar (`useSystemMenuBar`) the
  chord is appended to the title and rows carry no icon.
  - *Why:* Emacs chords are multi-key, which a `KeyCombination` cannot express, and on macOS an accelerator would
    bypass the key dispatcher. The native macOS menu draws text only and no graphics, which is also the platform's
    convention.
  - *Check (code):* no menu-bar row calls `setAccelerator`; each row of the in-window bar is a `CustomMenuItem`
    whose content lays out the icon, the title, a spacer and the chord; and where the bar is the macOS system menu
    bar, a row's text is the title with the chord appended and the row has no graphic.
  - *Reference:* Editora [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java) (`rowContent`, `refresh`).
- **MENU-03 · SHOULD.** Enablement is re-read every time a menu opens, and titles and chords on a keymap or locale
  change.
  - *Why:* a menu built before Git finished detecting a repository must not stay grayed out.
  - *Check (code):* each menu's on-showing handler reads every row's enabled state from its command again, and
    the code that switches the keymap or the locale rewrites every row's title and chord. A test that changes a
    command's state after the window is built (a repository detected late) and finds the row enabled is the surest
    evidence.
  - *Reference:* Editora [`MainMenuBar.refreshEnablement`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java), [`MenuBarEnablementFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MenuBarEnablementFxTest.java).
- **MENU-04 · SHOULD.** An app with a Simple mode shows a shorter menu in it, rebuilt only when the mode actually
  changes.
  - *Check (code):* the bar rebuilds only when the simple flag differs from the current one.
  - *Reference:* Editora [`MainMenuBar.setSimple`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java), [`MenuBarModel.menus(simple)`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarModel.java).
- **MENU-17 · SHOULD.** The in-window menu bar, the one an app shows on Windows and Linux
  ([WIN-03](../window-shell/#win-03)), is reachable from the keyboard in every keymap. JavaFX opens the bar's first
  menu on `F10` and on a lone `Alt`; a keymap that binds `F10` to something else binds a command that focuses the
  menu bar instead. So does a terminal app, where a plain `F10` goes to the program it runs. The macOS system menu
  bar is reached with the OS's own keys and asks nothing of the app.
  - *Why:* the menus are a keyboard user's map of the app; a chord that never reaches them hides it.
  - *Check (by hand):* on Windows or Linux, in each keymap, reach the first menu with the keyboard alone and walk
    the bar with the arrows.
  - *Reference:* no app yet. Editora's CUA, VS Code and Sublime keymaps bind `F10` to `debug.stepOver`
    ([`keymaps/cua.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/cua.json)), and no command focuses the bar. Termina leaves a plain `F10` to the program in the
    terminal ([`ui/ViewKeys.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/ViewKeys.java)) and has no such command either.

![Editora's View menu open with toggle commands and their chords](../../assets/shots/editora-menu-bar.png "Editora's View menu in an earlier build: chords in one periwinkle column, but half the rows have no icon and every title repeats the menu's name.")

## Right-click menus

**Applies to:** an app with a right-click menu: a menu the app builds and opens on a right-click, the Menu key or
`Shift+F10`, over something in one of its windows. The stock Cut, Copy and Paste menu that JavaFX gives a text
field does not make an app one, and neither does a tray icon's menu, which the platform draws: nux has both and
no right-click menu.

- **MENU-05 · MUST.** In an app with a right-click menu, every list row, tree row, tab, editor and read-only
  console has one, with the actions for *that* thing, and every action in a right-click menu is a command
  ([KBD-01](../keyboard/#kbd-01)). The rule covers the lists, trees, tabs, editors and read-only consoles in the
  app's windows; the overlay list of a picker or a palette and a plain text area in a dialog are outside it.
  - *Check (code):* list the lists, trees, tab strips, editors and read-only consoles in the app's windows and
    find the right-click menu each one installs; then read every row of every right-click menu the app builds: its
    action is one a registered command runs too, by the command's id through the registry or by calling what the
    command calls, so the palette reaches it. A row whose action no command runs fails, as does a list, tree, tab
    strip, editor or console with no menu. The overlay list of a picker or a palette and a plain text area in a
    dialog are not judged.
  - *Reference:* the app template's [`ui/CommandMenu.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/CommandMenu.java), which builds each menu from registered command ids
    and runs a row through the registry (`onRow` for a list row, `onConsole` for a read-only console;
    [`RightClickMenusFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/RightClickMenusFxTest.java)). Editora's [`ui/TabContextMenu.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabContextMenu.java), [`ui/RowContextMenu.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/RowContextMenu.java) and
    [`ui/ConsoleContextMenu.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ConsoleContextMenu.java) are the menus this rule describes, but their rows are built by hand and
    call the window's methods, not a command id, so nothing holds that each row has a command. Modula doesn't
    meet the rule yet: the Rename… and Remove rows of a preset chip's menu ([`ui/PresetBar.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/PresetBar.java)) run no
    command, and its command list has neither ([`ui/RadioPane.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/RadioPane.java), `commands`).

The mockup is an editor tab's menu, shortened; Editora's has twenty-one rows.

<div class="mock-stage">
<div class="m-ctx-stage" role="img" aria-label="Mockup of a tab's right-click menu">
<div class="m-tabs"><span class="tab on">Main.java<span class="x">×</span></span><span class="tab">pom.xml</span><span class="tab dirty">README.md</span></div>
<div class="m-card m-menu ctx">
<span class="pin out" style="left:-10px;top:-10px">1</span>
<div class="mi off"><span class="ic"><svg><use href="#i-save"/></svg></span><span class="t">Save</span><span class="k">C-x C-s</span><span class="pin out" style="right:-26px">3</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-saveas"/></svg></span><span class="t">Save As…</span><span class="k">C-x C-w</span><span class="pin out" style="left:-26px">2</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-lock"/></svg></span><span class="t">Encrypt…</span><span class="pin out" style="right:-26px">6</span></div>
<div class="sep"></div>
<div class="mi"><span class="ic"><svg><use href="#i-close"/></svg></span><span class="t">Close</span><span class="k">C-x k</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-closeall"/></svg></span><span class="t">Close Others</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-closeall"/></svg></span><span class="t">Close All</span></div>
<div class="sep"><span class="pin out" style="right:-26px;top:-9px">4</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-recent"/></svg></span><span class="t">Local History</span></div>
<div class="mi sub"><span class="ic"><svg><use href="#i-git"/></svg></span><span class="t">Git</span><span class="arrow">›</span><span class="pin out" style="right:-26px">5</span></div>
<div class="sep"></div>
<div class="mi"><span class="ic"><svg><use href="#i-terminal"/></svg></span><span class="t">Open Terminal Here</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-copy"/></svg></span><span class="t">Copy Path</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-pin"/></svg></span><span class="t">Pin Tab</span></div>
<div class="mi"><span class="ic"><svg><use href="#i-rename"/></svg></span><span class="t">Rename…</span></div>
</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Anchored at the pointer.</strong> The menu's top-left corner is the click. From the keyboard (Menu key or <kbd>Shift+F10</kbd>) it opens under the selected row, a quarter of the way in and never off a narrow one, or just below the caret in an editor; never in the middle of the control.</span></li>
<li><span class="pin">2</span><span><strong>Every row has an icon</strong>, the command's own, and its chord when it has one, in the same periwinkle column as the menu bar's. The one row without an icon is a <code>CheckMenuItem</code>, whose tick lives in the graphic column.</span></li>
<li><span class="pin">3</span><span><strong>Grayed, not hidden.</strong> An action that does not apply right now (Save on an unchanged file, Reveal on an unsaved one) stays in place, dimmed. Only a row that cannot apply to this thing at all is hidden (the Git submenu on an untitled buffer).</span></li>
<li><span class="pin">4</span><span><strong>Separators</strong> group the rows; one that hiding has left alone hides too.</span></li>
<li><span class="pin">5</span><span><strong>Submenu</strong> for a family of actions (Git: stage, unstage, revert, compare, history), with its own icon.</span></li>
<li><span class="pin">6</span><span><strong>Labels follow state.</strong> Encrypt… becomes Lock File on an encrypted buffer, Pin Tab becomes Unpin Tab. Decided on every showing, not when the menu was built.</span></li>
</ol>

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
  - *Reference:* Editora [`ui/ContextMenuDismissal.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ContextMenuDismissal.java) closes every open right-click menu on the press that opens
    the next ([`ContextMenuDismissalFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ContextMenuDismissalFxTest.java)), and its toolbar keeps one menu and shows it again, so a second
    right-click on the bar moves it ([`ToolbarCoordinator`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolbarCoordinator.java), [`ToolbarContextMenuDismissFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ToolbarContextMenuDismissFxTest.java)); Termina's [`ui/OneMenu.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/OneMenu.java)
    closes every other menu as one starts to show ([`OneMenuTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/OneMenuTest.java)), and the app template's [`RightClickMenusFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/RightClickMenusFxTest.java)
    (`aRightClickOnAnotherRowLeavesOneMenu`) holds it for a list's rows. Modula's [`RadioPane`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/RadioPane.java) hides its own
    previous menu before it shows a new one, but Modula doesn't meet the rule yet: each preset chip owns a menu
    ([`ui/PresetBar.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/PresetBar.java)), and no code closes the pane's menu when a chip's opens: the pane's press filter skips
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
  - *Reference:* Editora [`ContextMenuDismissal.install()`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ContextMenuDismissal.java), called once in [`App`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java) at startup for every current and
    future window; [`ContextMenuDismissalFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ContextMenuDismissalFxTest.java), and for the toolbar's menu, whose owner is the whole bar,
    [`ToolbarContextMenuDismissFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ToolbarContextMenuDismissFxTest.java). The app template installs the same class at
    start-up. Mirada turns auto-hide off on its three menus and closes them from a press filter on the scene of
    each window that has one ([`ui/Popups.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Popups.java), `closeOnPressOutside`). Termina's terminal view hides its menu from its own
    press filter, but its tab menus have the stock auto-hide alone ([`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java)); so have Modula's preset chips
    ([`ui/PresetBar.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/PresetBar.java)), beside a pane menu that its own filter closes, and every right-click menu in Torrenta. nux has no
    right-click menu.
- **MENU-08 · MUST.** Escape closes a right-click menu and focus goes back where it was. In a terminal app the
  Escape that closes the menu does not reach the shell.
  - *Check (by hand):* open a menu, press Escape, and type: the keys reach the control that had focus.
  - *Reference:* the stock `ContextMenu` hide-on-Escape (the right-click menus' [Spec](#spec)); Termina's `onKeyPressed` filter hides the menu
    and consumes the key ([`TerminalView`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalView.java)).
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
  - *Reference:* Editora [`RowContextMenu.install(tree)`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/RowContextMenu.java), [`RowContextMenuFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/RowContextMenuFxTest.java): it answers the request
    JavaFX raises for those keys (`ContextMenuEvent.isKeyboardTrigger`). Termina's [`ui/ViewKeys.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/ViewKeys.java) and Mirada's
    [`Popups.isMenuKey`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Popups.java) read the key press themselves, the same on every OS. One of Editora's keymaps gives the chord to a
    command as well: IntelliJ's binds `S-f10` to `run.rerun` ([`keymaps/intellij.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/intellij.json)), a clash
    [`RowContextMenuFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/RowContextMenuFxTest.java) does not cover: it raises the request itself and presses no key. The app
    template's [`ui/RowContextMenu.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/RowContextMenu.java) answers the same request for a list's rows ([`RightClickMenusFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/RightClickMenusFxTest.java),
    `theMenuKeyOpensTheSelectedRowsMenuAtThatRow`).
- **MENU-10 · SHOULD.** A right-click selects first. In an editor, a right-click outside every selection moves the
  caret to the click (so Paste lands there); inside a selection it keeps carets and selections (so Cut and Copy act
  on what was clicked). From the keyboard the target is the caret. In a list, the menu is the clicked row's.
  - *Check (by hand):* select a word, right-click elsewhere and paste; then right-click inside a selection and copy.
  - *Reference:* Editora [`editor/ContextMenuTarget.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/ContextMenuTarget.java).
- **MENU-11 · SHOULD.** A menu attached to something that exists once per open file is built when first shown, and
  set up for each showing: an `onShowing` handler sets the labels, enablement and visibility for *this* showing,
  then collapses the separators.
  - *Why:* such a menu is built for every file and opened for almost none.
  - *Check (code):* a menu that exists once per open file is not built with the file: its items are created in
    the handler of its first request, and an on-showing handler sets their labels, enablement and visibility and
    then collapses the separators (Editora's `LazyContextMenu.of(build)`).
  - *Reference:* Editora [`ui/LazyContextMenu.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/LazyContextMenu.java), [`LazyContextMenuFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/LazyContextMenuFxTest.java). A read-only console's menu is just
    Select All and Copy, both disabled while it is empty ([`ConsoleContextMenu`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ConsoleContextMenu.java)).
- **MENU-12 · SHOULD.** A destructive row is styled as dangerous, its text in `-color-danger-fg` (Editora's style
  class for it is `danger`). The action follows the
  [Confirm dialog](../templates/confirm-dialog/) rules ([CONF-01](../templates/confirm-dialog/#conf-01),
  [CONF-03](../templates/confirm-dialog/#conf-03)): it asks first with a button that names it, or is undoable.
  - *Check (code):* rows that delete, discard or reset carry the style class that colors their text
    `-color-danger-fg` (Editora's `danger`).
  - *Reference:* Editora `.menu-item.danger` in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css), [`ui/BranchPopup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/BranchPopup.java).
- **MENU-13 · MAY.** In a terminal view, a program that grabbed the mouse owns the right-click;
  `Shift`+right-click always opens the menu, and the keyboard request is never contested.
  - *Check (code):* the terminal view decides whether to show its menu from the mouse mode, Shift and the
    trigger: a right-click while a program has the mouse goes to the program unless Shift is held, and a request
    from the keyboard always shows the menu. A test of that decision is the surest evidence.
  - *Reference:* Termina's [`TerminalView.shouldShowMenu`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalView.java), [`ContextMenuContentionTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/ContextMenuContentionTest.java).

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

![Termina window with a menu bar, a tab strip under it and a tab context menu](../../assets/shots/termina-tabs.png "Termina's tab menu: an icon on every row, following Editora's convention.")
![Editora's View menu open with toggle commands and their chords](../../assets/shots/editora-menu-bar.png "Editora's in-window menu bar with the chord column, in an earlier build whose rows still lack icons and repeat the menu's name.")
