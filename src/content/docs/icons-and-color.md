---
title: "Icons and color"
description: "Inter and JetBrains Mono, the Caret & Ink palette, state colors that mean one thing, themes, and the two icon families."
---

One typeface pair, one palette, one color vocabulary and one way of drawing icons, so a tab, a status segment, a
tree row and a Settings row say the same thing in the same way in every app. Reference: Editora's
[`styles/ui-font.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/ui-font.css) and [`ui/Fonts.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Fonts.java) (type), [`styles/atlantafx-themes/editora-light.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/atlantafx-themes/editora-light.css) and `editora-dark.css`
(the Caret & Ink palette, which Torrenta and Termina vendor), the `.root` block at the top of
[`styles/app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) (the state vocabulary), [`ui/Themes.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Themes.java) and [`ui/EditorThemes.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/EditorThemes.java) (themes), [`ui/Icons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Icons.java),
[`ui/FileIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FileIcons.java), [`ui/MenuBarIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarIcons.java) and [`editor/MenuIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/MenuIcons.java) (icons), and [`StyleContrastTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java), which
pins the color rules.

## Type

**Inter speaks, JetBrains Mono works.** Inter is the chrome: menus, buttons, settings, pickers, status bar. The
monospace face is for text that is code or output: the editor, a terminal, the environment block in About, log
timestamps.

| Property | Value | Reference |
|---|---|---|
| UI family | Inter, in four faces, bundled in the app's resources and registered before any CSS is applied | `Fonts.UI`, `Fonts.loadForFirstPaint`, `resources/com/editora/fonts/inter/` |
| Root size | 14 px, the AtlantaFX theme's root size; popups pin absolute pixels where an owner's font would leak (see [Menus](../menus/)) | `MainMenuBar.UI_FONT_SIZE` |
| How it is attached | A scene stylesheet (`ui-font.css`, one `.root` rule whose `-fx-font-family` names Inter) on every window's scene, dialogs and popups included | `App.installUiFont` |
| Monospace | JetBrains Mono by default; Cascadia Code, Fira Code, IBM Plex Mono and Source Code Pro are bundled as editor choices | `Fonts.DEFAULT`, `Fonts.BUNDLED` |

- **ICON-01 · MUST.** Inter is attached by a *scene* stylesheet on every window's scene, dialogs, popups and
  tooltips included, not by a rule in the app stylesheet.
  - *Why:* dialogs, the Settings window, the palette, context menus and tooltips each live in a scene of their own
    that does not share `app.css`, and a scene sheet is re-applied cleanly when the theme switches at run time
    (`setUserAgentStylesheet`). AtlantaFX neither bundles nor names Inter, and JavaFX does not fall through a
    font-family list, so without the sheet the whole interface renders in the platform's "System" face.
  - *Check (code):* a listener on `Window.getWindows()` adds `ui-font.css` to each window's scene, and to a new
    scene when the window's scene changes; no `.root` rule in `app.css` sets `-fx-font-family`.
  - *Reference:* Editora [`App.installUiFont`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java), [`styles/ui-font.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/ui-font.css). Termina and Torrenta carry the same sheet.
- **ICON-02 · MUST.** The app bundles Inter's four faces and registers them before any CSS is applied; it never
  maps the platform's own UI font.
  - *Why:* an earlier macOS-only sheet used San Francisco, which JavaFX faux-bolds; Inter has a real bold on every
    platform.
  - *Check (code):* `Inter-Regular`, `Inter-Bold`, `Inter-Italic` and `Inter-BoldItalic` `.ttf` are under the app's
    `fonts/inter/` with their `OFL.txt`, and `Font.loadFont` runs on them before the first window is shown.
  - *Reference:* Editora [`src/main/resources/com/editora/fonts/inter/`](https://github.com/adriandeleon/Editora/tree/master/src/main/resources/com/editora/fonts/inter), [`ui/Fonts.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Fonts.java) (`loadForFirstPaint`,
    called from [`App`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java)). Termina and Torrenta bundle the same four faces.

Modula is the stated exception to ICON-01 and ICON-02: IBM Plex Mono everywhere, because every reading on a radio is
a number (see *Before adding a setting* in [Settings](../settings/)).

