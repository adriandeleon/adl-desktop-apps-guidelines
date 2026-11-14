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
| Root size | 14 px at the default zoom, the AtlantaFX theme's root size, scaled by the UI zoom ([WIN-12](../window-shell/#win-12)); a popup sets its own size from that one value, so an owner's font never leaks into it ([MENU-16](../menus/#menu-16)) | `MainMenuBar.UI_FONT_SIZE` |
| How it is attached | A scene stylesheet (`ui-font.css`, one `.root` rule whose `-fx-font-family` names Inter) on every window's scene, dialogs and popups included | `App.installUiFont` |
| Monospace | JetBrains Mono by default; Cascadia Code, Fira Code, IBM Plex Mono and Source Code Pro are bundled as editor choices | `Fonts.DEFAULT`, `Fonts.BUNDLED` |

- **ICON-01 · MUST.** Inter is attached by a *scene* stylesheet on every window's scene, dialogs, popups and
  tooltips included, not by a rule in the app stylesheet.
  - *Why:* dialogs, the Settings window, the palette, context menus and tooltips each live in a scene of their own
    that does not share `app.css`, and a scene sheet is re-applied cleanly when the theme switches at run time
    (`setUserAgentStylesheet`). AtlantaFX neither bundles nor names Inter, and JavaFX does not fall through a
    font-family list, so without the sheet the whole interface renders in the platform's "System" face.
  - *Check (code):* every window's scene gets the font sheet (Editora's `ui-font.css`): a listener on
    `Window.getWindows()` adds it to each window's scene, and to a new scene when the window's scene changes, or every
    window and dialog the app builds adds it itself, none left out. A popup or a tooltip needs no call of its own:
    when JavaFX shows one, it gives it the scene stylesheets of the window it is shown from
    (`PopupWindow.applyStylesheetFromOwner`). No `.root` rule in the app stylesheet (Editora's `app.css`) sets
    `-fx-font-family`.
  - *Reference:* Editora [`App.installUiFont`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java), a listener on `Window.getWindows()`, and [`styles/ui-font.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/ui-font.css); the app
    template's [`ui/Themes.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Themes.java) (`installUiFont`, `hookUiFont`) and Mirada's [`ui/Fonts.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Fonts.java) (`installSheet`) do the same.
    Termina and Torrenta carry the same sheet with no listener: each window and dialog adds it by calling
    `Fonts.installUiFont`, about forty times in Torrenta. Termina doesn't meet the rule yet: its helper is called
    for seven windows and [`ui/Confirm.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Confirm.java) adds the sheet to its questions, but four dialogs get none: the two
    alerts and the rename-tab `TextInputDialog` built in [`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java), and the `TextInputDialog` in
    [`ui/SettingsWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SettingsWindow.java).
    Modula doesn't yet: the `.root` rule of its [`modula.css`](https://github.com/adriandeleon/Modula/blob/master/src/main/resources/com/modula/modula.css) sets IBM Plex Mono for the whole window.
- **ICON-02 · MUST.** The app bundles Inter's four faces and registers them before any CSS is applied; it never
  maps the platform's own UI font.
  - *Why:* an earlier macOS-only sheet used San Francisco, which JavaFX faux-bolds; Inter has a real bold on every
    platform.
  - *Check (code):* `Inter-Regular`, `Inter-Bold`, `Inter-Italic` and `Inter-BoldItalic` `.ttf` are under the app's
    `fonts/inter/` with their `OFL.txt`, and `Font.loadFont` runs on them before the first window is shown.
  - *Reference:* Editora [`src/main/resources/com/editora/fonts/inter/`](https://github.com/adriandeleon/Editora/tree/master/src/main/resources/com/editora/fonts/inter), [`ui/Fonts.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Fonts.java) (`loadForFirstPaint`,
    called from [`App`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java)). Termina and Torrenta bundle the same four faces. Modula doesn't yet: its
    [`fonts/`](https://github.com/adriandeleon/Modula/tree/master/src/main/resources/com/modula/fonts) holds IBM Plex Mono only.

Modula sets everything in IBM Plex Mono today. Its readings may stay monospace, as content; Inter on its menus,
settings and dialogs is a gap ([Gaps per app](../family/gaps/)).

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
  - *Reference:* Termina [`styles/`](https://github.com/adriandeleon/Termina/tree/master/src/main/resources/com/termina/styles) and the app template's [`styles/`](https://github.com/adriandeleon/adl-desktop-app-template/tree/master/src/main/resources/com/example/app/styles), whose two files match Editora's. Torrenta's
    `editora-dark.css` matches too; its [`editora-light.css`](https://github.com/adriandeleon/torrenta/blob/master/src/main/resources/com/torrenta/styles/editora-light.css) still has the earlier `-color-accent-fg`,
    `-color-warning-fg` and `-color-success-fg`, which Editora has since darkened.
- **ICON-06 · SHOULD.** Brace, the palette's periwinkle for the keyboard (chord chips, the menus' chord column), is
  one token on `.root` (Editora's `-state-key`): a `ladder()` over `-color-bg-default` that picks a deep ink on a
  light ground and a lighter periwinkle the darker the ground gets, and reads at 4.5:1 or more on every bundled
  theme's default and subtle surfaces.
  - *Why:* Brace has no AtlantaFX role, so it has to be a literal.
  - *Check (code):* the token is a `ladder()` of `-color-bg-default`, and the color it resolves to on each bundled
    theme's default and subtle grounds is 4.5:1 or more against that ground. A contrast test that resolves the
    ladder against every bundled theme's grounds is the surest evidence.
  - *Reference:* Editora [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) (`.root`), [`StyleContrastTest.theKeyboardPeriwinkleReadsOnEveryBundledAppTheme`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java).

## State colors

A color is a meaning, named once on `.root` and referenced everywhere. The same state wears the same color in a
tab, a status segment, a tree row, a picker and a Settings row.

| Token | Chains to | Meaning | Where it appears |
|---|---|---|---|
| `-state-amber` | `-color-warning-fg` | Not durable yet, a warning, or an update available in About | An unsaved tab, a read-only file, a narrowed view, a snapshot build; warnings in the echo area and the Message Log; "Update available" in About ([ABOUT-10](../templates/about/#about-10)) |
| `-state-red` | `-color-danger-fg` | Broken | Errors in the echo area and the Message Log, breakpoints, a recording |
| `-state-green` | `-color-success-fg` | Verified | Found, added, passing, running |
| `-state-accent` | `-color-accent-fg` | The app is offering something | An update, a link, the current branch, a selected row's bar |
| `-state-olive`, `-state-violet` | A ladder of the ground | Git only: untracked, renamed | The Project tree and tabs, the Map's structure columns |
| `-state-key` | A ladder of the ground | The keyboard, and nothing else | Chord chips, the menu chord column, brace matching |
| `-state-sel` | `-color-accent-subtle` | The selected overlay row | The palette, pickers, the Message Log (about a 13 % accent wash) |

Each of the first four also has a `-bg` (the role's `-subtle`) and a `-hover` (the role's `-muted`) variant, so a
pill, a row tint and a hover state come from the same place. `.state-pill` is the shape (bold, radius 999, padding
1 × 8); the color variant beside it carries the meaning.

- **ICON-07 · MUST.** Each state color is named once, as a token on `.root` (Editora's `-state-*`) that chains to
  one of the theme's roles (or a `ladder()` of its ground), and component rules use the token.
  - *Check (code):* each state color has one token (Editora's `-state-*`), declared once, in a `.root` block of the
    app stylesheet, as a `-color-*` role or a `ladder()` of the ground. A component rule that colors one of those
    states uses the token: none names the role behind it (`-color-danger-fg` for an error) or writes the ladder
    out again.
  - *Reference:* the app template's [`styles/app.css`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/resources/com/example/app/styles/app.css) (`.root`), held by
    [`StyleContrastTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/StyleContrastTest.java) (`theStateTokensAreDeclaredOnceAtTheTopAndChainToARole`, and `severityColorsComeFromTheStateTokens`,
    which fails a component rule that names a danger, warning or success role). Termina meets it too: its
    [`styles/app.css`](https://github.com/adriandeleon/Termina/blob/master/src/main/resources/com/termina/styles/app.css) declares `-state-red`, `-state-amber` and `-state-green` on `.root`, and no component rule of
    its stylesheets names the role behind one. The other five apps don't yet. Editora's [`styles/app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css)
    declares its tokens the same way (`.root`), but Editora doesn't hold the last clause: 79 declarations in that
    file's component rules name `-color-danger-fg`, `-color-warning-fg` or `-color-success-fg`
    directly, errors among them (`.crontab-error`, `.md-math-error`). Torrenta's tokens are on `.root` too
    (`-torrenta-*`), and two of its component rules write out the ladder of `-torrenta-up` again
    ([`styles/app.css`](https://github.com/adriandeleon/torrenta/blob/master/src/main/resources/com/torrenta/styles/app.css), `.speed-graph-up`, `.speed-graph-legend-up`). Torrenta doesn't hold the last clause either:
    24 declarations in that file's component rules and five in `add-dialog.css` name `-color-danger-fg`,
    `-color-warning-fg` or `-color-success-fg` directly (`.port-dot.port-down`, `.add-fetch-failed`), not the
    `-torrenta-error`, `-torrenta-stall` and `-torrenta-done` tokens that chain to them. Mirada and nux have no
    token for a state (Mirada's one `-state-*` token is `-state-key`, the keyboard's): Mirada's [`styles/mirada.css`](https://github.com/adriandeleon/Mirada/blob/main/src/main/resources/com/mirada/styles/mirada.css) redefines the roles themselves on `.root`, as ladders, and four of
    its component rules name `-color-danger-fg` or `-color-warning-fg` (`.status-echo-error`, `.status-echo-warn`
    and the Message Log's two); nux's [`nux.css`](https://github.com/adriandeleon/nux/blob/master/src/main/resources/com/nux/nux.css) has no `.root` block, and three of its rules name
    `-color-warning-fg` or `-color-danger-fg` (`.on-battery-note`, `.settings-problem`, `.detail-warn`). Modula's
    [`modula.css`](https://github.com/adriandeleon/Modula/blob/master/src/main/resources/com/modula/modula.css) has tokens its rules use (`-lock`, `-fault`), set as fixed hexes on `.root` and again on
    `.root.daylight`, chained to no role.
- **ICON-08 · MUST.** App stylesheets take their colors from AtlantaFX `-color-*` tokens, or from tokens the app
  builds on them; no component rule carries a fixed color, whatever its spelling: a hex, an `rgb()`, `rgba()` or
  `hsb()` value, or a named color such as `white`. A fixed color may stand only in a token's definition, on `.root`
  or in a scoped block that sets `-color-*` tokens, and only where the theme has no role to build on: a scrim's or
  a shadow's color, a color drawn over an image or a canvas and not on the theme's ground, or a color inside a
  `ladder()` of the ground ([ICON-13](#icon-13)). The ground, ink or accent of the app's own windows given there as
  a fixed color, in place of the theme's role, fails this rule; a state color given so is [ICON-07](#icon-07)'s
  failure and is not counted here again. `transparent` is not a color.
  - *Why:* a fixed color suits one theme; the roles track every theme for free.
  - *Check (code):* every color in a component rule of the app's stylesheets is an AtlantaFX `-color-*` role or a
    token, and a fixed color stands only where a token is defined, in a `.root` block or in a scoped block that
    sets `-color-*` tokens: as the plain value of a token for a scrim, a shadow or what is drawn over an image or a
    canvas (an `rgba()` of black, say), or inside a `ladder()` of the ground. A token for the ground, ink or
    accent of the app's own windows whose value is a fixed color and no role fails; a state color's token with no role behind it is [ICON-07](#icon-07)'s to judge, not this
    rule's. A fixed color is a hex
    (`grep -nE '#[0-9a-fA-F]{3,8}\b'` over those stylesheets lists them), an `rgb()`, `rgba()`, `hsb()` or `hsba()`
    value, or a named color such as `white`; `transparent` is not one. No component rule holds one, whichever property
    it sets (a `-fx-*-color`, a `-fx-fill`, an effect's color), inside a `ladder()` or not. A test that fails a fixed
    color outside the token block is the surest evidence.
  - *Reference:* Termina's [`AppCssColorsTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/AppCssColorsTest.java) (`componentRulesUseTokensNotLiteralColours`) and Mirada's
    [`StyleContrastTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/StyleContrastTest.java) (`noRuleAfterTheTokenBlockHoldsAFixedColour`) fail a fixed color outside the `.root` block:
    a hex, an `rgb()` or an `hsb()` value, a shadow's color included, and in Mirada's a named color too. Both apps
    keep the scrim behind an overlay and their shadows' colors as tokens on `.root`, and so does the app template:
    `-scrim` and `-shadow` on `.root` in its [`styles/app.css`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/resources/com/example/app/styles/app.css), used by `.overlay-backdrop` and the cards' shadows, with no test that
    holds it. Editora's
    [`StyleContrastTest.severityAndDebugColoursComeFromTheStateTokens`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java) holds six selectors it names, and Editora
    doesn't yet pass the whole check: `.breakpoint-marker`, `.debug-menu-logpoint`, `.exec-arrow`, `.view-mode-bar`, `.recent-remove`,
    `.personal-note-tooltip-content`, the fold-gutter markers and the default editor and Markdown preview palettes in
    [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) still carry fixed hexes, other rules an `rgba()` (the scrim of `.overlay-backdrop`, the diff and merge
    tints and shadows among them), and `.breakpoint-condition-mark` a fixed `white`. Torrenta doesn't either: `.speed-graph-up` and
    `.speed-graph-legend-up` in its [`styles/app.css`](https://github.com/adriandeleon/torrenta/blob/master/src/main/resources/com/torrenta/styles/app.css) hold a ladder of two hexes, and `.palette-backdrop` and two
    shadows an `rgba()`. Modula and nux write the palette's scrim as an `rgba()` background in a
    component rule, and a shadow's color the same way (`.palette-backdrop` and `.palette-card` in [`modula.css`](https://github.com/adriandeleon/Modula/blob/master/src/main/resources/com/modula/modula.css) and
    [`nux.css`](https://github.com/adriandeleon/nux/blob/master/src/main/resources/com/nux/nux.css)), so neither meets the rule yet; nux also sets `-fx-text-fill: white` on `.status-pill` and `.update-badge`.
- **ICON-09 · MUST.** Readable text uses `-color-fg-muted` or stronger, which is 4.5:1 on the default, subtle and
  overlay grounds in both flagship themes, Editora Light and Editora Dark: a line of UI text is `-color-fg-default`
  and secondary text `-color-fg-muted`. `-color-fg-subtle` (2.7:1 to 3.9:1, under 3:1 on Editora Light's subtle and
  inset grounds) is for disabled or decorative text only. An app whose default light and dark themes are another pair
  is held to the same on that pair. A test holds it.
  - *Check (test):* a contrast test computes muted ink on the default, subtle and overlay grounds of both flagship
    themes (Editora Light and Editora Dark), or of the app's own default light and dark themes where it ships another
    pair, and finds 4.5:1 or more; and it walks every rule of the app's stylesheets: it fails a rule that sets a text
    fill (`-fx-text-fill`, or `-fx-fill` on text) to `-color-fg-subtle` unless its selector is on a list the test
    names, of disabled and decorative selectors only. A test that checks a list of readable selectors instead passes
    every selector it doesn't name.
  - *Reference:* only the app template's test walks every rule. Editora's
    [`StyleContrastTest.textThatMustBeReadUsesTheMutedRoleNotSubtle`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java) computes the ratios and checks six selectors it names (the palette's
    and the switcher's hints, an unbound shortcut, the line numbers of the notes and structure trees, the blame
    date), so it passes while `.encryption-locked-hint` and `.pom-version-unknown` in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) set text a
    person reads in `-color-fg-subtle`. The app template's test of the same name
    ([`StyleContrastTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/StyleContrastTest.java)) walks every rule of its `app.css` and both themes and fails a text fill in
    `-color-fg-subtle` on any selector but the disabled and decorative ones it lists (`SUBTLE_TEXT`), and computes
    the muted role's ratio on the grounds of both themes. Mirada's [`StyleContrastTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/StyleContrastTest.java) has no
    test for this rule, and Termina, Torrenta, Modula and nux have no contrast test of their stylesheets.
- **ICON-10 · MUST.** Text in a role's tint (the theme's `-color-<role>-fg`, for the accent, success, warning and
  danger roles) reaches 4.5:1 on that role's subtle fill (`-color-<role>-subtle`) and on the default and subtle
  grounds (`-color-bg-default`, `-color-bg-subtle`), in both flagship themes, Editora Light and Editora Dark, or, in
  an app whose default light and dark themes are another pair, in that pair. A test holds it.
  - *Check (test):* a contrast test computes each role's `-fg` on its `-subtle`, on `-color-bg-subtle` and on
    `-color-bg-default`, in both flagship themes (Editora Light and Editora Dark), or in the app's own default light
    and dark themes where it ships another pair, and finds 4.5:1 or more.
  - *Reference:* Editora [`StyleContrastTest.lightTintedTextReachesAaOnItsOwnGroundAndOnTheSubtleSurface`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java),
    `darkTintedTextStaysAa`. Mirada's [`StyleContrastTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/StyleContrastTest.java) (`tintedTextReachesAaOnItsOwnFillAndOnBothGrounds`) holds
    it on Cupertino Light and Cupertino Dark, the pair it ships.
- **ICON-11 · MUST.** Ink on an emphasis fill is `-color-fg-emphasis`, never a fixed white: the token is white in the
  light themes and a dark ink in the dark ones, 4.5:1 or more on the emphasis fill of the accent, success, warning and
  danger roles in the two themes [ICON-09](#icon-09) names. A test holds it.
  - *Why:* white on the dark accent is 1.68:1.
  - *Check (test):* a contrast test computes `-color-fg-emphasis` on the `-emphasis` fill of the accent, success,
    warning and danger roles, in both flagship themes (Editora Light and Editora Dark) or in the app's own default
    light and dark themes where it ships another pair, and finds 4.5:1 or more; and the rules that paint on an
    emphasis fill use it.
  - *Reference:* Editora [`StyleContrastTest.inkOnAnEmphasisFillIsTheThemesOnEmphasisColour`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java), and Mirada's test of
    the same name ([`StyleContrastTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/StyleContrastTest.java)), on Cupertino Light and Cupertino Dark: each holds 4.5:1.
- **ICON-12 · MUST.** One focus ring color, the theme's `-color-accent-emphasis`, named once on `.root` (Editora's
  `-focus-ring`) and drawn by the `:focus-visible` block in the app stylesheet ([KBD-16](../keyboard/#kbd-16)), at 3:1
  or better on every surface: the default, subtle, inset and overlay grounds of the two themes [ICON-09](#icon-09)
  names (see [Keyboard first](../keyboard/)). A test holds it.
  - *Check (test):* a test reads the ring's token from `.root` (Editora's `-focus-ring`) and computes it on the
    default, subtle, inset and overlay grounds of both flagship themes (Editora Light and Editora Dark), or of the
    app's own default light and dark themes where it ships another pair, and finds 3:1 or more.
  - *Reference:* Editora [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) (*Keyboard focus*),
    [`StyleContrastTest.theFocusRingIsAtLeastThreeToOneOnEverySurface`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java).
- **ICON-13 · SHOULD.** A state color the AtlantaFX theme has no role for (Editora's Git olive and violet) is a
  `ladder()` of `-color-bg-default`, never one fixed hex for light themes and another for dark. Brace, the
  periwinkle, is [ICON-06](#icon-06).
  - *Why:* the old fixed light hexes read at 3.2:1 on Editora Dark.
  - *Check (code):* each such token is declared as a `ladder()` of `-color-bg-default`; none is a fixed hex, or a
    pair of hexes switched by theme. A contrast test that resolves each ladder on every bundled theme's ground is
    the surest evidence.
  - *Reference:* Editora [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) (`-state-olive`, `-state-violet`, `-state-key`),
    [`StyleContrastTest.theGitOliveAndVioletFollowTheAppThemesGround`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java).
- **ICON-14 · SHOULD.** The contrast tests are pure: they read the stylesheets and do the WCAG arithmetic without
  starting the toolkit, so they run with the unit tests on every OS.
  - *Why:* a test that starts the toolkit is an FX test, tagged and run apart from the unit tests
    ([QUAL-06](../quality/#qual-06)); a pure one fails the plain unit run on every OS, the first time a color
    changes.
  - *Check (code):* every test class that computes a contrast ratio reads the app's `.css` resources as text and
    starts no toolkit: none is an FX test.
  - *Reference:* the app template's [`StyleContrastTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/StyleContrastTest.java) and Mirada's
    [`StyleContrastTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/StyleContrastTest.java): each reads the stylesheets as text and uses `javafx.scene.paint.Color` for the arithmetic
    alone. The template's key color is held there too (`theKeyColorReadsOnBothThemesGrounds`), and no FX test of its computes a contrast. Mirada's [`AccentTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/AccentTest.java) is pure too, over the accent it derives from the system's, and so is Termina's
    [`ThemeTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/ThemeTest.java), which holds the colors of its terminal schemes and not the chrome's stylesheet. Editora's
    [`StyleContrastTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StyleContrastTest.java) is pure as well, but Editora doesn't meet the rule yet: FX tests compute contrast ratios on
    rendered nodes too, [`ChordChipThemeFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ChordChipThemeFxTest.java), [`DebugValuePopupThemeFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/DebugValuePopupThemeFxTest.java) and
    [`SettingsFrameFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/SettingsFrameFxTest.java) among them.

## Themes

- **ICON-15 · MUST.** The app has light and dark themes and switches between them at run time, without a restart.
  - *Check (code):* the app has a light theme and a dark one, and picking a theme calls
    `Application.setUserAgentStylesheet` in the running app.
  - *Reference:* Editora [`ui/Themes.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Themes.java) (`applyAppTheme`).
- **ICON-16 · MUST.** The theme setting offers "follow the system": a choice that applies the light or dark theme
  to match the system's color scheme, and changes with it.
  - *Check (code):* the theme setting has a system value, the place where the user picks a theme lists it, and
    while it is chosen a listener on `Platform.getPreferences().colorSchemeProperty()` re-applies the theme.
  - *Reference:* Mirada [`settings/Settings.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/settings/Settings.java) (`ThemeChoice.SYSTEM`), [`ui/Theme.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Theme.java); nux [`config/Advanced.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/config/Advanced.java)
    (`THEME_SYSTEM`), [`ui/Theme.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/Theme.java); Termina [`ui/Themes.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Themes.java) (`SYSTEM_ID`, `followSystem`), with the
    listener in [`ui/WindowManager.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/WindowManager.java); the app template's [`ui/Themes.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Themes.java) (`ThemeChoice.SYSTEM`). Each lists
    the choice in its Settings. Editora, Torrenta and Modula don't offer it yet: Editora's and Torrenta's pickers
    list named themes only ([`ui/Themes.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Themes.java), Torrenta's [`ui/Theme.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Theme.java)), and Modula's theme is one on/off
    setting, `daylight` ([`config/Settings.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/config/Settings.java)).
- **ICON-17 · MUST.** A theme name the app does not know falls back to the first-run default theme.
  - *Check (code):* the lookup from a saved name to a theme ends in the default, not an exception.
  - *Reference:* Editora [`Themes.themeFor`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Themes.java), falling back to [`Themes.DEFAULT`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Themes.java) (Editora Light).
- **ICON-18 · SHOULD.** The state colors never decorate: in every theme amber means "not durable yet", a warning
  ([WIN-01](../window-shell/#win-01) requires a warning in the echo area in amber) or an update available in About
  ([ABOUT-10](../templates/about/#about-10) asks for it there), red "broken" and green "verified", and nothing is
  colored amber, red or green for any other reason. A theme may change the accent, the ground and the ink, never
  these meanings.
  - *Check (code):* every rule that uses the amber, red or green state token (Editora's `-state-amber`,
    `-state-red` and `-state-green`) marks one of the meanings in the table under [State colors](#state-colors).
  - *Reference:* Editora [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css).

Editora lists 28 app themes: the Caret & Ink pair, AtlantaFX's Primer, Nord, Cupertino and Dracula, and 19
community themes (Army, Autumn, Blacky, Blue, Browny, Fall, Navy, News, Spring, Summer, Winter, Yacht, several with
light and dark variants) vendored unmodified from the MIT-licensed dlsc `atlantafx-themes` collection. User themes
under `<config>/themes/` join the list (`Themes.names()`).

**Editor themes are separate** (`EditorThemes`). The flagship pair carries its own editor stylesheet; every community
theme is served by one `adaptive` editor theme whose syntax palette is expressed in the theme's own `-color-*`
tokens, so it follows whatever ground the theme has.

![Editora's Settings page for themes and fonts](../../assets/shots/editora-themes-fonts.png "Editora's Settings, Appearance: the app theme and the editor theme both on Editora Light, the editor's font and size, and a live preview.")

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

- **ICON-19 · MUST.** In an app whose icons come in two families, one colored by its stroke and one by its fill, a
  glyph node carries the style class of one family, never both (Editora's two are `icon-line` and `toolbar-icon`).
  An app with one icon family, or with no icons in its window, has nothing to mix.
  - *Why:* a line glyph is colored by its stroke, and any `X .toolbar-icon` fill rule (there are dozens) would paint
    its outline solid. A glyph that moves family moves its CSS with it.
  - *Check (code):* the method that builds a line glyph adds the line family's class alone, the one that builds a
    filled glyph adds the filled family's alone (Editora's `Icons.line` and `Icons.of`), and no other code adds
    the second class to a glyph node. A test that builds every glyph and fails when one carries both classes is the
    surest evidence.
  - *Reference:* Editora [`ui/Icons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Icons.java) (`line`, `of`) and [`editor/MenuIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/MenuIcons.java), whose glyphs
    [`MenuIconFamilyFxTest.aLineGlyphIsNeverAlsoTaggedAsAFilledOne`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MenuIconFamilyFxTest.java) holds. Torrenta's [`IconsTest`](https://github.com/adriandeleon/torrenta/blob/master/src/test/java/com/torrenta/ui/IconsTest.java)
    (`everyGlyphIsAStyledScaledPath`) builds every glyph and fails one that carries both classes or neither.
    Termina, Mirada and Modula draw one family each.
- **ICON-20 · MUST.** The same action wears the same glyph wherever it is reached: Save is one floppy on the
  toolbar, in the File menu and in a tab's menu.
  - *Check (code):* wherever an action is drawn (a toolbar button, a menu row, a tab's menu), its glyph comes from
    one icon class or one lookup keyed by the command. Where a second icon class holds a copy of its own, the copy
    has the same path data and style class. A test that compares the path data and style class of each action's
    glyph across the icon classes is the surest evidence. An app that draws no glyph anywhere has nothing to
    compare and passes.
  - *Reference:* Editora [`ui/MenuBarIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarIcons.java) reuses [`Icons`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Icons.java); [`editor/MenuIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/MenuIcons.java) (the editor package may not
    depend on `ui`) copies each twin's family and path data verbatim, held by
    [`MenuIconFamilyFxTest.everySharedActionUsesTheSameGlyphInBothIconSets`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MenuIconFamilyFxTest.java). Mirada gives a command's menu row
    and its button one glyph from one lookup ([`ui/Icons.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Icons.java), `forCommand`).
- **ICON-23 · SHOULD.** In an app that shows files with an icon each (a project tree, file tabs, a list of files),
  a file's icon comes from a pure function from file name to icon key, unit-tested without the toolkit, and any
  type it does not know gets the generic document glyph, so a new type never regresses the look.
  - *Check (test):* a unit test resolves names to keys, an unknown one to the generic key.
  - *Reference:* Editora [`ui/FileIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FileIcons.java): `iconKeyFor(name)` resolves the key, `forFileName` turns it into a
    node; brand logos from Simple Icons, category glyphs (image, archive, PDF, table, lock, JSON, settings) from
    Material. [`FileIconsTest.unknownAndNullFallBackToGeneric`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FileIconsTest.java).
- **ICON-24 · MUST.** Every glyph set and font the app ships is credited in `NOTICE` with its license.
  - *Check (code):* each icon source named in the icon classes and each family under `fonts/` has an entry in
    `NOTICE`. An app that ships no glyph set and no font has nothing to credit here.
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
