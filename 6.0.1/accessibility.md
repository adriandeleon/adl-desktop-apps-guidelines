# Accessibility

> What a screen reader, a keyboard-only user and a user who turns motion off need from every app, and where each is a rule.

Pauta 6.0.1 (2026-11-11). The page with its screenshots and mockups: https://pauta-project.dev/6.0.1/accessibility/.
Every rule of the edition: https://pauta-project.dev/6.0.1/llms-full.txt.

An app that needs a mouse, good color vision or steady eyes shuts people out. Much of what keeps the apps usable
without them is already a rule on the page it belongs to; this page lists those and adds what a screen reader and the
OS's accessibility settings need.

## Where JavaFX stands

JavaFX hands its controls to the screen reader on Windows (UI Automation, which Narrator reads) and on macOS
(VoiceOver). On Linux it has no bridge to the desktop's accessibility bus, so Orca reads nothing. That is JavaFX's
limit, not the app's, and one of the two accessibility differences between OSes; the other is the high-contrast
theme, which only Windows' high-contrast mode asks for ([ACC-09](https://pauta-project.dev/6.0.1/accessibility/#acc-09)). Both are rows of
[Same on every OS](https://pauta-project.dev/6.0.1/same-on-every-os/#where-the-oss-way-wins).

The standard controls (`Button`, `Label`, `TextField`, `CheckBox`, `ListView`, `TreeView`) announce their name, role
and state on their own. What the app builds itself does not: a row drawn from an icon and two labels, a status-bar
segment that acts as a button, a map painted on a `Canvas`. The rules below are about those.

The menus have no mnemonics (`_File`): `Alt` and `Option` chords belong to the keymaps (`M-x` in Emacs). The keyboard
reaches every menu command through the Command Palette ([KBD-05](https://pauta-project.dev/6.0.1/keyboard/#kbd-05)), which lists them all
([PAL-02](https://pauta-project.dev/6.0.1/templates/command-palette/#pal-02)).

## Covered on other pages

- **Keyboard.** Every control is reachable with Tab and works with Space or Enter
  ([KBD-15](https://pauta-project.dev/6.0.1/keyboard/#kbd-15)); toolbar buttons stay out of the Tab order because their commands are reached
  another way ([TBAR-02](https://pauta-project.dev/6.0.1/toolbars-and-tooltips/#tbar-02)). Closing an overlay or a panel gives focus back where it
  was ([PAL-07](https://pauta-project.dev/6.0.1/templates/command-palette/#pal-07), [QOPEN-07](https://pauta-project.dev/6.0.1/templates/quick-open/#qopen-07),
  [MENU-08](https://pauta-project.dev/6.0.1/menus/#menu-08), [TABS-19](https://pauta-project.dev/6.0.1/tabs-and-panels/#tabs-19)).
- **Focus ring.** One ring, drawn on every control ([KBD-16](https://pauta-project.dev/6.0.1/keyboard/#kbd-16)), at 3:1 or better on every
  surface ([ICON-12](https://pauta-project.dev/6.0.1/icons-and-color/#icon-12)).
- **Names.** Every icon-only button gets its name from one helper ([TBAR-01](https://pauta-project.dev/6.0.1/toolbars-and-tooltips/#tbar-01)); an
  on/off row is a switch with the `TOGGLE_BUTTON` role ([KBD-18](https://pauta-project.dev/6.0.1/keyboard/#kbd-18)).
- **Contrast.** Readable text at 4.5:1 ([ICON-09](https://pauta-project.dev/6.0.1/icons-and-color/#icon-09),
  [ICON-10](https://pauta-project.dev/6.0.1/icons-and-color/#icon-10), [ICON-11](https://pauta-project.dev/6.0.1/icons-and-color/#icon-11)), each held by a contrast test,
  and those tests run without the toolkit ([ICON-14](https://pauta-project.dev/6.0.1/icons-and-color/#icon-14)).
- **Size and theme.** A UI zoom scales the whole chrome ([WIN-12](https://pauta-project.dev/6.0.1/window-shell/#win-12)) and the content zooms
  from the keyboard ([WIN-09](https://pauta-project.dev/6.0.1/window-shell/#win-09)); the light or dark theme can follow the system
  ([ICON-16](https://pauta-project.dev/6.0.1/icons-and-color/#icon-16)).

## Rules

- **ACC-01 · MUST.** Every control a person can reach with Tab or the mouse has an accessible name: its own text, a
  `Label` whose `labelFor` is the control, or `setAccessibleText`. A row drawn from a graphic (a `CustomMenuItem`, a
  list cell that lays out its own nodes) carries its text too. A test holds it.
  - *Why:* a screen reader announces an unnamed control as "button", or says nothing.
  - *Check (test):* an FX test opens each window and dialog and fails on a control (a button, a toggle, a field, a
    combo box or any other `Control` a person can focus or click, in the Tab order or out of it) that has no text,
    no accessible text and no label pointing at it, and on a list cell or menu row that reads as nothing. JavaFX
    names a `CustomMenuItem` row from its content's accessible text, and a cell from its text or its graphic's, so a
    row that lays out its own nodes sets `setAccessibleText` on them.
  - *Reference:* Editora names its controls area by area
    ([`NamedControlsFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/NamedControlsFxTest.java)),
    and sets each row's text on the macOS system menu bar. Its in-window command rows, each a `CustomMenuItem` that draws an icon,
    a title and a chord ([`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MainMenuBar.java)), carry no text and no accessible text yet;
    its submenus keep their own. The app template has the test that sweeps every window for every control:
    [`NamedControlsFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/ui/NamedControlsFxTest.java) (`everyControlInEveryWindowHasAName`, and
    `everyMenuRowReadsAsItsTitleAndWearsAGlyph` for the menu rows, which [`AppMenus.inWindowRow`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/AppMenus.java) names from their title
    and chord) opens the main window and its panels, the find bars, the Message Log, Settings, About, the Pauta
    window, the Debug Log and Report a Problem, the palette, the switcher, a question and a prompt. Termina's [`IconOnlyButtonsFxTest.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/test/java/com/termina/ui/IconOnlyButtonsFxTest.java) comes nearest: it opens the main window, the menus, Settings and About and
    fails an icon-only button with no name, and no other kind of control. Torrenta's one call to
    `setAccessibleText` is in a helper ([`ui/Icons.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/Icons.java), `name`) that names every button of its main toolbar and the
    Search view's Clear button, and no other control; Modula never calls it.
- **ACC-02 · SHOULD.** A control the app builds from panes or draws itself says what it is and does what its role
  offers: `setAccessibleRole` with the role it acts as (`BUTTON`, `TOGGLE_BUTTON`, `LIST_VIEW`, `TREE_ITEM`), its
  state answered from `queryAccessibleAttribute` (selected, expanded, checked), `notifyAccessibleAttributeChanged`
  when the state changes, and the role's actions (`FIRE`, `EXPAND`, `COLLAPSE`) handled in `executeAccessibleAction`.
  - *Why:* without a role, a screen reader can't tell a status-bar segment that opens a picker from a label; and it
    presses a control through its action, not a mouse click, so a `BUTTON` that ignores `FIRE` can be found but not
    used.
  - *Check (code):* every `Pane`, `Region`, `Label` or `Canvas` that handles a click or a key sets an accessible
    role and overrides `executeAccessibleAction` for that role's actions.
  - *Reference:* Editora [`ui/SettingSwitch.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/SettingSwitch.java) (the `TOGGLE_BUTTON` role; it handles `FIRE`
    only) and [`ui/MapAccessibleRows.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MapAccessibleRows.java) (`FIRE`, `EXPAND` and `COLLAPSE` on each row). Its status-bar segments ([`ui/StatusBar.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/StatusBar.java)) take the
    `BUTTON` role but don't handle `FIRE` yet.
- **ACC-03 · SHOULD.** An app that paints content on a `Canvas` (a map, a strip of images, a terminal grid) gives it
  to the screen reader: an accessible text that sums it up and, where a person moves through items in it, one
  accessible node for each item on screen.
  - *Check (code):* the canvas, or the node that stands for it, sets an accessible text, and where a person moves
    through items it exposes a node with a role and a name for each item on screen. A test that reads the
    accessible text, or the roles and names of those nodes, is the surest evidence.
  - *Reference:* Editora [`ui/MapAccessibleRows.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MapAccessibleRows.java) (the Project Map's rows on screen, as `TREE_ITEM`
    nodes under a `TREE_VIEW`), read by [`MapAccessibleRowsFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/MapAccessibleRowsFxTest.java).
- **ACC-04 · SHOULD.** Motion follows the OS: while `Platform.getPreferences().isReducedMotion()` is true, an
  animation jumps to its end, and a change to the setting applies at once.
  - *Why:* sliding and fading can make a person dizzy or sick, and they turned motion off in the OS for that reason.
  - *Check (code):* every `Transition`, `Timeline` or `AnimationTimer` that moves, fades or flashes part of the UI
    starts through one helper that reads `reducedMotionProperty()`.
  - *Reference:* no app reads the setting yet. The app template animates nothing, so it has nothing to judge: its
    timelines and pauses are timers that move, fade or flash no part of the UI (the Output sample's lines in
    [`ui/SamplePanels.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/SamplePanels.java), the debounce of [`ui/Debounce.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/Debounce.java), the sync interval and the update check's delay).
    Mirada fades its on-screen controls in and out
    ([`ui/OnScreenControls.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/OnScreenControls.java), a `FadeTransition`), and Editora's Project Map flashes a revealed row for 900 ms
    ([`ui/MapSurface.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MapSurface.java), an `AnimationTimer`); neither reads a motion setting.
- **ACC-05 · SHOULD.** Color is never the only signal: a state shown in color (an error, a changed line, a status)
  also shows a word, a glyph or a shape.
  - *Why:* about one man in twelve can't tell red from green.
  - *Check (by hand):* look at a grayscale screenshot of each window and find every state still told apart.
  - *Reference:* Editora's echo area colors an error and also says what failed ([`ui/StatusBar.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/StatusBar.java); [WIN-01](https://pauta-project.dev/6.0.1/window-shell/#win-01)). The app
    template gives a file's Git status its letter beside the color, on a tab ([`ui/TabHeaders.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/TabHeaders.java); [`TabsAndPanelsFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/ui/TabsAndPanelsFxTest.java),
    `aTabShowsItsGitStatusAsALetter`) and on the file's row in its Documents window ([`ui/SamplePanels.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/SamplePanels.java)).
- **ACC-06 · SHOULD.** In an app whose window has more than one region (the content and at least one panel beside
  it), a command moves focus to the next region, another moves it to the previous one, and every keymap binds
  both.
  - *Why:* Tab walks through every control inside a region; with several panels open, a keyboard user needs a way to
    jump between them.
  - *Check (code):* the two commands are registered and bound in each bundled keymap.
  - *Reference:* the app template's `window.focusNextRegion` and `window.focusPreviousRegion` ([`ui/Commands.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/Commands.java), `focusRegion`
    in [`ui/ToolWindowManager.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/ToolWindowManager.java)), on `F6` and `Shift+F6` in its CUA keymaps and `C-x o` and `C-x S-o` in Emacs, bound in
    every keymap it ships ([`TabsAndPanelsFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/ui/TabsAndPanelsFxTest.java), `theRegionCommandsWalkTheDocumentsAndTheOpenToolWindows`). Editora's `window.other` ("Cycle focus between the editor and tool windows",
    [`ui/WindowCommandRegistrar.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/WindowCommandRegistrar.java)), one command that cycles, bound only in the Emacs keymap (`C-x o`,
    [`keymaps/emacs.json`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/resources/com/editora/keymaps/emacs.json)). `F6`, the Windows convention, is taken in
    every other Editora keymap: CUA and VS Code bind it to `debug.pause`, IntelliJ to `lsp.move` and Sublime to
    `view.toggleSpellCheck`.
- **ACC-07 · SHOULD.** Before a release, a person makes a pass with the screen reader on Windows and on macOS: with
  Narrator and with VoiceOver, open the Command Palette, run a command, and move through Settings, hearing each
  control's name and role. It is a step of its own in `docs/release.md` ([REPO-07](https://pauta-project.dev/6.0.1/repository/#repo-07)): the
  smoke test of [REL-29](https://pauta-project.dev/6.0.1/release/#rel-29) is a CI step, with nobody there to listen.
  - *Check (by hand):* `docs/release.md` has the step, naming Narrator and VoiceOver, and someone made the pass for
    this release. The file settles the first half: with no such step the rule is unmet, whoever listened. The pass
    itself is a person's to record, as a `checked` entry that carries the app's `version`
    ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)).
  - *Reference:* no app yet. No app's `docs/release.md` names either screen reader, and Modula and nux have no
    `docs/release.md`.
- **ACC-08 · SHOULD.** In an overlay list that keeps focus in its text field (the Command Palette, a picker:
  [QOPEN-01](https://pauta-project.dev/6.0.1/templates/quick-open/#qopen-01)), the row the arrow keys select is announced, with its state: the list
  tells the screen reader its focused item moved (`notifyAccessibleAttributeChanged(FOCUS_ITEM)`), and a row that
  can't run says so in its accessible text.
  - *Why:* the arrows move the highlight, not the focus, so a screen reader stays on the text field and reads
    nothing as the user moves through the list.
  - *Check (code):* the code that moves the selection calls
    `notifyAccessibleAttributeChanged(AccessibleAttribute.FOCUS_ITEM)` on the list, the list answers `FOCUS_ITEM`
    with the selected row, and a row that can't run says so in its accessible text.
  - *Reference:* the app template's [`ui/Picker.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/Picker.java), behind its palette and pickers: `select` moves the list's focus
    model and calls `notifyAccessibleAttributeChanged(FOCUS_ITEM)`, and a row's accessible text is its title, its
    keys and, for a row that can't run, the reason. Editora's palette rows are graphics with no text
    ([`ui/CommandPalette.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/CommandPalette.java)).
- **ACC-09 · SHOULD.** In Windows' high-contrast mode the app switches to a high-contrast theme, and back when the
  mode ends: it follows `Platform.getPreferences()`'s `Windows.SPI.HighContrast`.
  - *Why:* JavaFX applies its own high-contrast stylesheet only over its built-in Modena theme, which AtlantaFX
    replaces, so without this the app ignores a setting the person turned on to read the screen at all.
  - *Check (code):* a listener on the preference switches the theme, and the theme list has a high-contrast theme.
  - *Reference:* the app template's [`ui/Themes.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/Themes.java) (`WINDOWS_HIGH_CONTRAST`, a listener on `Platform.getPreferences()` that applies its
    `HIGH_CONTRAST` theme while the mode is on and the chosen one when it ends), held by [`StyleContrastTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/ui/StyleContrastTest.java)
    (`theOsHighContrastModeWinsWhileItIsOn`, `theHighContrastThemeReadsAtSevenToOne`). No app does it yet.