## The palette: Caret & Ink

The flagship theme pair, "Editora Light" and "Editora Dark", is authored (not vendored) and derived from Editora's
icon: a **caret** teal accent, **ink** navy as the text in light and the surface in dark, **porcelain** and **abyss**
grounds, and **brace** periwinkle reserved for the keyboard. Amber, red and green are semantic and never decorate.

<div class="mock-stage">
<div class="m-ic-palette" role="table" aria-label="The Caret and Ink palette: each token's light and dark value">
<div class="m-ic-head" role="row"><span role="columnheader"></span><span role="columnheader">Light</span><span role="columnheader">Dark</span><span role="columnheader">Token</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Ground</span><span class="m-ic-chip" role="cell" style="--c:#ffffff"><i>#ffffff</i></span><span class="m-ic-chip" role="cell" style="--c:#1b1e2a"><i>#1b1e2a</i></span><span class="t" role="cell">-color-bg-default</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Porcelain / Abyss</span><span class="m-ic-chip" role="cell" style="--c:#f4f5f9"><i>#f4f5f9</i></span><span class="m-ic-chip" role="cell" style="--c:#12141d"><i>#12141d</i></span><span class="t" role="cell">-color-bg-subtle / -color-bg-inset</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Ink</span><span class="m-ic-chip" role="cell" style="--c:#1b1e2a"><i>#1b1e2a</i></span><span class="m-ic-chip" role="cell" style="--c:#e8eaf3"><i>#e8eaf3</i></span><span class="t" role="cell">-color-fg-default</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Muted ink</span><span class="m-ic-chip" role="cell" style="--c:#575d6e"><i>#575d6e</i></span><span class="m-ic-chip" role="cell" style="--c:#9ba1b5"><i>#9ba1b5</i></span><span class="t" role="cell">-color-fg-muted</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Subtle ink</span><span class="m-ic-chip" role="cell" style="--c:#8b91a3"><i>#8b91a3</i></span><span class="m-ic-chip" role="cell" style="--c:#6c7288"><i>#6c7288</i></span><span class="t" role="cell">-color-fg-subtle</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Caret</span><span class="m-ic-chip" role="cell" style="--c:#0e8577"><i>#0e8577</i></span><span class="m-ic-chip" role="cell" style="--c:#43dec5"><i>#43dec5</i></span><span class="t" role="cell">-color-accent-emphasis</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Caret, as text</span><span class="m-ic-chip" role="cell" style="--c:#0d786b"><i>#0d786b</i></span><span class="m-ic-chip" role="cell" style="--c:#43dec5"><i>#43dec5</i></span><span class="t" role="cell">-color-accent-fg</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Amber</span><span class="m-ic-chip" role="cell" style="--c:#8d6309"><i>#8d6309</i></span><span class="m-ic-chip" role="cell" style="--c:#e3a93c"><i>#e3a93c</i></span><span class="t" role="cell">-color-warning-fg</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Red</span><span class="m-ic-chip" role="cell" style="--c:#c03434"><i>#c03434</i></span><span class="m-ic-chip" role="cell" style="--c:#ee7a6e"><i>#ee7a6e</i></span><span class="t" role="cell">-color-danger-fg</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Green</span><span class="m-ic-chip" role="cell" style="--c:#2c784c"><i>#2c784c</i></span><span class="m-ic-chip" role="cell" style="--c:#5bc98a"><i>#5bc98a</i></span><span class="t" role="cell">-color-success-fg</span></div>
<div class="m-ic-row" role="row"><span class="n" role="rowheader">Brace</span><span class="m-ic-chip" role="cell" style="--c:#3c4380"><i>#3c4380</i></span><span class="m-ic-chip" role="cell" style="--c:#b8bee5"><i>#b8bee5</i></span><span class="t" role="cell">-state-key (a ladder of the ground)</span></div>
</div>
</div>

- **ICON-04 · SHOULD.** A theme file follows the vendored AtlantaFX community themes: a `.root` block of `-color-*`
  tokens, then component rules that reference only those tokens.
  - *Check (code):* the file's first rule is `.root`, and no rule after it holds a `#` hex.
  - *Reference:* Editora [`styles/atlantafx-themes/editora-light.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/atlantafx-themes/editora-light.css), `editora-dark.css`.
- **ICON-05 · SHOULD.** A new app ships the Caret & Ink pair as its default theme, with `editora-light.css` and
  `editora-dark.css` copied unchanged into its own `styles/`.
  - *Why:* the palette is the family's, not the editor's.
  - *Check (code):* the app's two files are identical to Editora's.
  - *Reference:* Torrenta and Termina `styles/`. Both copies of `editora-dark.css` match Editora's; both copies of
    `editora-light.css` still have the earlier `-color-accent-fg`, `-color-warning-fg` and `-color-success-fg`,
    which Editora has since darkened.
- **ICON-06 · SHOULD.** Brace (`-state-key`) is a `ladder()` over `-color-bg-default` that picks a deep ink on a
  light ground and a lighter periwinkle the darker the ground gets, and reads at 4.5:1 or more on every bundled
  theme's default and subtle surfaces.
  - *Why:* Brace has no AtlantaFX role, so it has to be a literal.
  - *Check (test):* a contrast test resolves the ladder against every bundled theme's grounds.
  - *Reference:* Editora [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) (`.root`), [`StyleContrastTest.theKeyboardPeriwinkleReadsOnEveryBundledAppTheme`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java).

## State colors

A color is a meaning, named once on `.root` and referenced everywhere. The same state wears the same color in a
tab, a status segment, a tree row, a picker and a Settings row.

| Token | Chains to | Meaning | Where it appears |
|---|---|---|---|
| `-state-amber` | `-color-warning-fg` | Not durable yet | An unsaved tab, a read-only file, a narrowed view, a snapshot build |
| `-state-red` | `-color-danger-fg` | Broken | Errors in the echo area and the Message Log, breakpoints, a recording |
| `-state-green` | `-color-success-fg` | Verified | Found, added, passing, running |
| `-state-accent` | `-color-accent-fg` | The app is offering something | An update, a link, the current branch, a selected row's bar |
| `-state-olive`, `-state-violet` | A ladder of the ground | Git only: untracked, renamed | The Project tree and tabs, the Map's structure columns |
| `-state-key` | A ladder of the ground | The keyboard, and nothing else | Chord chips, the menu chord column, brace matching |
| `-state-sel` | `-color-accent-subtle` | The selected overlay row | The palette, pickers, the Message Log (about a 13 % accent wash) |

Each of the first four also has a `-bg` (the role's `-subtle`) and a `-hover` (the role's `-muted`) variant, so a
pill, a row tint and a hover state come from the same place. `.state-pill` is the shape (bold, radius 999, padding
1 × 8); the color variant beside it carries the meaning.

- **ICON-07 · MUST.** Each state color is named once, as a `-state-*` token on `.root` that chains to one of the
  theme's roles (or a `ladder()` of its ground), and component rules use the token.
  - *Check (code):* the `-state-*` tokens are declared only in the `.root` block at the top of `app.css`, each
    chaining to a `-color-*` role or a `ladder()`.
  - *Reference:* Editora [`styles/app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) (`.root`).
- **ICON-08 · MUST.** App stylesheets take their colors from AtlantaFX `-color-*` tokens, or from state tokens built
  on them; no component rule carries a fixed hex.
  - *Why:* a hex suits one theme; the roles track every theme for free.
  - *Check (code):* `grep -nE '#[0-9a-fA-F]{3,8}\b' app.css` finds hexes only where a token is defined (the `.root`
    token block, a `ladder()` of the ground, a scoped `-color-*` block), not in a component's `-fx-*-color` or
    `-fx-fill`. A test fails a severity or debug color that is not a state token.
  - *Reference:* Editora [`StyleContrastTest.severityAndDebugColoursComeFromTheStateTokens`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java). Editora doesn't yet
    pass the whole check: `.breakpoint-marker`, `.exec-arrow`, `.view-mode-bar`, `.recent-remove`,
    `.personal-note-tooltip-content`, the fold-gutter markers and the default editor and Markdown preview palettes
    in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) still carry fixed hexes.
- **ICON-09 · SHOULD.** Readable text uses `-color-fg-muted` or stronger, which is 4.5:1 on the default, subtle and
  overlay grounds in both flagship themes: a line of UI text is `-color-fg-default` and secondary text
  `-color-fg-muted`. `-color-fg-subtle` (2.7:1 to 3.9:1, under 3:1 on Editora Light's subtle and inset grounds) is for disabled or
  decorative text only.
  - *Check (test):* a contrast test computes muted ink on each ground, and fails a readable selector set in
    `-color-fg-subtle`.
  - *Reference:* Editora [`StyleContrastTest.textThatMustBeReadUsesTheMutedRoleNotSubtle`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java).
- **ICON-10 · MUST.** Tinted text (`-color-<role>-fg`) reaches 4.5:1 on its own subtle fill and on both grounds.
  - *Check (test):* a contrast test computes each role's `-fg` on its `-subtle`, on `-color-bg-subtle` and on
    `-color-bg-default`, in both flagship themes.
  - *Reference:* Editora [`StyleContrastTest.lightTintedTextReachesAaOnItsOwnGroundAndOnTheSubtleSurface`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java),
    `darkTintedTextStaysAa`.
- **ICON-11 · MUST.** Ink on an emphasis fill is `-color-fg-emphasis`, never a fixed white: the token is white in
  the light themes and a dark ink in the dark ones.
  - *Why:* white on the dark accent is 1.68:1.
  - *Check (test):* a contrast test computes `-color-fg-emphasis` on each role's `-emphasis`, and the rules that
    paint on an emphasis fill use it.
  - *Reference:* Editora [`StyleContrastTest.inkOnAnEmphasisFillIsTheThemesOnEmphasisColour`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java).
- **ICON-12 · MUST.** One focus ring, `-focus-ring: -color-accent-emphasis`, drawn by the `:focus-visible` block in
  `app.css` ([KBD-16](../keyboard/#kbd-16)), at 3:1 or better on every surface (see [Keyboard first](../keyboard/)).
  - *Check (test):* a test reads `-focus-ring` from `.root` and computes it on the default, subtle, inset and
    overlay grounds.
  - *Reference:* Editora [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) (*Keyboard focus*),
    [`StyleContrastTest.theFocusRingIsAtLeastThreeToOneOnEverySurface`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java).
- **ICON-13 · SHOULD.** A brand hue the theme has no role for (olive, violet) is a `ladder()` of
  `-color-bg-default`, never a fixed pair. Brace, the periwinkle, is [ICON-06](#icon-06).
  - *Why:* the old fixed light hexes read at 3.2:1 on Editora Dark.
  - *Check (test):* a contrast test resolves each ladder on every bundled theme's ground.
  - *Reference:* Editora [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) (`-state-olive`, `-state-violet`, `-state-key`),
    [`StyleContrastTest.theGitOliveAndVioletFollowTheAppThemesGround`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java).
- **ICON-14 · SHOULD.** A pure test reads the stylesheets and does the WCAG arithmetic.
  - *Why:* a contrast regression is invisible in a code diff.
  - *Check (code):* a test class reads the app's `.css` resources and computes contrast ratios without starting the
    toolkit.
  - *Reference:* Editora [`StyleContrastTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java). Mirada's [`AccentTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/AccentTest.java) checks that the accent reads as text on both
    grounds; Termina's [`ThemeTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/ThemeTest.java) keeps every chromatic color of its terminal schemes legible.

## Themes

- **ICON-15 · MUST.** The app has light and dark themes and switches between them at run time, without a restart
  (see [Window shell](../window-shell/)).
  - *Check (code):* picking a theme calls `Application.setUserAgentStylesheet` in the running app.
  - *Reference:* Editora [`ui/Themes.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Themes.java) (`applyAppTheme`).
- **ICON-16 · MUST.** A "follow the system" choice applies the light or dark theme to match the system's color
  scheme, and changes with it.
  - *Check (code):* the theme setting has a system value, and a listener on
    `Platform.getPreferences().colorSchemeProperty()` re-applies the theme.
  - *Reference:* Mirada [`settings/Settings.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/settings/Settings.java) (`ThemeChoice.SYSTEM`), [`ui/Theme.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Theme.java); nux [`config/Advanced.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/config/Advanced.java)
    (`THEME_SYSTEM`), [`ui/Theme.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/Theme.java). Editora, Torrenta, Termina and Modula don't yet: their pickers list named
    themes only.
- **ICON-17 · MUST.** A theme name the app does not know falls back to the first-run default theme.
  - *Check (code):* the lookup from a saved name to a theme ends in the default, not an exception.
  - *Reference:* Editora [`Themes.themeFor`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Themes.java), falling back to [`Themes.DEFAULT`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Themes.java) (Editora Light).
- **ICON-18 · SHOULD.** Semantic colors never decorate: a theme may change the teal, the ground and the ink, but
  amber still means "not durable yet", red "broken" and green "verified".
  - *Check (code):* every rule that uses `-state-amber`, `-state-red` or `-state-green` marks one of the meanings in
    the State colors table.
  - *Reference:* Editora [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css).

Editora lists 28 app themes: the Caret & Ink pair, AtlantaFX's Primer, Nord, Cupertino and Dracula, and 19
community themes (Army, Autumn, Blacky, Blue, Browny, Fall, Navy, News, Spring, Summer, Winter, Yacht, several with
light and dark variants) vendored unmodified from the MIT-licensed dlsc `atlantafx-themes` collection. User themes
under `<config>/themes/` join the list (`Themes.names()`).

**Editor themes are separate** (`EditorThemes`). The flagship pair carries its own editor stylesheet; every community
theme is served by one `adaptive` editor theme whose syntax palette is expressed in the theme's own `-color-*`
tokens, so it follows whatever ground the theme has.

![Editora's Settings page for themes and fonts](../../assets/shots/editora-themes-fonts.png "Settings: the theme picker with the Caret & Ink pair first, and the UI and editor fonts.")

## Icons

Every icon is an SVG path drawn in code, colored by the stylesheet so it follows the theme, and returned as a
fresh node per call (a JavaFX node has one parent). There are two families, mid-migration to the UI Kit, and they
are not interchangeable.

<div class="mock-stage">
<div class="m-ic-families" role="img" aria-label="A line glyph and a filled glyph side by side at the toolbar size">
<div class="m-ic-fam"><svg class="line" viewBox="0 0 16 16"><path d="M4.5 2.5h4.6l2.9 2.9v8.1h-7.5zM9.1 2.5v2.9h2.9M8.25 8.2v3.2M6.65 9.8h3.2"/></svg><span class="cap">Line</span><span class="sub">16-unit outline, stroke 1.3, round caps</span><span class="sub"><code>icon-line</code> · <code>-fx-stroke</code></span></div>
<div class="m-ic-fam"><svg class="fill" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg><span class="cap">Filled</span><span class="sub">Material 24 dp, one path, filled</span><span class="sub"><code>toolbar-icon</code> · <code>-fx-fill</code></span></div>
</div>
</div>

| Property | Line family | Filled family | Reference |
|---|---|---|---|
| Source | The UI Kit's 16-unit outline glyphs, drawn for the kit | Material Design 24 dp single-path glyphs (Apache-2.0), plus Simple Icons brand marks (CC0) | `Icons.line`, `Icons.of`, `NOTICE` |
| Style class | `icon-line` | `toolbar-icon` | `app.css` |
| Color | `-fx-stroke: -color-fg-muted`, stroke width 1.3, round caps and joins, fill transparent | `-fx-fill: -color-fg-muted` | `.icon-line`, `.toolbar-icon` |
| Hover, disabled | `-color-fg-default` on hover, `-color-fg-subtle` disabled; every context mirrors the matching rule of the other family | The same | `.button:hover .icon-line`, `.button:hover .toolbar-icon` |
| Drawn size | 16 × 1.2 = 19.2 px (`LINE_SCALE` = `ICON_SCALE` × 24 ÷ 16) | 24 × 0.8 = 19.2 px (`ICON_SCALE`) | `Icons` |
| Used for | The chrome the kit draws: toolbar, tool stripe, tabs, and every action that has a kit glyph | Everything the kit specifies no glyph for: file types, context-menu rows, build-tool and browser brand marks | `Icons`, `FileIcons` |

- **ICON-19 · MUST.** A glyph node carries one family's style class, `icon-line` or `toolbar-icon`, never both.
  - *Why:* a line glyph is colored by its stroke, and any `X .toolbar-icon` fill rule (there are dozens) would paint
    its outline solid. A glyph that moves family moves its CSS with it.
  - *Check (test):* a test builds every line glyph and fails when one also carries `toolbar-icon`.
  - *Reference:* Editora [`ui/Icons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Icons.java) (`line`, `of`),
    [`MenuIconFamilyFxTest.aLineGlyphIsNeverAlsoTaggedAsAFilledOne`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MenuIconFamilyFxTest.java).
- **ICON-20 · MUST.** The same action wears the same glyph wherever it is reached: Save is one floppy on the
  toolbar, in the File menu and in a tab's menu.
  - *Check (test):* a test compares the path data and style class of each action's glyph across the icon classes.
  - *Reference:* Editora [`ui/MenuBarIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarIcons.java) reuses [`Icons`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Icons.java); [`editor/MenuIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/MenuIcons.java) (the editor package may not
    depend on `ui`) copies each twin's family and path data verbatim, held by
    [`MenuIconFamilyFxTest.everySharedActionUsesTheSameGlyphInBothIconSets`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MenuIconFamilyFxTest.java).
- **ICON-23 · SHOULD.** A file's icon comes from a pure function from file name to icon key, unit-tested without the
  toolkit, and any type it does not know gets the generic document glyph, so a new type never regresses the look.
  - *Check (test):* a unit test resolves names to keys, an unknown one to the generic key.
  - *Reference:* Editora [`ui/FileIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FileIcons.java): `iconKeyFor(name)` resolves the key, `forFileName` turns it into a
    node; brand logos from Simple Icons, category glyphs (image, archive, PDF, table, lock, JSON, settings) from
    Material. [`FileIconsTest.unknownAndNullFallBackToGeneric`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FileIconsTest.java).
- **ICON-24 · MUST.** Every glyph set and font the app ships is credited in `NOTICE` with its license.
  - *Check (code):* each icon source named in the icon classes and each family under `fonts/` has an entry in
    `NOTICE`.
  - *Reference:* Editora [`NOTICE`](https://github.com/adriandeleon/Editora/blob/master/NOTICE): Material Design Icons (Apache-2.0), Simple Icons (CC0; the logos stay their
    owners' trademarks), Inter and the monospace faces (OFL), and the glyph sets inside the bundled Symbols Nerd
    Font, Octicons and Seti UI (MIT) among them.

An icon-only control gets its tooltip and its accessible name from one helper (`Icons.button`,
`Icons.toolbarButton`, `Icons.name`): [TBAR-01](../toolbars-and-tooltips/#tbar-01).

### In the apps

| App | Icons | Size |
|---|---|---|
| Editora | Both families, [`ui/Icons`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Icons.java), [`FileIcons`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FileIcons.java), [`MenuBarIcons`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarIcons.java), [`editor/MenuIcons`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/MenuIcons.java) | 19.2 px on the toolbar and in menus |
| Torrenta | Both families, copied from Editora as [`Icons.Glyph`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Icons.java), which knows its box and resizes with `at(px)`; the toolbar is all line glyphs (stroke 1.5, `-torrenta-icon`) | 17 px toolbar, 16 px menu and tab (`MENU_SIZE`), 13 px sidebar |
| Termina | Material filled, [`ui/MenuIcons`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/MenuIcons.java), colored by `.menu-icon` (`-color-fg-muted`; `-color-fg-default` focused; subtle and half opacity disabled) | 24 × 0.7 = 16.8 px, menus only |
| Mirada | Hand-drawn stroked paths on a 24-unit grid, two-unit strokes, round caps, in GNOME's symbolic style, so nothing carries a license; `.icon` strokes `-color-fg-default` | 16 px, centered in a 16 px box |
| Modula | [`Glyphs`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/Glyphs.java): the transport symbols (tune, seek, star) as shapes, because the characters are missing from most faces and render differently on every platform | 11 px |
| nux | No in-window icons; the tray icon is rendered as a bitmap by severity ([`TrayIconRenderer`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/tray/TrayIconRenderer.java)) | Tray only |
